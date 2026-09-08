import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MosaicBackground } from '@/components/ui/MosaicBackground';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useEffect } from 'react';
import { usePrayerStore } from '@/store/prayerStore';

// ─── helpers ────────────────────────────────────────────────────────────────

function getGreeting(): { ar: string; fr: string; period: 'morning' | 'afternoon' | 'evening' } {
  const h = new Date().getHours();
  if (h >= 4 && h < 12) return { ar: 'السلام عليكم', fr: 'Assalamu Alaykom', period: 'morning' };
  if (h >= 12 && h < 17) return { ar: 'السلام عليكم', fr: 'Assalamu Alaykom', period: 'afternoon' };
  return { ar: 'السلام عليكم', fr: 'Assalamu Alaykom', period: 'evening' };
}

function getHijriDate(): string {
  // Simple approximation; will be replaced by a proper Hijri lib or API later
  try {
    const formatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return formatter.format(new Date());
  } catch {
    return '';
  }
}

// ─── quick action card ───────────────────────────────────────────────────────

type QuickCardProps = {
  icon: string;
  iconLib?: 'ionicons' | 'material';
  titleAr: string;
  titleFr: string;
  subtitle: string;
  accent?: string;
  onPress: () => void;
};

function QuickCard({ icon, iconLib = 'ionicons', titleAr, titleFr, subtitle, accent = '#1A3C34', onPress }: QuickCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="bg-white rounded-3xl p-4 mb-3 flex-row items-center"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      {/* Icon */}
      <View
        className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
        style={{ backgroundColor: accent + '18' }}
      >
        {iconLib === 'ionicons' ? (
          <Ionicons name={icon as any} size={24} color={accent} />
        ) : (
          <MaterialCommunityIcons name={icon as any} size={24} color={accent} />
        )}
      </View>

      {/* Text */}
      <View className="flex-1">
        <Text style={{ fontFamily: 'NotoNaskhArabic_700Bold', fontSize: 18, color: '#1A1A1A', textAlign: 'right' }}>
          {titleAr}
        </Text>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#6B7280', marginTop: 2 }}>
          {titleFr}
        </Text>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>
          {subtitle}
        </Text>
      </View>

      {/* Chevron */}
      <Ionicons name="chevron-back-outline" size={16} color="#9CA3AF" style={{ transform: [{ scaleX: -1 }] }} />
    </TouchableOpacity>
  );
}

// ─── prayer countdown banner ─────────────────────────────────────────────────

function PrayerBanner() {
  const { nextPrayer, timeLeft } = usePrayerStore();

  if (!nextPrayer) {
    return (
      <View
        className="rounded-3xl p-5 mb-4 items-center justify-center"
        style={{ backgroundColor: '#1A3C34', overflow: 'hidden', height: 100 }}
      >
        <MosaicBackground opacity={0.07} />
        <Text style={{ fontFamily: 'Inter_400Regular', color: '#9FBFB6' }}>
          Chargement des horaires...
        </Text>
      </View>
    );
  }

  return (
    <View
      className="rounded-3xl p-5 mb-4"
      style={{ backgroundColor: '#1A3C34', overflow: 'hidden' }}
    >
      <MosaicBackground opacity={0.07} />
      <View className="flex-row items-center justify-between">
        <View>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#9FBFB6' }}>
            Prochaine prière
          </Text>
          <Text style={{ fontFamily: 'NotoNaskhArabic_700Bold', fontSize: 22, color: '#FFFFFF' }}>
            {nextPrayer.nameAr}
          </Text>
          <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: '#C5D9D3' }}>
            {nextPrayer.nameFr}
          </Text>
        </View>
        <View className="items-end">
          <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 34, color: '#C9A84C', letterSpacing: 1 }}>
            {nextPrayer.time}
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#9FBFB6' }}>
            dans {timeLeft}
          </Text>
        </View>
      </View>
    </View>
  );
}

