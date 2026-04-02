import { useState, useRef, useCallback } from "react";
import HeroSection from "@/components/HeroSection";
import SystemArchitecture from "@/components/SystemArchitecture";
import TextAnalysisPanel from "@/components/TextAnalysisPanel";
import ImageAnalysisPanel from "@/components/ImageAnalysisPanel";
import TrustScoreGauge from "@/components/TrustScoreGauge";
import PredictionLog from "@/components/PredictionLog";
import { Shield } from "lucide-react";

interface TextResult {
  label: "REAL" | "FAKE";
  confidence: number;
  highlights: { word: string; importance: number }[];
}

interface ImageResult {
  label: "AUTHENTIC" | "MANIPULATED";
  confidence: number;
  regions: { x: number; y: number; w: number; h: number; score: number }[];
}

interface LogEntry {
  id: string;
  type: "text" | "image" | "multimodal";
  timestamp: Date;
  trustScore: number;
  verdict: string;
}

// Simulated analysis (replace with real AI backend)
const simulateTextAnalysis = (text: string): Promise<TextResult> =>
  new Promise((resolve) => {
    setTimeout(() => {
      const suspicious = /shocking|breaking|exposed|coverup|secret/i.test(text);
      const confidence = suspicious ? 0.15 + Math.random() * 0.3 : 0.7 + Math.random() * 0.25;
      const words = text.split(/\s+/).slice(0, 20);
      const highlights = words
        .filter(() => Math.random() > 0.6)
        .map((word) => ({
          word,
          importance: suspicious ? 0.3 + Math.random() * 0.7 : -(0.3 + Math.random() * 0.5),
        }))
        .slice(0, 8);
      resolve({
        label: confidence > 0.5 ? "REAL" : "FAKE",
        confidence,
        highlights,
      });
    }, 1500 + Math.random() * 1000);
  });

const simulateImageAnalysis = (_file: File): Promise<ImageResult> =>
  new Promise((resolve) => {
    setTimeout(() => {
      const isManipulated = Math.random() > 0.5;
      const confidence = isManipulated ? 0.6 + Math.random() * 0.35 : 0.7 + Math.random() * 0.25;
      const regions = isManipulated
        ? Array.from({ length: 2 + Math.floor(Math.random() * 3) }, () => ({
            x: 10 + Math.random() * 50,
            y: 10 + Math.random() * 50,
            w: 15 + Math.random() * 25,
            h: 15 + Math.random() * 25,
            score: 0.5 + Math.random() * 0.5,
          }))
        : [];
      resolve({
        label: isManipulated ? "MANIPULATED" : "AUTHENTIC",
        confidence,
        regions,
      });
    }, 2000 + Math.random() * 1000);
  });

const Index = () => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [textResult, setTextResult] = useState<TextResult | null>(null);
  const [imageResult, setImageResult] = useState<ImageResult | null>(null);
  const [textLoading, setTextLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const analysisRef = useRef<HTMLDivElement>(null);

  const computeTrustScore = useCallback(() => {
    if (!textResult && !imageResult) return 0;
    let score = 0;
    let weight = 0;
    if (textResult) {
      const textScore = textResult.label === "REAL" ? textResult.confidence * 100 : (1 - textResult.confidence) * 100;
      score += textScore * 0.6;
      weight += 0.6;
    }
    if (imageResult) {
      const imgScore = imageResult.label === "AUTHENTIC" ? imageResult.confidence * 100 : (1 - imageResult.confidence) * 100;
      score += imgScore * 0.4;
      weight += 0.4;
    }
    return Math.round(score / weight);
  }, [textResult, imageResult]);

  const addLog = (type: "text" | "image", score: number, verdict: string) => {
    setLogEntries((prev) => [
      { id: crypto.randomUUID(), type, timestamp: new Date(), trustScore: score, verdict },
      ...prev,
    ]);
  };

  const handleTextAnalyze = async (text: string) => {
    setTextLoading(true);
    const result = await simulateTextAnalysis(text);
    setTextResult(result);
    setTextLoading(false);
    const score = result.label === "REAL" ? Math.round(result.confidence * 100) : Math.round((1 - result.confidence) * 100);
    addLog("text", score, `Text: ${result.label} (${(result.confidence * 100).toFixed(0)}%)`);
  };

  const handleImageAnalyze = async (file: File) => {
    setImageLoading(true);
    const result = await simulateImageAnalysis(file);
    setImageResult(result);
    setImageLoading(false);
    const score = result.label === "AUTHENTIC" ? Math.round(result.confidence * 100) : Math.round((1 - result.confidence) * 100);
    addLog("image", score, `Image: ${result.label} (${(result.confidence * 100).toFixed(0)}%)`);
  };

  const handleGetStarted = () => {
    setShowAnalysis(true);
    setTimeout(() => analysisRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const trustScore = computeTrustScore();
  const hasResults = textResult || imageResult;

  return (
    <div className="min-h-screen bg-background">
      <HeroSection onGetStarted={handleGetStarted} />
      <SystemArchitecture />

      {showAnalysis && (
        <section ref={analysisRef} className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Analysis Dashboard</h2>
            <div className="ml-auto flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
              <span className="text-xs font-mono text-muted-foreground">System Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Text */}
            <div className="lg:col-span-1">
              <TextAnalysisPanel onAnalyze={handleTextAnalyze} result={textResult} isLoading={textLoading} />
            </div>

            {/* Center: Trust Score */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              {hasResults ? (
                <TrustScoreGauge
                  score={trustScore}
                  label={textResult && imageResult ? "Multimodal Fusion" : textResult ? "Text Only" : "Image Only"}
                />
              ) : (
                <div className="glass-card p-6 flex-1 flex flex-col items-center justify-center text-center">
                  <Shield className="w-12 h-12 text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">Analyze text or images to see your trust score</p>
                </div>
              )}
              <PredictionLog entries={logEntries} />
            </div>

            {/* Right: Image */}
            <div className="lg:col-span-1">
              <ImageAnalysisPanel onAnalyze={handleImageAnalyze} result={imageResult} isLoading={imageLoading} />
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-gradient">TrustGuard AI</span>
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            Real-Time Multimodal Content Authenticity Detection
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
