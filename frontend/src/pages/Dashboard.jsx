import React, { useEffect, useState } from 'react';
import { fetchDashboardData } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CalendarCheck, Baby, HeartPulse, Sparkles, Smile } from 'lucide-react';
import { motion } from 'framer-motion';

// Helper to calculate trimester
const getTrimester = (week) => {
  if (week <= 12) return { num: 1, label: 'First Trimester' };
  if (week <= 26) return { num: 2, label: 'Second Trimester' };
  return { num: 3, label: 'Third Trimester' };
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [checkedReminders, setCheckedReminders] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleReminder = (idx) => {
    setCheckedReminders((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (loading) {
    return (
      <div className="dashboard skeleton-page">
        <div className="skeleton-line" />
        <div className="skeleton-line short" />
        <div className="skeleton-grid">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="skeleton-card" />
          ))}
        </div>
        <div className="skeleton-chart" />
      </div>
    );
  }

  if (!data) return <p>Something went wrong. Please try again.</p>;

  const trimester = getTrimester(data.user.week);
  const riskLabel = data.user.risk ? data.user.risk.toUpperCase() : 'UNKNOWN';
  const nextAppt = data.stats?.nextAppointment;
  const nextApptLabel = nextAppt
    ? new Date(nextAppt.date).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—';
  const kickCount = typeof data.stats?.kickCount === 'number' ? data.stats.kickCount : null;
  const waterIntake = data.stats?.waterIntake;
  const waterGoal = data.stats?.waterGoal;

  const recommendations = [
    'Try 10 minutes of prenatal stretches today.',
    'Add an iron-rich snack to your afternoon meal.',
    'Share your mood in the AI check-in.',
  ];

  return (
    <motion.div
      className="dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <header className="dashboard-header premium-header">
        <div>
          <h2>Welcome back, {data.user.name}</h2>
          <p className="pregnancy-info">
            <span className="week-badge">Week {data.user.week}</span>
            <span className="trimester-badge">{trimester.label}</span>
          </p>
          <p className="dashboard-sub">Your AI companion is ready with a calm, personalized plan.</p>
        </div>
        <div className="risk-indicator" data-risk={(data.user.risk || 'unknown').toLowerCase()}>
          Risk: <strong>{riskLabel}</strong>
        </div>
      </header>

      <section className="dashboard-cards">
        <div className="dashboard-card card">
          <span className="card-eyebrow">Current Week</span>
          <h3>Week {data.user.week}</h3>
          <p>{trimester.label} · Baby size update ready</p>
          <span className="card-chip"><Baby size={14} /> Baby growth insight</span>
        </div>
        <div className="dashboard-card card">
          <span className="card-eyebrow">Hydration</span>
          <h3>{waterIntake !== null && waterGoal ? `${waterIntake} / ${waterGoal}` : '—'}</h3>
          <p>Daily water intake</p>
          <div className="mini-progress">
            <div style={{ width: waterIntake && waterGoal ? `${(waterIntake / waterGoal) * 100}%` : '20%' }} />
          </div>
        </div>
        <div className="dashboard-card card">
          <span className="card-eyebrow">Appointments</span>
          <h3>{nextApptLabel}</h3>
          <p>Upcoming doctor visit</p>
          <span className="card-chip"><CalendarCheck size={14} /> Confirmed</span>
        </div>
        <div className="dashboard-card card">
          <span className="card-eyebrow">Mood Check-in</span>
          <h3>Calm</h3>
          <p>How are you feeling today?</p>
          <span className="card-chip"><Smile size={14} /> Track mood</span>
        </div>
        <div className="dashboard-card card">
          <span className="card-eyebrow">Baby Kicks</span>
          <h3>{kickCount !== null ? `${kickCount} today` : '—'}</h3>
          <p>Keep monitoring movement</p>
          <span className="card-chip"><HeartPulse size={14} /> Healthy rhythm</span>
        </div>
        <div className="dashboard-card card">
          <span className="card-eyebrow">Daily Recommendations</span>
          <ul className="card-list">
            {recommendations.map((item) => (
              <li key={item}><Sparkles size={14} /> {item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="chart-section">
        <h3>Hemoglobin Trend</h3>
        {data.healthTrends?.length ? (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data.healthTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,41,61,0.1)" />
              <XAxis dataKey="week" label={{ value: 'Week', position: 'insideBottom', offset: -5 }} />
              <YAxis domain={[10, 13]} label={{ value: 'g/dL', angle: -90, position: 'insideLeft' }} />
              <Tooltip contentStyle={{ background: '#fff', borderRadius: 12, border: '1px solid rgba(59,41,61,0.1)' }} />
              <Legend />
              <Line
                type="monotone"
                dataKey="hemoglobin"
                stroke="#d67aa5"
                strokeWidth={3}
                dot={{ fill: '#d67aa5', r: 5 }}
                activeDot={{ r: 7 }}
                name="Hemoglobin (g/dL)"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>No health trend data available yet.</p>
        )}
      </section>

      <section className="reminders-section">
        <h3>Daily Reminders</h3>
        <ul className="reminders-list">
          {data.reminders?.length ? data.reminders.map((reminder, idx) => (
            <motion.li
              key={idx}
              className={`reminder-item ${checkedReminders[idx] ? 'completed' : ''}`}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              <label>
                <input
                  type="checkbox"
                  checked={!!checkedReminders[idx]}
                  onChange={() => toggleReminder(idx)}
                />
                <span>{typeof reminder === 'string' ? reminder : reminder.text}</span>
              </label>
            </motion.li>
          )) : (
            <li className="reminder-item">No reminders available yet.</li>
          )}
        </ul>
      </section>
    </motion.div>
  );
};

export default Dashboard;
