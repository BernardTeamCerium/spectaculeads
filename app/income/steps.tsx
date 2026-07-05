import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../src/components/Button';
import { Slider } from '../../src/components/Slider';
import { TechBackdrop } from '../../src/components/TechBackdrop';
import { useApp } from '../../src/state/AppState';
import { colors, fonts, radii, spacing } from '../../src/theme';

interface SliderDef {
  key: 'netIncomeGoal' | 'avgSale' | 'avgCommission';
  label: string;
  min: number;
  max: number;
  step: number;
}

interface StepDef {
  eyebrow: string;
  title: string;
  hint: string;
  slider: SliderDef;
}

/** Compact money label, e.g. 250000 -> "$250k", 1000000 -> "$1M". */
function shortMoney(v: number): string {
  if (v >= 1_000_000) {
    const m = v / 1_000_000;
    return `$${Number.isInteger(m) ? m : (Math.round(m * 10) / 10).toString()}M`;
  }
  if (v >= 1000) {
    const k = v / 1000;
    return `$${Number.isInteger(k) ? k : (Math.round(k * 10) / 10).toString()}k`;
  }
  return `$${v}`;
}

/** Adds a trailing "+" once a slider is maxed out (e.g. "$1M+"). */
function label(v: number, max: number): string {
  return shortMoney(v) + (v >= max ? '+' : '');
}

const STEPS: StepDef[] = [
  {
    eyebrow: 'Step 1 of 3',
    title: 'What income do you want this year?',
    hint: 'Dream big — you can fine-tune it anytime.',
    slider: { key: 'netIncomeGoal', label: 'Target net income', min: 50_000, max: 1_000_000, step: 10_000 },
  },
  {
    eyebrow: 'Step 2 of 3',
    title: 'What’s your average sale?',
    hint: 'The typical premium or policy size you write.',
    slider: { key: 'avgSale', label: 'Average sale', min: 1_000, max: 100_000, step: 1_000 },
  },
  {
    eyebrow: 'Step 3 of 3',
    title: 'What do you earn per sale?',
    hint: 'The commission you personally pocket on a typical deal.',
    slider: { key: 'avgCommission', label: 'Average commission', min: 100, max: 20_000, step: 100 },
  },
];

export default function IncomeSteps() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { planInputs, setPlanInputs, planResults, setPlanComplete } = useApp();
  const [index, setIndex] = useState(0);

  const step = STEPS[index];
  const isLast = index === STEPS.length - 1;

  const next = () => {
    if (isLast) {
      setPlanComplete(true);
      router.replace('/income/results');
    } else {
      setIndex((i) => i + 1);
    }
  };
  const back = () => {
    if (index === 0) router.back();
    else setIndex((i) => i - 1);
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.md }]}>
      <TechBackdrop glowY="42%" />

      {/* Top bar: back + step progress dots */}
      <View style={styles.topBar}>
        <Pressable onPress={back} style={styles.iconBtn} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color={colors.indigo} />
        </Pressable>
        <View style={styles.dots}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === index && styles.dotActive, i < index && styles.dotDone]}
            />
          ))}
        </View>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.body}>
        <Text style={styles.eyebrow}>{step.eyebrow}</Text>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.hint}>{step.hint}</Text>

        {/* Hero value */}
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>{step.slider.label}</Text>
          <Text style={styles.heroValue}>{label(planInputs[step.slider.key], step.slider.max)}</Text>
        </View>

        {/* Slider */}
        <Slider
          value={planInputs[step.slider.key]}
          min={step.slider.min}
          max={step.slider.max}
          step={step.slider.step}
          onChange={(v) => setPlanInputs({ [step.slider.key]: v })}
        />
        <View style={styles.rangeRow}>
          <Text style={styles.rangeText}>{label(step.slider.min, step.slider.max)}</Text>
          <Text style={styles.rangeText}>{label(step.slider.max, step.slider.max)}</Text>
        </View>

        {/* Live roadmap reward */}
        <View style={styles.reward}>
          <View style={styles.rewardHead}>
            <Text style={styles.rewardHeadText}>Your roadmap so far</Text>
          </View>
          <View style={styles.rewardStats}>
            <Reward value={planResults.dealsNeeded} label="deals" />
            <View style={styles.rewardDivider} />
            <Reward value={planResults.appointmentsNeeded} label="appts" />
            <View style={styles.rewardDivider} />
            <Reward value={planResults.leadsNeeded} label="leads" />
          </View>
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button label={isLast ? 'See my plan' : 'Continue'} variant="teal" onPress={next} />
      </View>
    </View>
  );
}

function Reward({ value, label: l }: { value: number; label: string }) {
  return (
    <View style={styles.rewardStat}>
      <Text style={styles.rewardValue}>{value}</Text>
      <Text style={styles.rewardLabel}>{l}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.lightBg, paddingHorizontal: spacing.lg },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  dots: { flex: 1, flexDirection: 'row', justifyContent: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(32,35,78,0.14)' },
  dotActive: { width: 26, backgroundColor: colors.teal },
  dotDone: { backgroundColor: colors.tealDeep },
  body: { flex: 1, paddingTop: spacing.xl },
  eyebrow: {
    fontFamily: fonts.bodySemi,
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.tealDeep,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 28,
    color: colors.text,
    marginTop: spacing.sm,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  hint: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.muted,
    marginTop: spacing.sm,
    lineHeight: 21,
  },
  hero: { alignItems: 'center', marginTop: spacing.xxl, marginBottom: spacing.xl },
  heroLabel: {
    fontFamily: fonts.bodySemi,
    fontSize: 13,
    color: colors.tealDeep,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroValue: {
    fontFamily: fonts.heading,
    fontSize: 60,
    color: colors.indigo,
    letterSpacing: -2,
    marginTop: 6,
  },
  rangeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  rangeText: { fontFamily: fonts.body, fontSize: 12, color: colors.muted },
  reward: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.xl,
    padding: spacing.lg,
    marginTop: spacing.xxl,
    shadowColor: '#1A1D3A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  rewardHead: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'center' },
  rewardHeadText: {
    fontFamily: fonts.bodySemi,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.navy,
    backgroundColor: colors.tealLight,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  rewardStats: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
  rewardStat: { flex: 1, alignItems: 'center' },
  rewardValue: { fontFamily: fonts.heading, fontSize: 24, color: colors.indigo },
  rewardLabel: { fontFamily: fonts.body, fontSize: 12, color: colors.muted, marginTop: 2 },
  rewardDivider: { width: 1, height: 30, backgroundColor: colors.border },
  footer: { paddingTop: spacing.md },
});
