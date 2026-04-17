import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';
import { motion } from 'framer-motion';
import { Heart, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser({ email: form.email, password: form.password });
      const apiUser = response.user || {};

      login({
        token: response.token,
        user: {
          id: apiUser.id || apiUser._id,
          name: apiUser.name,
          email: apiUser.email,
          week: apiUser.pregnancyWeek || apiUser.week,
          conditions: apiUser.conditions || [],
        },
      });

      navigate('/dashboard');
    } catch (err) {
      const message = err?.response?.data?.message || 'Invalid email or password.';
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Left — Branding Panel */}
        <div className="auth-brand">
          <div className="auth-brand-content">
            <Heart size={40} fill="#FF69B4" stroke="#FF69B4" />
            <h2>MaMa Care</h2>
            <p>Your smart maternal health companion. Track, chat, and stay healthy throughout your pregnancy.</p>
            <div className="auth-brand-stats">
              <div><strong>10K+</strong><span>Mothers</span></div>
              <div><strong>99%</strong><span>Satisfaction</span></div>
            </div>
          </div>
        </div>

        {/* Right — Form */}
        <div className="auth-form-section">
          <div className="auth-form-header">
            <h2>Welcome Back 👋</h2>
            <p>Sign in to continue your journey</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <motion.div
                className="auth-error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <Mail size={18} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="manasa@mama.care"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock size={18} />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <><Loader2 size={18} className="spinner" /> Signing in...</>
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>

            <div className="auth-switch">
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
