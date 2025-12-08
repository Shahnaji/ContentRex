// Usage tracking for free (non-authenticated) users
// Tracks usage in localStorage to limit to 3 free generations

const USAGE_KEY = 'contentrex_free_usage';
const MAX_FREE_USAGE = 3;

export interface UsageData {
  count: number;
  lastReset: string;
}

export function getUsageData(): UsageData {
  const stored = localStorage.getItem(USAGE_KEY);
  if (!stored) {
    return { count: 0, lastReset: new Date().toISOString() };
  }
  
  try {
    return JSON.parse(stored);
  } catch {
    return { count: 0, lastReset: new Date().toISOString() };
  }
}

export function incrementUsage(): void {
  const usage = getUsageData();
  usage.count += 1;
  localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
}

export function getRemainingFreeUsage(): number {
  const usage = getUsageData();
  return Math.max(0, MAX_FREE_USAGE - usage.count);
}

export function hasReachedFreeLimit(): boolean {
  return getRemainingFreeUsage() === 0;
}

export function resetUsage(): void {
  localStorage.removeItem(USAGE_KEY);
}
