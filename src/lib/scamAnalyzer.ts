import type { RiskLevel } from '@/types';

export interface DetectedSignal {
  category: string;
  description: string;
  matchedText: string;
  weight: number;
}

export interface AnalysisOutput {
  riskLevel: RiskLevel;
  riskScore: number;
  detectedSignals: DetectedSignal[];
  highlightedPhrases: string[];
  summary: string;
  recommendedActions: string[];
  prominentWarning: string;
}

interface ScamRule {
  category: string;
  pattern: RegExp;
  description: string;
  weight: number;
  action: string;
}

const SCAM_RULES: ScamRule[] = [
  {
    category: 'urgency',
    pattern: /urgent|immediately|right now|act now|last chance|expires today|deadline|within \d+ hours|before it.?s too late/i,
    description: 'Creates a false sense of urgency to pressure you into acting fast',
    weight: 18,
    action: 'Take your time. Real organizations never force you to act instantly.',
  },
  {
    category: 'account_suspension',
    pattern: /account.{0,20}(suspend|block|freeze|close|deactivate|disabled)|kyc.{0,20}(pending|required|update|verify)|your.{0,10}(account|card).{0,10}(will be|has been).{0,10}(block|suspend|close|freeze)/i,
    description: 'Threatens to suspend or block your account',
    weight: 20,
    action: 'Contact your bank or service directly using the number on your card or official website.',
  },
  {
    category: 'credential_request',
    pattern: /(?:share|provide|send|give|enter|tell).{0,20}(?:otp|one.?time.?password|verification.?code|cvv|pin.?number|card.?details|password)|(?:otp|cvv|pin.?number|card.?details).{0,20}(?:to|with|us|verify|confirm)/i,
    description: 'Asks you to share sensitive information like OTP, password, PIN, or card details',
    weight: 30,
    action: 'Never share OTPs, PINs, or passwords. Banks and legitimate services never ask for these.',
  },
  {
    category: 'payment_request',
    pattern: /pay.{0,15}(fee|charge|amount|rs\.?|₹|\$)|processing.?fee|registration.?fee|clearance.?fee|send.?money|wire.?transfer|western.?union|moneygram|google.?play.?card|itunes.?card|amazon.?card|gift.?card|upi.?id|scan.?to.?pay|deposit.{0,15}(amount|fee|money)/i,
    description: 'Requests payment, fees, or gift card purchases',
    weight: 28,
    action: 'Never pay fees to claim prizes or unlock accounts. Gift cards are never used for legitimate payments.',
  },
  {
    category: 'prize_giveaway',
    pattern: /lottery|winner|you.?ve.?won|won.{0,10}(rs\.?|₹|\$|prize|award|jackpot)|congratulations.{0,30}(win|prize|selected|winner)|lucky.?draw|free.?gift|claim.{0,10}(prize|reward|gift|voucher|coupon)|you.?have.?been.?selected/i,
    description: 'Claims you won a prize, lottery, or giveaway you never entered',
    weight: 25,
    action: 'If you did not enter a contest, you did not win. Never pay to claim a prize.',
  },
  {
    category: 'impersonation',
    pattern: /government|tax.{0,10}(refund|owe|department|officer)|income.?tax.{0,20}(notice|refund|officer)|gst.{0,10}(refund|rebate)|tech.?support|microsoft.{0,10}(support|windows)|apple.{0,10}(support|security)|virus.{0,20}(detected|infected|your.?computer)|refund.{0,20}(department|support|center)|your.{0,10}(relative|grandson|granddaughter|son|daughter).{0,20}(hospital|accident|arrest|jail|bail|emergency)|customs.{0,10}(charge|fee|duty)/i,
    description: 'Impersonates an authority, tech support, or creates a fake family emergency',
    weight: 22,
    action: 'Verify independently. Government agencies and tech companies never contact you this way. Call family directly.',
  },
  {
    category: 'suspicious_link',
    pattern: /click.{0,15}(here|link|below|this)|tap.{0,10}(here|link|below)|visit.{0,15}(link|url|site)|open.{0,10}(link|url)|go.?to.{0,30}(link|url|site|http)/i,
    description: 'Pushes you to click a link',
    weight: 12,
    action: 'Do not click unknown links. Type the website address yourself instead.',
  },
  {
    category: 'url_shortener',
    pattern: /\b(bit\.ly|tinyurl|t\.co|goo\.gl|ow\.ly|is\.gd|buff\.ly|shorte\.st|cutt\.ly|rebrand\.ly)\b/i,
    description: 'Contains a shortened link that hides the real destination',
    weight: 15,
    action: 'Shortened links hide where they really go. Use a link expander tool before clicking.',
  },
  {
    category: 'investment_scam',
    pattern: /bitcoin|crypto|double.?your|guaranteed.?return|trading.?platform|investment.{0,15}(opportunity|plan|returns)|deposit.{0,15}profit|earn.{0,10}(daily|weekly|guaranteed)|mining.{0,10}(pool|profit)/i,
    description: 'Promises unrealistic investment returns',
    weight: 22,
    action: 'Do not invest through unknown links. Consult a licensed financial advisor.',
  },
  {
    category: 'delivery_scam',
    pattern: /delivery.{0,20}(fee|charge|pending|failed|package)|parcel.{0,10}(held|stuck|waiting|undelivered)|courier.{0,10}(fee|charge|pending)|customs.{0,10}(charge|fee|duty|clearance)/i,
    description: 'Fake package delivery or customs fee notice',
    weight: 18,
    action: 'Track packages only on the official courier website. Do not pay unknown delivery fees.',
  },
  {
    category: 'act_immediately',
    pattern: /respond.{0,10}(now|immediately|today)|call.{0,10}(now|immediately|back.?now)|reply.{0,10}(now|immediately|yes|stop)|confirm.{0,10}(now|immediately|today)|don.?t.?ignore|do.?not.?ignore|ignore.{0,10}(this|at).{0,5}(your|own).{0,5}(risk|peril)/i,
    description: 'Pressures you to respond or act immediately',
    weight: 10,
    action: 'Legitimate messages give you time to think. Do not let pressure rush your decision.',
  },
];

