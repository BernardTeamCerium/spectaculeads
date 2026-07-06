import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Eyebrow, H1, H2 } from '../../src/components/ui';
import { CREDIT_PACKAGES } from '../../src/data/mock';
import { useApp } from '../../src/state/AppState';
import { colors, fonts, radii, spacing } from '../../src/theme';
import { money, timeAgo } from '../../src/utils/format';

export default function Buy() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { credits, transactions } = useApp();

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
        <View style={styles.head}>
          <View>
            <Eyebrow>Buy Leads</Eyebrow>
            <H1 style={{ marginTop: 4 }}>Lead packages</H1>
          </View>
          <View style={styles.balance}>
            <Ionicons name="flash" size={14} color={colors.teal} />
            <Text style={styles.balanceText}>{credits}</Text>
          </View>
        </View>

        <Text style={styles.sub}>
          Every lead is verified and exclusive. Widen your targeting scope to lower the price per lead.
        </Text>

        {CREDIT_PACKAGES.map((pkg) => (
          <Pressable
            key={pkg.id}
            onPress={() => router.push(`/checkout?pkg=${pkg.id}`)}
            style={({ pressed }) => [
              styles.card,
              pkg.highlight && styles.cardHighlight,
              pressed && styles.pressed,
            ]}
          >
            {pkg.badge && (
              <View style={styles.ribbonRow}>
                <View style={styles.ribbon}>
                  <Text style={styles.ribbonText}>{pkg.badge}</Text>
                </View>
              </View>
            )}
            <Text style={[styles.pkgName, pkg.highlight && { color: colors.white }]}>
              {pkg.name}
            </Text>
            <View style={styles.priceRow}>
              <Text style={[styles.price, pkg.highlight && { color: colors.white }]}>
                {money(pkg.pricePerLead)}
              </Text>
              <Text style={[styles.perLead, pkg.highlight && { color: 'rgba(255,255,255,0.7)' }]}>
                {' '}/ Per Lead
              </Text>
            </View>
            <Text style={[styles.tagline, pkg.highlight && { color: 'rgba(255,255,255,0.75)' }]}>
              {pkg.tagline}
            </Text>

            <View style={styles.perks}>
              {pkg.perks.map((perk) => (
                <View key={perk} style={styles.perkRow}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={pkg.highlight ? colors.tealLight : colors.teal}
                  />
                  <Text style={[styles.perkText, pkg.highlight && { color: 'rgba(255,255,255,0.85)' }]}>
                    {perk}
                  </Text>
                </View>
              ))}
            </View>

            <View style={[styles.buyBtn, pkg.highlight ? styles.buyBtnHighlight : styles.buyBtnDefault]}>
              <Text style={[styles.buyBtnText, pkg.highlight && { color: colors.navy }]}>Buy Leads</Text>
              <Text style={[styles.buyBtnSub, pkg.highlight && { color: colors.navy }]}>CLICK HERE</Text>
            </View>
          </Pressable>
        ))}

        {transactions.length > 0 && (
          <View style={styles.history}>
            <H2 style={{ marginBottom: spacing.md }}>Recent purchases</H2>
            {transactions.map((tx) => (
              <View key={tx.id} style={styles.txRow}>
                <View style={styles.txIcon}>
                  <Ionicons name="flash" size={16} color={colors.teal} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.txName}>{tx.packageName} pack</Text>
                  <Text style={styles.txMeta}>
                    +{tx.credits} credits · {timeAgo(tx.date)}
                  </Text>
                </View>
                <Text style={styles.txAmount}>{money(tx.amount, { cents: true })}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.trust}>
          <Ionicons name="lock-closed" size={14} color={colors.muted} />
          <Text style={styles.trustText}>Secured by Stripe · demo only, no real payment.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.lightBg },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  balance: {
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
  balanceText: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.text },
  sub: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.muted,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHighlight: { backgroundColor: colors.indigo, borderColor: colors.indigo },
  pressed: { opacity: 0.92, transform: [{ scale: 0.995 }] },
  ribbonRow: { flexDirection: 'row', marginBottom: spacing.md },
  ribbon: {
    alignSelf: 'flex-start',
    backgroundColor: colors.teal,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
  },
  ribbonText: { fontFamily: fonts.bodyBold, fontSize: 10, color: colors.navy, letterSpacing: 0.6 },
  pkgName: { fontFamily: fonts.heading, fontSize: 22, color: colors.text },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: spacing.sm },
  price: { fontFamily: fonts.heading, fontSize: 34, color: colors.text, letterSpacing: -1 },
  perLead: { fontFamily: fonts.body, fontSize: 15, color: colors.muted },
  tagline: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.muted,
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  perks: { marginTop: spacing.lg, gap: spacing.sm },
  perkRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  perkText: { fontFamily: fonts.body, fontSize: 14, color: colors.text },
  buyBtn: {
    marginTop: spacing.lg,
    paddingVertical: 10,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyBtnDefault: { backgroundColor: colors.indigo },
  buyBtnHighlight: { backgroundColor: colors.teal },
  buyBtnText: { fontFamily: fonts.bodySemi, fontSize: 16, color: colors.white },
  buyBtnSub: {
    fontFamily: fonts.bodySemi,
    fontSize: 10,
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  trust: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  trustText: { fontFamily: fonts.body, fontSize: 12, color: colors.muted },
  history: { marginTop: spacing.sm, marginBottom: spacing.sm },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  txIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(39,183,206,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txName: { fontFamily: fonts.bodySemi, fontSize: 15, color: colors.text },
  txMeta: { fontFamily: fonts.body, fontSize: 13, color: colors.muted, marginTop: 2 },
  txAmount: { fontFamily: fonts.bodySemi, fontSize: 15, color: colors.text },
});
