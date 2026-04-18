import React, { useMemo, useState } from 'react';
import { Menu, User, LogOut, X, LayoutDashboard, CalendarDays, MessageSquareHeart, Baby, HeartPulse, Users, Settings as SettingsIcon } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationPanel from './NotificationPanel';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = useMemo(() => ([
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { to: '/appointments', label: 'Appointments', icon: <CalendarDays size={16} /> },
    { to: '/chatbot', label: 'AI Chat', icon: <MessageSquareHeart size={16} /> },
    { to: '/weekly-journey', label: 'Weekly Journey', icon: <Baby size={16} /> },
    { to: '/health-tracker', label: 'Health Tracker', icon: <HeartPulse size={16} /> },
    { to: '/community', label: 'Community', icon: <Users size={16} /> },
    { to: '/settings', label: 'Settings', icon: <SettingsIcon size={16} /> },
  ]), []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()
    : 'MC';

  return (
    <>
      <nav className="navbar premium-navbar">
        <div className="navbar-left">
          <button className="menu-btn" onClick={toggleSidebar} aria-label="Toggle menu">
            <Menu size={22} />
          </button>
          <Link to="/dashboard" className="logo">
            <span className="logo-icon">MaMa</span>
            <span className="logo-text">Care</span>
          </Link>
        </div>

        <div className="navbar-center">
          <Link to="/dashboard" className="nav-chip">
            <LayoutDashboard size={16} />
            Dashboard
          </Link>
        </div>

        <div className="nav-actions">
          {user && <span className="nav-greeting">Welcome, {user.name?.split(' ')[0]}</span>}
          <NotificationPanel />
          <Link to="/profile" className="nav-avatar" aria-label="Profile">
            <span>{initials}</span>
            <User size={16} />
          </Link>
          <button className="nav-icon-btn logout-icon-btn" onClick={handleLogout} aria-label="Logout" title="Logout">
            <LogOut size={18} />
          </button>
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Open menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <div className={`mobile-menu-backdrop ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)} />
      <aside className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <div>
            <p>Quick Access</p>
            <h4>MaMa Care</h4>
          </div>
          <button className="nav-icon-btn" onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>
        <div className="mobile-menu-links">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Navbar;
