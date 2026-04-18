import React, { useMemo } from 'react';
import { Baby, ShieldCheck, HeartPulse, Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const buildWeekData = (week) => {
  const trimester = week <= 13 ? 'First Trimester' : week <= 27 ? 'Second Trimester' : 'Third Trimester';
  const growth = week <= 13
    ? 'Tiny foundations are forming with rapid neural development.'
    : week <= 27
      ? 'Growth accelerates with stronger movements and senses.'
      : 'Baby is gaining weight and preparing for delivery.';
  const body = week <= 13
    ? 'Energy levels may fluctuate as hormones stabilize.'
    : week <= 27
      ? 'You might feel stronger kicks and a steady appetite.'
      : 'Focus on rest, hydration, and gentle stretches.';
  const tips = week <= 13
    ? 'Prioritize iron-rich meals and daily hydration.'
    : week <= 27
      ? 'Keep a weekly movement log and add mindful breathing.'
      : 'Plan your hospital bag and practice relaxation routines.';
  const warnings = week <= 13
    ? 'Reach out if you have persistent cramping or dizziness.'
    : week <= 27
      ? 'Monitor swelling and sudden fatigue changes.'
      : 'Watch for regular contractions or fluid changes.';
  const nutrition = week <= 13
    ? 'Add folate, vitamin D, and gentle protein snacks.'
    : week <= 27
      ? 'Include omega-3 sources and complex carbs.'
      : 'Focus on calcium, magnesium, and balanced portions.';
  return { week, trimester, growth, body, tips, warnings, nutrition };
};

const WeeklyJourney = () => {
  const { user } = useAuth();
  const currentWeek = user?.week || 24;

  const timeline = useMemo(() => Array.from({ length: 40 }, (_, i) => buildWeekData(i + 1)), []);

  return (
    <div className="journey-page">
      <header className="journey-header">
        <div>
          <span className="journey-eyebrow">Weekly Journey</span>
          <h2><Baby size={22} /> Week-by-Week Pregnancy Timeline</h2>
          <p>Explore baby growth, body changes, and guidance from Week 1 to delivery.</p>
        </div>
        <div className="journey-current">
          <span>Current Week</span>
          <strong>Week {currentWeek}</strong>
        </div>
      </header>

      <div className="journey-timeline">
        {timeline.map((item) => (
          <article key={item.week} className={`journey-card card ${item.week === currentWeek ? 'current' : ''}`}>
            <div className="journey-card-header">
              <div>
                <span className="journey-week">Week {item.week}</span>
                <p>{item.trimester}</p>
              </div>
              <span className="journey-tag">{item.week === currentWeek ? 'Now' : 'Guide'}</span>
            </div>
            <div className="journey-grid">
              <div>
                <h4><Baby size={16} /> Baby growth</h4>
                <p>{item.growth}</p>
              </div>
              <div>
                <h4><HeartPulse size={16} /> Body changes</h4>
                <p>{item.body}</p>
              </div>
              <div>
                <h4><ShieldCheck size={16} /> Tips & warnings</h4>
                <p>{item.tips}</p>
                <p className="journey-warning">{item.warnings}</p>
              </div>
              <div>
                <h4><Leaf size={16} /> Nutrition focus</h4>
                <p>{item.nutrition}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default WeeklyJourney;
