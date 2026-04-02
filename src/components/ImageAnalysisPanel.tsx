import { useState, useRef } from "react";
import { Image as ImageIcon, Upload, Loader2, AlertTriangle, CheckCircle } from "lucide-react";

interface ImageResult {
  label: "AUTHENTIC" | "MANIPULATED";
  confidence: number;
  regions: { x: number; y: number; w: number; h: number; score: number }[];
}

interface ImageAnalysisPanelProps {
  onAnalyze: (file: File) => void;
  result: ImageResult | null;
  isLoading: boolean;
}

const ImageAnalysisPanel = ({ onAnalyze, result, isLoading }: ImageAnalysisPanelProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setPreview(URL.createObjectURL(file));
    onAnalyze(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="glass-card p-6 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <ImageIcon className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Image Analysis</h3>
        <span className="ml-auto text-xs font-mono text-muted-foreground">CNN Engine</span>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`flex-1 min-h-[140px] rounded-lg border-2 border-dashed cursor-pointer flex flex-col items-center justify-center transition-colors ${
          dragOver ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30 bg-secondary/30"
        }`}
      >
        {preview ? (
          <div className="relative w-full h-full min-h-[140px]">
            <img src={preview} alt="Upload preview" className="w-full h-full object-contain rounded-lg max-h-[200px]" />
            {/* Grad-CAM overlay simulation */}
            {result && result.regions.map((r, i) => (
              <div
                key={i}
                className="absolute border-2 border-destructive/60 rounded"
                style={{
                  left: `${r.x}%`, top: `${r.y}%`,
                  width: `${r.w}%`, height: `${r.h}%`,
                  background: `radial-gradient(circle, hsl(0, 72%, 51%, ${r.score * 0.3}) 0%, transparent 70%)`,
                }}
              />
            ))}
            {isLoading && (
              <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center rounded-lg">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <span className="text-xs font-mono text-primary">Scanning...</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground">Drop an image or click to upload</span>
            <span className="text-xs text-muted-foreground/60 mt-1">PNG, JPG up to 10MB</span>
          </>
        )}
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
      }} />

      {result && (
        <div className="mt-4 space-y-3">
          <div className={`flex items-center gap-2 p-3 rounded-lg ${result.label === "AUTHENTIC" ? "bg-success/10 border border-success/20" : "bg-destructive/10 border border-destructive/20"}`}>
            {result.label === "AUTHENTIC" ? (
              <CheckCircle className="w-5 h-5 text-success" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-destructive" />
            )}
            <div>
              <span className={`font-bold font-mono text-sm ${result.label === "AUTHENTIC" ? "text-success" : "text-destructive"}`}>
                {result.label}
              </span>
              <span className="text-muted-foreground text-xs ml-2">
                {(result.confidence * 100).toFixed(1)}% confidence
              </span>
            </div>
          </div>

          <div>
            <div className="text-xs text-muted-foreground font-mono mb-2">Grad-CAM · Attention Regions</div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${result.confidence * 100}%`,
                  background: result.label === "AUTHENTIC"
                    ? "linear-gradient(90deg, hsl(142, 76%, 46%), hsl(170, 80%, 40%))"
                    : "linear-gradient(90deg, hsl(38, 92%, 50%), hsl(0, 72%, 51%))",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageAnalysisPanel;
