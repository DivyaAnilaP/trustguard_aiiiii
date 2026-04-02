import { FileText, Cpu, Eye, GitMerge, BarChart3, Shield } from "lucide-react";

const steps = [
  { icon: FileText, label: "Input Layer", desc: "Text / Image / Both", color: "text-primary" },
  { icon: Cpu, label: "Preprocessing", desc: "Tokenize & Transform", color: "text-primary" },
  { icon: Eye, label: "ML Models", desc: "DistilBERT + MobileNetV2", color: "text-primary" },
  { icon: GitMerge, label: "Trust Fusion", desc: "Weighted Score Merge", color: "text-success" },
  { icon: BarChart3, label: "Explainability", desc: "SHAP + Grad-CAM", color: "text-chart-4" },
];

const SystemArchitecture = () => {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">System Architecture</h2>
        <p className="text-muted-foreground">End-to-end multimodal verification pipeline</p>
      </div>

      {/* Pipeline row */}
      <div className="flex flex-wrap items-start justify-center gap-3 md:gap-2">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-2 md:gap-3">
            <div className="glass-card p-5 text-center min-w-[140px] group hover:border-primary/30 transition-colors">
              <step.icon className={`w-7 h-7 ${step.color} mx-auto mb-3 group-hover:scale-110 transition-transform`} />
              <div className="text-sm font-semibold text-foreground">{step.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{step.desc}</div>
            </div>
            {i < steps.length - 1 && (
              <span className="text-muted-foreground/40 text-lg hidden md:block">→</span>
            )}
          </div>
        ))}
      </div>

      {/* Final output */}
      <div className="flex justify-center mt-6">
        <div className="flex flex-col items-center gap-2">
          <span className="text-muted-foreground/40 text-lg">↓</span>
          <div className="glass-card p-5 text-center min-w-[140px] border-primary/20">
            <Shield className="w-7 h-7 text-chart-4 mx-auto mb-3" />
            <div className="text-sm font-semibold text-foreground">Trust Score</div>
            <div className="text-xs text-muted-foreground mt-1">Final Verdict</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SystemArchitecture;
