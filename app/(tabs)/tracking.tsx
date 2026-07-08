import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Body, Card, Eyebrow, H1, H2, Screen } from '../../src/components';
import { DonutChart, LineChart, PieChart } from '../../src/components/charts';
import { FINANCIAL_PLAN, GoalState, MONTHLY_CLOSED } from '../../src/data/mock';
import { computeGoalTrend, netWorth } from '../../src/lib/financials';
import { useApp } from '../../src/state/AppState';
import { AccountKind } from '../../src/types';
import { colors, fonts, radii, spacing } from '../../src/theme';
import { money } from '../../src/utils/format';

const KIND_ICON: Record<AccountKind, keyof typeof Ionicons.glyphMap> = {
  Bank: 'card-outline',
  Investments: 'trending-up-outline',
  Mortgage: 'home-outline',
  Credit: 'card-outline',
  Retirement: 'umbrella-outline',
};

const GOAL_STYLE: Record<GoalState, { bg: string; fg: string }> = {
  'On track': { bg: 'rgba(52,199,123,0.15)', fg: '#1E8A55' },
  'In progress': { bg: 'rgba(242,181,68,0.18)', fg: '#9A6B12' },
  Behind: { bg: 'rgba(226,87,76,0.15)', fg: '#C0392B' },
};

function signedMoney(n: number): string {
  return `${n < 0 ? '-' : ''}${money(Math.abs(n))}`;
}

