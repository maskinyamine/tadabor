import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MosaicBackground } from '@/components/ui/MosaicBackground';

export default function QuranScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F7F9F7' }}>
      <View className="px-5 py-4 bg-white border-b border-gray-100 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-full bg-gray-50">
          <Ionicons name="chevron-back" size={24} color="#1A3C34" />
        </TouchableOpacity>
        
        <Text style={{ fontFamily: 'NotoNaskhArabic_700Bold', fontSize: 20, color: '#1A3C34', flex: 1, textAlign: 'center' }}>
          القرآن الكريم
        </Text>

        <View className="w-10 h-10" />
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View className="w-24 h-24 rounded-full mb-6 items-center justify-center" style={{ backgroundColor: '#2D6A5522' }}>
          <Ionicons name="book-outline" size={48} color="#2D6A55" />
        </View>
        <Text style={{ fontFamily: 'NotoNaskhArabic_700Bold', fontSize: 24, color: '#1A3C34', marginBottom: 12, textAlign: 'center' }}>
          قريباً إن شاء الله
        </Text>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 22 }}>
          L'explorateur complet du Coran (lecture, tafsir et écoute) sera disponible très prochainement dans une future mise à jour.
        </Text>
        
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mt-8 px-8 py-3 rounded-2xl" 
          style={{ backgroundColor: '#1A3C34' }}
        >
          <Text style={{ fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' }}>
            Retour aux outils
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
