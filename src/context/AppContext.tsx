import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Language, Settings, TrustedContact } from '@/types';
import { translations } from '@/i18n/translations';
import type { TranslationKey } from '@/i18n/translations';
import {
  DEFAULT_SETTINGS,
  clearTrustedContact,
  getSettings,
  getTrustedContact,
  saveSettings,
  saveTrustedContact,
} from '@/lib/storage';

export type Route =
  | { name: 'home' }
  | { name: 'learn' }
  | { name: 'scan' }
  | { name: 'profile' }
  | { name: 'check'; checkType: 'screenshot' | 'message' | 'url' | 'qr' | 'emailAd' }
  | { name: 'result'; resultId: string }
  | { name: 'contact' }
  | { name: 'history' }
  | { name: 'settings' };

interface AppContextValue {
  settings: Settings;
  setLanguage: (lang: Language) => void;
  toggleLargerText: () => void;
  toggleHighContrast: () => void;
  t: (key: TranslationKey) => string;
  route: Route;
  navigate: (route: Route) => void;
  goBack: () => void;
  trustedContact: TrustedContact | null;
  setContact: (contact: TrustedContact) => void;
  removeContact: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [route, setRoute] = useState<Route>({ name: 'home' });
  const [, setHistory] = useState<Route[]>([]);
  const [trustedContact, setTrustedContact] = useState<TrustedContact | null>(null);

  useEffect(() => {
    setSettings(getSettings());
    setTrustedContact(getTrustedContact());
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('larger-text', settings.largerText);
    root.classList.toggle('high-contrast', settings.highContrast);
    root.lang = settings.language;
  }, [settings]);

  const navigate = useCallback((next: Route) => {
    setHistory((prev) => [...prev, route]);
    setRoute(next);
    window.scrollTo(0, 0);
  }, [route]);

  const goBack = useCallback(() => {
    setHistory((prev) => {
      if (prev.length === 0) {
        setRoute({ name: 'home' });
        return prev;
      }
      const next = [...prev];
      const last = next.pop()!;
      setRoute(last);
      return next;
    });
    window.scrollTo(0, 0);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setSettings((prev) => {
      const updated = { ...prev, language: lang };
      saveSettings(updated);
      return updated;
    });
  }, []);

  const toggleLargerText = useCallback(() => {
    setSettings((prev) => {
      const updated = { ...prev, largerText: !prev.largerText };
      saveSettings(updated);
      return updated;
    });
  }, []);

  const toggleHighContrast = useCallback(() => {
    setSettings((prev) => {
      const updated = { ...prev, highContrast: !prev.highContrast };
      saveSettings(updated);
      return updated;
    });
  }, []);

  const setContact = useCallback((contact: TrustedContact) => {
    saveTrustedContact(contact);
    setTrustedContact(contact);
  }, []);

  const removeContact = useCallback(() => {
    clearTrustedContact();
    setTrustedContact(null);
  }, []);

  const t = useCallback(
    (key: TranslationKey) => translations[settings.language][key] ?? translations.en[key] ?? key,
    [settings.language],
  );

  const value = useMemo<AppContextValue>(
    () => ({
      settings,
      setLanguage,
      toggleLargerText,
      toggleHighContrast,
      t,
      route,
      navigate,
      goBack,
      trustedContact,
      setContact,
      removeContact,
    }),
    [settings, setLanguage, toggleLargerText, toggleHighContrast, t, route, navigate, goBack, trustedContact, setContact, removeContact],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
