import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './paths';
import DiagnosticLabPage from './DiagnosticLabPage';
import EncyclopediaPage from './EncyclopediaPage';
import ArchitecturePage from './ArchitecturePage';

/**
 * AppRoutes Component
 * Maps URL routes to respective page components.
 */
export default function AppRoutes({
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
    <Routes>
      {/* Primary Route: AI Diagnostic Lab */}
      <Route
        path={ROUTES.HOME}
        element={
          <DiagnosticLabPage
            selectedFile={selectedFile}
            previewUrl={previewUrl}
            onFileSelect={onFileSelect}
            onRemoveFile={onRemoveFile}
            onAnalyze={onAnalyze}
            onSelectSample={onSelectSample}
            isLoading={isLoading}
            error={error}
            result={result}
            apiBase={apiBase}
          />
        }
      />

      {/* Alias /scanner redirects to / */}
      <Route path={ROUTES.SCANNER} element={<Navigate to={ROUTES.HOME} replace />} />

      {/* Disease Encyclopedia Route */}
      <Route
        path={ROUTES.ENCYCLOPEDIA}
        element={<EncyclopediaPage apiBase={apiBase} />}
      />

      {/* Model Architecture Route */}
      <Route
        path={ROUTES.ARCHITECTURE}
        element={<ArchitecturePage />}
      />

      {/* Fallback 404 / Catch-all redirects to Home */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
}
