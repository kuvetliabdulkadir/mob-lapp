import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, Platform } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, FONTS } from '../../src/theme';
import { AppSettings } from '../../src/types';
import { getSettings, saveSettings } from '../../src/storage';
import { requestNotificationPermissions, scheduleDailyNotifications } from '../../src/notifications';

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useFocusEffect(
    useCallback(() => {
      getSettings().then(setSettings);
    }, [])
  );

  async function updateSettings(patch: Partial<AppSettings>) {
    if (!settings) return;
    const updated = { ...settings, ...patch };
    setSettings(updated);
    await saveSettings(updated);
  }

  async function changeHour(delta: number) {
    if (!settings) return;
    let h = settings.morningHour + delta;
    if (h < 0) h = 23;
    if (h > 23) h = 0;
    await updateSettings({ morningHour: h });
    await reschedule(h, settings.morningMinute);
  }

  async function changeMinute(delta: number) {
    if (!settings) return;
    let m = settings.morningMinute + delta;
    if (m < 0) m = 55;
    if (m > 59) m = 0;
    // Round to 5-minute increments
    m = Math.round(m / 5) * 5;
    if (m >= 60) m = 0;
    await updateSettings({ morningMinute: m });
    await reschedule(settings.morningHour, m);
  }

  async function reschedule(h: number, m: number) {
    const granted = await requestNotificationPermissions();
    if (granted) {
      await scheduleDailyNotifications(h, m);
    }
  }

  async function handleThemeToggle() {
    await toggleTheme();
    if (settings) {
      await updateSettings({ theme: isDark ? 'light' : 'dark' });
    }
  }

  async function selectIcon(icon: 'dots' | 'lines' | 'squares') {
    await updateSettings({ appIcon: icon });
  }

  if (!settings) return null;

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <ScrollView
      testID="settings-screen"
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
    >
      <Text style={[styles.title, { color: colors.textPrimary, fontFamily: FONTS.serif }]}>
        Ayarlar
      </Text>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* Notification Time */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary, fontFamily: FONTS.mono }]}>
          SABAH BİLDİRİMİ
        </Text>
        <View style={styles.timeRow}>
          <View style={styles.timeGroup}>
            <TouchableOpacity
              testID="hour-up-btn"
              style={[styles.timeBtn, { borderColor: colors.border }]}
              onPress={() => changeHour(1)}
            >
              <Ionicons name="chevron-up" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text testID="time-picker" style={[styles.timeValue, { color: colors.textPrimary, fontFamily: FONTS.mono }]}>
              {pad(settings.morningHour)}
            </Text>
            <TouchableOpacity
              testID="hour-down-btn"
              style={[styles.timeBtn, { borderColor: colors.border }]}
              onPress={() => changeHour(-1)}
            >
              <Ionicons name="chevron-down" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.timeSep, { color: colors.textSecondary, fontFamily: FONTS.mono }]}>:</Text>
          <View style={styles.timeGroup}>
            <TouchableOpacity
              testID="minute-up-btn"
              style={[styles.timeBtn, { borderColor: colors.border }]}
              onPress={() => changeMinute(5)}
            >
              <Ionicons name="chevron-up" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.minuteValue, { color: colors.textPrimary, fontFamily: FONTS.mono }]}>
              {pad(settings.morningMinute)}
            </Text>
            <TouchableOpacity
              testID="minute-down-btn"
              style={[styles.timeBtn, { borderColor: colors.border }]}
              onPress={() => changeMinute(-5)}
            >
              <Ionicons name="chevron-down" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* Theme Toggle */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary, fontFamily: FONTS.mono }]}>
          TEMA
        </Text>
        <TouchableOpacity
          testID="theme-toggle"
          style={styles.themeRow}
          onPress={handleThemeToggle}
          activeOpacity={0.7}
        >
          <View style={styles.themeInfo}>
            <Ionicons
              name={isDark ? 'moon' : 'sunny'}
              size={22}
              color={colors.textPrimary}
            />
            <Text style={[styles.themeText, { color: colors.textPrimary, fontFamily: FONTS.mono }]}>
              {isDark ? 'Karanlık' : 'Açık'}
            </Text>
          </View>
          <View style={[
            styles.toggleTrack,
            { backgroundColor: isDark ? colors.accent : colors.textSecondary }
          ]}>
            <View style={[
              styles.toggleThumb,
              { left: isDark ? 24 : 2, backgroundColor: '#FFF' }
            ]} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* App Icon */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary, fontFamily: FONTS.mono }]}>
          UYGULAMA İKONU
        </Text>
        <View style={styles.iconRow}>
          {[
            { key: 'dots' as const, icon: 'ellipsis-horizontal' as const, label: 'Noktalar' },
            { key: 'lines' as const, icon: 'reorder-three' as const, label: 'Çizgiler' },
            { key: 'squares' as const, icon: 'grid-outline' as const, label: 'Kareler' },
          ].map(item => (
            <TouchableOpacity
              key={item.key}
              testID={`icon-${item.key}`}
              style={[
                styles.iconOption,
                { borderColor: settings.appIcon === item.key ? colors.accent : colors.border },
              ]}
              onPress={() => selectIcon(item.key)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={item.icon}
                size={28}
                color={settings.appIcon === item.key ? colors.accent : colors.textSecondary}
              />
              <Text style={[
                styles.iconLabel,
                {
                  color: settings.appIcon === item.key ? colors.accent : colors.textSecondary,
                  fontFamily: FONTS.mono,
                },
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* App Info */}
      <View style={[styles.section, { alignItems: 'center', paddingVertical: 32 }]}>
        <Text style={[styles.appName, { color: colors.textSecondary, fontFamily: FONTS.mono }]}>
          DAILY FOCUS STACK
        </Text>
        <Text style={[styles.appVersion, { color: colors.textSecondary, fontFamily: FONTS.mono }]}>
          v1.0.0 — $1.99
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 28, paddingBottom: 40 },
  title: { fontSize: 32, letterSpacing: -0.5, marginBottom: 8 },
  divider: { height: 1, marginVertical: 16 },
  section: { paddingVertical: 8 },
  sectionLabel: { fontSize: 11, letterSpacing: 3, marginBottom: 16 },
  timeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  timeGroup: { alignItems: 'center', gap: 8 },
  timeBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  timeValue: { fontSize: 36, lineHeight: 42, letterSpacing: 2 },
  minuteValue: { fontSize: 36, lineHeight: 42, letterSpacing: 2 },
  timeSep: { fontSize: 36, marginHorizontal: 4 },
  themeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  themeInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  themeText: { fontSize: 16 },
  toggleTrack: { width: 48, height: 26, borderRadius: 0, justifyContent: 'center', position: 'relative' },
  toggleThumb: { width: 22, height: 22, borderRadius: 0, position: 'absolute' },
  iconRow: { flexDirection: 'row', gap: 12 },
  iconOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderWidth: 1,
    gap: 8,
  },
  iconLabel: { fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' },
  appName: { fontSize: 11, letterSpacing: 3 },
  appVersion: { fontSize: 10, letterSpacing: 1, marginTop: 4, opacity: 0.6 },
});
