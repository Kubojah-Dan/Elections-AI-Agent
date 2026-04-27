/**
 * src/services/loggingService.js
 * Handles real-time logging for the Admin Dashboard using localStorage
 */

const STORAGE_KEY = 'matdata_mitra_logs';

export function logEvent(type, query, resolution = 'Success') {
  try {
    const logs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const newLog = {
      id: Date.now(),
      type, // 'Chat', 'Rumor', 'PII', 'Safety'
      query: query.slice(0, 100),
      resolution,
      timestamp: new Date().toISOString()
    };
    
    // Keep last 100 logs
    const updatedLogs = [newLog, ...logs].slice(0, 100);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
    
    // Update aggregate stats
    const stats = JSON.parse(localStorage.getItem('matdata_mitra_stats') || JSON.stringify({
      totalUsers: 1,
      totalMessages: 0,
      rumorsDetected: 0,
      piiRedacted: 0,
      avgLatency: 1.2,
      satisfaction: 94,
      intents: {}
    }));
    
    stats.totalMessages += 1;
    if (type === 'Rumor') stats.rumorsDetected += 1;
    if (type === 'PII') stats.piiRedacted += 1;
    
    // Simulate slight variations for "real-time" feel
    stats.avgLatency = +(1.0 + Math.random() * 0.5).toFixed(1);
    stats.satisfaction = Math.max(90, Math.min(98, stats.satisfaction + (Math.random() > 0.5 ? 0.1 : -0.1)));
    
    localStorage.setItem('matdata_mitra_stats', JSON.stringify(stats));
  } catch (e) {
    console.error('Logging failed:', e);
  }
}

export function getLogs() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

export function getStats() {
  return JSON.parse(localStorage.getItem('matdata_mitra_stats') || JSON.stringify({
    totalUsers: 1,
    totalMessages: 0,
    rumorsDetected: 0,
    piiRedacted: 0,
    intents: {}
  }));
}
