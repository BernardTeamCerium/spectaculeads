import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, radii, spacing } from '../theme';

const DISMISS_KEY = 'sl_install_hint_dismissed';

/**
 * "Add to Home Screen" nudge — web only, mobile browsers only, and only when
 * the app isn't already installed (standalone). Dismissal is remembered.
 * Renders nothing during SSR/native, so it's safe in the static web build.
 */
export function InstallHint() {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const [os, setOs] = useState<'ios' | 'android'>('ios');
  const [canInstall, setCanInstall] = useState(false);
  const promptRef = useRef<any>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    try {
      const w: any = window;
      const nav: any = navigator;
      const standalone =
        (w.matchMedia && w.matchMedia('(display-mode: standalone)').matches) ||
        nav.standalone === true;
      if (standalone) return;
      if (w.localStorage && w.localStorage.getItem(DISMISS_KEY)) return;

      const ua: string = nav.userAgent || '';
      const isIOS = /iphone|ipad|ipod/i.test(ua) && !(w.MSStream);
      const isAndroid = /android/i.test(ua);
      if (!isIOS && !isAndroid) return; // desktop browsers don't need the nudge

      setOs(isIOS ? 'ios' : 'android');
      setVisible(true);

      const onBIP = (e: any) => {
        e.preventDefault();
        promptRef.current = e;
        setCanInstall(true);
      };
      w.addEventListener('beforeinstallprompt', onBIP);
      const onInstalled = () => setVisible(false);
      w.addEventListener('appinstalled', onInstalled);
      return () => {
        w.removeEventListener('beforeinstallprompt', onBIP);
        w.removeEventListener('appinstalled', onInstalled);
      };
    } catch {
      // ignore — never let the hint break the app
    }
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    try {
      (window as any).localStorage?.setItem(DISMISS_KEY, '1');
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  const install = async () => {
    const p = promptRef.current;
    if (!p) return;
    p.prompt();
    try {
      await p.userChoice;
    } catch {
      /* ignore */
    }
    dismiss();
  };

  return (
    <View style={[styles.wrap, { bottom: insets.bottom + 76 }]} pointerEvents="box-none">
      <View style={styles.card}>
        <View style={styles.icon}>
          <Ionicons name="phone-portrait-outline" size={20} color={colors.teal} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Install Spectaculeads</Text>
          <Text style={styles.body}>
            {os === 'ios'
              ? 'Tap Share, then “Add to Home Screen” for the full-screen app.'
              : 'Add it to your home screen for the full-screen app.'}
          </Text>
        </View>
        {os === 'android' && canInstall ? (
          <Pressable style={styles.cta} onPress={install}>
            <Text style={styles.ctaText}>Install</Text>
          </Pressable>
        ) : null}
        <Pressable onPress={dismiss} hitSlop={10} style={styles.close}>
          <Ionicons name="close" size={18} color={colors.muted} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    width: '100%',
    maxWidth: 460,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    shadowColor: '#1A1D3A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 6,
  },
  icon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(39,183,206,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontFamily: fonts.bodySemi, fontSize: 15, color: colors.text },
  body: { fontFamily: fonts.body, fontSize: 12.5, color: colors.muted, marginTop: 1 },
  cta: {
    backgroundColor: colors.teal,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radii.pill,
  },
  ctaText: { fontFamily: fonts.bodySemi, fontSize: 13, color: colors.navy },
  close: { padding: 4 },
});
