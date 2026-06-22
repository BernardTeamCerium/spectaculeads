import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { LogoMark } from '../src/components/Logo';
import { useApp } from '../src/state/AppState';
import { colors, fonts } from '../src/theme';

export default function Splash() {
  const router = useRouter();
  const { signedIn } = useApp();
  const spin = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.6)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const tagline = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(spin, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 5,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.timing(fade, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(tagline, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    const t = setTimeout(() => {
      router.replace(signedIn ? '/(tabs)' : '/login');
    }, 2300);
    return () => clearTimeout(t);
  }, [router, signedIn, spin, scale, fade, tagline]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['-180deg', '0deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fade, transform: [{ scale }, { rotate }] }}>
        <LogoMark size={104} />
      </Animated.View>
      <Animated.View style={{ opacity: fade, marginTop: 22, alignItems: 'center' }}>
        <Text style={styles.brand}>
          Spectacu<Text style={{ color: colors.teal }}>leads</Text>
        </Text>
      </Animated.View>
      <Animated.Text style={[styles.tagline, { opacity: tagline }]}>
        Your income goal, delivered.
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    fontFamily: fonts.heading,
    fontSize: 30,
    color: colors.white,
    letterSpacing: -0.5,
  },
  tagline: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 10,
  },
});
