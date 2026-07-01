import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../src/components/Button';
import { Body, Card, Divider, Eyebrow, H2 } from '../../src/components/ui';
import { useApp } from '../../src/state/AppState';
import { useDemoTour } from '../../src/state/DemoTour';
import { License } from '../../src/types';
import { colors, fonts, radii, spacing } from '../../src/theme';
import { timeAgo } from '../../src/utils/format';

const MOCK_FILE_NAME = 'CA_Life-Health_License.pdf';

export default function Profile() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, credits, licenses, submitLicense, verifyLicense, signOut, resetDemo } = useApp();
  const { start } = useDemoTour();

  const [chosenFile, setChosenFile] = useState<string | null>(null);

  const initials = user.name.split(' ').map((n) => n[0]).join('');

  const onSubmitLicense = () => {
    if (!chosenFile) return;
    submitLicense({ state: user.licenseState, type: 'Life & Health', fileName: chosenFile });
    setChosenFile(null);
  };

  const onSignOut = () => {
    signOut();
    router.replace('/login');
  };

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
        <Eyebrow>Profile</Eyebrow>

        {/* Advisor info card */}
        <Card style={styles.infoCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <View style={styles.infoMetaRow}>
            <View style={styles.infoMeta}>
              <Ionicons name="business-outline" size={14} color={colors.muted} />
              <Text style={styles.infoMetaText}>{user.company}</Text>
            </View>
            <View style={styles.infoMeta}>
              <Ionicons name="location-outline" size={14} color={colors.muted} />
              <Text style={styles.infoMetaText}>{user.licenseState}</Text>
            </View>
          </View>
        </Card>

        {/* Credits remaining */}
        <Card style={styles.creditCard}>
          <View>
            <Text style={styles.creditLabel}>Credits remaining</Text>
            <Text style={styles.creditValue}>{credits}</Text>
          </View>
          <Button
            label="Buy more"
            variant="teal"
            fullWidth={false}
            onPress={() => router.push('/(tabs)/buy')}
          />
        </Card>

        {/* Submit a license */}
        <H2 style={styles.sectionHead}>Submit a license</H2>
        <Card>
          {chosenFile ? (
            <View style={styles.fileChosen}>
              <Ionicons name="document-text-outline" size={22} color={colors.indigo} />
              <View style={{ flex: 1 }}>
                <Text style={styles.fileName}>{chosenFile}</Text>
                <Text style={styles.fileHint}>Ready to submit</Text>
              </View>
              <Pressable onPress={() => setChosenFile(null)} hitSlop={8}>
                <Ionicons name="close-circle" size={20} color={colors.muted} />
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.uploadBox} onPress={() => setChosenFile(MOCK_FILE_NAME)}>
              <Ionicons name="cloud-upload-outline" size={28} color={colors.teal} />
              <Text style={styles.uploadTitle}>Choose a file</Text>
              <Body muted style={{ fontSize: 13, textAlign: 'center' }}>
                Upload a photo or PDF of your insurance license.
              </Body>
            </Pressable>
          )}
          <Button
            label="Submit for review"
            variant="primary"
            disabled={!chosenFile}
            onPress={onSubmitLicense}
            style={{ marginTop: spacing.md }}
          />
          <Text style={styles.mockNote}>Demo only — no file is actually uploaded.</Text>
        </Card>

        {/* My Licenses */}
        <H2 style={styles.sectionHead}>My Licenses</H2>
        <Card style={{ gap: spacing.md }}>
          {licenses.map((lic, i) => (
            <View key={lic.id}>
              {i > 0 && <Divider style={{ marginBottom: spacing.md }} />}
              <LicenseRow license={lic} onVerify={() => verifyLicense(lic.id)} />
            </View>
          ))}
        </Card>

        {/* Settings */}
        <H2 style={styles.sectionHead}>Settings</H2>
        <Card style={{ paddingVertical: spacing.xs }}>
          <SettingRow icon="person-outline" label="Account details" />
          <Divider style={{ marginVertical: spacing.sm }} />
          <SettingRow icon="card-outline" label="Payment methods" />
          <Divider style={{ marginVertical: spacing.sm }} />
          <SettingRow icon="notifications-outline" label="Notifications" />
          <Divider style={{ marginVertical: spacing.sm }} />
          <SettingRow icon="help-circle-outline" label="Help & support" />
        </Card>

        {/* Demo controls */}
        <H2 style={styles.sectionHead}>Demo</H2>
        <Card style={{ gap: spacing.md }}>
          <Button label="Replay guided tour" variant="teal" onPress={start} />
          <Button label="Reset demo data" variant="secondary" onPress={resetDemo} />
          <Body muted style={{ fontSize: 12, textAlign: 'center' }}>
            Resets credits, leads, and progress to the starting state.
          </Body>
        </Card>

        <Button
          label="Sign out"
          variant="secondary"
          onPress={onSignOut}
          style={{ marginTop: spacing.xl }}
        />
        <Text style={styles.version}>Spectaculeads · Prototype v1.0</Text>
      </ScrollView>
    </View>
  );
}

