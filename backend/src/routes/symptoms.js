import express from 'express';
import Symptom from '../models/Symptom.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const buildAssessment = (symptoms) => {
  const maxSeverity = Math.max(...symptoms.map((s) => s.severity), 0);
  const totalScore = symptoms.reduce((acc, s) => acc + s.severity, 0);

  let level = 'mild';
  let message = 'These are common pregnancy symptoms that are usually manageable.';
  let action = 'Try rest and home remedies. Mention at your next prenatal visit.';

  if (maxSeverity >= 3 || totalScore >= 6) {
    level = 'urgent';
    message = 'These symptoms require immediate medical attention.';
    action = 'Please contact your doctor or visit the nearest hospital right away.';
  } else if (maxSeverity >= 2 || totalScore >= 3) {
    level = 'moderate';
    message = 'These symptoms should be discussed with your doctor soon.';
    action = 'Schedule an appointment within 24-48 hours. Monitor symptoms closely.';
  }

  return { level, message, action };
};

router.get('/', requireAuth, async (req, res) => {
  const symptoms = await Symptom.find({}).sort({ category: 1, severity: -1, label: 1 });
  return res.json({ symptoms });
});

router.post('/analyze', requireAuth, async (req, res) => {
  const keys = Array.isArray(req.body?.symptomKeys) ? req.body.symptomKeys : [];
  if (!keys.length) {
    return res.status(400).json({ message: 'symptomKeys is required.' });
  }

  const symptoms = await Symptom.find({ key: { $in: keys } });
  if (!symptoms.length) {
    return res.status(404).json({ message: 'No matching symptoms found.' });
  }

  const assessment = buildAssessment(symptoms);
  return res.json({
    ...assessment,
    symptoms,
  });
});

export default router;
