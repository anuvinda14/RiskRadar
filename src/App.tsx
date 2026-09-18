import { AppProvider, useApp } from '@/context/AppContext';
import { HomePage } from '@/pages/HomePage';
import { CheckPage } from '@/pages/CheckPage';
import { ResultPage } from '@/pages/ResultPage';
import { ContactPage } from '@/pages/ContactPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { useState, useCallback } from 'react';
import { LaunchExperience } from '@/components/LaunchExperience';
import { LearnPage, ScanPage, ProfilePage } from '@/pages/ExtraPages';

function Router() {
  const { route } = useApp();

  switch (route.name) {
    case 'learn': return <LearnPage />;
    case 'scan': return <ScanPage />;
    case 'profile': return <ProfilePage />;
    case 'home':
      return <HomePage />;
    case 'check':
      return <CheckPage checkType={route.checkType} />;
    case 'result':
      return <ResultPage resultId={route.resultId} />;
    case 'contact':
      return <ContactPage />;
    case 'history':
      return <HistoryPage />;
    case 'settings':
      return <SettingsPage />;
    default:
      return <HomePage />;
  }
}

function App() {
  const [introDone, setIntroDone] = useState(() => {
    try { return sessionStorage.getItem('riskradar-intro-done') === 'yes'; } catch { return false; }
  });
  const completeIntro = useCallback(() => {
    try { sessionStorage.setItem('riskradar-intro-done', 'yes'); } catch { /* optional session persistence */ }
    setIntroDone(true);
  }, []);
  if (!introDone) return <LaunchExperience onComplete={completeIntro} />;
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}

export default App;
