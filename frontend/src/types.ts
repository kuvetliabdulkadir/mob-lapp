export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface AppSettings {
  morningHour: number;
  morningMinute: number;
  theme: 'dark' | 'light';
  appIcon: 'dots' | 'lines' | 'squares';
  onboardingDone: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  morningHour: 8,
  morningMinute: 0,
  theme: 'dark',
  appIcon: 'dots',
  onboardingDone: false,
};
