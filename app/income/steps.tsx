import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../src/components/Button';
import { Slider } from '../../src/components/Slider';
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
    title: 'What NET income do you want this year?',
    hint: 'Your desired take-home income, after splits and expenses.',
    slider: { key: 'netIncomeGoal', label: 'Net income goal', min: 50_000, max: 1_000_000, step: 10_000 },
  },
  {
    eyebrow: 'Step 2 of 3',
    title: 'What’s your average sale amount?',
    hint: 'The typical premium or policy size you write.',
    slider: { key: 'avgSale', label: 'Average sale', min: 1_000, max: 100_000, step: 1_000 },
  },
  {
    eyebrow: 'Step 3 of 3',
    title: 'What’s your average commission per sale?',
    hint: 'What you personally earn on a typical deal.',
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
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={back} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${((index + 1) / STEPS.length) * 100}%` }]} />
        </View>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.body}>
        <Text style={styles.eyebrow}>{step.eyebrow}</Text>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.hint}>{step.hint}</Text>

        <View style={{ marginTop: spacing.xxl }}>
          <View style={styles.sliderHead}>
            <Text style={styles.sliderLabel}>{step.slider.label}</Text>
            <Text style={styles.sliderValue}>
              {label(planInputs[step.slider.key], step.slider.max)}
            </Text>
          </View>
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
        </View>

        {/* Live preview */}
        <View style={styles.preview}>
          <Ionicons name="sparkles-outline" size={16} color={colors.teal} />
          <Text style={styles.previewText}>
            So far: <Text style={styles.previewStrong}>{planResults.dealsNeeded} deals</Text> ·{' '}
            <Text style={styles.previewStrong}>{planResults.appointmentsNeeded} appts</Text> ·{' '}
            <Text style={styles.previewStrong}>{planResults.leadsNeeded} leads</Text>
          </Text>
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button label={isLast ? 'See my results' : 'Continue'} variant="teal" onPress={next} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.lightBg, paddingHorizontal: spacing.lg },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  progressFill: { height: 6, borderRadius: radii.pill, backgroundColor: colors.teal },
  body: { flex: 1, paddingTop: spacing.xl },
  eyebrow: { fontFamily: fonts.bodySemi, fontSize: 13, color: colors.teal, letterSpacing: 0.5 },
  title: {
    fontFamily: fonts.heading,
    fontSize: 26,
    color: colors.text,
    marginTop: spacing.sm,
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  hint: { fontFamily: fonts.body, fontSize: 15, color: colors.muted, marginTop: spacing.sm, lineHeight: 21 },
  sliderHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: spacing.sm },
  sliderLabel: { fontFamily: fonts.bodyMedium, fontSize: 15, color: colors.text },
  sliderValue: { fontFamily: fonts.heading, fontSize: 22, color: colors.indigo },
  rangeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  rangeText: { fontFamily: fonts.body, fontSize: 12, color: colors.muted },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(39,183,206,0.10)',
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginTop: spacing.xxl,
  },
  previewText: { fontFamily: fonts.body, fontSize: 14, color: colors.text },
  previewStrong: { fontFamily: fonts.bodyBold, color: colors.indigo },
  footer: { paddingTop: spacing.md },
});
