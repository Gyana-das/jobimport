// utils/api.js
import dotenv from 'dotenv';
// dotenv.config();
const API_BASE = process.env.API_BASE || "http://localhost:5000/api/jobs";

// Helper: fetch with retry logic
async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    if (retries > 0) {
      console.warn(`Retrying ${url}... attempts left: ${retries}`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    throw new Error(`Request failed after retries: ${err.message}`);
  }
}

export async function triggerImport() {
  return fetchWithRetry(`${API_BASE}/import`, { method: "GET" });
}


export async function fetchHistory() {
  return fetchWithRetry(`${API_BASE}/history`);
}
