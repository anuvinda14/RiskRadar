import { useEffect, useRef } from 'react';

export function LaunchExperience({ onComplete }: { onComplete: () => void }) {
  const frame = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const complete = (event: MessageEvent) => {
      if (event.origin === window.location.origin && event.source === frame.current?.contentWindow && event.data?.type === 'riskradar-intro-complete') onComplete();
    };
    window.addEventListener('message', complete);
    return () => window.removeEventListener('message', complete);
  }, [onComplete]);
  return <div className="fixed inset-0 z-50 bg-slate-950">
    <iframe ref={frame} src="/animation.html" title="RiskRadar opening animation — tap to open" className="h-full w-full border-0" />
    <button onClick={onComplete} className="absolute right-5 top-5 rounded-full border border-white/40 bg-slate-900 px-5 py-3 font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">Skip intro →</button>
  </div>;
}
