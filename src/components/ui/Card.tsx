import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`es-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow ${onClick ? 'cursor-pointer hover:shadow-md' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
