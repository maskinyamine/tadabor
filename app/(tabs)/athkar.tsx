import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MosaicBackground } from '@/components/ui/MosaicBackground';
import { useState, useMemo } from 'react';
import azkarData from '../../azkar.json';

// ─── types ───────────────────────────────────────────────────────────────────

export interface AthkarItem {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  count: number;
  source: string;
}

// ─── dhikr card ──────────────────────────────────────────────────────────────

type DhikrCardProps = {
  item: AthkarItem;
  current: number;
  onTap: () => void;
};

function DhikrCard({ item, current, onTap }: DhikrCardProps) {
  const done = current >= item.count;

  return (
    <TouchableOpacity
      onPress={onTap}
      activeOpacity={0.9}
      disabled={done}
      className="bg-white rounded-3xl mb-4 overflow-hidden"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
        opacity: done ? 0.6 : 1,
      }}
    >
      {/* Green top strip */}
      <View className="h-1 w-full" style={{ backgroundColor: done ? '#22C55E' : '#1A3C34' }} />

      <View className="p-5">
        {/* Arabic text */}
        <Text
          style={{
            fontFamily: 'NotoNaskhArabic_400Regular',
            fontSize: 22,
            lineHeight: 42,
            color: '#1A3C34',
            textAlign: 'right',
            marginBottom: item.translation || item.transliteration ? 12 : 0,
          }}
        >
          {item.arabic}
        </Text>

        {/* Transliteration */}
        {!!item.transliteration && (
          <Text
            style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#9CA3AF', marginBottom: 6, fontStyle: 'italic' }}
          >
            {item.transliteration}
          </Text>
        )}

        {/* Translation / Description */}
        {!!item.translation && (
          <Text
            style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#4B5563', lineHeight: 20 }}
          >
            {item.translation}
          </Text>
        )}

        {/* Footer */}
        <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-gray-100">
          {/* Source */}
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 10, color: '#9CA3AF', flex: 1 }}>
            {item.source}
          </Text>

          {/* Counter */}
          <View className="flex-row items-center gap-2">
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: done ? '#22C55E' : '#1A3C34' }}>
              {current} / {item.count}
            </Text>
            <View
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: done ? '#22C55E' : '#1A3C34' }}
            >
              {done
                ? <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                : <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 14, color: '#C9A84C' }}>×</Text>
              }
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── main screen ─────────────────────────────────────────────────────────────

const sessionMapping: Record<string, string> = {
  morning: "أذكار الصباح",
  evening: "أذكار المساء",
  sleep: "أذكار النوم",
  wake: "أذكار الاستيقاظ",
};

export default function AthkarScreen() {
  const [session, setSession] = useState<'morning' | 'evening' | 'sleep' | 'wake'>('morning');
  const [counters, setCounters] = useState<Record<string, number>>({});

  const athkar: AthkarItem[] = useMemo(() => {
    const key = sessionMapping[session] as keyof typeof azkarData;
    const rawList = azkarData[key] || [];
    
    // Flatten in case of nested arrays (e.g. user copy-paste issue)
    const flatList = Array.isArray(rawList) ? rawList.flat() : [];
  
    return flatList
      .filter((item: any) => item.category !== 'stop' && item.count !== 'stop' && item.content)
      .map((item: any, index: number) => {
        let maxCount = parseInt(item.count, 10);
        if (isNaN(maxCount) || maxCount < 1) maxCount = 1;
  
        let content = item.content || '';
        // Clean up some weird formatting strings from python output or json issues
        if (typeof content === 'string' && content.includes("', '\"")) {
            content = content.replace(/\\n', '"/g, '')
                             .replace(/", '\\n', '\\n', '\\n', '\\n', '\\n', '\\n', '"/g, '')
                             .replace(/', '\\n', '\\n', '\\n', '\\n', '\\n', '\\n', '"/g, '')
                             .replace(/\\n/g, '')
                             .replace(/^"|"$/g, '')
                             .trim();
        }
  
        return {
          id: `${session}-${index}`,
          arabic: content,
          transliteration: '', // Add transliteration mapping if available
          translation: item.description || '',
          count: maxCount,
          source: item.reference || ''
        };
      });
  }, [session]);

  const completed = athkar.filter((d) => (counters[d.id] ?? 0) >= d.count).length;
  const progressPercent = athkar.length > 0 ? Math.round((completed / athkar.length) * 100) : 0;

  function tap(id: string, max: number) {
    setCounters((prev) => {
      const cur = prev[id] ?? 0;
      if (cur >= max) return prev;
      return { ...prev, [id]: cur + 1 };
    });
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F7F9F7' }}>
      {/* ── Header ── */}
      <View className="px-5 pt-2 pb-4" style={{ backgroundColor: '#1A3C34', overflow: 'hidden' }}>
        <MosaicBackground opacity={0.09} />
        <View className="flex-row items-center justify-between mb-4">
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#9FBFB6' }}>
            {completed} / {athkar.length} complétés
          </Text>
          <Text style={{ fontFamily: 'NotoNaskhArabic_700Bold', fontSize: 22, color: '#FFFFFF' }}>
            الأذكار
          </Text>
        </View>

        {/* Session toggle */}
        <View className="flex-row rounded-2xl p-1" style={{ backgroundColor: '#152520' }}>
          {[
            { id: 'morning', label: 'الصباح' },
            { id: 'evening', label: 'المساء' },
            { id: 'sleep', label: 'النوم' },
            { id: 'wake', label: 'الاستيقاظ' },
          ].map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setSession(cat.id as any)}
              className="flex-1 py-2 rounded-xl items-center"
              style={{ backgroundColor: session === cat.id ? '#C9A84C' : 'transparent' }}
            >
              <Text
                style={{
                  fontFamily: 'NotoNaskhArabic_700Bold',
                  fontSize: 14,
                  color: session === cat.id ? '#1A3C34' : '#9FBFB6',
                }}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Progress bar */}
        <View className="mt-3 h-1 rounded-full" style={{ backgroundColor: '#2D6A55' }}>
          <View
            className="h-1 rounded-full"
            style={{
              backgroundColor: '#C9A84C',
              width: `${progressPercent}%`,
            }}
          />
        </View>
      </View>

      {/* ── List ── */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {athkar.map((item) => (
          <DhikrCard
            key={item.id}
            item={item}
            current={counters[item.id] ?? 0}
            onTap={() => tap(item.id, item.count)}
          />
        ))}
        {athkar.length === 0 && (
          <Text style={{ fontFamily: 'Inter_400Regular', color: '#9CA3AF', textAlign: 'center', marginTop: 40 }}>
            Aucune invocation trouvée pour cette catégorie.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
