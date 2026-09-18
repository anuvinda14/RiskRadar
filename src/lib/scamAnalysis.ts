import type { AnalysisResult, CheckType, RiskLevel } from '@/types';
import { analyzeText, buildSummary } from '@/lib/scamAnalyzer';
import { fetchApiAnalysis } from '@/lib/scamApi';

interface ScamSignal {
  category: string;
  pattern: RegExp;
  reason: string;
  weight: number;
  step: string;
}

const SCAM_SIGNALS: ScamSignal[] = [
  {
    category: 'urgency',
    pattern: /urgent|immediately|right now|act now|last chance|expires today|deadline/i,
    reason: 'Creates a false sense of urgency to pressure you',
    weight: 20,
    step: 'Take your time. Real organizations never force you to act instantly.',
  },
  {
    category: 'prize',
    pattern: /lottery|winner|won|prize|jackpot|lucky draw|congratulations.{0,30}(win|prize|selected)/i,
    reason: 'Claims you won a prize or lottery you never entered',
    weight: 25,
    step: 'Never pay a fee to claim a prize. If you did not enter, you did not win.',
  },
  {
    category: 'investment',
    pattern: /bitcoin|crypto|investment|double your|guaranteed return|trading platform|deposit.{0,20}profit/i,
    reason: 'Promises unrealistic investment returns',
    weight: 25,
    step: 'Do not invest through unknown links. Check with a licensed financial advisor.',
  },
  {
    category: 'credential',
    pattern: /otp|one time password|verification code|cvv|pin number|password|card details/i,
    reason: 'Asks for sensitive financial or account information',
    weight: 30,
    step: 'Never share OTPs, PINs, or passwords. Banks never ask for these.',
  },
  {
    category: 'account',
    pattern: /bank account.{0,30}(details|number|verify)|kyc|account.{0,20}(suspend|block|freeze|close)/i,
    reason: 'Threatens to block or suspend your account',
    weight: 20,
    step: 'Contact your bank directly using the number on your card or statement.',
  },
  {
    category: 'suspicious_link',
    pattern: /click.{0,20}(link|here|below)|tap.{0,10}(link|here)|visit.{0,20}(link|url)/i,
    reason: 'Pushes you to click a suspicious link',
    weight: 15,
    step: 'Do not click unknown links. Type the website address yourself instead.',
  },
  {
    category: 'gift_card',
    pattern: /gift card|google play|itunes|amazon.{0,10}card|steam.{0,5}card/i,
    reason: 'Requests payment via gift cards',
    weight: 30,
    step: 'Gift cards are for gifts, not payments. No legitimate business asks for them.',
  },
  {
    category: 'money_transfer',
    pattern: /wire transfer|western union|moneygram|send money|transfer.{0,20}(funds|money)/i,
    reason: 'Requests a wire or money transfer',
    weight: 20,
    step: 'Never wire money to someone you have not met in person.',
  },
  {
    category: 'delivery',
    pattern: /delivery.{0,20}(fee|charge|pending|package)|custom.{0,10}(charge|fee|duty)|parcel.{0,10}(held|stuck)/i,
    reason: 'Fake package delivery or customs fee notice',
    weight: 20,
    step: 'Track packages only on the official courier website. Do not pay unknown fees.',
  },
  {
    category: 'tech_support',
    pattern: /tech support|microsoft.{0,10}(support|windows)|virus.{0,20}(detected|infected|your computer)|refund.{0,20}(department|support)/i,
    reason: 'Fake tech support or refund scam',
    weight: 25,
    step: 'Microsoft and Apple never call you about viruses. Hang up and do not call back.',
  },
  {
    category: 'government',
    pattern: /government|tax.{0,10}(refund|owe|department)|income tax.{0,20}(notice|refund|department|officer)|gst.{0,10}(refund|rebate)/i,
    reason: 'Impersonates a government or tax authority',
    weight: 20,
    step: 'Government agencies contact you by mail, not text or WhatsApp. Verify on the official website.',
  },
  {
    category: 'family',
    pattern: /relative|grandson|granddaughter|family member.{0,20}(hospital|accident|arrest|jail|bail)/i,
    reason: 'Fake family emergency or grandparent scam',
    weight: 25,
    step: 'Call your family member directly. Do not send money based on a text alone.',
  },
  {
    category: 'loan',
    pattern: /loan.{0,20}(approved| sanctioned|offer)|personal loan.{0,20}(instant|quick|no documents)/i,
    reason: 'Unsolicited loan offer',
    weight: 15,
    step: 'Only use banks or licensed lenders. Do not pay advance fees for loans.',
  },
  {
    category: 'free_reward',
    pattern: /free.{0,10}(gift|reward|voucher|coupon)|claim.{0,10}(now|free|reward)|limited.{0,10}(offer|stock)/i,
    reason: 'Offers free gifts or rewards to lure you in',
    weight: 10,
    step: 'If it sounds too good to be true, it probably is. Do not share your details.',
  },
];

