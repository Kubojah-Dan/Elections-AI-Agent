/**
 * src/utils/securityUtils.js
 * Security and Sanitization Utilities
 */

/**
 * Sanitize HTML/Text output to prevent XSS
 * Simple implementation for demonstration; in production use DOMPurify
 */
export function sanitizeHTML(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Redact sensitive PII from strings
 */
export function redactPII(text) {
  if (!text) return text;
  return text
    .replace(/\b\d{10,12}\b/g, '[REDACTED ID]') // Potential Aadhaar/Phone
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[REDACTED EMAIL]')
    .replace(/\b[A-Z]{5}\d{4}[A-Z]\b/g, '[REDACTED PAN]');
}

/**
 * Basic rate limiter for frontend actions
 */
const rateLimits = new Map();

export function checkRateLimit(action, limit = 5, period = 60000) {
  const now = Date.now();
  const history = rateLimits.get(action) || [];
  
  // Filter history to keep only within period
  const recent = history.filter(t => now - t < period);
  
  if (recent.length >= limit) {
    return false;
  }
  
  recent.push(now);
  rateLimits.set(action, recent);
  return true;
}
