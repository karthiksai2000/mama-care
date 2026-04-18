import React, { useEffect, useState } from 'react';
import { uploadReport, analyzeReport, fetchReports, deleteReport } from '../services/api';
import { UploadCloud, CheckCircle, FileText, Brain, AlertTriangle, TrendingUp, Loader2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Reports = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResults, setAiResults] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);

  useEffect(() => {
    let active = true;
    const loadReports = async () => {
      setIsLoadingReports(true);
      try {
        const data = await fetchReports();
        if (!active) return;
        const mapped = (data.reports || []).map((report) => ({
          name: report.originalName,
          date: report.createdAt ? new Date(report.createdAt).toLocaleDateString() : '',
          size: report.size ? `${(report.size / 1024).toFixed(1)} KB` : '—',
          id: report._id,
        }));
        setUploadedFiles(mapped);
      } catch (error) {
        console.warn('[MaMa Care] Unable to load reports.', error?.message || error);
      } finally {
        if (active) setIsLoadingReports(false);
      }
    };

    loadReports();
    return () => {
      active = false;
    };
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setStatus('uploading');
    const res = await uploadReport(file);
    if (res.success) {
      setStatus('success');
      try {
        const data = await fetchReports();
        const mapped = (data.reports || []).map((report) => ({
          name: report.originalName,
          date: report.createdAt ? new Date(report.createdAt).toLocaleDateString() : '',
          size: report.size ? `${(report.size / 1024).toFixed(1)} KB` : '—',
          id: report._id,
        }));
        setUploadedFiles(mapped);
      } catch (error) {
        setUploadedFiles((prev) => [{
          name: file.name,
          date: new Date().toLocaleDateString(),
          size: `${(file.size / 1024).toFixed(1)} KB`,
        }, ...prev]);
      }
      setFile(null);
    } else {
      setStatus('error');
    }
  };

  const runAiAnalysis = async () => {
    setAnalyzing(true);
    setAiResults(null);

    try {
      const result = await analyzeReport({ fileName: uploadedFiles[0]?.name || '' });
      setAiResults(result);
    } catch {
      setAiResults(null);
    } finally {
      setAnalyzing(false);
    }
  };

  const statusColor = (s) => s === 'normal' ? 'var(--success)' : s === 'low' || s === 'high' ? 'var(--danger)' : '#f59e0b';
  const statusIcon = (s) => s === 'normal' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />;

  return (
    <div className="reports-page">
      <h2><FileText size={24} /> Medical Reports</h2>
      <p className="subtitle">Upload lab reports and get AI-powered analysis</p>

      <div className="reports-layout">
        <div className="upload-section card">
          <h3><UploadCloud size={18} /> Upload Report</h3>
          <div className="upload-area">
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={handleUpload} disabled={!file} className="upload-btn">
              <UploadCloud size={18} /> Upload
            </button>
          </div>
          {file && <p className="file-name">📄 {file.name}</p>}
          {status === 'success' && <p className="success-msg"><CheckCircle size={16} /> Uploaded successfully!</p>}
        </div>

        <div className="ai-analyzer card">
          <h3><Brain size={18} /> AI Report Analyzer</h3>
          <p className="analyzer-desc">Our AI scans your lab reports and flags abnormal values with recommendations.</p>
          <button className="analyze-btn" onClick={runAiAnalysis} disabled={analyzing}>
            {analyzing ? <><Loader2 size={18} className="spin" /> Analyzing...</> : <><Brain size={18} /> Analyze Latest Report</>}
          </button>

          <AnimatePresence>
            {aiResults && (
              <motion.div className="ai-results" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                <div className="ai-values">
                  {aiResults.values.map((v, i) => (
                    <div key={i} className="ai-value-row" style={{ borderLeftColor: statusColor(v.status) }}>
                      <div className="ai-val-header">
                        <span className="ai-val-name">{v.name}</span>
                        <span className="ai-val-status" style={{ color: statusColor(v.status) }}>{statusIcon(v.status)} {v.status}</span>
                      </div>
                      <div className="ai-val-data">
                        <span className="ai-val-value">{v.value}</span>
                        <span className="ai-val-normal">Normal: {v.normal}</span>
                      </div>
                      <p className="ai-val-note">{v.note}</p>
                    </div>
                  ))}
                </div>
                <div className="ai-summary">
                  <TrendingUp size={16} />
                  <p>{aiResults.summary}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="uploaded-list card">
          <h3>📋 Uploaded Files</h3>
          {uploadedFiles.map((f, i) => (
            <div key={f.id || i} className="uploaded-item">
              <FileText size={16} />
              <span className="uf-name">{f.name}</span>
              <span className="uf-size">{f.size}</span>
              <span className="uf-date">{f.date}</span>
              {f.id && (
                <button
                  className="ghost-btn"
                  type="button"
                  onClick={async () => {
                    try {
                      await deleteReport(f.id);
                      setUploadedFiles((prev) => prev.filter((item) => item.id !== f.id));
                    } catch (error) {
                      console.warn('[MaMa Care] Unable to delete report.', error?.message || error);
                    }
                  }}
                  aria-label="Delete report"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {uploadedFiles.length === 0 && isLoadingReports && (
        <div className="uploaded-list card">
          <h3>📋 Uploaded Files</h3>
          <p className="subtitle">Loading reports...</p>
        </div>
      )}
    </div>
  );
};

export default Reports;
