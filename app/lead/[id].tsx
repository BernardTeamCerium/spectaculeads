import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
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
import { Card, StatusBadge } from '../../src/components/ui';
import { fullName, initials } from '../../src/data/mock';
import { useApp } from '../../src/state/AppState';
import { LEAD_STATUS_ORDER, LeadStatus } from '../../src/types';
import { colors, fonts, radii, spacing } from '../../src/theme';
import { timeAgo } from '../../src/utils/format';

export default function LeadDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { leads, updateLeadStatus, updateLeadNotes } = useApp();

  const lead = leads.find((l) => l.id === id);
  const [noteDraft, setNoteDraft] = useState(lead?.notes ?? '');
  const [saved, setSaved] = useState(false);

  if (!lead) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + 40, alignItems: 'center' }]}>
        <Text style={styles.notFound}>Lead not found.</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.link}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const currentIndex = LEAD_STATUS_ORDER.indexOf(lead.status);

  const saveNotes = () => {
    updateLeadNotes(lead.id, noteDraft);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Lead details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Identity block (on navy header) */}
        <View style={styles.identity}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials(lead)}</Text>
          </View>
          <Text style={styles.name}>{fullName(lead)}</Text>
          <Text style={styles.sub}>
            {lead.vertical} · {lead.state}
          </Text>
          <View style={{ marginTop: spacing.md }}>
            <StatusBadge status={lead.status} />
          </View>
        </View>

        <View style={styles.sheet}>
          {/* Contact actions */}
          <View style={styles.actionRow}>
            <ContactAction icon="call-outline" label="Call" />
            <ContactAction icon="chatbubble-outline" label="Text" />
            <ContactAction icon="mail-outline" label="Email" />
          </View>

          {/* Opportunity */}
          <Card style={{ marginTop: spacing.lg }}>
            <Text style={styles.cardLabel}>Opportunity</Text>
            <View style={styles.oppRow}>
              <Text style={styles.product}>{lead.vertical}</Text>
              <Text style={styles.value}>{lead.assets}</Text>
            </View>
            <View style={styles.metaGrid}>
              <Meta label="Investable assets" value={lead.assets} />
              <Meta label="Phone" value={lead.phone} />
              <Meta label="State" value={lead.state} />
              <Meta label="Received" value={timeAgo(lead.date)} />
            </View>
          </Card>

          {/* Status workflow */}
          <Text style={styles.sectionTitle}>Status</Text>
          <Card>
            {LEAD_STATUS_ORDER.map((status, i) => {
              const done = i < currentIndex;
              const active = i === currentIndex;
              return (
                <Pressable
                  key={status}
                  style={styles.statusRow}
                  onPress={() => updateLeadStatus(lead.id, status as LeadStatus)}
                >
                  <View
                    style={[
                      styles.statusDot,
                      done && styles.statusDotDone,
                      active && styles.statusDotActive,
                    ]}
                  >
                    {done ? (
                      <Ionicons name="checkmark" size={14} color={colors.white} />
                    ) : (
                      <Text style={[styles.statusNum, active && { color: colors.white }]}>{i + 1}</Text>
                    )}
                  </View>
                  <Text style={[styles.statusText, (active || done) && { color: colors.text }]}>
                    {status}
                  </Text>
                  {active && <Text style={styles.currentTag}>Current</Text>}
                </Pressable>
              );
            })}
            <Text style={styles.tapHint}>Tap a stage to update this lead.</Text>
          </Card>

          {/* Notes */}
          <Text style={styles.sectionTitle}>Notes</Text>
          <Card>
            <TextInput
              style={styles.notes}
              placeholder="Add a note about this lead…"
              placeholderTextColor={colors.muted}
              multiline
              value={noteDraft}
              onChangeText={setNoteDraft}
            />
            <Pressable
              onPress={saveNotes}
              style={[styles.saveBtn, saved && styles.saveBtnDone]}
            >
              <Ionicons
                name={saved ? 'checkmark' : 'save-outline'}
                size={16}
                color={colors.white}
              />
              <Text style={styles.saveText}>{saved ? 'Saved' : 'Save note'}</Text>
            </Pressable>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function ContactAction({ icon, label }: { icon: any; label: string }) {
  return (
    <View style={styles.action}>
      <View style={styles.actionIcon}>
        <Ionicons name={icon} size={20} color={colors.indigo} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </View>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaItem}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.navy },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: fonts.bodySemi, fontSize: 16, color: colors.white },
  identity: { alignItems: 'center', paddingBottom: spacing.xl, paddingTop: spacing.sm },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(39,183,206,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(95,211,227,0.4)',
  },
  avatarText: { fontFamily: fonts.heading, fontSize: 26, color: colors.tealLight },
  name: { fontFamily: fonts.heading, fontSize: 24, color: colors.white, marginTop: spacing.md },
  sub: { fontFamily: fonts.body, fontSize: 14, color: 'rgba(255,255,255,0.65)', marginTop: 4 },
  sheet: {
    backgroundColor: colors.lightBg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    minHeight: 600,
  },
  actionRow: { flexDirection: 'row', gap: spacing.md },
  action: { flex: 1, alignItems: 'center', gap: 6 },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionLabel: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.text },
  cardLabel: { fontFamily: fonts.bodySemi, fontSize: 12, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.6 },
  oppRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  product: { fontFamily: fonts.heading, fontSize: 19, color: colors.text },
  value: { fontFamily: fonts.heading, fontSize: 19, color: colors.teal },
  summary: { fontFamily: fonts.body, fontSize: 14, color: colors.text, lineHeight: 21, marginTop: spacing.sm },
  metaGrid: {
    marginTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  metaItem: { flexDirection: 'row', justifyContent: 'space-between' },
  metaLabel: { fontFamily: fonts.body, fontSize: 14, color: colors.muted },
  metaValue: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.text },
  sectionTitle: {
    fontFamily: fonts.headingSemi,
    fontSize: 18,
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  statusDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.lightBg,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDotDone: { backgroundColor: colors.teal, borderColor: colors.teal },
  statusDotActive: { backgroundColor: colors.indigo, borderColor: colors.indigo },
  statusNum: { fontFamily: fonts.bodySemi, fontSize: 13, color: colors.muted },
  statusText: { flex: 1, fontFamily: fonts.bodyMedium, fontSize: 15, color: colors.muted },
  currentTag: { fontFamily: fonts.bodySemi, fontSize: 12, color: colors.teal },
  tapHint: { fontFamily: fonts.body, fontSize: 12, color: colors.muted, marginTop: spacing.sm },
  notes: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.text,
    minHeight: 96,
    textAlignVertical: 'top',
    lineHeight: 22,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.indigo,
    height: 44,
    borderRadius: radii.md,
    marginTop: spacing.md,
  },
  saveBtnDone: { backgroundColor: colors.success },
  saveText: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.white },
  notFound: { fontFamily: fonts.body, fontSize: 16, color: colors.text, marginBottom: spacing.md },
  link: { fontFamily: fonts.bodySemi, fontSize: 15, color: colors.teal },
});
