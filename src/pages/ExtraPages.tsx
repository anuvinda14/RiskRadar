import { useState } from 'react';
import { GraduationCap, ImagePlus, MessageSquare, Link2, QrCode, Mail, Phone, Settings, User } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { useApp } from '@/context/AppContext';
import type { CheckType } from '@/types';

const lessons = [
  ['Electricity bill threats', 'A message threatens an immediate disconnection and sends you to an unfamiliar payment page.', 'Check your bill in the utility’s official app or contact it using a number you already trust.'],
  ['KYC and account suspension', 'A sender pressures you to update banking details or disclose a code to keep an account open.', 'Open your bank’s official app independently. Do not send verification codes to a caller or message sender.'],
  ['Delivery fee requests', 'An unexpected parcel message asks for a small redelivery payment through a link.', 'Check your order and tracking details with the courier using an independently obtained address.'],
  ['Lottery and prize fees', 'A stranger claims you won a prize but must pay before receiving it.', 'Pause before paying. Verify whether you entered the competition and contact its organizer independently.'],
  ['Job and task offers', 'Easy earnings are promised, followed by requests for deposits to unlock tasks or withdrawals.', 'Verify the employer and terms independently. Do not transfer money under pressure.'],
  ['Investment promises', 'A contact promises guaranteed large profits and pressures you to deposit quickly.', 'Treat guarantees and pressure as warning signs. Verify the provider independently before considering an offer.'],
  ['Family impersonation', 'Someone using a new number claims to be a relative in trouble and requests urgent money.', 'Call your relative on their known number or contact another family member before acting.'],
  ['QR payment traps', 'Someone asks you to scan a payment QR and enter your PIN in order to receive money.', 'Read the payment screen carefully. Do not authorize an outgoing payment to receive money.'],
];
const questions = [
  {text:'Your electricity will be disconnected tonight. Pay immediately at https://bill-payment.example or send your OTP to our officer.', scam:true, explanation:'The deadline, unfamiliar destination and request for an OTP are warning signs. Check with your utility independently.'},
  {text:'Our class begins at 10 AM tomorrow. Please bring your assignment.', scam:false, explanation:'This fictional example contains an ordinary reminder with no payment, credential request or threatening deadline. Context still matters.'},
  {text:'You have won a prize! Send a processing fee now to release your winnings.', scam:true, explanation:'An unexpected prize combined with an upfront payment request is a warning sign.'},
];

export function LearnPage() {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const question = questions[index];
  const choose = (value: boolean) => { if (answer !== null) return; setAnswer(value); if (value === question.scam) setScore(s => s + 1); };
  return <Layout><section className="mx-auto max-w-4xl">
    <h1 className="flex items-center gap-3 text-3xl font-extrabold text-slate-900"><GraduationCap className="text-blue-700"/> Scam Academy</h1>
    <p className="mt-3 mb-6 text-slate-600">Learn eight common scam patterns and practice spotting warning signs.</p>
    <section className="rounded-3xl border border-blue-200 bg-blue-50 p-5 sm:p-7" aria-labelledby="simulator-title">
      <div className="flex justify-between gap-3"><h2 id="simulator-title" className="text-xl font-bold">Scam Simulator</h2><span>{index + 1} of {questions.length}</span></div>
      <p className="mt-2">Would you trust this message?</p><p className="mt-1 text-sm text-slate-500">Fictional practice examples. These answers are educational, not model predictions.</p>
      <blockquote className="my-5 rounded-2xl bg-white p-5 text-lg text-slate-800">{question.text}</blockquote>
      <div className="grid grid-cols-2 gap-3"><button disabled={answer !== null} onClick={() => choose(false)} className="min-h-14 rounded-xl bg-emerald-700 p-3 font-bold text-white disabled:opacity-60">Looks safe</button><button disabled={answer !== null} onClick={() => choose(true)} className="min-h-14 rounded-xl bg-red-700 p-3 font-bold text-white disabled:opacity-60">Scam signs</button></div>
      {answer !== null && <div role="status" className="mt-5 rounded-xl border border-blue-200 bg-white p-4"><strong>{answer === question.scam ? 'Correct!' : 'Let’s look at the clues.'}</strong><p className="mt-2">{question.explanation}</p><p className="mt-2 font-semibold">Score: {score} / {index + 1}</p><button onClick={() => {if(index === questions.length - 1){setIndex(0);setScore(0);} else setIndex(i => i+1);setAnswer(null);}} className="mt-3 min-h-12 rounded-xl bg-blue-700 px-5 font-bold text-white">{index === questions.length - 1 ? 'Practice again' : 'Next example'}</button></div>}
    </section>
    <h2 className="mt-8 mb-4 text-xl font-bold">Know the playbook</h2>
    <div className="grid gap-3 sm:grid-cols-2">{lessons.map(([title, sign, action]) => <details key={title} className="self-start rounded-2xl border border-slate-200 bg-white p-5"><summary className="cursor-pointer font-bold text-slate-900">{title}</summary><p className="mt-3 text-slate-600">{sign}</p><p className="mt-3 text-blue-900"><strong>What to do: </strong>{action}</p></details>)}</div>
  </section></Layout>;
}

export function ScanPage() {
  const { navigate } = useApp();
  const options: {type:CheckType; label:string; detail:string; icon:typeof ImagePlus}[] = [
    {type:'screenshot',label:'Scan Screenshot',detail:'Upload, extract and review the text.',icon:ImagePlus},
    {type:'message',label:'Analyze Message',detail:'Paste an SMS or chat message.',icon:MessageSquare},
    {type:'url',label:'Check Link',detail:'Check a website address without opening it.',icon:Link2},
    {type:'qr',label:'Check QR Link',detail:'Paste a destination copied from a QR code.',icon:QrCode},
    {type:'emailAd',label:'Check Email / Ad',detail:'Paste an email or advertisement’s text.',icon:Mail},
  ];
  return <Layout><h1 className="mb-6 text-3xl font-bold">What would you like to check?</h1><div className="grid gap-4 sm:grid-cols-2">{options.map(({type,label,detail,icon:Icon}) => <button key={type} onClick={() => navigate({name:'check',checkType:type})} className="rr-history-item flex items-center gap-4 text-left"><Icon className="shrink-0 text-blue-700"/><span><strong className="block text-lg">{label}</strong><span className="text-slate-600">{detail}</span></span></button>)}</div></Layout>;
}

export function ProfilePage() {
  const {navigate, trustedContact} = useApp();
  return <Layout><h1 className="mb-6 flex items-center gap-3 text-3xl font-bold"><User/> Your profile</h1><div className="grid gap-4 sm:grid-cols-2"><button onClick={() => navigate({name:'contact'})} className="rr-history-item text-left"><Phone className="mb-3 text-blue-700"/><h2 className="text-xl font-bold">Trusted contact</h2><p className="mt-2 text-slate-600">{trustedContact ? trustedContact.name : 'Choose someone to ask when you are unsure.'}</p></button><button onClick={() => navigate({name:'settings'})} className="rr-history-item text-left"><Settings className="mb-3 text-blue-700"/><h2 className="text-xl font-bold">Settings</h2><p className="mt-2 text-slate-600">Language, larger text and high contrast.</p></button></div><div className="mt-6 rounded-2xl bg-blue-50 p-5"><h2 className="font-bold">Saved on this device</h2><p className="mt-2 text-slate-600">Your history, preferences and trusted contact stay in this browser. Google sign-in and cross-device sync will be added later.</p></div></Layout>;
}
