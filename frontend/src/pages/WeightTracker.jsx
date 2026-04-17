import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { Scale, Plus, TrendingUp, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchWeightEntries, addWeightEntry, deleteWeightEntry } from '../services/api';

const WHO_CURVE = { 14: 1.5, 16: 2.5, 18: 3.5, 20: 4.5, 22: 5.5, 24: 6.5, 26: 7.5, 28: 8.5, 30: 9.5, 32: 10.5, 34: 11.5, 36: 12.2, 38: 12.8, 40: 13 };

const WeightTracker = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], weight: '' });

  useEffect(() => {
    let active = true;

    const loadEntries = async () => {
      try {
        const data = await fetchWeightEntries();
        if (active) {
          setEntries(data.entries || []);
        }
      } catch (error) {
        console.warn('[MaMa Care] Unable to load weight entries.', error?.message || error);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadEntries();

    return () => {
      active = false;
    };
  }, []);

  const addEntry = async (e) => {
    e.preventDefault();
    if (!form.weight) return;

    try {
      const payload = { date: form.date, weight: Number(form.weight) };
      const data = await addWeightEntry(payload);
      const next = [...entries, data.entry].sort((a, b) => new Date(a.date) - new Date(b.date));
      setEntries(next);
      setForm({ date: new Date().toISOString().split('T')[0], weight: '' });
    } catch (error) {
      console.warn('[MaMa Care] Unable to add weight entry.', error?.message || error);
    }
  };

  const removeEntry = async (id) => {
    try {
      await deleteWeightEntry(id);
      setEntries(prev => prev.filter(e => e._id !== id && e.id !== id));
    } catch (error) {
      console.warn('[MaMa Care] Unable to delete weight entry.', error?.message || error);
    }
  };

  const baseWeight = entries.length > 0 ? entries[0].weight : 60;
  const currentWeight = entries.length > 0 ? entries[entries.length - 1].weight : null;
  const totalGain = currentWeight ? (currentWeight - baseWeight).toFixed(1) : 0;

  // Chart data: user entries + WHO recommended
  const chartData = entries.map(e => {
    const weekEst = user?.week || 24;
    const entryIdx = entries.indexOf(e);
    const weekForEntry = Math.max(12, weekEst - (entries.length - 1 - entryIdx));
    const whoGain = WHO_CURVE[Math.round(weekForEntry / 2) * 2] || null;
    return {
      date: new Date(e.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      weight: e.weight,
      gain: Number((e.weight - baseWeight).toFixed(1)),
      whoGain,
    };
  });

  return (
    <div className="weight-page">
      <h2><Scale size={24} /> Weight Gain Tracker</h2>
      <p className="subtitle">Track weight changes and compare with WHO guidelines</p>

      <div className="weight-top">
        <form className="weight-form card" onSubmit={addEntry}>
          <h3><Plus size={18} /> Log Weight</h3>
          <div className="weight-inputs">
            <div className="form-group">
              <label>Date</label>
              <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>Weight (kg)</label>
              <input type="number" step="0.1" placeholder="e.g. 62.5" value={form.weight} onChange={e => setForm(p => ({ ...p, weight: e.target.value }))} required min="30" max="200" />
            </div>
          </div>
          <button type="submit" className="weight-add-btn">Add Entry</button>
        </form>

        <div className="weight-summary">
          <div className="weight-stat-card card">
            <span className="ws-label">Starting</span>
            <span className="ws-value">{baseWeight} kg</span>
          </div>
          <div className="weight-stat-card card">
            <span className="ws-label">Current</span>
            <span className="ws-value">{currentWeight || '—'} kg</span>
          </div>
          <div className="weight-stat-card card">
            <span className="ws-label">Total Gain</span>
            <span className="ws-value" style={{ color: totalGain > 16 ? 'var(--danger)' : totalGain > 12 ? 'var(--accent)' : 'var(--primary)' }}>{totalGain > 0 ? '+' : ''}{totalGain} kg</span>
          </div>
        </div>
      </div>

      {!loading && chartData.length > 1 && (
        <div className="weight-chart card">
          <h3><TrendingUp size={18} /> Weight Gain Over Time</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="gain" stroke="var(--primary)" strokeWidth={2} dot={{ r: 4 }} name="Your Gain (kg)" />
              <Line type="monotone" dataKey="whoGain" stroke="var(--accent)" strokeWidth={2} strokeDasharray="5 5" dot={false} name="WHO Recommended" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {!loading && entries.length > 0 && (
        <div className="weight-log card">
          <h3>Weight Log</h3>
          <div className="weight-entries">
            {[...entries].reverse().map(e => (
              <div key={e._id || e.id} className="weight-entry">
                <span>{new Date(e.date).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span className="we-weight">{e.weight} kg</span>
                <span className="we-gain">{(e.weight - baseWeight) > 0 ? '+' : ''}{(e.weight - baseWeight).toFixed(1)} kg</span>
                <button className="we-del" onClick={() => removeEntry(e._id || e.id)}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeightTracker;
