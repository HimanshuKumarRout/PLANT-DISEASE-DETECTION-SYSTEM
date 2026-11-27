import React from 'react';
import { Scan } from 'lucide-react';

/**
 * Reusable Skeleton primitive with shimmer animation matching the BioShield theme.
 */
export function Skeleton({
  width = '100%',
  height = 16,
  variant = 'rect',
  className = '',
  style = {},
  animated = true
}) {
  const variantClass = `skeleton-${variant}`;
  const animClass = animated ? 'skeleton-animated' : '';

  return (
    <span
      aria-hidden="true"
      className={`skeleton-base ${variantClass} ${animClass} ${className}`.trim()}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style
      }}
    />
  );
}

/**
 * Renders staggered skeleton text lines for paragraphs or bullet items.
 */
function SkeletonLines({ widths = ['92%', '84%', '76%'], height = 14, gap = 12 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px` }}>
      {widths.map((lineWidth, idx) => (
        <Skeleton key={idx} width={lineWidth} height={height} variant="text" />
      ))}
    </div>
  );
}

/**
 * Full diagnostic skeleton mirroring DiagnosticHub's result layout
 * while showing live convolutional inference status.
 */
export function DiagnosticResultSkeleton({ statusPhrase = 'Running convolutional inference...' }) {
  const tabWidths = [150, 145, 138, 155];
  const bulletWidths = ['94%', '82%', '88%', '70%'];

  return (
    <div
      className="result-card-container diagnostic-skeleton-wrapper"
      role="status"
      aria-busy="true"
      aria-label="Analyzing leaf specimen"
    >
      {/* Compact Live Neural Inference Progress Banner */}
      <div className="diagnostic-skeleton-banner">
        <div className="skeleton-banner-meta">
          <div className="skeleton-reticle-mini">
            <Scan size={18} className="reticle-core-icon" />
          </div>
          <div style={{ minWidth: 0 }}>
            <span className="skeleton-banner-title">Running Convolutional Inference</span>
            <p className="skeleton-banner-phrase">{statusPhrase}</p>
          </div>
        </div>
        <div className="hud-progress-track skeleton-progress-compact">
          <div className="hud-progress-fill" />
        </div>
      </div>

      {/* Top Banner Skeleton */}
      <div className="result-top-banner">
        <div className="result-heading-meta">
          <Skeleton width={52} height={52} style={{ borderRadius: '16px', flexShrink: 0 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Skeleton width={110} height={18} variant="pill" />
            <Skeleton width={220} height={28} variant="rect" />
          </div>
        </div>
        <Skeleton width={180} height={28} variant="pill" />
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="result-content-grid">
        {/* Left Visual Column */}
        <div className="scan-visual-column">
          <div className="hud-scan-frame skeleton-scan-frame">
            <Skeleton width="100%" height="100%" className="hud-image-skeleton" style={{ borderRadius: 0 }} />
            <div className="hud-corner hud-top-l" />
            <div className="hud-corner hud-top-r" />
            <div className="hud-corner hud-bot-l" />
            <div className="hud-corner hud-bot-r" />
          </div>

          <div className="confidence-dial-card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              <Skeleton width={95} height={11} variant="text" />
              <Skeleton width={82} height={26} variant="rect" />
              <Skeleton width={115} height={11} variant="text" />
            </div>
            <Skeleton width={70} height={70} variant="circle" style={{ flexShrink: 0 }} />
          </div>
        </div>

        {/* Right Pathology Details Column */}
        <div className="pathology-tabs-wrapper">
          <div className="pathology-nav-tabs" style={{ overflow: 'hidden' }}>
            {tabWidths.map((w, idx) => (
              <Skeleton
                key={idx}
                width={w}
                height={32}
                style={{ borderRadius: 'var(--radius-xs)', flexShrink: 0 }}
              />
            ))}
          </div>

          <div className="tab-detail-pane">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {bulletWidths.map((w, idx) => (
                <div key={idx} className="skeleton-bullet-row">
                  <Skeleton width={18} height={18} variant="circle" style={{ flexShrink: 0 }} />
                  <Skeleton width={w} height={14} variant="text" />
                </div>
              ))}
            </div>
          </div>

          <div className="result-toolbar">
            <Skeleton width={140} height={36} style={{ borderRadius: 'var(--radius-sm)' }} />
            <Skeleton width={196} height={36} style={{ borderRadius: 'var(--radius-sm)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Grid of disease card skeletons matching DiseaseEncyclopedia layout.
 */
export function EncyclopediaSkeleton({ count = 6 }) {
  return (
    <div
      className="encyclopedia-cards-grid"
      role="status"
      aria-busy="true"
      aria-label="Loading disease encyclopedia entries"
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="disease-info-card encyclopedia-skeleton-card">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              <Skeleton width={74} height={18} variant="pill" />
              <Skeleton width="72%" height={22} variant="rect" />
            </div>
            <Skeleton width={76} height={24} variant="pill" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Skeleton width={120} height={11} variant="text" />
            <SkeletonLines widths={['96%', '80%']} height={13} gap={8} />
          </div>

          <Skeleton
            width="100%"
            height={36}
            style={{ borderRadius: 'var(--radius-sm)', marginTop: 'auto' }}
          />
        </div>
      ))}
    </div>
  );
}

/**
 * Route-level fallback skeleton for lazy-loaded pages.
 */
export function PageRouteSkeleton({ variant = 'scanner' }) {
  if (variant === 'encyclopedia') {
    return (
      <div className="encyclopedia-view" role="status" aria-busy="true" aria-label="Loading encyclopedia page">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <Skeleton width={340} height={34} variant="rect" />
          <Skeleton width="60%" height={16} variant="text" />
        </div>
        <div className="encyclopedia-search-bar" style={{ marginBottom: '24px' }}>
          <Skeleton width="100%" height={22} variant="text" />
        </div>
        <div className="sample-category-tabs" style={{ marginBottom: '24px' }}>
          {[110, 74, 70, 78, 82].map((w, i) => (
            <Skeleton key={i} width={w} height={30} variant="pill" />
          ))}
        </div>
        <EncyclopediaSkeleton count={6} />
      </div>
    );
  }

  if (variant === 'architecture') {
    return (
      <div className="architecture-view" role="status" aria-busy="true" aria-label="Loading model architecture">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <Skeleton width={320} height={34} variant="rect" />
          <Skeleton width="58%" height={16} variant="text" />
        </div>
        <div className="arch-pipeline-flow">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="arch-block-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Skeleton width={68} height={12} variant="text" />
              <Skeleton width="75%" height={20} variant="rect" />
              <Skeleton width={110} height={13} variant="text" />
              <SkeletonLines widths={['95%', '82%']} height={12} gap={6} />
            </div>
          ))}
        </div>
        <div className="glass-panel" style={{ marginTop: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Skeleton width={32} height={32} style={{ borderRadius: '8px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <Skeleton width={260} height={20} variant="rect" />
              <Skeleton width={210} height={13} variant="text" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(3, 12, 7, 0.5)',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <Skeleton width={120} height={11} variant="text" />
                <Skeleton width="80%" height={18} variant="rect" />
                <Skeleton width="90%" height={12} variant="text" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="workspace-grid" role="status" aria-busy="true" aria-label="Loading diagnostic lab">
      <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <Skeleton width={210} height={22} variant="rect" />
          <Skeleton width="100%" height={250} style={{ borderRadius: 'var(--radius-md)' }} />
        </div>
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Skeleton width={180} height={22} variant="rect" />
          <div className="sample-cards-grid">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} width="100%" height={66} style={{ borderRadius: 'var(--radius-sm)' }} />
            ))}
          </div>
        </div>
      </section>
      <section>
        <div className="glass-panel diagnostic-hub-panel">
          <DiagnosticResultSkeleton statusPhrase="Initializing diagnostic workspace..." />
        </div>
      </section>
    </main>
  );
}
