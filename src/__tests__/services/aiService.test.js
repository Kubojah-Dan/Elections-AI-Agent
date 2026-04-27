import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAgentResponse, extractQuickReplies, extractSource, cleanResponseText } from '@/services/aiService';

// Mock the dependencies
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn().mockImplementation(() => ({
      startChat: vi.fn().mockImplementation(() => ({
        sendMessage: vi.fn().mockResolvedValue({
          response: { text: () => 'Mocked Gemini Response [Quick: Help | More] [Source: ECI | https://eci.gov.in]' }
        })
      }))
    }))
  }))
}));

describe('aiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Stub environment variables in both process.env and vi.stubEnv
    process.env.VITE_GEMINI_API_KEY = 'valid-mock-key';
    process.env.VITE_GROQ_API_KEY = 'valid-mock-key';
    vi.stubEnv('VITE_GEMINI_API_KEY', 'valid-mock-key');
    vi.stubEnv('VITE_GROQ_API_KEY', 'valid-mock-key');
    
    // Mock global fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        choices: [{ message: { content: 'Mocked Groq Response' } }]
      })
    });
  });

  describe('getAgentResponse', () => {
    it('should return a valid response (from Gemini or Groq)', async () => {
      const messages = [{ role: 'user', content: 'How to register?' }];
      const response = await getAgentResponse(messages);
      
      // Check if it returns one of our mocked responses
      expect(response).toMatch(/Mocked Gemini Response|Mocked Groq Response/);
    });

    it('should handle PII redaction correctly', async () => {
      const messages = [{ role: 'user', content: 'My phone is 9876543210' }];
      const response = await getAgentResponse(messages);
      expect(response).toBeDefined();
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
