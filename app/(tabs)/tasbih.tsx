import { View, Text, TouchableOpacity, Vibration, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { MosaicBackground } from '@/components/ui/MosaicBackground';
import { useState, useCallback, useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  useAnimatedProps,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// ─── configurable goals ───────────────────────────────────────────────────────

const GOALS = [33, 99, 100, 1000];

// ─── animated counter button ─────────────────────────────────────────────────

function CounterButton({ onPress, count, goal }: { onPress: () => void; count: number; goal: number }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePress() {
    scale.value = withSequence(withSpring(0.92), withSpring(1));
    onPress();
  }

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(Math.min(count / goal, 1), { damping: 15, stiffness: 90 });
  }, [count, goal]);

  const radius = 119;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const cx = 140;
  const cy = 140;

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  const pct = Math.min(count / goal, 1);

  return (
    <Animated.View style={[animatedStyle]}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={1}
        style={{ alignItems: 'center', justifyContent: 'center' }}
      >
        {/* SVG-like circle drawn with absolute positioning */}
        <View style={{ width: 280, height: 280, alignItems: 'center', justifyContent: 'center' }}>
          <Svg width="280" height="280" style={{ position: 'absolute' }}>
            <Circle
              cx={cx}
              cy={cy}
              r={radius}
              stroke="#E5E7EB"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <AnimatedCircle
              cx={cx}
              cy={cy}
              r={radius}
              stroke="#C9A84C"
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              animatedProps={animatedProps}
              transform={`rotate(-90 ${cx} ${cy})`}
            />
          </Svg>
          {/* Center button */}
          <View
            style={{
              width: 200,
              height: 200,
              borderRadius: 100,
              backgroundColor: '#1A3C34',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.25,
              shadowRadius: 20,
              elevation: 12,
            }}
          >
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 56, color: pct >= 1 ? '#C9A84C' : '#FFFFFF', lineHeight: 60 }}>
              {count}
            </Text>
            <Text style={{ fontFamily: 'NotoNaskhArabic_400Regular', fontSize: 14, color: pct >= 1 ? '#C9A84C' : '#9FBFB6', marginTop: 4 }}>
              {pct >= 1 ? 'مكتمل' : 'اضغط للتسبيح'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── screen ──────────────────────────────────────────────────────────────────

export default function TasbihScreen() {
  const [count, setCount] = useState(0);
  const [goalIndex, setGoalIndex] = useState(0);
  const [dhikrText, setDhikrText] = useState('سُبْحَانَ اللَّهِ');

  const goal = GOALS[goalIndex];
  const done = count >= goal;

  const tap = useCallback(() => {
    setCount((c) => c + 1);
    if (Platform.OS !== 'web') {
      Vibration.vibrate(20);
    }
  }, []);

  function reset() {
    setCount(0);
  }

  function cycleGoal() {
    setGoalIndex((i) => (i + 1) % GOALS.length);
    setCount(0);
  }

  const DHIKR_OPTIONS = [
    'سُبْحَانَ اللَّهِ',
    'الْحَمْدُ لِلَّهِ',
    'اللَّهُ أَكْبَرُ',
    'لَا إِلَهَ إِلَّا اللَّهُ',
    'أَسْتَغْفِرُ اللَّهَ',
  ];

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F7F9F7' }}>
      {/* Header */}
      <View className="px-5 pt-2 pb-5" style={{ backgroundColor: '#1A3C34', overflow: 'hidden' }}>
        <MosaicBackground opacity={0.09} />
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={reset}>
            <Ionicons name="refresh-outline" size={22} color="#9FBFB6" />
          </TouchableOpacity>
          <Text style={{ fontFamily: 'NotoNaskhArabic_700Bold', fontSize: 22, color: '#FFFFFF' }}>
            التسبيح
          </Text>
          <TouchableOpacity onPress={cycleGoal}>
            <View className="px-3 py-1 rounded-full" style={{ backgroundColor: '#C9A84C33' }}>
              <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 12, color: '#C9A84C' }}>
                /{goal}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Dhikr selector */}
      <View className="px-4 pt-4">
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#9CA3AF', textAlign: 'center', marginBottom: 8 }}>
          Choisir le dhikr
        </Text>
        <View className="flex-row flex-wrap justify-center gap-2">
          {DHIKR_OPTIONS.map((d) => (
            <TouchableOpacity
              key={d}
              onPress={() => { setDhikrText(d); setCount(0); }}
              className="px-3 py-1.5 rounded-full"
              style={{
                backgroundColor: dhikrText === d ? '#1A3C34' : '#E5E7EB',
              }}
            >
              <Text style={{
                fontFamily: 'NotoNaskhArabic_400Regular',
                fontSize: 14,
                color: dhikrText === d ? '#FFFFFF' : '#4B5563',
              }}>
                {d}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Counter */}
      <View className="flex-1 items-center justify-center">
        {/* Current dhikr */}
        <Text
          style={{
            fontFamily: 'NotoNaskhArabic_700Bold',
            fontSize: 26,
            color: '#1A3C34',
            textAlign: 'center',
            marginBottom: 28,
          }}
        >
          {dhikrText}
        </Text>

        <CounterButton onPress={tap} count={count} goal={goal} />

        {/* Progress text */}
        <View className="mt-6 items-center">
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#6B7280' }}>
            {done ? '🎉 Objectif atteint !' : `${goal - count} restants`}
          </Text>
          {done && (
            <TouchableOpacity onPress={reset} className="mt-3 px-6 py-2.5 rounded-full" style={{ backgroundColor: '#1A3C34' }}>
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#C9A84C' }}>
                Recommencer
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
