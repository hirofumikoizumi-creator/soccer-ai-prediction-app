import { useEffect } from 'react';

/**
 * Minimal App initialization
 * All heavy lifting is deferred to after the UI is rendered
 */
export default function App() {
  useEffect(() => {
    // Schedule all initialization for after the app is visible
    // This prevents blocking the main thread during startup
    const timeoutId = setTimeout(() => {
      try {
        initializeAppAsync();
      } catch (error) {
        console.error('[App] Async initialization failed:', error);
        // Continue anyway - don't crash
      }
    }, 100); // 100ms delay to ensure UI is rendered first

    return () => clearTimeout(timeoutId);
  }, []);

  return null;
}

/**
 * Async initialization - runs after UI is rendered
 */
async function initializeAppAsync(): Promise<void> {
  try {
    // 1. Initialize error handler (non-blocking)
    await initializeErrorHandling();

    // 2. Initialize memory management (non-blocking)
    await initializeMemoryManagement();

    // 3. Initialize XPC handling (non-blocking)
    await initializeXPCHandling();

    console.log('[App] Async initialization completed');
  } catch (error) {
    console.error('[App] Initialization error:', error);
    // Don't crash - just log and continue
  }
}

/**
 * Initialize error handling
 */
async function initializeErrorHandling(): Promise<void> {
  try {
    const { initializeGlobalErrorHandler } = await import('@/services/globalErrorHandler');
    initializeGlobalErrorHandler();
    console.log('[App] Error handler initialized');
  } catch (error) {
    console.warn('[App] Failed to initialize error handler:', error);
  }
}

/**
 * Initialize memory management
 */
async function initializeMemoryManagement(): Promise<void> {
  try {
    const { initializeMemoryLifecycleManager } = await import(
      '@/services/memoryLifecycleManager'
    );
    initializeMemoryLifecycleManager();
    console.log('[App] Memory management initialized');
  } catch (error) {
    console.warn('[App] Failed to initialize memory management:', error);
  }
}

/**
 * Initialize XPC handling
 */
async function initializeXPCHandling(): Promise<void> {
  try {
    const { initializeXPCHandling: initXPC, getMainThreadWatchdog } = await import(
      '@/services/xpcMessageHandler'
    );
    initXPC();

    // Start reporting activity to watchdog
    const watchdog = getMainThreadWatchdog();
    if (watchdog) {
      const activityInterval = setInterval(() => {
        watchdog.reportActivity();
      }, 2000);

      // Store interval ID for cleanup (optional)
      (global as Record<string, unknown>)._watchdogInterval = activityInterval;
    }

    console.log('[App] XPC handling initialized');
  } catch (error) {
    console.warn('[App] Failed to initialize XPC handling:', error);
  }
}
