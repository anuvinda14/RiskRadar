import type { AnalysisResult, Settings, TrustedContact } from '@/types';

const KEYS = {
  history: 'eldersafe_history',
  contact: 'eldersafe_contact',
  settings: 'eldersafe_settings',
};

export const DEFAULT_SETTINGS: Settings = {
  language: 'en',
  largerText: false,
  highContrast: false,
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or unavailable
  }
}

export function getHistory(): AnalysisResult[] {
  return read<AnalysisResult[]>(KEYS.history, []);
}

export function saveHistoryEntry(entry: AnalysisResult): void {
  const history = getHistory();
  history.unshift(entry);
  write(KEYS.history, history.slice(0, 100));
}

export function clearHistory(): void {
  localStorage.removeItem(KEYS.history);
}

export function deleteHistoryEntry(id: string): void {
  const history = getHistory().filter((e) => e.id !== id);
  write(KEYS.history, history);
}

export function getHistoryEntry(id: string): AnalysisResult | undefined {
  return getHistory().find((e) => e.id === id);
}

export function getTrustedContact(): TrustedContact | null {
  return read<TrustedContact | null>(KEYS.contact, null);
}

export function saveTrustedContact(contact: TrustedContact): void {
  write(KEYS.contact, contact);
}

export function clearTrustedContact(): void {
  localStorage.removeItem(KEYS.contact);
}

export function getSettings(): Settings {
  return { ...DEFAULT_SETTINGS, ...read<Partial<Settings>>(KEYS.settings, {}) };
}

export function saveSettings(settings: Settings): void {
  write(KEYS.settings, settings);
}
