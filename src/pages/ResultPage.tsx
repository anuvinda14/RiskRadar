import { useState } from 'react';
import { Volume2, VolumeX, Send, CheckCircle2, AlertTriangle, ShieldCheck, AlertOctagon, RotateCcw, Lightbulb, Cpu, Info, WifiOff, ChevronDown, ChevronUp, AlertCircle, Flag, Ban, ThumbsUp, Trash2, Tag } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { Card } from '@/components/ui/Card';
import { deleteHistoryEntry, getHistoryEntry, updateSenderProfile } from '@/lib/storage';
import { speak, stopSpeaking, isSpeechSupported } from '@/lib/speech';
import type { RiskLevel } from '@/types';
import { riskText } from '@/i18n/riskText';
import { categoryForResult, senderIdentifier } from '@/lib/categories';
import { featureText } from '@/i18n/featureText';

interface ResultPageProps {
  resultId: string;
}

const riskLabelKey: Record<RiskLevel, 'result.safe' | 'result.caution' | 'result.highRisk'> = {
  safe: 'result.safe',
  caution: 'result.caution',
  high: 'result.highRisk',
};

const riskIconConfig: Record<RiskLevel, { icon: typeof ShieldCheck; color: string; bg: string }> = {
  safe: { icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-100' },
  caution: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100' },
  high: { icon: AlertOctagon, color: 'text-red-600', bg: 'bg-red-100' },
};

function highlightInput(input: string, phrases: string[]): React.ReactNode {
  if (phrases.length === 0) return input;

  const escaped = phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = input.split(regex);

  return parts.map((part, i) => {
    const isHighlight = phrases.some((p) => p.toLowerCase() === part.toLowerCase());
    return isHighlight ? (
      <mark key={i} className="rounded bg-amber-200 px-1 font-semibold text-slate-900">{part}</mark>
    ) : (
      <span key={i}>{part}</span>
    );
  });
}

export function ResultPage({ resultId }: ResultPageProps) {
  const { t, navigate, settings, trustedContact } = useApp();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sent, setSent] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [senderNotice, setSenderNotice] = useState('');

  const result = getHistoryEntry(resultId);

  if (!result) {
    return (
      <Layout showBack title={t('result.riskLevel')}>
        <p className="text-slate-600" style={{ fontSize: 'var(--text-lg)' }}>
          {t('history.empty')}
        </p>
      </Layout>
    );
  }

  const riskLabel = t(riskLabelKey[result.riskLevel]);
  const iconConfig = riskIconConfig[result.riskLevel];

  const localizedRisk = riskText[settings.language];
  const reasons = settings.language === 'en'
    ? (result.detectedSignals.length > 0 ? result.detectedSignals.map((s) => s.description) : result.reasons)
    : (result.detectedSignals.length > 0
      ? result.detectedSignals.map((signal) => localizedRisk.reasons[signal.category] ?? localizedRisk.noSignals)
      : [localizedRisk.noSignals]);
  const steps = settings.language === 'en'
    ? (result.recommendedActions.length > 0 ? result.recommendedActions : result.safetySteps)
    : localizedRisk.actions;
  const summary = settings.language === 'en' ? result.summary : localizedRisk.summary[result.riskLevel];
  const prominentWarning = result.prominentWarning
    ? (settings.language === 'en' ? result.prominentWarning : localizedRisk.strongWarning)
    : '';
  const feature = featureText[settings.language];
  const category = categoryForResult(result);
  const sender = senderIdentifier(result);

  const saveSenderAction = (action: 'report' | 'block' | 'notSpam') => {
    if (!sender) {
      setSenderNotice(feature.sender.missing);
      return;
    }
    updateSenderProfile(sender, action, category, result.riskLevel !== 'safe');
    setSenderNotice(feature.sender.saved);
  };

  const warningText = `${t('result.warningText')}: ${riskLabel}. ${summary || reasons.join('. ')}. ${t('result.safetySteps')}: ${steps.join('. ')}`;

  const handleReadAloud = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    speak(warningText, settings.language);
    setIsSpeaking(true);
    setTimeout(() => setIsSpeaking(false), warningText.length * 80 + 2000);
  };

  const handleSendToContact = () => {
    if (!trustedContact) {
      navigate({ name: 'contact' });
      return;
    }
    const subject = `RiskRadar ${t('result.warningText')}: ${riskLabel}`;
    const body = `${t('result.riskLevel')}: ${riskLabel}\n${t('result.riskScore')}: ${result.riskScore}/100\n\n${summary || ''}\n\n${t('result.reasons')}:\n${reasons.map((r) => `- ${r}`).join('\n')}\n\n${t('result.safetySteps')}:\n${steps.map((s) => `- ${s}`).join('\n')}`;

    if (trustedContact.email) {
      const mailto = `mailto:${trustedContact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailto, '_blank');
    } else if (trustedContact.phone) {
      const sms = `sms:${trustedContact.phone}?body=${encodeURIComponent(`${subject}\n${body}`)}`;
      window.open(sms, '_blank');
    }
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  const Icon = iconConfig.icon;
  const hasStructuredData = result.detectedSignals.length > 0 || result.summary !== '';
  const hasApiData = !!result.apiSource;
  const hasTechnicalDetails = hasApiData || result.isOfflineFallback;

  return (
    <Layout showBack title={t('result.riskLevel')}>
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 text-center">
          <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${iconConfig.bg}`}>
            <Icon size={40} className={iconConfig.color} />
          </div>
          <RiskBadge level={result.riskLevel} label={riskLabel} />
          <p className="mt-3 text-slate-600" style={{ fontSize: 'var(--text-lg)' }}>
            {result.apiSource ? t('result.emailModelScore') : t('result.ruleScore')}: <span className="font-bold text-slate-800">{result.riskScore}/100</span>
          </p>
        </div>

        {prominentWarning && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border-2 border-red-500 bg-red-50 p-4">
            <AlertCircle size={28} className="mt-0.5 flex-shrink-0 text-red-600" />
            <div>
              <p className="font-bold text-red-800" style={{ fontSize: 'var(--text-lg)' }}>
                {t('result.safetyWarning')}
              </p>
              <p className="mt-1 text-red-700" style={{ fontSize: 'var(--text-base)' }}>
                {prominentWarning}
              </p>
            </div>
          </div>
        )}

        {summary && (
          <Card className="mb-6 border-l-4 border-l-teal-500">
            <p className="text-slate-800" style={{ fontSize: 'var(--text-lg)' }}>
              {summary}
            </p>
          </Card>
        )}

        <p className="mb-4 text-center text-sm text-slate-600" role="status">
          {result.apiSource ? t('result.cloudStatus') : result.isOfflineFallback ? t('result.offlineStatus') : t('result.localStatus')}
        </p>
        <div className="mb-5 flex flex-wrap justify-center gap-2"><span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 font-semibold text-blue-800"><Tag size={16}/>{feature.categories[category]}</span>{sender && <span className="rounded-full bg-slate-100 px-3 py-2 font-semibold text-slate-700">{sender}</span>}</div>
        {result.input && (
          <Card className="mb-6">
            <p className="mb-1 font-semibold text-slate-500" style={{ fontSize: 'var(--text-base)' }}>
              {t('check.message.label')}
            </p>
            <div className="text-slate-800" style={{ fontSize: 'var(--text-base)' }}>
              {hasStructuredData && result.highlightedPhrases.length > 0
                ? highlightInput(result.input, result.highlightedPhrases)
                : result.input.length > 200
                  ? `${result.input.slice(0, 200)}…`
                  : result.input}
            </div>
          </Card>
        )}

        <Card className="mb-6">
          <h2 className="mb-3 flex items-center gap-2 font-bold text-slate-800" style={{ fontSize: 'var(--text-xl)' }}>
            <AlertTriangle size={22} className="text-amber-500" />
            {t('result.reasons')}
          </h2>
          <ul className="space-y-2">
            {reasons.map((reason, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-700" style={{ fontSize: 'var(--text-base)' }}>
                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-amber-500" />
                {reason}
              </li>
            ))}
          </ul>
          {hasStructuredData && result.highlightedPhrases.length > 0 && (
            <div className="mt-4 border-t border-slate-200 pt-3">
              <p className="mb-2 font-semibold text-slate-600" style={{ fontSize: 'var(--text-base)' }}>
                {t('result.flaggedPhrases')}
              </p>
              <div className="flex flex-wrap gap-2">
                {result.highlightedPhrases.map((phrase, i) => (
                  <span key={i} className="rounded-md bg-amber-100 px-2 py-1 font-medium text-amber-800" style={{ fontSize: 'var(--text-base)' }}>
                    {phrase}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card className="mb-6">
          <h2 className="mb-3 flex items-center gap-2 font-bold text-slate-800" style={{ fontSize: 'var(--text-xl)' }}>
            <Lightbulb size={22} className="text-teal-600" />
            {t('result.safetySteps')}
          </h2>
          <ol className="space-y-3">
            {steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-700" style={{ fontSize: 'var(--text-base)' }}>
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 font-bold text-teal-700" style={{ fontSize: 'var(--text-base)' }}>
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </Card>

        {hasTechnicalDetails && (
          <Card className="mb-6">
            <button
              onClick={() => setShowTechnicalDetails((prev) => !prev)}
              className="flex w-full items-center justify-between font-semibold text-slate-700"
              style={{ fontSize: 'var(--text-base)' }}
            >
              <span>{t('result.technicalDetails')}</span>
              {showTechnicalDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {showTechnicalDetails && (
              <div className="mt-3 space-y-2">
                {hasApiData ? (
                  <>
                    <div className="flex items-center gap-2 text-slate-700" style={{ fontSize: 'var(--text-base)' }}>
                      <Cpu size={18} className="text-teal-600" />
                      <span className="font-semibold">{t('result.model')}</span>
                      <span className="font-mono text-slate-600">{result.apiSource}</span>
                    </div>
                    {result.apiPrediction && (
                      <div className="flex items-center gap-2 text-slate-700" style={{ fontSize: 'var(--text-base)' }}>
                        <span className="font-semibold">{t('result.prediction')}</span>
                        <span className={result.apiPrediction === 'phishing' ? 'font-bold text-red-600' : 'font-bold text-green-600'}>
                          {settings.language === 'en' ? result.apiPrediction : (localizedRisk.predictions[result.apiPrediction] ?? result.apiPrediction)}
                        </span>
                      </div>
                    )}
                    {result.apiDisclaimer && (
                      <div className="flex items-start gap-2 text-slate-500" style={{ fontSize: 'var(--text-base)' }}>
                        <Info size={16} className="mt-0.5 flex-shrink-0" />
                        <span>{settings.language === 'en' ? result.apiDisclaimer : localizedRisk.disclaimer}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-amber-800" style={{ fontSize: 'var(--text-base)' }}>
                    <WifiOff size={18} />
                    <span className="font-semibold">{t('result.basicOffline')}</span>
                    <span className="text-amber-700">{t('result.offlineDetail')}</span>
                  </div>
                )}
              </div>
            )}
          </Card>
        )}

        <div className="space-y-3">
          <Card>
            <p className="mb-3 text-sm text-slate-500">{feature.sender.localOnly}</p>
            <div className="grid gap-2 sm:grid-cols-3">
              <Button onClick={() => saveSenderAction('report')} variant="secondary"><Flag size={18}/>{feature.sender.report}</Button>
              <Button onClick={() => saveSenderAction('block')} variant="secondary"><Ban size={18}/>{feature.sender.block}</Button>
              <Button onClick={() => saveSenderAction('notSpam')} variant="secondary"><ThumbsUp size={18}/>{feature.sender.notSpam}</Button>
            </div>
            {senderNotice && <p role="status" className="mt-3 text-sm font-semibold text-blue-800">{senderNotice}</p>}
          </Card>
          {isSpeechSupported() && (
            <Button onClick={handleReadAloud} fullWidth variant={isSpeaking ? 'secondary' : 'primary'}>
              {isSpeaking ? <VolumeX size={22} /> : <Volume2 size={22} />}
              {isSpeaking ? t('common.close') : t('result.readAloud')}
            </Button>
          )}

          <Button onClick={handleSendToContact} fullWidth variant="secondary">
            {sent ? <CheckCircle2 size={22} className="text-green-600" /> : <Send size={22} />}
            {sent ? t('result.sent') : t('result.sendToContact')}
          </Button>

          {!trustedContact && (
            <p className="text-center text-slate-500" style={{ fontSize: 'var(--text-base)' }}>
              {t('result.noContact')}
            </p>
          )}

          <Button onClick={() => navigate({ name: 'home' })} fullWidth variant="ghost">
            <RotateCcw size={20} />
            {t('result.newCheck')}
          </Button>
          <Button onClick={() => { deleteHistoryEntry(result.id); navigate({ name: 'history' }); }} fullWidth variant="ghost" className="text-red-700 hover:bg-red-50">
            <Trash2 size={20}/>{feature.sender.delete}
          </Button>
        </div>
      </div>
    </Layout>
  );
}
