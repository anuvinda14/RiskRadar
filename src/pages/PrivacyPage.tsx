import { useState } from 'react';
import { Cloud, Database, Download, Mail, ShieldCheck, Trash2, Users, Ban } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useApp } from '@/context/AppContext';
import { clearHistory, clearSenderProfiles, exportLocalData, getHistory, getSenderProfiles } from '@/lib/storage';
import { featureText } from '@/i18n/featureText';

export function PrivacyPage() {
  const { settings } = useApp();
  const copy = featureText[settings.language].privacy;
  const [history, setHistory] = useState(getHistory);
  const [senders, setSenders] = useState(getSenderProfiles);
  const [confirming, setConfirming] = useState(false);
  const [notice, setNotice] = useState('');
  const cloudCount = history.filter((entry) => !!entry.apiSource).length;

  const exportData = () => {
    const blob = new Blob([exportLocalData()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `riskradar-data-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice(copy.exported);
  };

  const deleteData = () => {
    clearHistory();
    clearSenderProfiles();
    setHistory([]);
    setSenders([]);
    setConfirming(false);
  };

  return <Layout showBack title={copy.title}>
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-extrabold text-slate-900">{copy.title}</h1>
      <p className="mb-6 mt-2 text-slate-600">{copy.subtitle}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card><Database className="mb-3 text-blue-700"/><h2 className="font-bold">🔒 {copy.localTitle}</h2><p className="mt-2 text-slate-600">{copy.localBody}</p><strong className="mt-3 block text-2xl text-blue-900">{history.length}</strong><span className="text-sm text-slate-500">{copy.retention}</span></Card>
        <Card><Cloud className="mb-3 text-blue-700"/><h2 className="font-bold">☁️ {copy.cloudTitle}</h2><p className="mt-2 text-slate-600">{copy.cloudBody}</p><strong className="mt-3 block text-2xl text-blue-900">{cloudCount}</strong></Card>
        <Card><Mail className="mb-3 text-slate-500"/><h2 className="font-bold">{copy.emailTitle}</h2><p className="mt-2 font-semibold text-slate-600">{copy.emailStatus}</p></Card>
        <Card><Users className="mb-3 text-slate-500"/><h2 className="font-bold">{copy.contactsTitle}</h2><p className="mt-2 font-semibold text-slate-600">{copy.contactsStatus}</p></Card>
      </div>

      <Card className="mt-5">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold"><ShieldCheck className="text-blue-700"/>{copy.reported}</h2>
        {senders.length === 0 ? <p className="text-slate-600">{copy.noneReported}</p> : <div className="space-y-3">{senders.map((sender) => <div key={sender.id} className="rounded-xl border border-slate-200 p-3"><div className="flex items-center justify-between gap-3"><strong>{sender.displayName}</strong>{sender.blocked && <span className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-bold text-red-700"><Ban size={14}/>{copy.blocked}</span>}</div><p className="mt-1 text-sm text-slate-500">{sender.reports} {copy.reports}</p>{sender.suspiciousScans >= 2 && <p className="mt-2 rounded-lg bg-amber-50 px-2 py-1 text-sm font-semibold text-amber-800">⚠️ {copy.repeated}</p>}</div>)}</div>}
        <p className="mt-4 text-sm text-slate-500">{copy.deviceOnly}</p>
      </Card>

      <div className="mt-5 space-y-3">
        <Button onClick={exportData} fullWidth variant="secondary"><Download size={20}/>{copy.export}</Button>
        {notice && <p role="status" className="text-center text-emerald-700">{notice}</p>}
        {!confirming ? <Button onClick={() => setConfirming(true)} fullWidth variant="ghost"><Trash2 size={20}/>{copy.delete}</Button> : <Card className="border-red-200 bg-red-50"><p className="mb-3 font-bold text-red-800">{copy.deleteAll}</p><div className="flex flex-col gap-2 sm:flex-row"><Button onClick={deleteData} variant="danger"><Trash2 size={18}/>{copy.confirmDelete}</Button><Button onClick={() => setConfirming(false)} variant="secondary">{copy.cancel}</Button></div></Card>}
      </div>
    </div>
  </Layout>;
}
