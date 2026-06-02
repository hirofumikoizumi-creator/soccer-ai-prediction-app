import { useEffect } from 'react';
import { initializeAdMob, preloadNextAd } from '@/services/admobService';

export default function App() {
  useEffect(() => {
    // Initialize AdMob on app start
    initializeAdMob();
    // Preload first ad
    preloadNextAd();
  }, []);

  return null;
}
