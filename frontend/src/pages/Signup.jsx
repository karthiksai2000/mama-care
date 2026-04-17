import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../services/api';
import { motion } from 'framer-motion';
import { Heart, Mail, Lock, Eye, EyeOff, User, Calendar, ArrowRight, Loader2 } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    lmpDate: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  // Calculate pregnancy week from LMP date
  const calcWeek = (lmp) => {
    if (!lmp) return 1;
    const diff = Date.now() - new Date(lmp).getTime();
    const weeks = Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
    return Math.min(Math.max(weeks, 1), 42);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const pregnancyWeek = calcWeek(form.lmpDate);

    try {
      const response = await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
        pregnancyWeek,
        conditions: [],
      });

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
      const message = err?.response?.data?.message || 'Registration failed.';
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
        {/* Left — Branding */}
        <div className="auth-brand">
          <div className="auth-brand-content">
            <Heart size={40} fill="#FF69B4" stroke="#FF69B4" />
            <h2>MaMa Care</h2>
            <p>Join thousands of mothers on a smarter, safer pregnancy journey powered by AI.</p>
            <div className="auth-brand-features">
              <div>✓ Free health tracking</div>
              <div>✓ AI-powered guidance</div>
              <div>✓ Personalized diet plans</div>
              <div>✓ Risk alerts & reminders</div>
            </div>
          </div>
        </div>

        {/* Right — Form */}
        <div className="auth-form-section">
          <div className="auth-form-header">
            <h2>Create Account 🤰</h2>
            <p>Start your maternal health journey</p>
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
              <label htmlFor="name">Full Name *</label>
              <div className="input-wrapper">
                <User size={18} />
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <div className="input-wrapper">
                <Mail size={18} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="lmpDate">Last Menstrual Period (LMP)</label>
              <div className="input-wrapper">
                <Calendar size={18} />
                <input
                  id="lmpDate"
                  name="lmpDate"
                  type="date"
                  value={form.lmpDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <div className="input-wrapper">
                  <Lock size={18} />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 6 characters"
                    value={form.password}
                    onChange={handleChange}
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

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm *</label>
                <div className="input-wrapper">
                  <Lock size={18} />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Re-enter password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <><Loader2 size={18} className="spinner" /> Creating account...</>
              ) : (
                <>Create Account <ArrowRight size={18} /></>
              )}
            </button>

            <div className="auth-switch">
              Already have an account? <Link to="/login">Sign In</Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
