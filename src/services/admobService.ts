/**
 * AdMob Service
 * Integration with react-native-google-mobile-ads
 */

import { MobileAds, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';

const ADMOB_APP_ID = process.env.EXPO_PUBLIC_ADMOB_APP_ID;
const INTERSTITIAL_AD_UNIT_ID = process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_AD_UNIT_ID;

let interstitialAd: InterstitialAd | null = null;

/**
 * Initialize AdMob
 */
export async function initializeAdMob() {
  try {
    if (ADMOB_APP_ID) {
      await MobileAds().initialize();
      console.log('AdMob initialized with app ID:', ADMOB_APP_ID);
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

    // Create a new interstitial ad instance
    interstitialAd = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID);

    // Set up event listeners
    interstitialAd.onAdEvent((type) => {
      if (type === AdEventType.LOADED) {
        console.log('Interstitial ad loaded');
      } else if (type === AdEventType.CLOSED) {
        console.log('Interstitial ad closed');
        // Preload next ad
        loadInterstitialAd();
      } else if (type === AdEventType.ERROR) {
        console.error('Interstitial ad error');
      }
    });

    // Load the ad
    await interstitialAd?.load();
  } catch (error) {
    console.error('Error loading interstitial ad:', error);
  }
}

/**
 * Show interstitial ad
 */
export async function showInterstitialAd(): Promise<boolean> {
  try {
    if (!interstitialAd) {
      console.warn('Interstitial ad not loaded');
      return false;
    }

    // Check if ad is loaded
    const isLoaded = await interstitialAd.isLoaded();
    if (!isLoaded) {
      console.warn('Interstitial ad not ready');
      return false;
    }

    console.log('Showing interstitial ad');
    await interstitialAd.show();
    return true;
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
