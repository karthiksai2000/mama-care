import React, { useMemo, useState } from 'react';
import { CalendarDays, Heart, Bell, Sparkles, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { saveOnboarding } from '../services/api';
import { useAuth } from '../context/AuthContext';

const STEP_LIST = [
  { key: 'due-date', title: 'Due Date', subtitle: 'When are you expecting your little one?' },
  { key: 'first-pregnancy', title: 'First Pregnancy', subtitle: 'Help us personalize your care plan.' },
  { key: 'health-goals', title: 'Health Goals', subtitle: 'Choose what you want to focus on.' },
  { key: 'reminders', title: 'Reminder Preferences', subtitle: 'Pick the reminders you want to receive.' },
  { key: 'emotional', title: 'Emotional Support', subtitle: 'Tell us how you want to feel supported.' },
];

const Onboarding = () => {
  const { updateUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    dueDate: '',
    firstPregnancy: 'yes',
    goals: [],
    reminders: [],
    emotional: [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const progress = useMemo(() => Math.round(((step + 1) / STEP_LIST.length) * 100), [step]);

  const toggleMulti = (key, value) => {
    setForm((prev) => {
      const exists = prev[key].includes(value);
      return {
        ...prev,
        [key]: exists ? prev[key].filter((item) => item !== value) : [...prev[key], value],
      };
    });
  };

  const stepContent = () => {
    switch (STEP_LIST[step].key) {
      case 'due-date':
        return (
          <div className="onboarding-field">
            <label className="onboarding-label">Expected due date</label>
            <div className="onboarding-input">
              <CalendarDays size={18} />
              <input
                type="date"
                value={form.dueDate}
                onChange={(event) => setForm((prev) => ({ ...prev, dueDate: event.target.value }))}
              />
            </div>
          </div>
        );
      case 'first-pregnancy':
        return (
          <div className="onboarding-choice">
            <label className="onboarding-label">Is this your first pregnancy?</label>
            <div className="onboarding-toggle-group">
              {['yes', 'no'].map((value) => (
                <button
                  type="button"
                  key={value}
                  className={`pill-toggle ${form.firstPregnancy === value ? 'active' : ''}`}
                  onClick={() => setForm((prev) => ({ ...prev, firstPregnancy: value }))}
                >
                  {value === 'yes' ? 'Yes, first time' : 'No, I have experience'}
                </button>
              ))}
            </div>
          </div>
        );
      case 'health-goals':
        return (
          <div className="onboarding-choice">
            <label className="onboarding-label">Select your main health goals</label>
            <div className="onboarding-chip-grid">
              {['Balanced nutrition', 'Gentle movement', 'Better sleep', 'Stress relief', 'Weekly tracking'].map((goal) => (
                <button
                  key={goal}
                  type="button"
                  className={`choice-chip ${form.goals.includes(goal) ? 'active' : ''}`}
                  onClick={() => toggleMulti('goals', goal)}
                >
                  <Heart size={14} /> {goal}
                </button>
              ))}
            </div>
          </div>
        );
      case 'reminders':
        return (
          <div className="onboarding-choice">
            <label className="onboarding-label">Choose reminder types</label>
            <div className="onboarding-chip-grid">
              {['Water intake', 'Supplements', 'Appointments', 'Breathing breaks', 'Daily check-ins'].map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`choice-chip ${form.reminders.includes(item) ? 'active' : ''}`}
                  onClick={() => toggleMulti('reminders', item)}
                >
                  <Bell size={14} /> {item}
                </button>
              ))}
            </div>
          </div>
        );
      case 'emotional':
        return (
          <div className="onboarding-choice">
            <label className="onboarding-label">How would you like support?</label>
            <div className="onboarding-chip-grid">
              {['Daily affirmations', 'Mindfulness tips', 'Partner insights', 'Community stories', 'Gentle AI check-ins'].map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`choice-chip ${form.emotional.includes(item) ? 'active' : ''}`}
                  onClick={() => toggleMulti('emotional', item)}
                >
                  <Sparkles size={14} /> {item}
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const finishOnboarding = async () => {
    setSaving(true);
    setError('');
    try {
      const response = await saveOnboarding({
        dueDate: form.dueDate,
        firstPregnancy: form.firstPregnancy,
        goals: form.goals,
        reminders: form.reminders,
        emotional: form.emotional,
      });
      if (response?.user) {
        updateUser(response.user);
      }
      navigate('/dashboard');
    } catch (err) {
      const message = err?.response?.data?.message || 'Unable to save onboarding data.';
      setError(message);
      setSaving(false);
    }
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-shell">
        <div className="onboarding-header">
          <div>
            <span className="onboarding-eyebrow">Personalize your journey</span>
            <h2>Welcome to MaMa Care</h2>
            <p>Answer a few questions so your AI companion can tailor every week.</p>
          </div>
          <div className="onboarding-progress">
            <span>{progress}% Complete</span>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="onboarding-stepper">
          {STEP_LIST.map((item, index) => (
            <div key={item.key} className={`step-dot ${index <= step ? 'active' : ''}`}>
              {index < step ? <CheckCircle2 size={16} /> : index + 1}
              <span>{item.title}</span>
            </div>
          ))}
        </div>

        <div className="onboarding-card card">
          <div className="onboarding-card-header">
            <h3>{STEP_LIST[step].title}</h3>
            <p>{STEP_LIST[step].subtitle}</p>
          </div>
          {stepContent()}
          {error && <p className="onboarding-error">{error}</p>}
        </div>

        <div className="onboarding-actions">
          <button
            type="button"
            className="ghost-btn"
            onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
            disabled={step === 0}
          >
            <ArrowLeft size={16} /> Back
          </button>
          {step < STEP_LIST.length - 1 ? (
            <button
              type="button"
              className="primary-btn"
              onClick={() => setStep((prev) => Math.min(prev + 1, STEP_LIST.length - 1))}
            >
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button type="button" className="primary-btn" onClick={finishOnboarding} disabled={saving}>
              {saving ? 'Saving...' : 'Finish Onboarding'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
