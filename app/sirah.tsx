import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MosaicBackground } from '@/components/ui/MosaicBackground';

const SIRAH_SECTIONS = [
  {
    id: 1,
    titleAr: 'السيرة بالترتيب الزمني',
    titleFr: 'مكة إلى المدينة · 24 مرحلة',
    icon: 'book-outline',
  },
  {
    id: 2,
    titleAr: 'العشرة المبشرون بالجنة',
    titleFr: '10 compagnons',
    icon: 'people-outline',
  },
  {
    id: 3,
    titleAr: 'الغزوات الكبرى',
    titleFr: 'بدر · أحد · الخندق',
    icon: 'shield-half-outline',
  },
  {
    id: 4,
    titleAr: 'قصص الأنبياء',
    titleFr: 'من آدم إلى محمد ﷺ',
    icon: 'leaf-outline',
  },
  {
    id: 5,
    titleAr: 'أمهات المؤمنين',
    titleFr: 'زوجات النبي ﷺ',
    icon: 'heart-outline',
  },
];

export default function SirahScreen() {
  const router = useRouter();

  const handlePress = () => {
    Alert.alert("قريباً إن شاء الله", "Le contenu sera disponible dans une prochaine mise à jour.");
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F7F9F7' }}>
      {/* Header */}
      <View className="px-5 pt-4 pb-6" style={{ backgroundColor: '#1A3C34', overflow: 'hidden' }}>
        <MosaicBackground opacity={0.09} />
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: '#FFFFFF18' }}
          >
            <Ionicons name="chevron-back" size={22} color="#ffffffd9" />
          </TouchableOpacity>
          <View className="items-center flex-1 mx-2">
            <Text style={{ fontFamily: 'NotoNaskhArabic_700Bold', fontSize: 20, color: '#FFFFFF' }}>
              السيرة النبوية والصحابة
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#9FBFB6', marginTop: 2 }}>
              Vie du Prophète & Compagnons
            </Text>
          </View>
          <View className="w-10" />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#6B7280', marginBottom: 12, marginLeft: 4 }}>
          CONTENU ISLAMIQUE
        </Text>

        {SIRAH_SECTIONS.map((section) => (
          <TouchableOpacity
            key={section.id}
            onPress={handlePress}
            activeOpacity={0.7}
            className="flex-row items-center bg-white rounded-2xl mb-3 px-5 py-4 border border-gray-100"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}
          >
            <View className="w-10 h-10 rounded-full items-center justify-center mr-4" style={{ backgroundColor: '#C9A84C15' }}>
              <Ionicons name={section.icon as any} size={20} color="#C9A84C" />
            </View>
            <View className="flex-1">
              <Text style={{ fontFamily: 'NotoNaskhArabic_700Bold', fontSize: 17, color: '#1A3C34' }}>
                {section.titleAr}
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#6B7280', marginTop: 2 }}>
                {section.titleFr}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
