import express from 'express';
import RiskFactor from '../models/RiskFactor.js';
import RiskAssessment from '../models/RiskAssessment.js';
import { requireAuth } from '../middleware/auth.js';
import User from '../models/User.js';
import { sendEmail } from '../services/emailService.js';
import { buildRiskAlertEmail } from '../services/emailTemplates.js';

const router = express.Router();

const buildRecommendations = (level) => {
  const recs = {
    low: [
      'Continue regular prenatal visits',
      'Maintain a balanced diet',
      'Stay active with light exercises',
      'Track baby kicks daily',
    ],
    medium: [
      'Schedule more frequent checkups',
      'Monitor blood pressure weekly',
      'Take prescribed iron supplements',
      'Reduce stress and rest adequately',
      'Avoid standing for long periods',
    ],
    high: [
      'Consult your OB-GYN immediately',
      'Weekly monitoring recommended',
      'Consider hospital-based delivery plan',
      'Keep emergency contacts ready',
      'Follow strict medication schedule',
      'Consider bed rest if advised',
    ],
  };

  return recs[level] || [];
};

const calculateRisk = ({ age, systolic, diastolic, hemoglobin, weight, height, factors }) => {
  let score = 0;
  const bmi = weight && height ? Number(weight) / ((Number(height) / 100) ** 2) : null;

  if (age < 18 || age > 35) score += 15;
  else if (age > 30) score += 5;

  if (systolic > 140 || diastolic > 90) score += 25;
  else if (systolic > 130 || diastolic > 85) score += 10;

  if (hemoglobin < 8) score += 25;
  else if (hemoglobin < 10) score += 15;
  else if (hemoglobin < 11) score += 5;

  if (bmi) {
    if (bmi > 35) score += 15;
    else if (bmi > 30) score += 10;
    else if (bmi < 18.5) score += 10;
  }

  score += (factors?.length || 0) * 8;

  const level = score >= 40 ? 'high' : score >= 20 ? 'medium' : 'low';

  return { score, level, bmi: bmi ? Number(bmi.toFixed(1)) : null };
};

router.get('/factors', requireAuth, async (req, res) => {
  const factors = await RiskFactor.find({}).sort({ label: 1 });
  return res.json({ factors });
});

router.get('/history', requireAuth, async (req, res) => {
  const history = await RiskAssessment.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .limit(10);

  return res.json({ history });
});

router.post('/assess', requireAuth, async (req, res) => {
  const { age, systolic, diastolic, hemoglobin, weight, height, factors } = req.body || {};
  const numeric = {
    age: Number(age),
    systolic: Number(systolic),
    diastolic: Number(diastolic),
    hemoglobin: Number(hemoglobin),
    weight: weight !== undefined ? Number(weight) : undefined,
    height: height !== undefined ? Number(height) : undefined,
  };

  if (!numeric.age || !numeric.systolic || !numeric.diastolic || !numeric.hemoglobin) {
    return res.status(400).json({ message: 'Age, blood pressure, and hemoglobin are required.' });
  }

  const assessment = calculateRisk({
    age: numeric.age,
    systolic: numeric.systolic,
    diastolic: numeric.diastolic,
    hemoglobin: numeric.hemoglobin,
    weight: numeric.weight,
    height: numeric.height,
    factors,
  });
  const recommendations = buildRecommendations(assessment.level);

  const record = await RiskAssessment.create({
    userId: req.user.id,
    score: assessment.score,
    level: assessment.level,
    bmi: assessment.bmi,
    inputs: {
      age: numeric.age,
      systolic: numeric.systolic,
      diastolic: numeric.diastolic,
      hemoglobin: numeric.hemoglobin,
      weight: numeric.weight,
      height: numeric.height,
    },
    factors: factors || [],
    recommendations,
  });

  if (['medium', 'high'].includes(assessment.level)) {
    try {
      const user = await User.findById(req.user.id).select('name email');
      if (user?.email) {
        const emailPayload = buildRiskAlertEmail({
          name: user.name,
          level: assessment.level,
          recommendations,
        });
        const info = await sendEmail({
          to: user.email,
          subject: emailPayload.subject,
          text: emailPayload.text,
          html: emailPayload.html,
        });

        record.alertSentAt = new Date();
        await record.save();

        console.log('[MaMa Care] Risk alert email sent:', {
          to: user.email,
          level: assessment.level,
          messageId: info?.messageId,
        });
      }
    } catch (error) {
      console.error('[MaMa Care] Risk alert email failed:', error);
    }
  }

  return res.json({
    assessment: {
      score: record.score,
      level: record.level,
      bmi: record.bmi,
      recommendations: record.recommendations,
      createdAt: record.createdAt,
    },
  });
});

export default router;
