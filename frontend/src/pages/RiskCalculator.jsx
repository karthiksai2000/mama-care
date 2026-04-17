import React, { useEffect, useState } from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert, Calculator, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { assessRisk, fetchRiskFactors } from '../services/api';

const RiskCalculator = () => {
  const [form, setForm] = useState({ age: '', systolic: '', diastolic: '', hemoglobin: '', weight: '', height: '', factors: [] });
  const [result, setResult] = useState(null);
  const [factors, setFactors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadFactors = async () => {
      try {
        const data = await fetchRiskFactors();
        if (active) setFactors(data.factors || []);
      } catch (error) {
        console.warn('[MaMa Care] Unable to load risk factors.', error?.message || error);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadFactors();
    return () => {
      active = false;
    };
  }, []);

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const toggleFactor = (key) => {
    setForm(p => ({ ...p, factors: p.factors.includes(key) ? p.factors.filter(f => f !== key) : [...p.factors, key] }));
  };

  const calculate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        age: Number(form.age),
        systolic: Number(form.systolic),
        diastolic: Number(form.diastolic),
        hemoglobin: Number(form.hemoglobin),
        weight: form.weight ? Number(form.weight) : undefined,
        height: form.height ? Number(form.height) : undefined,
        factors: form.factors,
      };
      const data = await assessRisk(payload);
      setResult(data.assessment);
    } catch (error) {
      console.warn('[MaMa Care] Risk assessment failed.', error?.message || error);
    }
  };

  const icons = { low: <ShieldCheck size={32} />, medium: <AlertTriangle size={32} />, high: <ShieldAlert size={32} /> };
  const colors = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444' };
  const labels = { low: 'Low Risk', medium: 'Medium Risk', high: 'High Risk' };

  return (
    <div className="risk-page">
      <h2><Calculator size={24} /> Risk Score Calculator</h2>
      <p className="subtitle">Estimate your pregnancy risk level based on health indicators</p>

      <div className="risk-layout">
        <form className="risk-form card" onSubmit={calculate}>
          <h3><Heart size={18} /> Health Details</h3>
          <div className="risk-grid">
            <div className="form-group">
              <label>Age</label>
              <input type="number" placeholder="e.g. 28" value={form.age} onChange={e => update('age', e.target.value)} required min="14" max="55" />
            </div>
            <div className="form-group">
              <label>Systolic BP (mmHg)</label>
              <input type="number" placeholder="e.g. 120" value={form.systolic} onChange={e => update('systolic', e.target.value)} required min="60" max="250" />
            </div>
            <div className="form-group">
              <label>Diastolic BP (mmHg)</label>
              <input type="number" placeholder="e.g. 80" value={form.diastolic} onChange={e => update('diastolic', e.target.value)} required min="40" max="160" />
            </div>
            <div className="form-group">
              <label>Hemoglobin (g/dL)</label>
              <input type="number" step="0.1" placeholder="e.g. 11.5" value={form.hemoglobin} onChange={e => update('hemoglobin', e.target.value)} required min="3" max="20" />
            </div>
            <div className="form-group">
              <label>Weight (kg)</label>
              <input type="number" step="0.1" placeholder="e.g. 62" value={form.weight} onChange={e => update('weight', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Height (cm)</label>
              <input type="number" placeholder="e.g. 160" value={form.height} onChange={e => update('height', e.target.value)} />
            </div>
          </div>

          <div className="risk-factors">
            <label>Medical History</label>
            <div className="factors-grid">
              {loading && <span>Loading risk factors...</span>}
              {!loading && factors.map(f => (
                <label key={f.key} className={`factor-chip ${form.factors.includes(f.key) ? 'active' : ''}`}>
                  <input type="checkbox" checked={form.factors.includes(f.key)} onChange={() => toggleFactor(f.key)} />
                  {f.label}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="risk-submit">Calculate Risk Score</button>
        </form>

        <AnimatePresence>
          {result && (
            <motion.div className="risk-result card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="risk-badge" style={{ background: colors[result.level] + '18', color: colors[result.level], borderColor: colors[result.level] }}>
                {icons[result.level]}
                <span className="risk-score">{result.score}</span>
                <span className="risk-label">{labels[result.level]}</span>
              </div>
              {result.bmi && <p className="risk-bmi">BMI: <strong>{result.bmi}</strong></p>}
              <div className="risk-recs">
                <h4>Recommendations</h4>
                <ul>{result.recommendations.map((r, i) => <li key={i}>✦ {r}</li>)}</ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RiskCalculator;
