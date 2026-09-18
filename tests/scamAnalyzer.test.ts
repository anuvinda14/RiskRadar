import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { analyzeText, buildSummary } from '../src/lib/scamAnalyzer.ts';

describe('buildSummary', () => {
  it('safe level does not guarantee safety', () => {
    const summary = buildSummary('safe', 0);
    assert.ok(!summary.toLowerCase().includes('relatively safe') || summary.toLowerCase().includes('cautious'));
    assert.ok(summary.toLowerCase().includes('no strong warning'));
  });

  it('caution level says message may be suspicious', () => {
    const summary = buildSummary('caution', 2);
    assert.ok(summary.toLowerCase().includes('may be suspicious'));
    assert.ok(summary.toLowerCase().includes('verify the sender'));
  });

  it('high level shows clear warning', () => {
    const summary = buildSummary('high', 4);
    assert.ok(summary.toLowerCase().includes('warning'));
    assert.ok(summary.toLowerCase().includes('do not respond'));
  });
});

describe('analyzeText — OTP detection', () => {
  it('detects a request to share an OTP', () => {
    const text = 'Your account is suspended. Please share your OTP to verify your identity.';
    const result = analyzeText(text);
    const hasCredentialRequest = result.detectedSignals.some((s) => s.category === 'credential_request');
    assert.ok(hasCredentialRequest, 'Should detect credential_request for "share your OTP"');
    assert.ok(result.highlightedPhrases.some((p) => /otp/i.test(p)));
  });

  it('does NOT flag a legitimate "do not share your OTP" message', () => {
    const text = 'Dear customer, your OTP is 123456. Do not share this OTP with anyone. We will never ask for it.';
    const result = analyzeText(text);
    const hasCredentialRequest = result.detectedSignals.some((s) => s.category === 'credential_request');
    assert.ok(!hasCredentialRequest, 'Should NOT flag "do not share your OTP" as credential_request');
  });

  it('does NOT flag "never share your OTP" as a credential request', () => {
    const text = 'Reminder: Never share your OTP or PIN with anyone, even bank staff.';
    const result = analyzeText(text);
    const hasCredentialRequest = result.detectedSignals.some((s) => s.category === 'credential_request');
    assert.ok(!hasCredentialRequest, 'Should NOT flag "never share your OTP" as credential_request');
  });
});

describe('analyzeText — urgency and account suspension', () => {
  it('detects urgency signals', () => {
    const text = 'URGENT! Your account will be suspended within 24 hours. Act now!';
    const result = analyzeText(text);
    const hasUrgency = result.detectedSignals.some((s) => s.category === 'urgency');
    assert.ok(hasUrgency, 'Should detect urgency');
  });

  it('detects account suspension threats', () => {
    const text = 'Your account will be suspended. Please verify immediately.';
    const result = analyzeText(text);
    const hasSuspension = result.detectedSignals.some((s) => s.category === 'account_suspension');
    assert.ok(hasSuspension, 'Should detect account_suspension');
  });
});

describe('analyzeText — prominent warning for strong combos', () => {
  it('shows prominent warning for account suspension + OTP request', () => {
    const text = 'URGENT! Your account will be suspended within 24 hours. Share your OTP to verify and prevent suspension.';
    const result = analyzeText(text);
    assert.ok(result.prominentWarning.length > 0, 'Should have a prominent warning');
    assert.ok(result.prominentWarning.toLowerCase().includes('otp'), 'Warning should mention OTP');
  });

  it('shows prominent warning for urgency + credential request', () => {
    const text = 'Act now! Share your password and CVV to confirm your identity immediately.';
    const result = analyzeText(text);
    assert.ok(result.prominentWarning.length > 0, 'Should have a prominent warning for urgency + credential');
  });

  it('does NOT show prominent warning for a safe message', () => {
    const text = 'Hi Mom, just checking in. Hope you are well. Love you!';
    const result = analyzeText(text);
    assert.equal(result.prominentWarning, '', 'Should not have prominent warning for safe message');
  });
});

describe('analyzeText — conflicting summary/score consistency', () => {
  it('summary always matches the final risk level', () => {
    const texts = [
      'Hi Mom, just checking in. Hope you are well.',
      'Dear customer, your KYC is pending. Click here to verify: https://tinyurl.com/abc',
      'URGENT! Your account will be suspended. Share your OTP and pay Rs 5000 via gift cards. Act now!',
    ];
    for (const text of texts) {
      const result = analyzeText(text);
      if (result.riskLevel === 'safe') {
        assert.ok(result.summary.toLowerCase().includes('no strong warning'), `Safe summary mismatch for: ${text}`);
      } else if (result.riskLevel === 'caution') {
        assert.ok(result.summary.toLowerCase().includes('may be suspicious'), `Caution summary mismatch for: ${text}`);
      } else {
        assert.ok(result.summary.toLowerCase().includes('warning'), `High summary mismatch for: ${text}`);
      }
    }
  });

  it('caution score produces caution summary, not safe', () => {
    const text = 'Dear customer, your KYC verification is pending. Please update your account details to avoid service disruption. Click here to verify: https://tinyurl.com/kyc-update';
    const result = analyzeText(text);
    assert.ok(result.riskScore >= 20 && result.riskScore < 50, 'Should be in caution range');
    assert.equal(result.riskLevel, 'caution');
    assert.ok(!result.summary.toLowerCase().includes('relatively safe'), 'Caution should not say "relatively safe"');
    assert.ok(result.summary.toLowerCase().includes('may be suspicious'), 'Caution should say "may be suspicious"');
  });
});
