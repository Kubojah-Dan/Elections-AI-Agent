import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, Archive, Search, FileText, MonitorCheck, Compass, Star, CheckCircle, HeartHandshake, Plane, Landmark, Lightbulb, Briefcase, KeyRound, Accessibility, LogIn, Scale, MapPin, BadgeInfo, Play, Phone, Rocket, ChevronRight } from 'lucide-react';
import { useApp, PERSONAS } from '../context/AppContext';

const INTENTS = [
  { id: 'register',  label: 'Register to vote',        icon: ClipboardList },
  { id: 'vote',      label: 'Learn how to vote',        icon: Archive },
  { id: 'status',    label: 'Check my voter status',    icon: Search },
  { id: 'forms',     label: 'Find the right form',      icon: FileText },
  { id: 'evm',       label: 'Understand EVMs & VVPAT',  icon: MonitorCheck },
  { id: 'explore',   label: 'Just exploring',           icon: Compass },
];

const ICONS = {
  Star: <Star size={32} strokeWidth={1.5} />,
  CheckCircle: <CheckCircle size={32} strokeWidth={1.5} />,
  HeartHandshake: <HeartHandshake size={32} strokeWidth={1.5} />,
  Plane: <Plane size={32} strokeWidth={1.5} />,
  Landmark: <Landmark size={32} strokeWidth={1.5} />,
  Lightbulb: <Lightbulb size={32} strokeWidth={1.5} />,
};

const TOTAL_STEPS = 3;

function ProgressBar({ step }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div key={i} className="flex-1 flex items-center gap-2">
          <div
            className={`h-1.5 flex-1 rounded-full transition-all duration-400 ${
              i < step ? 'bg-india-navy' : i === step ? 'bg-saffron' : 'bg-light-gray'
            }`}
          />
        </div>
      ))}
    </div>
  );
}

