import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { I18nManager, Platform, ViewStyle, TextStyle } from 'react-native';
import * as Localization from 'expo-localization';
import { getSettings, saveSettings } from './storage';
import {
  Language, Translations, SUPPORTED_LANGUAGES,
  translations, formatLocalizedDate, getMonthName, getDayShorts,
} from './i18n';

interface RTLStyles {
  row: ViewStyle;
  rowReverse: ViewStyle;
  textAlign: TextStyle;
  writingDirection: TextStyle;
}

interface LanguageContextType {
  lang: Language;
  t: Translations;
  isRTL: boolean;
  setLanguage: (lang: Language) => Promise<void>;
  formatDate: (date: Date) => string;
  monthName: (month: number) => string;
  dayShorts: string[];
  rtl: RTLStyles;
}

const fallback: LanguageContextType = {
  lang: 'en',
  t: translations.en,
  isRTL: false,
  setLanguage: async () => {},
  formatDate: () => '',
  monthName: () => '',
  dayShorts: translations.en.daysShort,
  rtl: {
    row: { flexDirection: 'row' },
    rowReverse: { flexDirection: 'row-reverse' },
    textAlign: { textAlign: 'left' },
    writingDirection: { writingDirection: 'ltr' },
  },
};

const LanguageContext = createContext<LanguageContextType>(fallback);
export const useLanguage = () => useContext(LanguageContext);

function detectDeviceLanguage(): Language {
  try {
    const locales = Localization.getLocales();
    const deviceCode = locales?.[0]?.languageCode ?? 'en';
    const match = SUPPORTED_LANGUAGES.find(l => l.code === deviceCode);
    return match ? match.code : 'en';
  } catch {
    return 'en';
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('en');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const settings = await getSettings();
      if (settings.language && SUPPORTED_LANGUAGES.some(l => l.code === settings.language)) {
        setLang(settings.language as Language);
      } else {
        const detected = detectDeviceLanguage();
        setLang(detected);
        await saveSettings({ ...settings, language: detected });
      }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const shouldRTL = lang === 'ar';
    if (I18nManager.isRTL !== shouldRTL) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(shouldRTL);
    }
  }, [lang, loaded]);

  const setLanguage = useCallback(async (newLang: Language) => {
    setLang(newLang);
    const settings = await getSettings();
    await saveSettings({ ...settings, language: newLang });
  }, []);

  const isRTL = lang === 'ar';

  const formatDate = useCallback(
    (date: Date) => formatLocalizedDate(date, lang),
    [lang],
  );

  const mName = useCallback(
    (month: number) => getMonthName(month, lang),
    [lang],
  );

  const dayShorts = getDayShorts(lang);

  const rtl: RTLStyles = {
    row: { flexDirection: isRTL ? 'row-reverse' : 'row' } as ViewStyle,
    rowReverse: { flexDirection: isRTL ? 'row' : 'row-reverse' } as ViewStyle,
    textAlign: { textAlign: isRTL ? 'right' : 'left' } as TextStyle,
    writingDirection: { writingDirection: isRTL ? 'rtl' : 'ltr' } as TextStyle,
  };

  if (!loaded) return null;

  return (
    <LanguageContext.Provider
      value={{ lang, t: translations[lang], isRTL, setLanguage, formatDate, monthName: mName, dayShorts, rtl }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
