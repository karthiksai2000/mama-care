import express from 'express';
import ChatMessage from '../models/ChatMessage.js';
import HealthTrend from '../models/HealthTrend.js';
import RiskAssessment from '../models/RiskAssessment.js';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1';

const listGeminiModels = async (apiKey) => {
  const response = await fetch(`${GEMINI_API_BASE}/models?key=${apiKey}`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini listModels failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return Array.isArray(data.models) ? data.models : [];
};

const callGemini = async (text, history, systemPrompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set');
  }

  const contextPart = systemPrompt
    ? [{ role: 'user', parts: [{ text: `Context for the assistant: ${systemPrompt}` }] }]
    : [];

  const payload = {
    contents: [
      ...contextPart,
      ...history.map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      })),
      { role: 'user', parts: [{ text }] },
    ],
  };

  const runRequest = async (model) => {
    const response = await fetch(
      `${GEMINI_API_BASE}/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) {
      throw new Error('Gemini returned an empty response');
    }

    return { reply: reply.trim(), model };
  };

  try {
    return await runRequest(GEMINI_MODEL);
  } catch (error) {
    if (!String(error.message || '').includes('404')) {
      throw error;
    }

    const models = await listGeminiModels(apiKey);
    const fallback = models.find((m) => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'));
    if (!fallback?.name) {
      throw error;
    }

    const modelName = fallback.name.replace('models/', '');
    return runRequest(modelName);
  }
};

router.get('/history', requireAuth, async (req, res) => {
  const limit = Number(req.query.limit || 30);
  const messages = await ChatMessage.find({ userId: req.user.id })
    .sort({ createdAt: 1 })
    .limit(limit);

  return res.json({ messages });
});

router.post('/message', requireAuth, async (req, res) => {
  const text = req.body?.text?.trim();
  if (!text) {
    return res.status(400).json({ message: 'Message text is required.' });
  }

  const userMessage = await ChatMessage.create({
    userId: req.user.id,
    role: 'user',
    text,
  });

  let replyText = process.env.CHATBOT_FALLBACK_REPLY || 'AI service is not configured yet.';
  let provider = 'fallback';
  let modelUsed = null;

  try {
    const [history, user, latestRisk, latestTrend] = await Promise.all([
      ChatMessage.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(10),
      User.findById(req.user.id).select('-passwordHash'),
      RiskAssessment.findOne({ userId: req.user.id }).sort({ createdAt: -1 }),
      HealthTrend.findOne({ userId: req.user.id }).sort({ week: -1 }),
    ]);

    const contextParts = [];
    if (user) {
      contextParts.push(`User name: ${user.name}.`);
      contextParts.push(`Pregnancy week: ${user.pregnancyWeek}.`);
      if (user.conditions?.length) {
        contextParts.push(`Conditions: ${user.conditions.join(', ')}.`);
      }
    }
    if (latestRisk) {
      contextParts.push(`Latest risk: ${latestRisk.level} (score ${latestRisk.score}).`);
    }
    if (latestTrend?.hemoglobin) {
      contextParts.push(`Latest hemoglobin: ${latestTrend.hemoglobin} g/dL.`);
    }
    if (latestTrend?.bp) {
      contextParts.push(`Latest blood pressure: ${latestTrend.bp}.`);
    }

    const systemPrompt = contextParts.length
      ? `You are a maternal health assistant. Use this user context to personalize answers. ${contextParts.join(' ')}`
      : 'You are a maternal health assistant. Ask clarifying questions when needed.';

    const result = await callGemini(text, history.reverse(), systemPrompt);
    replyText = result.reply;
    provider = 'gemini';
    modelUsed = result.model;
  } catch (error) {
    console.error('[MaMa Care] Gemini request failed:', error.message);
  }

  const botMessage = await ChatMessage.create({
    userId: req.user.id,
    role: 'bot',
    text: replyText,
  });

  return res.json({
    reply: botMessage.text,
    provider,
    model: modelUsed,
    messages: [userMessage, botMessage],
  });
});

export default router;
