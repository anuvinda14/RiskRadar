import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: 'es-btn-primary bg-teal-700 text-white hover:bg-teal-800 focus-visible:ring-teal-600',
  secondary: 'es-btn-secondary bg-white text-teal-800 border-2 border-teal-600 hover:bg-teal-50 focus-visible:ring-teal-500',
  ghost: 'bg-transparent text-teal-700 hover:bg-teal-50 focus-visible:ring-teal-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
};

export function Button({ variant = 'primary', children, fullWidth, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      style={{ fontSize: 'var(--text-base)' }}
      {...props}
    >
      {children}
    </button>
  );
}
