import { useState, useEffect } from 'react';
import { createWorker } from 'tesseract.js';
import { useApp } from '@/context/AppContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { TextAreaField, InputField } from '@/components/ui/InputField';
import { createAnalysisResult, createAnalysisResultAsync } from '@/lib/scamAnalysis';
import { BUILT_IN_EXAMPLES } from '@/lib/scamAnalyzer';
import { saveHistoryEntry } from '@/lib/storage';
import { ImagePlus, Upload, FileImage, Sparkles, Loader2 } from 'lucide-react';
import type { CheckType } from '@/types';

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

export function CheckPage({ checkType }: CheckPageProps) {
  const { t, navigate } = useApp();
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [reading, setReading] = useState(false);
  const [error, setError] = useState('');

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
      if (!data.text.trim()) setError('No readable text found. Please type or paste the message below.');
    } catch {
      setError('Could not read the image. Check your internet connection or paste the text below.');
    } finally {
      if (worker) await worker.terminate();
      setReading(false);
    }
  };

  const handleAnalyze = async () => {
    const input = text.trim();
    if (!input) return;

    const usesApi = checkType === 'message' || checkType === 'emailAd' || checkType === 'screenshot';
    if (!usesApi) {
      const result = createAnalysisResult(input, checkType);
      saveHistoryEntry(result);
      navigate({ name: 'result', resultId: result.id });
      return;
    }

    setLoading(true);
    try {
      const result = await createAnalysisResultAsync(input, checkType);
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
                  {preview ? <img src={preview} alt="Uploaded screenshot" className="max-h-72 max-w-full rounded-lg object-contain" /> : <FileImage size={48} className="text-teal-600" />}
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
                    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024) {
                      setError('Choose a JPG, PNG, or WEBP image smaller than 10 MB.');
                      return;
                    }
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
                {reading ? 'Reading image…' : 'Extract text from image'}
              </Button>
              <p className="text-sm text-slate-600">English text extraction runs in your browser. Review the text before analyzing; only the reviewed text is sent to the model.</p>
              <TextAreaField id="extracted-text" label="Review or paste the screenshot text" value={text} onChange={(e) => setText(e.target.value)} rows={6} disabled={reading || loading} />
            </div>
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

        {hasExamples && (
          <div className="mt-4">
            <p className="mb-2 flex items-center gap-2 font-semibold text-slate-600" style={{ fontSize: 'var(--text-base)' }}>
              <Sparkles size={18} className="text-teal-600" />
              Try a built-in example:
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
                  {example.label}
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
              Analyzing with the phishing detection model…
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
