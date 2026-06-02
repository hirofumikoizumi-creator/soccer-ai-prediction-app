import { useEffect } from 'react';
import { initializeGlobalErrorHandler } from '@/services/globalErrorHandler';

export default function App() {
  useEffect(() => {
    // Initialize global error handler as early as possible
    try {
      initializeGlobalErrorHandler();
    } catch (error) {
      console.warn('Failed to initialize global error handler:', error);
    }
  }, []);

  return null;
}
