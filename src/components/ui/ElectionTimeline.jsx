import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, FileSignature, FileSearch, Undo2, Mic2, VolumeX, Vote, FileDigit, Landmark } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ElectionTimeline() {
  const { t } = useApp();
  const [expandedStep, setExpandedStep] = useState(null);

  const steps = [
    { id: 1, key: 'announcement', icon: <Megaphone size={20} />, color: '#0D2C6B' },
    { id: 2, key: 'nomination',   icon: <FileSignature size={20} />, color: '#1a4099' },
    { id: 3, key: 'scrutiny',     icon: <FileSearch size={20} />, color: '#2a5ab0' },
    { id: 4, key: 'withdrawal',   icon: <Undo2 size={20} />, color: '#3a6ac0' },
    { id: 5, key: 'campaign',     icon: <Mic2 size={20} />, color: '#FF9933' },
    { id: 6, key: 'silence_period', icon: <VolumeX size={20} />, color: '#6B6B6B' },
    { id: 7, key: 'polling_day',  icon: <Vote size={20} />, color: '#138808' },
    { id: 8, key: 'counting_day', icon: <FileDigit size={20} />, color: '#0D2C6B' },
    { id: 9, key: 'govt_formation', icon: <Landmark size={20} />, color: '#FF9933' },
  ];

  function toggle(id) {
    setExpandedStep(expandedStep === id ? null : id);
  }

  return (
    <div className="relative" role="list" aria-label="Election cycle timeline">
      {/* Vertical line */}
      <div
        className="absolute left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-india-navy to-off-white"
        aria-hidden="true"
      />

      <div className="space-y-2">
        {steps.map((step, idx) => {
          const isOpen = expandedStep === step.id;
          return (
            <div key={step.id} role="listitem">
              <button
                className="w-full flex items-start gap-4 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-india-navy rounded-lg"
                onClick={() => toggle(step.id)}
                aria-expanded={isOpen}
                aria-controls={`timeline-detail-${step.id}`}
              >
                {/* Circle node */}
                <div
                  className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full border-2 border-white flex items-center justify-center shadow-card text-xl"
                  style={{ background: step.color }}
                >
                  <span role="img" aria-hidden="true">{step.icon}</span>
                </div>

                {/* Step info */}
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-mid-gray">{t('cycle_step')} {idx + 1}</span>
                    <span className="text-xs text-border-gray">→</span>
                  </div>
                  <div className="font-semibold text-near-black text-sm">{t(step.key)}</div>
                </div>

                {/* Chevron */}
                <motion.div
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 mt-3 text-mid-gray"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </motion.div>
              </button>

              {/* Expanded detail */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`timeline-detail-${step.id}`}
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="ml-16 mb-2 p-3 bg-off-white rounded-lg text-sm text-near-black leading-relaxed border border-light-gray">
                      {t(`${step.key}_desc`)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
