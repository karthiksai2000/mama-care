import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDashboardData } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Mail, Calendar, Activity } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetchDashboardData().then((d) => setHealth(d));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="profile-page">
      <h2>Your Profile</h2>

      <div className="profile-card">
        <div className="profile-avatar">
          {authUser?.name?.charAt(0) || 'M'}
        </div>
        <div className="profile-details">
          <p><User size={16} /> <strong>Name:</strong> {authUser?.name || 'User'}</p>
          <p><Mail size={16} /> <strong>Email:</strong> {authUser?.email || '—'}</p>
          <p><Calendar size={16} /> <strong>Pregnancy Week:</strong> {authUser?.week || health?.user?.week || '—'}</p>
          <p><Activity size={16} /> <strong>Risk Level:</strong> {health?.user?.risk || 'Calculating...'}</p>
        </div>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        <LogOut size={18} /> Logout
      </button>
    </div>
  );
};

export default Profile;
