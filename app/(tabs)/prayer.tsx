import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MosaicBackground } from '@/components/ui/MosaicBackground';
import { usePrayerStore, PrayerItem } from '@/store/prayerStore';
import { useEffect } from 'react';

type PrayerRowProps = PrayerItem;

function PrayerRow({ nameAr, nameFr, time, done, next }: PrayerRowProps) {
  return (
    <View
      className="flex-row items-center justify-between px-5 py-4 rounded-2xl mb-3"
      style={{
        backgroundColor: next ? '#1A3C34' : '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      {/* Status dot */}
      <View
        className="w-3 h-3 rounded-full"
        style={{
          backgroundColor: done ? '#22C55E' : next ? '#C9A84C' : '#E5E7EB',
        }}
      />

      {/* Names */}
      <View className="flex-1 items-center">
        <Text
          style={{
            fontFamily: 'NotoNaskhArabic_700Bold',
            fontSize: 18,
            color: next ? '#FFFFFF' : '#1A3C34',
          }}
        >
          {nameAr}
        </Text>
        <Text
          style={{
            fontFamily: 'Inter_400Regular',
            fontSize: 12,
            color: next ? '#9FBFB6' : '#9CA3AF',
          }}
        >
          {nameFr}
        </Text>
      </View>

      {/* Time */}
      <Text
        style={{
          fontFamily: 'Inter_700Bold',
          fontSize: 20,
          color: next ? '#C9A84C' : done ? '#9CA3AF' : '#1A3C34',
          letterSpacing: 0.5,
        }}
      >
        {time}
      </Text>
    </View>
  );
}

// ─── screen ──────────────────────────────────────────────────────────────────

export default function PrayerScreen() {
  const { prayers, city, country, isLoading, error, nextPrayer, timeLeft, fetchPrayers, updateTimeLeft } = usePrayerStore();

  useEffect(() => {
    fetchPrayers();
    
    // Update the time left every minute
    const interval = setInterval(() => {
      updateTimeLeft();
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchPrayers, updateTimeLeft]);

  // Format today's date in French
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
  const formattedDate = today.toLocaleDateString('fr-FR', dateOptions).toUpperCase();

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center" style={{ backgroundColor: '#F7F9F7' }}>
        <ActivityIndicator size="large" color="#1A3C34" />
        <Text style={{ fontFamily: 'Inter_400Regular', marginTop: 12, color: '#1A3C34' }}>
          Chargement des horaires...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F7F9F7' }}>
      {/* Header */}
      <View className="px-5 pt-2 pb-6" style={{ backgroundColor: '#1A3C34', overflow: 'hidden' }}>
        <MosaicBackground opacity={0.09} />
        <View className="flex-row items-center justify-between mb-2">
          <Ionicons name="location-outline" size={18} color="#9FBFB6" />
          <Text style={{ fontFamily: 'NotoNaskhArabic_700Bold', fontSize: 22, color: '#FFFFFF' }}>
            مواقيت الصلاة
          </Text>
          <TouchableOpacity onPress={() => fetchPrayers(true)}>
            <Ionicons name="refresh-outline" size={18} color="#9FBFB6" />
          </TouchableOpacity>
        </View>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#9FBFB6', textAlign: 'center' }}>
          Horaires de prière · {city}{country ? `, ${country}` : ''}
        </Text>

        {/* Next prayer big display */}
        {nextPrayer && (
          <View className="items-center mt-6">
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#9FBFB6' }}>
              Prochaine prière
            </Text>
            <Text style={{ fontFamily: 'NotoNaskhArabic_700Bold', fontSize: 32, color: '#FFFFFF', marginTop: 4 }}>
              {nextPrayer.nameAr}
            </Text>
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 42, color: '#C9A84C', letterSpacing: 2, marginTop: 4 }}>
              {nextPrayer.time}
            </Text>
            <View className="mt-3 px-4 py-1.5 rounded-full" style={{ backgroundColor: '#C9A84C22' }}>
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: '#C9A84C' }}>
                dans {timeLeft}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Prayer list */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#9CA3AF', marginBottom: 12, letterSpacing: 0.5 }}>
          AUJOURD'HUI · {formattedDate}
        </Text>

        {prayers.map((p) => (
          <PrayerRow 
            key={p.key} 
            nameAr={p.nameAr} 
            nameFr={p.nameFr} 
            time={p.time} 
            done={p.done} 
            next={p.next} 
          />
        ))}

        {/* Qibla direction */}
        <View
          className="mt-4 p-4 rounded-2xl flex-row items-center"
          style={{ backgroundColor: '#1A3C3414' }}
        >
          <Ionicons name="compass-outline" size={22} color="#1A3C34" />
          <View className="ml-3">
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#1A3C34' }}>
              Direction de la Qibla
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#6B7280' }}>
              Disponible dans la Phase 3
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
