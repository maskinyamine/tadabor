import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MosaicBackground } from '@/components/ui/MosaicBackground';
import azkarData from '../../azkar.json';

// ─── Types ────────────────────────────────────────────────────────────────────
type AzkarGroup = { id: number; category: string; array: any[] };

// ─── Categories NOT shown in the main Athkar page ─────────────────────────────
const MAIN_ATHKAR_CATEGORIES = new Set([
  'أذكار الصباح والمساء',
  'أذكار النوم',
  'أذكار الاستيقاظ من النوم',
  'الأذكار بعد السلام من الصلاة',
]);

// ─── Section groupings ────────────────────────────────────────────────────────
type SectionDef = { title: string; titleFr: string; accent: string; icon: string; categories: string[] };

const SECTIONS: SectionDef[] = [
  {
    title: 'الطهارة والصلاة',
    titleFr: 'Purification & Prière',
    accent: '#0EA5E9',
    icon: 'water-outline',
    categories: [
      'دعاء دخول الخلاء', 'دعاء الخروج من الخلاء', 'الذكر قبل الوضوء',
      'الذكر بعد الفراغ من الوضوء', 'دعاء الاستفتاح', 'دعاء الركوع',
      'دعاء الرفع من الركوع', 'دعاء السجود', 'دعاء الجلسة بين السجدتين',
      'دعاء سجود التلاوة', 'التشهد', 'الصلاة على النبي بعد التشهد',
      'الدعاء بعد التشهد الأخير قبل السلام', 'الأذكار بعد السلام من الصلاة',
      'دعاء صلاة الاستخارة', 'دعاء قنوت الوتر', 'الذكر عقب السلام من الوتر',
      'أذكار الآذان',
    ],
  },
  {
    title: 'اليوم والمنزل',
    titleFr: 'Quotidien & Maison',
    accent: '#C9A84C',
    icon: 'home-outline',
    categories: [
      'الذكر عند الخروج من المنزل', 'الذكر عند دخول المنزل',
      'دعاء الذهاب إلى المسجد', 'دعاء دخول المسجد', 'دعاء الخروج من المسجد',
      'دعاء ُلبْس الثوب', 'دعاء ُلبْس الثوب الجديد', 'الدعاء لمن لبس ثوبا جديدا',
      'ما يقول إذا وضع ثوبه',
    ],
  },
  {
    title: 'الطعام والشراب',
    titleFr: 'Nourriture & Boisson',
    accent: '#EA580C',
    icon: 'restaurant-outline',
    categories: [
      'الدعاء عند إفطار الصائم', 'الدعاء قبل الطعام', 'الدعاء عند الفراغ من الطعام',
      'دعاء الضيف لصاحب الطعام', 'التعريض بالدعاء لطلب الطعام أو الشراب',
      'الدعاء إذا أفطر عند أهل بيت', 'دعاء الصائم إذا حضر الطعام ولم يفطر',
      'ما يقول الصائم إذا سابه أحد', 'الدعاء عند رؤية باكورة الثمر',
    ],
  },
  {
    title: 'السفر والتنقل',
    titleFr: 'Voyage & Déplacements',
    accent: '#0891B2',
    icon: 'airplane-outline',
    categories: [
      'دعاء الركوب', 'دعاء السفر', 'دعاء دخول القرية أو البلدة',
      'دعاء دخول السوق', 'الدعاء إذا تعس المركوب', 'دعاء المسافر للمقيم',
      'دعاء المقيم للمسافر', 'التكبير و التسبيح في سير السفر',
      'دعاء المسافر إذا أسحر', 'الدعاء إذا نزل مترلا في سفر أو غيره',
      'ذكر الرجوع من السفر',
    ],
  },
  {
    title: 'الكرب والدعاء',
    titleFr: 'Détresse & Supplications',
    accent: '#DC2626',
    icon: 'heart-outline',
    categories: [
      'دعاء الهم والحزن', 'دعاء الكرب', 'دعاء لقاء العدو و ذي السلطان',
      'دعاء من خاف ظلم السلطان', 'الدعاء على العدو', 'ما يقول من خاف قوما',
      'دعاء من أصابه وسوسة في الإيمان', 'دعاء قضاء الدين',
      'دعاء الوسوسة في الصلاة و القراءة', 'دعاء من استصعب عليه أمر',
      'ما يقول ويفعل من أذنب ذنبا', 'دعاء طرد الشيطان و وساوسه',
      'الدعاء حينما يقع ما لا يرضاه أو ُ غلب على أمره',
      'ما يقال عند الفزع', 'الاستغفار و التوبة',
    ],
  },
  {
    title: 'المريض والميت',
    titleFr: 'Maladie & Décès',
    accent: '#64748B',
    icon: 'medkit-outline',
    categories: [
      'الدعاء للمريض في عيادته', 'فضل عيادة المريض', 'دعاء المريض الذي يئس من حياته',
      'تلقين المحتضر', 'دعاء من أصيب بمصيبة', 'الدعاء عند إغماض الميت',
      'الدعاء للميت في الصلاة عليه', 'الدعاء للفرط في الصلاة عليه',
      'دعاء التعزية', 'الدعاء عند إدخال الميت القبر',
      'الدعاء بعد دفن الميت', 'دعاء زيارة القبور',
    ],
  },
  {
    title: 'النوم والليل',
    titleFr: 'Nuit & Rêves',
    accent: '#4338CA',
    icon: 'moon-outline',
    categories: [
      'الدعاء إذا تقلب ليلا', 'دعاء الفزع في النوم و من بُلِيَ بالوحشة',
      'ما يفعل من رأى الرؤيا أو الحلم',
    ],
  },
  {
    title: 'الأسرة والمجتمع',
    titleFr: 'Famille & Société',
    accent: '#EC4899',
    icon: 'people-outline',
    categories: [
      'ﺗﻬنئة المولود له وجوابه', 'ما يعوذ به الأولاد',
      'الدعاء للمتزوج', 'دعاء المتزوج و شراء الدابة', 'الدعاء قبل إتيان الزوجة',
      'دعاء الغضب', 'دعاء من رأى مبتلى', 'ما يقال في اﻟﻤﺠلس', 'كفارة اﻟﻤﺠلس',
      'الدعاء لمن قال غفر الله لك', 'الدعاء لمن صنع إليك معروفا',
      'الدعاء لمن قال إني أحبك في الله', 'الدعاء لمن عرض عليك ماله',
      'الدعاء لمن أقرض عند القضاء', 'الدعاء لمن قال بارك الله فيك',
      'إفشاء السلام', 'كيف يرد السلام على الكافر إذا سلم',
    ],
  },
  {
    title: 'الطقس والطبيعة',
    titleFr: 'Météo & Nature',
    accent: '#2563EB',
    icon: 'rainy-outline',
    categories: [
      'دعاء الريح', 'دعاء الرعد', 'من أدعية الاستسقاء',
      'الدعاء إذا نزل المطر', 'الذكر بعد نزول المطر', 'من أدعية الاستصحاء',
      'دعاء رؤية الهلال', 'الدُّعاءُ عِنْدَ سَمَاعِ صِياحِ الدِّيكِ ونَهِيقِ الْحِمَارِ',
      'دعاء نباح الكلاب بالليل',
    ],
  },
  {
    title: 'الحج والعمرة',
    titleFr: 'Hajj & Umrah',
    accent: '#92400E',
    icon: 'flag-outline',
    categories: [
      'كيف يلبي المحرم في الحج أو العمرة ؟', 'التكبير إذا أتى الركن الأسود',
      'الدعاء بين الركن اليماني والحجر الأسود', 'دعاء الوقوف على الصفا والمروة',
      'الدعاء يوم عرفة', 'الذكر عند المشعر الحرام',
      'التكبير عند رمي الجمار مع كل حصاة',
    ],
  },
  {
    title: 'أذكار متنوعة',
    titleFr: 'Dhikr & Divers',
    accent: '#1A3C34',
    icon: 'sparkles-outline',
    categories: [
      'دعاء التعجب والأمر السار', 'ما يفعل من أتاه أمر يسره',
      'ما يقول من أحس وجعا في جسده', 'دعاء من خشي أن يصيب شيئا بعينه',
      'ما يقول عند الذبح أو النحر', 'ما يقول لرد كيد مردة الشياطين',
      'دعاء العطاس', 'ما يقال للكافر إذا عطس فحمد الله',
      'دعاء الخوف من الشرك', 'دعاء كراهية الطيرة',
      'ما يعصم الله به من الدجال', 'الدعاء لمن سببته',
      'ما يقول المسلم إذا مدح المسلم', 'ما يقول المسلم إذا زكي',
      'ما يقول من أتاه أمر يسره أو يكرهه',
      'فضل الصلاة على النبي صلى الله عليه و سلم',
      'فضل التسبيح و التحميد، و التهليل، و التكبير',
      'كيف كان النبي يسبح؟', 'من أنواع الخير والآداب الجامعة',
    ],
  },
];

