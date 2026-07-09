import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Body, Card, H1, H2, Screen, StatusBadge } from '../../src/components';
import { fullName, initials } from '../../src/data/mock';
import { leadsPerMonth } from '../../src/lib/incomePlan';
import { useApp } from '../../src/state/AppState';
import { LeadStatus } from '../../src/types';
import { colors, fonts, radii, spacing } from '../../src/theme';
import { money } from '../../src/utils/format';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

const STATUS_META: { status: LeadStatus; label: string; color: string }[] = [
  { status: 'Available', label: 'New', color: colors.teal },
  { status: 'Contacted', label: 'Contacted', color: colors.warning },
  { status: 'Delivered', label: 'Delivered', color: colors.indigo },
  { status: 'Appointment Set', label: 'Converted', color: colors.success },
];

export default function Home() {
  const router = useRouter();
  const { user, credits, leads, planResults } = useApp();

  const firstName = user.name.split(' ')[0];
  const counts = (s: LeadStatus) => leads.filter((l) => l.status === s).length;
  const total = leads.length;
  const worked = leads.filter((l) => l.status !== 'Available').length;

  // Actual closed revenue: sum of commissions booked on won deals.
  const closedDeals = leads.filter((l) => (l.closedAmount ?? 0) > 0);
  const closedCount = closedDeals.length;
  const closedRevenue = closedDeals.reduce((sum, l) => sum + (l.closedAmount ?? 0), 0);

  // Progress toward the income goal, from real closed dollars.
  const goal = planResults.projectedIncome;
  const pct = goal > 0 ? Math.min(100, Math.round((closedRevenue / goal) * 100)) : 0;
  const recent = leads.slice(0, 3);

  return (
    <Screen>
      {/* Greeting */}
      <View style={styles.topRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>{greeting()},</Text>
          <H1>{firstName}</H1>
        </View>
        <Pressable style={styles.creditsChip} onPress={() => router.push('/(tabs)/buy')}>
          <Ionicons name="flash" size={14} color={colors.teal} />
          <Text style={styles.creditsText}>{credits} credits</Text>
        </Pressable>
      </View>

      {/* Goal progress */}
      <View style={styles.goalCard}>
        <View style={styles.goalHead}>
          <Text style={styles.goalEyebrow}>Goal progress</Text>
          <Pressable onPress={() => router.push('/(tabs)/plan')} hitSlop={8}>
            <Text style={styles.goalLink}>View plan</Text>
          </Pressable>
        </View>
        <Text style={styles.goalMoney}>
          {money(closedRevenue)} <Text style={styles.goalOf}>of {money(goal)}</Text>
        </Text>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${Math.max(pct, 2)}%` }]} />
        </View>
        <Text style={styles.goalPct}>{pct}% of your goal — closed commission</Text>

        <View style={styles.goalStats}>
          <View style={styles.goalStat}>
            <Text style={styles.goalStatValue}>
              {closedCount}
              <Text style={styles.goalStatOf}> / {planResults.dealsNeeded}</Text>
            </Text>
            <Text style={styles.goalStatLabel}>deals closed</Text>
          </View>
          <View style={styles.goalDivider} />
          <View style={styles.goalStat}>
            <Text style={styles.goalStatValue}>
              {worked}
              <Text style={styles.goalStatOf}> / {planResults.leadsNeeded}</Text>
            </Text>
            <Text style={styles.goalStatLabel}>leads worked</Text>
          </View>
        </View>
      </View>

      {/* Lead summary */}
      <View style={styles.sectionHead}>
        <H2>Your leads</H2>
        <Pressable onPress={() => router.push('/(tabs)/leads')} hitSlop={8}>
          <Text style={styles.link}>View all</Text>
        </Pressable>
      </View>

      <View style={styles.summaryRow}>
        <Card style={styles.bigStat}>
          <Text style={styles.bigStatValue}>{total}</Text>
          <Text style={styles.bigStatLabel}>total leads</Text>
        </Card>
        <Card style={styles.bigStat}>
          <Text style={[styles.bigStatValue, { color: colors.success }]}>{money(closedRevenue)}</Text>
          <Text style={styles.bigStatLabel}>closed · {closedCount} deals</Text>
        </Card>
      </View>

      <Card style={styles.breakdown}>
        {STATUS_META.map((s, i) => (
          <View key={s.status} style={[styles.breakRow, i > 0 && styles.breakRowBorder]}>
            <View style={[styles.dot, { backgroundColor: s.color }]} />
            <Text style={styles.breakLabel}>{s.label}</Text>
            <Text style={styles.breakCount}>{counts(s.status)}</Text>
          </View>
        ))}
      </Card>

      {/* Recent leads */}
      <View style={styles.sectionHead}>
        <H2>Recent</H2>
      </View>
      {recent.map((lead) => (
        <Pressable
          key={lead.id}
          onPress={() => router.push(`/lead/${lead.id}`)}
          style={({ pressed }) => pressed && { opacity: 0.9 }}
        >
          <Card style={styles.leadCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials(lead)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.leadName}>{fullName(lead)}</Text>
              <Text style={styles.leadMeta}>
                {lead.vertical} · {lead.state}
              </Text>
            </View>
            <StatusBadge status={lead.status} />
          </Card>
        </Pressable>
      ))}

      <Pressable onPress={() => router.push('/(tabs)/buy')} style={styles.buyBanner}>
        <Ionicons name="rocket" size={20} color={colors.teal} />
        <View style={{ flex: 1 }}>
          <Text style={styles.buyTitle}>Hit your goal faster</Text>
          <Body muted style={{ fontSize: 13 }}>
            Your plan needs ~{leadsPerMonth(planResults.leadsNeeded)} leads/month. Top up to stay on pace.
          </Body>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.muted} />
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  greeting: { fontFamily: fonts.body, fontSize: 15, color: colors.muted },
  creditsChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  creditsText: { fontFamily: fonts.bodySemi, fontSize: 13, color: colors.text },
  goalCard: {
    backgroundColor: colors.indigo,
    borderRadius: radii.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  goalHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  goalEyebrow: {
    fontFamily: fonts.bodySemi,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.tealLight,
  },
  goalLink: { fontFamily: fonts.bodySemi, fontSize: 13, color: colors.tealLight },
  goalMoney: {
    fontFamily: fonts.heading,
    fontSize: 32,
    color: colors.white,
    marginTop: spacing.md,
    letterSpacing: -0.8,
  },
  goalOf: { fontFamily: fonts.body, fontSize: 16, color: 'rgba(255,255,255,0.6)' },
  barTrack: {
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.14)',
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  barFill: { height: 8, borderRadius: radii.pill, backgroundColor: colors.teal },
  goalPct: { fontFamily: fonts.body, fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 8 },
  goalStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: radii.md,
    paddingVertical: spacing.md,
  },
  goalStat: { flex: 1, alignItems: 'center' },
  goalStatValue: { fontFamily: fonts.headingSemi, fontSize: 20, color: colors.white },
  goalStatOf: { fontFamily: fonts.body, fontSize: 14, color: 'rgba(255,255,255,0.55)' },
  goalStatLabel: { fontFamily: fonts.body, fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  goalDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.12)' },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  link: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.teal },
  summaryRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  bigStat: { flex: 1, padding: spacing.lg, alignItems: 'flex-start' },
  bigStatValue: { fontFamily: fonts.heading, fontSize: 30, color: colors.text },
  bigStatLabel: { fontFamily: fonts.body, fontSize: 13, color: colors.muted, marginTop: 2 },
  breakdown: { paddingVertical: spacing.xs, marginBottom: spacing.xl },
  breakRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  breakRowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  dot: { width: 10, height: 10, borderRadius: 5 },
  breakLabel: { flex: 1, fontFamily: fonts.bodyMedium, fontSize: 15, color: colors.text },
  breakCount: { fontFamily: fonts.headingSemi, fontSize: 17, color: colors.text },
  leadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(39,183,206,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.tealDeep },
  leadName: { fontFamily: fonts.bodySemi, fontSize: 15, color: colors.text },
  leadMeta: { fontFamily: fonts.body, fontSize: 13, color: colors.muted, marginTop: 2 },
  buyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buyTitle: { fontFamily: fonts.bodySemi, fontSize: 15, color: colors.text },
});
