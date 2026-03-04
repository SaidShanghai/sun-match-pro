interface AnimatedCounterProps {
  end: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export default function AnimatedCounter({
  end,
  decimals = 0,
  suffix = "",
  prefix = "",
  className = "",
}: AnimatedCounterProps) {
  const formatted = decimals > 0 ? end.toFixed(decimals) : Math.round(end).toLocaleString("fr-FR");
  return <span className={className}>{prefix}{formatted}{suffix}</span>;
}
