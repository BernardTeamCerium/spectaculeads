import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../src/components/Button';
import { Body, Card, Divider, Eyebrow, H1, H2 } from '../../src/components/ui';
import { useApp } from '../../src/state/AppState';
import { colors, fonts, radii, spacing } from '../../src/theme';

export default function Profile() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, credits, licenseStatus, submitLicense, verifyLicense, signOut } = useApp();

  const initials = user.name.split(' ').map((n) => n[0]).join('');

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

        {/* Identity card */}
        <View style={styles.identity}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.company}>{user.company}</Text>
        </View>

        {/* Credits */}
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

        {/* License */}
        <H2 style={{ marginTop: spacing.xl, marginBottom: spacing.md }}>License</H2>
        <Card>
          {licenseStatus === 'verified' ? (
            <View style={styles.licenseVerified}>
              <View style={styles.verifiedIcon}>
                <Ionicons name="checkmark-circle" size={28} color={colors.success} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.licenseTitle}>License verified</Text>
                <Body muted style={{ fontSize: 13 }}>
                  {user.licenseState} · Life & Health · Active
                </Body>
              </View>
            </View>
          ) : licenseStatus === 'pending' ? (
            <View>
              <View style={styles.licensePending}>
                <Ionicons name="time-outline" size={22} color={colors.warning} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.licenseTitle}>Under review</Text>
                  <Body muted style={{ fontSize: 13 }}>
                    We’re reviewing your uploaded license. This usually takes 1–2 days.
                  </Body>
                </View>
              </View>
              <Button
                label="Simulate verification"
                variant="secondary"
                onPress={verifyLicense}
                style={{ marginTop: spacing.md }}
              />
            </View>
          ) : (
            <View>
              <View style={styles.uploadBox}>
                <Ionicons name="cloud-upload-outline" size={28} color={colors.teal} />
                <Text style={styles.uploadTitle}>Submit your license</Text>
                <Body muted style={{ fontSize: 13, textAlign: 'center' }}>
                  Upload a photo of your insurance license to unlock lead delivery.
                </Body>
              </View>
              <Button
                label="Upload license"
                variant="primary"
                onPress={submitLicense}
                style={{ marginTop: spacing.md }}
              />
            </View>
          )}
        </Card>

        {/* Settings list */}
        <H2 style={{ marginTop: spacing.xl, marginBottom: spacing.md }}>Settings</H2>
        <Card style={{ paddingVertical: spacing.xs }}>
          <SettingRow icon="person-outline" label="Account details" />
          <Divider style={{ marginVertical: spacing.sm }} />
          <SettingRow icon="card-outline" label="Payment methods" />
          <Divider style={{ marginVertical: spacing.sm }} />
          <SettingRow icon="notifications-outline" label="Notifications" />
          <Divider style={{ marginVertical: spacing.sm }} />
          <SettingRow icon="help-circle-outline" label="Help & support" />
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
  identity: { alignItems: 'center', marginTop: spacing.lg, marginBottom: spacing.xl },
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
  company: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.teal, marginTop: 2 },
  creditCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  creditLabel: { fontFamily: fonts.body, fontSize: 13, color: colors.muted },
  creditValue: { fontFamily: fonts.heading, fontSize: 32, color: colors.text },
  licenseVerified: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  verifiedIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(52,199,123,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  licensePending: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  licenseTitle: { fontFamily: fonts.bodySemi, fontSize: 16, color: colors.text },
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
