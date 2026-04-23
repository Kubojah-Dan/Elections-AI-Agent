import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Calendar, MapPin, Bell, AlertCircle, Info, CheckCircle2, Clock } from 'lucide-react';

const ELECTION_DATES = [
  { state: 'Maharashtra', type: 'Legislative Assembly', date: '2024-11-20', deadline: '2024-10-25', status: 'upcoming' },
  { state: 'Jharkhand', type: 'Legislative Assembly', date: '2024-11-13', deadline: '2024-10-18', status: 'upcoming' },
  { state: 'Delhi', type: 'Legislative Assembly', date: '2025-02-15', deadline: '2025-01-20', status: 'scheduled' },
  { state: 'Bihar', type: 'Legislative Assembly', date: '2025-10-25', deadline: '2025-09-30', status: 'scheduled' },
  { state: 'West Bengal', type: 'Legislative Assembly', date: '2026-05-10', deadline: '2026-04-15', status: 'scheduled' },
  { state: 'Tamil Nadu', type: 'Legislative Assembly', date: '2026-05-20', deadline: '2026-04-25', status: 'scheduled' },
  { state: 'Kerala', type: 'Legislative Assembly', date: '2026-05-15', deadline: ' केरल-04-20', status: 'scheduled' },
];

export default function CalendarPage() {
  const { t, state } = useApp();
  const [selectedState, setSelectedState] = useState('');
  const [reminders, setReminders] = useState({});

  const filteredElections = selectedState 
    ? ELECTION_DATES.filter(e => e.state === selectedState)
    : ELECTION_DATES;

  const toggleReminder = (id) => {
    setReminders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getDaysRemaining = (dateStr) => {
    const diff = new Date(dateStr) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="content-area">
      <div className="max-w-2xl mx-auto px-4 pt-4">
        
        <div className="mb-6">
          <h1 className="section-header">Election Calendar</h1>
          {state.language !== 'en' && (
            <p className="text-xs font-bold text-india-saffron -mt-1 mb-1">
              {t('election_calendar')}
            </p>
          )}
          <p className="section-sub">{t('calendar_sub')}</p>
        </div>

        {/* State Selector */}
        <div className="card p-4 mb-6 bg-india-navy text-white" style={{ background: 'var(--gradient-navy)' }}>
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={18} className="text-india-saffron" />
            <span className="font-semibold">{t('select_your_state')}</span>
          </div>
          <select 
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-india-saffron transition-all"
            style={{ color: 'white' }}
          >
            <option value="" className="text-near-black">{t('all_india_view')}</option>
            {[...new Set(ELECTION_DATES.map(e => e.state))].sort().map(s => (
              <option key={s} value={s} className="text-near-black">{s}</option>
            ))}
          </select>
        </div>

        {/* Calendar Feed */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredElections.map((election, idx) => {
              const daysLeft = getDaysRemaining(election.date);
              const deadlineLeft = getDaysRemaining(election.deadline);
              const id = `${election.state}-${election.date}`;

              return (
                <motion.div
                  key={id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="card overflow-hidden"
                >
                  <div className="india-stripe" />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-off-white px-2 py-0.5 rounded text-mid-gray border border-light-gray">
                            {election.type}
                          </span>
                          {daysLeft < 30 && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-600 px-2 py-0.5 rounded border border-red-200 flex items-center gap-1">
                              <Clock size={10} /> {t('critical')}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-india-navy">{election.state}</h3>
                      </div>
                      <button 
                        onClick={() => toggleReminder(id)}
                        className={`p-2 rounded-full transition-all ${reminders[id] ? 'bg-india-saffron text-white' : 'bg-off-white text-mid-gray'}`}
                      >
                        <Bell size={18} fill={reminders[id] ? 'currentColor' : 'none'} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-off-white p-3 rounded-xl border border-light-gray">
                        <div className="text-[10px] font-bold text-mid-gray uppercase mb-1">{t('polling_day')}</div>
                        <div className="text-sm font-bold text-near-black">{new Date(election.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                        <div className="text-[10px] text-india-green font-bold mt-1">{daysLeft} {t('days_to_go')}</div>
                      </div>
                      <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                        <div className="text-[10px] font-bold text-amber-800 uppercase mb-1">{t('reg_deadline')}</div>
                        <div className="text-sm font-bold text-amber-900">{new Date(election.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                        <div className="text-[10px] text-amber-700 font-bold mt-1">
                          {deadlineLeft > 0 ? `${deadlineLeft} ${t('days_left')}` : t('deadline_passed')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-3 border-t border-light-gray">
                      <div className="flex items-center gap-1.5 text-mid-gray">
                        <Info size={14} />
                        <span>{t('source_eci_calendar')}</span>
                      </div>
                      <button className="text-india-navy font-bold flex items-center gap-1 hover:underline">
                        {t('view_details')} <Clock size={12} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredElections.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-off-white rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-light-gray" />
              </div>
              <p className="text-mid-gray">{t('no_elections_found')}</p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 p-4 rounded-xl bg-blue-50 border border-blue-100 flex gap-3">
          <Info className="text-india-navy flex-shrink-0" size={20} />
          <div>
            <h4 className="text-sm font-bold text-india-navy mb-1">{t('important_note')}</h4>
            <p className="text-xs text-india-navy/70 leading-relaxed">
              {t('calendar_disclaimer')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
