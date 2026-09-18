import { useState } from 'react';
import { GraduationCap, ImagePlus, MessageSquare, Link2, QrCode, Mail, Phone, Settings, User } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { useApp } from '@/context/AppContext';
import type { CheckType } from '@/types';
import { academyContent } from '@/i18n/academyContent';

export function LearnPage() {
  const { t, settings } = useApp();
  const { lessons, questions } = academyContent[settings.language];
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const question = questions[index];
  const choose = (value: boolean) => { if (answer !== null) return; setAnswer(value); if (value === question.scam) setScore(s => s + 1); };
  return <Layout><section className="mx-auto max-w-4xl">
    <h1 className="flex items-center gap-3 text-3xl font-extrabold text-slate-900"><GraduationCap className="text-blue-700"/> {t('learn.title')}</h1>
    <p className="mt-3 mb-6 text-slate-600">{t('learn.subtitle')}</p>
    <section className="rounded-3xl border border-blue-200 bg-blue-50 p-5 sm:p-7" aria-labelledby="simulator-title">
      <div className="flex justify-between gap-3"><h2 id="simulator-title" className="text-xl font-bold">{t('learn.simulator')}</h2><span>{index + 1} {t('common.of')} {questions.length}</span></div>
      <p className="mt-2">{t('learn.question')}</p><p className="mt-1 text-sm text-slate-500">{t('learn.demoNote')}</p>
      <blockquote className="my-5 rounded-2xl bg-white p-5 text-lg text-slate-800">{question.text}</blockquote>
      <div className="grid grid-cols-2 gap-3"><button disabled={answer !== null} onClick={() => choose(false)} className="min-h-14 rounded-xl bg-emerald-700 p-3 font-bold text-white disabled:opacity-60">{t('learn.looksSafe')}</button><button disabled={answer !== null} onClick={() => choose(true)} className="min-h-14 rounded-xl bg-red-700 p-3 font-bold text-white disabled:opacity-60">{t('learn.scamSigns')}</button></div>
      {answer !== null && <div role="status" className="mt-5 rounded-xl border border-blue-200 bg-white p-4"><strong>{answer === question.scam ? t('learn.correct') : t('learn.reviewClues')}</strong><p className="mt-2">{question.explanation}</p><p className="mt-2 font-semibold">{t('learn.score')}: {score} / {index + 1}</p><button onClick={() => {if(index === questions.length - 1){setIndex(0);setScore(0);} else setIndex(i => i+1);setAnswer(null);}} className="mt-3 min-h-12 rounded-xl bg-blue-700 px-5 font-bold text-white">{index === questions.length - 1 ? t('learn.practiceAgain') : t('learn.next')}</button></div>}
    </section>
    <h2 className="mt-8 mb-4 text-xl font-bold">{t('learn.playbook')}</h2>
    <div className="grid gap-3 sm:grid-cols-2">{lessons.map(({title, sign, action}) => <details key={title} className="self-start rounded-2xl border border-slate-200 bg-white p-5"><summary className="cursor-pointer font-bold text-slate-900">{title}</summary><p className="mt-3 text-slate-600">{sign}</p><p className="mt-3 text-blue-900"><strong>{t('learn.whatToDo')} </strong>{action}</p></details>)}</div>
  </section></Layout>;
}

export function ScanPage() {
  const { navigate, t } = useApp();
  const options: {type:CheckType; label:string; detail:string; icon:typeof ImagePlus}[] = [
    {type:'screenshot',label:t('home.scanScreenshot'),detail:t('scan.screenshotDetail'),icon:ImagePlus},
    {type:'message',label:t('home.analyzeMessage'),detail:t('scan.messageDetail'),icon:MessageSquare},
    {type:'url',label:t('home.checkLink'),detail:t('scan.linkDetail'),icon:Link2},
    {type:'qr',label:t('home.checkQRImage'),detail:t('scan.qrDetail'),icon:QrCode},
    {type:'emailAd',label:t('home.checkEmailAd'),detail:t('scan.emailDetail'),icon:Mail},
  ];
  return <Layout><h1 className="mb-6 text-3xl font-bold">{t('scan.title')}</h1><div className="grid gap-4 sm:grid-cols-2">{options.map(({type,label,detail,icon:Icon}) => <button key={type} onClick={() => navigate({name:'check',checkType:type})} className="rr-history-item flex items-center gap-4 text-left"><Icon className="shrink-0 text-blue-700"/><span><strong className="block text-lg">{label}</strong><span className="text-slate-600">{detail}</span></span></button>)}</div></Layout>;
}

export function ProfilePage() {
  const {navigate, trustedContact, t} = useApp();
  return <Layout><h1 className="mb-6 flex items-center gap-3 text-3xl font-bold"><User/> {t('profile.title')}</h1><div className="grid gap-4 sm:grid-cols-2"><button onClick={() => navigate({name:'contact'})} className="rr-history-item text-left"><Phone className="mb-3 text-blue-700"/><h2 className="text-xl font-bold">{t('contact.title')}</h2><p className="mt-2 text-slate-600">{trustedContact ? trustedContact.name : t('profile.chooseContact')}</p></button><button onClick={() => navigate({name:'settings'})} className="rr-history-item text-left"><Settings className="mb-3 text-blue-700"/><h2 className="text-xl font-bold">{t('settings.title')}</h2><p className="mt-2 text-slate-600">{t('profile.settingsDetail')}</p></button></div><div className="mt-6 rounded-2xl bg-blue-50 p-5"><h2 className="font-bold">{t('profile.localTitle')}</h2><p className="mt-2 text-slate-600">{t('profile.localBody')}</p></div></Layout>;
}
