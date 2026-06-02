import { version } from 'expo/package.json';
import { Image } from 'expo-image';
import { useColorScheme, StyleSheet, useState } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Spacing } from '@/constants/theme';

export function WebBadge() {
  const scheme = useColorScheme();
  const [imageError, setImageError] = useState(false);

  const handleImageError = (error: Error) => {
    console.warn('Badge image failed to load:', error);
    setImageError(true);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="code" themeColor="textSecondary" style={styles.versionText}>
        v{version}
      </ThemedText>
      {!imageError && (
        <Image
          source={
            scheme === 'dark'
              ? require('@/assets/images/expo-badge-white.png')
              : require('@/assets/images/expo-badge.png')
          }
          style={styles.badgeImage}
          onError={handleImageError}
          cachePolicy="memory-disk"
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.five,
    alignItems: 'center',
    gap: Spacing.two,
  },
  versionText: {
    textAlign: 'center',
  },
  badgeImage: {
    width: 123,
    aspectRatio: 123 / 24,
  },
});
