import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export default function UploadZone({
  selectedFile,
  previewUrl,
  onFileSelect,
  onRemoveFile,
  onAnalyze,
  isLoading,
  error
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleClickZone = (e) => {
    if (e.target.closest('.preview-clear-btn')) return;
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="glass-panel">
      <div className="panel-header">
        <div className="panel-title-wrap">
          <div className="panel-icon-badge">
            <UploadCloud size={18} />
          </div>
          <div>
            <h2 className="panel-title">Upload Leaf Specimen</h2>
            <p className="panel-desc">Drag or browse a high-resolution leaf photograph</p>
          </div>
        </div>
      </div>

      {/* Drag & Drop Zone */}
      <div
        className={`upload-dropzone ${isDragOver ? 'active-drag' : ''}`}
        onClick={handleClickZone}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleInputChange}
        />

        {previewUrl ? (
          <div className={`uploaded-preview-box ${error?.code === 'NOT_A_PLANT_IMAGE' ? 'invalid-preview' : ''}`}>
            <img src={previewUrl} alt="Selected leaf specimen" />
            <div className={`preview-badge-overlay ${error?.code === 'NOT_A_PLANT_IMAGE' ? 'invalid' : ''}`}>
              <span>
                {error?.code === 'NOT_A_PLANT_IMAGE'
                  ? 'Not a Plant Image'
                  : selectedFile
                  ? `${(selectedFile.size / 1024).toFixed(0)} KB • Ready`
                  : 'Sample'}
              </span>
            </div>
            <button
              type="button"
              className="preview-clear-btn"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFile();
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              title="Remove specimen"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <div className="upload-icon-pulse">
              <UploadCloud size={30} />
            </div>
            <h3 className="upload-heading">Drag & drop leaf photograph</h3>
            <p className="upload-subtext">
              or <span className="upload-browse-link">browse from local disk</span>
            </p>
            <span className="upload-meta-hints">Supports JPEG, PNG, WEBP (Max 16MB)</span>
          </>
        )}
      </div>

      {/* Action Button */}
      {selectedFile && (
        <button
          className="btn-primary-action"
          onClick={onAnalyze}
          disabled={isLoading}
        >
          <Sparkles size={18} />
          <span>{isLoading ? 'Running Deep Learning Diagnostics...' : 'Analyze Foliage Health'}</span>
        </button>
      )}

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger" style={{ marginTop: '16px' }}>
          <AlertCircle size={20} className="alert-icon" />
          <div className="alert-message">
            <strong>{error.title || 'Diagnostic Notice'}:</strong>
            <p>{error.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
