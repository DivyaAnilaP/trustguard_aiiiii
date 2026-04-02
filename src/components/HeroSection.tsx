import heroShield from "@/assets/hero-shield.png";
import { Shield, Zap, Eye, BarChart3 } from "lucide-react";

const features = [
  { icon: Shield, label: "Text Verification", desc: "DistilBERT NLP classifier" },
  { icon: Eye, label: "Deepfake Detection", desc: "MobileNetV2 vision model" },
  { icon: BarChart3, label: "Explainability", desc: "SHAP + Grad-CAM insights" },
  { icon: Zap, label: "Real-Time", desc: "Instant analysis results" },
];

const HeroSection = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-pattern opacity-40" />
      
      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <div className="animate-float mb-8">
          <img src={heroShield} alt="TrustGuard Shield" width={160} height={160} className="mx-auto drop-shadow-[0_0_40px_hsl(187,94%,43%,0.4)]" />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          <span className="text-sm font-mono text-primary">AI-Powered Content Verification</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          <span className="text-gradient">TrustGuard</span>{" "}
          <span className="text-foreground">AI</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Real-time multimodal content authenticity detection. Analyze text and images 
          to identify fake content, deepfakes, and misinformation with explainable AI.
        </p>

        <button
          onClick={onGetStarted}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-lg hover:brightness-110 transition-all duration-300 shadow-[0_0_30px_hsl(187,94%,43%,0.3)] hover:shadow-[0_0_50px_hsl(187,94%,43%,0.5)]"
        >
          <Shield className="w-5 h-5" />
          Start Analysis
        </button>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          {features.map((f) => (
            <div key={f.label} className="glass-card p-4 text-center group hover:border-primary/30 transition-colors">
              <f.icon className="w-6 h-6 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-sm font-semibold text-foreground">{f.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
