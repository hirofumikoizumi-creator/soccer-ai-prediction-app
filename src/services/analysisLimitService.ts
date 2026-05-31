import AsyncStorage from '@react-native-async-storage/async-storage';

const ANALYSIS_LIMIT_KEY = 'analysis_limit_data';
const DAILY_LIMIT = 3;

interface AnalysisLimitData {
  count: number;
  date: string; // YYYY-MM-DD format
}

/**
 * Get the current date in YYYY-MM-DD format
 */
function getCurrentDate(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

/**
 * Get the current analysis count for today
 */
export async function getAnalysisCount(): Promise<number> {
  try {
    const data = await AsyncStorage.getItem(ANALYSIS_LIMIT_KEY);
    if (!data) {
      return 0;
    }

    const limitData: AnalysisLimitData = JSON.parse(data);
    const today = getCurrentDate();

    // If it's a new day, reset the count
    if (limitData.date !== today) {
      return 0;
    }

    return limitData.count;
  } catch (error) {
    console.error('Error getting analysis count:', error);
    return 0;
  }
}

/**
 * Get remaining analysis count for today
 */
export async function getRemainingAnalysisCount(): Promise<number> {
  const count = await getAnalysisCount();
  return Math.max(0, DAILY_LIMIT - count);
}

/**
 * Check if analysis is allowed today
 */
export async function canAnalyze(): Promise<boolean> {
  const count = await getAnalysisCount();
  return count < DAILY_LIMIT;
}

/**
 * Increment analysis count
 */
export async function incrementAnalysisCount(): Promise<void> {
  try {
    const currentCount = await getAnalysisCount();
    const today = getCurrentDate();

    const limitData: AnalysisLimitData = {
      count: currentCount + 1,
      date: today,
    };

    await AsyncStorage.setItem(ANALYSIS_LIMIT_KEY, JSON.stringify(limitData));
  } catch (error) {
    console.error('Error incrementing analysis count:', error);
  }
}

/**
 * Get daily limit constant
 */
export function getDailyLimit(): number {
  return DAILY_LIMIT;
}

/**
 * Reset analysis count (for testing or admin purposes)
 */
export async function resetAnalysisCount(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ANALYSIS_LIMIT_KEY);
  } catch (error) {
    console.error('Error resetting analysis count:', error);
  }
}
