// src/pages/WelcomePage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp, LANGUAGES } from '../context/AppContext';
import { Lock } from 'lucide-react';

// Ashok Chakra SVG watermark
function ChakraWatermark() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden" aria-hidden="true">
      <svg width="340" height="340" viewBox="0 0 340 340" fill="none" opacity="0.04">
        <circle cx="170" cy="170" r="165" stroke="#0D2C6B" strokeWidth="3"/>
        <circle cx="170" cy="170" r="120" stroke="#0D2C6B" strokeWidth="2"/>
        <circle cx="170" cy="170" r="40" fill="none" stroke="#0D2C6B" strokeWidth="3"/>
        <circle cx="170" cy="170" r="8" fill="#0D2C6B"/>
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i * 15 * Math.PI) / 180;
          const x1 = 170 + 44 * Math.cos(angle);
          const y1 = 170 + 44 * Math.sin(angle);
          const x2 = 170 + 116 * Math.cos(angle);
          const y2 = 170 + 116 * Math.sin(angle);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0D2C6B" strokeWidth="2"/>;
        })}
      </svg>
    </div>
  );
}

export default function WelcomePage() {
  const { state, dispatch, t } = useApp();
  const navigate = useNavigate();
  const [selected, setSelected] = useState('en');

  function selectLanguage(code) {
    setSelected(code);
  }

  function proceed() {
    dispatch({ type: 'SET_LANGUAGE', payload: selected });
    navigate('/onboarding');
  }

  // Group languages: first 10 + remaining
  const tier1 = LANGUAGES.slice(0, 10);
  const tier2 = LANGUAGES.slice(10);

  return (
    <div className="relative min-h-dvh flex flex-col bg-white overflow-hidden">
      <ChakraWatermark />

      {/* India flag stripe at top */}
      <div className="india-stripe flex-shrink-0" />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 pt-8 pb-12 max-w-2xl mx-auto w-full">

        {/* ECI badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center mb-6"
        >
          <div className="flex items-center gap-2 bg-off-white border border-light-gray rounded-full px-4 py-1.5">
            <div className="w-2 h-2 rounded-full bg-india-green animate-pulse" />
            <span className="text-xs font-medium text-mid-gray">Powered by official ECI information</span>
          </div>
        </motion.div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          {/* Logo */}
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-india-navy flex items-center justify-center shadow-card">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="7" fill="none" stroke="white" strokeWidth="1.5"/>
                <circle cx="18" cy="18" r="2" fill="#FF9933"/>
                {Array.from({ length: 24 }).map((_, i) => {
                  const angle = (i * 15 * Math.PI) / 180;
                  const x1 = 18 + 8 * Math.cos(angle);
                  const y1 = 18 + 8 * Math.sin(angle);
                  const x2 = 18 + 16 * Math.cos(angle);
                  const y2 = 18 + 16 * Math.sin(angle);
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="0.8" opacity="0.7"/>;
                })}
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-serif font-bold text-india-navy mb-1">
            {t('welcome_title')}
          </h1>
          <p className="text-xl text-mid-gray font-light mb-2">{t('welcome_subtitle')}</p>
          <p className="text-sm text-mid-gray max-w-xs mx-auto">
            {t('welcome_tagline')}
          </p>
        </motion.div>

        {/* Language selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-sm font-semibold text-near-black text-center mb-3">
            {t('select_language')} / अपनी भाषा चुनें
          </h2>

          {/* Tier 1 languages */}
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mb-2">
            {tier1.map((lang) => (
              <button
                key={lang.code}
                className={`lang-tile ${selected === lang.code ? 'selected' : ''}`}
                onClick={() => selectLanguage(lang.code)}
                aria-label={`Select ${lang.name}`}
                aria-pressed={selected === lang.code}
              >
                <span className="text-base font-medium text-near-black leading-tight">{lang.native}</span>
                <span className="text-xs text-mid-gray">{lang.name}</span>
              </button>
            ))}
          </div>

          {/* Tier 2 languages */}
          <details className="mb-4">
            <summary className="text-xs text-mid-gray text-center cursor-pointer hover:text-india-navy py-1 select-none">
              + More languages / अधिक भाषाएं
            </summary>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mt-2">
              {tier2.map((lang) => (
                <button
                  key={lang.code}
                  className={`lang-tile ${selected === lang.code ? 'selected' : ''}`}
                  onClick={() => selectLanguage(lang.code)}
                  aria-label={`Select ${lang.name}`}
                  aria-pressed={selected === lang.code}
                >
                  <span className="text-base font-medium text-near-black leading-tight">{lang.native}</span>
                  <span className="text-xs text-mid-gray">{lang.name}</span>
                </button>
              ))}
            </div>
          </details>

          {/* CTA buttons */}
          <div className="space-y-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full text-base py-4"
              onClick={proceed}
              id="continue-btn"
            >
              {t('proceed')} ({LANGUAGES.find(l => l.code === selected)?.name})
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.button>

            {selected !== 'en' && (
              <button
                className="btn-secondary w-full text-sm"
                onClick={() => {
                  dispatch({ type: 'SET_LANGUAGE', payload: 'en' });
                  navigate('/onboarding');
                }}
              >
                Continue in English
              </button>
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-mid-gray">
          <p className="flex items-center justify-center gap-1.5 leading-relaxed">
            <Lock size={12} className="flex-shrink-0" />
            <span>Politically neutral • No data collection • 100% Free</span>
          </p>
          <p className="text-xs text-mid-gray mt-1">
            Information sourced from{' '}
            <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer" className="underline text-india-navy">
              eci.gov.in
            </a>
          </p>
        </div>
      </div>

      <div className="india-stripe flex-shrink-0" />
    </div>
  );
}
