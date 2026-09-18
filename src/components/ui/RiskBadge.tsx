import type { RiskLevel } from '@/types';

interface RiskBadgeProps {
  level: RiskLevel;
  label: string;
}

const levelConfig: Record<RiskLevel, { classes: string; dot: string }> = {
  safe: { classes: 'risk-safe bg-green-100 text-green-800 border-green-300', dot: 'bg-green-500' },
  caution: { classes: 'risk-caution bg-amber-100 text-amber-800 border-amber-300', dot: 'bg-amber-500' },
  high: { classes: 'risk-high bg-red-100 text-red-800 border-red-300', dot: 'bg-red-500' },
};

export function RiskBadge({ level, label }: RiskBadgeProps) {
  const config = levelConfig[level];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-bold ${config.classes}`}
      style={{ fontSize: 'var(--text-lg)' }}
    >
      <span className={`h-3 w-3 rounded-full ${config.dot}`} />
      {label}
    </span>
  );
}
