import React, { useEffect, useMemo, useState } from 'react';
import { Stethoscope, AlertCircle, CheckCircle, AlertTriangle, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeSymptoms, fetchSymptoms, checkSymptoms } from '../services/api';

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiNotes, setAiNotes] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadSymptoms = async () => {
      try {
        const data = await fetchSymptoms();
        if (active) setSymptoms(data.symptoms || []);
      } catch (error) {
        console.warn('[MaMa Care] Unable to load symptoms.', error?.message || error);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadSymptoms();
    return () => {
      active = false;
    };
  }, []);

  const toggle = (key) => setSelected(p => p.includes(key) ? p.filter(x => x !== key) : [...p, key]);

  const analyze = async () => {
    if (!selected.length && !aiNotes.trim()) return;

    setAiLoading(true);
    setAiError('');

    const selectedLabels = symptoms
      .filter((symptom) => selected.includes(symptom.key))
      .map((symptom) => symptom.label);
    try {
      if (selected.length) {
        const data = await analyzeSymptoms(selected);
        setResult(data);
      }
    } catch (error) {
      console.warn('[MaMa Care] Symptom analysis failed.', error?.message || error);
    }

    try {
      const payload = aiNotes.trim()
        ? { symptoms: aiNotes.trim() }
        : { symptoms: selectedLabels };
      const data = await checkSymptoms(payload);
      setAiResult(data);
    } catch (error) {
      console.warn('[MaMa Care] AI symptom check failed.', error?.message || error);
      setAiError('AI advice unavailable right now.');
    } finally {
      setAiLoading(false);
    }
  };

  const filtered = search
    ? symptoms.filter(s => s.label.toLowerCase().includes(search.toLowerCase()))
    : symptoms;
  const categories = useMemo(() => [...new Set(filtered.map(s => s.category))], [filtered]);
  const icons = { urgent: <AlertCircle size={28} />, moderate: <AlertTriangle size={28} />, mild: <CheckCircle size={28} /> };
  const colors = { urgent: '#ef4444', moderate: '#f59e0b', mild: '#22c55e' };
  const labels = { urgent: 'Seek Immediate Care', moderate: 'Schedule Doctor Visit', mild: 'Mild — Monitor at Home' };

  return (
    <div className="symptom-page">
      <h2><Stethoscope size={24} /> Symptom Checker</h2>
      <p className="subtitle">Select your symptoms for a quick severity assessment</p>

      <div className="symptom-search">
        <Search size={18} />
        <input placeholder="Search symptoms..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="symptom-layout">
        <div className="symptom-list card">
          {loading && <p>Loading symptoms...</p>}
          {!loading && categories.length === 0 && <p>No symptoms available yet.</p>}
          {categories.map(cat => {
            const items = filtered.filter(s => s.category === cat);
            if (items.length === 0) return null;
            return (
              <div key={cat} className="symptom-cat">
                <h4>{cat}</h4>
                <div className="symptom-chips">
                  {items.map(s => (
                    <button key={s.key} className={`symptom-chip ${selected.includes(s.key) ? 'active' : ''}`} onClick={() => toggle(s.key)}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="symptom-notes">
            <label>Describe symptoms (optional)</label>
            <textarea
              rows={3}
              value={aiNotes}
              onChange={(event) => setAiNotes(event.target.value)}
              placeholder="e.g. severe headache with nausea"
            />
          </div>

          <button className="symptom-analyze-btn" onClick={analyze} disabled={selected.length === 0 && !aiNotes.trim()}>
            {aiLoading ? 'Analyzing...' : `Analyze ${selected.length > 0 ? `(${selected.length})` : ''} Symptoms`}
          </button>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div className="symptom-result card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <div className="symptom-badge" style={{ background: colors[result.level] + '15', color: colors[result.level], borderColor: colors[result.level] }}>
                {icons[result.level]}
                <span>{labels[result.level]}</span>
              </div>
              <p className="sr-msg">{result.message}</p>
              <p className="sr-action"><strong>Recommended Action:</strong> {result.action}</p>
              <div className="sr-selected">
                <h4>Selected Symptoms:</h4>
                <ul>
                  {result.symptoms.map(s => (
                    <li key={s.key}>* {s.label} <span className="sr-sev">{['Normal', 'Mild', 'Moderate', 'Serious'][s.severity]}</span></li>
                  ))}
                </ul>
              </div>
              <button className="symptom-reset" onClick={() => { setResult(null); setSelected([]); }}>Check Again</button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {aiResult && (
            <motion.div className="symptom-ai card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h4>AI Guidance</h4>
              <div className="symptom-ai-row">
                <span>Specialization:</span>
                <strong>{aiResult.specialization || 'General Physician'}</strong>
              </div>
              <div className="symptom-ai-row">
                <span>Urgency:</span>
                <strong>{aiResult.urgency || 'medium'}</strong>
              </div>
              <p className="symptom-ai-advice">
                {Array.isArray(aiResult.advice) ? aiResult.advice.join(' ') : aiResult.advice}
              </p>
              {aiError && <p className="symptom-ai-error">{aiError}</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SymptomChecker;
