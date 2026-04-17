const AI_BASE_URL = process.env.ML_BASE_URL || 'http://localhost:8001';
const AI_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS || 10000);

const postJson = async (path, payload = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    const response = await fetch(`${AI_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload || {}),
      signal: controller.signal,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`AI service ${path} failed: ${response.status} ${text}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
};

export const fetchDietPlanAI = async (payload) => postJson('/diet/plan', payload);
export const fetchSymptomAdviceAI = async (payload) => postJson('/symptoms/analyze', payload);
