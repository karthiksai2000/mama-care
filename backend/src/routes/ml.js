import express from 'express';
import { analyzeReportMock, dietPlanMock, symptomAdviceMock } from '../services/mlMock.js';
import { fetchDietPlanAI, fetchSymptomAdviceAI } from '../services/aiService.js';

const router = express.Router();

router.post('/analyze-report', (req, res) => {
  const result = analyzeReportMock();
  return res.json(result);
});

router.post('/diet-plan', async (req, res) => {
  const { trimester } = req.body || {};

  try {
    const aiResult = await fetchDietPlanAI(req.body || {});
    const fallback = dietPlanMock(trimester || 2);
    return res.json({
      ...fallback,
      recommendedPlan: aiResult?.RecommendedDietPlan,
      probabilities: aiResult?.Probabilities,
      source: 'ai',
    });
  } catch (error) {
    console.warn('[MaMa Care] AI diet plan unavailable.', error?.message || error);
    const fallback = dietPlanMock(trimester || 2);
    return res.json({ ...fallback, source: 'mock' });
  }
});

router.post('/symptom-check', async (req, res) => {
  const { symptoms } = req.body || {};

  try {
    const aiResult = await fetchSymptomAdviceAI(req.body || {});
    const fallback = symptomAdviceMock(symptoms || []);
    const urgency = String(aiResult?.urgency || '').toLowerCase();
    const shouldConsultDoctor = ['high', 'emergency'].includes(urgency) || fallback.shouldConsultDoctor;
    const advice = Array.isArray(aiResult?.advice)
      ? aiResult.advice
      : aiResult?.advice
        ? [aiResult.advice]
        : fallback.advice;

    return res.json({
      symptoms: symptoms || [],
      advice,
      shouldConsultDoctor,
      specialization: aiResult?.specialization,
      urgency: aiResult?.urgency,
      source: 'ai',
    });
  } catch (error) {
    console.warn('[MaMa Care] AI symptom check unavailable.', error?.message || error);
    const fallback = symptomAdviceMock(symptoms || []);
    return res.json({ ...fallback, source: 'mock' });
  }
});

export default router;
