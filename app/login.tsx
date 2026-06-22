import { useRouter } from 'expo-router';
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
import { Button } from '../src/components/Button';
import { LogoMark } from '../src/components/Logo';
import { useApp } from '../src/state/AppState';
import { colors, fonts, radii, spacing } from '../src/theme';

export default function Login() {
  const router = useRouter();
  const { signIn } = useApp();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSignIn = () => {
    signIn(email);
    // Fake auth: land new arrivals on the Income by Design welcome.
    router.replace('/income');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <LogoMark size={72} />
          <Text style={styles.brand}>
            Spectacu<Text style={{ color: colors.teal }}>leads</Text>
          </Text>
          <Text style={styles.tagline}>Your income goal, delivered.</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@advisory.com"
            placeholderTextColor="rgba(255,255,255,0.4)"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={[styles.label, { marginTop: spacing.lg }]}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="rgba(255,255,255,0.4)"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Pressable style={styles.forgot}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>

          <Button label="Sign in" variant="teal" onPress={onSignIn} style={{ marginTop: spacing.lg }} />

          <Text style={styles.demoNote}>Demo mode — any details will sign you in.</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>New to Spectaculeads? </Text>
          <Pressable onPress={onSignIn}>
            <Text style={styles.footerLink}>Create account</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.navy },
  content: { paddingHorizontal: spacing.xl, flexGrow: 1 },
  header: { alignItems: 'center', marginBottom: spacing.xxl },
  brand: {
    fontFamily: fonts.heading,
    fontSize: 26,
    color: colors.white,
    marginTop: spacing.lg,
    letterSpacing: -0.5,
  },
  tagline: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 6,
  },
  form: { marginTop: spacing.md },
  label: {
    fontFamily: fonts.bodySemi,
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.indigo,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.borderDark,
    paddingHorizontal: 16,
    height: 52,
    color: colors.white,
    fontFamily: fonts.body,
    fontSize: 16,
  },
  forgot: { alignSelf: 'flex-end', marginTop: spacing.md },
  forgotText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.tealLight,
  },
  demoNote: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingTop: spacing.xl,
  },
  footerText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  footerLink: {
    fontFamily: fonts.bodySemi,
    fontSize: 14,
    color: colors.teal,
  },
});
