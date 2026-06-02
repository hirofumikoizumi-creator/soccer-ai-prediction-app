import { Stack, DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';
import { useEffect } from 'react';
import { Colors } from '@/constants/colors';
import { scheduleDeferredInitialization } from '@/services/appInitializationService';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    try {
      // Schedule deferred initialization after app is rendered
      // Wrap in try-catch to prevent crashes from initialization errors
      scheduleDeferredInitialization().catch((error) => {
        console.warn('Deferred initialization error (non-critical):', error);
        // Continue anyway - initialization errors should not crash the app
      });
    } catch (error) {
      console.warn('Layout initialization error:', error);
      // Continue anyway - errors should not prevent app from rendering
    }
  }, []);

  // Render immediately without waiting for initialization
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="home"
          options={{
            title: 'サッカーAI予想',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="confirmation"
          options={{
            title: '認識結果確認',
          }}
        />
        <Stack.Screen
          name="result"
          options={{
            title: '分析結果',
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
