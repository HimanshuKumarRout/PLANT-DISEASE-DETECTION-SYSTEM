import React from 'react';
import { Zap, ShieldCheck, Cpu, Sprout, Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-pill-badge">
        <Sparkles size={14} />
        <span>Next-Gen Agricultural Vision AI</span>
      </div>

      <h1 className="hero-title">
        Protect Your Crops with <br />
        <span className="hero-gradient-text">Real-Time Deep Learning</span> Diagnostics
      </h1>

      <p className="hero-subtext">
        Upload or photograph leaf foliage to instantaneously detect crop pathogens, assess infection severity, and generate agronomic treatment plans powered by PyTorch CNNs.
      </p>

      {/* Live Metric Strip */}
      <div className="metrics-strip">
        <div className="metric-card">
          <div className="metric-icon-wrap">
            <Zap size={22} />
          </div>
          <div className="metric-details">
            <div className="metric-value">&lt; 150ms</div>
            <div className="metric-label">Inference Latency</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap">
            <ShieldCheck size={22} />
          </div>
          <div className="metric-details">
            <div className="metric-value">99.2%</div>
            <div className="metric-label">Validation Accuracy</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap">
            <Sprout size={22} />
          </div>
          <div className="metric-details">
            <div className="metric-value">10 Classes</div>
            <div className="metric-label">4 Key Food Crops</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap">
            <Cpu size={22} />
          </div>
          <div className="metric-details">
            <div className="metric-value">PyTorch CNN</div>
            <div className="metric-label">Edge-Ready Engine</div>
          </div>
        </div>
      </div>
    </section>
  );
}
