import { useNavigate } from 'react-router-dom';
import { useApp, LANGUAGES } from '../context/AppContext';
import { Moon, HeartHandshake, Contrast, Volume2, Wind, User, Trash2, RotateCcw, Lock, Landmark, Scale, Gift } from 'lucide-react';

function ToggleSwitch({ value, onChange, id, label }) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={value}
      aria-label={label}
      onClick={() => onChange(!value)}
      className={`relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${value ? 'bg-india-navy' : 'bg-light-gray'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${value ? 'translate-x-6' : ''}`}
      />
    </button>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h2 className="text-xs font-bold text-mid-gray uppercase tracking-wider mb-2 px-1">{title}</h2>
      <div className="card overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function Row({ icon, label, sublabel, control, onClick, divider = true }) {
  const baseClass = `flex items-center gap-3 px-4 py-3.5 w-full text-left ${onClick ? 'hover:bg-off-white transition-colors cursor-pointer' : ''} ${divider ? 'border-b border-light-gray' : ''}`;
  const inner = (
    <>
      <div className="text-xl w-7 flex-shrink-0 text-center">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-near-black">{label}</div>
        {sublabel && <div className="text-xs text-mid-gray">{sublabel}</div>}
      </div>
      {control}
    </>
  );
  if (onClick) {
    return <button className={baseClass} onClick={onClick} type="button">{inner}</button>;
  }
  return <div className={baseClass}>{inner}</div>;
}

