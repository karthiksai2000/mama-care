import React, { useEffect, useMemo, useState } from 'react';
import { Baby, ChevronLeft, ChevronRight, Ruler, Scale, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { fetchBabyGrowth } from '../services/api';

const BabyGrowth = () => {
  const { user } = useAuth();
  const userWeek = user?.week || 24;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    let active = true;
    const loadGrowth = async () => {
      try {
        const data = await fetchBabyGrowth();
        if (!active) return;
        const list = data.items || [];
        setItems(list);
      } catch (error) {
        console.warn('[MaMa Care] Unable to load baby growth data.', error?.message || error);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadGrowth();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!items.length) return;
    const closestIdx = items.reduce(
      (best, w, i) => (Math.abs(w.week - userWeek) < Math.abs(items[best].week - userWeek) ? i : best),
      0
    );
    setIdx(closestIdx);
  }, [items, userWeek]);

  const data = useMemo(() => items[idx], [items, idx]);
  const fruitIcon = useMemo(() => {
    const map = {
      'Poppy Seed': '🌱',
      Lentil: '🫘',
      Raspberry: '🫐',
      Olive: '🫒',
      Lime: '🍋',
      Peach: '🍑',
      Avocado: '🥑',
      'Bell Pepper': '🫑',
      Banana: '🍌',
      Coconut: '🥥',
      Mango: '🥭',
      'Lettuce Head': '🥬',
      Eggplant: '🍆',
      Cucumber: '🥒',
      Orange: '🍊',
      Cantaloupe: '🍈',
      'Romaine Lettuce': '🥬',
      'Mini Watermelon': '🍉',
      'Small Pumpkin': '🎃',
    };

    const key = data?.fruitName || data?.fruit;
    return key && map[key] ? map[key] : data?.fruit || '•';
  }, [data]);
  const trimester = data?.week <= 13 ? '1st' : data?.week <= 27 ? '2nd' : '3rd';
  const progress = data ? ((data.week / 40) * 100).toFixed(0) : '0';

  if (loading) {
    return (
      <div className="growth-page">
        <h2><Baby size={24} /> Baby Growth</h2>
        <p className="subtitle">Loading baby growth data...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="growth-page">
        <h2><Baby size={24} /> Baby Growth</h2>
        <p className="subtitle">No growth data available yet.</p>
      </div>
    );
  }

  return (
    <div className="growth-page">
      <h2><Baby size={24} /> Baby Growth</h2>
      <p className="subtitle">See how your baby compares in size week by week</p>

      <div className="growth-nav">
        <button disabled={idx === 0} onClick={() => setIdx(i => i - 1)}><ChevronLeft size={20} /></button>
        <span className="growth-week-label">Week {data.week} - {trimester} Trimester</span>
        <button disabled={idx === items.length - 1} onClick={() => setIdx(i => i + 1)}><ChevronRight size={20} /></button>
      </div>

      <div className="growth-progress-bar">
        <div className="growth-fill" style={{ width: `${progress}%` }} />
        <span className="growth-pct">{progress}% complete</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div className="growth-card card" key={data.week} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
          <div className="growth-visual">
            <span className="growth-fruit">{fruitIcon}</span>
            <h3>{data.fruitName || data.fruit}</h3>
          </div>

          <div className="growth-measurements">
            <div className="growth-m"><Ruler size={16} /> <strong>Length:</strong> {data.length}</div>
            <div className="growth-m"><Scale size={16} /> <strong>Weight:</strong> {data.weight}</div>
          </div>

          <div className="growth-milestones">
            <h4><Heart size={16} /> Development Milestones</h4>
            <ul>
              {(data.dev || []).map((d, i) => <li key={i}>* {d}</li>)}
            </ul>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="growth-weeks-strip">
        {items.map((w, i) => (
          <button key={w.week} className={`week-dot ${i === idx ? 'active' : ''} ${w.week === Math.round(userWeek / 2) * 2 ? 'current' : ''}`} onClick={() => setIdx(i)} title={`Week ${w.week}`}>
            {w.week}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BabyGrowth;
