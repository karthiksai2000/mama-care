import React, { useMemo, useState, useEffect } from 'react';
import { CalendarDays, Plus, Clock, User, Trash2, MapPin, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAppointments, addAppointment, deleteAppointment } from '../services/api';

const TYPES = ['Regular Checkup', 'Ultrasound / Scan', 'Lab Test', 'Vaccination', 'Emergency', 'Other'];

const Appointments = () => {
  const [appts, setAppts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: '', time: '', doctor: '', type: TYPES[0], location: '', notes: '' });

  useEffect(() => {
    let active = true;

    const loadAppointments = async () => {
      try {
        const data = await fetchAppointments();
        if (active) setAppts(data.appointments || []);
      } catch (error) {
        console.warn('[MaMa Care] Unable to load appointments.', error?.message || error);
      }
    };

    loadAppointments();

    return () => {
      active = false;
    };
  }, []);

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const addAppt = async (e) => {
    e.preventDefault();
    try {
      const data = await addAppointment(form);
      setAppts(prev => [...prev, data.appointment]);
      setForm({ date: '', time: '', doctor: '', type: TYPES[0], location: '', notes: '' });
      setShowForm(false);
    } catch (error) {
      console.warn('[MaMa Care] Unable to add appointment.', error?.message || error);
    }
  };

  const remove = async (id) => {
    try {
      await deleteAppointment(id);
      setAppts(prev => prev.filter(a => a._id !== id && a.id !== id));
    } catch (error) {
      console.warn('[MaMa Care] Unable to delete appointment.', error?.message || error);
    }
  };

  const now = new Date();
  const upcoming = appts
    .filter(a => new Date(a.date) >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const past = appts
    .filter(a => new Date(a.date) < now)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const calendar = useMemo(() => {
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDay; i += 1) cells.push(null);
    for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);
    while (cells.length % 7 !== 0) cells.push(null);

    const apptDays = new Set(appts.map((a) => new Date(a.date).getDate()));
    return { year, month, cells, apptDays };
  }, [appts, now]);

  const ApptCard = ({ a, isPast }) => (
    <motion.div className={`appt-card card ${isPast ? 'past' : ''}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="appt-date-badge">
        <span className="appt-day">{new Date(a.date).toLocaleDateString('en', { day: 'numeric' })}</span>
        <span className="appt-month">{new Date(a.date).toLocaleDateString('en', { month: 'short' })}</span>
      </div>
      <div className="appt-info">
        <h4>{a.type} {isPast && <CheckCircle size={14} className="past-check" />}</h4>
        <p><User size={14} /> {a.doctor}</p>
        <p><Clock size={14} /> {a.time}</p>
        {a.location && <p><MapPin size={14} /> {a.location}</p>}
        {a.notes && <p className="appt-notes">📝 {a.notes}</p>}
      </div>
      <button className="appt-del" onClick={() => remove(a._id || a.id)}><Trash2 size={14} /></button>
    </motion.div>
  );

  return (
    <div className="appt-page">
      <div className="appt-header">
        <div>
          <h2><CalendarDays size={24} /> Appointments</h2>
          <p className="subtitle">Manage your prenatal visit schedule</p>
        </div>
        <button className="appt-add-btn" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> New Appointment
        </button>
      </div>

      <div className="appt-grid">
        <div className="appt-calendar card">
          <div className="calendar-header">
            <h3>Calendar</h3>
            <span>{now.toLocaleDateString('en', { month: 'long', year: 'numeric' })}</span>
          </div>
          <div className="calendar-week">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="calendar-grid">
            {calendar.cells.map((cell, idx) => (
              <div key={idx} className={`calendar-cell ${cell ? '' : 'empty'} ${cell && calendar.apptDays.has(cell) ? 'has-appt' : ''} ${cell === now.getDate() ? 'today' : ''}`}>
                {cell || ''}
              </div>
            ))}
          </div>
        </div>

        <div className="appt-reminders card">
          <h3>Upcoming reminders</h3>
          <div className="reminder-row">
            <span>Vaccines</span>
            <strong>Tetanus booster · Week 28</strong>
          </div>
          <div className="reminder-row">
            <span>Scan</span>
            <strong>Growth scan · Week 32</strong>
          </div>
          <div className="reminder-row">
            <span>Check-in</span>
            <strong>Blood pressure review · 2 weeks</strong>
          </div>
          <button className="ghost-btn" type="button">Add reminder</button>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form className="appt-form card" onSubmit={addAppt} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <div className="appt-form-grid">
              <div className="form-group">
                <label>Date</label>
                <input type="date" value={form.date} onChange={e => update('date', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input type="time" value={form.time} onChange={e => update('time', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Doctor</label>
                <input placeholder="Dr. Name" value={form.doctor} onChange={e => update('doctor', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select value={form.type} onChange={e => update('type', e.target.value)}>
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Location</label>
                <input placeholder="Hospital / Clinic" value={form.location} onChange={e => update('location', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <input placeholder="Optional notes" value={form.notes} onChange={e => update('notes', e.target.value)} />
              </div>
            </div>
            <div className="appt-form-actions">
              <button type="submit" className="appt-save-btn">Save Appointment</button>
              <button type="button" className="appt-cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <section className="appt-section">
        <h3>📅 Upcoming ({upcoming.length})</h3>
        {upcoming.length === 0 ? <p className="no-appts">No upcoming appointments</p> : upcoming.map(a => <ApptCard key={a._id || a.id} a={a} />)}
      </section>

      <section className="appt-section">
        <h3>✅ Past ({past.length})</h3>
        {past.length === 0 ? <p className="no-appts">No past appointments</p> : past.map(a => <ApptCard key={a._id || a.id} a={a} isPast />)}
      </section>
    </div>
  );
};

export default Appointments;
