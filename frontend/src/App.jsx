import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, HeroSection, Footer } from './components';
import { AppRoutes, ROUTES } from './routes';

const API_BASE = import.meta.env.VITE_API_BASE || '';

export default function App() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [backendStatus, setBackendStatus] = useState('connecting');

  // Check backend health
  useEffect(() => {
    fetch(`${API_BASE}/api/health`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.status === 'healthy') {
          setBackendStatus('healthy');
        } else {
          setBackendStatus('offline');
        }
      })
      .catch(() => setBackendStatus('offline'));
  }, []);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError({
        title: 'Unsupported File Format',
        message: 'Please provide a valid image file (PNG, JPG, JPEG, or WEBP).'
      });
      return;
    }

    if (file.size > 16 * 1024 * 1024) {
      setError({
        title: 'Image File Too Large',
        message: 'The selected leaf photograph exceeds the maximum limit of 16MB.'
      });
      return;
    }

    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(objectUrl);
    setError(null);
    setResult(null);
  };

  const handleRemoveFile = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl('');
    setError(null);
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const requestErr = new Error(
          (data && data.error) || `Backend responded with error code ${response.status}`
        );
        requestErr.title = (data && data.title) || 'Diagnosis Failed';
        requestErr.code = (data && data.error_code) || null;
        throw requestErr;
      }

      if (data && data.success) {
        setResult(data);
      } else {
        const logicErr = new Error((data && data.error) || 'Analysis could not be concluded.');
        logicErr.title = (data && data.title) || 'Diagnosis Failed';
        logicErr.code = (data && data.error_code) || null;
        throw logicErr;
      }
    } catch (err) {
      console.error('Diagnostic error:', err);
      setResult(null);
      setError({
        title: err.title || 'Diagnosis Failed',
        code: err.code || null,
        message: err.message || 'Unable to establish connection with BioShield backend.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = async (className) => {
    handleRemoveFile();
    setIsLoading(true);
    setError(null);

    // Switch to diagnostic lab route if not already on it
    navigate(ROUTES.HOME);

    try {
      const response = await fetch(
        `${API_BASE}/predict_sample?class_name=${encodeURIComponent(className)}`
      );
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          (data && data.error) || `Backend responded with error code ${response.status}`
        );
      }

      if (data && data.success) {
        setResult(data);
      } else {
        throw new Error((data && data.error) || 'Sample analysis could not be completed.');
      }
    } catch (err) {
      console.error('Sample inference error:', err);
      setError({
        title: 'Sample Inference Failed',
        message: err.message || 'Unable to run sample diagnosis against dataset.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-viewport">
      {/* Top Floating Navbar with Dynamic Browser Routing */}
      <Navbar backendStatus={backendStatus} />

      <div className="site-container">
        {/* Hero Section */}
        <HeroSection />

        {/* Dynamic Route Switching via Dedicated Routes Module */}
        <AppRoutes
          selectedFile={selectedFile}
          previewUrl={previewUrl}
          onFileSelect={handleFileSelect}
          onRemoveFile={handleRemoveFile}
          onAnalyze={handleAnalyze}
          onSelectSample={handleSelectSample}
          isLoading={isLoading}
          error={error}
          result={result}
          apiBase={API_BASE}
        />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
