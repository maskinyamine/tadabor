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

function getFallbackGregorian(): string {
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());
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

// ─── prayer widget (replaces banner & action card) ───────────────────────────

function PrayerWidget() {
  const router = useRouter();
  const { prayers, nextPrayer, timeLeft, hijriDate } = usePrayerStore();

  if (!nextPrayer || prayers.length === 0) {
    return (
      <TouchableOpacity
        onPress={() => router.push('/(tabs)/prayer')}
        activeOpacity={0.9}
        className="bg-white rounded-[28px] p-5 mb-5 items-center justify-center"
        style={{ height: 140, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 4 }}
      >
        <Text style={{ fontFamily: 'Inter_400Regular', color: '#9CA3AF' }}>Chargement des horaires...</Text>
      </TouchableOpacity>
    );
  }

  // Extract day and month from hijriDate: "29 صفر 1446" -> "29", "صفر"
  const hijriParts = hijriDate.split(' ');
  const hDay = hijriParts[0] || '';
  const hMonth = hijriParts.slice(1, -1).join(' ') || '';

  return (
    <View className="mb-5">
      {/* Title Bar */}
      <View className="flex-row justify-between items-center mb-2 px-1">
        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 20, color: '#1A1A1A' }}>
          Horaires de Prière
        </Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/prayer')} className="flex-row items-center">
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#2D6A55' }}>Plus </Text>
          <Ionicons name="chevron-forward" size={13} color="#2D6A55" />
        </TouchableOpacity>
      </View>

      {/* Main Card */}
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => router.push('/(tabs)/prayer')}
        className="bg-white rounded-[28px] p-5 pt-6"
        style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 4 }}
      >
        {/* Top Info */}
        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-row items-center">
            <View>
              <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 18, color: '#2D6A55' }}>
                {nextPrayer.nameFr}
              </Text>
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#1A1A1A' }}>
                {nextPrayer.time}
              </Text>
            </View>
            <View className="w-[2px] h-12 bg-[#E5E7EB] mx-4 rounded-full" />
            <View className="justify-center">
              <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 18, color: '#2D6A55' }}>
                {hDay}
              </Text>
              <Text style={{ fontFamily: 'NotoNaskhArabic_400Regular', fontSize: 12, color: '#1A1A1A' }}>
                {hMonth}
              </Text>
            </View>
          </View>
          <View className="items-end justify-center">
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#1A1A1A' }}>
              Dans
            </Text>
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 18, color: '#2D6A55' }}>
              {timeLeft}
            </Text>
          </View>
        </View>

        {/* Timeline */}
        <View className="flex-row justify-between items-center">
          {prayers.map((prayer) => {
            const isActive = prayer.key === nextPrayer.key;
            return (
              <View 
                key={prayer.key} 
                className={`items-center rounded-xl py-2 px-1 flex-1 mx-0.5 ${isActive ? 'bg-[#2D6A55]' : 'bg-transparent'}`}
                style={isActive ? { shadowColor: '#2D6A55', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 } : {}}
              >
                <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 11, color: isActive ? '#FFFFFF' : '#1A1A1A', marginBottom: 2 }} numberOfLines={1}>
                  {prayer.nameFr}
                </Text>
                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 11, color: isActive ? '#FFFFFF' : '#1A1A1A' }}>
                  {prayer.time}
                </Text>
              </View>
            );
          })}
        </View>
      </TouchableOpacity>
    </View>
  );
}

// ─── main screen ─────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();
  const greeting = useMemo(() => getGreeting(), []);

  const { fetchPrayers, updateTimeLeft, hijriDate } = usePrayerStore();

  useEffect(() => {
    fetchPrayers();
    const interval = setInterval(() => {
      updateTimeLeft();
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchPrayers, updateTimeLeft]);

  const displayGregorian = getFallbackGregorian();

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
          {/* Hijri & Miladi date */}
          <View className="items-center">
            <View className="px-3 py-1.5 rounded-full" style={{ backgroundColor: '#C9A84C22', flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: '#C9A84C', paddingRight: 8, borderRightWidth: 1, borderRightColor: '#C9A84C44' }}>
                {displayGregorian}
              </Text>
              <Text style={{ fontFamily: 'NotoNaskhArabic_400Regular', fontSize: 14, color: '#C9A84C', paddingLeft: 8 }}>
                {hijriDate || '...'}
              </Text>
            </View>
          </View>
        </View>
        {/* ── Prayer Widget ── */}
        <PrayerWidget />

        {/* ── Section title ── */}
        <View className="flex-row items-center justify-between mb-3 mt-2">
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
