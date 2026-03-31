import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, AppSettings, DEFAULT_SETTINGS } from './types';

const SETTINGS_KEY = '@daily_focus_settings';
const TASKS_PREFIX = '@daily_focus_tasks_';

export async function getSettings(): Promise<AppSettings> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export async function getTasksForDate(dateStr: string): Promise<Task[]> {
  try {
    const raw = await AsyncStorage.getItem(TASKS_PREFIX + dateStr);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function saveTasksForDate(dateStr: string, tasks: Task[]): Promise<void> {
  await AsyncStorage.setItem(TASKS_PREFIX + dateStr, JSON.stringify(tasks));
}

export async function getAllTaskDates(): Promise<string[]> {
  const keys = await AsyncStorage.getAllKeys();
  return keys
    .filter(k => k.startsWith(TASKS_PREFIX))
    .map(k => k.replace(TASKS_PREFIX, ''))
    .sort();
}

export async function getDayCompletionMap(): Promise<Record<string, { total: number; completed: number }>> {
  const dates = await getAllTaskDates();
  const result: Record<string, { total: number; completed: number }> = {};
  for (const date of dates) {
    const tasks = await getTasksForDate(date);
    result[date] = {
      total: tasks.length,
      completed: tasks.filter(t => t.completed).length,
    };
  }
  return result;
}

export function calculateStreak(data: Record<string, { total: number; completed: number }>): number {
  let streak = 0;
  const checkDate = new Date();
  const todayStr = toDateStr(checkDate);
  const todayData = data[todayStr];
  if (todayData && todayData.total === 3 && todayData.completed === 3) {
    streak = 1;
    checkDate.setDate(checkDate.getDate() - 1);
  } else {
    checkDate.setDate(checkDate.getDate() - 1);
  }
  for (let i = 0; i < 365; i++) {
    const dateStr = toDateStr(checkDate);
    const dayData = data[dateStr];
    if (dayData && dayData.total === 3 && dayData.completed === 3) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export function toDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
