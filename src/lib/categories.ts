import type { AnalysisResult, CheckType, MessageCategory, RiskLevel } from '@/types';

export const MESSAGE_CATEGORIES: MessageCategory[] = ['advertisement','banking','possible_fraud','phishing','otp','delivery','work','personal','social_media','unknown'];

export function categorizeMessage(input: string, type: CheckType, riskLevel: RiskLevel, signalCategories: string[] = []): MessageCategory {
  const text = input.toLowerCase();
  const signals = new Set(signalCategories);
  if (signals.has('credential_request') || signals.has('suspicious_link') || signals.has('url_shortener') || signals.has('fake_login') || type === 'qr' && riskLevel !== 'safe') return 'phishing';
  if (riskLevel === 'high' || signals.has('payment_request') || signals.has('gift_card') || signals.has('money_transfer') || signals.has('prize_giveaway') || signals.has('prize')) return 'possible_fraud';
  if (/\botp\b|one.?time.?password|verification code|login code|authentication code/i.test(input)) return 'otp';
  if (/bank|account|card|upi|payment|loan|kyc|credit|debit|₹|\brs\.?\b|finance/i.test(text)) return 'banking';
  if (/parcel|package|delivery|courier|shipment|tracking|order/i.test(text)) return 'delivery';
  if (/sale|offer|discount|buy now|limited stock|subscribe|unsubscribe|promotion|advertis/i.test(text) || type === 'emailAd') return 'advertisement';
  if (/job|interview|salary|office|meeting|assignment|project|client|resume|work/i.test(text)) return 'work';
  if (/instagram|facebook|whatsapp|telegram|snapchat|social media|follow|like your post/i.test(text)) return 'social_media';
  if (/mom|dad|mother|father|friend|family|love you|birthday|dinner|home/i.test(text)) return 'personal';
  return 'unknown';
}

export function categoryForResult(result: Pick<AnalysisResult, 'input' | 'type' | 'riskLevel' | 'detectedSignals' | 'category'>): MessageCategory {
  return result.category ?? categorizeMessage(result.input, result.type, result.riskLevel, result.detectedSignals.map((signal) => signal.category));
}

export function senderIdentifier(result: Pick<AnalysisResult, 'sender' | 'input' | 'type'>): string {
  if (result.sender?.trim()) return result.sender.trim();
  if (result.type === 'url' || result.type === 'qr') {
    try {
      const candidate = result.input.startsWith('http') ? result.input : `https://${result.input}`;
      return new URL(candidate).hostname;
    } catch {
      return '';
    }
  }
  return '';
}
