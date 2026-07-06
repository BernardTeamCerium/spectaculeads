import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../src/components/Button';
import { Body, Card, Divider, Eyebrow, H1, H2 } from '../../src/components/ui';
import { CLOSE_RATE, commissionDollars, SHOW_RATE } from '../../src/lib/incomePlan';
import { useApp } from '../../src/state/AppState';
import { colors, fonts, radii, spacing } from '../../src/theme';
import { money } from '../../src/utils/format';

type Period = 'Yearly' | 'Quarterly' | 'Monthly';
const PERIODS: Period[] = ['Yearly', 'Quarterly', 'Monthly'];
const DIVISOR: Record<Period, number> = { Yearly: 1, Quarterly: 4, Monthly: 12 };

// Rates come straight from the calc module so they can never drift from Results.
const SHOW_PCT = Math.round(SHOW_RATE * 100);
const CLOSE_PCT = Math.round(CLOSE_RATE * 100);

export default function Plan() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { planResults, planInputs, planComplete } = useApp();
  const [period, setPeriod] = useState<Period>('Yearly');

  const d = DIVISOR[period];
  const income = Math.round(planResults.projectedIncome / d);
  const deals = Math.ceil(planResults.dealsNeeded / d);
  const appointments = Math.ceil(planResults.appointmentsNeeded / d);
  const leads = Math.ceil(planResults.leadsNeeded / d);

  const periodLabel = period === 'Yearly' ? 'year' : period === 'Quarterly' ? 'quarter' : 'month';
  const isYearly = period === 'Yearly';

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + spacing.lg,
          paddingBottom: spacing.xxl,
          paddingHorizontal: spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Eyebrow>Your Plan</Eyebrow>
        <H1 style={{ marginTop: 4 }}>Income roadmap</H1>

        {!planComplete && (
          <Card style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>
            <Body muted>
              This is a sample plan. Complete Income by Design to tailor it to your goals.
            </Body>
            <Button
              label="Build my plan"
              variant="teal"
              onPress={() => router.push('/income')}
              style={{ marginTop: spacing.md }}
            />
          </Card>
        )}

        {/* Period toggle */}
        <View style={styles.tabs}>
          {PERIODS.map((p) => {
            const active = p === period;
            return (
              <Text
                key={p}
                onPress={() => setPeriod(p)}
                style={[styles.tab, active ? styles.tabActive : styles.tabIdle]}
              >
                {p}
              </Text>
            );
          })}
        </View>

        {/* Headline: target + funnel for the selected period */}
        <View style={styles.headline}>
          <Text style={styles.headlineLabel}>
            {isYearly ? 'Annual income target' : `Target per ${periodLabel}`}
          </Text>
          <Text style={styles.headlineValue}>{money(income)}</Text>
          <View style={styles.headlineRow}>
            <Stat value={`${deals}`} label="deals" />
            <View style={styles.headlineDivider} />
            <Stat value={`${appointments}`} label="appts" />
            <View style={styles.headlineDivider} />
            <Stat value={`${leads}`} label="leads" />
          </View>
        </View>

        {isYearly ? (
          <>
            {/* Conversion goals (Yearly) */}
            <H2 style={styles.sectionHead}>Conversion goals</H2>
            <Card>
              <View style={styles.goalRow}>
                <View style={styles.goalTile}>
                  <Text style={styles.goalValue}>{SHOW_PCT}%</Text>
                  <Text style={styles.goalLabel}>Show rate</Text>
                  <Text style={styles.goalHint}>leads → appointments</Text>
                </View>
                <View style={styles.goalSplit} />
                <View style={styles.goalTile}>
                  <Text style={styles.goalValue}>{CLOSE_PCT}%</Text>
                  <Text style={styles.goalLabel}>Close rate</Text>
                  <Text style={styles.goalHint}>appointments → deals</Text>
                </View>
              </View>
            </Card>

            {/* Annual breakdown */}
            <H2 style={styles.sectionHead}>Annual breakdown</H2>
            <Card>
              <Row label="Net income goal" value={money(income)} />
              <Divider />
              <Row label="Deals to close" value={`${deals}`} />
              <Divider />
              <Row label="Appointments to set" value={`${appointments}`} />
              <Divider />
              <Row label="Leads to work" value={`${leads}`} />
              <Divider />
              <Row
                label="Avg commission / deal"
                value={`${money(commissionDollars(planInputs))} · ${planInputs.commissionPct}%`}
              />
            </Card>
          </>
        ) : (
          <>
            {/* Per-period breakdown (Quarterly / Monthly) */}
            <H2 style={styles.sectionHead}>Per-{periodLabel} breakdown</H2>
            <Card>
              <Row label={`Income / ${periodLabel}`} value={money(income)} />
              <Divider />
              <Row label="Deals to close" value={`${deals}`} />
              <Divider />
              <Row label="Appointments to set" value={`${appointments}`} />
              <Divider />
              <Row label="Leads to work" value={`${leads}`} />
            </Card>
            <Text style={styles.caption}>
              Your annual plan split across {d} {period === 'Quarterly' ? 'quarters' : 'months'} ·{' '}
              {SHOW_PCT}% show rate, {CLOSE_PCT}% close rate.
            </Text>
          </>
        )}

        <View style={styles.tipCard}>
          <Ionicons name="bulb-outline" size={20} color={colors.teal} />
          <Body style={{ flex: 1, fontSize: 13 }}>
            Working roughly{' '}
            <Text style={{ fontFamily: fonts.bodySemi }}>
              {Math.ceil(planResults.leadsNeeded / 52)} leads/week
            </Text>{' '}
            keeps you on pace for this goal.
          </Body>
        </View>
      </ScrollView>
    </View>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.headlineStat}>
      <Text style={styles.hsValue}>{value}</Text>
      <Text style={styles.hsLabel}>{label}</Text>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.lightBg },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radii.pill,
    padding: 4,
    marginTop: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.bodySemi,
    fontSize: 14,
    paddingVertical: 10,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  tabActive: { backgroundColor: colors.indigo, color: colors.white },
  tabIdle: { color: colors.muted },
  headline: {
    backgroundColor: colors.indigo,
    borderRadius: radii.xl,
    padding: spacing.xl,
    marginTop: spacing.lg,
  },
  headlineLabel: { fontFamily: fonts.body, fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  headlineValue: {
    fontFamily: fonts.heading,
    fontSize: 40,
    color: colors.white,
    marginTop: 4,
    letterSpacing: -1,
  },
  headlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: radii.md,
    paddingVertical: spacing.md,
  },
  headlineStat: { flex: 1, alignItems: 'center' },
  hsValue: { fontFamily: fonts.headingSemi, fontSize: 18, color: colors.tealLight },
  hsLabel: { fontFamily: fonts.body, fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  headlineDivider: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.12)' },
  sectionHead: { marginTop: spacing.xl, marginBottom: spacing.md },
  goalRow: { flexDirection: 'row', alignItems: 'center' },
  goalTile: { flex: 1, alignItems: 'center' },
  goalSplit: { width: 1, height: 56, backgroundColor: colors.border },
  goalValue: { fontFamily: fonts.heading, fontSize: 30, color: colors.teal, letterSpacing: -0.5 },
  goalLabel: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.text, marginTop: 4 },
  goalHint: { fontFamily: fonts.body, fontSize: 12, color: colors.muted, marginTop: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLabel: { fontFamily: fonts.body, fontSize: 15, color: colors.muted },
  rowValue: { fontFamily: fonts.bodySemi, fontSize: 15, color: colors.text },
  caption: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.muted,
    marginTop: spacing.md,
    lineHeight: 19,
  },
  tipCard: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
    backgroundColor: 'rgba(39,183,206,0.10)',
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
});
