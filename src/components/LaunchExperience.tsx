import { useEffect, useRef } from 'react';
import { getSettings } from '@/lib/storage';

export function LaunchExperience({ onComplete }: { onComplete: () => void }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const language = getSettings().language;
  const skipLabel: Record<typeof language, string> = {
    en: 'Skip intro →', hi: 'परिचय छोड़ें →', bn: 'ভূমিকা এড়িয়ে যান →',
    ta: 'அறிமுகத்தைத் தவிர் →', te: 'పరిచయాన్ని దాటవేయి →', ml: 'ആമുഖം ഒഴിവാക്കുക →',
  };
  useEffect(() => {
    const complete = (event: MessageEvent) => {
      if (event.origin === window.location.origin && event.source === frame.current?.contentWindow && event.data?.type === 'riskradar-intro-complete') onComplete();
    };
    window.addEventListener('message', complete);
    return () => window.removeEventListener('message', complete);
  }, [onComplete]);
  return <div className="fixed inset-0 z-50 bg-slate-950">
    <iframe ref={frame} src="/animation.html" title="RiskRadar opening animation — tap to open" className="h-full w-full border-0" />
    <button onClick={onComplete} aria-label={skipLabel[language]} className="absolute right-5 top-5 rounded-full border border-white/40 bg-slate-900 px-5 py-3 font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">{skipLabel[language]}</button>
  </div>;
}
