import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../src/components/Button';
import { LogoMark } from '../../src/components/Logo';
import { TechBackdrop } from '../../src/components/TechBackdrop';
import { colors, fonts, radii, spacing } from '../../src/theme';

interface StepItem {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
}

const STEPS: StepItem[] = [
  {
    icon: 'create-outline',
    title: 'Fill out Income by Design',
    body: 'Answer three quick questions about the income you want and how you sell.',
  },
  {
    icon: 'map-outline',
    title: 'Get your roadmap',
    body: 'We reverse-engineer the deals, appointments, and leads to hit your goal.',
  },
  {
    icon: 'rocket-outline',
    title: 'Start closing',
    body: 'Buy leads, work your inbox, and track real closed dollars against your plan.',
  },
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
    <View style={[styles.screen, { paddingTop: insets.top + spacing.sm }]}>
      <TechBackdrop glowY="18%" />

      <View style={styles.topRow}>
        <View style={styles.brand}>
          <LogoMark size={30} />
          <Text style={styles.brandText}>Spectaculeads</Text>
        </View>
        <Pressable style={styles.skip} onPress={onClose} hitSlop={8}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      <View style={styles.body}>
        <Text style={styles.eyebrow}>Welcome aboard</Text>
        <Text style={styles.title}>Let’s design your income</Text>
        <Text style={styles.subtitle}>
          Your first step is the Income by Design form — it turns the income you want into a clear,
          weekly game plan.
        </Text>

        <View style={styles.steps}>
          {STEPS.map((s, i) => {
            const first = i === 0;
            return (
              <View key={s.title} style={[styles.step, first && styles.stepFirst]}>
                <View style={[styles.stepIcon, first && styles.stepIconFirst]}>
                  <Ionicons
                    name={s.icon}
                    size={20}
                    color={first ? colors.navy : colors.tealDeep}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.stepTitleRow}>
                    <Text style={[styles.stepTitle, first && styles.stepTitleFirst]}>
                      {i + 1}. {s.title}
                    </Text>
                    {first ? (
                      <View style={styles.startHere}>
                        <Text style={styles.startHereText}>Start here</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.stepBody}>{s.body}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button label="Start step 1" variant="teal" onPress={() => router.push('/income/steps')} />
        <Text style={styles.footNote}>Takes about a minute · no numbers are final</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.lightBg, paddingHorizontal: spacing.xl },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  brandText: {
    fontFamily: fonts.headingSemi,
    fontSize: 15,
    color: colors.indigo,
    letterSpacing: -0.2,
  },
  skip: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  skipText: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.muted },
  body: { flex: 1, justifyContent: 'center' },
  eyebrow: {
    fontFamily: fonts.bodySemi,
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.tealDeep,
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 32,
    color: colors.text,
    letterSpacing: -0.6,
    lineHeight: 38,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.muted,
    marginTop: spacing.md,
    lineHeight: 24,
  },
  steps: { marginTop: spacing.xxl, gap: spacing.md },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.lg,
  },
  stepFirst: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: 'rgba(39,183,206,0.35)',
    shadowColor: '#1A1D3A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  stepIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(39,183,206,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIconFirst: { backgroundColor: colors.teal },
  stepTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  stepTitle: { fontFamily: fonts.bodySemi, fontSize: 16, color: colors.text },
  stepTitleFirst: { color: colors.indigo },
  startHere: {
    backgroundColor: colors.teal,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.pill,
  },
  startHereText: {
    fontFamily: fonts.bodySemi,
    fontSize: 10,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.navy,
  },
  stepBody: { fontFamily: fonts.body, fontSize: 14, color: colors.muted, marginTop: 3, lineHeight: 20 },
  footer: { paddingTop: spacing.lg },
  footNote: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
