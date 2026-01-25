/**
 * Quick Fire Data Storage Utility
 *
 * Persists Quick Fire results in localStorage so they survive
 * the OAuth redirect flow. After successful signup/login,
 * the auth callback retrieves this data to create the Idea.
 */

export interface QuickFireData {
  oneLiner: string;
  score: number;
  keyObjection: string;
  timestamp: number;
}

const STORAGE_KEY = 'plebtest_quick_fire_data';
const EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Store Quick Fire result before redirecting to signup
 */
export function storeQuickFireData(data: Omit<QuickFireData, 'timestamp'>): void {
  if (typeof window === 'undefined') return;

  const storageData: QuickFireData = {
    ...data,
    timestamp: Date.now(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
  } catch (error) {
    console.error('Failed to store Quick Fire data:', error);
  }
}

/**
 * Retrieve Quick Fire data (returns null if expired or missing)
 */
export function retrieveQuickFireData(): QuickFireData | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const data: QuickFireData = JSON.parse(stored);

    // Check if data has expired
    if (Date.now() - data.timestamp > EXPIRY_MS) {
      clearQuickFireData();
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to retrieve Quick Fire data:', error);
    return null;
  }
}

/**
 * Clear stored Quick Fire data (call after processing)
 */
export function clearQuickFireData(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear Quick Fire data:', error);
  }
}

/**
 * Check if there's pending Quick Fire data
 */
export function hasQuickFireData(): boolean {
  return retrieveQuickFireData() !== null;
}
