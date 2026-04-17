import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ title, value, icon, color = '#008080' }) => {
  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="card-icon"
        style={{ background: `${color}15`, color: color }}
      >
        {icon}
      </div>
      <div className="card-content">
        <h4>{title}</h4>
        <p style={{ color }}>{value}</p>
      </div>
    </motion.div>
  );
};

export default Card;
