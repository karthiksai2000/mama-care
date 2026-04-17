import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  bulkInsertAppointments,
  bulkInsertContractions,
  bulkInsertKicks,
  bulkInsertWeights,
} from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('mama_care_user');
    const storedToken = localStorage.getItem('mama_care_token');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('mama_care_user');
      }
    }
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const migrate = async () => {
      if (!user?.id || !token) return;

      const flagKey = `mama_care_migrated_${user.id}`;
      if (localStorage.getItem(flagKey) === 'true') return;

      const weights = JSON.parse(localStorage.getItem('mama_weight') || '[]');
      const kicks = JSON.parse(localStorage.getItem('mama_kicks') || '[]');
      const contractions = JSON.parse(localStorage.getItem('mama_contractions') || '[]');
      const appointments = JSON.parse(localStorage.getItem('mama_appts') || '[]');

      const tasks = [];

      if (weights.length) {
        tasks.push(bulkInsertWeights(weights.map((w) => ({ date: w.date, weight: Number(w.weight) }))));
      }

      if (kicks.length) {
        tasks.push(bulkInsertKicks(kicks.map((k) => ({ ts: k.ts }))));
      }

      if (contractions.length) {
        tasks.push(bulkInsertContractions(contractions.map((c) => ({ start: c.start, duration: c.duration }))));
      }

      if (appointments.length) {
        tasks.push(bulkInsertAppointments(appointments.map((a) => ({
          date: a.date,
          time: a.time,
          doctor: a.doctor,
          type: a.type,
          location: a.location || '',
          notes: a.notes || '',
        }))));
      }

      if (!tasks.length) {
        localStorage.setItem(flagKey, 'true');
        return;
      }

      try {
        await Promise.all(tasks);
        localStorage.removeItem('mama_weight');
        localStorage.removeItem('mama_kicks');
        localStorage.removeItem('mama_contractions');
        localStorage.removeItem('mama_appts');
        localStorage.setItem(flagKey, 'true');
      } catch (error) {
        console.warn('[MaMa Care] Local data migration failed.', error?.message || error);
      }
    };

    migrate();
  }, [token, user]);

  const login = (userData) => {
    const normalizedUser = userData?.user || userData;
    const authToken = userData?.token || null;

    setUser(normalizedUser);
    localStorage.setItem('mama_care_user', JSON.stringify(normalizedUser));

    if (authToken) {
      setToken(authToken);
      localStorage.setItem('mama_care_token', authToken);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('mama_care_user');
    localStorage.removeItem('mama_care_token');
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('mama_care_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
