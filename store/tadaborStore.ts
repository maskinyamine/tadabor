import { create } from 'zustand';

export interface AyahTafsirData {
  surah: number;
  ayah: number;
  surah_name?: string; // Often provided by API or we can just leave it as number
  text: string; // The Ayah text (might be in the API response or we might only get Tafsir)
  tafsir: string; // The Tafsir text
}

interface TadaborState {
  tadabor: AyahTafsirData | null;
  isLoading: boolean;
  error: string | null;
  fetchRandomTafsir: () => Promise<void>;
}

const API_KEY = 'umh_67eb603517eb74322d87edaae21e0ebaf569a450';

// Number of ayahs per surah (1 to 114)
const surahAyahCounts = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 98, 135,
  112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75, 85, 54, 53,
  89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12,
  12, 30, 52, 52, 44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26,
  30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6
];

export const useTadaborStore = create<TadaborState>((set) => ({
  tadabor: null,
  isLoading: true,
  error: null,

  fetchRandomTafsir: async () => {
    set({ isLoading: true, error: null });
    try {
      // Pick a random Surah (1 to 114)
      const randomSurah = Math.floor(Math.random() * 114) + 1;
      
      // Pick a random Ayah based on the chosen Surah
      const maxAyahs = surahAyahCounts[randomSurah - 1];
      const randomAyah = Math.floor(Math.random() * maxAyahs) + 1;

      // We need both the Ayah text and its Tafsir
      const quranUrl = `https://ummahapi.com/api/quran/surah/${randomSurah}/ayah/${randomAyah}`;
      const tafsirUrl = `https://ummahapi.com/api/tafsir/muyassar/surah/${randomSurah}/ayah/${randomAyah}`;

      const [quranRes, tafsirRes] = await Promise.all([
        fetch(quranUrl, { headers: { 'X-API-Key': API_KEY } }),
        fetch(tafsirUrl, { headers: { 'X-API-Key': API_KEY } })
      ]);

      if (!quranRes.ok || !tafsirRes.ok) {
        throw new Error(`API Error: ${quranRes.status} / ${tafsirRes.status}`);
      }

      const quranJson = await quranRes.json();
      const tafsirJson = await tafsirRes.json();
      
      if (quranJson?.success && tafsirJson?.success) {
        const quranData = quranJson.data;
        const tafsirData = tafsirJson.data;
        
        // Extract the strings correctly to avoid React object render crash
        const arabicText = quranData?.verse?.arabic || 'Texte arabe non disponible';
        const tafsirText = tafsirData?.tafsir?.text || 'Tafsir non disponible';
        const surahName = quranData?.surah?.name_arabic || `سورة ${randomSurah}`;

        set({ 
          tadabor: {
            surah: randomSurah,
            ayah: randomAyah,
            surah_name: surahName,
            text: arabicText,
            tafsir: tafsirText
          }, 
          isLoading: false 
        });
      } else {
        throw new Error('Format de réponse invalide');
      }
    } catch (error: any) {
      console.error('Erreur fetch tadabor:', error);
      set({ error: error.message || 'Une erreur est survenue', isLoading: false });
    }
  },
}));
