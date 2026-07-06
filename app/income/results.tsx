import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../src/components/Button';
import { CREDIT_PACKAGES } from '../../src/data/mock';
import {
  commissionDollars,
  leadsPerMonth,
  monthlyLeadCost,
  recommendPackage,
} from '../../src/lib/incomePlan';
import { useApp } from '../../src/state/AppState';
import { colors, fonts, radii, spacing } from '../../src/theme';
import { money } from '../../src/utils/format';

export default function IncomeResults() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { planResults, planInputs } = useApp();

  const monthlyLeads = leadsPerMonth(planResults.leadsNeeded);
  const recommended = recommendPackage(planResults.leadsNeeded, CREDIT_PACKAGES);
  const monthlyCost = monthlyLeadCost(planResults.leadsNeeded, recommended);
  const recReason = `At about ${monthlyLeads} leads/month, ${recommended.name} runs ~${money(
    monthlyCost
  )}/mo at ${money(recommended.pricePerLead)}/lead.`;

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
        <View style={styles.badge}>
          <Ionicons name="checkmark-circle" size={16} color={colors.teal} />
          <Text style={styles.badgeText}>Your plan is ready</Text>
        </View>

        {/* Hero result */}
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>Projected annual income</Text>
          <Text style={styles.heroValue}>{money(planResults.projectedIncome)}</Text>
          <Text style={styles.heroSub}>
            at {money(commissionDollars(planInputs))} per deal ({planInputs.commissionPct}% commission)
          </Text>
        </View>

        {/* Funnel: deals -> appointments -> leads */}
        <View style={styles.metricRow}>
          <View style={styles.metric}>
            <Ionicons name="briefcase-outline" size={20} color={colors.teal} />
            <Text style={styles.metricValue}>{planResults.dealsNeeded}</Text>
            <Text style={styles.metricLabel}>deals</Text>
          </View>
          <View style={styles.metric}>
            <Ionicons name="calendar-outline" size={20} color={colors.teal} />
            <Text style={styles.metricValue}>{planResults.appointmentsNeeded}</Text>
            <Text style={styles.metricLabel}>appointments</Text>
          </View>
          <View style={styles.metric}>
            <Ionicons name="people-outline" size={20} color={colors.teal} />
            <Text style={styles.metricValue}>{planResults.leadsNeeded}</Text>
            <Text style={styles.metricLabel}>leads</Text>
          </View>
        </View>

        <Text style={styles.cadence}>
          Assuming a <Text style={styles.cadenceStrong}>33% show rate</Text> and{' '}
          <Text style={styles.cadenceStrong}>33% close rate</Text> — about{' '}
          <Text style={styles.cadenceStrong}>{monthlyLeads} leads per month</Text>.
        </Text>

        {/* Recommended package */}
        <Text style={styles.recHead}>Recommended for your goal</Text>
        <View style={styles.recCard}>
          <View style={styles.recTop}>
            <View style={{ flex: 1, paddingRight: spacing.md }}>
              <Text style={styles.recName}>{recommended.name}</Text>
              <Text style={styles.recCredits}>{recommended.tagline}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.recPrice}>{money(recommended.pricePerLead)}</Text>
              <Text style={styles.recCredits}>/ lead</Text>
            </View>
          </View>
          <Text style={styles.recReason}>{recReason}</Text>
          <Button
            label="Buy Leads"
            variant="teal"
            onPress={() => router.replace(`/checkout?pkg=${recommended.id}`)}
            style={{ marginTop: spacing.lg }}
          />
        </View>

        <Button
          label="View full plan"
          variant="secondary"
          onPress={() => router.replace('/(tabs)/plan')}
          style={{ marginTop: spacing.md }}
        />
        <Button
          label="Back to home"
          variant="ghost"
          onPress={() => router.replace('/(tabs)')}
          style={{ marginTop: spacing.xs }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.lightBg },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'center',
    backgroundColor: 'rgba(39,183,206,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radii.pill,
  },
  badgeText: { fontFamily: fonts.bodySemi, fontSize: 13, color: colors.tealDeep },
  hero: {
    backgroundColor: colors.indigo,
    borderRadius: radii.xl,
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  heroLabel: { fontFamily: fonts.body, fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  heroValue: {
    fontFamily: fonts.heading,
    fontSize: 44,
    color: colors.white,
    marginTop: 6,
    letterSpacing: -1.2,
  },
  heroSub: { fontFamily: fonts.body, fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 6 },
  metricRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  metric: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricValue: { fontFamily: fonts.heading, fontSize: 30, color: colors.text },
  metricLabel: { fontFamily: fonts.body, fontSize: 13, color: colors.muted },
  cadence: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  cadenceStrong: { fontFamily: fonts.bodyBold, color: colors.text },
  recHead: {
    fontFamily: fonts.headingSemi,
    fontSize: 18,
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  recCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.xl,
    borderWidth: 1.5,
    borderColor: colors.teal,
  },
  recTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  recName: { fontFamily: fonts.heading, fontSize: 20, color: colors.text },
  recCredits: { fontFamily: fonts.body, fontSize: 14, color: colors.teal, marginTop: 2 },
  recPrice: { fontFamily: fonts.heading, fontSize: 22, color: colors.text },
  recReason: { fontFamily: fonts.body, fontSize: 14, color: colors.muted, marginTop: spacing.md, lineHeight: 20 },
});
