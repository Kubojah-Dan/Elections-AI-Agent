import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the dependencies FIRST
const mockSendMessage = vi.fn();
const mockGetGenerativeModel = vi.fn().mockReturnValue({
  startChat: vi.fn().mockReturnValue({
    sendMessage: mockSendMessage
  })
});

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: mockGetGenerativeModel
  }))
}));

vi.mock('@/services/loggingService', () => ({
  logEvent: vi.fn(),
}));

// Set env before import
vi.stubEnv('VITE_GEMINI_API_KEY', 'valid-mock-key');

// Import AFTER mocks
const { getAgentResponse, extractQuickReplies, extractSource, cleanResponseText } = await import('@/services/aiService');

describe('aiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('VITE_GEMINI_API_KEY', 'valid-mock-key');
    // Ensure process.env is also set
    if (typeof process !== 'undefined') {
      process.env.VITE_GEMINI_API_KEY = 'valid-mock-key';
    }
    
    // Mock window.navigator.onLine
    Object.defineProperty(window.navigator, 'onLine', {
      value: true,
      configurable: true
    });
    
    mockSendMessage.mockResolvedValue({
      response: { text: () => 'Mocked Gemini Response [Quick: Help | More] [Source: ECI | https://eci.gov.in]' }
    });
  });

  describe('getAgentResponse', () => {
    it('should return a valid response from Gemini', async () => {
      const messages = [{ role: 'user', content: 'How to register?' }];
      const response = await getAgentResponse(messages, null, 'en');
      expect(response).toContain('Mocked Gemini Response');
    });

    it('should handle PII redaction correctly', async () => {
      const messages = [{ role: 'user', content: 'My Aadhaar is 1234 5678 9012' }];
      await getAgentResponse(messages);
      const lastCall = mockSendMessage.mock.calls[0][0];
      expect(lastCall).toContain('[AADHAAR]');
    });

    it('should detect rumors and add a prefix', async () => {
      const messages = [{ role: 'user', content: 'Is the EVM hacked?' }];
      const response = await getAgentResponse(messages);
      expect(response).toContain('Neutral Fact Check');
    });

    it('should return offline response when navigator is offline', async () => {
      Object.defineProperty(window.navigator, 'onLine', { value: false });
      mockSendMessage.mockRejectedValue(new Error('Network Error'));
      
      const messages = [{ role: 'user', content: 'How to register?' }];
      const response = await getAgentResponse(messages);
      expect(response).toContain('You appear to be offline');
    });

    it('should handle authentication errors', async () => {
      mockSendMessage.mockRejectedValue(new Error('API key invalid 401'));
      const messages = [{ role: 'user', content: 'Hello' }];
      const response = await getAgentResponse(messages);
      expect(response).toContain('API Authentication Error');
    });

    it('should handle generic errors with offline fallback', async () => {
      mockSendMessage.mockRejectedValue(new Error('Unknown Error'));
      const messages = [{ role: 'user', content: 'How to vote?' }];
      const response = await getAgentResponse(messages);
      expect(response).toContain('Service temporarily busy');
    });
  });

  describe('Utility Functions', () => {
    it('extractQuickReplies should work', () => {
      expect(extractQuickReplies('[Quick: A | B]')).toEqual(['A', 'B']);
    });

    it('extractSource should work', () => {
      expect(extractSource('[Source: T | U]')).toEqual({ title: 'T', url: 'U' });
    });

    it('cleanResponseText should work', () => {
      expect(cleanResponseText('Hello [Quick: A]')).toBe('Hello');
    });
  });
});
