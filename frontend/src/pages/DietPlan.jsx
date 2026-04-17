import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Apple, Coffee, Salad, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchDietPlanByWeek } from '../services/api';

const DietPlan = () => {
  const { user } = useAuth();
  const userWeek = user?.week || 24;
  const trimester = userWeek <= 13 ? 1 : userWeek <= 27 ? 2 : 3;
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadPlan = async () => {
      try {
        const data = await fetchDietPlanByWeek({ trimester, week: userWeek });
        if (active) setPlan(data.plan || null);
      } catch (error) {
        console.warn('[MaMa Care] Unable to load diet plan.', error?.message || error);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadPlan();
    return () => {
      active = false;
    };
  }, [trimester, userWeek]);

  const iconMap = useMemo(() => ({
    breakfast: <Coffee size={20} />,
    'mid-morning': <Apple size={20} />,
    lunch: <Salad size={20} />,
    dinner: <Moon size={20} />,
  }), []);

  const meals = plan?.meals || [];

  return (
    <div className="diet-page">
      <h2>Your Personalized Diet Plan 🥗</h2>
      <p className="subtitle">Trimester {trimester} - Week {userWeek}</p>

      <div className="meals-grid">
        {loading && (
          <motion.div className="meal-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="meal-header">
              <Coffee size={20} />
              <h4>Loading plan...</h4>
            </div>
          </motion.div>
        )}
        {!loading && meals.length === 0 && (
          <motion.div className="meal-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="meal-header">
              <Coffee size={20} />
              <h4>No diet plan available yet.</h4>
            </div>
          </motion.div>
        )}
        {meals.map((meal, idx) => (
          <motion.div
            key={idx}
            className="meal-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="meal-header">
              {iconMap[meal.time?.toLowerCase().includes('breakfast') ? 'breakfast'
                : meal.time?.toLowerCase().includes('mid') ? 'mid-morning'
                  : meal.time?.toLowerCase().includes('lunch') ? 'lunch' : 'dinner'] || <Coffee size={20} />}
              <h4>{meal.time}</h4>
            </div>
            <ul>
              {meal.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <section className="nutrition-tips">
        <h3>Nutrition Tips</h3>
        {plan?.tips?.length ? (
          <ul>
            {plan.tips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        ) : (
          <p>No tips available yet.</p>
        )}
      </section>
    </div>
  );
};

export default DietPlan;
