import React, { useState, useEffect } from 'react';
import {
  Activity,
  Scan,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Copy,
  Printer,
  CheckCircle2,
  Stethoscope,
  Bug,
  Sparkles,
  Flame,
  FileDown
} from 'lucide-react';
import ReportModal from '../report/ReportModal';
import OfficialPdfReport from '../report/OfficialPdfReport';

const STATUS_PHRASES = [
  'Initializing neural layers & tensor weights...',
  'Rescaling foliage matrix to 224×224 RGB tensors...',
  'Extracting deep convolutional feature maps...',
  'Computing batch-normalized activation vectors...',
  'Calculating softmax categorical probabilities...',
  'Compiling agronomic pathology recommendations...'
];

const TABS = [
  { id: 'symptoms', label: 'Symptoms & Diagnosis', icon: Stethoscope },
  { id: 'causes', label: 'Pathogen & Causes', icon: Bug },
  { id: 'prevention', label: 'Preventative Care', icon: ShieldCheck },
  { id: 'treatment', label: 'Agronomic Treatment', icon: Flame }
];

export default function DiagnosticHub({ result, isLoading, apiBase = '' }) {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [activeTab, setActiveTab] = useState('symptoms');
  const [copied, setCopied] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Cycle loader phrases
  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setPhraseIdx((prev) => (prev + 1) % STATUS_PHRASES.length);
    }, 600);
    return () => clearInterval(interval);
  }, [isLoading]);

  // Handle report copy
  const handleCopyReport = () => {
    if (!result) return;
    const text = `BioShield AI Diagnostic Report
--------------------------------------
Plant: ${result.plant_name}
Diagnosis: ${result.disease_name}
Confidence: ${result.confidence}%
Symptoms:
${(result.symptoms || []).map((s) => `• ${s}`).join('\n')}
Causes:
${(result.causes || []).map((c) => `• ${c}`).join('\n')}
Prevention:
${(result.prevention || []).map((p) => `• ${p}`).join('\n')}
Treatment:
${(result.treatment || []).map((t) => `• ${t}`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="glass-panel diagnostic-hub-panel">
        <div className="loading-hud-state">
          <div className="cyber-reticle-box">
            <div className="reticle-spin-ring" />
            <div className="reticle-spin-reverse" />
            <Scan size={36} className="reticle-core-icon" />
          </div>

          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '6px' }}>
            Running Convolutional Inference
          </h3>

          <div className="hud-progress-track">
            <div className="hud-progress-fill" />
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', minHeight: '1.5em' }}>
            {STATUS_PHRASES[phraseIdx]}
          </p>
        </div>
      </div>
    );
  }

  // 2. Standby / Empty State
  if (!result) {
    return (
      <div className="glass-panel diagnostic-hub-panel">
        <div className="standby-state">
          <div className="standby-radar-wrapper">
            <Activity size={40} />
          </div>

          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>
            Neural Diagnostic Engine Ready
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '460px' }}>
            Awaiting input leaf imagery. Upload a leaf photo or pick a sample crop from the left to start automated pathogen detection and advisory generation.
          </p>

          <div className="standby-steps-row">
            <div className="standby-step-box">
              <span className="step-num">STAGE 01</span>
              <p>Image Preprocessing & 224x224 Tensor Scaling</p>
            </div>
            <div className="standby-step-box">
              <span className="step-num">STAGE 02</span>
              <p>PyTorch 3-Block CNN Feature Extraction</p>
            </div>
            <div className="standby-step-box">
              <span className="step-num">STAGE 03</span>
              <p>Pathology Knowledge Base Cross-Referencing</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Result State
  const isHealthy = result.disease_name?.toLowerCase() === 'healthy';
  const imageUrl = result.image_url?.startsWith('http')
    ? result.image_url
    : `${apiBase}${result.image_url}`;

  // Confidence calculations
  const circumference = 213.6; // 2 * Math.PI * 34
  const offset = circumference - (result.confidence / 100) * circumference;
  const strokeColor = isHealthy ? 'var(--status-healthy)' : 'var(--primary-light)';

  // Severity
  const severityClass = isHealthy ? 'healthy' : result.confidence > 80 ? 'critical' : 'moderate';
  const severityLabel = isHealthy
    ? 'Low Risk • Normal Foliage'
    : result.confidence > 80
    ? 'High Risk • Immediate Treatment Required'
    : 'Moderate Risk • Monitor Spread';

  return (
    <div className="glass-panel diagnostic-hub-panel">
      <div className="result-card-container">
        {/* Banner */}
        <div className="result-top-banner">
          <div className="result-heading-meta">
            <div className="crop-badge-icon">
              <Scan size={26} />
            </div>
            <div>
              <span className="crop-name-pill">{result.plant_name} Specimen</span>
              <h2 className="disease-name-lg">{result.disease_name}</h2>
            </div>
          </div>

          {/* Severity tag */}
          <div className={`severity-pill ${severityClass}`}>
            <span className="status-dot" style={{ background: 'currentColor' }} />
            <span>{severityLabel}</span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="result-content-grid">
          {/* Left: Scan Preview and Gauge */}
          <div className="scan-visual-column">
            {/* HUD Scan Frame */}
            <div className="hud-scan-frame">
              <img src={imageUrl} alt={`${result.plant_name} ${result.disease_name}`} />
              <div className="hud-corner hud-top-l" />
              <div className="hud-corner hud-top-r" />
              <div className="hud-corner hud-bot-l" />
              <div className="hud-corner hud-bot-r" />
              <div className="hud-laser-beam" />
            </div>

            {/* Confidence Dial Card */}
            <div className="confidence-dial-card">
              <div className="dial-text-block">
                <span className="dial-label-muted">Certainty Metric</span>
                <div className="dial-metric-big">{result.confidence}%</div>
                <span style={{ fontSize: '0.72rem', color: 'var(--primary-light)' }}>
                  Softmax Probability
                </span>
              </div>

              {/* Radial Meter */}
              <div style={{ position: 'relative', width: '70px', height: '70px' }}>
                <svg width="70" height="70" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke={strokeColor}
                    strokeWidth="6"
                    strokeLinecap="round"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{
                      transform: 'rotate(-90deg)',
                      transformOrigin: '50% 50%',
                      transition: 'stroke-dashoffset 1s ease'
                    }}
                  />
                </svg>
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)'
                  }}
                >
                  AI
                </div>
              </div>
            </div>
          </div>

          {/* Right: Detailed Pathology Tabs */}
          <div className="pathology-tabs-wrapper">
            <nav className="pathology-nav-tabs">
              {TABS.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    className={`path-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <IconComponent size={15} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Tab Body */}
            <div className="tab-detail-pane">
              <ul className="pathology-bullets-list">
                {activeTab === 'symptoms' &&
                  (result.symptoms || []).map((item, idx) => <li key={idx}>{item}</li>)}

                {activeTab === 'causes' &&
                  (result.causes || []).map((item, idx) => <li key={idx}>{item}</li>)}

                {activeTab === 'prevention' &&
                  (result.prevention || []).map((item, idx) => <li key={idx}>{item}</li>)}

                {activeTab === 'treatment' &&
                  (result.treatment || []).map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            </div>

            {/* Action Bar */}
            <div className="result-toolbar">
              <button
                type="button"
                className="btn-secondary-action"
                onClick={handleCopyReport}
                title="Copy diagnosis report to clipboard"
              >
                {copied ? <CheckCircle2 size={15} color="var(--primary-light)" /> : <Copy size={15} />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
              </button>

              <button
                type="button"
                className="btn-primary-action print-cta-btn"
                onClick={() => setShowReportModal(true)}
                title="Open official PDF laboratory report"
              >
                <FileDown size={16} />
                <span>Export / Print PDF Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Hidden on Screen, Activated during Browser Print / Save to PDF */}
        <div className="print-only-container">
          <OfficialPdfReport result={result} apiBase={apiBase} />
        </div>

        {/* Interactive A4 Report Preview Modal */}
        <ReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          result={result}
          apiBase={apiBase}
        />
      </div>
    </div>
  );
}
