import { useEffect } from 'react';
import { initializeGlobalErrorHandler } from '@/services/globalErrorHandler';
import {
  initializeXPCHandling,
  cleanupXPCHandling,
  getMainThreadWatchdog,
} from '@/services/xpcMessageHandler';
import {
  initializeMemoryLifecycleManager,
  cleanupMemoryLifecycleManager,
} from '@/services/memoryLifecycleManager';

export default function App() {
  useEffect(() => {
    // Initialize all safety systems as early as possible
    try {
      // 1. Initialize global error handler
      initializeGlobalErrorHandler();

      // 2. Initialize memory lifecycle manager
      initializeMemoryLifecycleManager();

      // 3. Initialize XPC handling and main thread watchdog
      initializeXPCHandling();

      // 4. Report initial activity to watchdog
      const watchdog = getMainThreadWatchdog();
      if (watchdog) {
        watchdog.reportActivity();
      }

      console.log('[App] All safety systems initialized');
    } catch (error) {
      console.warn('[App] Failed to initialize safety systems:', error);
    }

    // Cleanup on unmount
    return () => {
      try {
        cleanupXPCHandling();
        cleanupMemoryLifecycleManager();
        console.log('[App] Safety systems cleaned up');
      } catch (error) {
        console.warn('[App] Failed to cleanup safety systems:', error);
      }
    };
  }, []);

  // Report activity periodically to watchdog
  useEffect(() => {
    const interval = setInterval(() => {
      const watchdog = getMainThreadWatchdog();
      if (watchdog) {
        watchdog.reportActivity();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
