/**
 * App Initialization Service
 * 
 * This service handles deferred initialization tasks that don't need to happen
 * during app startup. These tasks are scheduled to run after the app is fully rendered.
 */

import { preloadCriticalImages, preloadSecondaryImages } from '@/utils/lazyImageLoader';

/**
 * Flag to track if initialization has been done
 */
let initializationDone = false;

/**
 * Initialize critical app resources
 * This should be called after the app is fully rendered
 */
export async function initializeCriticalResources(): Promise<void> {
  if (initializationDone) {
    return;
  }

  try {
    // Preload critical images for better UX
    preloadCriticalImages();
    console.log('Critical resources initialized');
  } catch (error) {
    console.error('Error initializing critical resources:', error);
  }
}

/**
 * Initialize secondary app resources
 * This should be called after critical resources are loaded
 */
export async function initializeSecondaryResources(): Promise<void> {
  try {
    // Preload secondary images
    preloadSecondaryImages();
    console.log('Secondary resources initialized');
    initializationDone = true;
  } catch (error) {
    console.error('Error initializing secondary resources:', error);
  }
}

/**
 * Schedule deferred initialization
 * This function schedules initialization tasks to run after app startup
 */
export function scheduleDeferredInitialization(): void {
  // Schedule critical resources to load after a short delay
  setTimeout(() => {
    initializeCriticalResources().catch((error) => {
      console.error('Failed to initialize critical resources:', error);
    });
  }, 500);

  // Schedule secondary resources to load after critical resources
  setTimeout(() => {
    initializeSecondaryResources().catch((error) => {
      console.error('Failed to initialize secondary resources:', error);
    });
  }, 1500);
}