export default function SettingsPage() {
  const { state, dispatch, t } = useApp();
  const navigate = useNavigate();
  const { accessibilitySettings: a11y, language } = state;

  function updateA11y(patch) {
    dispatch({ type: 'UPDATE_ACCESSIBILITY', payload: patch });
  }

  function setLanguage(code) {
    dispatch({ type: 'SET_LANGUAGE', payload: code });
  }

  function resetAll() {
    if (window.confirm(t('reset_confirm'))) {
      dispatch({ type: 'UPDATE_ACCESSIBILITY', payload: { textSize: 'normal', highContrast: false, readAloud: false, elderlyMode: false } });
      setLanguage('en');
    }
  }

  function clearHistory() {
    if (window.confirm(t('clear_confirm'))) {
      dispatch({ type: 'CLEAR_MESSAGES' });
      navigate('/chat');
    }
  }

  const currentLang = LANGUAGES.find(l => l.code === language);
  const textSizes = [
    { id: 'normal', label: 'Normal (A)', size: 'text-sm' },
    { id: 'large', label: 'Large (A+)', size: 'text-base' },
    { id: 'xlarge', label: 'Extra Large (A++)', size: 'text-lg' },
  ];

  return (
    <div className="content-area">
      <div className="max-w-2xl mx-auto px-4 pt-4">
        <div className="mb-4">
          <h1 className="section-header">{t('settings_title')}</h1>
          <p className="section-sub">{t('tagline_settings')}</p>
        </div>

        {/* Language */}
        <Section title={t('language_title')}>
          <div className="px-4 py-3">
            <p className="text-xs text-mid-gray mb-3">{t('language_current')}: <strong>{currentLang?.name}</strong> ({currentLang?.native})</p>
            <div className="grid grid-cols-4 gap-2">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  className={`lang-tile py-2 px-1 ${language === lang.code ? 'selected' : ''}`}
                  onClick={() => setLanguage(lang.code)}
                  aria-pressed={language === lang.code}
                  aria-label={`Select ${lang.name}`}
                >
                  <span className="text-sm font-medium text-near-black leading-tight">{lang.native}</span>
                  <span className="text-xs text-mid-gray">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* Text Size */}
        <Section title={t('text_size')}>
          <div className="px-4 py-3">
            <div className="grid grid-cols-3 gap-2">
              {textSizes.map(size => (
                <button
                  key={size.id}
                  className={`py-3 rounded-btn border-2 text-center transition-all ${!a11y.elderlyMode && a11y.textSize === size.id || (a11y.elderlyMode && size.id === 'xlarge')
                    ? 'border-india-navy bg-blue-50'
                    : 'border-light-gray hover:border-india-navy'
                    }`}
                  onClick={() => updateA11y({ textSize: size.id, elderlyMode: false })}
                  aria-pressed={!a11y.elderlyMode ? a11y.textSize === size.id : size.id === 'xlarge'}
                >
                  <div className={`font-bold text-india-navy ${size.size}`}>A</div>
                  <div className="text-xs text-mid-gray mt-0.5 leading-tight">{t(size.id)}</div>
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* Accessibility */}
        <Section title={t('accessibility_title')}>
          <Row
            icon={<Moon className="text-india-navy" size={20} />}
            label={t('dark_mode')}
            sublabel={t('dark_mode_sub')}
            divider
            control={
              <ToggleSwitch
                id="dark-mode"
                value={a11y.darkMode}
                onChange={v => updateA11y({ darkMode: v })}
                label={t('dark_mode')}
              />
            }
          />
          <Row
            icon={<HeartHandshake className="text-pink-600" size={20} />}
            label={t('elderly_mode_title')}
            sublabel={t('elderly_mode_desc')}
            divider
            control={
              <ToggleSwitch
                id="elderly-mode"
                value={a11y.elderlyMode}
                onChange={v => updateA11y({ elderlyMode: v, textSize: v ? 'xlarge' : 'normal' })}
                label={t('elderly_mode_title')}
              />
            }
          />
          <Row
            icon={<Contrast className="text-purple-600" size={20} />}
            label={t('high_contrast')}
            sublabel={t('high_contrast_sub')}
            divider
            control={
              <ToggleSwitch
                id="high-contrast"
                value={a11y.highContrast}
                onChange={v => updateA11y({ highContrast: v })}
                label={t('high_contrast')}
              />
            }
          />
          <Row
            icon={<Volume2 className="text-blue-500" size={20} />}
            label={t('read_aloud')}
            sublabel={t('read_aloud_sub')}
            divider
            control={
              <ToggleSwitch
                id="read-aloud"
                value={a11y.readAloud}
                onChange={v => updateA11y({ readAloud: v })}
                label={t('read_aloud')}
              />
            }
          />
          <Row
            icon={<Wind className="text-india-navy" size={20} />}
            label={t('Premium Voice')}
            sublabel={t('Use high-quality human-like voices (requires data)')}
            divider
            control={
              <ToggleSwitch
                id="premium-voice"
                value={a11y.premiumVoice}
                onChange={v => updateA11y({ premiumVoice: v })}
                label={t('premium_voice')}
              />
            }
          />
          <Row
            icon={<Wind className="text-emerald-500" size={20} />}
            label={t('reduced_motion')}
            sublabel={t('reduced_motion_sub')}
            divider={false}
            control={
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('system')}</span>
            }
          />
        </Section>

        {/* Persona */}
        <Section title={t('profile')}>
          <Row
            icon={<User className="text-amber-600" size={20} />}
            label={t('change_persona')}
            sublabel={state.persona ? `${t('current_persona')}: ${t(`persona_${state.persona}`)}` : t('not_set')}
            divider={false}
            onClick={() => navigate('/onboarding')}
            control={
              <svg className="w-4 h-4 text-mid-gray flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            }
          />
        </Section>

        {/* Data */}
        <Section title={t('data_privacy')}>
          <Row
            icon={<Trash2 className="text-red-500" size={20} />}
            label={t('clear_chat_title')}
            sublabel={t('clear_chat_sub')}
            divider
            onClick={clearHistory}
            control={
              <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            }
          />
          <Row
            icon={<RotateCcw className="text-slate-500" size={20} />}
            label={t('reset_settings')}
            sublabel={t('reset_settings_sub')}
            divider={false}
            onClick={resetAll}
            control={
              <svg className="w-4 h-4 text-mid-gray flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            }
          />
        </Section>

        {/* About */}
        <Section title={t('about_title')}>
          <div className="px-4 py-4 space-y-3">
            <div className="text-center">
              <div className="font-serif font-bold text-india-navy text-lg">{t('welcome_title')}</div>
              <div className="text-mid-gray text-sm">{t('welcome_subtitle')}</div>
              <div className="text-xs text-mid-gray mt-1">{t('version')} • Built for The People of India</div>
            </div>

            <div className="bg-off-white rounded-lg p-3 space-y-2 text-xs text-mid-gray">
              <div className="flex items-start gap-2.5"><Lock size={15} className="mt-0.5 text-india-navy flex-shrink-0" /> <span><strong>No personal data collected</strong></span></div>
              <div className="flex items-start gap-2.5"><Landmark size={15} className="mt-0.5 text-india-navy flex-shrink-0" /> <span><strong>{t('official_source')}:</strong> Election Commission of India</span></div>
              <div className="flex items-start gap-2.5"><Scale size={15} className="mt-0.5 text-india-navy flex-shrink-0" /> <span><strong>{t('neutral_note')}</strong> — no party recommendations</span></div>
              <div className="flex items-start gap-2.5"><Gift size={15} className="mt-0.5 text-india-navy flex-shrink-0" /> <span><strong>{t('free_note')}</strong> — no charges or subscriptions</span></div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs py-2 justify-center">
                eci.gov.in ↗
              </a>
              <a href="https://voters.eci.gov.in" target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs py-2 justify-center">
                {t('voter_portal')} ↗
              </a>
            </div>
          </div>
        </Section>

        <div className="pb-4 text-center text-xs text-mid-gray">
          {t('helpline_call')}
        </div>
      </div>
    </div>
  );
}
