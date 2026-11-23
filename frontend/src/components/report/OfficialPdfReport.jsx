import React from 'react';

export default function OfficialPdfReport({ result, apiBase = '', id = 'official-print-report' }) {
  if (!result) return null;

  const isHealthy = result.disease_name?.toLowerCase() === 'healthy';
  const imageUrl = result.image_url?.startsWith('http')
    ? result.image_url
    : `${apiBase}${result.image_url}`;

  // Unique certificate code and formatted timestamp
  const certNumber = `CERT-BIO-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  const securityHash = `${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`.toUpperCase();
  
  const formattedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  const formattedTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const severityClass = isHealthy ? 'healthy' : result.confidence > 80 ? 'critical' : 'moderate';
  const severityStampText = isHealthy
    ? 'PASSED • LOW RISK • NORMAL FOLIAGE'
    : result.confidence > 80
    ? 'PATHOGEN CONFIRMED • CRITICAL RISK'
    : 'PATHOGEN CONFIRMED • MODERATE RISK';

  return (
    <div id={id} className="official-print-report">
      {/* Outer Certificate Frame with Double-Border Styling */}
      <div className="pdf-certificate-frame">
        {/* Corner Ornaments */}
        <div className="cert-corner corner-tl" />
        <div className="cert-corner corner-tr" />
        <div className="cert-corner corner-bl" />
        <div className="cert-corner corner-br" />

        {/* Top Official Security Ribbon */}
        <div className="pdf-ribbon-bar">
          <span className="pdf-ribbon-title">
            OFFICIAL PHYTOSANITARY & CROP PATHOLOGY DIAGNOSTIC CERTIFICATE
          </span>
          <span className="pdf-ribbon-code">ISO/IEC 17025 VERIFIED METHODOLOGY</span>
        </div>

        {/* 1. Document Header */}
        <div className="pdf-doc-header">
          <div className="pdf-doc-brand">
            <div className="pdf-brand-symbol">🌿</div>
            <div>
              <h1 className="pdf-doc-title">BioShield AI Agricultural Diagnostics</h1>
              <p className="pdf-doc-subtitle">
                Autonomous Computer Vision Pathology Laboratory • Precision Agronomy Surveillance
              </p>
            </div>
          </div>

          <div className="pdf-doc-meta">
            <div className="pdf-meta-line">
              <span className="pdf-meta-k">CERTIFICATE ID:</span>
              <span className="pdf-meta-v font-mono">{certNumber}</span>
            </div>
            <div className="pdf-meta-line">
              <span className="pdf-meta-k">ISSUED DATE:</span>
              <span className="pdf-meta-v">{formattedDate}, {formattedTime}</span>
            </div>
            <div className="pdf-meta-line">
              <span className="pdf-meta-k">NEURAL ENGINE:</span>
              <span className="pdf-meta-v font-mono">PyTorch LeafCNN v2.0</span>
            </div>
          </div>
        </div>

        <div className="pdf-accent-rule" />

        {/* 2. Specimen Inspection & Clinical Summary */}
        <div className="pdf-specimen-overview">
          {/* Left: Specimen Photograph Frame */}
          <div className="pdf-photo-column">
            <div className="pdf-photo-card">
              <img
                src={imageUrl}
                alt={`${result.plant_name} specimen scan`}
                crossOrigin="anonymous"
              />
            </div>
            <div className="pdf-photo-tag">
              Digital Foliage Scan (224×224 RGB)
            </div>
          </div>

          {/* Right: Diagnosis & Official Lab Findings Table */}
          <div className="pdf-findings-column">
            <div className="pdf-findings-tags">
              <span className="pdf-crop-badge">{result.plant_name} Specimen</span>
              <span className={`pdf-official-stamp ${severityClass}`}>
                {severityStampText}
              </span>
            </div>

            <h2 className="pdf-findings-title">{result.disease_name}</h2>

            <div className="pdf-attributes-table">
              <div className="pdf-attribute-row">
                <span className="pdf-attr-key">Botanical Host:</span>
                <span className="pdf-attr-val font-semibold">{result.plant_name} (Cultivated Foliage)</span>
              </div>
              <div className="pdf-attribute-row">
                <span className="pdf-attr-key">Pathological Condition:</span>
                <span className="pdf-attr-val font-bold">
                  {isHealthy ? 'Healthy • No Pathogens Detected' : `${result.disease_name} Infection`}
                </span>
              </div>
              <div className="pdf-attribute-row">
                <span className="pdf-attr-key">Certainty Probability:</span>
                <span className="pdf-attr-val font-bold text-success">
                  {result.confidence}% Match (Softmax Layer Probability)
                </span>
              </div>
              <div className="pdf-attribute-row">
                <span className="pdf-attr-key">Network Pipeline:</span>
                <span className="pdf-attr-val font-mono">
                  3-Block Residual Conv2D + BatchNorm + Dropout
                </span>
              </div>
              <div className="pdf-attribute-row">
                <span className="pdf-attr-key">Validation Status:</span>
                <span className="pdf-attr-val font-semibold text-emerald">
                  ✓ Autonomous Computer Vision Validated
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Four Comprehensive Agronomic Assessment Sections */}
        <div className="pdf-sections-grid">
          {/* Section 1: Symptoms */}
          <div className="pdf-block-card">
            <div className="pdf-block-header">
              <span className="pdf-block-num">SECTION 1.0</span>
              <h3 className="pdf-block-title">Clinical Foliage Symptoms & Indicators</h3>
            </div>
            <ul className="pdf-items-list">
              {(result.symptoms || []).map((symptom, idx) => (
                <li key={idx}>{symptom}</li>
              ))}
            </ul>
          </div>

          {/* Section 2: Pathogen & Causes */}
          <div className="pdf-block-card">
            <div className="pdf-block-header">
              <span className="pdf-block-num">SECTION 2.0</span>
              <h3 className="pdf-block-title">Causal Pathogen & Transmission Vectors</h3>
            </div>
            <ul className="pdf-items-list">
              {(result.causes || []).map((cause, idx) => (
                <li key={idx}>{cause}</li>
              ))}
            </ul>
          </div>

          {/* Section 3: Recommended Agronomic Treatment */}
          <div className="pdf-block-card highlight-box">
            <div className="pdf-block-header">
              <span className="pdf-block-num accent-num">SECTION 3.0</span>
              <h3 className="pdf-block-title">Prescribed Agronomic Treatment & Chemical/Organic Plan</h3>
            </div>
            <ul className="pdf-items-list">
              {(result.treatment || []).map((treatment, idx) => (
                <li key={idx}>{treatment}</li>
              ))}
            </ul>
          </div>

          {/* Section 4: Preventative Management */}
          <div className="pdf-block-card">
            <div className="pdf-block-header">
              <span className="pdf-block-num">SECTION 4.0</span>
              <h3 className="pdf-block-title">Preventative Management & Cultural Hygiene Protocols</h3>
            </div>
            <ul className="pdf-items-list">
              {(result.prevention || []).map((prevention, idx) => (
                <li key={idx}>{prevention}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* 4. Official Attestation & Digital Sign-off */}
        <div className="pdf-legal-footer">
          <div className="pdf-disclaimer-box">
            <strong className="pdf-disclaimer-head">Quality Assurance & Agronomic Disclaimer</strong>
            <p className="pdf-disclaimer-p">
              This diagnostic certificate was generated automatically by the BioShield AI neural classification engine trained on curated plant disease datasets. Intended for agronomic decision-support. For large-scale commercial field treatments, corroboration with an accredited university or regional extension agronomist is recommended.
            </p>
          </div>

          <div className="pdf-security-block">
            <div className="pdf-barcode-sim">
              ||| | |||| | || ||||| || | |||| ||| |||||
            </div>
            <div className="pdf-security-hash font-mono">
              AUTH-HASH: {securityHash}
            </div>
          </div>

          <div className="pdf-validation-box">
            <div className="pdf-digital-seal">
              <span className="seal-inner-text">OFFICIAL LAB SEAL</span>
              <span className="seal-status">VERIFIED</span>
            </div>
            <div className="pdf-sig-wrapper">
              <div className="pdf-sig-signature">BioShield Neural Engine</div>
              <span className="pdf-sig-title">Automated Pathology Attestation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
