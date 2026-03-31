import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { useTheme, FONTS } from '../../src/theme';

function TodayIcon({ color, size }: { color: string; size: number }) {
  return <Ionicons name="today-outline" size={size} color={color} />;
}

function CalendarIcon({ color, size }: { color: string; size: number }) {
  return <Ionicons name="calendar-outline" size={size} color={color} />;
}

function SettingsIcon({ color, size }: { color: string; size: number }) {
  return <Ionicons name="options-outline" size={size} color={color} />;
}

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarLabelStyle: {
          fontFamily: FONTS.mono,
          fontSize: 9,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Bugün',
          tabBarIcon: TodayIcon,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Geçmiş',
          tabBarIcon: CalendarIcon,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ayarlar',
          tabBarIcon: SettingsIcon,
        }}
      />
    </Tabs>
  );
}
