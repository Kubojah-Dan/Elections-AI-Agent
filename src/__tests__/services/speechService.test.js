import { describe, it, expect, vi, beforeEach } from 'vitest';
import { speak, stopSpeaking } from '@/services/speechService';

describe('speechService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock getVoices to return something
    window.speechSynthesis.getVoices = vi.fn().mockReturnValue([
      { lang: 'en-IN', name: 'Google Hindi' }
    ]);
  });

  it('should call speechSynthesis.speak with cleaned text', () => {
    speak('**Hello** world [Quick: A]', 'en');
    
    expect(window.speechSynthesis.speak).toHaveBeenCalled();
    const utterance = vi.mocked(window.speechSynthesis.speak).mock.calls[0][0];
    // In our mock, the utterance object will have the properties we set
    expect(utterance.text).toBe('Hello world');
    expect(utterance.lang).toBe('en-IN');
  });

  it('should cancel existing speech before starting new', () => {
    speak('Hello', 'en');
    expect(window.speechSynthesis.cancel).toHaveBeenCalled();
  });

  it('should stop speaking on stopSpeaking call', () => {
    stopSpeaking();
    expect(window.speechSynthesis.cancel).toHaveBeenCalled();
  });
});
