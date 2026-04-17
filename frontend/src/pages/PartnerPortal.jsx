import React, { useState, useEffect } from 'react';
import { Share2, Copy, CheckCircle, Baby, Activity, Calendar, Heart, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchBabyGrowth, fetchDashboardData } from '../services/api';

const PartnerPortal = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [growth, setGrowth] = useState([]);
  const [copied, setCopied] = useState(false);
  const shareLink = `https://mamacare.app/partner/${user?.email ? btoa(user.email).slice(0, 12) : 'abc123'}`;

  useEffect(() => { fetchDashboardData().then(setData); }, []);
  useEffect(() => {
    let active = true;
    const loadGrowth = async () => {
      try {
        const result = await fetchBabyGrowth();
        if (active) setGrowth(result.items || []);
      } catch (error) {
        console.warn('[MaMa Care] Unable to load baby growth data.', error?.message || error);
      }
    };

    loadGrowth();
    return () => {
      active = false;
    };
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const week = user?.week || data?.user?.week || 24;
  const trimester = week <= 13 ? '1st' : week <= 27 ? '2nd' : '3rd';
  const dueDate = user?.lmp ? new Date(new Date(user.lmp).getTime() + 280 * 86400000).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not set';
  const daysLeft = user?.lmp ? Math.max(0, Math.ceil((new Date(user.lmp).getTime() + 280 * 86400000 - Date.now()) / 86400000)) : '—';
  const sizeMatch = growth.reduce((best, item, index) => {
    if (!growth.length) return 0;
    return Math.abs(item.week - week) < Math.abs(growth[best].week - week) ? index : best;
  }, 0);
  const sizeLabel = growth[sizeMatch]?.fruitName || '—';
  const riskLabel = data?.user?.risk ? data.user.risk.toUpperCase() : 'UNKNOWN';

  return (
    <div className="partner-page">
      <h2><Share2 size={24} /> Partner & Family Portal</h2>
      <p className="subtitle">Share a read-only pregnancy summary with your partner or family</p>

      <div className="partner-share card">
        <h3>🔗 Share Link</h3>
        <p className="share-desc">Copy this link and send it to your partner or family members so they can track your progress.</p>
        <div className="share-link-row">
          <input value={shareLink} readOnly className="share-input" />
          <button className="share-copy-btn" onClick={copyLink}>
            {copied ? <><CheckCircle size={16} /> Copied!</> : <><Copy size={16} /> Copy</>}
          </button>
        </div>
        <p className="share-note">⚠️ This is a demo link. In production, this would be a secure, unique URL.</p>
      </div>

      <h3 className="partner-preview-title">👀 Preview — What your partner sees:</h3>

      <div className="partner-preview">
        <div className="partner-hero card">
          <div className="partner-hero-left">
            <h2>🤰 {user?.name || 'MaMa'}'s Pregnancy Journey</h2>
            <p className="partner-week">Week <strong>{week}</strong> · {trimester} Trimester</p>
          </div>
          <div className="partner-hero-right">
            <div className="partner-countdown">
              <span className="countdown-num">{daysLeft}</span>
              <span className="countdown-label">days to go</span>
            </div>
          </div>
        </div>

        <div className="partner-grid">
          <div className="partner-info-card card">
            <Calendar size={20} />
            <h4>Due Date</h4>
            <p>{dueDate}</p>
          </div>
          <div className="partner-info-card card">
            <Baby size={20} />
            <h4>Baby Size</h4>
            <p>{sizeLabel}</p>
          </div>
          <div className="partner-info-card card">
            <Activity size={20} />
            <h4>Health Status</h4>
            <p style={{ color: riskLabel === 'HIGH' ? '#ef4444' : riskLabel === 'MEDIUM' ? '#f59e0b' : '#22c55e' }}>
              {riskLabel === 'UNKNOWN' ? '—' : riskLabel}
            </p>
          </div>
          <div className="partner-info-card card">
            <Shield size={20} />
            <h4>Risk Level</h4>
            <p style={{ color: riskLabel === 'HIGH' ? '#ef4444' : riskLabel === 'MEDIUM' ? '#f59e0b' : '#22c55e' }}>{riskLabel}</p>
          </div>
        </div>

        <div className="partner-reminders card">
          <h4>💊 Today's Reminders</h4>
          {data?.reminders?.length ? (
            <ul>
              {data.reminders.map((r, i) => (
                <li key={i}>* {typeof r === 'string' ? r : r.text}</li>
              ))}
            </ul>
          ) : (
            <p>No reminders available yet.</p>
          )}
        </div>

        <div className="partner-note card">
          <Heart size={18} />
          <p>This view is read-only. Only {user?.name || 'the mother'} can update health data through the MaMa Care app.</p>
        </div>
      </div>
    </div>
  );
};

export default PartnerPortal;
