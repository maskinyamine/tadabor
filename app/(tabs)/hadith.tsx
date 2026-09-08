import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MosaicBackground } from '@/components/ui/MosaicBackground';
import { useState, useEffect } from 'react';
import { useHadithStore } from '../../store/hadithStore';

// ─── authenticity badge ───────────────────────────────────────────────────────

function AuthBadge({ label }: { label: string }) {
  if (!label) return null;
  return (
    <View className="px-2.5 py-1 rounded-full" style={{ backgroundColor: '#22C55E1A' }}>
      <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 10, color: '#16A34A' }}>
        ✓ {label}
      </Text>
    </View>
  );
}

// ─── screen ──────────────────────────────────────────────────────────────────

export default function HadithScreen() {
  const [favorited, setFavorited] = useState(false);
  const { hadith, isLoading, error, fetchRandomHadith } = useHadithStore();

  useEffect(() => {
    fetchRandomHadith();
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
            حديث اليوم
          </Text>
          <TouchableOpacity onPress={() => { setFavorited(false); fetchRandomHadith(); }}>
            <Ionicons name="refresh-outline" size={22} color="#9FBFB6" />
          </TouchableOpacity>
        </View>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#9FBFB6', textAlign: 'center', marginTop: 4 }}>
          Hadith aléatoire
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
              Chargement du hadith...
            </Text>
          </View>
        ) : error ? (
          <View className="py-20 items-center justify-center px-4">
            <Ionicons name="warning-outline" size={48} color="#EF4444" />
            <Text style={{ fontFamily: 'Inter_500Medium', color: '#374151', marginTop: 12, textAlign: 'center' }}>
              Impossible de charger le hadith.
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular', color: '#6B7280', marginTop: 4, textAlign: 'center', fontSize: 12 }}>
              {error}
            </Text>
            <TouchableOpacity onPress={fetchRandomHadith} className="mt-6 px-6 py-2 rounded-full" style={{ backgroundColor: '#1A3C34' }}>
              <Text style={{ color: '#FFF', fontFamily: 'Inter_500Medium' }}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        ) : hadith ? (
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
              {/* Source badge */}
              <View className="flex-row items-center justify-between mb-5">
                <AuthBadge label={
                  hadith.collection_name?.toLowerCase().includes('sahih') 
                    ? 'Authentique (Sahih)' 
                    : 'Recueil'
                } />
                <View className="px-2.5 py-1 rounded-full" style={{ backgroundColor: '#1A3C3414' }}>
                  <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 10, color: '#1A3C34' }}>
                    {hadith.collection_name} · n°{hadith.hadithnumber}
                  </Text>
                </View>
              </View>

              {/* Arabic text */}
              <Text
                style={{
                  fontFamily: 'NotoNaskhArabic_400Regular',
                  fontSize: 24,
                  lineHeight: 46,
                  color: '#1A3C34',
                  textAlign: 'right',
                  marginBottom: 16,
                }}
              >
                {hadith.arabic}
              </Text>

              {/* Separator */}
              {(hadith.translation || hadith.english) && (
                <View className="h-px mb-4" style={{ backgroundColor: '#F3F4F6' }} />
              )}

              {/* Translation */}
              {(hadith.translation || hadith.english) && (
                <Text
                  style={{
                    fontFamily: 'Inter_400Regular',
                    fontSize: 15,
                    lineHeight: 24,
                    color: '#374151',
                    marginBottom: 16,
                  }}
                >
                  {hadith.translation || hadith.english}
                </Text>
              )}
            </View>

            {/* Metadata card */}
            <View className="bg-white rounded-2xl p-4">
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#9CA3AF', marginBottom: 12, letterSpacing: 0.5 }}>
                SOURCE & ATTRIBUTION
              </Text>
              {[
                { label: 'Recueil', value: hadith.collection_name || 'Inconnu' },
                { label: 'Numéro', value: `#${hadith.hadithnumber || 'N/A'}` },
              ].map(({ label, value }) => (
                <View key={label} className="flex-row justify-between py-2 border-b border-gray-50">
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#6B7280' }}>{label}</Text>
                  <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: '#1A3C34' }}>{value}</Text>
                </View>
              ))}
            </View>

            {/* Disclaimer */}
            <View className="mt-3 flex-row items-start gap-2">
              <Ionicons name="information-circle-outline" size={14} color="#9CA3AF" />
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 10, color: '#9CA3AF', flex: 1, lineHeight: 16 }}>
                Source API : UmmahApi. Recueil : {hadith.collection_name}.
              </Text>
            </View>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
