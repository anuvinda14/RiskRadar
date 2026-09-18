import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Header, BottomNav } from '@/components/Navigation';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';

interface LayoutProps {
  children: ReactNode;
  showBack?: boolean;
  title?: string;
}

export function Layout({ children, showBack, title }: LayoutProps) {
  const { goBack } = useApp();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="mx-auto w-full max-w-6xl min-w-0 flex-1 px-4 py-6 pb-28 md:pb-8">
        {showBack && (
          <div className="mb-4">
            <Button variant="ghost" onClick={goBack} className="!px-3 !py-2">
              <ArrowLeft size={20} />
              <span style={{ fontSize: 'var(--text-base)' }}>{title}</span>
            </Button>
          </div>
        )}
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
