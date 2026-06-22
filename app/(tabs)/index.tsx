import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Body, Card, Eyebrow, H1, H2, StatusBadge } from '../../src/components/ui';
import { useApp } from '../../src/state/AppState';
import { colors, fonts, radii, spacing } from '../../src/theme';
import { compactMoney, money, timeAgo } from '../../src/utils/format';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, credits, leads, planComplete, planResults } = useApp();

  const firstName = user.name.split(' ')[0];
  const available = leads.filter((l) => l.status === 'Available').length;
  const appointments = leads.filter((l) => l.status === 'Appointment Set').length;
  const recent = leads.slice(0, 3);

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
        <View style={styles.topRow}>
          <View>
            <Text style={styles.greeting}>{greeting()},</Text>
            <H1>{firstName}</H1>
          </View>
          <View style={styles.creditsChip}>
            <Ionicons name="flash" size={14} color={colors.teal} />
            <Text style={styles.creditsText}>{credits} credits</Text>
          </View>
        </View>

        {/* Income by Design hero */}
        <Pressable onPress={() => router.push('/income')}>
          <View style={styles.hero}>
            <Eyebrow style={{ color: colors.tealLight }}>Income by Design</Eyebrow>
            {planComplete ? (
              <>
                <Text style={styles.heroBig}>{money(planResults.projectedIncome)}</Text>
                <Text style={styles.heroSub}>
                  Your projected income · {planResults.leadsNeeded} leads needed
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.heroTitle}>Design your income goal</Text>
                <Text style={styles.heroSub}>
                  Tell us your target and we’ll map the deals & leads to get there.
                </Text>
              </>
            )}
            <View style={styles.heroBtn}>
              <Text style={styles.heroBtnText}>
                {planComplete ? 'View my plan' : 'Start now'}
              </Text>
              <Ionicons name="arrow-forward" size={16} color={colors.navy} />
            </View>
          </View>
        </Pressable>

        {/* Stat tiles */}
        <View style={styles.statRow}>
          <Card style={styles.statTile}>
            <Text style={styles.tileValue}>{available}</Text>
            <Text style={styles.tileLabel}>New leads</Text>
          </Card>
          <Card style={styles.statTile}>
            <Text style={styles.tileValue}>{appointments}</Text>
            <Text style={styles.tileLabel}>Appointments</Text>
          </Card>
          <Card style={styles.statTile}>
            <Text style={styles.tileValue}>{compactMoney(
              leads.reduce((s, l) => s + l.estimatedValue, 0)
            )}</Text>
            <Text style={styles.tileLabel}>Pipeline</Text>
          </Card>
        </View>

        {/* Recent leads */}
        <View style={styles.sectionHead}>
          <H2>Recent leads</H2>
          <Pressable onPress={() => router.push('/(tabs)/leads')}>
            <Text style={styles.link}>View all</Text>
          </Pressable>
        </View>

        {recent.map((lead) => (
          <Pressable key={lead.id} onPress={() => router.push(`/lead/${lead.id}`)}>
            <Card style={styles.leadCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {lead.name.split(' ').map((n) => n[0]).join('')}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.leadName}>{lead.name}</Text>
                <Text style={styles.leadMeta}>
                  {lead.product} · {money(lead.estimatedValue)}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 6 }}>
                <StatusBadge status={lead.status} />
                <Text style={styles.time}>{timeAgo(lead.receivedAt)}</Text>
              </View>
            </Card>
          </Pressable>
        ))}

        <Pressable onPress={() => router.push('/(tabs)/buy')} style={styles.buyBanner}>
          <Ionicons name="cart" size={20} color={colors.teal} />
          <View style={{ flex: 1 }}>
            <Text style={styles.buyTitle}>Running low on leads?</Text>
            <Body muted style={{ fontSize: 13 }}>Top up your credits in seconds.</Body>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.lightBg },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
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
  hero: {
    backgroundColor: colors.indigo,
    borderRadius: radii.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  heroTitle: {
    fontFamily: fonts.heading,
    fontSize: 24,
    color: colors.white,
    marginTop: 10,
    letterSpacing: -0.4,
  },
  heroBig: {
    fontFamily: fonts.heading,
    fontSize: 36,
    color: colors.white,
    marginTop: 8,
    letterSpacing: -1,
  },
  heroSub: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 6,
    lineHeight: 20,
  },
  heroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.teal,
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: radii.pill,
    marginTop: spacing.lg,
  },
  heroBtnText: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.navy },
  statRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl },
  statTile: { flex: 1, padding: spacing.md, alignItems: 'flex-start' },
  tileValue: { fontFamily: fonts.heading, fontSize: 22, color: colors.text },
  tileLabel: { fontFamily: fonts.body, fontSize: 12, color: colors.muted, marginTop: 2 },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  link: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.teal },
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
  time: { fontFamily: fonts.body, fontSize: 11, color: colors.muted },
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
