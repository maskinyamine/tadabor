import React, { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, FlatList,
  ActivityIndicator, TextInput, Platform, Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MosaicBackground } from '@/components/ui/MosaicBackground';

// Helper to convert standard numbers to Arabic numbers
function toArabicNumber(n: number) {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(n).split('').map(c => arabicNumbers[parseInt(c)]).join('');
}

// ─── Complete list of 114 surahs (static) ─────────────────────────────────────
const SURAHS = [
  { n: 1, ar: 'الفاتحة', en: 'Al-Fatihah', v: 7, place: 'مكية' },
  { n: 2, ar: 'البقرة', en: 'Al-Baqarah', v: 286, place: 'مدنية' },
  { n: 3, ar: 'آل عمران', en: "Ali 'Imran", v: 200, place: 'مدنية' },
  { n: 4, ar: 'النساء', en: "An-Nisa'", v: 176, place: 'مدنية' },
  { n: 5, ar: 'المائدة', en: 'Al-Ma\'idah', v: 120, place: 'مدنية' },
  { n: 6, ar: 'الأنعام', en: 'Al-An\'am', v: 165, place: 'مكية' },
  { n: 7, ar: 'الأعراف', en: 'Al-A\'raf', v: 206, place: 'مكية' },
  { n: 8, ar: 'الأنفال', en: 'Al-Anfal', v: 75, place: 'مدنية' },
  { n: 9, ar: 'التوبة', en: 'At-Tawbah', v: 129, place: 'مدنية' },
  { n: 10, ar: 'يونس', en: 'Yunus', v: 109, place: 'مكية' },
  { n: 11, ar: 'هود', en: 'Hud', v: 123, place: 'مكية' },
  { n: 12, ar: 'يوسف', en: 'Yusuf', v: 111, place: 'مكية' },
  { n: 13, ar: 'الرعد', en: 'Ar-Ra\'d', v: 43, place: 'مدنية' },
  { n: 14, ar: 'إبراهيم', en: 'Ibrahim', v: 52, place: 'مكية' },
  { n: 15, ar: 'الحجر', en: 'Al-Hijr', v: 99, place: 'مكية' },
  { n: 16, ar: 'النحل', en: 'An-Nahl', v: 128, place: 'مكية' },
  { n: 17, ar: 'الإسراء', en: 'Al-Isra', v: 111, place: 'مكية' },
  { n: 18, ar: 'الكهف', en: 'Al-Kahf', v: 110, place: 'مكية' },
  { n: 19, ar: 'مريم', en: 'Maryam', v: 98, place: 'مكية' },
  { n: 20, ar: 'طه', en: 'Ta-Ha', v: 135, place: 'مكية' },
  { n: 21, ar: 'الأنبياء', en: 'Al-Anbya', v: 112, place: 'مكية' },
  { n: 22, ar: 'الحج', en: 'Al-Hajj', v: 78, place: 'مدنية' },
  { n: 23, ar: 'المؤمنون', en: 'Al-Mu\'minun', v: 118, place: 'مكية' },
  { n: 24, ar: 'النور', en: 'An-Nur', v: 64, place: 'مدنية' },
  { n: 25, ar: 'الفرقان', en: 'Al-Furqan', v: 77, place: 'مكية' },
  { n: 26, ar: 'الشعراء', en: 'Ash-Shu\'ara', v: 227, place: 'مكية' },
  { n: 27, ar: 'النمل', en: 'An-Naml', v: 93, place: 'مكية' },
  { n: 28, ar: 'القصص', en: 'Al-Qasas', v: 88, place: 'مكية' },
  { n: 29, ar: 'العنكبوت', en: 'Al-\'Ankabut', v: 69, place: 'مكية' },
  { n: 30, ar: 'الروم', en: 'Ar-Rum', v: 60, place: 'مكية' },
  { n: 31, ar: 'لقمان', en: 'Luqman', v: 34, place: 'مكية' },
  { n: 32, ar: 'السجدة', en: 'As-Sajdah', v: 30, place: 'مكية' },
  { n: 33, ar: 'الأحزاب', en: 'Al-Ahzab', v: 73, place: 'مدنية' },
  { n: 34, ar: 'سبإ', en: 'Saba', v: 54, place: 'مكية' },
  { n: 35, ar: 'فاطر', en: 'Fatir', v: 45, place: 'مكية' },
  { n: 36, ar: 'يس', en: 'Ya-Sin', v: 83, place: 'مكية' },
  { n: 37, ar: 'الصافات', en: 'As-Saffat', v: 182, place: 'مكية' },
  { n: 38, ar: 'ص', en: 'Sad', v: 88, place: 'مكية' },
  { n: 39, ar: 'الزمر', en: 'Az-Zumar', v: 75, place: 'مكية' },
  { n: 40, ar: 'غافر', en: 'Ghafir', v: 85, place: 'مكية' },
  { n: 41, ar: 'فصلت', en: 'Fussilat', v: 54, place: 'مكية' },
  { n: 42, ar: 'الشورى', en: 'Ash-Shuraa', v: 53, place: 'مكية' },
  { n: 43, ar: 'الزخرف', en: 'Az-Zukhruf', v: 89, place: 'مكية' },
  { n: 44, ar: 'الدخان', en: 'Ad-Dukhan', v: 59, place: 'مكية' },
  { n: 45, ar: 'الجاثية', en: 'Al-Jathiyah', v: 37, place: 'مكية' },
  { n: 46, ar: 'الأحقاف', en: 'Al-Ahqaf', v: 35, place: 'مكية' },
  { n: 47, ar: 'محمد', en: 'Muhammad', v: 38, place: 'مدنية' },
  { n: 48, ar: 'الفتح', en: 'Al-Fath', v: 29, place: 'مدنية' },
  { n: 49, ar: 'الحجرات', en: 'Al-Hujurat', v: 18, place: 'مدنية' },
  { n: 50, ar: 'ق', en: 'Qaf', v: 45, place: 'مكية' },
  { n: 51, ar: 'الذاريات', en: 'Adh-Dhariyat', v: 60, place: 'مكية' },
  { n: 52, ar: 'الطور', en: 'At-Tur', v: 49, place: 'مكية' },
  { n: 53, ar: 'النجم', en: 'An-Najm', v: 62, place: 'مكية' },
  { n: 54, ar: 'القمر', en: 'Al-Qamar', v: 55, place: 'مكية' },
  { n: 55, ar: 'الرحمن', en: 'Ar-Rahman', v: 78, place: 'مدنية' },
  { n: 56, ar: 'الواقعة', en: 'Al-Waqiah', v: 96, place: 'مكية' },
  { n: 57, ar: 'الحديد', en: 'Al-Hadid', v: 29, place: 'مدنية' },
  { n: 58, ar: 'المجادلة', en: 'Al-Mujadila', v: 22, place: 'مدنية' },
  { n: 59, ar: 'الحشر', en: 'Al-Hashr', v: 24, place: 'مدنية' },
  { n: 60, ar: 'الممتحنة', en: 'Al-Mumtahanah', v: 13, place: 'مدنية' },
  { n: 61, ar: 'الصف', en: 'As-Saf', v: 14, place: 'مدنية' },
  { n: 62, ar: 'الجمعة', en: "Al-Jum'ah", v: 11, place: 'مدنية' },
  { n: 63, ar: 'المنافقون', en: 'Al-Munafiqun', v: 11, place: 'مدنية' },
  { n: 64, ar: 'التغابن', en: 'At-Taghabun', v: 18, place: 'مدنية' },
  { n: 65, ar: 'الطلاق', en: 'At-Talaq', v: 12, place: 'مدنية' },
  { n: 66, ar: 'التحريم', en: 'At-Tahrim', v: 12, place: 'مدنية' },
  { n: 67, ar: 'الملك', en: 'Al-Mulk', v: 30, place: 'مكية' },
  { n: 68, ar: 'القلم', en: 'Al-Qalam', v: 52, place: 'مكية' },
  { n: 69, ar: 'الحاقة', en: 'Al-Haqqah', v: 52, place: 'مكية' },
  { n: 70, ar: 'المعارج', en: 'Al-Ma\'arij', v: 44, place: 'مكية' },
  { n: 71, ar: 'نوح', en: 'Nuh', v: 28, place: 'مكية' },
  { n: 72, ar: 'الجن', en: 'Al-Jinn', v: 28, place: 'مكية' },
  { n: 73, ar: 'المزمل', en: 'Al-Muzzammil', v: 20, place: 'مكية' },
  { n: 74, ar: 'المدثر', en: 'Al-Muddaththir', v: 56, place: 'مكية' },
  { n: 75, ar: 'القيامة', en: 'Al-Qiyamah', v: 40, place: 'مكية' },
  { n: 76, ar: 'الإنسان', en: 'Al-Insan', v: 31, place: 'مدنية' },
  { n: 77, ar: 'المرسلات', en: 'Al-Mursalat', v: 50, place: 'مكية' },
  { n: 78, ar: 'النبأ', en: "An-Naba'", v: 40, place: 'مكية' },
  { n: 79, ar: 'النازعات', en: 'An-Nazi\'at', v: 46, place: 'مكية' },
  { n: 80, ar: 'عبس', en: "'Abasa", v: 42, place: 'مكية' },
  { n: 81, ar: 'التكوير', en: 'At-Takwir', v: 29, place: 'مكية' },
  { n: 82, ar: 'الانفطار', en: 'Al-Infitar', v: 19, place: 'مكية' },
  { n: 83, ar: 'المطففين', en: 'Al-Mutaffifin', v: 36, place: 'مكية' },
  { n: 84, ar: 'الانشقاق', en: 'Al-Inshiqaq', v: 25, place: 'مكية' },
  { n: 85, ar: 'البروج', en: 'Al-Buruj', v: 22, place: 'مكية' },
  { n: 86, ar: 'الطارق', en: 'At-Tariq', v: 17, place: 'مكية' },
  { n: 87, ar: 'الأعلى', en: 'Al-A\'la', v: 19, place: 'مكية' },
  { n: 88, ar: 'الغاشية', en: 'Al-Ghashiyah', v: 26, place: 'مكية' },
  { n: 89, ar: 'الفجر', en: 'Al-Fajr', v: 30, place: 'مكية' },
  { n: 90, ar: 'البلد', en: 'Al-Balad', v: 20, place: 'مكية' },
  { n: 91, ar: 'الشمس', en: 'Ash-Shams', v: 15, place: 'مكية' },
  { n: 92, ar: 'الليل', en: 'Al-Layl', v: 21, place: 'مكية' },
  { n: 93, ar: 'الضحى', en: 'Ad-Duhaa', v: 11, place: 'مكية' },
  { n: 94, ar: 'الشرح', en: 'Ash-Sharh', v: 8, place: 'مكية' },
  { n: 95, ar: 'التين', en: 'At-Tin', v: 8, place: 'مكية' },
  { n: 96, ar: 'العلق', en: 'Al-\'Alaq', v: 19, place: 'مكية' },
  { n: 97, ar: 'القدر', en: 'Al-Qadr', v: 5, place: 'مكية' },
  { n: 98, ar: 'البينة', en: 'Al-Bayyinah', v: 8, place: 'مدنية' },
  { n: 99, ar: 'الزلزلة', en: 'Az-Zalzalah', v: 8, place: 'مدنية' },
  { n: 100, ar: 'العاديات', en: 'Al-\'Adiyat', v: 11, place: 'مكية' },
  { n: 101, ar: 'القارعة', en: 'Al-Qari\'ah', v: 11, place: 'مكية' },
  { n: 102, ar: 'التكاثر', en: 'At-Takathur', v: 8, place: 'مكية' },
  { n: 103, ar: 'العصر', en: 'Al-\'Asr', v: 3, place: 'مكية' },
  { n: 104, ar: 'الهمزة', en: 'Al-Humazah', v: 9, place: 'مكية' },
  { n: 105, ar: 'الفيل', en: 'Al-Fil', v: 5, place: 'مكية' },
  { n: 106, ar: 'قريش', en: 'Quraysh', v: 4, place: 'مكية' },
  { n: 107, ar: 'الماعون', en: 'Al-Ma\'un', v: 7, place: 'مكية' },
  { n: 108, ar: 'الكوثر', en: 'Al-Kawthar', v: 3, place: 'مكية' },
  { n: 109, ar: 'الكافرون', en: 'Al-Kafirun', v: 6, place: 'مكية' },
  { n: 110, ar: 'النصر', en: 'An-Nasr', v: 3, place: 'مدنية' },
  { n: 111, ar: 'المسد', en: 'Al-Masad', v: 5, place: 'مكية' },
  { n: 112, ar: 'الإخلاص', en: 'Al-Ikhlas', v: 4, place: 'مكية' },
  { n: 113, ar: 'الفلق', en: 'Al-Falaq', v: 5, place: 'مكية' },
  { n: 114, ar: 'الناس', en: 'An-Nas', v: 6, place: 'مكية' },
];

