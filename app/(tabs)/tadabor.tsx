import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MosaicBackground } from '@/components/ui/MosaicBackground';
import { useState, useEffect } from 'react';
import { useTadaborStore } from '../../store/tadaborStore';

export default function TadaborScreen() {
  const [favorited, setFavorited] = useState(false);
  const { tadabor, isLoading, error, fetchRandomTafsir } = useTadaborStore();

  useEffect(() => {
    fetchRandomTafsir();
  }, []);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F7F9F7' }}>
      {/* Header */}
      <View className="px-5 pt-2 pb-5" style={{ backgroundColor: '#1A3C34', overflow: 'hidden' }}>
        <MosaicBackground opacity={0.09} />
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => setFavorited((f) => !f)}>
            <Ionicons
              name={favorited ? 'bookmark' : 'bookmark-outline'}
              size={22}
              color={favorited ? '#C9A84C' : '#9FBFB6'}
            />
          </TouchableOpacity>
          <Text style={{ fontFamily: 'NotoNaskhArabic_700Bold', fontSize: 22, color: '#FFFFFF' }}>
            تدبر الآية
          </Text>
          <TouchableOpacity onPress={() => { setFavorited(false); fetchRandomTafsir(); }}>
            <Ionicons name="refresh-outline" size={22} color="#9FBFB6" />
          </TouchableOpacity>
        </View>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#9FBFB6', textAlign: 'center', marginTop: 4 }}>
          Verset et Réflexion
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator size="large" color="#1A3C34" />
            <Text style={{ fontFamily: 'Inter_400Regular', color: '#6B7280', marginTop: 12 }}>
              Chargement de la réflexion...
            </Text>
          </View>
        ) : error ? (
          <View className="py-20 items-center justify-center px-4">
            <Ionicons name="warning-outline" size={48} color="#EF4444" />
            <Text style={{ fontFamily: 'Inter_500Medium', color: '#374151', marginTop: 12, textAlign: 'center' }}>
              Impossible de charger le verset.
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular', color: '#6B7280', marginTop: 4, textAlign: 'center', fontSize: 12 }}>
              {error}
            </Text>
            <TouchableOpacity onPress={fetchRandomTafsir} className="mt-6 px-6 py-2 rounded-full" style={{ backgroundColor: '#1A3C34' }}>
              <Text style={{ color: '#FFF', fontFamily: 'Inter_500Medium' }}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        ) : tadabor ? (
          <>
            {/* Main card */}
            <View
              className="bg-white rounded-3xl p-6 mb-4"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.07,
                shadowRadius: 12,
                elevation: 4,
              }}
            >
              {/* Badge */}
              <View className="flex-row items-center justify-end mb-5">
                <View className="px-3 py-1.5 rounded-full" style={{ backgroundColor: '#1A3C3414' }}>
                  <Text style={{ fontFamily: 'NotoNaskhArabic_400Regular', fontSize: 12, color: '#1A3C34' }}>
                    سورة {tadabor.surah} · آية {tadabor.ayah}
                  </Text>
                </View>
              </View>

              {/* Arabic text (Ayah) */}
              <Text
                style={{
                  fontFamily: 'NotoNaskhArabic_700Bold',
                  fontSize: 26,
                  lineHeight: 48,
                  color: '#1A3C34',
                  textAlign: 'center',
                  marginBottom: 20,
                }}
              >
                {tadabor.text}
              </Text>

              {/* Separator */}
              <View className="h-px mb-5" style={{ backgroundColor: '#F3F4F6' }} />

              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#C9A84C', marginBottom: 12, textAlign: 'right' }}>
                التفسير الميسر
              </Text>

              {/* Tafsir */}
              <Text
                style={{
                  fontFamily: 'NotoNaskhArabic_400Regular',
                  fontSize: 18,
                  lineHeight: 34,
                  color: '#374151',
                  textAlign: 'right',
                }}
              >
                {tadabor.tafsir}
              </Text>
            </View>

            {/* Metadata card */}
            <View className="bg-white rounded-2xl p-4">
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#9CA3AF', marginBottom: 12, letterSpacing: 0.5 }}>
                RÉFÉRENCES
              </Text>
              {[
                { label: 'Sourate', value: tadabor.surah_name || tadabor.surah.toString() },
                { label: 'Verset', value: `n°${tadabor.ayah}` },
                { label: 'Tafsir', value: 'Al-Muyassar' },
              ].map(({ label, value }) => (
                <View key={label} className="flex-row justify-between py-2 border-b border-gray-50">
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#6B7280' }}>{label}</Text>
                  <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: '#1A3C34' }}>{value}</Text>
                </View>
              ))}
            </View>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
