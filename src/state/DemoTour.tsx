import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, radii, spacing } from '../theme';

interface Step {
  route: string;
  title: string;
  body: string;
}

const STEPS: Step[] = [
  {
    route: '/income',
    title: 'Income by Design',
    body: 'Set a target net income and the app works backwards to the deals & leads you need. Tap “Start My Plan”.',
  },
  {
    route: '/income/results',
    title: 'Your targets',
    body: 'Your goal becomes deals, appointments, and leads — with a recommended lead package.',
  },
  {
    route: '/plan',
    title: 'Your plan',
    body: 'Break the goal down by year, quarter, or month, with your conversion goals.',
  },
  {
    route: '/buy',
    title: 'Buy leads',
    body: 'Pick a targeting tier — “Multi-State” is the most popular. Tap it to check out.',
  },
  {
    route: '/checkout?pkg=multi-state',
    title: 'Demo purchase',
    body: 'The card is pre-filled — just tap “Pay”. No real charge: credits are added and fresh leads drop into your inbox.',
  },
  {
    route: '/leads',
    title: 'Work your inbox',
    body: 'New leads land here. Open one to move it Available → Contacted → … → Appointment Set and add notes.',
  },
];

const AUTO_INTERVAL_MS = 4500;

interface TourShape {
  active: boolean;
  index: number;
  total: number;
  auto: boolean;
  paused: boolean;
  start: () => void;
  startAuto: () => void;
  togglePause: () => void;
  next: () => void;
  prev: () => void;
  stop: () => void;
}

const TourContext = createContext<TourShape | null>(null);

export function DemoTourProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(false);
  const [paused, setPaused] = useState(false);

  const start = useCallback(() => {
    setAuto(false);
    setPaused(false);
    setIndex(0);
    setActive(true);
  }, []);
  const startAuto = useCallback(() => {
    setAuto(true);
    setPaused(false);
    setIndex(0);
    setActive(true);
  }, []);
  const togglePause = useCallback(() => setPaused((p) => !p), []);
  const stop = useCallback(() => {
    setActive(false);
    setAuto(false);
  }, []);
  const next = useCallback(() => {
    setIndex((i) => {
      if (i >= STEPS.length - 1) {
        setActive(false);
        setAuto(false);
        return i;
      }
      return i + 1;
    });
  }, []);
  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);

  // Auto-play: advance on a timer while active, auto, and not paused.
  useEffect(() => {
    if (!active || !auto || paused) return;
    const t = setTimeout(() => next(), AUTO_INTERVAL_MS);
    return () => clearTimeout(t);
  }, [active, auto, paused, index, next]);

  const value = useMemo<TourShape>(
    () => ({ active, index, total: STEPS.length, auto, paused, start, startAuto, togglePause, next, prev, stop }),
    [active, index, auto, paused, start, startAuto, togglePause, next, prev, stop]
  );

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
}

export function useDemoTour(): TourShape {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error('useDemoTour must be used within DemoTourProvider');
  return ctx;
}

/** Floating instruction card that drives the walkthrough. Rendered once at root. */
export function DemoTourOverlay() {
  const { active, index, total, auto, paused, next, prev, stop, togglePause } = useDemoTour();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Navigate to the current step's screen whenever the step changes.
  useEffect(() => {
    if (!active) return;
    router.navigate(STEPS[index].route as never);
  }, [active, index, router]);

  if (!active) return null;
  const step = STEPS[index];
  const isLast = index === total - 1;

  return (
    <View style={styles.layer} pointerEvents="box-none">
      <View style={[styles.card, { marginBottom: insets.bottom + spacing.xl }]}>
        <View style={styles.header}>
          <View style={styles.badge}>
            <Ionicons name="sparkles" size={13} color={colors.navy} />
            <Text style={styles.badgeText}>{auto ? 'Auto-play' : 'Guided demo'}</Text>
          </View>
          <View style={styles.headerRight}>
            {auto && (
              <Pressable onPress={togglePause} hitSlop={10} style={styles.pauseBtn}>
                <Ionicons name={paused ? 'play' : 'pause'} size={14} color={colors.navy} />
                <Text style={styles.pauseText}>{paused ? 'Resume' : 'Pause'}</Text>
              </Pressable>
            )}
            <Pressable onPress={stop} hitSlop={10}>
              <Text style={styles.skip}>Skip</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.body}>{step.body}</Text>

        <View style={styles.dots}>
          {STEPS.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>

        <View style={styles.controls}>
          <Pressable onPress={prev} disabled={index === 0} style={styles.backBtn}>
            <Text style={[styles.backText, index === 0 && styles.backDisabled]}>Back</Text>
          </Pressable>
          <Pressable onPress={next} style={styles.nextBtn}>
            <Text style={styles.nextText}>{isLast ? 'Finish' : 'Next'}</Text>
            {!isLast && <Ionicons name="arrow-forward" size={16} color={colors.navy} />}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  card: {
    width: '92%',
    maxWidth: 460,
    backgroundColor: colors.indigo,
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(95,211,227,0.35)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  pauseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.tealLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
  },
  pauseText: { fontFamily: fonts.bodySemi, fontSize: 12, color: colors.navy },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.teal,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
  },
  badgeText: { fontFamily: fonts.bodyBold, fontSize: 11, color: colors.navy, letterSpacing: 0.4 },
  skip: { fontFamily: fonts.bodySemi, fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  title: { fontFamily: fonts.heading, fontSize: 20, color: colors.white, marginTop: spacing.md },
  body: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    color: 'rgba(255,255,255,0.82)',
    marginTop: 6,
  },
  dots: { flexDirection: 'row', gap: 6, marginTop: spacing.md },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.25)' },
  dotActive: { backgroundColor: colors.teal, width: 18 },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  backBtn: { paddingVertical: 8, paddingHorizontal: 4 },
  backText: { fontFamily: fonts.bodySemi, fontSize: 15, color: colors.white },
  backDisabled: { color: 'rgba(255,255,255,0.3)' },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.teal,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: radii.pill,
  },
  nextText: { fontFamily: fonts.bodySemi, fontSize: 15, color: colors.navy },
});
