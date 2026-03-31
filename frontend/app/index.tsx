import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { getSettings } from '../src/storage';

export default function Entry() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      const settings = await getSettings();
      if (settings.onboardingDone) {
        router.replace('/(tabs)' as any);
      } else {
        router.replace('/onboarding' as any);
      }
      setChecking(false);
    })();
  }, []);

  if (checking) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
