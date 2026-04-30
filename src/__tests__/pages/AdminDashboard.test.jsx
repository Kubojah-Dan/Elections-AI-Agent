import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import AdminDashboard from '@/pages/AdminDashboard';
import { AppProvider, useApp } from '@/context/AppContext';
import { BrowserRouter } from 'react-router-dom';

// Mock context
vi.mock('@/context/AppContext', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useApp: vi.fn(),
  };
});

// Mock services
vi.mock('@/services/loggingService', () => ({
  getStats: vi.fn().mockReturnValue({ totalUsers: 100, totalMessages: 500, rumorsDetected: 5, avgLatency: 1.2, satisfaction: 95 }),
  getLogs: vi.fn().mockReturnValue([]),
  subscribeToLogs: vi.fn().mockReturnValue(() => {}),
  subscribeToStats: vi.fn().mockReturnValue(() => {}),
}));

vi.mock('@/services/firebase', () => ({
  signInWithGoogle: vi.fn(),
  logout: vi.fn(),
}));

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the sign in page if user is not authenticated', () => {
    useApp.mockReturnValue({
      t: (key, def) => def || key,
      user: null,
    });

    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );
    expect(screen.getByText(/signin_google/i)).toBeDefined();
  });

  it('should render the dashboard if user is authenticated', () => {
    useApp.mockReturnValue({
      t: (key, def) => def || key,
      user: { email: 'admin@example.com', photoURL: 'https://example.com/photo.jpg' },
    });

    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );
    expect(screen.getByText(/admin_dashboard_title/i)).toBeDefined();
    expect(screen.getByText(/Total Users/i)).toBeDefined();
    expect(screen.getByText(/100/)).toBeDefined();
  });
});