function LicenseRow({ license, onVerify }: { license: License; onVerify: () => void }) {
  const verified = license.status === 'verified';
  return (
    <View style={styles.licenseRow}>
      <View style={styles.licenseIcon}>
        <Ionicons name="ribbon-outline" size={20} color={colors.indigo} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.licenseTitle}>
          {license.state} · {license.type}
        </Text>
        <Text style={styles.licenseSub}>
          {verified
            ? 'Active'
            : license.submittedAt
              ? `Submitted ${timeAgo(license.submittedAt)}`
              : 'Under review'}
        </Text>
        {!verified && (
          <Pressable onPress={onVerify} hitSlop={6}>
            <Text style={styles.verifyLink}>Simulate verification</Text>
          </Pressable>
        )}
      </View>
      <View style={[styles.badge, verified ? styles.badgeVerified : styles.badgePending]}>
        <Ionicons
          name={verified ? 'checkmark-circle' : 'time-outline'}
          size={13}
          color={verified ? '#1E8A55' : '#9A6B12'}
        />
        <Text style={[styles.badgeText, { color: verified ? '#1E8A55' : '#9A6B12' }]}>
          {verified ? 'Verified' : 'Pending'}
        </Text>
      </View>
    </View>
  );
}

function SettingRow({ icon, label }: { icon: any; label: string }) {
  return (
    <View style={styles.settingRow}>
      <Ionicons name={icon} size={20} color={colors.muted} />
      <Text style={styles.settingLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.muted} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.lightBg },
  infoCard: { alignItems: 'center', marginTop: spacing.md },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.indigo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: fonts.heading, fontSize: 30, color: colors.white },
  name: { fontFamily: fonts.heading, fontSize: 24, color: colors.text, marginTop: spacing.md },
  email: { fontFamily: fonts.body, fontSize: 14, color: colors.muted, marginTop: 4 },
  infoMetaRow: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.md },
  infoMeta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  infoMetaText: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.text },
  creditCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  creditLabel: { fontFamily: fonts.body, fontSize: 13, color: colors.muted },
  creditValue: { fontFamily: fonts.heading, fontSize: 32, color: colors.text },
  sectionHead: { marginTop: spacing.xl, marginBottom: spacing.md },
  uploadBox: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: radii.lg,
  },
  uploadTitle: { fontFamily: fonts.bodySemi, fontSize: 16, color: colors.text, marginTop: 4 },
  fileChosen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.lightBg,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  fileName: { fontFamily: fonts.bodySemi, fontSize: 15, color: colors.text },
  fileHint: { fontFamily: fonts.body, fontSize: 12, color: colors.muted, marginTop: 2 },
  mockNote: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  licenseRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  licenseIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(32,35,78,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  licenseTitle: { fontFamily: fonts.bodySemi, fontSize: 16, color: colors.text },
  licenseSub: { fontFamily: fonts.body, fontSize: 13, color: colors.muted, marginTop: 2 },
  verifyLink: { fontFamily: fonts.bodySemi, fontSize: 13, color: colors.teal, marginTop: 4 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
  },
  badgeVerified: { backgroundColor: 'rgba(52,199,123,0.16)' },
  badgePending: { backgroundColor: 'rgba(242,181,68,0.18)' },
  badgeText: { fontFamily: fonts.bodySemi, fontSize: 12 },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  settingLabel: { flex: 1, fontFamily: fonts.bodyMedium, fontSize: 15, color: colors.text },
  version: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
