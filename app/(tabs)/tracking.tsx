import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Body, Card, Eyebrow, H1, H2, Screen } from '../../src/components';
import { FINANCIAL_ACCOUNTS, MONTHLY_CLOSED, PERSONAL_OBLIGATIONS } from '../../src/data/mock';
import { computeGoalTrend, netWorth } from '../../src/lib/financials';
import { useApp } from '../../src/state/AppState';
import { AccountKind } from '../../src/types';
import { colors, fonts, radii, spacing } from '../../src/theme';
import { money } from '../../src/utils/format';

const CHART_H = 112;

const KIND_ICON: Record<AccountKind, keyof typeof Ionicons.glyphMap> = {
  Bank: 'card-outline',
  Investments: 'trending-up-outline',
  Mortgage: 'home-outline',
  Credit: 'card-outline',
  Retirement: 'umbrella-outline',
};

/** Signed currency, e.g. -$318,000 for a liability. */
function signedMoney(n: number): string {
  return `${n < 0 ? '-' : ''}${money(Math.abs(n))}`;
}

export default function Tracking() {
  const { planInputs, financialAccounts, toggleAccountConnection } = useApp();

  // --- Business: are we trending toward the income goal? ---
  const annualGoal = planInputs.netIncomeGoal;
  const monthsElapsed = MONTHLY_CLOSED.length;
  const ytdClosed = MONTHLY_CLOSED.reduce((s, m) => s + m.amount, 0);
  const trend = computeGoalTrend(annualGoal, ytdClosed, monthsElapsed);
  const monthlyTarget = annualGoal / 12;
  const aheadBy = ytdClosed - trend.expectedByNow;

  // Bar chart scale
  const maxVal = Math.max(monthlyTarget, ...MONTHLY_CLOSED.map((m) => m.amount));
  const targetY = (monthlyTarget / maxVal) * CHART_H;

  // --- Personal: monthly cash flow ---
  const obligationsTotal = PERSONAL_OBLIGATIONS.reduce((s, o) => s + o.amount, 0);
  const monthlyIncome = Math.round(ytdClosed / monthsElapsed);
  const netMonthly = monthlyIncome - obligationsTotal;

  // --- Connections ---
  const connected = financialAccounts.filter((a) => a.connected);
  const linkedNetWorth = netWorth(financialAccounts);

  return (
    <Screen>
      <Eyebrow>Financial tracker</Eyebrow>
      <H1 style={{ marginTop: 4 }}>Your overview</H1>
      <Body muted style={styles.intro}>
        How you’re trending toward your goals — for the business and for you personally.
      </Body>

      {/* Overview hero */}
      <View style={styles.hero}>
        <View style={styles.heroHead}>
          <Text style={styles.heroEyebrow}>Income goal pace</Text>
          <View style={[styles.statusPill, trend.onTrack ? styles.pillGood : styles.pillWarn]}>
            <Ionicons
              name={trend.onTrack ? 'trending-up' : 'trending-down'}
              size={13}
              color={trend.onTrack ? colors.navy : colors.white}
            />
            <Text style={[styles.statusText, { color: trend.onTrack ? colors.navy : colors.white }]}>
              {trend.onTrack ? 'On track' : 'Behind pace'}
            </Text>
          </View>
        </View>

        <Text style={styles.heroValue}>{money(trend.projectedAnnual)}</Text>
        <Text style={styles.heroSub}>
          projected this year vs your {money(annualGoal)} goal{'  '}
          <Text style={{ color: trend.delta >= 0 ? colors.tealLight : colors.warning }}>
            {trend.delta >= 0 ? '+' : '-'}
            {money(Math.abs(trend.delta))}
          </Text>
        </Text>

        {/* Progress with an "expected by now" marker */}
        <View style={styles.barTrack}>
          <View
            style={[styles.barFill, { width: `${Math.max(2, Math.min(100, (ytdClosed / annualGoal) * 100))}%` }]}
          />
          <View style={[styles.marker, { left: `${Math.min(100, (trend.expectedByNow / annualGoal) * 100)}%` }]} />
        </View>

        <View style={styles.heroStats}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{money(ytdClosed)}</Text>
            <Text style={styles.heroStatLabel}>booked YTD</Text>
          </View>
          <View style={styles.heroDivider} />
          <View style={styles.heroStat}>
            <Text style={[styles.heroStatValue, { color: aheadBy >= 0 ? colors.tealLight : colors.warning }]}>
              {aheadBy >= 0 ? '+' : '-'}
              {money(Math.abs(Math.round(aheadBy)))}
            </Text>
            <Text style={styles.heroStatLabel}>vs pace</Text>
          </View>
        </View>
      </View>

      {/* Business trend chart */}
      <H2 style={styles.sectionHead}>Commissions booked</H2>
      <Card>
        <View style={styles.chart}>
          <View style={[styles.targetLine, { bottom: targetY }]} />
          {MONTHLY_CLOSED.map((m) => {
            const h = Math.max(6, (m.amount / maxVal) * CHART_H);
            const hit = m.amount >= monthlyTarget;
            return (
              <View key={m.month} style={styles.barCol}>
                <View style={[styles.bar, { height: h, backgroundColor: hit ? colors.teal : colors.tealLight }]} />
              </View>
            );
          })}
        </View>
        <View style={styles.labelRow}>
          {MONTHLY_CLOSED.map((m) => (
            <Text key={m.month} style={styles.barLabel}>{m.month}</Text>
          ))}
        </View>
        <View style={styles.chartNote}>
          <View style={styles.dash} />
          <Text style={styles.chartNoteText}>
            Monthly target {money(monthlyTarget)} to stay on pace for {money(annualGoal)}.
          </Text>
        </View>
      </Card>

      {/* Personal plan */}
      <H2 style={styles.sectionHead}>Personal plan</H2>
      <Card>
        <View style={styles.cashRow}>
          <Text style={styles.cashLabel}>Avg monthly take-home</Text>
          <Text style={styles.cashValue}>{money(monthlyIncome)}</Text>
        </View>
        <View style={styles.oblDivider} />
        {PERSONAL_OBLIGATIONS.map((o) => (
          <View key={o.id} style={styles.oblRow}>
            <View style={styles.oblIcon}>
              <Ionicons name={o.icon as keyof typeof Ionicons.glyphMap} size={16} color={colors.tealDeep} />
            </View>
            <Text style={styles.oblLabel}>{o.label}</Text>
            <Text style={styles.oblAmount}>-{money(o.amount)}</Text>
          </View>
        ))}
        <View style={styles.oblDivider} />
        <View style={styles.cashRow}>
          <Text style={styles.cashLabel}>Total monthly obligations</Text>
          <Text style={styles.cashValue}>-{money(obligationsTotal)}</Text>
        </View>
        <View style={[styles.netRow, netMonthly >= 0 ? styles.netGood : styles.netBad]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.netLabel}>Left over each month</Text>
            <Text style={styles.netHint}>
              {netMonthly >= 0
                ? 'Your plan comfortably covers your personal costs.'
                : 'Close more deals to cover your personal costs.'}
            </Text>
          </View>
          <Text style={[styles.netValue, { color: netMonthly >= 0 ? colors.success : colors.danger }]}>
            {money(netMonthly)}
          </Text>
        </View>
      </Card>

      {/* Connected accounts */}
      <H2 style={styles.sectionHead}>Connect your accounts</H2>
      <Body muted style={styles.connIntro}>
        Securely link your banks, brokerage, and mortgage to track everything — personal and business — in one place.
      </Body>

      {connected.length > 0 && (
        <View style={styles.netWorthCard}>
          <Text style={styles.netWorthLabel}>Linked net worth</Text>
          <Text style={styles.netWorthValue}>{signedMoney(linkedNetWorth)}</Text>
          <Text style={styles.netWorthSub}>across {connected.length} connected accounts</Text>
        </View>
      )}

      <Card style={{ paddingVertical: spacing.xs }}>
        {financialAccounts.map((a, i) => (
          <View key={a.id} style={[styles.acctRow, i > 0 && styles.acctBorder]}>
            <View style={styles.acctIcon}>
              <Ionicons name={KIND_ICON[a.kind]} size={18} color={colors.indigo} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.acctName}>{a.institution}</Text>
              <Text style={styles.acctSub}>{a.name}</Text>
            </View>
            {a.connected ? (
              <Pressable onPress={() => toggleAccountConnection(a.id)} style={styles.acctRight} hitSlop={6}>
                <Text style={[styles.acctBalance, { color: a.balance < 0 ? colors.danger : colors.text }]}>
                  {signedMoney(a.balance)}
                </Text>
                <View style={styles.linkedTag}>
                  <Ionicons name="checkmark-circle" size={12} color={colors.success} />
                  <Text style={styles.linkedText}>Linked</Text>
                </View>
              </Pressable>
            ) : (
              <Pressable onPress={() => toggleAccountConnection(a.id)} style={styles.connectBtn}>
                <Text style={styles.connectText}>Connect</Text>
              </Pressable>
            )}
          </View>
        ))}
      </Card>

      <View style={styles.secureNote}>
        <Ionicons name="lock-closed" size={13} color={colors.muted} />
        <Text style={styles.secureText}>Bank-level encryption · read-only · demo only, no real linking.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { fontSize: 14, marginTop: 6, marginBottom: spacing.lg, lineHeight: 20 },

  hero: {
    backgroundColor: colors.indigo,
    borderRadius: radii.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  heroHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroEyebrow: {
    fontFamily: fonts.bodySemi,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.tealLight,
  },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radii.pill },
  pillGood: { backgroundColor: colors.tealLight },
  pillWarn: { backgroundColor: colors.warning },
  statusText: { fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 0.3 },
  heroValue: { fontFamily: fonts.heading, fontSize: 34, color: colors.white, marginTop: spacing.md, letterSpacing: -1 },
  heroSub: { fontFamily: fonts.body, fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 4 },
  barTrack: {
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.14)',
    marginTop: spacing.lg,
    overflow: 'visible',
    justifyContent: 'center',
  },
  barFill: { height: 8, borderRadius: radii.pill, backgroundColor: colors.teal },
  marker: { position: 'absolute', width: 2, height: 16, backgroundColor: colors.white, borderRadius: 1 },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: radii.md,
    paddingVertical: spacing.md,
  },
  heroStat: { flex: 1, alignItems: 'center' },
  heroStatValue: { fontFamily: fonts.headingSemi, fontSize: 18, color: colors.white },
  heroStatLabel: { fontFamily: fonts.body, fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  heroDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.12)' },

  sectionHead: { marginTop: spacing.sm, marginBottom: spacing.md },

  chart: { height: CHART_H, flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, position: 'relative' },
  targetLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 0,
    borderTopWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.warning,
  },
  barCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  bar: { width: '62%', borderTopLeftRadius: 5, borderTopRightRadius: 5 },
  labelRow: { flexDirection: 'row', gap: spacing.sm, marginTop: 6 },
  barLabel: { flex: 1, textAlign: 'center', fontFamily: fonts.body, fontSize: 12, color: colors.muted },
  chartNote: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: spacing.md },
  dash: { width: 16, height: 0, borderTopWidth: 1.5, borderStyle: 'dashed', borderColor: colors.warning },
  chartNoteText: { flex: 1, fontFamily: fonts.body, fontSize: 12, color: colors.muted, lineHeight: 17 },

  cashRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cashLabel: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.text },
  cashValue: { fontFamily: fonts.headingSemi, fontSize: 16, color: colors.text },
  oblDivider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  oblRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: 7 },
  oblIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(39,183,206,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  oblLabel: { flex: 1, fontFamily: fonts.body, fontSize: 14, color: colors.text },
  oblAmount: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.muted },
  netRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderRadius: radii.md, padding: spacing.md, marginTop: spacing.md },
  netGood: { backgroundColor: 'rgba(52,199,123,0.10)' },
  netBad: { backgroundColor: 'rgba(226,87,76,0.10)' },
  netLabel: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.text },
  netHint: { fontFamily: fonts.body, fontSize: 12, color: colors.muted, marginTop: 2, lineHeight: 16 },
  netValue: { fontFamily: fonts.heading, fontSize: 20 },

  connIntro: { fontSize: 14, marginTop: -4, marginBottom: spacing.md, lineHeight: 20 },
  netWorthCard: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  netWorthLabel: { fontFamily: fonts.bodySemi, fontSize: 12, letterSpacing: 0.6, textTransform: 'uppercase', color: colors.muted },
  netWorthValue: { fontFamily: fonts.heading, fontSize: 28, color: colors.text, marginTop: 4, letterSpacing: -0.6 },
  netWorthSub: { fontFamily: fonts.body, fontSize: 13, color: colors.muted, marginTop: 2 },

  acctRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  acctBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  acctIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(32,35,78,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  acctName: { fontFamily: fonts.bodySemi, fontSize: 15, color: colors.text },
  acctSub: { fontFamily: fonts.body, fontSize: 13, color: colors.muted, marginTop: 1 },
  acctRight: { alignItems: 'flex-end' },
  acctBalance: { fontFamily: fonts.bodySemi, fontSize: 14 },
  linkedTag: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  linkedText: { fontFamily: fonts.bodyMedium, fontSize: 11, color: colors.success },
  connectBtn: { backgroundColor: colors.teal, paddingHorizontal: 16, paddingVertical: 8, borderRadius: radii.pill },
  connectText: { fontFamily: fonts.bodySemi, fontSize: 13, color: colors.navy },

  secureNote: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center', marginTop: spacing.lg },
  secureText: { fontFamily: fonts.body, fontSize: 12, color: colors.muted },
});