// ─── main screen ─────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();
  const greeting = useMemo(() => getGreeting(), []);
  const hijri = useMemo(() => getHijriDate(), []);

  const { fetchPrayers, updateTimeLeft } = usePrayerStore();

  useEffect(() => {
    fetchPrayers();
    const interval = setInterval(() => {
      updateTimeLeft();
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchPrayers, updateTimeLeft]);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F7F9F7' }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View
          className="rounded-b-3xl -mx-4 px-6 pt-4 pb-6 mb-5"
          style={{ backgroundColor: '#1A3C34', overflow: 'hidden' }}
        >
          <MosaicBackground opacity={0.09} />
          {/* Top row */}
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity className="w-9 h-9 items-center justify-center rounded-full" style={{ backgroundColor: '#2D6A55' }}>
              <Ionicons name="settings-outline" size={18} color="#C9A84C" />
            </TouchableOpacity>
            <View className="items-center">
              <Text style={{ fontFamily: 'TheYearOfCamel', fontSize: 22, color: '#FFFFFF', letterSpacing: 0.5, paddingTop: 4 }}>
                Tadabor
              </Text>
            </View>
            <TouchableOpacity className="w-9 h-9 items-center justify-center rounded-full" style={{ backgroundColor: '#2D6A55' }}>
              <Ionicons name="notifications-outline" size={18} color="#C9A84C" />
            </TouchableOpacity>
          </View>

          {/* Greeting */}
          <View className="items-center mb-3">
            <Text style={{ fontFamily: 'NotoNaskhArabic_700Bold', fontSize: 28, color: '#FFFFFF', textAlign: 'center' }}>
              {greeting.ar}
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: '#9FBFB6', marginTop: 2 }}>
              {greeting.fr}
            </Text>
          </View>

          {/* Hijri date */}
          {hijri ? (
            <View className="items-center">
              <View className="px-3 py-1 rounded-full" style={{ backgroundColor: '#C9A84C22' }}>
                <Text style={{ fontFamily: 'NotoNaskhArabic_400Regular', fontSize: 14, color: '#C9A84C' }}>
                  {hijri}
                </Text>
              </View>
            </View>
          ) : null}
        </View>

        {/* ── Prayer Banner ── */}
        <PrayerBanner />

        {/* ── Section title ── */}
        <View className="flex-row items-center justify-between mb-3">
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#6B7280' }}>
            AUJOURD'HUI
          </Text>
          <Text style={{ fontFamily: 'NotoNaskhArabic_400Regular', fontSize: 14, color: '#1A3C34' }}>
            محتوى اليوم
          </Text>
        </View>

        {/* ── Quick Cards ── */}
        <QuickCard
          icon="sparkles-outline"
          titleAr="أذكار اليوم"
          titleFr="Athkar du jour"
          subtitle="Matin · Soir · Sommeil · Réveil"
          accent="#1A3C34"
          onPress={() => router.push('/(tabs)/athkar')}
        />

        <QuickCard
          icon="book-outline"
          titleAr="تعلم حديث"
          titleFr="Apprendre le hadith"
          subtitle="Paroles et traditions du Prophète (ﷺ)"
          accent="#C9A84C"
          onPress={() => router.push('/(tabs)/hadith')}
        />

        <QuickCard
          icon="leaf-outline"
          titleAr="تدبر الآية"
          titleFr="Verset & réflexion"
          subtitle="Tafsir Al-Muyassar"
          accent="#2D6A55"
          onPress={() => router.push('/(tabs)/tadabor')}
        />

        <QuickCard
          icon="counter"
          iconLib="material"
          titleAr="التسبيح"
          titleFr="Compteur de dhikr"
          subtitle="Objectif : 33"
          accent="#9B7D30"
          onPress={() => router.push('/(tabs)/tasbih')}
        />

        {/* ── Basmala ── */}
        {/* <View className="items-center mt-4 mb-2">
          <Text style={{ fontFamily: 'NotoNaskhArabic_400Regular', fontSize: 20, color: '#1A3C34', opacity: 0.6 }}>
            ﷽
          </Text>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}
