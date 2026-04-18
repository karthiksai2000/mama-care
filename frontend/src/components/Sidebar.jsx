import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquareHeart, FileHeart, Utensils, Baby, Timer, Calculator, Scale, Stethoscope, Apple, CalendarDays, Users, Share2, Sun, Moon, Globe, Sparkles, HeartPulse, Settings as SettingsIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const Sidebar = ({ isOpen }) => {
  const { theme, toggleTheme } = useTheme();
  const { t, lang, changeLang, LANG_LIST } = useLanguage();

  const sections = [
    {
      title: t('main'),
      links: [
        { to: '/dashboard', label: t('dashboard'), icon: <LayoutDashboard size={18} /> },
        { to: '/chatbot', label: t('chatbot'), icon: <MessageSquareHeart size={18} /> },
        { to: '/onboarding', label: 'Onboarding', icon: <Sparkles size={18} /> },
      ],
    },
    {
      title: t('healthTools'),
      links: [
        { to: '/health-tracker', label: 'Health Tracker', icon: <HeartPulse size={18} /> },
        { to: '/kick-counter', label: t('kickCounter'), icon: <Baby size={18} /> },
        { to: '/contraction-timer', label: t('contractionTimer'), icon: <Timer size={18} /> },
        { to: '/risk-calculator', label: t('riskCalc'), icon: <Calculator size={18} /> },
        { to: '/weight-tracker', label: t('weightTracker'), icon: <Scale size={18} /> },
        { to: '/symptom-checker', label: t('symptomChecker'), icon: <Stethoscope size={18} /> },
      ],
    },
    {
      title: t('babyNutrition'),
      links: [
        { to: '/baby-growth', label: t('babyGrowth'), icon: <Apple size={18} /> },
        { to: '/weekly-journey', label: 'Weekly Journey', icon: <Baby size={18} /> },
        { to: '/diet', label: t('diet'), icon: <Utensils size={18} /> },
      ],
    },
    {
      title: t('records'),
      links: [
        { to: '/reports', label: t('reports'), icon: <FileHeart size={18} /> },
        { to: '/appointments', label: t('appointments'), icon: <CalendarDays size={18} /> },
      ],
    },
    {
      title: t('social'),
      links: [
        { to: '/community', label: t('community'), icon: <Users size={18} /> },
        { to: '/partner-portal', label: t('partner'), icon: <Share2 size={18} /> },
      ],
    },
    {
      title: 'Preferences',
      links: [
        { to: '/settings', label: 'Settings', icon: <SettingsIcon size={18} /> },
      ],
    },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-scroll">
        {sections.map((sec) => (
          <div key={sec.title} className="sidebar-section">
            <span className="sidebar-section-title">{sec.title}</span>
            <ul>
              {sec.links.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} className={({ isActive }) => (isActive ? 'active' : '')}>
                    {link.icon}
                    <span>{link.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="sidebar-section sidebar-settings">
          <span className="sidebar-section-title">{t('settings')}</span>
          <button className="sidebar-toggle-btn" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span>{t('darkMode')}</span>
          </button>
          <div className="sidebar-lang">
            <Globe size={16} />
            <select value={lang} onChange={(e) => changeLang(e.target.value)}>
              {LANG_LIST.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
            </select>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
