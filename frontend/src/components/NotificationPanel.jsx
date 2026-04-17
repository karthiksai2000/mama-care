import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL_NOTIFICATIONS = [
  { id: 1, text: '💊 Time to take your iron supplement', time: '10 min ago', read: false, type: 'medicine' },
  { id: 2, text: '💧 Reminder: Drink a glass of water', time: '30 min ago', read: false, type: 'health' },
  { id: 3, text: '📅 Upcoming: Ultrasound scan on Feb 20', time: '1 hour ago', read: false, type: 'appointment' },
  { id: 4, text: '🚶‍♀️ Daily walk reminder — 15 minutes', time: '2 hours ago', read: true, type: 'health' },
  { id: 5, text: '👶 Week 24: Your baby is the size of a mango!', time: '5 hours ago', read: true, type: 'milestone' },
  { id: 6, text: '🍎 Diet tip: Add iron-rich foods like spinach today', time: '1 day ago', read: true, type: 'diet' },
];

const NotificationPanel = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const ref = useRef(null);

  const unread = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const markRead = (id) => setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifications(p => p.map(n => ({ ...n, read: true })));
  const remove = (id) => setNotifications(p => p.filter(n => n.id !== id));

  return (
    <div className="notif-wrapper" ref={ref}>
      <button className="nav-icon-btn notif-bell" onClick={() => setOpen(!open)} aria-label="Notifications">
        <Bell size={20} />
        {unread > 0 && <span className="notif-badge">{unread}</span>}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div className="notif-panel" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="notif-header">
              <h4>Notifications</h4>
              {unread > 0 && <button className="mark-all-btn" onClick={markAllRead}><Check size={14} /> Mark all read</button>}
            </div>
            <div className="notif-list">
              {notifications.length === 0 ? (
                <p className="notif-empty">No notifications</p>
              ) : (
                notifications.map(n => (
                  <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`} onClick={() => markRead(n.id)}>
                    <p className="notif-text">{n.text}</p>
                    <div className="notif-meta">
                      <span>{n.time}</span>
                      <button className="notif-del" onClick={(e) => { e.stopPropagation(); remove(n.id); }}><Trash2 size={12} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationPanel;
