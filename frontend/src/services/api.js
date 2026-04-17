/**
 * Smart API Layer for MaMa Care
 * - Reads VITE_API_URL and VITE_USE_MOCK_DATA from environment.
 * - Mocking is used only for ML routes (kept as-is).
 */

import axios from 'axios';

// ---------------------------------------------------------------------------
// Environment Variables (Vite uses import.meta.env)
// ---------------------------------------------------------------------------
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// ---------------------------------------------------------------------------
// Auth token helpers
// ---------------------------------------------------------------------------
const AUTH_TOKEN_KEY = 'mama_care_token';

export const getStoredToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

export const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

// ---------------------------------------------------------------------------
// Axios instance
// ---------------------------------------------------------------------------
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const MOCK_AI_ANALYSIS = {
  values: [
    { name: 'Hemoglobin', value: '10.2 g/dL', status: 'low', normal: '12-16 g/dL', note: 'Slightly low. Discuss iron intake with your doctor.' },
    { name: 'Blood Glucose (Fasting)', value: '92 mg/dL', status: 'normal', normal: '70-100 mg/dL', note: 'Within normal range.' },
    { name: 'Platelet Count', value: '180,000 /uL', status: 'normal', normal: '150,000-400,000 /uL', note: 'Normal.' },
    { name: 'TSH', value: '3.8 mIU/L', status: 'borderline', normal: '0.5-2.5 mIU/L (pregnancy)', note: 'Slightly elevated for pregnancy. Monitor.' },
    { name: 'Blood Pressure', value: '128/84 mmHg', status: 'borderline', normal: '<120/80 mmHg', note: 'Slightly elevated. Track regularly.' },
    { name: 'Urine Protein', value: 'Negative', status: 'normal', normal: 'Negative', note: 'Normal.' },
  ],
  summary: 'Mild anemia and slightly elevated TSH. Recommend follow-up with your OB-GYN.',
};

const MOCK_DIET_PLAN = {
  trimester: 2,
  focus: 'Balanced nutrition with iron, calcium, and folate',
  meals: {
    breakfast: ['Oats with almonds', 'Boiled egg', 'Seasonal fruit'],
    lunch: ['Brown rice', 'Dal', 'Leafy greens'],
    snacks: ['Yogurt', 'Handful of nuts'],
    dinner: ['Grilled paneer/chicken', 'Mixed veggies', 'Whole wheat roti'],
  },
};

const MOCK_SYMPTOM_ADVICE = {
  symptoms: [],
  advice: [
    'Stay hydrated and rest frequently.',
    'Light stretching can help with back pain.',
    'If symptoms worsen or include bleeding, contact your doctor immediately.',
  ],
  shouldConsultDoctor: false,
};

// ---------------------------------------------------------------------------
// Helper – returns mock wrapped in resolved Promise
// ---------------------------------------------------------------------------
const mockResponse = (data, delay = 300) =>
  new Promise((resolve) => setTimeout(() => resolve(data), delay));

// ---------------------------------------------------------------------------
// Exported API Functions
// ---------------------------------------------------------------------------

/**
 * Register a new user.
 * @param {object} payload - { name, email, password, pregnancyWeek, conditions }
 */
export async function registerUser(payload) {
  const response = await api.post('/auth/register', payload);
  return response.data;
}

/**
 * Login with email/password.
 * @param {object} payload - { email, password }
 */
export async function loginUser(payload) {
  const response = await api.post('/auth/login', payload);
  return response.data;
}

export async function fetchWeightEntries() {
  const response = await api.get('/weight');
  return response.data;
}

export async function addWeightEntry(payload) {
  const response = await api.post('/weight', payload);
  return response.data;
}

export async function deleteWeightEntry(id) {
  const response = await api.delete(`/weight/${id}`);
  return response.data;
}

export async function fetchKickEvents() {
  const response = await api.get('/kicks');
  return response.data;
}

export async function addKickEvent(payload = {}) {
  const response = await api.post('/kicks', payload);
  return response.data;
}

export async function deleteTodayKicks() {
  const response = await api.delete('/kicks/today');
  return response.data;
}

export async function fetchContractions() {
  const response = await api.get('/contractions');
  return response.data;
}

export async function addContraction(payload) {
  const response = await api.post('/contractions', payload);
  return response.data;
}

export async function clearContractions() {
  const response = await api.delete('/contractions');
  return response.data;
}

