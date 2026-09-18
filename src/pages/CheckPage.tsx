import { useState, useEffect } from 'react';
import { createWorker } from 'tesseract.js';
import jsQR from 'jsqr';
import { useApp } from '@/context/AppContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { TextAreaField, InputField } from '@/components/ui/InputField';
import { createAnalysisResult, createAnalysisResultAsync } from '@/lib/scamAnalysis';
import { BUILT_IN_EXAMPLES } from '@/lib/scamAnalyzer';
import { saveHistoryEntry } from '@/lib/storage';
import { ImagePlus, Upload, FileImage, Sparkles, Loader2, QrCode } from 'lucide-react';
import type { CheckType, RiskLevel } from '@/types';
import { featureText } from '@/i18n/featureText';

interface CheckPageProps {
  checkType: CheckType;
}

const labelKey: Record<CheckType, 'check.message.label' | 'check.url.label' | 'check.emailAd.label' | 'check.screenshot.label' | 'check.qr.label'> = {
  screenshot: 'check.screenshot.label',
  message: 'check.message.label',
  url: 'check.url.label',
  qr: 'check.qr.label',
  emailAd: 'check.emailAd.label',
};

const placeholderKey: Record<CheckType, 'check.message.placeholder' | 'check.url.placeholder' | 'check.emailAd.placeholder' | 'check.qr.placeholder'> = {
  screenshot: 'check.message.placeholder',
  message: 'check.message.placeholder',
  url: 'check.url.placeholder',
  qr: 'check.qr.placeholder',
  emailAd: 'check.emailAd.placeholder',
};

const titleKey: Record<CheckType, 'home.scanScreenshot' | 'home.checkMessage' | 'home.checkURL' | 'home.scanQR' | 'home.checkEmailAd'> = {
  screenshot: 'home.scanScreenshot',
  message: 'home.checkMessage',
  url: 'home.checkURL',
  qr: 'home.scanQR',
  emailAd: 'home.checkEmailAd',
};

const exampleRiskKey: Record<RiskLevel, 'result.safe' | 'result.caution' | 'result.highRisk'> = {
  safe: 'result.safe', caution: 'result.caution', high: 'result.highRisk',
};

