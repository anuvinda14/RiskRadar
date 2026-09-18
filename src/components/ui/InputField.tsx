import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';

interface LabelProps {
  htmlFor?: string;
  children: ReactNode;
}

export function Label({ htmlFor, children }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block font-semibold text-slate-700"
      style={{ fontSize: 'var(--text-lg)' }}
    >
      {children}
    </label>
  );
}

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function InputField({ label, id, className = '', ...props }: InputFieldProps) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <input
        id={id}
        className={`es-input w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-200 ${className}`}
        style={{ fontSize: 'var(--text-base)' }}
        {...props}
      />
    </div>
  );
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function TextAreaField({ label, id, className = '', ...props }: TextAreaFieldProps) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <textarea
        id={id}
        className={`es-input w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-200 ${className}`}
        style={{ fontSize: 'var(--text-base)' }}
        rows={5}
        {...props}
      />
    </div>
  );
}
