import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useMemo } from 'react';
import azkarData from '../azkar.json';

// ─── New JSON format ──────────────────────────────────────────────────────────
type AzkarEntry = { id: number; text: string; count: number; audio?: string };
type AzkarGroup = { id: number; category: string; array: AzkarEntry[] };

// ─── Dhikr card ──────────────────────────────────────────────────────────────
type DhikrCardProps = {
  entry: AzkarEntry;
  cardKey: string;
  current: number;
  onTap: () => void;
};

function DhikrCard({ entry, cardKey, current, onTap }: DhikrCardProps) {
  const done = current >= entry.count;

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
      <View className="h-1 w-full" style={{ backgroundColor: done ? '#22C55E' : '#1A3C34' }} />

      <View className="p-5">
        <Text
          style={{
            fontFamily: 'NotoNaskhArabic_400Regular',
            fontSize: 21,
            lineHeight: 40,
            color: '#1A3C34',
            textAlign: 'right',
            marginBottom: 12,
          }}
        >
          {entry.text}
        </Text>

        <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#9CA3AF' }}>
            {entry.count > 1 ? `يُكرَّر ${entry.count} مرة` : 'مرة واحدة'}
          </Text>
          <View className="flex-row items-center gap-2">
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: done ? '#22C55E' : '#1A3C34' }}>
              {current} / {entry.count}
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

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function CategoryScreen() {
  const router = useRouter();
  const { name } = useLocalSearchParams<{ name: string }>();
  const [counters, setCounters] = useState<Record<string, number>>({});

  const allGroups = azkarData as AzkarGroup[];

  const entries: AzkarEntry[] = useMemo(() => {
    if (!name) return [];
    const group = allGroups.find((g) => g.category === name);
    if (!group) return [];
    return (group.array || []).filter((e) => e.text && e.text.trim() !== '');
  }, [name]);

  const completed = entries.filter((e) => (counters[`${name}-${e.id}`] ?? 0) >= e.count).length;
  const progressPercent = entries.length > 0 ? Math.round((completed / entries.length) * 100) : 0;

  function tap(key: string, max: number) {
    setCounters((prev) => {
      const cur = prev[key] ?? 0;
      if (cur >= max) return prev;
      return { ...prev, [key]: cur + 1 };
    });
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F7F9F7' }}>
      {/* Header */}
      <View className="px-5 py-4 bg-white border-b border-gray-100 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-full bg-gray-50 mr-3">
          <Ionicons name="chevron-back" size={24} color="#1A3C34" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'NotoNaskhArabic_700Bold', fontSize: 18, color: '#1A3C34', flex: 1, textAlign: 'right' }} numberOfLines={1}>
          {name}
        </Text>
      </View>

      {/* Progress bar */}
      <View className="h-1 bg-gray-200">
        <View className="h-full" style={{ backgroundColor: '#22C55E', width: `${progressPercent}%` }} />
      </View>

      {/* List */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {entries.length === 0 ? (
          <Text style={{ fontFamily: 'Inter_400Regular', color: '#9CA3AF', textAlign: 'center', marginTop: 40 }}>
            Aucun contenu trouvé pour "{name}".
          </Text>
        ) : (
          entries.map((entry) => {
            const key = `${name}-${entry.id}`;
            return (
              <DhikrCard
                key={key}
                entry={entry}
                cardKey={key}
                current={counters[key] ?? 0}
                onTap={() => tap(key, entry.count)}
              />
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
