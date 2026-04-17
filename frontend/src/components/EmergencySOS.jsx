import React, { useState } from 'react';
import { Phone, X, MapPin, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EmergencySOS = () => {
  const [open, setOpen] = useState(false);

  const contacts = [
    { name: 'Emergency (112)', number: '112', icon: '🚨' },
    { name: 'Ambulance (108)', number: '108', icon: '🚑' },
    { name: 'My Doctor', number: '+91-9876543210', icon: '👩‍⚕️' },
    { name: 'Husband / Partner', number: '+91-9876543211', icon: '👨' },
  ];

  return (
    <>
      <motion.button
        className="sos-fab"
        onClick={() => setOpen(!open)}
        whileTap={{ scale: 0.9 }}
        animate={{ scale: open ? 1 : [1, 1.05, 1] }}
        transition={open ? {} : { repeat: Infinity, duration: 2 }}
        aria-label="Emergency SOS"
        title="Emergency SOS"
      >
        {open ? <X size={24} /> : <Phone size={24} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="sos-panel"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
          >
            <div className="sos-header">
              <AlertCircle size={20} />
              <h3>Emergency SOS</h3>
            </div>
            <div className="sos-contacts">
              {contacts.map((c, i) => (
                <a key={i} href={`tel:${c.number}`} className="sos-contact">
                  <span className="sos-icon">{c.icon}</span>
                  <div>
                    <strong>{c.name}</strong>
                    <span>{c.number}</span>
                  </div>
                  <Phone size={16} className="sos-call" />
                </a>
              ))}
            </div>
            <a
              href="https://www.google.com/maps/search/hospital+near+me"
              target="_blank"
              rel="noopener noreferrer"
              className="sos-map-link"
            >
              <MapPin size={16} /> Find Nearest Hospital
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EmergencySOS;