export async function fetchAppointments() {
  const response = await api.get('/appointments');
  return response.data;
}

export async function addAppointment(payload) {
  const response = await api.post('/appointments', payload);
  return response.data;
}

export async function deleteAppointment(id) {
  const response = await api.delete(`/appointments/${id}`);
  return response.data;
}

export async function bulkInsertWeights(entries) {
  const response = await api.post('/weight/bulk', { entries });
  return response.data;
}

export async function bulkInsertKicks(kicks) {
  const response = await api.post('/kicks/bulk', { kicks });
  return response.data;
}

export async function bulkInsertContractions(contractions) {
  const response = await api.post('/contractions/bulk', { contractions });
  return response.data;
}

export async function bulkInsertAppointments(appointments) {
  const response = await api.post('/appointments/bulk', { appointments });
  return response.data;
}

export async function fetchBabyGrowth() {
  const response = await api.get('/baby-growth');
  return response.data;
}

export async function fetchDietPlanByWeek({ trimester, week }) {
  const response = await api.get('/diet-plans', { params: { trimester, week } });
  return response.data;
}

export async function fetchSymptoms() {
  const response = await api.get('/symptoms');
  return response.data;
}

export async function analyzeSymptoms(symptomKeys) {
  const response = await api.post('/symptoms/analyze', { symptomKeys });
  return response.data;
}

export async function fetchRiskFactors() {
  const response = await api.get('/risk/factors');
  return response.data;
}

export async function assessRisk(payload) {
  const response = await api.post('/risk/assess', payload);
  return response.data;
}

export async function fetchRiskHistory() {
  const response = await api.get('/risk/history');
  return response.data;
}

export async function fetchChatHistory() {
  const response = await api.get('/chat/history');
  return response.data;
}

/**
 * Fetch dashboard data (user info, health trends, reminders, chat history).
 */
export async function fetchDashboardData() {
  const response = await api.get('/dashboard');
  return response.data;
}

/**
 * Send a chat message to the AI backend and return the bot's reply.
 * @param {string} message - User message
 * @returns {Promise<string>} Bot reply text
 */
export async function sendChatMessage(message) {
  try {
    const response = await api.post('/chat/message', { text: message });
    return response.data.reply;
  } catch (error) {
    console.warn('[MaMa Care] Chat service unavailable.', error.message);
    throw error;
  }
}

/**
 * Upload a medical report file.
 * @param {File} file
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function uploadReport(file) {
  if (USE_MOCK) {
    return mockResponse({ success: true, message: 'Report processed (mock).' }, 800);
  }

  try {
    const formData = new FormData();
    formData.append('report', file);
    const response = await api.post('/reports/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.warn('[MaMa Care] Upload failed.', error.message);
    return { success: false, message: 'Upload failed. Please try again.' };
  }
}

/**
 * Analyze a report with ML endpoint.
 * @param {object} payload - Optional report metadata
 */
export async function analyzeReport(payload = {}) {
  if (USE_MOCK) {
    return mockResponse(MOCK_AI_ANALYSIS, 800);
  }

  try {
    const response = await api.post('/ml/analyze-report', payload);
    return response.data;
  } catch (error) {
    console.warn('[MaMa Care] ML analysis unavailable.', error.message);
    return MOCK_AI_ANALYSIS;
  }
}

/**
 * Fetch a diet plan for a given trimester.
 * @param {object} payload - { trimester: number }
 */
export async function fetchDietPlan(payload = {}) {
  if (USE_MOCK) {
    return mockResponse(MOCK_DIET_PLAN, 800);
  }

  try {
    const response = await api.post('/ml/diet-plan', payload);
    return response.data;
  } catch (error) {
    console.warn('[MaMa Care] Diet plan unavailable.', error.message);
    return MOCK_DIET_PLAN;
  }
}

/**
 * Check symptoms and return advice.
 * @param {object} payload - { symptoms: string[] }
 */
export async function checkSymptoms(payload = {}) {
  if (USE_MOCK) {
    return mockResponse(MOCK_SYMPTOM_ADVICE, 800);
  }

  try {
    const response = await api.post('/ml/symptom-check', payload);
    return response.data;
  } catch (error) {
    console.warn('[MaMa Care] Symptom check unavailable.', error.message);
    return MOCK_SYMPTOM_ADVICE;
  }
}

export default api;
