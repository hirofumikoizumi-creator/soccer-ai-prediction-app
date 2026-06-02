/**
 * App Initialization Service
 * 
 * This service handles deferred initialization tasks that don't need to happen
 * during app startup. These tasks are scheduled to run after the app is fully rendered.
 * 
 * All initialization errors are caught and logged but do not crash the app.
 * 
 * Includes:
 * - Build 8: Main thread interceptor
 * - Build 9: Memory safety audit
 * - Build 10: Code-level memory safety verification
 */

import { preloadCriticalImages, preloadSecondaryImages } from '@/utils/lazyImageLoader';
import { initializeMemorySafetyAudit } from '@/services/memorySafetyAudit';
import { initializeCodeLevelMemorySafety } from '@/services/codeLevelMemorySafety';

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
    // Wrap in try-catch to prevent any image loading errors from crashing the app
    try {
      preloadCriticalImages();
      console.log('Critical resources initialized');
    } catch (imageError) {
      console.warn('Non-critical image loading error:', imageError);
      // Continue anyway - image loading errors should not crash the app
    }
  } catch (error) {
    console.warn('Error initializing critical resources (non-critical):', error);
    // Continue anyway - initialization errors should not crash the app
  }
}

/**
 * Initialize secondary app resources
 * This should be called after critical resources are loaded
 */
export async function initializeSecondaryResources(): Promise<void> {
  try {
    // Preload secondary images
    // Wrap in try-catch to prevent any image loading errors from crashing the app
    try {
      preloadSecondaryImages();
      console.log('Secondary resources initialized');
    } catch (imageError) {
      console.warn('Non-critical secondary image loading error:', imageError);
      // Continue anyway - image loading errors should not crash the app
    }
    initializationDone = true;
  } catch (error) {
    console.warn('Error initializing secondary resources (non-critical):', error);
    initializationDone = true; // Mark as done even if there's an error
  }
}

/**
 * Schedule deferred initialization
 * This function schedules initialization tasks to run after app startup
 * Returns a promise that resolves when scheduling is complete (not when tasks finish)
 * 
 * Includes:
 * - Build 8: Main thread interceptor (already initialized in App.tsx)
 * - Build 9: Memory safety audit (scheduled at 2000ms)
 * - Build 10: Code-level memory safety verification (scheduled at 2500ms)
 */
export async function scheduleDeferredInitialization(): Promise<void> {
  try {
    // Schedule critical resources to load after a short delay
    // Use setTimeout to ensure this doesn't block app startup
    setTimeout(() => {
      try {
        initializeCriticalResources().catch((error) => {
          console.warn('Failed to initialize critical resources (non-critical):', error);
        });
      } catch (error) {
        console.warn('Error scheduling critical resources:', error);
      }
    }, 500);

    // Schedule secondary resources to load after critical resources
    setTimeout(() => {
      try {
        initializeSecondaryResources().catch((error) => {
          console.warn('Failed to initialize secondary resources (non-critical):', error);
        });
      } catch (error) {
        console.warn('Error scheduling secondary resources:', error);
      }
    }, 1500);

    // Schedule memory safety audit (Build 9)
    setTimeout(() => {
      try {
        initializeMemorySafetyAudit();
      } catch (error) {
        console.warn('Error initializing memory safety audit:', error);
      }
    }, 2000);

    // Schedule code-level memory safety verification (Build 10)
    setTimeout(() => {
      try {
        initializeCodeLevelMemorySafety();
      } catch (error) {
        console.warn('Error initializing code-level memory safety:', error);
      }
    }, 2500);
  } catch (error) {
    console.warn('Error in scheduleDeferredInitialization:', error);
    // Continue anyway - scheduling errors should not crash the app
  }
}