export function CheckPage({ checkType }: CheckPageProps) {
  const { t, navigate, settings } = useApp();
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [reading, setReading] = useState(false);
  const [error, setError] = useState('');
  const [sender, setSender] = useState('');
  const feature = featureText[settings.language];

  useEffect(() => {
    if (!imageFile) { setPreview(''); return; }
    const url = URL.createObjectURL(imageFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const readImage = async () => {
    if (!imageFile) return;
    setReading(true);
    setError('');
    let worker;
    try {
      worker = await createWorker('eng');
      const { data } = await worker.recognize(imageFile);
      setText(data.text.trim());
      if (!data.text.trim()) setError(t('check.noText'));
    } catch {
      setError(t('check.ocrError'));
    } finally {
      if (worker) await worker.terminate();
      setReading(false);
    }
  };

  const readQrImage = async (file: File) => {
    setReading(true);
    setError('');
    setText('');
    try {
      const bitmap = await createImageBitmap(file);
      const longestSide = Math.max(bitmap.width, bitmap.height);
      const scale = longestSide > 2200 ? 2200 / longestSide : 1;
      const width = Math.max(1, Math.round(bitmap.width * scale));
      const height = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) throw new Error('Canvas unavailable');
      context.drawImage(bitmap, 0, 0, width, height);
      bitmap.close();
      const image = context.getImageData(0, 0, width, height);
      const decoded = jsQR(image.data, width, height, { inversionAttempts: 'attemptBoth' });
      if (!decoded?.data.trim()) {
        setError(t('qr.notFound'));
        return;
      }
      setText(decoded.data.trim());
    } catch {
      setError(t('qr.readError'));
    } finally {
      setReading(false);
    }
  };

  const acceptImage = (file: File): boolean => {
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024) {
      setError(t('check.invalidImage'));
      return false;
    }
    return true;
  };

  const handleAnalyze = async () => {
    const input = text.trim();
    if (!input) return;

    const usesApi = checkType === 'message' || checkType === 'emailAd' || checkType === 'screenshot';
    if (!usesApi) {
      const result = createAnalysisResult(input, checkType);
      result.sender = sender.trim() || undefined;
      saveHistoryEntry(result);
      navigate({ name: 'result', resultId: result.id });
      return;
    }

    setLoading(true);
    try {
      const result = await createAnalysisResultAsync(input, checkType);
      result.sender = sender.trim() || undefined;
      saveHistoryEntry(result);
      navigate({ name: 'result', resultId: result.id });
    } finally {
      setLoading(false);
    }
  };

  const handleExample = (exampleText: string) => {
    setText(exampleText);
  };

  const isUrl = checkType === 'url' || checkType === 'qr';
  const isScreenshot = checkType === 'screenshot';
  const isQr = checkType === 'qr';
  const hasExamples = checkType === 'message' || checkType === 'emailAd';
  const isDisabled = loading || reading || text.trim().length < 3;

  return (
    <Layout showBack title={t(titleKey[checkType])}>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 font-bold text-slate-800" style={{ fontSize: 'var(--text-3xl)' }}>
          {t(titleKey[checkType])}
        </h1>

        {isScreenshot ? (
          <div>
            <label className="mb-2 block font-semibold text-slate-700" style={{ fontSize: 'var(--text-lg)' }}>
              {t('check.screenshot.label')}
            </label>
            <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-8 text-center">
              {fileName ? (
                <div className="flex flex-col items-center gap-3">
                  {preview ? <img src={preview} alt={t('check.imageAlt')} className="max-h-72 max-w-full rounded-lg object-contain" /> : <FileImage size={48} className="text-teal-600" />}
                  <p className="font-medium text-slate-700" style={{ fontSize: 'var(--text-base)' }}>
                    {fileName}
                  </p>
                  <Button variant="secondary" disabled={reading || loading} onClick={() => { setFileName(''); setImageFile(null); setText(''); }}>
                    {t('common.delete')}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <ImagePlus size={48} className="text-slate-400" />
                  <p className="text-slate-500" style={{ fontSize: 'var(--text-base)' }}>
                    {t('check.screenshot.hint')}
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                disabled={reading || loading}
                className="hidden"
                id="screenshot-upload"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (!acceptImage(file)) return;
                    setFileName(file.name); setImageFile(file); setText(''); setError('');
                  }
                  e.target.value = '';
                }}
              />
              <label
                htmlFor="screenshot-upload"
                className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-teal-700 px-6 py-3 font-semibold text-white hover:bg-teal-800"
                style={{ fontSize: 'var(--text-base)' }}
              >
                <Upload size={20} />
                {t('check.screenshot.label')}
              </label>
            </div>
            <div className="mt-4 space-y-4">
              <Button onClick={readImage} disabled={!imageFile || reading || loading}>
                {reading ? t('check.readingImage') : t('check.extractText')}
              </Button>
              <p className="text-sm text-slate-600">{t('check.ocrPrivacy')}</p>
              <TextAreaField id="extracted-text" label={t('check.reviewText')} value={text} onChange={(e) => setText(e.target.value)} rows={6} disabled={reading || loading} />
            </div>
          </div>
        ) : isQr ? (
          <div className="space-y-5">
            <div>
              <label className="mb-2 block font-semibold text-slate-700" style={{ fontSize: 'var(--text-lg)' }}>{t('qr.uploadTitle')}</label>
              <div className="rounded-2xl border-2 border-dashed border-blue-200 bg-white p-6 text-center">
                {preview ? <img src={preview} alt={t('check.imageAlt')} className="mx-auto max-h-64 max-w-full rounded-xl object-contain" /> : <QrCode size={52} className="mx-auto text-blue-500" />}
                <p className="mx-auto mt-3 max-w-lg text-slate-600">{t('qr.uploadHint')}</p>
                <input
                  id="qr-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  disabled={reading || loading}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file && acceptImage(file)) {
                      setFileName(file.name);
                      setImageFile(file);
                      void readQrImage(file);
                    }
                    event.target.value = '';
                  }}
                />
                <label htmlFor="qr-upload" className="mt-4 inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800">
                  {reading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
                  {reading ? t('qr.scanning') : t('qr.chooseImage')}
                </label>
                {fileName && <p className="mt-2 text-sm text-slate-500">{fileName}</p>}
                <p className="mt-3 font-semibold text-emerald-700">{t('qr.localPrivacy')}</p>
              </div>
            </div>
            <InputField
              id="check-input"
              label={text ? t('qr.decoded') : t('qr.pasteInstead')}
              placeholder={t('check.qr.placeholder')}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            />
          </div>
        ) : isUrl ? (
          <InputField
            id="check-input"
            label={t(labelKey[checkType])}
            placeholder={t(placeholderKey[checkType])}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
          />
        ) : (
          <TextAreaField
            id="check-input"
            label={t(labelKey[checkType])}
            placeholder={t(placeholderKey[checkType])}
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
          />
        )}

        {(checkType === 'message' || checkType === 'emailAd' || checkType === 'screenshot') && (
          <div className="mt-4">
            <InputField id="sender-input" label={feature.sender.label} placeholder={feature.sender.placeholder} value={sender} onChange={(event) => setSender(event.target.value)} disabled={loading || reading} />
          </div>
        )}

        {hasExamples && (
          <div className="mt-4">
            <p className="mb-2 flex items-center gap-2 font-semibold text-slate-600" style={{ fontSize: 'var(--text-base)' }}>
              <Sparkles size={18} className="text-teal-600" />
              {t('check.tryExample')}
            </p>
            <div className="flex flex-wrap gap-2">
              {BUILT_IN_EXAMPLES.map((example) => (
                <button
                  key={example.label}
                  onClick={() => handleExample(example.text)}
                  disabled={loading}
                  className="rounded-full border-2 border-teal-200 bg-teal-50 px-4 py-2 font-medium text-teal-700 transition-colors hover:border-teal-400 hover:bg-teal-100 disabled:opacity-50"
                  style={{ fontSize: 'var(--text-base)' }}
                >
                  {t(exampleRiskKey[example.expectedRisk])}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3">
          {error && <p role="alert" className="text-red-700">{error}</p>}
          {loading && (
            <div className="flex items-center gap-3 text-slate-600" style={{ fontSize: 'var(--text-base)' }}>
              <Loader2 size={24} className="animate-spin text-teal-600" />
              {t('check.analyzing')}
            </div>
          )}
          <Button onClick={handleAnalyze} disabled={isDisabled}>
            {loading ? <Loader2 size={20} className="animate-spin" /> : null}
            {t('check.analyze')}
          </Button>
        </div>
      </div>
    </Layout>
  );
}
