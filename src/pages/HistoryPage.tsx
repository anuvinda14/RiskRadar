import { useState, useEffect } from 'react';
import { History as HistoryIcon, Trash2, ChevronRight, MessageSquare, Link2, QrCode, Mail, ImagePlus } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { getHistory, clearHistory, deleteHistoryEntry } from '@/lib/storage';
import type { AnalysisResult, CheckType, RiskLevel } from '@/types';

const typeIcon: Record<CheckType, typeof MessageSquare> = {
  screenshot: ImagePlus,
  message: MessageSquare,
  url: Link2,
  qr: QrCode,
  emailAd: Mail,
};

const riskLabelKey: Record<RiskLevel, 'result.safe' | 'result.caution' | 'result.highRisk'> = {
  safe: 'result.safe',
  caution: 'result.caution',
  high: 'result.highRisk',
};

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

interface HistoryItemProps {
  entry: AnalysisResult;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  riskLabel: string;
}

function HistoryItem({ entry, onView, onDelete, riskLabel }: HistoryItemProps) {
  const Icon = typeIcon[entry.type];
  return (
    <Card>
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-teal-50">
          <Icon size={24} className="text-teal-700" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate font-semibold text-slate-800" style={{ fontSize: 'var(--text-base)' }}>
              {entry.input.length > 60 ? `${entry.input.slice(0, 60)}…` : entry.input}
            </p>
          </div>
          <p className="mt-0.5 text-slate-500" style={{ fontSize: 'var(--text-base)' }}>
            {formatDate(entry.timestamp)}
          </p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <RiskBadge level={entry.riskLevel} label={riskLabel} />
            <div className="flex items-center gap-1">
              <Button variant="ghost" onClick={() => onDelete(entry.id)} className="!px-2 !py-2 text-red-600 hover:bg-red-50">
                <Trash2 size={18} />
              </Button>
              <Button variant="ghost" onClick={() => onView(entry.id)} className="!px-2 !py-2">
                <ChevronRight size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function HistoryPage() {
  const { t, navigate } = useApp();
  const [history, setHistory] = useState<AnalysisResult[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleClear = () => {
    clearHistory();
    setHistory([]);
  };

  const handleDelete = (id: string) => {
    deleteHistoryEntry(id);
    setHistory(getHistory());
  };

  const handleView = (id: string) => {
    navigate({ name: 'result', resultId: id });
  };

  return (
    <Layout>
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-teal-50">
              <HistoryIcon size={28} className="text-teal-700" />
            </div>
            <h1 className="font-bold text-slate-800" style={{ fontSize: 'var(--text-3xl)' }}>
              {t('history.title')}
            </h1>
            <p className="mt-1 text-slate-600" style={{ fontSize: 'var(--text-lg)' }}>
              {t('history.subtitle')}
            </p>
          </div>
          {history.length > 0 && (
            <Button variant="ghost" onClick={handleClear} className="text-red-600 hover:bg-red-50">
              <Trash2 size={20} />
              {t('history.clearAll')}
            </Button>
          )}
        </div>

        {history.length === 0 ? (
          <Card className="text-center">
            <HistoryIcon size={48} className="mx-auto mb-3 text-slate-300" />
            <p className="text-slate-500" style={{ fontSize: 'var(--text-lg)' }}>
              {t('history.empty')}
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {history.map((entry) => (
              <HistoryItem
                key={entry.id}
                entry={entry}
                onView={handleView}
                onDelete={handleDelete}
                riskLabel={t(riskLabelKey[entry.riskLevel])}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
