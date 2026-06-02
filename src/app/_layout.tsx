import { Stack, DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/colors';

/**
 * Root layout - minimal initialization
 * All heavy lifting is deferred to App.tsx
 */
export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Render immediately without any initialization
  // App.tsx handles all initialization asynchronously
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
