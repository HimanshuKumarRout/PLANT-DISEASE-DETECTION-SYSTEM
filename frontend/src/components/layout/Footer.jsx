import React from 'react';
import { Leaf, ShieldAlert } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="site-container footer-inner">
        <div className="footer-left">
          <div className="brand-icon-box" style={{ width: '30px', height: '30px' }}>
            <Leaf size={16} />
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>BioShield AI</span>
            <p className="footer-copy">
              &copy; {new Date().getFullYear()} Precision Crop Health & Disease Diagnostic Platform.
            </p>
          </div>
        </div>

        <div className="footer-tags">
          <span className="footer-tag-pill">React 18</span>
          <span className="footer-tag-pill">Vite 6</span>
          <span className="footer-tag-pill">PyTorch 2.0</span>
          <span className="footer-tag-pill">Flask API</span>
          <span className="footer-tag-pill">LeafCNN v1.0</span>
        </div>
      </div>

      <div className="site-container" style={{ marginTop: '16px' }}>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
          Disclaimer: BioShield AI deep learning diagnosis is designed as an agricultural advisory assistant. For commercial crop interventions, cross-verify critical field infections with a certified local agronomist.
        </p>
      </div>
    </footer>
  );
}