// ─── Surah Row ─────────────────────────────────────────────────────────────────
type SurahRowProps = { surah: typeof SURAHS[0]; onPress: () => void };

function SurahRow({ surah, onPress }: SurahRowProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center bg-white rounded-2xl mb-2 px-4 py-3"
      style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 }}
    >
      <View className="w-9 h-9 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: '#1A3C3415' }}>
        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 12, color: '#1A3C34' }}>
          {surah.n}
        </Text>
      </View>
      <View className="flex-1">
        <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: '#6B7280' }}>
          {surah.en} · {surah.place} · {surah.v} آية
        </Text>
      </View>
      <Text style={{ fontFamily: 'NotoNaskhArabic_700Bold', fontSize: 18, color: '#1A3C34', marginLeft: 8 }}>
        {surah.ar}
      </Text>
      <Ionicons name="chevron-forward" size={16} color="#D1D5DB" style={{ marginLeft: 4 }} />
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function QuranScreen() {
  const [search, setSearch] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<typeof SURAHS[0] | null>(null);

  const [verses, setVerses] = useState<any[]>([]);
  const [translations, setTranslations] = useState<any[]>([]);
  const [loadingVerses, setLoadingVerses] = useState(false);
  const [errorVerses, setErrorVerses] = useState<string | null>(null);

  const [selectedAyah, setSelectedAyah] = useState<number | null>(null);

  const filtered = SURAHS.filter(
    (s) =>
      s.ar.includes(search) ||
      s.en.toLowerCase().includes(search.toLowerCase()) ||
      String(s.n).includes(search)
  );

  const loadSurah = useCallback(async (surah: typeof SURAHS[0]) => {
    setSelectedSurah(surah);
    setVerses([]);
    setTranslations([]);
    setSelectedAyah(null);
    setLoadingVerses(true);
    setErrorVerses(null);
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/surah/${surah.n}/editions/quran-uthmani,fr.hamidullah`);
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      const json = await res.json();

      let arabicVerses = json?.data?.[0]?.ayahs || [];
      let frenchVerses = json?.data?.[1]?.ayahs || [];

      // Clean Bismillah from first verse for all surahs except Fatihah (surah 1)
      if (surah.n !== 1 && surah.n !== 9 && arabicVerses.length > 0) {
        const bismillahStr = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ";
        // AlQuran cloud sometimes adds Bismillah as part of verse 1 text
        if (arabicVerses[0].text.startsWith(bismillahStr) || arabicVerses[0].text.includes("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ")) {
          arabicVerses[0].text = arabicVerses[0].text.replace("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", "").trim();
        }
      }

      setVerses(arabicVerses);
      setTranslations(frenchVerses);
    } catch (e: any) {
      setErrorVerses(e.message || 'Erreur de chargement');
    } finally {
      setLoadingVerses(false);
    }
  }, []);

  const closeSurah = () => {
    setSelectedSurah(null);
    setSelectedAyah(null);
  };

  // ── Reader view ──────────────────────────────────────────────────────────────
  if (selectedSurah) {
    const selectedTranslation = selectedAyah ? translations.find(t => t.numberInSurah === selectedAyah)?.text : null;

    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: '#ebe4d9ff' }}>
        {/* Header */}
        <View className="px-5 pt-2 pb-4" style={{ backgroundColor: '#1A3C34', overflow: 'hidden' }}>
          <MosaicBackground opacity={0.09} />
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={closeSurah}
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: '#FFFFFF18' }}
            >
              <Ionicons name="chevron-back" size={22} color="#ffffffd9" />
            </TouchableOpacity>
            <View className="items-center flex-1 mx-2">
              <Text style={{ fontFamily: 'NotoNaskhArabic_700Bold', fontSize: 22, color: '#FFFFFF' }}>
                سورة {selectedSurah.ar}
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#9FBFB6' }}>
                {selectedSurah.en} · {selectedSurah.v} ayat · {selectedSurah.place}
              </Text>
            </View>
            <View className="w-10" />
          </View>
        </View>

        {loadingVerses ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#1A3C34" />
            <Text style={{ fontFamily: 'Inter_400Regular', color: '#9CA3AF', marginTop: 12 }}>
              Chargement de la sourate...
            </Text>
          </View>
        ) : errorVerses ? (
          <View className="flex-1 items-center justify-center px-8">
            <Ionicons name="cloud-offline-outline" size={48} color="#9CA3AF" />
            <Text style={{ fontFamily: 'Inter_400Regular', color: '#EF4444', textAlign: 'center', marginTop: 12 }}>
              {errorVerses}
            </Text>
            <TouchableOpacity onPress={() => loadSurah(selectedSurah)} className="mt-4 px-6 py-2 rounded-2xl" style={{ backgroundColor: '#1A3C34' }}>
              <Text style={{ fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' }}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-1">
            <ScrollView
              contentContainerStyle={{ padding: 20, paddingBottom: selectedAyah ? 180 : 40 }}
              showsVerticalScrollIndicator={false}
            >
              {/* Ornate Surah Frame */}
              <View className="border border-[#C9A84C] p-1 rounded-sm mb-6 mt-2" style={{ backgroundColor: '#FDF6E3' }}>
                <View className="border-2 border-[#C9A84C] py-4 items-center justify-center" style={{ backgroundColor: '#F9F1D8' }}>
                  <Text style={{ fontFamily: 'Amiri_700Bold', fontSize: 28, color: '#1A3C34' }}>
                    سُورَةُ {selectedSurah.ar}
                  </Text>
                </View>
              </View>

              {/* Basmalah */}
              {selectedSurah.n !== 9 && selectedSurah.n !== 1 && (
                <View className="items-center mb-6">
                  <Text style={{ fontFamily: 'Amiri_700Bold', fontSize: 26, color: '#1A3C34' }}>
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                  </Text>
                </View>
              )}

              {/* Inline Verses */}
              <Text style={{ textAlign: 'center', writingDirection: 'rtl', lineHeight: 65 }}>
                {verses.map(v => {
                  const isSelected = selectedAyah === v.numberInSurah;
                  return (
                    <Text
                      key={v.number}
                      onPress={() => setSelectedAyah(v.numberInSurah)}
                    >
                      <Text style={{ fontFamily: 'Amiri_400Regular', fontSize: 28, color: isSelected ? '#C9A84C' : '#1A3C34' }}>
                        {v.text}{' '}
                      </Text>
                      <Text style={{ fontFamily: 'Amiri_400Regular', fontSize: 22, color: isSelected ? '#1A3C34' : '#C9A84C' }}>
                        ۝{toArabicNumber(v.numberInSurah)}{' '}
                      </Text>
                    </Text>
                  );
                })}
              </Text>
            </ScrollView>

            {/* Translation Panel (Floating) */}
            {selectedAyah && selectedTranslation && (
              <View
                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl border-t border-gray-200 p-5"
                style={{ shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 10 }}
              >
                <View className="flex-row justify-between items-center mb-3">
                  <View className="bg-[#1A3C3415] px-3 py-1 rounded-full">
                    <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#1A3C34' }}>
                      Verset {selectedAyah}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedAyah(null)} className="p-1">
                    <Ionicons name="close-circle" size={24} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
                <ScrollView style={{ maxHeight: 120 }}>
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, color: '#374151', lineHeight: 22 }}>
                    {selectedTranslation}
                  </Text>
                </ScrollView>
              </View>
            )}
          </View>
        )}
      </SafeAreaView>
    );
  }

  // ── Surah list ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F7F9F7' }}>
      <View className="px-5 pt-3 pb-5" style={{ backgroundColor: '#1A3C34', overflow: 'hidden' }}>
        <MosaicBackground opacity={0.09} />
        <View className="items-center mb-4">
          <Text style={{ fontFamily: 'NotoNaskhArabic_700Bold', fontSize: 26, color: '#FFFFFF', marginBottom: 2 }}>
            القرآن الكريم
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#9FBFB6' }}>
            114 sourates · 6 236 versets
          </Text>
        </View>

        <View className="flex-row items-center rounded-2xl px-3 py-2" style={{ backgroundColor: '#FFFFFF18' }}>
          <Ionicons name="search-outline" size={18} color="#9FBFB6" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Rechercher une sourate..."
            placeholderTextColor="#9FBFB6"
            style={{ flex: 1, marginLeft: 8, fontFamily: 'Inter_400Regular', fontSize: 14, color: '#FFFFFF' }}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#9FBFB6" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(s) => String(s.n)}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <SurahRow surah={item} onPress={() => loadSurah(item)} />
        )}
        ListEmptyComponent={
          <Text style={{ fontFamily: 'Inter_400Regular', color: '#9CA3AF', textAlign: 'center', marginTop: 40 }}>
            Aucune sourate trouvée.
          </Text>
        }
      />
    </SafeAreaView>
  );
}
