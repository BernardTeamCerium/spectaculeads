import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  Body,
  Button,
  Card,
  Divider,
  Eyebrow,
  H1,
  H2,
  LogoMark,
  Pill,
  Screen,
  SectionTitle,
  Slider,
  StatusBadge,
  Wordmark,
} from '../../src/components';
import { useDemoTour } from '../../src/state/DemoTour';
import { LEAD_STATUS_ORDER } from '../../src/types';
import { colors, fonts, radii, spacing } from '../../src/theme';

const SWATCHES: { name: string; hex: string; dark?: boolean }[] = [
  { name: 'Navy', hex: colors.navy, dark: true },
  { name: 'Indigo', hex: colors.indigo, dark: true },
  { name: 'Teal', hex: colors.teal },
  { name: 'Teal light', hex: colors.tealLight },
  { name: 'Teal deep', hex: colors.tealDeep, dark: true },
  { name: 'Light bg', hex: colors.lightBg },
  { name: 'Text', hex: colors.text, dark: true },
  { name: 'Muted', hex: colors.muted, dark: true },
];

export default function StylePreview() {
  const [slider, setSlider] = useState(60);
  const [activePill, setActivePill] = useState('Monthly');
  const { start, startAuto } = useDemoTour();

  return (
    <Screen>
      {/* Header */}
      <View style={styles.header}>
        <LogoMark size={56} />
        <View style={{ flex: 1 }}>
          <Wordmark />
          <Text style={styles.subtitle}>Design system preview</Text>
        </View>
      </View>

      {/* Demo launcher */}
      <View style={styles.demoCard}>
        <Text style={styles.demoTitle}>See how it works</Text>
        <Text style={styles.demoBody}>Take a guided walkthrough of the full advisor flow.</Text>
        <View style={styles.demoBtns}>
          <Button label="Guided tour" variant="teal" onPress={start} fullWidth={false} style={{ flex: 1 }} />
          <Button label="Auto-play" variant="secondary" onPress={startAuto} fullWidth={false} style={{ flex: 1 }} />
        </View>
      </View>

      {/* Logo mark sizes */}
      <SectionTitle eyebrow="Brand" title="Logo mark" subtitle="Teal-gradient S, white L on indigo" />
      <Card>
        <View style={styles.logoRow}>
          <LogoMark size={40} />
          <LogoMark size={56} />
          <LogoMark size={72} />
          <LogoMark size={96} />
        </View>
      </Card>

      {/* Colors */}
      <SectionTitle eyebrow="Foundations" title="Colors" style={styles.section} />
      <View style={styles.swatchGrid}>
        {SWATCHES.map((s) => (
          <View key={s.name} style={styles.swatch}>
            <View style={[styles.swatchChip, { backgroundColor: s.hex }]}>
              <Text style={[styles.swatchHex, { color: s.dark ? colors.white : colors.text }]}>
                {s.hex}
              </Text>
            </View>
            <Text style={styles.swatchName}>{s.name}</Text>
          </View>
        ))}
      </View>

      {/* Typography */}
      <SectionTitle eyebrow="Foundations" title="Typography" style={styles.section} />
      <Card>
        <Eyebrow>Eyebrow · Figtree</Eyebrow>
        <H1 style={{ marginTop: 6 }}>Heading 1 · Sora</H1>
        <H2 style={{ marginTop: 8 }}>Heading 2 · Sora</H2>
        <Body style={{ marginTop: 8 }}>
          Body copy is set in Figtree — used for paragraphs, labels, and supporting text
          throughout the app.
        </Body>
        <Body muted style={{ marginTop: 6 }}>Muted body for secondary information.</Body>
      </Card>

      {/* Buttons */}
      <SectionTitle eyebrow="Components" title="Buttons" style={styles.section} />
      <Card style={{ gap: spacing.md }}>
        <Button label="Primary (navy)" variant="primary" onPress={() => {}} />
        <Button label="Teal accent" variant="teal" onPress={() => {}} />
        <Button label="Secondary" variant="secondary" onPress={() => {}} />
        <Button label="Ghost" variant="ghost" onPress={() => {}} />
        <View style={styles.btnRow}>
          <Button label="Disabled" variant="primary" disabled fullWidth={false} style={{ flex: 1 }} />
          <Button label="Loading" variant="teal" loading fullWidth={false} style={{ flex: 1 }} />
        </View>
      </Card>

      {/* Card */}
      <SectionTitle
        eyebrow="Components"
        title="Card"
        action="Action"
        onActionPress={() => {}}
        style={styles.section}
      />
      <Card>
        <H2>Elevated surface</H2>
        <Body muted style={{ marginTop: 4 }}>
          White card with soft shadow, used on light screens for content grouping.
        </Body>
        <Divider />
        <Body>Dividers separate stacked rows inside a card.</Body>
      </Card>

      {/* Pills + Badges */}
      <SectionTitle eyebrow="Components" title="Pills & status badges" style={styles.section} />
      <Card>
        <Text style={styles.miniLabel}>Pills (segmented)</Text>
        <View style={styles.pillRow}>
          {['Yearly', 'Quarterly', 'Monthly'].map((p) => (
            <Pill key={p} label={p} active={activePill === p} onPress={() => setActivePill(p)} />
          ))}
        </View>

        <Text style={[styles.miniLabel, { marginTop: spacing.lg }]}>Lead status badges</Text>
        <View style={styles.badgeWrap}>
          {LEAD_STATUS_ORDER.map((s) => (
            <StatusBadge key={s} status={s} />
          ))}
        </View>
      </Card>

      {/* Slider */}
      <SectionTitle eyebrow="Components" title="Slider" style={styles.section} />
      <Card>
        <View style={styles.sliderHead}>
          <Text style={styles.miniLabel}>Drag to adjust</Text>
          <Text style={styles.sliderValue}>{slider}%</Text>
        </View>
        <Slider value={slider} min={0} max={100} step={5} onChange={setSlider} />
      </Card>

      {/* Dark surface sample */}
      <SectionTitle eyebrow="Components" title="On dark surface" style={styles.section} />
      <View style={styles.darkCard}>
        <Eyebrow style={{ color: colors.tealLight }}>Income by Design</Eyebrow>
        <Text style={styles.darkTitle}>$120,000</Text>
        <Body light style={{ marginTop: 4 }}>Projected income · navy/indigo surface</Body>
        <Button label="Teal on dark" variant="teal" onPress={() => {}} style={{ marginTop: spacing.lg }} />
      </View>

      <Text style={styles.footer}>Spectaculeads design system · Sora + Figtree</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  subtitle: { fontFamily: fonts.body, fontSize: 14, color: colors.muted, marginTop: 2 },
  demoCard: {
    backgroundColor: colors.indigo,
    borderRadius: radii.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  demoTitle: { fontFamily: fonts.heading, fontSize: 18, color: colors.white },
  demoBody: { fontFamily: fonts.body, fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  demoBtns: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  section: { marginTop: spacing.xl },
  logoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  swatchGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  swatch: { width: '47%' },
  swatchChip: {
    height: 64,
    borderRadius: radii.md,
    justifyContent: 'flex-end',
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  swatchHex: { fontFamily: fonts.bodyMedium, fontSize: 12 },
  swatchName: { fontFamily: fonts.bodySemi, fontSize: 13, color: colors.text, marginTop: 6 },
  btnRow: { flexDirection: 'row', gap: spacing.md },
  miniLabel: {
    fontFamily: fonts.bodySemi,
    fontSize: 12,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  pillRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
    backgroundColor: colors.lightBg,
    borderRadius: radii.pill,
    padding: 4,
  },
  badgeWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  sliderHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sliderValue: { fontFamily: fonts.heading, fontSize: 18, color: colors.indigo },
  darkCard: {
    backgroundColor: colors.indigo,
    borderRadius: radii.xl,
    padding: spacing.xl,
  },
  darkTitle: {
    fontFamily: fonts.heading,
    fontSize: 34,
    color: colors.white,
    marginTop: 6,
    letterSpacing: -1,
  },
  footer: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
