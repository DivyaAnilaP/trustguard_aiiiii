import { Clock, FileText, Image as ImageIcon, Shield } from "lucide-react";

interface LogEntry {
  id: string;
  type: "text" | "image" | "multimodal";
  timestamp: Date;
  trustScore: number;
  verdict: string;
}

const PredictionLog = ({ entries }: { entries: LogEntry[] }) => {
  if (entries.length === 0) return null;

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-success";
    if (score >= 40) return "text-warning";
    return "text-destructive";
  };

  const getIcon = (type: string) => {
    if (type === "text") return FileText;
    if (type === "image") return ImageIcon;
    return Shield;
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Prediction Log</h3>
        <span className="ml-auto text-xs font-mono text-muted-foreground">{entries.length} entries</span>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {entries.map((entry) => {
          const Icon = getIcon(entry.type);
          return (
            <div key={entry.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/40 hover:bg-secondary/60 transition-colors">
              <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-foreground truncate">{entry.verdict}</div>
                <div className="text-xs text-muted-foreground font-mono">
                  {entry.timestamp.toLocaleTimeString()}
                </div>
              </div>
              <div className={`text-sm font-bold font-mono ${getScoreColor(entry.trustScore)}`}>
                {entry.trustScore}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PredictionLog;
