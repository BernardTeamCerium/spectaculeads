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
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { InstallHint } from '../src/components/InstallHint';
import { AppStateProvider } from '../src/state/AppState';
import { DemoTourOverlay, DemoTourProvider } from '../src/state/DemoTour';
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

  const { width, height } = useWindowDimensions();
  // On a wide (desktop) web viewport, frame the app like a phone so a shared
  // link reads as a mobile app. On phones/narrow screens it fills the screen.
  const framed = Platform.OS === 'web' && width > 600;
  const frameHeight = Math.min(height - 32, 880);

  if (!loaded) {
    return <View style={{ flex: 1, backgroundColor: colors.navy }} />;
  }

  const app = (
    <SafeAreaProvider>
      <AppStateProvider>
        <DemoTourProvider>
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
          <InstallHint />
          <DemoTourOverlay />
        </DemoTourProvider>
      </AppStateProvider>
    </SafeAreaProvider>
  );

  if (!framed) return app;

  return (
    <View style={styles.stage}>
      <View style={[styles.phone, { height: frameHeight }]}>{app}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phone: {
    width: 390,
    maxWidth: '100%',
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: colors.lightBg,
    borderWidth: 10,
    borderColor: '#0F1130',
    boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
  },
});
