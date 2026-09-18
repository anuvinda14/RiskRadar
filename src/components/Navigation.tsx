import { Home, History, ScanLine, GraduationCap, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { Route } from '@/context/AppContext';
import { Logo } from '@/components/Logo';

const links = [
  {name:'home',label:'Home',icon:Home}, {name:'scan',label:'Scan',icon:ScanLine},
  {name:'history',label:'History',icon:History}, {name:'learn',label:'Learn',icon:GraduationCap},
  {name:'profile',label:'Profile',icon:User},
] as const;

function NavLinks({mobile = false}: {mobile?:boolean}) {
  const {navigate, route} = useApp();
  const active = route.name === 'check' ? 'scan' : ['contact','settings'].includes(route.name) ? 'profile' : route.name;
  return <>{links.map(({name,label,icon:Icon}) => <button key={name} aria-current={active === name ? 'page' : undefined} onClick={() => navigate({name} as Route)} className={`${mobile ? 'flex-1 flex-col gap-1 py-3 text-xs' : 'gap-2 px-4 py-3'} flex min-h-12 items-center justify-center rounded-xl font-semibold ${active === name ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}><Icon size={23}/>{label}</button>)}</>;
}
export function Header() {
  const {navigate} = useApp();
  return <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur"><div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3"><button onClick={() => navigate({name:'home'})} className="flex min-w-0 items-center gap-3 text-left"><Logo size={44}/><span className="min-w-0"><strong className="block text-xl text-slate-900">RiskRadar</strong><span className="block text-xs text-slate-600 sm:text-sm">Detect the danger before it strikes</span></span></button><nav aria-label="Main" className="hidden gap-1 md:flex"><NavLinks/></nav></div></header>;
}
export function BottomNav() {
  return <nav aria-label="Main" className="fixed bottom-0 inset-x-0 z-40 border-t border-slate-200 bg-white px-2 pb-[env(safe-area-inset-bottom)] md:hidden"><div className="mx-auto flex max-w-2xl"><NavLinks mobile/></div></nav>;
}
