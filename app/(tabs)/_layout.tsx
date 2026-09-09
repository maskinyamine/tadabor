import { Tabs } from 'expo-router';
import { View, Text, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type TabIconProps = {
  name: string;
  library?: 'ionicons' | 'material';
  focused: boolean;
  label: string;
};

function TabIcon({ name, library = 'ionicons', focused, label }: TabIconProps) {
  const color = focused ? '#C9A84C' : '#9CA3AF';
  const size = 24;

  return (
    <View className="items-center justify-center pt-1 gap-0.5">
      {library === 'ionicons' ? (
        <Ionicons name={name as any} size={size} color={color} />
      ) : (
        <MaterialCommunityIcons name={name as any} size={size} color={color} />
      )}
      <Text
        style={{
          fontFamily: 'Inter_500Medium',
          fontSize: 10,
          color,
          marginTop: 2,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="sunny-outline" focused={focused} label="يومي" />
          ),
        }}
      />
      <Tabs.Screen
        name="athkar"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="apps-outline" focused={focused} label="أخرى" />
          ),
        }}
      />
      <Tabs.Screen
        name="prayer"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="quran"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="book-outline" focused={focused} label="القرآن" />
          ),
        }}
      />
      <Tabs.Screen
        name="hadith"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="library-outline" focused={focused} label="حديث" />
          ),
        }}
      />
      <Tabs.Screen
        name="tasbih"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="counter"
              library="material"
              focused={focused}
              label="تسبيح"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tadabor"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
