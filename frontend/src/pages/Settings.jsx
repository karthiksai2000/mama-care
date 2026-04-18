import React, { useState } from 'react';
import { Bell, Globe, Moon, Sun, ShieldCheck, Download, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { lang, changeLang, LANG_LIST } = useLanguage();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);

  return (
    <div className="settings-page">
      <header className="settings-header">
        <div>
          <span className="settings-eyebrow">Settings</span>
          <h2>Personalize your MaMa Care experience</h2>
          <p>Control notifications, language, privacy, and data export.</p>
        </div>
      </header>

      <section className="settings-grid">
        <div className="settings-card card">
          <div className="settings-title">
            <Bell size={18} /> Notifications
          </div>
          <div className="settings-row">
            <span>Email alerts</span>
            <button
              type="button"
              className={`toggle-pill ${emailAlerts ? 'active' : ''}`}
              onClick={() => setEmailAlerts((prev) => !prev)}
            >
              {emailAlerts ? 'On' : 'Off'}
            </button>
          </div>
          <div className="settings-row">
            <span>Push reminders</span>
            <button
              type="button"
              className={`toggle-pill ${pushAlerts ? 'active' : ''}`}
              onClick={() => setPushAlerts((prev) => !prev)}
            >
              {pushAlerts ? 'On' : 'Off'}
            </button>
          </div>
        </div>

        <div className="settings-card card">
          <div className="settings-title">
            <Globe size={18} /> Language
          </div>
          <select value={lang} onChange={(event) => changeLang(event.target.value)}>
            {LANG_LIST.map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </div>

        <div className="settings-card card">
          <div className="settings-title">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />} Appearance
          </div>
          <button type="button" className="primary-btn" onClick={toggleTheme}>
            Switch to {theme === 'dark' ? 'light' : 'dark'} mode
          </button>
        </div>

        <div className="settings-card card">
          <div className="settings-title">
            <ShieldCheck size={18} /> Privacy
          </div>
          <div className="settings-row">
            <span>Private profile</span>
            <button
              type="button"
              className={`toggle-pill ${privacyMode ? 'active' : ''}`}
              onClick={() => setPrivacyMode((prev) => !prev)}
            >
              {privacyMode ? 'Enabled' : 'Disabled'}
            </button>
          </div>
          <p className="settings-note">Hide your profile from community search results.</p>
        </div>

        <div className="settings-card card">
          <div className="settings-title">
            <Download size={18} /> Data export
          </div>
          <button type="button" className="ghost-btn">Request export</button>
          <p className="settings-note">We will email a secure download link.</p>
        </div>

        <div className="settings-card card">
          <div className="settings-title">
            <Sparkles size={18} /> AI Companion
          </div>
          <p className="settings-note">Adjust your preferred tone and guidance depth in the AI chat settings.</p>
          <button type="button" className="ghost-btn">Manage preferences</button>
        </div>
      </section>
    </div>
  );
};

export default Settings;
