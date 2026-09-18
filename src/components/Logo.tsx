
interface LogoProps {
  size?: number;
}

export function Logo({ size = 40 }: LogoProps) {
  return (
    <img src="/riskradar-logo.jpeg" alt="RiskRadar" width={size} height={size} className="shrink-0 rounded-xl object-contain" />
  );
}
