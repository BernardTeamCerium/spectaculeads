import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../src/components/Button';
import { Slider } from '../../src/components/Slider';
import { useApp } from '../../src/state/AppState';
import { colors, fonts, radii, spacing } from '../../src/theme';
import { money } from '../../src/utils/format';

interface SliderDef {
  key: 'netIncomeGoal' | 'avgSale' | 'avgCommissionPct' | 'closeRatePct';
  label: string;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
}

interface StepDef {
  eyebrow: string;
  title: string;
  hint: string;
  sliders: SliderDef[];
}

const pct = (v: number) => `${v}%`;

const STEPS: StepDef[] = [
  {
    eyebrow: 'Step 1 of 3',
    title: 'What net income do you want this year?',
    hint: 'Your take-home goal after splits and expenses.',
    sliders: [
      { key: 'netIncomeGoal', label: 'Net income goal', min: 40000, max: 500000, step: 5000, format: (v) => money(v) },
    ],
  },
  {
    eyebrow: 'Step 2 of 3',
    title: 'What’s your average sale?',
    hint: 'The typical premium or policy value you write.',
    sliders: [
      { key: 'avgSale', label: 'Average sale value', min: 500, max: 15000, step: 100, format: (v) => money(v) },
    ],
  },
  {
    eyebrow: 'Step 3 of 3',
    title: 'Your commission & close rate',
    hint: 'How much you keep, and how often leads turn into deals.',
    sliders: [
      { key: 'avgCommissionPct', label: 'Average commission', min: 20, max: 120, step: 5, format: pct },
      { key: 'closeRatePct', label: 'Typical close rate', min: 5, max: 80, step: 5, format: pct },
    ],
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

        <View style={{ marginTop: spacing.xxl, gap: spacing.xl }}>
          {step.sliders.map((s) => (
            <View key={s.key}>
              <View style={styles.sliderHead}>
                <Text style={styles.sliderLabel}>{s.label}</Text>
                <Text style={styles.sliderValue}>{s.format(planInputs[s.key])}</Text>
              </View>
              <Slider
                value={planInputs[s.key]}
                min={s.min}
                max={s.max}
                step={s.step}
                onChange={(v) => setPlanInputs({ [s.key]: v })}
              />
              <View style={styles.rangeRow}>
                <Text style={styles.rangeText}>{s.format(s.min)}</Text>
                <Text style={styles.rangeText}>{s.format(s.max)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Live preview */}
        <View style={styles.preview}>
          <Ionicons name="sparkles-outline" size={16} color={colors.teal} />
          <Text style={styles.previewText}>
            So far: ~<Text style={styles.previewStrong}>{planResults.dealsNeeded} deals</Text> from{' '}
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
