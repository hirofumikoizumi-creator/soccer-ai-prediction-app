import { useEffect } from 'react';
import { initializeAdMob, preloadNextAd } from '@/services/admobService';

export default function App() {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize AdMob on app start
        await initializeAdMob();
        // Preload first ad
        await preloadNextAd();
      } catch (error) {
        console.error('App initialization error:', error);
        // Continue app execution even if initialization fails
      }
    };

    initializeApp();
  }, []);

  return null;
}
