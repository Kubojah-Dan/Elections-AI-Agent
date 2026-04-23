// src/components/layout/SideNav.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { MessageSquare, BookOpen, Wrench, Settings, Phone } from 'lucide-react';

const NAV_LINKS = [
  {
    path: '/chat',
    label: 'Chat',
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    path: '/learn',
    label: 'Education Hub',
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    path: '/tools',
    label: 'Quick Tools',
    icon: <Wrench className="w-5 h-5" />,
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: <Settings className="w-5 h-5" />,
  },
];

function AshokChakraMini() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="8" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="16" cy="16" r="2" fill="#FF9933"/>
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i * 15 * Math.PI) / 180;
        return <line key={i} x1={16 + 9 * Math.cos(a)} y1={16 + 9 * Math.sin(a)} x2={16 + 15 * Math.cos(a)} y2={16 + 15 * Math.sin(a)} stroke="currentColor" strokeWidth="0.9" opacity="0.7"/>;
      })}
    </svg>
  );
}

export default function SideNav() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const { darkMode } = state.accessibilitySettings;

  function toggleDark() {
    dispatch({ type: 'UPDATE_ACCESSIBILITY', payload: { darkMode: !darkMode } });
  }

  return (
    <aside className="desktop-sidebar" role="navigation" aria-label="Main navigation">
      {/* Logo */}
      <div className="p-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={() => navigate('/chat')}
          className="flex items-center gap-3 w-full text-left group"
          aria-label="Go to chat"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
               style={{ background: 'var(--navy)' }}>
            <span style={{ color: 'white' }}><AshokChakraMini /></span>
          </div>
          <div className="min-w-0">
            <div className="font-serif font-bold text-sm leading-tight" style={{ color: 'var(--navy)' }}>
              Matdata Mitra
            </div>
            <div className="text-xs opacity-70" style={{ color: 'var(--text-secondary)' }}>
              मतदाता मित्र
            </div>
          </div>
        </button>
      </div>

      {/* ECI badge */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'var(--bg-secondary)' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
          <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            Official ECI information
          </span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-2" aria-label="App sections">
        <div className="space-y-1">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'text-white shadow-md'
                    : 'hover:opacity-90'
                }`
              }
              style={({ isActive }) => isActive
                ? { background: 'var(--navy)', color: 'white' }
                : { color: 'var(--text-secondary)' }
              }
              aria-current={({ isActive }) => isActive ? 'page' : undefined}
            >
              {({ isActive }) => (
                <>
                  {link.icon}
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-dot"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom controls */}
      <div className="p-4 border-t space-y-3" style={{ borderColor: 'var(--border)' }}>
        {/* Helpline */}
        <div className="rounded-xl p-3" style={{ background: 'rgba(255,153,51,0.08)', border: '1px solid rgba(255,153,51,0.2)' }}>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 mb-0.5">
            <Phone size={14} />
            <span>Voter Helpline</span>
          </div>
          <div className="text-lg font-serif font-bold" style={{ color: 'var(--navy)' }}>1950</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Free · Multilingual</div>
        </div>

        {/* Dark mode + Language */}
        <div className="flex items-center gap-2">
          <button
            className="btn-ghost flex-1 justify-center rounded-lg py-2 text-xs font-semibold"
            style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
            onClick={() => navigate('/settings')}
            aria-label="Change language"
          >
            {state.language.toUpperCase()}
          </button>

          <button
            className="btn-ghost w-10 h-10 rounded-lg"
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

        {/* India flag stripe */}
        <div className="india-stripe rounded-full" />
      </div>
    </aside>
  );
}
