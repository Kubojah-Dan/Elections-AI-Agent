// src/components/layout/BottomNav.jsx
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { path: '/chat',     id: 'chat',     icon: MessageSquareIcon },
  { path: '/learn',    id: 'learn',    icon: LearnIcon },
  { path: '/calendar', id: 'calendar', icon: CalendarIcon },
  { path: '/tools',    id: 'tools',    icon: ToolsIcon },
  { path: '/settings', id: 'settings', icon: SettingsIcon },
];

function MessageSquareIcon({ active }) {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
    </svg>
  );
}

function LearnIcon({ active }) {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
    </svg>
  );
}

function CalendarIcon({ active }) {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

function ToolsIcon({ active }) {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
    </svg>
  );
}

function SettingsIcon({ active }) {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    </svg>
  );
}

import { useApp } from '../../context/AppContext';

export default function BottomNav() {
  const { t, state } = useApp();
  const location = useLocation();
  const isAppPage = !['/', '/onboarding'].includes(location.pathname) && state.onboardingComplete;

  if (!isAppPage) return null;

  return (
    // bottom-nav class applies `display:none` at lg+ via CSS
    <nav
      className="bottom-nav glass"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex h-full">
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-colors"
              style={{ color: active ? 'var(--navy)' : 'var(--text-muted)' }}
              aria-current={active ? 'page' : undefined}
              aria-label={t(item.id)}
            >
              {active && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute top-0 left-1/2 -translate-x-1/2"
                  style={{ width: 32, height: 3, borderRadius: '0 0 4px 4px', background: 'var(--accent)' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}

              <item.icon active={active} />
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{t(item.id)}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
