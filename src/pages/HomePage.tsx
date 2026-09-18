import { useState } from 'react';
import { MessageSquare, Link2, QrCode, Mail, ImagePlus, ScanLine, ArrowRight, Lightbulb } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Layout } from '@/components/Layout';
import { getHistory } from '@/lib/storage';
import type { CheckType } from '@/types';

export function HomePage() {
  const { navigate, t, settings } = useApp();
  const [choose, setChoose] = useState(false);
  const history = getHistory();
  const week = history.filter(item => Date.now() - item.timestamp < 7 * 86400000);
  const options: {type: CheckType; label: string; icon: typeof MessageSquare}[] = [
    {type:'screenshot', label:t('home.scanScreenshot'), icon:ImagePlus},
    {type:'url', label:t('home.checkLink'), icon:Link2},
    {type:'message', label:t('home.analyzeMessage'), icon:MessageSquare},
    {type:'qr', label:t('home.checkQRImage'), icon:QrCode},
    {type:'emailAd', label:t('home.emailAdText'), icon:Mail},
  ];
  return <Layout>
    <div className="rr-home-grid">
      <section className="rr-home-panel">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">{t('home.heroTitle')}</h2>
        <p className="mt-2 text-slate-600">{t('home.heroSubtitle')}</p>
        <div className="rr-scan-card my-6 rounded-3xl p-6 text-white">
          <ScanLine size={30} className="mb-4"/>
          <h2 className="text-2xl font-bold">{t('home.question')}</h2>
          <p className="mt-1 text-blue-100">{t('home.lookTogether')}</p>
          <button aria-expanded={choose} onClick={() => setChoose(!choose)} className="mt-5 flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-white p-3 font-bold text-blue-800">{choose ? t('home.hideOptions') : t('home.scanNow')} <ArrowRight size={22}/></button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {options.slice(0,3).map(({type,label,icon:Icon}) => <button key={type} onClick={() => navigate({name:'check',checkType:type})} className="rr-action"><Icon size={25}/><span>{label}</span></button>)}
        </div>
        {choose && <div className="mt-3 grid grid-cols-2 gap-3">{options.slice(3).map(({type,label,icon:Icon}) => <button key={type} onClick={() => navigate({name:'check',checkType:type})} className="rr-action"><Icon/>{label}</button>)}</div>}
        <div className="mb-3 mt-7 flex items-center justify-between"><h2 className="text-xl font-bold text-slate-900">{t('home.recentChecks')}</h2><button onClick={() => navigate({name:'history'})} className="min-h-12 px-2 font-semibold text-blue-700">{t('home.viewAll')}</button></div>
        {history.length ? <div className="space-y-3">{history.slice(0,3).map(entry => <button key={entry.id} onClick={() => navigate({name:'result',resultId:entry.id})} className="rr-history-item w-full text-left">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs"><span className={`rounded-full px-2 py-1 font-bold ${entry.riskLevel === 'high' ? 'bg-red-50 text-red-700' : entry.riskLevel === 'caution' ? 'bg-amber-50 text-amber-800' : 'bg-green-50 text-green-800'}`}>{entry.riskLevel === 'high' ? t('result.highRisk') : entry.riskLevel === 'caution' ? t('result.caution') : t('result.safe')}</span><span className="text-slate-500">{entry.type} · {new Date(entry.timestamp).toLocaleDateString(settings.language)}</span></div><p className="truncate font-semibold text-slate-800">{entry.input}</p>
        </button>)}</div> : <div className="rr-history-item text-slate-600">{t('home.historyEmpty')}</div>}
        <div className="my-5 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-blue-50 p-4"><strong className="block text-2xl text-blue-900">{week.length}</strong><span className="text-sm text-slate-600">{t('home.checksWeek')}</span></div><div className="rounded-2xl bg-amber-50 p-4"><strong className="block text-2xl text-amber-900">{week.filter(e => e.riskLevel !== 'safe').length}</strong><span className="text-sm text-slate-600">{t('home.checksWarnings')}</span></div></div>
        <div className="flex gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-5"><Lightbulb className="shrink-0 text-blue-700"/><div className="text-slate-800"><strong className="mb-1 block text-xs tracking-widest text-blue-800">{t('home.safetyTip')}</strong>{t('home.otpTip')}<button onClick={() => navigate({name:'learn'})} className="mt-3 block min-h-12 font-bold text-blue-800 underline">{t('home.moreAcademy')}</button></div></div>
      </section>
    </div>
  </Layout>;
}
