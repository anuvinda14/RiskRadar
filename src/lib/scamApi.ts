import type { RiskLevel } from '@/types';

export interface ApiAnalysisResponse {
  riskLevel: RiskLevel;
  riskScore: number;
  prediction: 'legitimate' | 'phishing';
  model: string;
  disclaimer: string;
}

const TIMEOUT_MS = 10_000;

function getBaseUrl(): string {
  const url = import.meta.env?.VITE_SCAM_API_URL;
  if (!url) throw new Error('VITE_SCAM_API_URL is not configured');
  return url.replace(/\/+$/, '');
}

export async function fetchApiAnalysis(text: string): Promise<ApiAnalysisResponse> {
  const baseUrl = getBaseUrl();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${baseUrl}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();

    if (!['safe', 'caution', 'high'].includes(data.riskLevel) ||
        typeof data.riskScore !== 'number' || !Number.isFinite(data.riskScore) ||
        data.riskScore < 0 || data.riskScore > 100 ||
        !['legitimate', 'phishing'].includes(data.prediction) ||
        typeof data.model !== 'string' || typeof data.disclaimer !== 'string') {
      throw new Error('API returned unexpected response format');
    }

    return {
      riskLevel: data.riskLevel as RiskLevel,
      riskScore: data.riskScore as number,
      prediction: data.prediction as 'legitimate' | 'phishing',
      model: data.model as string,
      disclaimer: data.disclaimer as string,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}
