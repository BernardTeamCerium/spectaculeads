import { Stack } from 'expo-router';
import { colors } from '../../src/theme';

export default function IncomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.lightBg },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="steps" />
      <Stack.Screen name="results" />
    </Stack>
  );
}
