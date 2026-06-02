/**
 * AdMob Service
 * Minimal implementation - AdMob features are disabled for stability
 */

const ADMOB_APP_ID = process.env.EXPO_PUBLIC_ADMOB_APP_ID || '';
const INTERSTITIAL_AD_UNIT_ID = process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_AD_UNIT_ID || '';

/**
 * Initialize AdMob (disabled)
 */
export async function initializeAdMob(): Promise<void> {
  try {
    if (!ADMOB_APP_ID) {
      console.warn('AdMob app ID not configured');
      return;
    }
    console.log('AdMob initialization skipped for stability');
  } catch (error) {
    console.error('Error initializing AdMob:', error);
  }
}

/**
 * Load interstitial ad (disabled)
 */
export async function loadInterstitialAd(): Promise<void> {
  try {
    if (!INTERSTITIAL_AD_UNIT_ID) {
      console.warn('Interstitial ad unit ID not configured');
      return;
    }
    console.log('Ad loading skipped for stability');
  } catch (error) {
    console.error('Error loading interstitial ad:', error);
  }
}

/**
 * Show interstitial ad (disabled)
 */
export async function showInterstitialAd(): Promise<boolean> {
  try {
    console.log('Ad display skipped for stability');
    return false;
  } catch (error) {
    console.error('Error showing interstitial ad:', error);
    return false;
  }
}

/**
 * Preload next ad (disabled)
 */
export async function preloadNextAd(): Promise<void> {
  try {
    console.log('Ad preload skipped for stability');
  } catch (error) {
    console.error('Error preloading ad:', error);
  }
}
