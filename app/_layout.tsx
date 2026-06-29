import {
  Sora_400Regular,
  Sora_600SemiBold,
  Sora_700Bold,
} from '@expo-google-fonts/sora';
import {
  Figtree_400Regular,
  Figtree_500Medium,
  Figtree_600SemiBold,
  Figtree_700Bold,
} from '@expo-google-fonts/figtree';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppStateProvider } from '../src/state/AppState';
import { colors } from '../src/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [loaded] = useFonts({
    Sora_400Regular,
    Sora_600SemiBold,
    Sora_700Bold,
    Figtree_400Regular,
    Figtree_500Medium,
    Figtree_600SemiBold,
    Figtree_700Bold,
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync().catch(() => {});
  }, [loaded]);

  if (!loaded) {
    return <View style={{ flex: 1, backgroundColor: colors.navy }} />;
  }

  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.lightBg },
            animation: 'slide_from_right',
            animationDuration: 220,
          }}
        >
          <Stack.Screen name="index" options={{ animation: 'fade' }} />
          <Stack.Screen name="login" options={{ animation: 'fade' }} />
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
          <Stack.Screen name="income" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="lead/[id]" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="checkout" options={{ presentation: 'modal' }} />
        </Stack>
      </AppStateProvider>
    </SafeAreaProvider>
  );
}