// Remove only negated instructions, never suppress the whole message.
export function credentialRequest(text: string): string | undefined {
  const clauses = text.split(/[.!?;\n]|\bbut\b|\bhowever\b/i);
  for (const clause of clauses) {
    const cleaned = clause.replace(/\b(?:do not|don't|don’t|never)\s+(?:share|disclose|give|send|provide|tell|enter)\b[^,]*/gi, '');
    const match = cleaned.match(/\b(?:share|provide|send|give|enter|tell|disclose|forward)\b.{0,35}\b(?:otp|one[ -]?time[ -]?password|verification[ -]?code|code|cvv|pin|card[ -]?details|password)\b/i);
    if (match) return match[0];
  }
}

function scoreToLevel(score: number): RiskLevel {
  if (score >= 50) return 'high';
  if (score >= 20) return 'caution';
  return 'safe';
}

export function buildSummary(level: RiskLevel, signalCount: number): string {
  if (level === 'safe' && signalCount > 0) return 'Some warning signs were found despite a low score. Review them before acting.';
  if (level === 'safe') {
    return 'No strong warning detected. Verify unexpected requests independently.';
  }
  if (level === 'caution') {
    return 'This message may be suspicious. Verify the sender before acting.';
  }
  return 'Warning: This message shows strong scam indicators. Do not respond, click any links, or share any information.';
}

function defaultActions(): string[] {
  return [
    'When in doubt, do not respond or click anything.',
    'Ask a family member or trusted friend for a second opinion.',
    'Report suspicious messages to your local cybercrime helpline.',
  ];
}

function checkProminentWarning(signals: DetectedSignal[]): string {
  const categories = new Set(signals.map((s) => s.category));
  const hasAccountSuspension = categories.has('account_suspension');
  const hasCredentialRequest = categories.has('credential_request');
  const hasUrgency = categories.has('urgency');
  const hasPaymentRequest = categories.has('payment_request');

  if (hasAccountSuspension && hasCredentialRequest) {
    return 'This message threatens your account AND asks you to share an OTP or password. This is a classic phishing pattern — banks never ask for OTPs. Do not share any code.';
  }
  if (hasCredentialRequest && hasUrgency) {
    return 'This message pressures you to act fast AND asks for sensitive information. Do not share any OTP, password, or PIN under pressure.';
  }
  if (hasAccountSuspension && hasPaymentRequest) {
    return 'This message threatens your account AND asks for payment. Legitimate organizations never ask for payment to unlock accounts.';
  }
  return '';
}

export function analyzeText(text: string): AnalysisOutput {
  const detectedSignals: DetectedSignal[] = [];
  const highlightedPhrases: string[] = [];
  const actions: string[] = [];
  let score = 0;

  for (const rule of SCAM_RULES) {
    const credential = rule.category === 'credential_request' ? credentialRequest(text) : undefined;
    const match = rule.category === 'credential_request' ? (credential ? [credential] : null) : text.match(rule.pattern);
    if (match) {
      const matchedText = match[0];
      score += rule.weight;
      detectedSignals.push({
        category: rule.category,
        description: rule.description,
        matchedText,
        weight: rule.weight,
      });
      actions.push(rule.action);
      if (!highlightedPhrases.includes(matchedText)) {
        highlightedPhrases.push(matchedText);
      }
    }
  }

  if (text.trim().length < 10) score += 5;

  const finalScore = Math.min(score, 100);
  const riskLevel = scoreToLevel(finalScore);
  const recommendedActions = detectedSignals.length > 0
    ? deduplicateActions(actions)
    : defaultActions();
  const prominentWarning = checkProminentWarning(detectedSignals);

  return {
    riskLevel,
    riskScore: finalScore,
    detectedSignals,
    highlightedPhrases,
    summary: buildSummary(riskLevel, detectedSignals.length),
    recommendedActions,
    prominentWarning,
  };
}

function deduplicateActions(actions: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const action of actions) {
    if (!seen.has(action)) {
      seen.add(action);
      result.push(action);
    }
  }
  return result;
}

export interface BuiltInExample {
  label: string;
  text: string;
  expectedRisk: RiskLevel;
}

export const BUILT_IN_EXAMPLES: BuiltInExample[] = [
  {
    label: 'Safe Example',
    text: 'Hi Mom, just wanted to check in and see how you are doing. Let me know if you need anything from the store. I will come visit this weekend. Love you!',
    expectedRisk: 'safe',
  },
  {
    label: 'Caution Example',
    text: 'Dear customer, your KYC verification is pending. Please update your account details to avoid service disruption. Click here to verify: https://tinyurl.com/kyc-update',
    expectedRisk: 'caution',
  },
  {
    label: 'High Risk Example',
    text: 'URGENT! Your account will be suspended within 24 hours. Congratulations, you have won Rs 5,00,000 in our lucky draw! To claim your prize, pay a Rs 5,000 processing fee via Google Play gift cards. Share your OTP and card details to verify. Act now! Click here: http://bit.ly/claim-prize-now',
    expectedRisk: 'high',
  },
];
