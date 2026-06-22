import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Eyebrow, H1, StatusBadge } from '../../src/components/ui';
import { fullName, initials } from '../../src/data/mock';
import { useApp } from '../../src/state/AppState';
import { LeadStatus } from '../../src/types';
import { colors, fonts, radii, spacing } from '../../src/theme';
import { timeAgo } from '../../src/utils/format';

type Filter = 'All' | LeadStatus;
const FILTERS: Filter[] = ['All', 'Available', 'Contacted', 'Delivered', 'Appointment Set'];

export default function Leads() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { leads } = useApp();
  const [filter, setFilter] = useState<Filter>('All');

  const filtered = filter === 'All' ? leads : leads.filter((l) => l.status === filter);

  return (
    <View style={styles.screen}>
      <View style={{ paddingTop: insets.top + spacing.lg, paddingHorizontal: spacing.lg }}>
        <Eyebrow>Lead Inbox</Eyebrow>
        <H1 style={{ marginTop: 4 }}>Your leads</H1>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        style={{ flexGrow: 0, marginTop: spacing.md }}
      >
        {FILTERS.map((f) => {
          const active = f === filter;
          const count = f === 'All' ? leads.length : leads.filter((l) => l.status === f).length;
          return (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={[styles.chip, active ? styles.chipActive : styles.chipIdle]}
            >
              <Text style={[styles.chipText, active && { color: colors.white }]}>
                {f} {count > 0 ? `· ${count}` : ''}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.xxl,
          paddingTop: spacing.md,
        }}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 && (
          <Card style={{ alignItems: 'center', paddingVertical: spacing.xxl }}>
            <Ionicons name="file-tray-outline" size={32} color={colors.muted} />
            <Text style={styles.emptyText}>No leads in “{filter}” yet.</Text>
          </Card>
        )}

        {filtered.map((lead) => (
          <Pressable key={lead.id} onPress={() => router.push(`/lead/${lead.id}`)}>
            <Card style={styles.leadCard}>
              <View style={styles.cardTop}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initials(lead)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.leadName}>{fullName(lead)}</Text>
                  <Text style={styles.leadMeta}>
                    {lead.vertical} · {lead.state}
                  </Text>
                </View>
                <Text style={styles.time}>{timeAgo(lead.date)}</Text>
              </View>

              <View style={styles.cardBottom}>
                <View>
                  <Text style={styles.product}>{lead.assets}</Text>
                  <Text style={styles.value}>{lead.phone}</Text>
                </View>
                <StatusBadge status={lead.status} />
              </View>
            </Card>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.lightBg },
  filterRow: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  chipActive: { backgroundColor: colors.indigo, borderColor: colors.indigo },
  chipIdle: { backgroundColor: colors.white, borderColor: colors.border },
  chipText: { fontFamily: fonts.bodySemi, fontSize: 13, color: colors.muted },
  leadCard: { marginBottom: spacing.md, padding: spacing.lg },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(32,35,78,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.indigo },
  leadName: { fontFamily: fonts.bodySemi, fontSize: 16, color: colors.text },
  leadMeta: { fontFamily: fonts.body, fontSize: 13, color: colors.muted, marginTop: 2 },
  time: { fontFamily: fonts.body, fontSize: 12, color: colors.muted },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  product: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.text },
  value: { fontFamily: fonts.body, fontSize: 13, color: colors.muted, marginTop: 2 },
  emptyText: { fontFamily: fonts.body, fontSize: 14, color: colors.muted, marginTop: spacing.md },
});
