import { useState } from "react";
import { FileText, Loader2, AlertTriangle, CheckCircle } from "lucide-react";

interface TextResult {
  label: "REAL" | "FAKE";
  confidence: number;
  highlights: { word: string; importance: number }[];
}

interface TextAnalysisPanelProps {
  onAnalyze: (text: string) => void;
  result: TextResult | null;
  isLoading: boolean;
}

const sampleTexts = [
  "Breaking: Scientists confirm water found on Mars surface, raising hopes for future colonization missions.",
  "SHOCKING: Celebrity caught shapeshifting on live TV! Government coverup exposed by anonymous sources!",
  "The Federal Reserve announced a 0.25% interest rate increase, citing persistent inflation concerns.",
];

const TextAnalysisPanel = ({ onAnalyze, result, isLoading }: TextAnalysisPanelProps) => {
  const [text, setText] = useState("");

  const handleAnalyze = () => {
    if (text.trim()) onAnalyze(text);
  };

  return (
    <div className="glass-card p-6 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Text Analysis</h3>
        <span className="ml-auto text-xs font-mono text-muted-foreground">NLP Engine</span>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste text content to analyze for authenticity..."
        className="flex-1 min-h-[140px] bg-secondary/50 rounded-lg p-4 text-sm text-foreground placeholder:text-muted-foreground resize-none border border-border/50 focus:border-primary/50 focus:outline-none transition-colors"
      />

      <div className="flex gap-2 mt-3 flex-wrap">
        {sampleTexts.map((s, i) => (
          <button
            key={i}
            onClick={() => setText(s)}
            className="text-xs px-3 py-1.5 rounded-md bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors truncate max-w-[200px]"
          >
            Sample {i + 1}
          </button>
        ))}
      </div>

      <button
        onClick={handleAnalyze}
        disabled={!text.trim() || isLoading}
        className="mt-4 w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold disabled:opacity-40 hover:brightness-110 transition-all flex items-center justify-center gap-2"
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
        {isLoading ? "Analyzing..." : "Analyze Text"}
      </button>

      {result && (
        <div className="mt-4 space-y-3">
          <div className={`flex items-center gap-2 p-3 rounded-lg ${result.label === "REAL" ? "bg-success/10 border border-success/20" : "bg-destructive/10 border border-destructive/20"}`}>
            {result.label === "REAL" ? (
              <CheckCircle className="w-5 h-5 text-success" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-destructive" />
            )}
            <div>
              <span className={`font-bold font-mono text-sm ${result.label === "REAL" ? "text-success" : "text-destructive"}`}>
                {result.label}
              </span>
              <span className="text-muted-foreground text-xs ml-2">
                {(result.confidence * 100).toFixed(1)}% confidence
              </span>
            </div>
          </div>

          {result.highlights.length > 0 && (
            <div>
              <div className="text-xs text-muted-foreground font-mono mb-2">SHAP · Key Indicators</div>
              <div className="flex flex-wrap gap-1.5">
                {result.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 rounded text-xs font-mono border"
                    style={{
                      backgroundColor: h.importance > 0
                        ? `hsl(0, 72%, 51%, ${Math.abs(h.importance) * 0.3})`
                        : `hsl(142, 76%, 46%, ${Math.abs(h.importance) * 0.3})`,
                      borderColor: h.importance > 0
                        ? `hsl(0, 72%, 51%, 0.3)`
                        : `hsl(142, 76%, 46%, 0.3)`,
                      color: h.importance > 0 ? "hsl(0, 72%, 70%)" : "hsl(142, 76%, 70%)",
                    }}
                  >
                    {h.word}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TextAnalysisPanel;
