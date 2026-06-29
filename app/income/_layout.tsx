import { Stack } from 'expo-router';
import { colors } from '../../src/theme';

export default function IncomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.lightBg },
        animation: 'slide_from_right',
        animationDuration: 220,
      }}
    >
      <Stack.Screen name="index" options={{ animation: 'fade' }} />
      <Stack.Screen name="steps" />
      <Stack.Screen name="results" options={{ animation: 'fade' }} />
    </Stack>
  );
}
