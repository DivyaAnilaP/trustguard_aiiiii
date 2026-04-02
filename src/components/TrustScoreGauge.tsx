import { useMemo } from "react";

interface RingGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label: string;
  sublabel: string;
}

const RingGauge = ({ score, size = 120, strokeWidth = 8, label, sublabel }: RingGaugeProps) => {
  const { color, status } = useMemo(() => {
    if (score >= 70) return { color: "hsl(160, 84%, 50%)", status: "AUTHENTIC" };
    if (score >= 40) return { color: "hsl(38, 92%, 50%)", status: "UNCERTAIN" };
    return { color: "hsl(0, 72%, 51%)", status: "SUSPICIOUS" };
  }, [score]);

  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const center = size / 2;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="overflow-visible -rotate-90">
          {/* Background ring */}
          <circle
            cx={center} cy={center} r={radius}
            fill="none"
            stroke="hsl(222, 30%, 18%)"
            strokeWidth={strokeWidth}
          />
          {/* Score ring */}
          <circle
            cx={center} cy={center} r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-bold text-foreground" style={{ fontSize: size * 0.22 }}>{score}%</span>
          <span className="font-mono font-semibold text-xs" style={{ color, fontSize: size * 0.09 }}>{status}</span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-xs text-muted-foreground/60 font-mono">{sublabel}</div>
      </div>
    </div>
  );
};

interface TrustScoreGaugeProps {
  fusedScore: number;
  textScore: number | null;
  imageScore: number | null;
}

const TrustScoreGauge = ({ fusedScore, textScore, imageScore }: TrustScoreGaugeProps) => {
  return (
    <div className="glass-card p-6">
      <h3 className="text-sm font-bold text-foreground tracking-wider uppercase mb-6">Trust Scores</h3>
      <div className="flex items-end justify-center gap-4">
        {/* Text gauge - smaller, left */}
        {textScore !== null && (
          <RingGauge score={textScore} size={100} strokeWidth={6} label="Text (DistilBERT)" sublabel="" />
        )}

        {/* Fused gauge - larger, center */}
        <RingGauge score={fusedScore} size={150} strokeWidth={10} label="Fused Trust Score" sublabel="" />

        {/* Image gauge - smaller, right */}
        {imageScore !== null && (
          <RingGauge score={imageScore} size={100} strokeWidth={6} label="Image (MobileNetV2)" sublabel="" />
        )}
      </div>
    </div>
  );
};

export default TrustScoreGauge;
