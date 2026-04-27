import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import WelcomePage from '@/pages/WelcomePage';
import { AppProvider } from '@/context/AppContext';
import { BrowserRouter } from 'react-router-dom';

describe('WelcomePage', () => {
  it('should render the welcome message', () => {
    render(
      <BrowserRouter>
        <AppProvider>
          <WelcomePage />
        </AppProvider>
      </BrowserRouter>
    );
    // Use a regex to find the title since it might be in different languages or has specific formatting
    expect(screen.getByText(/Matdata Mitra/i)).toBeDefined();
  });
});