// ─── Category Card ─────────────────────────────────────────────────────────────
type CatCardProps = { name: string; count: number; accent: string; onPress: () => void };

function CatCard({ name, count, accent, onPress }: CatCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center bg-white rounded-2xl mb-2 px-4 py-3"
      style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 }}
    >
      <View className="w-2 h-8 rounded-full mr-3" style={{ backgroundColor: accent }} />
      <Text style={{ fontFamily: 'NotoNaskhArabic_700Bold', fontSize: 15, color: '#1A1A1A', flex: 1, textAlign: 'right' }}>
        {name}
      </Text>
      <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#9CA3AF', marginLeft: 8 }}>
        {count}
      </Text>
      <Ionicons name="chevron-forward" size={16} color="#D1D5DB" style={{ marginLeft: 4 }} />
    </TouchableOpacity>
  );
}

// ─── Section Header ────────────────────────────────────────────────────────────
function SectionHeader({ title, titleFr, accent, icon }: { title: string; titleFr: string; accent: string; icon: string }) {
  return (
    <View className="flex-row items-center mb-3 mt-6">
      <View className="w-8 h-8 rounded-xl items-center justify-center mr-2" style={{ backgroundColor: `${accent}20` }}>
        <Ionicons name={icon as any} size={16} color={accent} />
      </View>
      <View className="flex-1">
        <Text style={{ fontFamily: 'NotoNaskhArabic_700Bold', fontSize: 16, color: '#1A3C34' }}>{title}</Text>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#9CA3AF' }}>{titleFr}</Text>
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ToolsScreen() {
  const router = useRouter();
  const allGroups = azkarData as AzkarGroup[];

  // Build a quick lookup: category name → item count
  const countMap = useMemo(() => {
    const m: Record<string, number> = {};
    for (const g of allGroups) {
      m[g.category] = (g.array || []).filter((e) => e.text && e.text.trim() !== '').length;
    }
    return m;
  }, [allGroups]);

  function goTo(categoryName: string) {
    router.push({ pathname: '/category', params: { name: categoryName } });
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F7F9F7' }}>
      {/* Header */}
      <View className="px-5 pt-3 pb-5" style={{ backgroundColor: '#1A3C34', overflow: 'hidden' }}>
        <MosaicBackground opacity={0.09} />
        <View className="items-center">
          <Text style={{ fontFamily: 'NotoNaskhArabic_700Bold', fontSize: 26, color: '#FFFFFF', marginBottom: 2 }}>
            أخرى
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#9FBFB6' }}>
            {allGroups.length - MAIN_ATHKAR_CATEGORIES.size} catégories d'invocations islamiques
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Athkar card (main page) ── */}
        <View className="mt-4 mb-2">
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/athkar')}
            activeOpacity={0.8}
            className="rounded-3xl overflow-hidden"
            style={{ backgroundColor: '#1A3C34', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 5 }}
          >
            <View className="p-4 flex-row items-center justify-between">
              <View className="w-12 h-12 rounded-2xl items-center justify-center" style={{ backgroundColor: '#C9A84C22' }}>
                <Ionicons name="sparkles" size={24} color="#C9A84C" />
              </View>
              <View className="flex-1 mx-3">
                <Text style={{ fontFamily: 'NotoNaskhArabic_700Bold', fontSize: 17, color: '#FFFFFF' }}>
                  أذكار الصباح والمساء والنوم
                </Text>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#9FBFB6', marginTop: 2 }}>
                  Athkar principaux · 4 catégories
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#C9A84C" />
            </View>
          </TouchableOpacity>
        </View>

        {/* ── All other sections ── */}
        {SECTIONS.map((section) => {
          const availableCats = section.categories.filter((cat) => !MAIN_ATHKAR_CATEGORIES.has(cat) && countMap[cat] !== undefined);
          if (availableCats.length === 0) return null;
          return (
            <View key={section.title}>
              <SectionHeader
                title={section.title}
                titleFr={section.titleFr}
                accent={section.accent}
                icon={section.icon}
              />
              {availableCats.map((cat) => (
                <CatCard
                  key={cat}
                  name={cat}
                  count={countMap[cat] ?? 0}
                  accent={section.accent}
                  onPress={() => goTo(cat)}
                />
              ))}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
