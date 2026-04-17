import React, { useState } from 'react';
import { fetchDietPlan } from '../services/api';

const DietPlan = () => {
  const [aiForm, setAiForm] = useState({
    age: '',
    bmi: '',
    activity: 'Moderate',
    diabetes: 'No',
    hypertension: 'No',
  });
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const submitAI = async (event) => {
    event.preventDefault();
    setAiError('');
    setAiResult(null);

    if (!aiForm.age || !aiForm.bmi || !aiForm.activity) {
      setAiError('Age, BMI, and Activity Level are required.');
      return;
    }

    setAiLoading(true);
    try {
      const payload = {
        Age: Number(aiForm.age),
        BMI: Number(aiForm.bmi),
        ActivityLevel: aiForm.activity,
        Diabetes: aiForm.diabetes,
        Hypertension: aiForm.hypertension,
      };
      const data = await fetchDietPlan(payload);
      setAiResult(data);
    } catch (error) {
      console.warn('[MaMa Care] AI diet plan unavailable.', error?.message || error);
      setAiError('Unable to generate AI diet plan right now.');
    } finally {
      setAiLoading(false);
    }
  };

  const recommendedPlan =
    aiResult?.RecommendedDietPlan || aiResult?.recommendedPlan || '—';
  const probabilities =
    aiResult?.Probabilities || aiResult?.probabilities || null;
  const pregnancyFoods =
    aiResult?.PregnancyFoods || aiResult?.pregnancyFoods || [];

  return (
    <div className="diet-page">
      <h2>Your Personalized Diet Plan 🥗</h2>
      <p className="subtitle">AI-based recommendation from your inputs</p>

      <form className="diet-ai-form card" onSubmit={submitAI}>
        <div className="diet-ai-grid">
          <label>
            Age
            <input
              type="number"
              min="14"
              max="60"
              value={aiForm.age}
              onChange={(event) => setAiForm((prev) => ({ ...prev, age: event.target.value }))}
              placeholder="e.g. 26"
              required
            />
          </label>
          <label>
            BMI
            <input
              type="number"
              step="0.1"
              min="14"
              max="45"
              value={aiForm.bmi}
              onChange={(event) => setAiForm((prev) => ({ ...prev, bmi: event.target.value }))}
              placeholder="e.g. 23.8"
              required
            />
          </label>
          <label>
            Activity Level
            <select
              value={aiForm.activity}
              onChange={(event) => setAiForm((prev) => ({ ...prev, activity: event.target.value }))}
            >
              <option>Sedentary</option>
              <option>Light</option>
              <option>Moderate</option>
              <option>Active</option>
            </select>
          </label>
          <label>
            Diabetes
            <select
              value={aiForm.diabetes}
              onChange={(event) => setAiForm((prev) => ({ ...prev, diabetes: event.target.value }))}
            >
              <option>No</option>
              <option>Yes</option>
            </select>
          </label>
          <label>
            Hypertension
            <select
              value={aiForm.hypertension}
              onChange={(event) => setAiForm((prev) => ({ ...prev, hypertension: event.target.value }))}
            >
              <option>No</option>
              <option>Yes</option>
            </select>
          </label>
        </div>

        <button type="submit" className="diet-ai-btn">
          {aiLoading ? 'Generating...' : 'Generate AI Diet Plan'}
        </button>
        {aiError && <p className="diet-ai-error">{aiError}</p>}
      </form>

      <div className="diet-ai-result card">
        <h3>AI Recommendation</h3>
        <p className="diet-ai-main">{recommendedPlan}</p>

        {probabilities && (
          <div className="diet-ai-probs">
            {Object.entries(probabilities).map(([key, value]) => (
              <div key={key} className="diet-ai-prob">
                <span>{key}</span>
                <span>{Math.round(value * 100)}%</span>
              </div>
            ))}
          </div>
        )}

        {pregnancyFoods.length > 0 && (
          <div className="diet-ai-foods">
            <h4>Pregnancy-Friendly Foods</h4>
            <ul>
              {pregnancyFoods.map((food) => (
                <li key={food}>{food}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DietPlan;
