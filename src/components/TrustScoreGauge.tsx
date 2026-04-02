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
    <div className="flex flex-col items-center gap-3 mt-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="overflow-visible -rotate-90">
          <circle
            cx={center} cy={center} r={radius}
            fill="none"
            stroke="hsl(222, 30%, 18%)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={center} cy={center} r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-bold text-foreground" style={{ fontSize: size * 0.22 }}>
            {score}%
          </span>
          <span
            className="font-mono font-semibold text-xs"
            style={{ color, fontSize: size * 0.09 }}
          >
            {status}
          </span>
        </div>
      </div>

      <div className="text-center mt-2">
        <div className="text-sm font-medium text-muted-foreground">{label}</div>
        <div className="text-xs text-muted-foreground/60">{sublabel}</div>
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
    <div className="glass-card p-10">
      <h3 className="text-lg font-bold text-foreground tracking-wide uppercase mb-10 text-center">
        Trust Scores
      </h3>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">
        
        {/* Text gauge */}
        {textScore !== null && (
          <div className="flex flex-col items-center">
            <RingGauge
              score={textScore}
              size={110}
              strokeWidth={7}
              label="Text Analysis"
              sublabel="DistilBERT"
            />
          </div>
        )}

        {/* Fused gauge (center focus) */}
        <div className="flex flex-col items-center scale-110">
          <RingGauge
            score={fusedScore}
            size={170}
            strokeWidth={12}
            label="Fused Score"
            sublabel="Final Trust"
          />
        </div>

        {/* Image gauge */}
        {imageScore !== null && (
          <div className="flex flex-col items-center">
            <RingGauge
              score={imageScore}
              size={110}
              strokeWidth={7}
              label="Image Analysis"
              sublabel="MobileNetV2"
            />
          </div>
        )}

      </div>
    </div>
  );
};

export default TrustScoreGauge;
