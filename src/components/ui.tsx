import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { colors, fonts, radii, shadow, spacing } from '../theme';
import { LeadStatus } from '../types';

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function H1({ children, light, style }: TextProps) {
  return (
    <Text style={[styles.h1, light && { color: colors.white }, style]}>{children}</Text>
  );
}

export function H2({ children, light, style }: TextProps) {
  return (
    <Text style={[styles.h2, light && { color: colors.white }, style]}>{children}</Text>
  );
}

export function Body({ children, light, muted, style }: TextProps & { muted?: boolean }) {
  return (
    <Text
      style={[
        styles.body,
        muted && { color: colors.muted },
        light && { color: 'rgba(255,255,255,0.82)' },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export function Eyebrow({ children, style }: TextProps) {
  return <Text style={[styles.eyebrow, style]}>{children}</Text>;
}

export function SectionTitle({
  title,
  eyebrow,
  subtitle,
  action,
  onActionPress,
  style,
}: {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  action?: string;
  onActionPress?: () => void;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.sectionTitle, style]}>
      <View style={{ flex: 1 }}>
        {eyebrow ? <Eyebrow style={{ marginBottom: 4 }}>{eyebrow}</Eyebrow> : null}
        <Text style={styles.h2}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.body, { color: colors.muted, marginTop: 2 }]}>{subtitle}</Text>
        ) : null}
      </View>
      {action ? (
        <Text onPress={onActionPress} style={styles.sectionAction}>
          {action}
        </Text>
      ) : null}
    </View>
  );
}

export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const STATUS_COLORS: Record<LeadStatus, { bg: string; fg: string }> = {
  Available: { bg: 'rgba(39,183,206,0.14)', fg: colors.tealDeep },
  Contacted: { bg: 'rgba(242,181,68,0.18)', fg: '#9A6B12' },
  Delivered: { bg: 'rgba(32,35,78,0.10)', fg: colors.indigo },
  'Appointment Set': { bg: 'rgba(52,199,123,0.16)', fg: '#1E8A55' },
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  const c = STATUS_COLORS[status];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <View style={[styles.dot, { backgroundColor: c.fg }]} />
      <Text style={[styles.badgeText, { color: c.fg }]}>{status}</Text>
    </View>
  );
}

export function Pill({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Text
      onPress={onPress}
      style={[styles.pill, active ? styles.pillActive : styles.pillIdle]}
    >
      {label}
    </Text>
  );
}

export function Divider({ style }: { style?: ViewStyle }) {
  return <View style={[styles.divider, style]} />;
}

interface TextProps {
  children: React.ReactNode;
  light?: boolean;
  style?: TextStyle | TextStyle[];
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    ...shadow.card,
  },
  h1: {
    fontFamily: fonts.heading,
    fontSize: 28,
    lineHeight: 34,
    color: colors.text,
    letterSpacing: -0.5,
    textTransform: 'capitalize',
  },
  h2: {
    fontFamily: fonts.headingSemi,
    fontSize: 20,
    lineHeight: 26,
    color: colors.text,
    letterSpacing: -0.3,
    textTransform: 'capitalize',
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionAction: {
    fontFamily: fonts.bodySemi,
    fontSize: 14,
    color: colors.teal,
    paddingLeft: spacing.md,
  },
  eyebrow: {
    fontFamily: fonts.bodySemi,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.teal,
  },
  statValue: {
    fontFamily: fonts.heading,
    fontSize: 22,
    color: colors.text,
  },
  statLabel: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
  },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  badgeText: {
    fontFamily: fonts.bodySemi,
    fontSize: 12,
  },
  pill: {
    fontFamily: fonts.bodySemi,
    fontSize: 14,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: radii.pill,
    overflow: 'hidden',
    textAlign: 'center',
  },
  pillActive: {
    backgroundColor: colors.indigo,
    color: colors.white,
  },
  pillIdle: {
    backgroundColor: 'transparent',
    color: colors.muted,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
});
