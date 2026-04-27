import { describe, it, expect, vi, beforeEach } from 'vitest';
import { translateText } from '@/services/translationService';

describe('translationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    vi.stubEnv('VITE_GOOGLE_CLOUD_API_KEY', 'mock-key');
  });

  it('should return original text if target is English', async () => {
    const result = await translateText('Original', 'en');
    expect(result).toBe('Original');
  });

  it('should call Google Translation API when key is present', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        data: {
          translations: [{ translatedText: 'Translated Google' }]
        }
      })
    });

    const result = await translateText('Text 1', 'hi');
    expect(result).toBe('Translated Google');
  });

  it('should fallback to MyMemory if Google API fails', async () => {
    // Mock Google Failure
    global.fetch.mockResolvedValueOnce({ ok: false });
    
    // Mock MyMemory Success
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        responseStatus: 200,
        responseData: { translatedText: 'Translated Fallback' }
      })
    });

    const result = await translateText('Text 2', 'hi');
    expect(result).toBe('Translated Fallback');
  });
});
