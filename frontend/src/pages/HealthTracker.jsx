import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Droplets, Moon, Smile, Activity, Plus, NotebookPen } from 'lucide-react';
import { addHealthEntry, fetchHealthEntries } from '../services/api';

const HealthTracker = () => {
  const [hydration, setHydration] = useState(6);
  const [sleep, setSleep] = useState(7.5);
  const [mood, setMood] = useState('Calm');
  const [journal, setJournal] = useState('');
  const [entries, setEntries] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const journalInputRef = useRef(null);

  const moodSeries = useMemo(() => [2, 3, 4, 3, 4, 5, 4], []);
  const symptomTags = ['Nausea', 'Back pain', 'Cravings', 'Swelling', 'Heartburn'];

  useEffect(() => {
    let active = true;
    const loadEntries = async () => {
      try {
        const data = await fetchHealthEntries();
        if (!active) return;
        const mapped = (data.entries || []).map((entry) => ({
          id: entry._id,
          text: entry.text,
          date: entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : '',
          hydration: entry.hydration,
          sleep: entry.sleep,
          mood: entry.mood,
        }));
        setEntries(mapped);
      } catch (error) {
        console.warn('[MaMa Care] Unable to load health entries.', error?.message || error);
      }
    };

    loadEntries();
    return () => {
      active = false;
    };
  }, []);

  const addEntry = async () => {
    const trimmed = journal.trim();
    if (!trimmed || isSaving) return;

    setIsSaving(true);
    try {
      const response = await addHealthEntry({
        text: trimmed,
        hydration,
        sleep,
        mood,
      });
      const entry = response.entry;
      setEntries((prev) => [{
        id: entry._id,
        text: entry.text,
        date: entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
        hydration: entry.hydration,
        sleep: entry.sleep,
        mood: entry.mood,
      }, ...prev]);
      setJournal('');
    } catch (error) {
      console.warn('[MaMa Care] Failed to save health entry.', error?.message || error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddEntryClick = () => {
    if (journal.trim()) {
      addEntry();
      return;
    }

    journalInputRef.current?.focus();
  };

  return (
    <div className="health-page">
      <header className="health-header">
        <div>
          <span className="health-eyebrow">Health Tracker</span>
          <h2>Daily Wellness Snapshot</h2>
          <p>Track hydration, sleep, mood, and symptoms in one calm space.</p>
        </div>
        <button className="primary-btn" type="button" onClick={handleAddEntryClick} disabled={isSaving}>
          <Plus size={16} /> Add Entry
        </button>
      </header>

      <section className="health-cards">
        <div className="health-card card">
          <div className="health-card-icon">
            <Droplets size={20} />
          </div>
          <div>
            <p>Hydration</p>
            <h3>{hydration}/8 cups</h3>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${(hydration / 8) * 100}%` }} />
            </div>
          </div>
        </div>
        <div className="health-card card">
          <div className="health-card-icon">
            <Moon size={20} />
          </div>
          <div>
            <p>Sleep</p>
            <h3>{sleep} hrs</h3>
            <span className="health-sub">Goal: 8 hrs</span>
          </div>
        </div>
        <div className="health-card card">
          <div className="health-card-icon">
            <Smile size={20} />
          </div>
          <div>
            <p>Mood</p>
            <h3>{mood}</h3>
            <div className="pill-row">
              {['Calm', 'Bright', 'Tired'].map((label) => (
                <button
                  key={label}
                  type="button"
                  className={`pill-toggle ${mood === label ? 'active' : ''}`}
                  onClick={() => setMood(label)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="health-card card">
          <div className="health-card-icon">
            <Activity size={20} />
          </div>
          <div>
            <p>Movement</p>
            <h3>22 min</h3>
            <span className="health-sub">Gentle yoga + walk</span>
          </div>
        </div>
      </section>

      <section className="health-grid">
        <div className="health-panel card">
          <h3>Hydration + Sleep</h3>
          <div className="health-sliders">
            <label>
              Water cups
              <input
                type="range"
                min="0"
                max="10"
                value={hydration}
                onChange={(event) => setHydration(Number(event.target.value))}
              />
            </label>
            <label>
              Sleep hours
              <input
                type="range"
                min="4"
                max="10"
                step="0.5"
                value={sleep}
                onChange={(event) => setSleep(Number(event.target.value))}
              />
            </label>
          </div>
        </div>

        <div className="health-panel card">
          <h3>Mood rhythm</h3>
          <div className="mini-graph">
            {moodSeries.map((value, index) => (
              <div key={index} className="mini-bar" style={{ height: `${value * 14}px` }} />
            ))}
          </div>
          <p className="health-sub">Stable with a gentle uptick this week.</p>
        </div>

        <div className="health-panel card">
          <h3>Symptoms journal</h3>
          <div className="symptom-tags">
            {symptomTags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="journal-input">
            <NotebookPen size={16} />
            <input
              placeholder="Note how you felt today..."
              value={journal}
              onChange={(event) => setJournal(event.target.value)}
              ref={journalInputRef}
            />
            <button type="button" onClick={addEntry} disabled={isSaving}>Save</button>
          </div>
          <div className="journal-entries">
            {entries.length === 0 ? (
              <p className="health-sub">No entries yet.</p>
            ) : (
              entries.map((entry, index) => (
                <div key={index} className="journal-entry">
                  <span>{entry.date}</span>
                  <p>{entry.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HealthTracker;