const URL_SIGNALS: ScamSignal[] = [
  {
    category: 'url_shortener',
    pattern: /\b(bit\.ly|tinyurl|t\.co|goo\.gl|ow\.ly|is\.gd|buff\.ly|shorte\.st|cutt\.ly)\b/i,
    reason: 'Uses a link shortener that hides the real destination',
    weight: 15,
    step: 'Use a link expander tool to see where it really goes before clicking.',
  },
  {
    category: 'fake_login',
    pattern: /(login|signin|account|verify|update|secure|banking|wallet).{0,5}\.|\.{1}(login|signin|account|verify|update|secure)/i,
    reason: 'Link contains words commonly used in fake login pages',
    weight: 15,
    step: 'Do not enter passwords on links from messages. Go to the site directly.',
  },
  {
    category: 'raw_ip',
    pattern: /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/,
    reason: 'Uses a raw IP address instead of a proper domain name',
    weight: 20,
    step: 'Legitimate websites use domain names, not numbers. Do not trust this link.',
  },
  {
    category: 'at_symbol',
    pattern: /@/,
    reason: 'Contains an @ symbol that can disguise the real destination',
    weight: 10,
    step: 'The text before the @ is misleading. Check the real address carefully.',
  },
  {
    category: 'lookalike_domain',
    pattern: /-{2,}|[a-z0-9]-[a-z0-9]+-[a-z0-9]+\.[a-z]{2,}/i,
    reason: 'Uses extra dashes or look-alike domains to imitate real websites',
    weight: 15,
    step: 'Check the domain spelling letter by letter. Scammers swap letters to fool you.',
  },
];

const QR_SIGNALS: ScamSignal[] = [
  ...URL_SIGNALS,
  {
    category: 'qr_payment',
    pattern: /payment|paytm|gpay|phonepe|upi|bhim/i,
    reason: 'QR code may request a payment instead of receiving one',
    weight: 25,
    step: 'Scammers flip QR codes so you pay them. Always check if money goes out or comes in.',
  },
];

function scoreToLevel(score: number): RiskLevel {
  if (score >= 50) return 'high';
  if (score >= 20) return 'caution';
  return 'safe';
}

function analyzeWithSignals(text: string, signals: ScamSignal[]): { score: number; reasons: string[]; steps: string[]; detectedSignals: AnalysisResult['detectedSignals']; highlightedPhrases: string[] } {
  const matchedReasons: string[] = [];
  const matchedSteps: string[] = [];
  const detectedSignals: AnalysisResult['detectedSignals'] = [];
  const highlightedPhrases: string[] = [];
  let score = 0;

  for (const signal of signals) {
    const match = text.match(signal.pattern);
    if (match) {
      score += signal.weight;
      if (!matchedReasons.includes(signal.reason)) {
        matchedReasons.push(signal.reason);
        matchedSteps.push(signal.step);
        detectedSignals.push({ category: signal.category, description: signal.reason, matchedText: match[0], weight: signal.weight });
        highlightedPhrases.push(match[0]);
      }
    }
  }

  if (text.length < 10) score += 5;

  return { score: Math.min(score, 100), reasons: matchedReasons, steps: matchedSteps, detectedSignals, highlightedPhrases };
}

