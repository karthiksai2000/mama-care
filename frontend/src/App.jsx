import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Chatbot from './pages/Chatbot';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import DietPlan from './pages/DietPlan';
import KickCounter from './pages/KickCounter';
import ContractionTimer from './pages/ContractionTimer';
import RiskCalculator from './pages/RiskCalculator';
import WeightTracker from './pages/WeightTracker';
import SymptomChecker from './pages/SymptomChecker';
import BabyGrowth from './pages/BabyGrowth';
import Appointments from './pages/Appointments';
import Community from './pages/Community';
import PartnerPortal from './pages/PartnerPortal';
import Onboarding from './pages/Onboarding';
import WeeklyJourney from './pages/WeeklyJourney';
import HealthTracker from './pages/HealthTracker';
import Settings from './pages/Settings';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected routes — inside Layout shell */}
              <Route
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/chatbot" element={<Chatbot />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/diet" element={<DietPlan />} />
                <Route path="/kick-counter" element={<KickCounter />} />
                <Route path="/contraction-timer" element={<ContractionTimer />} />
                <Route path="/risk-calculator" element={<RiskCalculator />} />
                <Route path="/weight-tracker" element={<WeightTracker />} />
                <Route path="/symptom-checker" element={<SymptomChecker />} />
                <Route path="/baby-growth" element={<BabyGrowth />} />
                <Route path="/weekly-journey" element={<WeeklyJourney />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/health-tracker" element={<HealthTracker />} />
                <Route path="/community" element={<Community />} />
                <Route path="/partner-portal" element={<PartnerPortal />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
