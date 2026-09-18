import { it } from 'node:test';
import assert from 'node:assert/strict';
import { analyzeText } from '../src/lib/scamAnalyzer.ts';
import { analyzeContent, analyzeContentAsync } from '../src/lib/scamAnalysis.ts';

it('ordinary OTP notification has no local credential warning', () => {
  const result = analyzeText('Your login OTP is 123456. Do not share this code with anyone.');
  assert.equal(result.riskScore, 0);
  assert.equal(result.prominentWarning, '');
});

it('a benign instruction cannot hide a later credential request', () => {
  const result = analyzeText('Never share your OTP. Your account is suspended. Send your code to our agent immediately.');
  assert.ok(result.detectedSignals.some(s => s.category === 'credential_request'));
  assert.ok(result.prominentWarning);
});

it('a negated instruction with a separate but clause cannot mask a request', () => {
  assert.ok(analyzeText('Do not share your OTP but send the code to our agent immediately.').prominentWarning);
});

it('screenshot extracted text uses the same rules as pasted text', () => {
  const text = 'Your account is suspended. Send your OTP immediately.';
  assert.deepEqual(analyzeContent(text, 'screenshot').detectedSignals, analyzeContent(text, 'message').detectedSignals);
});

it('missing API configuration yields explicitly labeled local fallback', async () => {
  const result = await analyzeContentAsync('Your login OTP is 123456. Do not share this code with anyone.', 'message');
  assert.equal(result.isOfflineFallback, true);
  assert.equal(result.riskScore, 0);
});
