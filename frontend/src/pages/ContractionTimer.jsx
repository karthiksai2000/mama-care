import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, Square, Trash2, Activity, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchContractions, addContraction, clearContractions } from '../services/api';

const ContractionTimer = () => {
  const [contractions, setContractions] = useState([]);
  const [active, setActive] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    let activeFetch = true;

    const loadContractions = async () => {
      try {
        const data = await fetchContractions();
        if (activeFetch) setContractions(data.contractions || []);
      } catch (error) {
        console.warn('[MaMa Care] Unable to load contractions.', error?.message || error);
      }
    };

    loadContractions();

    return () => {
      activeFetch = false;
    };
  }, []);

  useEffect(() => {
    if (active) {
      startRef.current = Date.now();
      intervalRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)), 100);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [active]);

  const startContraction = () => { setElapsed(0); setActive(true); };

  const stopContraction = async () => {
    setActive(false);
    if (elapsed > 0) {
      try {
        const data = await addContraction({ start: startRef.current, duration: elapsed });
        setContractions(prev => [data.contraction, ...prev]);
      } catch (error) {
        console.warn('[MaMa Care] Unable to save contraction.', error?.message || error);
      }
    }
    setElapsed(0);
  };

  const clearAll = async () => {
    try {
      await clearContractions();
      setContractions([]);
      setActive(false);
      setElapsed(0);
    } catch (error) {
      console.warn('[MaMa Care] Unable to clear contractions.', error?.message || error);
    }
  };

  const fmt = (s) => {
    if (s < 60) return `${s}s`;
    return `${Math.floor(s / 60)}m ${s % 60}s`;
  };

  const fmtTime = (ts) => new Date(ts).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });

  const avgDuration = contractions.length > 0 ? Math.round(contractions.reduce((a, c) => a + c.duration, 0) / contractions.length) : 0;

  const avgInterval = contractions.length > 1
    ? Math.round(contractions.slice(0, -1).reduce((a, c, i) => {
      const currentStart = new Date(c.start).getTime();
      const nextStart = new Date(contractions[i + 1].start).getTime();
      return a + (currentStart - nextStart - contractions[i + 1].duration * 1000) / 1000;
    }, 0) / (contractions.length - 1))
    : 0;

  const isClose = avgInterval > 0 && avgInterval < 300; // less than 5 min apart

  return (
    <div className="contraction-page">
      <h2><Timer size={24} /> Contraction Timer</h2>
      <p className="subtitle">Track contraction duration and frequency</p>

      <div className="contraction-main">
        <div className="contraction-control">
          {!active ? (
            <motion.button className="contraction-start-btn" onClick={startContraction} whileTap={{ scale: 0.95 }}>
              <Play size={32} /> Start Contraction
            </motion.button>
          ) : (
            <motion.button className="contraction-stop-btn" onClick={stopContraction} whileTap={{ scale: 0.95 }} animate={{ scale: [1, 1.02, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <Square size={32} /> Stop — {fmt(elapsed)}
            </motion.button>
          )}
        </div>

        <div className="contraction-stats-row">
          <div className="contraction-stat">
            <Activity size={18} />
            <div><span className="stat-val">{contractions.length}</span><span className="stat-label">Total</span></div>
          </div>
          <div className="contraction-stat">
            <Clock size={18} />
            <div><span className="stat-val">{fmt(avgDuration)}</span><span className="stat-label">Avg Duration</span></div>
          </div>
          <div className="contraction-stat">
            <Timer size={18} />
            <div><span className="stat-val">{avgInterval > 0 ? fmt(avgInterval) : '—'}</span><span className="stat-label">Avg Interval</span></div>
          </div>
        </div>

        {isClose && (
          <motion.div className="contraction-alert" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            ⚠️ Contractions are less than 5 minutes apart — consider contacting your doctor!
          </motion.div>
        )}
      </div>

      <div className="contraction-log card">
        <div className="log-header">
          <h3>Contraction Log</h3>
          {contractions.length > 0 && <button className="clear-log-btn" onClick={clearAll}><Trash2 size={14} /> Clear</button>}
        </div>
        {contractions.length === 0 ? (
          <p className="empty-log">No contractions recorded yet. Press Start when a contraction begins.</p>
        ) : (
          <AnimatePresence>
            {contractions.map((c, i) => {
              const prev = contractions[i + 1];
              const gap = prev
                ? Math.round((new Date(c.start).getTime() - new Date(prev.start).getTime() - prev.duration * 1000) / 1000)
                : null;
              return (
                <motion.div key={c._id || c.id} className="contraction-entry" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                  <span className="entry-time">{fmtTime(c.start)}</span>
                  <span className="entry-dur">{fmt(c.duration)}</span>
                  <span className="entry-gap">{gap !== null ? `${fmt(gap)} apart` : '—'}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default ContractionTimer;
