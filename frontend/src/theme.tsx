import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { getSettings, saveSettings } from './storage';

export const DARK_COLORS = {
  background: '#0A0A0A',
  surface: '#141414',
  textPrimary: '#EAE6DF',
  textSecondary: '#737373',
  accent: '#FF6B00',
  success: '#34D399',
  partial: '#FBBF24',
  fail: '#F87171',
  border: 'rgba(234, 230, 223, 0.12)',
  tabBar: '#0A0A0A',
  tabInactive: '#555555',
};

export const LIGHT_COLORS = {
  background: '#F5F2ED',
  surface: '#FFFFFF',
  textPrimary: '#1A1A1A',
  textSecondary: '#999999',
  accent: '#FF6B00',
  success: '#34D399',
  partial: '#FBBF24',
  fail: '#F87171',
  border: 'rgba(0, 0, 0, 0.08)',
  tabBar: '#F5F2ED',
  tabInactive: '#BBBBBB',
};

export type ThemeColors = typeof DARK_COLORS;

export const FONTS = {
  serif: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' }) as string,
  mono: Platform.select({ ios: 'Courier New', android: 'monospace', default: 'Courier New' }) as string,
};

interface ThemeContextType {
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  colors: DARK_COLORS,
  isDark: true,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getSettings().then(s => {
      setIsDark(s.theme === 'dark');
      setLoaded(true);
    });
  }, []);

  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    const settings = await getSettings();
    settings.theme = next ? 'dark' : 'light';
    await saveSettings(settings);
  };

  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

  if (!loaded) return null;

  return (
    <ThemeContext.Provider value={{ colors, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