export default function Tracking() {
  const { planInputs, financialAccounts, toggleAccountConnection } = useApp();
  const { width: winW } = useWindowDimensions();
  const chartW = Math.min(winW - 64, 520);
  const plan = FINANCIAL_PLAN;

  // Income-goal pace (business side, from booked commissions).
  const annualGoal = planInputs.netIncomeGoal;
  const monthsElapsed = MONTHLY_CLOSED.length;
  const ytdClosed = MONTHLY_CLOSED.reduce((s, m) => s + m.amount, 0);
  const trend = computeGoalTrend(annualGoal, ytdClosed, monthsElapsed);
  const aheadBy = ytdClosed - trend.expectedByNow;

  // Cash flow
  const cf = plan.cashFlow;
  const cfMax = Math.max(...cf.items.map((i) => i.amount));

  const connected = financialAccounts.filter((a) => a.connected);
  const linkedNetWorth = netWorth(financialAccounts);

  return (
    <Screen>
      <Eyebrow>Financial plan</Eyebrow>
      <H1 style={{ marginTop: 4 }}>Your overview</H1>
      <Body muted style={styles.intro}>As of {plan.asOf} · personal &amp; business</Body>

      {/* Income goal pace */}
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
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${Math.max(2, Math.min(100, (ytdClosed / annualGoal) * 100))}%` }]} />
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

      {/* Values */}
      <H2 style={styles.sectionHead}>What matters most</H2>
      <Card>
        {plan.values.map((v) => (
          <View key={v} style={styles.valueRow}>
            <Ionicons name="heart" size={15} color={colors.teal} />
            <Text style={styles.valueText}>{v}</Text>
          </View>
        ))}
      </Card>

      {/* Goal status */}
      <H2 style={styles.sectionHead}>Goal status</H2>
      <Card style={{ paddingVertical: spacing.xs }}>
        {plan.goals.map((g, i) => {
          const s = GOAL_STYLE[g.status];
          return (
            <View key={g.label} style={[styles.goalRow, i > 0 && styles.rowBorder]}>
              <Text style={styles.goalLabel}>{g.label}</Text>
              <View style={[styles.goalBadge, { backgroundColor: s.bg }]}>
                <Text style={[styles.goalBadgeText, { color: s.fg }]}>{g.status}</Text>
              </View>
            </View>
          );
        })}
      </Card>

      {/* Net worth history */}
      <H2 style={styles.sectionHead}>Net worth history</H2>
      <Card>
        <LineChart data={plan.netWorthHistory} width={chartW} />
        <Text style={styles.caption}>
          Up {money(plan.netWorthHistory[plan.netWorthHistory.length - 1].value - plan.netWorthHistory[0].value)} since{' '}
          {plan.netWorthHistory[0].label}.
        </Text>
      </Card>

      {/* Cash-flow summary */}
      <H2 style={styles.sectionHead}>Cash-flow summary</H2>
      <Card>
        <View style={styles.cashHead}>
          <Text style={styles.cashHeadLabel}>Monthly income</Text>
          <Text style={styles.cashHeadValue}>{money(cf.monthlyIncome)}</Text>
        </View>
        <View style={styles.oblDivider} />
        {cf.items.map((it) => (
          <View key={it.label} style={styles.cfRow}>
            <Text style={styles.cfLabel}>{it.label}</Text>
            <View style={styles.cfBarArea}>
              <View style={[styles.cfBar, { width: `${(it.amount / cfMax) * 100}%` }]} />
            </View>
            <Text style={styles.cfValue}>{money(it.amount)}</Text>
          </View>
        ))}
      </Card>

      {/* Asset allocation */}
      <H2 style={styles.sectionHead}>Asset allocation</H2>
      <Card style={styles.chartCard}>
        <PieChart data={plan.assetAllocation} size={150} />
        <View style={styles.legend}>
          {plan.assetAllocation.map((d) => (
            <View key={d.label} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: d.color }]} />
              <Text style={styles.legendLabel} numberOfLines={1}>{d.label}</Text>
              <Text style={styles.legendPct}>{d.value}%</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Asset location */}
      <H2 style={styles.sectionHead}>Asset location</H2>
      <Card style={styles.chartCard}>
        <DonutChart data={plan.assetLocation} size={150} thickness={32} />
        <View style={styles.legend}>
          {plan.assetLocation.map((d) => (
            <View key={d.label} style={styles.legendItemWide}>
              <View style={[styles.legendDot, { backgroundColor: d.color }]} />
              <Text style={styles.legendLabel} numberOfLines={1}>{d.label}</Text>
              <Text style={styles.legendPct}>{d.value}%</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Tax projections */}
      <H2 style={styles.sectionHead}>Tax projections</H2>
      <Card>
        <Text style={styles.taxLead}>
          2026 gross income projected at <Text style={styles.taxLeadStrong}>{money(plan.tax.grossIncome)}</Text>.
        </Text>
        <View style={styles.taxRow}>
          <Text style={styles.taxLabel}>Marginal federal bracket</Text>
          <Text style={styles.taxValue}>{plan.tax.fedBracket}</Text>
        </View>
        <View style={styles.taxRow}>
          <Text style={styles.taxLabel}>{plan.tax.stateLabel}</Text>
          <Text style={styles.taxValue}>{plan.tax.statePct}</Text>
        </View>
        <View style={styles.taxRow}>
          <Text style={styles.taxLabel}>FICA</Text>
          <Text style={styles.taxValue}>{plan.tax.fica}</Text>
        </View>
        <View style={[styles.taxRow, styles.taxTotal]}>
          <Text style={styles.taxTotalLabel}>Projected effective rate</Text>
          <Text style={styles.taxTotalValue}>{plan.tax.effectiveRate}</Text>
        </View>
      </Card>

      {/* Action items */}
      <H2 style={styles.sectionHead}>Action items</H2>
      <Card>
        <Text style={styles.actionHead}>Now</Text>
        {plan.actionsNow.map((a) => (
          <View key={a} style={styles.actionRow}>
            <View style={styles.actionDot} />
            <Text style={styles.actionText}>{a}</Text>
          </View>
        ))}
        <View style={styles.oblDivider} />
        <Text style={styles.actionHead}>Later</Text>
        {plan.actionsLater.map((a) => (
          <View key={a} style={styles.actionRow}>
            <View style={[styles.actionDot, { backgroundColor: colors.muted }]} />
            <Text style={styles.actionText}>{a}</Text>
          </View>
        ))}
      </Card>

      {/* Connected accounts */}
      <H2 style={styles.sectionHead}>Connect your accounts</H2>
      <Body muted style={styles.connIntro}>
        Securely link your banks, brokerage, and mortgage to keep this plan up to date automatically.
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
          <View key={a.id} style={[styles.acctRow, i > 0 && styles.rowBorder]}>
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
  intro: { fontSize: 14, marginTop: 6, marginBottom: spacing.lg },

  hero: { backgroundColor: colors.indigo, borderRadius: radii.xl, padding: spacing.xl, marginBottom: spacing.xl },
  heroHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroEyebrow: { fontFamily: fonts.bodySemi, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: colors.tealLight },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radii.pill },
  pillGood: { backgroundColor: colors.tealLight },
  pillWarn: { backgroundColor: colors.warning },
  statusText: { fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 0.3 },
  heroValue: { fontFamily: fonts.heading, fontSize: 34, color: colors.white, marginTop: spacing.md, letterSpacing: -1 },
  heroSub: { fontFamily: fonts.body, fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 4 },
  barTrack: { height: 8, borderRadius: radii.pill, backgroundColor: 'rgba(255,255,255,0.14)', marginTop: spacing.lg, justifyContent: 'center' },
  barFill: { height: 8, borderRadius: radii.pill, backgroundColor: colors.teal },
  marker: { position: 'absolute', width: 2, height: 16, backgroundColor: colors.white, borderRadius: 1 },
  heroStats: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: radii.md, paddingVertical: spacing.md },
  heroStat: { flex: 1, alignItems: 'center' },
  heroStatValue: { fontFamily: fonts.headingSemi, fontSize: 18, color: colors.white },
  heroStatLabel: { fontFamily: fonts.body, fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  heroDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.12)' },

  sectionHead: { marginTop: spacing.sm, marginBottom: spacing.md },
  caption: { fontFamily: fonts.body, fontSize: 12, color: colors.muted, marginTop: spacing.sm, textAlign: 'center' },

  valueRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: 7 },
  valueText: { fontFamily: fonts.bodyMedium, fontSize: 15, color: colors.text },

  goalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md, paddingVertical: spacing.md },
  rowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  goalLabel: { flex: 1, fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.text },
  goalBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radii.pill },
  goalBadgeText: { fontFamily: fonts.bodySemi, fontSize: 12 },

  cashHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cashHeadLabel: { fontFamily: fonts.bodyMedium, fontSize: 15, color: colors.text },
  cashHeadValue: { fontFamily: fonts.heading, fontSize: 20, color: colors.text },
  oblDivider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  cfRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 6 },
  cfLabel: { width: 62, fontFamily: fonts.body, fontSize: 13, color: colors.muted },
  cfBarArea: { flex: 1, height: 18, backgroundColor: 'rgba(32,35,78,0.05)', borderRadius: radii.sm, justifyContent: 'center' },
  cfBar: { height: 18, borderRadius: radii.sm, backgroundColor: colors.teal },
  cfValue: { width: 62, textAlign: 'right', fontFamily: fonts.bodySemi, fontSize: 13, color: colors.text },

  chartCard: { alignItems: 'center' },
  legend: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.lg, width: '100%' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 7, width: '50%', paddingVertical: 4 },
  legendItemWide: { flexDirection: 'row', alignItems: 'center', gap: 7, width: '100%', paddingVertical: 5 },
  legendDot: { width: 10, height: 10, borderRadius: 3 },
  legendLabel: { flex: 1, fontFamily: fonts.body, fontSize: 13, color: colors.text },
  legendPct: { fontFamily: fonts.bodySemi, fontSize: 13, color: colors.muted },

  taxLead: { fontFamily: fonts.body, fontSize: 14, color: colors.text, lineHeight: 20, marginBottom: spacing.md },
  taxLeadStrong: { fontFamily: fonts.bodyBold, color: colors.text },
  taxRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  taxLabel: { fontFamily: fonts.body, fontSize: 14, color: colors.muted },
  taxValue: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.text },
  taxTotal: { marginTop: spacing.sm, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  taxTotalLabel: { fontFamily: fonts.bodySemi, fontSize: 15, color: colors.text },
  taxTotalValue: { fontFamily: fonts.heading, fontSize: 18, color: colors.teal },

  actionHead: { fontFamily: fonts.bodySemi, fontSize: 12, letterSpacing: 0.8, textTransform: 'uppercase', color: colors.tealDeep, marginBottom: spacing.sm },
  actionRow: { flexDirection: 'row', gap: spacing.md, paddingVertical: 5 },
  actionDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.teal, marginTop: 7 },
  actionText: { flex: 1, fontFamily: fonts.body, fontSize: 14, color: colors.text, lineHeight: 20 },

  connIntro: { fontSize: 14, marginTop: -4, marginBottom: spacing.md, lineHeight: 20 },
  netWorthCard: { backgroundColor: colors.white, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, marginBottom: spacing.md },
  netWorthLabel: { fontFamily: fonts.bodySemi, fontSize: 12, letterSpacing: 0.6, textTransform: 'uppercase', color: colors.muted },
  netWorthValue: { fontFamily: fonts.heading, fontSize: 28, color: colors.text, marginTop: 4, letterSpacing: -0.6 },
  netWorthSub: { fontFamily: fonts.body, fontSize: 13, color: colors.muted, marginTop: 2 },

  acctRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  acctIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(32,35,78,0.07)', alignItems: 'center', justifyContent: 'center' },
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
