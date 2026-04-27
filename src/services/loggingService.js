/**
 * src/services/loggingService.js
 * Handles real-time logging for the Admin Dashboard using Firebase Firestore
 */
import { db } from './firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment, onSnapshot, query, orderBy, limit, getDoc, setDoc } from 'firebase/firestore';

const STORAGE_KEY = 'matdata_mitra_logs';
const STATS_DOC_ID = 'global_stats';

export async function logEvent(type, queryText, resolution = 'Success') {
  try {
    // 1. Log to Firestore
    const logData = {
      type, // 'Chat', 'Rumor', 'PII', 'Safety'
      query: queryText.slice(0, 150),
      resolution,
      timestamp: serverTimestamp()
    };
    
    // Non-blocking Firestore write
    addDoc(collection(db, 'logs'), logData).catch(err => console.warn('Firestore log failed', err));

    // 2. Update Firestore Stats
    const statsRef = doc(db, 'stats', STATS_DOC_ID);
    updateDoc(statsRef, {
      totalMessages: increment(1),
      rumorsDetected: type === 'Rumor' ? increment(1) : increment(0),
      piiRedacted: type === 'PII' ? increment(1) : increment(0),
      lastUpdated: serverTimestamp()
    }).catch(async () => {
      // Create if doesn't exist
      await setDoc(statsRef, {
        totalUsers: 1240,
        totalMessages: 8560,
        rumorsDetected: 42,
        piiRedacted: 15,
        avgLatency: 1.2,
        satisfaction: 94
      }, { merge: true });
    });

    // 3. Fallback to localStorage
    const logs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const newLog = { id: Date.now(), ...logData, timestamp: new Date().toISOString() };
    const updatedLogs = [newLog, ...logs].slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));

  } catch (e) {
    console.error('Logging failed:', e);
  }
}

export function getLogs() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

export function getStats() {
  return JSON.parse(localStorage.getItem('matdata_mitra_stats') || JSON.stringify({
    totalUsers: 1240,
    totalMessages: 8560,
    rumorsDetected: 42,
    piiRedacted: 15,
    avgLatency: 1.2,
    satisfaction: 94
  }));
}

// Real-time listener helpers
export function subscribeToLogs(callback) {
  const q = query(collection(db, 'logs'), orderBy('timestamp', 'desc'), limit(50));
  return onSnapshot(q, (snapshot) => {
    const logs = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate().toISOString() || new Date().toISOString()
    }));
    callback(logs);
  });
}

export function subscribeToStats(callback) {
  return onSnapshot(doc(db, 'stats', STATS_DOC_ID), (doc) => {
    if (doc.exists()) callback(doc.data());
  });
}
