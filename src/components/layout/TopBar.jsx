import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { MessageSquare, BookOpen, Calendar, Wrench, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { path: '/chat',     id: 'chat',     icon: MessageSquare },
  { path: '/learn',    id: 'learn',    icon: BookOpen },
  { path: '/calendar', id: 'calendar', icon: Calendar },
  { path: '/tools',    id: 'tools',    icon: Wrench },
  { path: '/settings', id: 'settings', icon: Settings },
];

const PAGE_TITLES = {
  '/chat':     { title: 'Matdata Mitra',   sub: 'Ask me anything about elections' },
  '/learn':    { title: 'Education Hub',   sub: 'Learn about India\'s elections' },
  '/calendar': { title: 'Election Calendar', sub: 'Important dates & deadlines' },
  '/tools':    { title: 'Quick Tools',     sub: 'Official ECI services' },
  '/settings': { title: 'Settings',        sub: 'Customize your experience' },
};

function AshokChakraSVG() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="7" fill="none" stroke="white" strokeWidth="1.5"/>
      <circle cx="14" cy="14" r="2" fill="#FF9933"/>
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i * 15 * Math.PI) / 180;
        return <line key={i} x1={14 + 8 * Math.cos(a)} y1={14 + 8 * Math.sin(a)} x2={14 + 13 * Math.cos(a)} y2={14 + 13 * Math.sin(a)} stroke="white" strokeWidth="0.8" opacity="0.6"/>;
      })}
    </svg>
  );
}

export default function TopBar() {
  const { state, dispatch, t } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const PAGE_TITLES_EN = {
    '/chat':     { title: 'Matdata Mitra',   sub: 'Ask me anything about elections' },
    '/learn':    { title: 'Education Hub',   sub: 'Learn about India\'s elections' },
    '/tools':    { title: 'Quick Tools',     sub: 'Official ECI services' },
    '/settings': { title: 'Settings',        sub: 'Customize your experience' },
    '/calendar': { title: 'Election Calendar', sub: 'Important dates & deadlines' },
  };

  const PAGE_TITLES_LOCAL = {
    '/chat':     { title: t('app_name'),   sub: t('tagline_chat') },
    '/learn':    { title: t('education_hub'),   sub: t('tagline_learn') },
    '/tools':    { title: t('quick_tools'),     sub: t('tagline_tools') },
    '/settings': { title: t('settings_title'),  sub: t('tagline_settings') },
    '/calendar': { title: t('election_calendar'), sub: t('tagline_calendar') },
  };

  const metaEn = PAGE_TITLES_EN[location.pathname] || PAGE_TITLES_EN['/chat'];
  const metaLocal = PAGE_TITLES_LOCAL[location.pathname] || PAGE_TITLES_LOCAL['/chat'];
  const isEnglish = state.language === 'en';
  const { darkMode, textSize, elderlyMode } = state.accessibilitySettings;

  const isWelcomeOrOnboarding = ['/', '/onboarding'].includes(location.pathname);
  if (isWelcomeOrOnboarding) return null;

  function cycleTextSize() {
    const sizes = ['normal', 'large', 'xlarge'];
    const current = elderlyMode ? 'xlarge' : textSize;
    const next = sizes[(sizes.indexOf(current) + 1) % sizes.length];
    dispatch({ type: 'UPDATE_ACCESSIBILITY', payload: { textSize: next, elderlyMode: false } });
  }

  function toggleDark() {
    dispatch({ type: 'UPDATE_ACCESSIBILITY', payload: { darkMode: !darkMode } });
  }

  return (
    <header
      className="top-bar glass flex items-center"
      role="banner"
    >
      <div
        className="flex-1 flex items-center gap-3 h-full px-4"
        style={{ borderBottom: '2px solid transparent', backgroundImage: 'linear-gradient(var(--bg-nav),var(--bg-nav)),linear-gradient(to right,#FF9933 33%,white 33%,white 66%,#138808 66%)' }}
      >

        {/* Logo — mobile only (on desktop, sidebar shows logo) */}
        <button
          onClick={() => navigate('/chat')}
          className="flex items-center gap-2.5 flex-shrink-0 lg:hidden"
          aria-label="Go to home"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--navy)' }}>
            <AshokChakraSVG />
          </div>
          <div className="leading-tight">
            <div className="font-serif font-bold text-sm leading-none" style={{ color: 'var(--navy)' }}>
              {metaEn.title}
            </div>
            {!isEnglish && (
              <div className="text-[10px] font-bold" style={{ color: 'var(--accent)' }}>
                {metaLocal.title}
              </div>
            )}
            <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              {isEnglish ? metaEn.sub : metaLocal.sub}
            </div>
          </div>
        </button>

        {/* Logo and Title — desktop only */}
        <button
          className="hidden lg:flex items-center gap-2.5 min-w-0"
          onClick={() => navigate('/chat')}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--navy)' }}>
            <AshokChakraSVG />
          </div>
          <div className="text-left">
            <h1 className="font-serif font-bold text-base m-0 leading-none" style={{ color: 'var(--navy)' }}>
              {metaEn.title}
            </h1>
            {!isEnglish && (
              <div className="text-xs font-bold" style={{ color: 'var(--accent)' }}>
                {metaLocal.title}
              </div>
            )}
            <p className="text-[10px] uppercase font-bold tracking-wide m-0 mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {isEnglish ? metaEn.sub : metaLocal.sub}
            </p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex flex-1 items-center justify-center gap-8 px-4 h-full">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="flex items-center gap-1.5 h-full relative font-medium transition-colors hover:opacity-80"
                style={{ color: active ? 'var(--navy)' : 'var(--text-muted)' }}
              >
                <Icon size={16} />
                <span className="text-sm">{t(item.id)}</span>
                {active && (
                  <motion.div
                    layoutId="topnav"
                    className="absolute bottom-0 left-0 right-0 h-1 rounded-t-md z-10"
                    style={{ background: 'var(--accent)' }}
                  />
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Spacer for mobile */}
        <div className="flex-1 lg:hidden" />

        {/* Right controls */}
        <div className="flex items-center gap-1">

          {/* Language button */}
          <button
            className="btn-ghost px-2.5 py-1.5 text-xs font-bold rounded-lg"
            style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
            onClick={() => navigate('/settings')}
            aria-label={`Language: ${state.language.toUpperCase()}`}
          >
            {state.language.toUpperCase()}
          </button>

          {/* Text size */}
          <button
            className="btn-ghost w-9 h-9 rounded-lg font-bold text-sm"
            style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
            onClick={cycleTextSize}
            aria-label="Change text size"
            title="Cycle text size"
          >
            A
          </button>

          {/* Dark mode toggle */}
          <button
            className="btn-ghost w-9 h-9 rounded-lg"
            style={{ border: '1px solid var(--border)' }}
            onClick={toggleDark}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-pressed={darkMode}
          >
            {darkMode ? (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#FFD700' }}>
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.166 17.834a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 001.061-1.06l-1.59-1.591zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.166 6.166a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--text-secondary)' }}>
                <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* India tri-color stripe at very bottom of topbar */}
      <div className="india-stripe" style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />
    </header>
  );
}
