import { useMemo } from "react";

interface TrustScoreGaugeProps {
  score: number; // 0-100
  label?: string;
  size?: number;
}

const TrustScoreGauge = ({ score, label = "Trust Score", size = 180 }: TrustScoreGaugeProps) => {
  const { color, glowClass, status } = useMemo(() => {
    if (score >= 70) return { color: "hsl(142, 76%, 46%)", glowClass: "shadow-[0_0_30px_hsl(142,76%,46%,0.3)]", status: "Trustworthy" };
    if (score >= 40) return { color: "hsl(38, 92%, 50%)", glowClass: "shadow-[0_0_30px_hsl(38,92%,50%,0.3)]", status: "Uncertain" };
    return { color: "hsl(0, 72%, 51%)", glowClass: "shadow-[0_0_30px_hsl(0,72%,51%,0.3)]", status: "Suspicious" };
  }, [score]);

  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference * 0.75;
  const center = size / 2;

  return (
    <div className={`glass-card p-6 flex flex-col items-center ${glowClass} transition-shadow duration-500`}>
      <svg width={size} height={size * 0.7} viewBox={`0 0 ${size} ${size * 0.85}`} className="overflow-visible">
        {/* Background arc */}
        <circle
          cx={center} cy={center}
          r={radius}
          fill="none"
          stroke="hsl(222, 30%, 18%)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
          transform={`rotate(135, ${center}, ${center})`}
        />
        {/* Score arc */}
        <circle
          cx={center} cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(135, ${center}, ${center})`}
          className="transition-all duration-1000 ease-out"
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
        {/* Score text */}
        <text x={center} y={center - 5} textAnchor="middle" className="fill-foreground text-4xl font-bold" style={{ fontSize: 36 }}>
          {score}
        </text>
        <text x={center} y={center + 20} textAnchor="middle" className="fill-muted-foreground text-xs font-mono" style={{ fontSize: 11 }}>
          / 100
        </text>
      </svg>
      <div className="text-center mt-2">
        <div className="text-sm font-semibold" style={{ color }}>{status}</div>
        <div className="text-xs text-muted-foreground font-mono">{label}</div>
      </div>
    </div>
  );
};

export default TrustScoreGauge;
