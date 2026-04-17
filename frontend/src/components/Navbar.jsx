import React from 'react';
import { Menu, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationPanel from './NotificationPanel';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="menu-btn" onClick={toggleSidebar} aria-label="Toggle menu">
          <Menu size={24} />
        </button>
        <Link to="/dashboard" className="logo">
          <span className="logo-icon">🤰</span>
          <span className="logo-text">MaMa Care</span>
        </Link>
      </div>
      <div className="nav-actions">
        {user && <span className="nav-greeting">Hi, {user.name?.split(' ')[0]} 👋</span>}
        <NotificationPanel />
        <Link to="/profile" className="nav-icon-btn profile-btn" aria-label="Profile">
          <User size={20} />
        </Link>
        <button className="nav-icon-btn logout-icon-btn" onClick={handleLogout} aria-label="Logout" title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
