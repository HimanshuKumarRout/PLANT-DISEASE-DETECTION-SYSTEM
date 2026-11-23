import React from 'react';
import { Cpu, Layers, GitBranch, Shield, Zap, Sparkles, CheckCircle2 } from 'lucide-react';

const PIPELINE_STAGES = [
  {
    step: '01',
    name: 'Input Layer',
    tensor: '3 × 224 × 224',
    desc: 'High-resolution RGB leaf photograph preprocessed and scaled to [0.0, 1.0] float32 tensors.'
  },
  {
    step: '02',
    name: 'Conv Block 1',
    tensor: '16 × 112 × 112',
    desc: 'Conv2d(3, 16, k=3, p=1) + BatchNorm2d + ReLU activation + MaxPool2d(2, 2) edge detectors.'
  },
  {
    step: '03',
    name: 'Conv Block 2',
    tensor: '32 × 56 × 56',
    desc: 'Conv2d(16, 32, k=3, p=1) + BatchNorm2d + ReLU + MaxPool2d(2, 2) texture & lesion detectors.'
  },
  {
    step: '04',
    name: 'Conv Block 3',
    tensor: '64 × 28 × 28',
    desc: 'Conv2d(32, 64, k=3, p=1) + BatchNorm2d + ReLU + MaxPool2d(2, 2) high-level pathology representations.'
  },
  {
    step: '05',
    name: 'Linear Classifier',
    tensor: '50,176 → 128',
    desc: 'Flatten layer feeding into Linear(64*28*28, 128) + ReLU + Dropout(p=0.5) to avoid overfitting.'
  },
  {
    step: '06',
    name: 'Softmax Output',
    tensor: '10 Logits',
    desc: 'Linear(128, 10) producing categorical probabilities normalized across all 10 plant disease classes.'
  }
];

export default function ModelArchitecture() {
  return (
    <div className="architecture-view">
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>
          PyTorch LeafCNN Architecture
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '620px', margin: '0 auto' }}>
          Designed specifically for agricultural edge devices, this 3-block convolutional neural network achieves high pathogen detection accuracy with negligible latency.
        </p>
      </div>

      {/* Pipeline Blocks */}
      <div className="arch-pipeline-flow">
        {PIPELINE_STAGES.map((stage) => (
          <div key={stage.step} className="arch-block-card">
            <span className="arch-block-badge">STAGE {stage.step}</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '4px' }}>
              {stage.name}
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--primary-light)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '8px' }}>
              {stage.tensor}
            </span>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {stage.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Model Specifications Grid */}
      <div className="glass-panel" style={{ marginTop: '32px' }}>
        <div className="panel-header">
          <div className="panel-title-wrap">
            <div className="panel-icon-badge">
              <Cpu size={18} />
            </div>
            <div>
              <h3 className="panel-title">Model Specifications & Hyperparameters</h3>
              <p className="panel-desc">Empirically optimized training configuration</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginTop: '16px' }}>
          <div style={{ background: 'rgba(3, 12, 7, 0.5)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Optimization Algorithm</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '4px' }}>Adam Optimizer (lr=0.001)</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Adaptive learning rates per-weight tensor.</p>
          </div>

          <div style={{ background: 'rgba(3, 12, 7, 0.5)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Loss Criterion</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '4px' }}>CrossEntropyLoss</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Multi-class logarithmic loss penalization.</p>
          </div>

          <div style={{ background: 'rgba(3, 12, 7, 0.5)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Regularization Strategy</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '4px' }}>BatchNorm + Dropout (0.5)</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Prevents co-adaptation of internal node weights.</p>
          </div>

          <div style={{ background: 'rgba(3, 12, 7, 0.5)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Input Dimensions</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '4px' }}>224 × 224 × 3 RGB</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Standard computer vision input matrix.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
