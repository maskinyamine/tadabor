import { create } from 'zustand';
import * as Location from 'expo-location';

export interface PrayerItem {
  key: string;
  nameAr: string;
  nameFr: string;
  time: string;
  done: boolean;
  next: boolean;
}

interface PrayerState {
  prayers: PrayerItem[];
  city: string;
  country: string;
  hijriDate: string;
  gregorianDate: string;
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
  nextPrayer: PrayerItem | null;
  timeLeft: string;

  fetchPrayers: (force?: boolean) => Promise<void>;
  updateTimeLeft: () => void;
}

// Format the time left from seconds to "Xh Ymin"
const formatTimeLeft = (diffInSeconds: number) => {
  if (diffInSeconds < 0) return '0h 0min';
  const hours = Math.floor(diffInSeconds / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes}min`;
};

// Default fallback city: Paris, France
const DEFAULT_LAT = 48.8566;
const DEFAULT_LON = 2.3522;
const DEFAULT_CITY = 'Paris';
const DEFAULT_COUNTRY = 'France';

const PRAYER_KEYS = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const PRAYER_NAMES_AR: Record<string, string> = {
  Fajr: 'الفجر',
  Sunrise: 'الشروق',
  Dhuhr: 'الظهر',
  Asr: 'العصر',
  Maghrib: 'المغرب',
  Isha: 'العشاء',
};
const PRAYER_NAMES_FR: Record<string, string> = {
  Fajr: 'Fajr',
  Sunrise: 'Sunrise',
  Dhuhr: 'Dhuhr',
  Asr: 'Asr',
  Maghrib: 'Maghrib',
  Isha: 'Isha',
};

export const usePrayerStore = create<PrayerState>((set, get) => ({
  prayers: [],
  city: '',
  country: '',
  hijriDate: '',
  gregorianDate: '',
  isLoading: true,
  isFetching: false,
  error: null,
  nextPrayer: null,
  timeLeft: '',

  fetchPrayers: async (force = false) => {
    const { prayers, isFetching } = get();
    if (!force && (prayers.length > 0 || isFetching)) return;

    set({ isLoading: true, isFetching: true, error: null });
    try {
      let lat = DEFAULT_LAT;
      let lon = DEFAULT_LON;
      let city = DEFAULT_CITY;
      let country = DEFAULT_COUNTRY;

      const { status } = await Location.requestForegroundPermissionsAsync();
      
      let locationFetched = false;

      if (status === 'granted') {
        try {
          const location = await Location.getCurrentPositionAsync({});
          lat = location.coords.latitude;
          lon = location.coords.longitude;
          
          // Reverse geocoding to get city/country
          const geocode = await Location.reverseGeocodeAsync({
            latitude: lat,
            longitude: lon,
          });
          
          if (geocode && geocode.length > 0) {
            city = geocode[0].city || geocode[0].subregion || geocode[0].region || DEFAULT_CITY;
            country = geocode[0].country || DEFAULT_COUNTRY;
            locationFetched = true;
          }
        } catch (locationError) {
          console.warn("Could not fetch GPS location, trying IP fallback.", locationError);
        }
      } else {
        console.warn("Location permission denied, trying IP fallback.");
      }

      // ── IP-based fallback if GPS failed or denied ──
      if (!locationFetched) {
        try {
          const ipRes = await fetch('http://ip-api.com/json/');
          if (ipRes.ok) {
            const ipData = await ipRes.json();
            if (ipData && ipData.lat && ipData.lon) {
              lat = ipData.lat;
              lon = ipData.lon;
              city = ipData.city || ipData.regionName || DEFAULT_CITY;
              country = ipData.country || DEFAULT_COUNTRY;
              locationFetched = true;
            }
          }
        } catch (ipError) {
          console.warn("IP location fallback failed, using default Paris.", ipError);
        }
      }

      set({ city, country });

      // Fetch timings from Aladhan API (Method 3: Muslim World League)
      const date = new Date();
      const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
      
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${formattedDate}?latitude=${lat}&longitude=${lon}&method=3`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch prayer times');
      }

      const data = await response.json();
      const timings = data.data.timings;
      const apiDate = data.data.date;

      // Format Hijri and Gregorian dates from API
      const hijriDate = `${apiDate.hijri.day} ${apiDate.hijri.month.ar} ${apiDate.hijri.year}`;
      const gregorianDate = `${apiDate.gregorian.day} ${apiDate.gregorian.month.en} ${apiDate.gregorian.year}`;

      const basePrayers: PrayerItem[] = PRAYER_KEYS.map((key) => ({
        key: key.toLowerCase(),
        nameAr: PRAYER_NAMES_AR[key],
        nameFr: PRAYER_NAMES_FR[key],
        time: timings[key],
        done: false,
        next: false,
      }));

      set({ prayers: basePrayers, hijriDate, gregorianDate });
      
      // Compute done, next, and time left
      get().updateTimeLeft();
      
      set({ isLoading: false, isFetching: false });
    } catch (error: any) {
      console.error("Fetch error:", error);
      set({ error: error.message || 'An error occurred', isLoading: false, isFetching: false });
    }
  },

  updateTimeLeft: () => {
    const { prayers } = get();
    if (prayers.length === 0) return;

    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentSeconds = now.getSeconds();
    
    const currentTimeInSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;

    let nextPrayerIndex = -1;
    let minDiff = Infinity;

    // Evaluate which prayer is next
    const updatedPrayers = prayers.map((prayer, index) => {
      const [ph, pm] = prayer.time.split(':').map(Number);
      const prayerTimeInSeconds = ph * 3600 + pm * 60;
      const diff = prayerTimeInSeconds - currentTimeInSeconds;
      
      const done = diff < 0; // It passed
      
      return { ...prayer, done, next: false, _diff: diff };
    });

    // Find the next prayer
    for (let i = 0; i < updatedPrayers.length; i++) {
      if (!updatedPrayers[i].done && updatedPrayers[i]._diff < minDiff) {
        minDiff = updatedPrayers[i]._diff;
        nextPrayerIndex = i;
      }
    }

    // If all prayers today are done, the next prayer is Fajr tomorrow
    let isNextDay = false;
    if (nextPrayerIndex === -1) {
      nextPrayerIndex = 0; // Fajr
      isNextDay = true;
      // Recalculate difference for next day
      const [ph, pm] = updatedPrayers[0].time.split(':').map(Number);
      const prayerTimeInSeconds = ph * 3600 + pm * 60;
      minDiff = (24 * 3600 - currentTimeInSeconds) + prayerTimeInSeconds;
    }

    // Set 'next' boolean
    const finalPrayers = updatedPrayers.map((prayer, index) => {
      const next = index === nextPrayerIndex;
      const { _diff, ...rest } = prayer;
      return { ...rest, next };
    });

    set({
      prayers: finalPrayers,
      nextPrayer: finalPrayers[nextPrayerIndex],
      timeLeft: formatTimeLeft(minDiff),
    });
  },
}));
