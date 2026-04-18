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
          dueDate: apiUser.dueDate || null,
          firstPregnancy: apiUser.firstPregnancy ?? null,
          healthGoals: apiUser.healthGoals || [],
          reminderPreferences: apiUser.reminderPreferences || [],
          emotionalSupport: apiUser.emotionalSupport || [],
          onboardingCompleted: apiUser.onboardingCompleted || false,
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
    <div className="auth-page premium-auth">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-brand">
          <div className="auth-brand-content">
            <Heart size={40} />
            <h2>MaMa Care</h2>
            <p>AI pregnancy guidance designed to feel calm, beautiful, and reassuring.</p>
            <div className="auth-visual-card">
              <div>
                <span>Week 18</span>
                <strong>Baby growth is on track</strong>
              </div>
              <div className="auth-visual-progress">
                <div className="progress-fill" style={{ width: '68%' }} />
              </div>
              <p>Next appointment in 3 days</p>
            </div>
            <div className="auth-trust">
              <span>Private & secure</span>
              <span>Clinician reviewed</span>
              <span>Trusted by moms</span>
            </div>
          </div>
        </div>

        {/* Right — Form */}
        <div className="auth-form-section">
          <div className="auth-form-header">
            <span className="auth-eyebrow">Welcome back</span>
            <h2>Sign in to continue</h2>
            <p>Pick up right where you left off in your journey.</p>
          </div>

          <div className="auth-social">
            <button type="button" className="social-btn">Continue with Google</button>
            <button type="button" className="social-btn">Continue with Apple</button>
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
