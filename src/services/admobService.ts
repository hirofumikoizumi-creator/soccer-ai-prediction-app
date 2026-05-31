/**
 * AdMob Service
 * Placeholder implementation for AdMob integration
 * In production, integrate with google-mobile-ads-react-native
 */

const ADMOB_APP_ID = process.env.EXPO_PUBLIC_ADMOB_APP_ID;
const INTERSTITIAL_AD_UNIT_ID = process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_AD_UNIT_ID;

interface InterstitialAd {
  adUnitId: string;
  isLoaded: boolean;
}

let interstitialAd: InterstitialAd | null = null;

/**
 * Initialize AdMob
 */
export function initializeAdMob() {
  try {
    if (ADMOB_APP_ID) {
      console.log('AdMob initialized with app ID:', ADMOB_APP_ID);
      // In production, initialize with: MobileAds.initialize()
    }
  } catch (error) {
    console.error('Error initializing AdMob:', error);
  }
}

/**
 * Load interstitial ad
 */
export async function loadInterstitialAd() {
  try {
    if (!INTERSTITIAL_AD_UNIT_ID) {
      console.warn('Interstitial ad unit ID not configured');
      return;
    }

    interstitialAd = {
      adUnitId: INTERSTITIAL_AD_UNIT_ID,
      isLoaded: true,
    };

    console.log('Interstitial ad loaded');
  } catch (error) {
    console.error('Error loading interstitial ad:', error);
  }
}

/**
 * Show interstitial ad
 */
export async function showInterstitialAd(): Promise<boolean> {
  try {
    if (!interstitialAd || !interstitialAd.isLoaded) {
      console.warn('Interstitial ad not loaded');
      return false;
    }

    console.log('Showing interstitial ad');
    // Simulate ad display duration
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Interstitial ad closed');
        resolve(true);
      }, 2000);
    });
  } catch (error) {
    console.error('Error showing interstitial ad:', error);
    return false;
  }
}

/**
 * Preload next ad for better UX
 */
export async function preloadNextAd() {
  try {
    await loadInterstitialAd();
  } catch (error) {
    console.error('Error preloading ad:', error);
  }
}
