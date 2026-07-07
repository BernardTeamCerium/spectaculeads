import { useRouter } from 'expo-router';
import { Fragment, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../src/components/Button';
import { Slider } from '../../src/components/Slider';
import { useApp } from '../../src/state/AppState';
import { colors, fonts, radii, spacing } from '../../src/theme';

interface SliderDef {
  key: 'netIncomeGoal' | 'avgSale' | 'commissionPct';
  min: number;
  max: number;
  step: number;
  unit?: 'money' | 'percent';
}

interface StepDef {
  title: string;
  subtitle: string;
  sliderHint: string;
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

/** Formats a slider value for its unit, adding a trailing "+" once maxed. */
function label(v: number, max: number, unit: SliderDef['unit'] = 'money'): string {
  const base = unit === 'percent' ? `${v}%` : shortMoney(v);
  return base + (v >= max ? '+' : '');
}

/** The full-dollar hero value, e.g. "$250,000". Percent shows "20%". */
function heroValue(v: number, unit: SliderDef['unit'] = 'money'): string {
  if (unit === 'percent') return `${v}%`;
  return `$${v.toLocaleString('en-US')}`;
}

const STEPS: StepDef[] = [
  {
    title: 'What is your desired NET yearly income?',
    subtitle: 'This is your personal take-home income goal.',
    sliderHint: 'Drag the slider to set your goal',
    slider: { key: 'netIncomeGoal', min: 50_000, max: 10_000_000, step: 10_000 },
  },
  {
    title: 'What is your average sale amount?',
    subtitle: 'The typical policy size you write.',
    sliderHint: 'Drag the slider to set your average',
    slider: { key: 'avgSale', min: 1_000, max: 20_000_000, step: 1_000 },
  },
  {
    title: 'What is your average commission per sale?',
    subtitle: 'Your commission percentage you personally pocket on a typical deal.',
    sliderHint: 'Drag the slider to set your average',
    slider: { key: 'commissionPct', min: 1, max: 50, step: 1, unit: 'percent' },
  },
];

export default function IncomeSteps() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { planInputs, setPlanInputs, setPlanComplete } = useApp();
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
    <View style={[styles.screen, { paddingTop: insets.top + spacing.lg }]}>
      {/* Step progress */}
      <Text style={styles.stepLabel}>Step {index + 1} of {STEPS.length}</Text>
      <View style={styles.progressRow}>
        {STEPS.map((_, i) => (
          <Fragment key={i}>
            {i > 0 && <View style={[styles.progressLine, i <= index && styles.progressLineOn]} />}
            <View style={[styles.progressDot, i <= index && styles.progressDotOn]} />
          </Fragment>
        ))}
      </View>

      {/* Question */}
      <View style={styles.body}>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.subtitle}>{step.subtitle}</Text>

        <Text style={styles.value}>{heroValue(planInputs[step.slider.key], step.slider.unit)}</Text>
        <Text style={styles.sliderHint}>{step.sliderHint}</Text>

        <View style={styles.sliderWrap}>
          <Slider
            value={planInputs[step.slider.key]}
            min={step.slider.min}
            max={step.slider.max}
            step={step.slider.step}
            onChange={(v) => setPlanInputs({ [step.slider.key]: v })}
          />
          <View style={styles.rangeRow}>
            <Text style={styles.rangeText}>{label(step.slider.min, step.slider.max, step.slider.unit)}</Text>
            <Text style={styles.rangeText}>{label(step.slider.max, step.slider.max, step.slider.unit)}</Text>
          </View>
        </View>
      </View>

      {/* Navigation */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button label={isLast ? 'See My Results' : 'Next'} variant="teal" onPress={next} />
        <Pressable onPress={back} style={styles.prevBtn} hitSlop={8}>
          <Text style={styles.prevText}>Previous</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.lightBg, paddingHorizontal: spacing.xl },
  stepLabel: {
    fontFamily: fonts.bodySemi,
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    width: 200,
    marginTop: spacing.md,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(32,35,78,0.14)',
  },
  progressDotOn: { backgroundColor: colors.teal },
  progressLine: { flex: 1, height: 2, backgroundColor: 'rgba(32,35,78,0.12)' },
  progressLineOn: { backgroundColor: colors.teal },
  body: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: {
    fontFamily: fonts.heading,
    fontSize: 24,
    color: colors.text,
    textAlign: 'center',
    letterSpacing: -0.4,
    lineHeight: 31,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 21,
    paddingHorizontal: spacing.sm,
  },
  value: {
    fontFamily: fonts.heading,
    fontSize: 46,
    color: colors.teal,
    letterSpacing: -1.5,
    marginTop: spacing.xxl,
  },
  sliderHint: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.muted,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  sliderWrap: { alignSelf: 'stretch' },
  rangeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  rangeText: { fontFamily: fonts.body, fontSize: 12, color: colors.muted },
  footer: { paddingTop: spacing.md },
  prevBtn: { alignSelf: 'center', paddingVertical: spacing.md, marginTop: spacing.xs },
  prevText: { fontFamily: fonts.bodySemi, fontSize: 15, color: colors.tealDeep },
});
