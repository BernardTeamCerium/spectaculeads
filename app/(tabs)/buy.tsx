import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Eyebrow, H1 } from '../../src/components/ui';
import { CREDIT_PACKAGES } from '../../src/data/packages';
import { useApp } from '../../src/state/AppState';
import { colors, fonts, radii, spacing } from '../../src/theme';
import { money } from '../../src/utils/format';

export default function Buy() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { credits } = useApp();

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
            <H1 style={{ marginTop: 4 }}>Credit packages</H1>
          </View>
          <View style={styles.balance}>
            <Ionicons name="flash" size={14} color={colors.teal} />
            <Text style={styles.balanceText}>{credits}</Text>
          </View>
        </View>

        <Text style={styles.sub}>
          Each credit unlocks one verified, exclusive lead. Buy more, save more.
        </Text>

        {CREDIT_PACKAGES.map((pkg) => {
          const perLead = pkg.price / pkg.credits;
          return (
            <Pressable
              key={pkg.id}
              onPress={() => router.push(`/checkout?pkg=${pkg.id}`)}
              style={[styles.card, pkg.highlight && styles.cardHighlight]}
            >
              {pkg.highlight && (
                <View style={styles.ribbon}>
                  <Text style={styles.ribbonText}>BEST VALUE</Text>
                </View>
              )}
              <View style={styles.cardTop}>
                <View>
                  <Text style={[styles.pkgName, pkg.highlight && { color: colors.white }]}>
                    {pkg.name}
                  </Text>
                  <Text style={[styles.pkgCredits, pkg.highlight && { color: colors.tealLight }]}>
                    {pkg.credits} lead credits
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.price, pkg.highlight && { color: colors.white }]}>
                    {money(pkg.price, { cents: true })}
                  </Text>
                  <Text style={[styles.perLead, pkg.highlight && { color: 'rgba(255,255,255,0.7)' }]}>
                    {money(perLead, { cents: true })}/lead
                  </Text>
                </View>
              </View>

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
                <Text style={[styles.buyBtnText, pkg.highlight && { color: colors.navy }]}>
                  Buy {pkg.name}
                </Text>
              </View>
            </Pressable>
          );
        })}

        <View style={styles.trust}>
          <Ionicons name="shield-checkmark-outline" size={18} color={colors.muted} />
          <Text style={styles.trustText}>
            Secure checkout · Demo only — no real payment is processed.
          </Text>
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
  ribbon: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: colors.teal,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
  },
  ribbonText: { fontFamily: fonts.bodyBold, fontSize: 10, color: colors.navy, letterSpacing: 0.6 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  pkgName: { fontFamily: fonts.heading, fontSize: 22, color: colors.text },
  pkgCredits: { fontFamily: fonts.body, fontSize: 14, color: colors.teal, marginTop: 2 },
  price: { fontFamily: fonts.heading, fontSize: 24, color: colors.text },
  perLead: { fontFamily: fonts.body, fontSize: 12, color: colors.muted, marginTop: 2 },
  perks: { marginTop: spacing.lg, gap: spacing.sm },
  perkRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  perkText: { fontFamily: fonts.body, fontSize: 14, color: colors.text },
  buyBtn: {
    marginTop: spacing.lg,
    height: 48,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyBtnDefault: { backgroundColor: colors.indigo },
  buyBtnHighlight: { backgroundColor: colors.teal },
  buyBtnText: { fontFamily: fonts.bodySemi, fontSize: 15, color: colors.white },
  trust: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  trustText: { fontFamily: fonts.body, fontSize: 12, color: colors.muted },
});
