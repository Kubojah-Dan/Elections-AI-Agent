import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Calendar, MapPin, Bell, AlertCircle, Info, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

const ELECTION_DATES = [
  { state: 'Maharashtra', type: 'Legislative Assembly', date: '2024-11-20', deadline: '2024-10-25', status: 'upcoming' },
  { state: 'Jharkhand', type: 'Legislative Assembly', date: '2024-11-13', deadline: '2024-10-18', status: 'upcoming' },
  { state: 'Delhi', type: 'Legislative Assembly', date: '2025-02-15', deadline: '2025-01-20', status: 'scheduled' },
  { state: 'Bihar', type: 'Legislative Assembly', date: '2025-10-25', deadline: '2025-09-30', status: 'scheduled' },
  { state: 'West Bengal', type: 'Legislative Assembly', date: '2026-05-10', deadline: '2026-04-15', status: 'scheduled' },
  { state: 'Tamil Nadu', type: 'Legislative Assembly', date: '2026-05-20', deadline: '2026-04-25', status: 'scheduled' },
  { state: 'Kerala', type: 'Legislative Assembly', date: '2026-05-15', deadline: '2026-04-20', status: 'scheduled' },
  { state: 'Assam', type: 'Legislative Assembly', date: '2026-04-12', deadline: '2026-03-15', status: 'scheduled' },
  { state: 'Puducherry', type: 'Legislative Assembly', date: '2026-05-05', deadline: '2026-04-10', status: 'scheduled' },
  { state: 'Uttar Pradesh', type: 'Legislative Assembly', date: '2027-02-10', deadline: '2027-01-15', status: 'scheduled' },
  { state: 'Punjab', type: 'Legislative Assembly', date: '2027-02-20', deadline: '2027-01-25', status: 'scheduled' },
  { state: 'Uttarakhand', type: 'Legislative Assembly', date: '2027-02-15', deadline: '2027-01-20', status: 'scheduled' },
  { state: 'Manipur', type: 'Legislative Assembly', date: '2027-03-05', deadline: '2027-02-10', status: 'scheduled' },
  { state: 'Goa', type: 'Legislative Assembly', date: '2027-02-25', deadline: '2027-01-30', status: 'scheduled' },
  { state: 'Gujarat', type: 'Legislative Assembly', date: '2027-12-05', deadline: '2027-11-10', status: 'scheduled' },
  { state: 'Himachal Pradesh', type: 'Legislative Assembly', date: '2027-11-15', deadline: '2027-10-20', status: 'scheduled' },
];

export default function CalendarPage() {
  const { t, state } = useApp();
  const [selectedState, setSelectedState] = useState('');
  const [reminders, setReminders] = useState({});

  const filteredElections = selectedState 
    ? ELECTION_DATES.filter(e => e.state === selectedState)
    : ELECTION_DATES;

  const toggleReminder = (id, stateName) => {
    const isAdding = !reminders[id];
    setReminders(prev => ({ ...prev, [id]: isAdding }));
    if (isAdding) {
      alert(`🔔 Reminder Set: We will notify you when ${stateName} elections are near!`);
    }
  };

  const getDaysRemaining = (dateStr) => {
    const diff = new Date(dateStr) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="content-area">
      <div className="max-w-2xl mx-auto px-4 pt-4">
        
        <div className="mb-6 text-center lg:text-left">
          <h1 className="section-header">Election Calendar</h1>
          {state.language !== 'en' && (
            <p className="text-xs font-bold text-india-saffron -mt-1 mb-1">
              {t('election_calendar')}
            </p>
          )}
          <p className="section-sub">{t('calendar_sub')}</p>
        </div>

        {/* State Selector */}
        <div className="card p-5 mb-6 bg-india-navy text-white shadow-xl overflow-hidden" style={{ background: 'var(--gradient-navy)' }}>
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={20} className="text-india-saffron" />
            <span className="font-bold text-lg">{t('select_your_state')}</span>
          </div>
          <div className="relative">
            <select 
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-india-saffron transition-all appearance-none"
              style={{ color: 'white' }}
            >
              <option value="" style={{ color: 'black' }}>{t('all_india_view')}</option>
              {[...new Set(ELECTION_DATES.map(e => e.state))].sort().map(s => (
                <option key={s} value={s} style={{ color: 'black' }}>{s}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-60">
              <Clock size={16} />
            </div>
          </div>
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="card overflow-hidden border-l-4 border-l-india-saffron"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-widest bg-off-white px-2.5 py-1 rounded-md text-mid-gray border border-light-gray">
                            {election.type}
                          </span>
                          {daysLeft < 60 && (
                            <span className="text-[10px] font-bold uppercase tracking-widest bg-red-50 text-red-600 px-2.5 py-1 rounded-md border border-red-100 flex items-center gap-1">
                              <Bell size={10} className="animate-bounce" /> {t('critical')}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-india-navy dark:text-white">{election.state}</h3>
                      </div>
                      <button 
                        onClick={() => toggleReminder(id, election.state)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${reminders[id] ? 'bg-india-saffron text-white' : 'bg-off-white text-mid-gray hover:bg-light-gray'}`}
                      >
                        <Bell size={20} fill={reminders[id] ? 'currentColor' : 'none'} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                      <div className="bg-off-white dark:bg-india-navy/5 p-4 rounded-2xl border border-light-gray">
                        <div className="text-[10px] font-bold text-mid-gray uppercase tracking-wider mb-2">{t('polling_day')}</div>
                        <div className="text-base font-bold text-near-black dark:text-white">{new Date(election.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                        <div className="text-xs text-india-green font-bold mt-1.5 flex items-center gap-1">
                           <Clock size={12} /> {daysLeft} {t('days_to_go')}
                        </div>
                      </div>
                      <div className="bg-amber-50/50 dark:bg-amber-900/10 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/20">
                        <div className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-2">{t('reg_deadline')}</div>
                        <div className="text-base font-bold text-amber-900 dark:text-amber-200">{new Date(election.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                        <div className="text-xs text-amber-700 dark:text-amber-500 font-bold mt-1.5">
                          {deadlineLeft > 0 ? `${deadlineLeft} ${t('days_left')}` : t('deadline_passed')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-4 border-t border-light-gray">
                      <div className="flex items-center gap-2 text-mid-gray">
                        <Info size={14} className="text-india-navy dark:text-blue-400" />
                        <span>{t('source_eci_calendar')}</span>
                      </div>
                      <button 
                        onClick={() => window.open('https://elections24.eci.gov.in/', '_blank')}
                        className="text-india-navy dark:text-blue-400 font-bold flex items-center gap-1.5 hover:underline group"
                      >
                        {t('view_details')} <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredElections.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-off-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <AlertCircle size={40} className="text-light-gray" />
              </div>
              <p className="text-mid-gray font-medium">{t('no_elections_found')}</p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-10 p-5 rounded-2xl bg-off-white dark:bg-india-navy/10 border border-light-gray flex gap-4">
          <Info className="text-india-navy dark:text-blue-400 flex-shrink-0 mt-0.5" size={24} />
          <div>
            <h4 className="text-sm font-bold text-near-black dark:text-white mb-1.5">{t('important_note')}</h4>
            <p className="text-xs text-mid-gray dark:text-white/70 leading-relaxed">
              {t('calendar_disclaimer', 'Dates are subject to official notifications by the Election Commission of India. Please verify with official sources periodically as schedules may be updated.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
