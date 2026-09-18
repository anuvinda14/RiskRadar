import type { AnalysisResult, MessageCategory, SenderRiskProfile, Settings, TrustedContact } from '@/types';

const KEYS = {
  history: 'eldersafe_history',
  contact: 'eldersafe_contact',
  settings: 'eldersafe_settings',
  senders: 'riskradar_sender_profiles',
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
  const safeEntry = { ...entry, input: minimizeStoredContent(entry.input) };
  history.unshift(safeEntry);
  write(KEYS.history, history.slice(0, 100));
}

export function minimizeStoredContent(input: string): string {
  return input
    .replace(/\b(otp|pin|cvv|password|verification code|login code)(\s*(?:is|:)?\s*)[a-z0-9-]{3,16}\b/gi, '$1$2[redacted]')
    .replace(/\b(?:\d[ -]*?){12,19}\b/g, '[redacted card number]')
    .slice(0, 1200);
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

export function getSenderProfiles(): SenderRiskProfile[] {
  return read<SenderRiskProfile[]>(KEYS.senders, []);
}

export function updateSenderProfile(displayName: string, action: 'report' | 'block' | 'notSpam', category: MessageCategory, suspicious: boolean): SenderRiskProfile {
  const normalized = displayName.trim().toLowerCase();
  const profiles = getSenderProfiles();
  const existing = profiles.find((profile) => profile.id === normalized);
  const profile: SenderRiskProfile = existing ?? { id: normalized, displayName: displayName.trim(), reports: 0, suspiciousScans: 0, notSpam: 0, blocked: false, categories: [], lastActivity: Date.now() };
  if (action === 'report') profile.reports += 1;
  if (action === 'block') profile.blocked = true;
  if (action === 'notSpam') profile.notSpam += 1;
  if (suspicious) profile.suspiciousScans += 1;
  if (!profile.categories.includes(category)) profile.categories.push(category);
  profile.lastActivity = Date.now();
  write(KEYS.senders, [profile, ...profiles.filter((item) => item.id !== normalized)].slice(0, 100));
  return profile;
}

export function clearSenderProfiles(): void {
  localStorage.removeItem(KEYS.senders);
}

export function exportLocalData(): string {
  return JSON.stringify({ exportedAt: new Date().toISOString(), history: getHistory(), trustedContact: getTrustedContact(), settings: getSettings(), senderProfiles: getSenderProfiles() }, null, 2);
}
