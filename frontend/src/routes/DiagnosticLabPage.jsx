import React from 'react';
import UploadZone from '../components/scanner/UploadZone';
import SampleGallery from '../components/scanner/SampleGallery';
import DiagnosticHub from '../components/scanner/DiagnosticHub';

/**
 * DiagnosticLabPage Route Component
 * Displays the Leaf Image Upload Zone, Pre-loaded Sample Gallery,
 * and the Real-Time AI Diagnostic Hub.
 */
export default function DiagnosticLabPage({
  selectedFile,
  previewUrl,
  onFileSelect,
  onRemoveFile,
  onAnalyze,
  onSelectSample,
  isLoading,
  error,
  result,
  apiBase
}) {
  return (
    <main className="workspace-grid">
      {/* Left Column: Input Lab & Validation Sample Selector */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <UploadZone
          selectedFile={selectedFile}
          previewUrl={previewUrl}
          onFileSelect={onFileSelect}
          onRemoveFile={onRemoveFile}
          onAnalyze={onAnalyze}
          isLoading={isLoading}
          error={error}
        />

        <SampleGallery
          onSelectSample={onSelectSample}
          isLoading={isLoading}
        />
      </section>

      {/* Right Column: Real-Time Diagnostic Hub */}
      <section>
        <DiagnosticHub
          result={result}
          isLoading={isLoading}
          error={error}
          apiBase={apiBase}
        />
      </section>
    </main>
  );
}
