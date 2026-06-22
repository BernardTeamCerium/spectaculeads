import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { LogoMark } from '../src/components/Logo';
import { useApp } from '../src/state/AppState';
import { colors, fonts } from '../src/theme';

export default function Splash() {
  const router = useRouter();
  const { signedIn } = useApp();

  // Logo: scales up while spinning two full turns, fading in.
  const spin = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.2)).current;
  const markFade = useRef(new Animated.Value(0)).current;
  // Wordmark + tagline fade/slide in after the mark settles.
  const wordFade = useRef(new Animated.Value(0)).current;
  const wordShift = useRef(new Animated.Value(12)).current;
  const taglineFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // 1) SL mark spins up + scales in
      Animated.parallel([
        Animated.timing(spin, {
          toValue: 1,
          duration: 750,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 750,
          easing: Easing.out(Easing.back(1.4)),
          useNativeDriver: true,
        }),
        Animated.timing(markFade, {
          toValue: 1,
          duration: 280,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      // 2) Wordmark fades + lifts in
      Animated.parallel([
        Animated.timing(wordFade, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(wordShift, {
          toValue: 0,
          duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      // 3) Tagline fades in
      Animated.timing(taglineFade, {
        toValue: 1,
        duration: 240,
        useNativeDriver: true,
      }),
      // 4) Hold a beat before leaving
      Animated.delay(250),
    ]).start(({ finished }) => {
      if (finished) router.replace(signedIn ? '/(tabs)' : '/login');
    });
  }, [router, signedIn, spin, scale, markFade, wordFade, wordShift, taglineFade]);

  // Two full rotations (720°), ending upright.
  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: markFade, transform: [{ scale }, { rotate }] }}>
        <LogoMark size={108} />
      </Animated.View>

      <Animated.View
        style={{ opacity: wordFade, transform: [{ translateY: wordShift }], marginTop: 26, alignItems: 'center' }}
      >
        <Text style={styles.brand}>
          Spectacu<Text style={{ color: colors.teal }}>leads</Text>
        </Text>
      </Animated.View>

      <Animated.Text style={[styles.tagline, { opacity: taglineFade }]}>
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