export default function OnboardingPage() {
  const { state, dispatch, t } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedPersona, setSelectedPersona] = useState(state.persona);
  const [selectedIntent, setSelectedIntent] = useState(null);
  const [elderlyMode, setElderlyMode] = useState(state.accessibilitySettings.elderlyMode);
  const [textSize, setTextSize] = useState(state.accessibilitySettings.textSize);

  function goNext() {
    if (step === 0 && !selectedPersona) return;
    if (step < TOTAL_STEPS - 1) {
      setStep(s => s + 1);
    } else {
      finishOnboarding();
    }
  }

  function goBack() {
    if (step > 0) setStep(s => s - 1);
    else navigate('/');
  }

  function finishOnboarding() {
    dispatch({ type: 'SET_PERSONA', payload: selectedPersona });
    dispatch({
      type: 'UPDATE_ACCESSIBILITY',
      payload: { elderlyMode, textSize: elderlyMode ? 'xlarge' : textSize }
    });
    dispatch({ type: 'COMPLETE_ONBOARDING' });
    navigate('/chat');
  }

  const slideVariants = {
    initial: (dir) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    animate: { x: 0, opacity: 1 },
    exit:    (dir) => ({ x: dir < 0 ? 40 : -40, opacity: 0 }),
  };

  return (
    <div className="min-h-dvh flex flex-col bg-white max-w-lg mx-auto">
      <div className="india-stripe" />

      <div className="flex-1 px-5 py-6 pb-10 overflow-y-auto">
        <ProgressBar step={step} />

        <AnimatePresence mode="wait" custom={1}>
          {step === 0 && (
            <motion.div
              key="step0"
              custom={1}
              variants={slideVariants}
              initial="initial" animate="animate" exit="exit"
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-2xl font-serif font-bold text-india-navy mb-1">{t('who_are_you')}</h2>
              <p className="text-sm text-mid-gray mb-6">{t('who_are_you_sub')}</p>

              <div className="grid grid-cols-2 gap-3">
                {PERSONAS.map((p) => (
                  <button
                    key={p.id}
                    className={`flex flex-col items-center gap-2 p-4 rounded-card border-2 text-center transition-all duration-200 ${
                      selectedPersona === p.id
                        ? 'border-india-navy bg-blue-50'
                        : 'border-light-gray hover:border-india-navy hover:bg-off-white'
                    }`}
                    onClick={() => setSelectedPersona(p.id)}
                    aria-pressed={selectedPersona === p.id}
                    aria-label={t(`persona_${p.id}`)}
                  >
                    <span className="text-3xl" style={{ color: 'var(--navy)' }} aria-hidden="true">{ICONS[p.icon]}</span>
                    <div>
                      <div className="text-xs font-semibold text-near-black">{t(`persona_${p.id}`)}</div>
                      <div className="text-xs text-mid-gray mt-0.5 leading-tight">{t(`persona_${p.id}_desc`)}</div>
                    </div>
                    {selectedPersona === p.id && (
                      <div className="w-5 h-5 rounded-full bg-india-navy flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              custom={1}
              variants={slideVariants}
              initial="initial" animate="animate" exit="exit"
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-2xl font-serif font-bold text-india-navy mb-1">{t('what_need')}</h2>
              <p className="text-sm text-mid-gray mb-6">{t('what_need_sub')}</p>

              <div className="space-y-2">
                {INTENTS.map((intent) => (
                  <button
                    key={intent.id}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-card border-2 text-left transition-all duration-200 ${
                      selectedIntent === intent.id
                        ? 'border-india-navy bg-blue-50'
                        : 'border-light-gray hover:border-india-navy hover:bg-off-white'
                    }`}
                    onClick={() => setSelectedIntent(intent.id)}
                    aria-pressed={selectedIntent === intent.id}
                  >
                    <intent.icon className="w-8 h-8 flex-shrink-0" style={{ color: 'var(--navy)' }} strokeWidth={1.5} aria-hidden="true" />
                    <span className="text-sm font-medium text-near-black">{t(`intent_${intent.id}`)}</span>
                    {selectedIntent === intent.id && (
                      <div className="ml-auto w-5 h-5 rounded-full bg-india-navy flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              custom={1}
              variants={slideVariants}
              initial="initial" animate="animate" exit="exit"
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-2xl font-serif font-bold text-india-navy mb-1">{t('accessibility')}</h2>
              <p className="text-sm text-mid-gray mb-6">{t('accessibility_sub')}</p>

              <div className="space-y-4">
                {/* Elderly mode */}
                <div className="w-16 h-16 bg-off-white rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-border-gray relative">
                  <div className="text-india-navy"><HeartHandshake size={32} /></div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-india-green rounded-full border-2 border-white flex items-center justify-center"></div>
                </div>
                <div className="card p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-near-black">{t('elderly_mode_title')}</div>
                    <div className="text-xs text-mid-gray">{t('elderly_mode_desc')}</div>
                  </div>
                  <button
                    role="switch"
                    aria-checked={elderlyMode}
                    onClick={() => setElderlyMode(!elderlyMode)}
                    className={`w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0 relative ${elderlyMode ? 'bg-india-navy' : 'bg-light-gray'}`}
                    aria-label={t('elderly_mode_title')}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${elderlyMode ? 'translate-x-6' : ''}`} />
                  </button>
                </div>

                {/* Text size */}
                {!elderlyMode && (
                  <div className="card p-4">
                    <div className="font-semibold text-sm text-near-black mb-3">{t('text_size')}</div>
                    <div className="grid grid-cols-3 gap-2">
                      {['normal', 'large', 'xlarge'].map((size) => (
                        <button
                          key={size}
                          className={`py-3 rounded-btn border-2 text-center transition-all ${
                            textSize === size ? 'border-india-navy bg-blue-50' : 'border-light-gray'
                          }`}
                          onClick={() => setTextSize(size)}
                          aria-pressed={textSize === size}
                        >
                          <span className={`font-bold text-india-navy ${size === 'normal' ? 'text-sm' : size === 'large' ? 'text-base' : 'text-xl'}`}>A</span>
                          <div className="text-xs text-mid-gray mt-0.5 capitalize">{t(size)}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Helpful info */}
                <div className="bg-amber-50 border border-amber-200 rounded-card p-4">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-amber-800">
                    <Phone size={16} /> <span>{t('remember')}</span>
                  </div>
                  <p className="text-amber-800 text-xs mt-1">{t('helpline_info')}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom action bar */}
      <div className="flex-shrink-0 border-t border-light-gray bg-white px-5 py-4 flex gap-3">
        <button
          className="btn-secondary flex-shrink-0 px-4"
          onClick={goBack}
          aria-label={t('back')}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {t('back')}
        </button>

        {step < TOTAL_STEPS - 1 && (
          <button
            className="btn-ghost text-sm text-mid-gray ml-auto"
            onClick={() => setStep(s => s + 1)}
          >
            {t('skip')}
          </button>
        )}

        <button
          className="btn-primary flex-1"
          onClick={goNext}
          disabled={step === 0 && !selectedPersona}
        >
          {step === TOTAL_STEPS - 1 ? (
            <div className="flex items-center gap-2">
              <span>{t('get_started')}</span> <Rocket size={16} />
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span>{t('next')}</span> <ChevronRight size={16} />
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
