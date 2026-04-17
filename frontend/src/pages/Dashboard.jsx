import React, { useEffect, useState } from 'react';
import { Card } from '../components';
import { fetchDashboardData } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CalendarCheck, Droplets, Baby, Loader2 } from 'lucide-react';
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
      <div className="loading-state">
        <Loader2 className="spinner" size={40} />
        <p>Loading your dashboard...</p>
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

  return (
    <motion.div
      className="dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Welcome Header */}
      <header className="dashboard-header">
        <div>
          <h2>Welcome back, {data.user.name}! 👋</h2>
          <p className="pregnancy-info">
            <span className="week-badge">Week {data.user.week}</span>
            <span className="trimester-badge">{trimester.label}</span>
          </p>
        </div>
        <div className="risk-indicator" data-risk={(data.user.risk || 'unknown').toLowerCase()}>
          Risk: <strong>{riskLabel}</strong>
        </div>
      </header>

      {/* Summary Cards */}
      <section className="cards-grid">
        <Card
          title="Next Appointment"
          value={nextApptLabel}
          icon={<CalendarCheck size={24} />}
          color="#008080"
        />
        <Card
          title="Daily Water Intake"
          value={waterIntake !== null && waterGoal ? `${waterIntake} / ${waterGoal}` : '—'}
          icon={<Droplets size={24} />}
          color="#FF69B4"
        />
        <Card
          title="Baby Kick Count"
          value={kickCount !== null ? `${kickCount} today` : '—'}
          icon={<Baby size={24} />}
          color="#008080"
        />
      </section>

      {/* Hemoglobin Trend Chart */}
      <section className="chart-section">
        <h3>📈 Hemoglobin Trend</h3>
        {data.healthTrends?.length ? (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data.healthTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" label={{ value: 'Week', position: 'insideBottom', offset: -5 }} />
              <YAxis domain={[10, 13]} label={{ value: 'g/dL', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="hemoglobin"
                stroke="#FF69B4"
                strokeWidth={3}
                dot={{ fill: '#FF69B4', r: 5 }}
                activeDot={{ r: 7 }}
                name="Hemoglobin (g/dL)"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>No health trend data available yet.</p>
        )}
      </section>

      {/* Daily Reminders with Checkboxes */}
      <section className="reminders-section">
        <h3>✅ Daily Reminders</h3>
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
