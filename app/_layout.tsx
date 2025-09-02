import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { SettingsProvider, useSettings } from '@/contexts/SettingsContext';
import { DatabaseProvider } from '@/database/DatabaseContext';

function AppContent() {
  const { darkTheme } = useSettings();
  
  return (
    <ThemeProvider value={darkTheme ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="recipe/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="cooking/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={darkTheme ? 'light' : 'auto'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <SettingsProvider>
      <DatabaseProvider>
        <AppContent />
      </DatabaseProvider>
    </SettingsProvider>
  );
}
