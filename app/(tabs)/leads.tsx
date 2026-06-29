import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Eyebrow, H1, StatusBadge } from '../../src/components/ui';
import { fullName, initials } from '../../src/data/mock';
import { useApp } from '../../src/state/AppState';
import { Lead, LeadStatus } from '../../src/types';
import { colors, fonts, radii, spacing } from '../../src/theme';
import { timeAgo } from '../../src/utils/format';

type Filter = 'All' | LeadStatus;
const FILTERS: Filter[] = ['All', 'Available', 'Contacted', 'Delivered', 'Appointment Set'];

/** Build CSV text from leads (used by the export stub). */
function toCsv(leads: Lead[]): string {
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const header = ['Name', 'State', 'Vertical', 'Assets', 'Phone', 'Status', 'Notes', 'Received'];
  const rows = leads.map((l) =>
    [fullName(l), l.state, l.vertical, l.assets, l.phone, l.status, l.notes ?? '', l.date]
      .map((v) => esc(String(v)))
      .join(',')
  );
  return [header.join(','), ...rows].join('\n');
}

export default function Leads() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { leads } = useApp();
  const [filter, setFilter] = useState<Filter>('All');
  const [query, setQuery] = useState('');
  const [exportMsg, setExportMsg] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const filtered = leads.filter((l) => {
    if (filter !== 'All' && l.status !== filter) return false;
    if (!q) return true;
    return (
      fullName(l).toLowerCase().includes(q) ||
      l.state.toLowerCase().includes(q) ||
      l.vertical.toLowerCase().includes(q)
    );
  });

  const onExport = () => {
    // Stub: assemble the CSV in-memory; real share/download wired later.
    const csv = toCsv(filtered);
    const lineCount = csv ? csv.split('\n').length - 1 : 0;
    setExportMsg(`Exported ${lineCount} lead${lineCount === 1 ? '' : 's'} to CSV (demo)`);
    setTimeout(() => setExportMsg(null), 2500);
  };

  return (
    <View style={styles.screen}>
      <View style={{ paddingTop: insets.top + spacing.lg, paddingHorizontal: spacing.lg }}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Eyebrow>Lead Inbox</Eyebrow>
            <H1 style={{ marginTop: 4 }}>Your leads</H1>
          </View>
          <Pressable onPress={onExport} style={styles.exportBtn}>
            <Ionicons name="download-outline" size={16} color={colors.indigo} />
            <Text style={styles.exportText}>Export CSV</Text>
          </Pressable>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search name, state, or vertical"
            placeholderTextColor={colors.muted}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={colors.muted} />
            </Pressable>
          )}
        </View>
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

      {exportMsg && (
        <View style={styles.toast}>
          <Ionicons name="checkmark-circle" size={16} color={colors.success} />
          <Text style={styles.toastText}>{exportMsg}</Text>
        </View>
      )}

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
            <Text style={styles.emptyText}>
              {q ? `No leads match “${query.trim()}”.` : `No leads in “${filter}” yet.`}
            </Text>
          </Card>
        )}

        {filtered.map((lead) => (
          <Pressable
            key={lead.id}
            onPress={() => router.push(`/lead/${lead.id}`)}
            style={({ pressed }) => pressed && styles.pressed}
          >
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
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.sm,
  },
  exportText: { fontFamily: fonts.bodySemi, fontSize: 13, color: colors.indigo },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 46,
    marginTop: spacing.lg,
  },
  searchInput: { flex: 1, fontFamily: fonts.body, fontSize: 15, color: colors.text },
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
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(52,199,123,0.12)',
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
  },
  toastText: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.text },
  pressed: { opacity: 0.9, transform: [{ scale: 0.995 }] },
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
  emptyText: { fontFamily: fonts.body, fontSize: 14, color: colors.muted, marginTop: spacing.md, textAlign: 'center' },
});