function defaultSteps(): string[] {
  return [
    'When in doubt, do not respond or click anything.',
    'Ask a family member or trusted friend for a second opinion.',
    'Report suspicious messages to your local cybercrime helpline.',
  ];
}

function localAnalyzeMessage(input: string, type: CheckType): Omit<AnalysisResult, 'id' | 'timestamp'> {
  const output = analyzeText(input);
  return {
    type,
    input,
    riskLevel: output.riskLevel,
    riskScore: output.riskScore,
    reasons: output.detectedSignals.map((s) => s.description),
    safetySteps: output.recommendedActions,
    detectedSignals: output.detectedSignals,
    highlightedPhrases: output.highlightedPhrases,
    summary: output.summary,
    recommendedActions: output.recommendedActions,
    prominentWarning: output.prominentWarning,
    apiSource: '',
    apiDisclaimer: '',
    apiPrediction: '',
    isOfflineFallback: true,
  };
}

export function analyzeContent(input: string, type: CheckType): Omit<AnalysisResult, 'id' | 'timestamp'> {
  if (type === 'message' || type === 'emailAd' || type === 'screenshot') {
    return localAnalyzeMessage(input, type);
  }

  let signals = SCAM_SIGNALS;
  if (type === 'url') signals = [...SCAM_SIGNALS, ...URL_SIGNALS];
  else if (type === 'qr') signals = [...SCAM_SIGNALS, ...QR_SIGNALS];
  else if (type === 'screenshot') signals = SCAM_SIGNALS;

  const { score, reasons, steps, detectedSignals, highlightedPhrases } = analyzeWithSignals(input, signals);
  const riskLevel = scoreToLevel(score);

  const finalReasons = reasons.length > 0 ? reasons : ['No strong scam signals detected, but stay alert.'];
  const finalSteps = steps.length > 0 ? steps : defaultSteps();

  return {
    type,
    input,
    riskLevel,
    riskScore: score,
    reasons: finalReasons,
    safetySteps: finalSteps,
    detectedSignals,
    highlightedPhrases,
    summary: '',
    recommendedActions: finalSteps,
    prominentWarning: '',
    apiSource: '',
    apiDisclaimer: '',
    apiPrediction: '',
    isOfflineFallback: false,
  };
}

export async function analyzeContentAsync(input: string, type: CheckType): Promise<Omit<AnalysisResult, 'id' | 'timestamp'>> {
  if (type !== 'message' && type !== 'emailAd' && type !== 'screenshot') {
    return analyzeContent(input, type);
  }

  const localResult = localAnalyzeMessage(input, type);

  try {
    const apiResponse = await fetchApiAnalysis(input);
    return {
      ...localResult,
      riskLevel: apiResponse.riskLevel,
      riskScore: apiResponse.riskScore,
      summary: localResult.prominentWarning
        ? 'Safety rules found a dangerous combination of requests. Read the warning below before acting.'
        : apiResponse.riskLevel === 'caution' && localResult.detectedSignals.length === 0
          ? 'The email-trained model is uncertain about this text. No specific warning signs were found by the text rules. Verify unexpected requests independently.'
          : buildSummary(apiResponse.riskLevel, localResult.detectedSignals.length),
      reasons: localResult.reasons.length ? localResult.reasons : ['No specific warning signs found by the text rules. This does not verify the sender.'],
      apiSource: apiResponse.model,
      apiDisclaimer: apiResponse.disclaimer,
      apiPrediction: apiResponse.prediction,
      isOfflineFallback: false,
    };
  } catch {
    return localResult;
  }
}

export function createAnalysisResult(input: string, type: CheckType): AnalysisResult {
  const partial = analyzeContent(input, type);
  return {
    ...partial,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
}

export async function createAnalysisResultAsync(input: string, type: CheckType): Promise<AnalysisResult> {
  const partial = await analyzeContentAsync(input, type);
  return {
    ...partial,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
}
