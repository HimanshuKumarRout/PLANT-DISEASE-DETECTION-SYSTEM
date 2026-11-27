import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './paths';
import { PageRouteSkeleton } from '../components/common/SkeletonLoader';

const DiagnosticLabPage = lazy(() => import('./DiagnosticLabPage'));
const EncyclopediaPage = lazy(() => import('./EncyclopediaPage'));
const ArchitecturePage = lazy(() => import('./ArchitecturePage'));

/**
 * AppRoutes Component
 * Maps URL routes to lazy-loaded page components with tailored Skeleton fallbacks.
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
          <Suspense fallback={<PageRouteSkeleton variant="scanner" />}>
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
          </Suspense>
        }
      />

      {/* Alias /scanner redirects to / */}
      <Route path={ROUTES.SCANNER} element={<Navigate to={ROUTES.HOME} replace />} />

      {/* Disease Encyclopedia Route */}
      <Route
        path={ROUTES.ENCYCLOPEDIA}
        element={
          <Suspense fallback={<PageRouteSkeleton variant="encyclopedia" />}>
            <EncyclopediaPage apiBase={apiBase} />
          </Suspense>
        }
      />

      {/* Model Architecture Route */}
      <Route
        path={ROUTES.ARCHITECTURE}
        element={
          <Suspense fallback={<PageRouteSkeleton variant="architecture" />}>
            <ArchitecturePage />
          </Suspense>
        }
      />

      {/* Fallback 404 / Catch-all redirects to Home */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
}
