import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../src/components/Button';
import { LogoMark } from '../../src/components/Logo';
import { colors, fonts, radii, spacing } from '../../src/theme';

const STEPS = [
  { icon: 'flag-outline', title: 'Set your target', body: 'Tell us the net income you want to earn this year.' },
  { icon: 'calculator-outline', title: 'Share your numbers', body: 'Average sale, commission, and how often you close.' },
  { icon: 'trending-up-outline', title: 'Get your roadmap', body: 'We map the deals and leads to hit your goal.' },
];

export default function IncomeWelcome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Coming from login there's nothing to pop to, so skip straight into the app.
  const onClose = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)');
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <Pressable style={styles.close} onPress={onClose}>
        <Ionicons name="close" size={24} color={colors.white} />
      </Pressable>

      <View style={styles.body}>
        <LogoMark size={64} />
        <Text style={styles.title}>Income by Design</Text>
        <Text style={styles.subtitle}>
          Reverse-engineer your income goal into a simple, weekly action plan.
        </Text>

        <View style={styles.steps}>
          {STEPS.map((s, i) => (
            <View key={s.title} style={styles.step}>
              <View style={styles.stepIcon}>
                <Ionicons name={s.icon as any} size={20} color={colors.teal} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepTitle}>
                  {i + 1}. {s.title}
                </Text>
                <Text style={styles.stepBody}>{s.body}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button label="Start My Plan" variant="teal" onPress={() => router.push('/income/steps')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.navy, paddingHorizontal: spacing.xl },
  close: { alignSelf: 'flex-start', padding: spacing.sm, marginTop: spacing.sm },
  body: { flex: 1, justifyContent: 'center' },
  title: {
    fontFamily: fonts.heading,
    fontSize: 30,
    color: colors.white,
    marginTop: spacing.xl,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginTop: spacing.md,
    lineHeight: 24,
  },
  steps: { marginTop: spacing.xxl, gap: spacing.lg },
  step: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  stepIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(39,183,206,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTitle: { fontFamily: fonts.bodySemi, fontSize: 16, color: colors.white },
  stepBody: { fontFamily: fonts.body, fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  footer: { paddingTop: spacing.lg },
});
