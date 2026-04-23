import { 
  Calendar, Building, Building2, ScrollText, CheckCircle2, Scale, 
  HelpCircle, Zap, Check, MousePointerClick, AlertTriangle, 
  FileText, Rocket, Info, ExternalLink, ArrowRight, Search, 
  MapPin, BadgeInfo, Droplets, Receipt, ShieldCheck, Banknote, 
  ShieldAlert, Accessibility, CircleOff, Home, Monitor, Phone 
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { getContent } from '../data/electionContent';
import MythCard from '../components/ui/MythCard';
import ElectionTimeline from '../components/ui/ElectionTimeline';
import GuidedJourneys from '../components/ui/GuidedJourneys';

// ─── Registration Wizard ───────────────────────────
function RegistrationWizard() {
  const { t } = useApp();
  const [currentStep, setCurrentStep] = useState(0);

  const REGISTRATION_STEPS = [
    {
      title: t('check_eligibility'),
      icon: <CheckCircle2 size={16} />,
      content: (
        <div className="space-y-2">
          <p className="text-sm text-mid-gray">{t('you_are_eligible_if')}:</p>
          <ul className="space-y-1.5">
            {[t('eligibility_1'), t('eligibility_2'), t('eligibility_3'), t('eligibility_4')].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Check size={16} className="text-india-green mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      title: t('gather_docs'),
      icon: <ScrollText size={16} />,
      content: (
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold text-near-black mb-1.5">{t('age_proof')}</p>
            <div className="flex flex-wrap gap-1.5">
              {['Aadhaar Card', 'Birth Certificate', 'School Certificate', 'PAN Card', 'Passport'].map(doc => (
                <span key={doc} className="text-xs bg-blue-50 text-india-navy border border-blue-200 px-2 py-1 rounded-full">{doc}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-near-black mb-1.5">{t('addr_proof')}</p>
            <div className="flex flex-wrap gap-1.5">
              {['Aadhaar Card', 'Bank Passbook', 'Utility Bill', 'Rent Agreement', 'Driving Licence'].map(doc => (
                <span key={doc} className="text-xs bg-green-50 text-india-green border border-green-200 px-2 py-1 rounded-full">{doc}</span>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t('visit_voter_portal'),
      icon: <MousePointerClick size={16} />,
      content: (
        <div className="space-y-3">
          <p className="text-sm text-mid-gray">{t('go_to_official_portal')}:</p>
          <a
            href="https://voters.eci.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full justify-center"
            aria-label="Open voter portal (opens in new tab)"
          >
            voters.eci.gov.in ↗
          </a>
          <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
            <span>{t('official_voters_url')}</span>
          </div>
        </div>
      ),
    },
    {
      title: t('fill_form_6'),
      icon: <FileText size={16} />,
      content: (
        <div className="space-y-2">
          <p className="text-sm text-mid-gray mb-3">{t('fill_form_6_desc_wizard')}:</p>
          {[t('form_6_step_1'), t('form_6_step_2'), t('form_6_step_3'), t('form_6_step_4'), t('form_6_step_5'), t('form_6_step_6')].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-india-navy text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
              <span className="text-sm">{step}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: t('wait_verify'),
      icon: <Calendar size={16} />,
      content: (
        <div className="space-y-3">
          <p className="text-sm text-mid-gray">{t('after_submission')}:</p>
          <div className="space-y-2">
            {[
              { t: t('verify_week_title'), d: t('verify_week') },
              { t: t('verify_sms_title'), d: t('verify_sms') },
              { t: t('verify_status_title'), d: t('verify_status') },
              { t: t('verify_epic_title'), d: t('verify_epic') },
            ].map(({ t, d }, i) => (
              <div key={i} className="flex gap-3 p-3 bg-off-white rounded-lg">
                <span className="text-xs font-bold text-india-navy whitespace-nowrap">{t}</span>
                <span className="text-xs text-mid-gray">{d}</span>
              </div>
            ))}
          </div>
          <a href="https://electoralsearch.eci.gov.in" target="_blank" rel="noopener noreferrer" className="btn-secondary w-full justify-center text-sm">
            {t('check_registration_status')} ↗
          </a>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {REGISTRATION_STEPS.map((_, i) => (
          <button
            key={i}
            className={`progress-dot ${i === currentStep ? 'active' : i < currentStep ? 'done' : ''}`}
            onClick={() => setCurrentStep(i)}
            aria-label={`Step ${i + 1}: ${REGISTRATION_STEPS[i].title}`}
            aria-current={i === currentStep ? 'step' : undefined}
          />
        ))}
      </div>

      {/* Steps bar */}
      <div className="flex mb-4 gap-1 overflow-x-auto pb-1 scrollbar-none">
        {REGISTRATION_STEPS.map((s, i) => (
          <button
            key={i}
            onClick={() => setCurrentStep(i)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all ${
              i === currentStep ? 'bg-india-navy text-white' : i < currentStep ? 'bg-india-green text-white' : 'bg-off-white text-mid-gray'
            }`}
          >
            <span>{s.icon}</span>
            <span>{s.title}</span>
          </button>
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="card p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">{REGISTRATION_STEPS[currentStep].icon}</span>
            <div>
              <div className="text-xs text-mid-gray">{t('step')} {currentStep + 1} {t('of')} {REGISTRATION_STEPS.length}</div>
              <h3 className="font-serif font-bold text-india-navy">{REGISTRATION_STEPS[currentStep].title}</h3>
            </div>
          </div>
          {REGISTRATION_STEPS[currentStep].content}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3 mt-4">
        <button
          className="btn-secondary flex-1"
          onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
          disabled={currentStep === 0}
        >
          ← {t('previous')}
        </button>
        {currentStep < REGISTRATION_STEPS.length - 1 ? (
          <button
            className="btn-primary flex-1"
            onClick={() => setCurrentStep(s => Math.min(REGISTRATION_STEPS.length - 1, s + 1))}
          >
            {t('next')} →
          </button>
        ) : (
          <a
            href="https://voters.eci.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex-1 justify-center no-underline"
          >
            <div className="flex items-center gap-2">
              <span>{t('register_now')}</span> <Rocket size={16} />
            </div>
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Main LearnPage ────────────────────────────────
export default function LearnPage() {
  const { t, state } = useApp();
  const [activeTab, setActiveTab] = useState('how');
  const content = getContent(t);

  return (
    <div className="content-area">
      <div className="max-w-2xl mx-auto px-4 pt-4">

        <div className="mb-4">
          <h1 className="section-header">Education Hub</h1>
          {state.language !== 'en' && (
            <p className="text-xs font-bold text-india-saffron -mt-1 mb-1">
              {t('education_hub')}
            </p>
          )}
          <p className="section-sub">{t('education_sub')}</p>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-none" role="tablist" aria-label="Education sections">
          {[
            { id: 'how',      label: t('how_it_works'),  icon: <Calendar size={16} /> },
            { id: 'guided',   label: t('guided_journeys'), icon: <Rocket size={16} /> },
            { id: 'types',    label: t('election_types'), icon: <Building size={16} /> },
            { id: 'register', label: t('register'),       icon: <ScrollText size={16} /> },
            { id: 'vote',     label: t('step_by_step'),   icon: <CheckCircle2 size={16} /> },
            { id: 'rights',   label: t('your_rights'),    icon: <Scale size={16} /> },
            { id: 'myth',     label: t('myths_facts'),    icon: <HelpCircle size={16} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-india-navy text-white shadow-md'
                  : 'bg-off-white text-mid-gray hover:bg-light-gray'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span role="img" aria-hidden="true">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panels */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            id={`tabpanel-${activeTab}`}
            role="tabpanel"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'how' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-base font-semibold text-near-black mb-4">{t('how_it_works')}</h2>
                <ElectionTimeline />
              </motion.div>
            )}

            {activeTab === 'guided' && (
              <div>
                <h2 className="text-base font-semibold text-near-black mb-4">{t('guided_journeys')}</h2>
                <GuidedJourneys />
              </div>
            )}

            {activeTab === 'types' && (
              <div>
                <h2 className="text-base font-semibold text-near-black mb-4">{t('election_types')}</h2>
                <div className="space-y-3">
                  {content.ELECTION_TYPES.map((type) => (
                    <motion.div
                      key={type.id}
                      whileHover={{ x: 2 }}
                      className="card p-4 flex items-start gap-4"
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                           style={{ background: type.color + '18' }}>
                        {type.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <span className="font-serif font-bold text-india-navy text-sm">{type.name}</span>
                            <span className="text-xs text-mid-gray ml-2">{type.nameHi}</span>
                          </div>
                          <span className="text-xs font-medium bg-off-white border border-light-gray px-2 py-0.5 rounded-full whitespace-nowrap">{type.freq}</span>
                        </div>
                        <div className="text-xs text-india-navy font-medium mt-0.5">{type.seats}</div>
                        <p className="text-xs text-mid-gray mt-1 leading-relaxed">{type.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'register' && (
              <div>
                <h2 className="text-base font-semibold text-near-black mb-4">{t('register')}</h2>
                <RegistrationWizard getContent={getContent} t={t} />
              </div>
            )}

            {activeTab === 'vote' && (
              <div>
                <h2 className="text-base font-semibold text-near-black mb-4">{t('step_by_step')}</h2>
                <div className="space-y-3">
                  {content.VOTING_STEPS.map((s) => (
                    <motion.div
                      key={s.step}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: s.step * 0.07 }}
                      className="flex items-start gap-4"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-india-navy text-white flex items-center justify-center text-xl flex-shrink-0">
                          <span role="img" aria-hidden="true">{s.icon}</span>
                        </div>
                        {s.step < content.VOTING_STEPS.length && (
                          <div className="w-0.5 flex-1 min-h-[20px] bg-light-gray mt-1" aria-hidden="true" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-mid-gray uppercase">{t('step')} {s.step}</span>
                        </div>
                        <h3 className="font-semibold text-sm text-near-black mb-1">{s.title}</h3>
                        <p className="text-sm text-mid-gray leading-relaxed">{s.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* EVM info box */}
                <div className="mt-4 p-4 bg-off-white border border-light-gray rounded-card">
                  <div className="flex items-center gap-1.5 font-semibold text-sm text-india-navy mb-2">
                    <Monitor size={16} /> <span>{t('about_evm_title')}</span>
                  </div>
                  <p className="text-sm text-mid-gray leading-relaxed">
                    {t('about_evm_desc')}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'rights' && (
              <div>
                <h2 className="text-base font-semibold text-near-black mb-4">{t('your_rights')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {content.RIGHTS.map((right, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="card p-4 flex gap-3"
                    >
                      <div className="w-10 h-10 rounded-full bg-off-white flex items-center justify-center text-xl flex-shrink-0">
                        {right.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-near-black mb-1">{right.title}</div>
                        <p className="text-xs text-mid-gray leading-relaxed">{right.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-card">
                  <div className="flex items-center gap-1.5 font-semibold text-sm text-amber-800 mb-1">
                    <Phone size={16} /> <span>{t('helpline_1950')}</span>
                  </div>
                  <p className="text-sm text-amber-700">{t('rights_violated_note')}</p>
                </div>
              </div>
            )}

            {activeTab === 'myth' && (
              <div>
                <h2 className="text-base font-semibold text-near-black mb-2">{t('myths_facts')}</h2>
                <p className="text-xs text-mid-gray mb-4">{t('tap_to_reveal')}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {content.MYTHS.map((m, i) => (
                    <MythCard key={i} myth={m.myth} fact={m.fact} index={i} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
