import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDuasStore, type Dua } from '../store/duasStore';

// ─── Dua Card ─────────────────────────────────────────────────────────────────

type DuaCardProps = {
  dua: Dua;
  index: number;
  current: number;
  onTap: () => void;
};

function DuaCard({ dua, index, current, onTap }: DuaCardProps) {
  const done = current >= dua.repeat;

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
        opacity: done ? 0.7 : 1,
      }}
    >
      {/* Green top strip */}
      <View className="h-1 w-full" style={{ backgroundColor: done ? '#22C55E' : '#1A3C34' }} />

      <View className="p-5">
        {/* Title badge */}
        <View className="self-end mb-3 px-3 py-1 rounded-full" style={{ backgroundColor: '#1A3C4415' }}>
          <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 11, color: '#1A3C34' }}>
            {dua.title}
          </Text>
        </View>

        {/* Arabic text */}
        <Text
          style={{
            fontFamily: 'NotoNaskhArabic_400Regular',
            fontSize: 22,
            lineHeight: 42,
            color: '#1A3C34',
            textAlign: 'right',
            marginBottom: 12,
          }}
        >
          {dua.arabic}
        </Text>

        {/* Transliteration */}
        {!!dua.transliteration && (
          <Text
            style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#9CA3AF', marginBottom: 8, fontStyle: 'italic', lineHeight: 18 }}
          >
            {dua.transliteration}
          </Text>
        )}

        {/* Translation */}
        {!!dua.translation && (
          <Text
            style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#4B5563', lineHeight: 20, marginBottom: 8 }}
          >
            {dua.translation}
          </Text>
        )}

        {/* Footer */}
        <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 10, color: '#9CA3AF', flex: 1 }}>
            📖 {dua.source}
          </Text>
          <View className="flex-row items-center gap-2">
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: done ? '#22C55E' : '#1A3C34' }}>
              {current} / {dua.repeat}
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

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function DuasCategoryScreen() {
  const router = useRouter();
  const { categoryId, categoryName } = useLocalSearchParams<{ categoryId: string; categoryName: string }>();
  const { duas, isLoading, error, fetchDuas, getDuasByCategory } = useDuasStore();
  const [counters, setCounters] = useState<Record<number, number>>({});

  useEffect(() => {
    fetchDuas();
  }, []);

  const categoryDuas = getDuasByCategory(categoryId || '');
  const completed = categoryDuas.filter((d) => (counters[d.id] ?? 0) >= d.repeat).length;
  const progressPercent = categoryDuas.length > 0 ? Math.round((completed / categoryDuas.length) * 100) : 0;

  function tap(id: number, max: number) {
    setCounters((prev) => {
      const cur = prev[id] ?? 0;
      if (cur >= max) return prev;
      return { ...prev, [id]: cur + 1 };
    });
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F7F9F7' }}>
      {/* Header */}
      <View className="px-5 py-4 bg-white border-b border-gray-100 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-full bg-gray-50">
          <Ionicons name="chevron-back" size={24} color="#1A3C34" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'NotoNaskhArabic_700Bold', fontSize: 20, color: '#1A3C34', flex: 1, textAlign: 'center' }} numberOfLines={1}>
          {categoryName}
        </Text>
        <View className="w-10 h-10" />
      </View>

      {/* Progress bar */}
      <View className="h-1 bg-gray-200">
        <View className="h-full" style={{ backgroundColor: '#22C55E', width: `${progressPercent}%` }} />
      </View>

      {/* Loading */}
      {isLoading && (
        <View className="flex-1 items-center justify-center">
          <Text style={{ fontFamily: 'Inter_400Regular', color: '#9CA3AF', marginBottom: 8 }}>Chargement des duaas...</Text>
        </View>
      )}

      {/* Error */}
      {!!error && !isLoading && (
        <View className="flex-1 items-center justify-center px-6">
          <Text style={{ fontFamily: 'Inter_400Regular', color: '#EF4444', textAlign: 'center' }}>{error}</Text>
        </View>
      )}

      {/* List */}
      {!isLoading && !error && (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          {categoryDuas.length === 0 ? (
            <Text style={{ fontFamily: 'Inter_400Regular', color: '#9CA3AF', textAlign: 'center', marginTop: 40 }}>
              Aucun dua trouvé pour cette catégorie.
            </Text>
          ) : (
            categoryDuas.map((dua, index) => (
              <DuaCard
                key={dua.id}
                dua={dua}
                index={index}
                current={counters[dua.id] ?? 0}
                onTap={() => tap(dua.id, dua.repeat)}
              />
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
