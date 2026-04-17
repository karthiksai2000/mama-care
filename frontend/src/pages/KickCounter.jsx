import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Baby, Timer, RotateCcw, TrendingUp, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchKickEvents, addKickEvent, deleteTodayKicks } from '../services/api';

const KickCounter = () => {
  const [kicks, setKicks] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [ripple, setRipple] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    let active = true;

    const loadKicks = async () => {
      try {
        const data = await fetchKickEvents();
        if (active) setKicks(data.kicks || []);
      } catch (error) {
        console.warn('[MaMa Care] Unable to load kick events.', error?.message || error);
      }
    };

    loadKicks();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const handleKick = async () => {
    try {
      const data = await addKickEvent({ ts: Date.now() });
      setKicks(prev => [...prev, data.kick]);
      setRipple(true);
      setTimeout(() => setRipple(false), 500);
    } catch (error) {
      console.warn('[MaMa Care] Unable to save kick event.', error?.message || error);
    }
  };

  const resetSession = async () => {
    try {
      await deleteTodayKicks();
      setKicks(prev => prev.filter(k => new Date(k.ts).toDateString() !== new Date().toDateString()));
      setSeconds(0);
      setIsRunning(false);
    } catch (error) {
      console.warn('[MaMa Care] Unable to reset today\'s kicks.', error?.message || error);
    }
  };

  const todayCount = kicks.filter(k => new Date(k.ts).toDateString() === new Date().toDateString()).length;
  const goalReached = todayCount >= 10;

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const last7 = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const ds = d.toDateString();
      days.push({ day: d.toLocaleDateString('en', { weekday: 'short' }), kicks: kicks.filter(k => new Date(k.ts).toDateString() === ds).length });
    }
    return days;
  };

  return (
    <div className="kick-page">
      <h2><Baby size={24} /> Kick Counter</h2>
      <p className="subtitle">Track your baby's movements — aim for 10 kicks in 2 hours</p>

      <div className="kick-layout">
        <div className="kick-tap-area">
          <motion.button className={`kick-btn ${ripple ? 'ripple' : ''} ${goalReached ? 'goal-reached' : ''}`} onClick={handleKick} whileTap={{ scale: 0.9 }}>
            <span className="kick-num">{todayCount}</span>
            <span className="kick-label">TAP</span>
          </motion.button>
          <p className="kick-hint">Tap each time baby kicks</p>

          <div className="kick-timer">
            <Timer size={16} />
            <span className="timer-val">{fmt(seconds)}</span>
            <button className="timer-toggle" onClick={() => { if (!isRunning) setSeconds(0); setIsRunning(!isRunning); }}>
              {isRunning ? 'Stop' : 'Start'}
            </button>
            <button className="timer-reset" onClick={resetSession} title="Reset today"><RotateCcw size={14} /></button>
          </div>
        </div>

        <div className="kick-stats-row">
          <div className="kick-stat">
            <h4>Today</h4>
            <span className="stat-big">{todayCount}</span>
            <span className="stat-sm">kicks</span>
          </div>
          <div className="kick-stat">
            <h4>Goal</h4>
            <span className="stat-big">{goalReached ? <CheckCircle2 size={28} /> : `${10 - todayCount}`}</span>
            <span className="stat-sm">{goalReached ? 'Done!' : 'remaining'}</span>
          </div>
          <div className="kick-stat">
            <h4>Session</h4>
            <span className="stat-big">{fmt(seconds)}</span>
            <span className="stat-sm">elapsed</span>
          </div>
        </div>
      </div>

      <div className="kick-history card">
        <h3><TrendingUp size={18} /> 7-Day History</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={last7()}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="kicks" fill="var(--primary)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default KickCounter;
