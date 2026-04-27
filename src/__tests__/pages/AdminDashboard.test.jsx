import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AdminDashboard from '@/pages/AdminDashboard';
import { AppProvider } from '@/context/AppContext';
import { BrowserRouter } from 'react-router-dom';

describe('AdminDashboard', () => {
  it('should render the dashboard title', () => {
    render(
      <BrowserRouter>
        <AppProvider>
          <AdminDashboard />
        </AppProvider>
      </BrowserRouter>
    );
    expect(screen.getByText(/Admin Intelligence Dashboard/i)).toBeDefined();
  });

  it('should display usage metrics', () => {
    render(
      <BrowserRouter>
        <AppProvider>
          <AdminDashboard />
        </AppProvider>
      </BrowserRouter>
    );
    expect(screen.getByText(/Total Users/i)).toBeDefined();
    expect(screen.getByText(/Rumors Blocked/i)).toBeDefined();
  });
});
