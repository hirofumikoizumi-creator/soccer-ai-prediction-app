import { Stack, DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';
import { useEffect } from 'react';
import { Colors } from '@/constants/colors';
import { scheduleDeferredInitialization } from '@/services/appInitializationService';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Schedule deferred initialization after app is rendered
    scheduleDeferredInitialization();
  }, []);


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
