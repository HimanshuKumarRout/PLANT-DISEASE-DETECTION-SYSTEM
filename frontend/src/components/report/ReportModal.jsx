import React, { useState } from 'react';
import { X, Printer, Download, Copy, CheckCircle2, FileText, Loader2 } from 'lucide-react';
import OfficialPdfReport from './OfficialPdfReport';
import { downloadReportPdf } from '../../utils/pdfExport';

export default function ReportModal({ isOpen, onClose, result, apiBase }) {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen || !result) return null;

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    const plantName = result.plant_name?.replace(/\s+/g, '_') || 'Crop';
    const diseaseName = result.disease_name?.replace(/\s+/g, '_') || 'Condition';
    const filename = `BioShield_${plantName}_${diseaseName}_Report.pdf`;

    await downloadReportPdf('modal-report-document', filename);
    setIsExporting(false);
  };

  const handleBrowserPrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const text = `BioShield AI Diagnostic Report
--------------------------------------
Plant: ${result.plant_name}
Diagnosis: ${result.disease_name}
Confidence: ${result.confidence}%
Severity: ${result.disease_name?.toLowerCase() === 'healthy' ? 'Low Risk (Healthy)' : 'Pathogen Detected'}

Clinical Symptoms:
${(result.symptoms || []).map((s) => `• ${s}`).join('\n')}

Causal Agents & Vectors:
${(result.causes || []).map((c) => `• ${c}`).join('\n')}

Prescribed Treatment:
${(result.treatment || []).map((t) => `• ${t}`).join('\n')}

Preventative Care:
${(result.prevention || []).map((p) => `• ${p}`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="report-modal-backdrop" onClick={onClose}>
      <div className="report-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Top Control Bar */}
        <div className="report-modal-header">
          <div className="modal-header-left">
            <div className="modal-icon-badge">
              <FileText size={20} color="var(--primary-light)" />
            </div>
            <div>
              <h3 className="modal-title">Official Diagnostic Pathology Report</h3>
              <p className="modal-desc">Publication-ready A4 agronomic certificate for archival, sharing, and field reference</p>
            </div>
          </div>

          <div className="modal-actions-right">
            <button
              type="button"
              className="btn-secondary-action modal-action-btn"
              onClick={handleCopyText}
              title="Copy structured text"
            >
              {copied ? <CheckCircle2 size={16} color="var(--primary-light)" /> : <Copy size={16} />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>

            <button
              type="button"
              className="btn-secondary-action modal-action-btn"
              onClick={handleBrowserPrint}
              title="Print via browser dialog"
            >
              <Printer size={16} />
              <span>Print</span>
            </button>

            <button
              type="button"
              className="btn-primary-action modal-download-btn"
              onClick={handleDownloadPdf}
              disabled={isExporting}
              title="Download standalone A4 PDF file"
            >
              {isExporting ? <Loader2 size={16} className="spinning-leaf" /> : <Download size={16} />}
              <span>{isExporting ? 'Generating PDF...' : 'Download PDF Report'}</span>
            </button>

            <button
              type="button"
              className="modal-close-icon-btn"
              onClick={onClose}
              title="Close Preview"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Workspace containing the A4 Sheet Preview */}
        <div className="report-modal-body">
          <div className="a4-sheet-preview-container">
            <OfficialPdfReport
              result={result}
              apiBase={apiBase}
              id="modal-report-document"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
