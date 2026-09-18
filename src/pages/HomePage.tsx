import { useState } from 'react';
import { MessageSquare, Link2, QrCode, Mail, ImagePlus, ScanLine, ArrowRight, Lightbulb } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Layout } from '@/components/Layout';
import { getHistory } from '@/lib/storage';
import type { CheckType } from '@/types';

const options: {type: CheckType; label: string; icon: typeof MessageSquare}[] = [
  {type:'screenshot', label:'Scan Screenshot', icon:ImagePlus},
  {type:'url', label:'Check Link', icon:Link2},
  {type:'message', label:'Analyze Message', icon:MessageSquare},
  {type:'qr', label:'Check QR Link', icon:QrCode},
  {type:'emailAd', label:'Email / Ad Text', icon:Mail},
];

export function HomePage() {
  const { navigate } = useApp();
  const [choose, setChoose] = useState(false);
  const history = getHistory();
  const week = history.filter(item => Date.now() - item.timestamp < 7 * 86400000);
  return <Layout>
    <div className="rr-home-grid">
      <section className="rr-home-panel">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Stay one step ahead of scams.</h2>
        <p className="mt-2 text-slate-600">Check a message, screenshot or link before you act.</p>
        <div className="rr-scan-card my-6 rounded-3xl p-6 text-white">
          <ScanLine size={30} className="mb-4"/>
          <h2 className="text-2xl font-bold">Is this a scam?</h2>
          <p className="mt-1 text-blue-100">Let’s look for the warning signs together.</p>
          <button aria-expanded={choose} onClick={() => setChoose(!choose)} className="mt-5 flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-white p-3 font-bold text-blue-800">{choose ? 'Hide options' : 'Scan Now'} <ArrowRight size={22}/></button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {options.slice(0,3).map(({type,label,icon:Icon}) => <button key={type} onClick={() => navigate({name:'check',checkType:type})} className="rr-action"><Icon size={25}/><span>{label}</span></button>)}
        </div>
        {choose && <div className="mt-3 grid grid-cols-2 gap-3">{options.slice(3).map(({type,label,icon:Icon}) => <button key={type} onClick={() => navigate({name:'check',checkType:type})} className="rr-action"><Icon/>{label}</button>)}</div>}
        <div className="mb-3 mt-7 flex items-center justify-between"><h2 className="text-xl font-bold text-slate-900">Recent checks</h2><button onClick={() => navigate({name:'history'})} className="min-h-12 px-2 font-semibold text-blue-700">View all</button></div>
        {history.length ? <div className="space-y-3">{history.slice(0,3).map(entry => <button key={entry.id} onClick={() => navigate({name:'result',resultId:entry.id})} className="rr-history-item w-full text-left">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs"><span className={`rounded-full px-2 py-1 font-bold ${entry.riskLevel === 'high' ? 'bg-red-50 text-red-700' : entry.riskLevel === 'caution' ? 'bg-amber-50 text-amber-800' : 'bg-green-50 text-green-800'}`}>{entry.riskLevel === 'high' ? 'HIGH RISK' : entry.riskLevel === 'caution' ? 'CAUTION' : 'LOW WARNING SIGNS'}</span><span className="text-slate-500">{entry.type} · {new Date(entry.timestamp).toLocaleDateString()}</span></div><p className="truncate font-semibold text-slate-800">{entry.input}</p>
        </button>)}</div> : <div className="rr-history-item text-slate-600">Your checks will appear here. Start with a message or screenshot.</div>}
        <div className="my-5 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-blue-50 p-4"><strong className="block text-2xl text-blue-900">{week.length}</strong><span className="text-sm text-slate-600">checks this week</span></div><div className="rounded-2xl bg-amber-50 p-4"><strong className="block text-2xl text-amber-900">{week.filter(e => e.riskLevel !== 'safe').length}</strong><span className="text-sm text-slate-600">checks with warnings</span></div></div>
        <div className="flex gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-5"><Lightbulb className="shrink-0 text-blue-700"/><div className="text-slate-800"><strong className="mb-1 block text-xs tracking-widest text-blue-800">SAFETY TIP</strong>Never share your OTP, password or PIN with another person.<button onClick={() => navigate({name:'learn'})} className="mt-3 block min-h-12 font-bold text-blue-800 underline">More in Scam Academy →</button></div></div>
      </section>
    </div>
  </Layout>;
}
