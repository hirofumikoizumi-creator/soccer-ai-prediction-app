import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Colors } from '@/constants/colors';

export default function RootLayout() {
  const colorScheme = useColorScheme();

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
