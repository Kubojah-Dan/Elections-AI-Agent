// src/App.jsx
import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useApp } from './context/AppContext';
import TopBar from './components/layout/TopBar';
import BottomNav from './components/layout/BottomNav';
import WelcomePage from './pages/WelcomePage';
import OnboardingPage from './pages/OnboardingPage';
import ChatPage from './pages/ChatPage';
import LearnPage from './pages/LearnPage';
import ToolsPage from './pages/ToolsPage';
import CalendarPage from './pages/CalendarPage';
import SettingsPage from './pages/SettingsPage';

function RequireOnboarding({ children }) {
  const { state } = useApp();
  if (!state.language) return <Navigate to="/" replace />;
  if (!state.onboardingComplete) return <Navigate to="/onboarding" replace />;
  return children;
}

export default function App() {
  const location = useLocation();
  const { state } = useApp();

  // RTL for Urdu etc.
  useEffect(() => {
    const rtlLangs = ['ur', 'ks', 'sd'];
    document.documentElement.setAttribute('dir', rtlLangs.includes(state.language) ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', state.language || 'en');
  }, [state.language]);

  const isAppPage = !['/', '/onboarding'].includes(location.pathname) && state.onboardingComplete;

  return (
    <div className="flex min-h-dvh" style={{ background: 'var(--bg-primary)' }}>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0 w-full h-full max-w-[1920px] mx-auto relative">
        <TopBar />

        <main role="main" className="flex-1 flex flex-col min-h-0">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route
                path="/chat"
                element={<RequireOnboarding><ChatPage /></RequireOnboarding>}
              />
              <Route
                path="/learn"
                element={<RequireOnboarding><LearnPage /></RequireOnboarding>}
              />
              <Route
                path="/tools"
                element={<RequireOnboarding><ToolsPage /></RequireOnboarding>}
              />
              <Route
                path="/calendar"
                element={<RequireOnboarding><CalendarPage /></RequireOnboarding>}
              />
              <Route
                path="/settings"
                element={<RequireOnboarding><SettingsPage /></RequireOnboarding>}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
