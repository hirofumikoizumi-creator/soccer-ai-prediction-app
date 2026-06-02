/**
 * Lazy Image Loader Utility
 * 
 * This utility provides lazy loading for images to reduce memory usage at app startup.
 * Images are only loaded when they are actually needed, not at app initialization.
 */

import { useMemo } from 'react';

/**
 * Cache for preloaded images
 */
const imageCache = new Map<string, any>();

/**
 * Preload an image into cache
 * @param key - Unique identifier for the image
 * @param source - Image source (require or URI)
 */
export function preloadImage(key: string, source: any): void {
  if (!imageCache.has(key)) {
    imageCache.set(key, source);
  }
}

/**
 * Get a preloaded image from cache
 * @param key - Unique identifier for the image
 * @returns Image source or undefined if not preloaded
 */
export function getCachedImage(key: string): any {
  return imageCache.get(key);
}

/**
 * Clear image cache
 */
export function clearImageCache(): void {
  imageCache.clear();
}

/**
 * React hook for lazy loading images
 * @param key - Unique identifier for the image
 * @param source - Image source (require or URI)
 * @param preload - Whether to preload immediately
 * @returns Image source
 */
export function useLazyImage(key: string, source: any, preload = false): any {
  return useMemo(() => {
    if (preload) {
      preloadImage(key, source);
    }
    return getCachedImage(key) || source;
  }, [key, source, preload]);
}

/**
 * Preload critical images for better UX
 * Call this after app initialization (not during startup)
 */
export function preloadCriticalImages(): void {
  // These images are used in the main UI
  preloadImage('logo-glow', require('@/assets/images/logo-glow.png'));
  preloadImage('expo-logo', require('@/assets/images/expo-logo.png'));
  preloadImage('home-icon', require('@/assets/images/tabIcons/home.png'));
}

/**
 * Preload secondary images for better UX
 * Call this after critical images are loaded
 */
export function preloadSecondaryImages(): void {
  preloadImage('explore-icon', require('@/assets/images/tabIcons/explore.png'));
  preloadImage('expo-badge', require('@/assets/images/expo-badge.png'));
  preloadImage('expo-badge-white', require('@/assets/images/expo-badge-white.png'));
  preloadImage('tutorial-web', require('@/assets/images/tutorial-web.png'));
  preloadImage('react-logo', require('@/assets/images/react-logo.png'));
}
