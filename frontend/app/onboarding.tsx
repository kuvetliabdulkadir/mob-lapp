import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, FONTS } from '../src/theme';
import { getSettings, saveSettings } from '../src/storage';
import { requestNotificationPermissions, scheduleDailyNotifications } from '../src/notifications';

export default function Onboarding() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const handleStart = async () => {
    const settings = await getSettings();
    settings.onboardingDone = true;
    await saveSettings(settings);

    const granted = await requestNotificationPermissions();
    if (granted) {
      await scheduleDailyNotifications(settings.morningHour, settings.morningMinute);
    }

    router.replace('/(tabs)' as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.content}>
        <Text style={[styles.quote, { color: colors.textPrimary, fontFamily: FONTS.serif }]}>
          Sen her şeyi yapmaya çalışıyorsun.
        </Text>
        <Text style={[styles.quoteSecond, { color: colors.accent, fontFamily: FONTS.serif }]}>
          Bu yüzden hiçbirini bitiremiyorsun.
        </Text>
      </View>

      <TouchableOpacity
        testID="start-button"
        style={[styles.button, { backgroundColor: colors.accent, marginBottom: insets.bottom + 32 }]}
        onPress={handleStart}
        activeOpacity={0.8}
      >
        <Text style={[styles.buttonText, { fontFamily: FONTS.mono }]}>BAŞLA</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  quote: {
    fontSize: 36,
    lineHeight: 48,
    letterSpacing: -0.5,
  },
  quoteSecond: {
    fontSize: 36,
    lineHeight: 48,
    letterSpacing: -0.5,
    marginTop: 8,
  },
  button: {
    marginHorizontal: 32,
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonText: {
    color: '#0A0A0A',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 3,
  },
});
