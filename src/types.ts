export type RiskLevel = 'safe' | 'caution' | 'high';

export type CheckType = 'screenshot' | 'message' | 'url' | 'qr' | 'emailAd';

export type Language = 'en' | 'hi' | 'bn' | 'ta' | 'te' | 'ml';

export type MessageCategory = 'advertisement' | 'banking' | 'possible_fraud' | 'phishing' | 'otp' | 'delivery' | 'work' | 'personal' | 'social_media' | 'unknown';

export interface SenderRiskProfile {
  id: string;
  displayName: string;
  reports: number;
  suspiciousScans: number;
  notSpam: number;
  blocked: boolean;
  categories: MessageCategory[];
  lastActivity: number;
}

export interface DetectedSignal {
  category: string;
  description: string;
  matchedText: string;
  weight: number;
}

export interface AnalysisResult {
  id: string;
  type: CheckType;
  input: string;
  riskLevel: RiskLevel;
  riskScore: number;
  reasons: string[];
  safetySteps: string[];
  detectedSignals: DetectedSignal[];
  highlightedPhrases: string[];
  summary: string;
  recommendedActions: string[];
  prominentWarning: string;
  timestamp: number;
  apiSource: string;
  apiDisclaimer: string;
  apiPrediction: string;
  isOfflineFallback: boolean;
  category?: MessageCategory;
  sender?: string;
}

export interface TrustedContact {
  name: string;
  phone: string;
  email: string;
}

export interface Settings {
  language: Language;
  largerText: boolean;
  highContrast: boolean;
}

export const LANGUAGES: { code: Language; label: string; nativeLabel: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { code: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം' },
];
