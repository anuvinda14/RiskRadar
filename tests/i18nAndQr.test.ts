import test from 'node:test';
import assert from 'node:assert/strict';
import { appText } from '../src/i18n/appText';
import { academyContent } from '../src/i18n/academyContent';
import { riskText } from '../src/i18n/riskText';
import { analyzeContent } from '../src/lib/scamAnalysis';
import type { Language } from '../src/types';
import { categorizeMessage } from '../src/lib/categories';
import { minimizeStoredContent } from '../src/lib/storage';

const languages: Language[] = ['en', 'hi', 'bn', 'ta', 'te', 'ml'];

test('every language has the complete interface and academy content', () => {
  const expectedKeys = Object.keys(appText.en).sort();
  for (const language of languages) {
    assert.deepEqual(Object.keys(appText[language]).sort(), expectedKeys);
    assert.equal(academyContent[language].lessons.length, 8);
    assert.equal(academyContent[language].questions.length, 3);
    assert.equal(riskText[language].actions.length, 3);
  }
});

test('QR destinations are analyzed locally and return explainable signal categories', () => {
  const result = analyzeContent('upi://pay?pa=unknown@bank&am=5000', 'qr');
  assert.equal(result.apiSource, '');
  assert.ok(result.detectedSignals.some((signal) => signal.category === 'qr_payment'));
  assert.ok(result.highlightedPhrases.length > 0);
});

test('local categorization covers common hackathon examples', () => {
  assert.equal(categorizeMessage('Your OTP is 123456. Do not share it.', 'message', 'safe'), 'otp');
  assert.equal(categorizeMessage('Your parcel delivery is delayed.', 'message', 'safe'), 'delivery');
  assert.equal(categorizeMessage('URGENT: pay the fee and share your OTP', 'message', 'high', ['payment_request']), 'possible_fraud');
});

test('stored history redacts common secrets and limits retained content', () => {
  const stored = minimizeStoredContent(`Your OTP is 123456 and card 4111 1111 1111 1111 ${'x'.repeat(2000)}`);
  assert.match(stored, /OTP is \[redacted\]/i);
  assert.match(stored, /\[redacted card number\]/);
  assert.ok(stored.length <= 1200);
});
