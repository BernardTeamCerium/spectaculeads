import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../src/components/Button';
import { CREDIT_PACKAGES } from '../src/data/mock';
import { useApp } from '../src/state/AppState';
import { colors, fonts, radii, spacing } from '../src/theme';
import { money } from '../src/utils/format';

type Phase = 'form' | 'processing' | 'done';

export default function Checkout() {
  const { pkg } = useLocalSearchParams<{ pkg: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { purchasePackage, credits } = useApp();

  const selected = CREDIT_PACKAGES.find((p) => p.id === pkg) ?? CREDIT_PACKAGES[0];
  const [phase, setPhase] = useState<Phase>('form');
  const paidRef = useRef(false);
  const tax = selected.price * 0.0;
  const total = selected.price + tax;

  const pay = () => {
    if (paidRef.current) return; // guard against double-charge
    paidRef.current = true;
    setPhase('processing');
    setTimeout(() => {
      purchasePackage(selected);
      setPhase('done');
    }, 1400);
  };

  if (phase === 'done') {
    return (
      <View style={[styles.screen, styles.center, { paddingTop: insets.top }]}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark" size={44} color={colors.white} />
        </View>
        <Text style={styles.successTitle}>Payment complete</Text>
        <Text style={styles.successSub}>
          {selected.credits} credits added to your account.
        </Text>
        <View style={styles.balancePill}>
          <Ionicons name="flash" size={16} color={colors.teal} />
          <Text style={styles.balancePillText}>{credits} credits available</Text>
        </View>
        <View style={{ alignSelf: 'stretch', paddingHorizontal: spacing.xl, marginTop: spacing.xxl }}>
          <Button label="View my leads" variant="teal" onPress={() => router.replace('/(tabs)/leads')} />
          <Button label="Done" variant="ghost" onPress={() => router.replace('/(tabs)')} style={{ marginTop: spacing.sm }} />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Text style={styles.headerTitle}>Checkout</Text>
        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: insets.bottom + 120 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Order summary */}
        <View style={styles.summary}>
          <View style={styles.summaryTop}>
            <View>
              <Text style={styles.summaryName}>{selected.name} pack</Text>
              <Text style={styles.summaryCredits}>{selected.credits} lead credits</Text>
            </View>
            <Text style={styles.summaryPrice}>{money(selected.price, { cents: true })}</Text>
          </View>
          <View style={styles.summaryLine}>
            <Text style={styles.lineLabel}>Subtotal</Text>
            <Text style={styles.lineValue}>{money(selected.price, { cents: true })}</Text>
          </View>
          <View style={styles.summaryLine}>
            <Text style={styles.lineLabel}>Tax</Text>
            <Text style={styles.lineValue}>{money(tax, { cents: true })}</Text>
          </View>
          <View style={[styles.summaryLine, styles.totalLine]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{money(total, { cents: true })}</Text>
          </View>
        </View>

        {/* Payment form (mock) */}
        <Text style={styles.formTitle}>Payment details</Text>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Card number</Text>
          <View style={styles.cardInputRow}>
            <Ionicons name="card-outline" size={20} color={colors.muted} />
            <TextInput
              style={styles.input}
              placeholder="4242 4242 4242 4242"
              placeholderTextColor={colors.muted}
              keyboardType="number-pad"
            />
          </View>
        </View>
        <View style={styles.fieldRow}>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.fieldLabel}>Expiry</Text>
            <TextInput style={styles.inputPlain} placeholder="12/28" placeholderTextColor={colors.muted} />
          </View>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.fieldLabel}>CVC</Text>
            <TextInput style={styles.inputPlain} placeholder="123" placeholderTextColor={colors.muted} keyboardType="number-pad" />
          </View>
        </View>

        <View style={styles.secureNote}>
          <Ionicons name="lock-closed" size={14} color={colors.muted} />
          <Text style={styles.secureText}>Demo checkout — no real card is charged.</Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Button
          label={`Pay ${money(total, { cents: true })}`}
          variant="teal"
          loading={phase === 'processing'}
          onPress={pay}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.lightBg },
  center: { alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerTitle: { fontFamily: fonts.heading, fontSize: 22, color: colors.text },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  summary: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summaryName: { fontFamily: fonts.headingSemi, fontSize: 18, color: colors.text },
  summaryCredits: { fontFamily: fonts.body, fontSize: 13, color: colors.teal, marginTop: 2 },
  summaryPrice: { fontFamily: fonts.heading, fontSize: 20, color: colors.text },
  summaryLine: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md },
  lineLabel: { fontFamily: fonts.body, fontSize: 14, color: colors.muted },
  lineValue: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.text },
  totalLine: { marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  totalLabel: { fontFamily: fonts.bodySemi, fontSize: 16, color: colors.text },
  totalValue: { fontFamily: fonts.heading, fontSize: 20, color: colors.text },
  formTitle: { fontFamily: fonts.headingSemi, fontSize: 17, color: colors.text, marginTop: spacing.xl, marginBottom: spacing.md },
  field: { marginBottom: spacing.md },
  fieldRow: { flexDirection: 'row', gap: spacing.md },
  fieldLabel: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.muted, marginBottom: 6 },
  cardInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 52,
  },
  input: { flex: 1, fontFamily: fonts.body, fontSize: 16, color: colors.text },
  inputPlain: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 52,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.text,
  },
  secureNote: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center', marginTop: spacing.md },
  secureText: { fontFamily: fonts.body, fontSize: 12, color: colors.muted },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  successIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: { fontFamily: fonts.heading, fontSize: 26, color: colors.text, marginTop: spacing.xl },
  successSub: { fontFamily: fonts.body, fontSize: 15, color: colors.muted, marginTop: spacing.sm, textAlign: 'center' },
  balancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radii.pill,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  balancePillText: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.text },
});
