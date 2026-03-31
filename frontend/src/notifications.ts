import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return true;
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
}

export async function scheduleDailyNotifications(morningHour: number, morningMinute: number) {
  if (Platform.OS === 'web') return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Morning: "Bugünün 3 görevi ne?"
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Daily Focus Stack',
        body: 'Bugünün 3 görevi ne?',
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: morningHour,
        minute: morningMinute,
      },
    });

    // Evening 21:00: "Gün bitiyor. Kaç tanesini tamamladın?"
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Daily Focus Stack',
        body: 'Gün bitiyor. Kaç tanesini tamamladın?',
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 21,
        minute: 0,
      },
    });
  } catch (e) {
    console.log('Notification scheduling error:', e);
  }
}
