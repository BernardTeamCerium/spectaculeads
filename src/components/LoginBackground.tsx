import { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';
import { colors } from '../theme';

/**
 * Abstract animated backdrop for the login screen — slow-drifting, softly
 * blurred teal "orbs" over the navy ground. Purely decorative and additive:
 * it sits behind the form with pointerEvents="none", so removing the single
 * <LoginBackground /> line restores the original flat design.
 */
function Orb({
  size,
  color,
  left,
  top,
  dx,
  dy,
  duration,
  delay = 0,
  opacity,
  animate,
}: {
  size: number;
  color: string;
  left: number | string;
  top: number | string;
  dx: number;
  dy: number;
  duration: number;
  delay?: number;
  opacity: number;
  animate: boolean;
}) {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animate) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(t, {
          toValue: 1,
          duration,
          delay,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(t, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [animate, t, duration, delay]);

  const translateX = t.interpolate({ inputRange: [0, 1], outputRange: [0, dx] });
  const translateY = t.interpolate({ inputRange: [0, 1], outputRange: [0, dy] });
  const scale = t.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.18, 1] });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: left as any,
          top: top as any,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity,
          transform: [{ translateX }, { translateY }, { scale }],
        },
        // Soft glow on web; native falls back to a plain (lower-opacity) circle.
        Platform.OS === 'web' ? ({ filter: 'blur(70px)' } as any) : null,
      ]}
    />
  );
}

export function LoginBackground() {
  const reduce =
    Platform.OS === 'web' &&
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const animate = !reduce;
  const soft = Platform.OS === 'web';

  return (
    <View style={styles.layer} pointerEvents="none">
      <Orb size={340} color={colors.tealDeep} left="-18%" top="6%" dx={60} dy={40} duration={9000} opacity={soft ? 0.5 : 0.16} animate={animate} />
      <Orb size={300} color={colors.teal} left="55%" top="0%" dx={-50} dy={70} duration={11000} delay={600} opacity={soft ? 0.42 : 0.14} animate={animate} />
      <Orb size={260} color={colors.tealLight} left="40%" top="55%" dx={-70} dy={-50} duration={13000} delay={300} opacity={soft ? 0.32 : 0.12} animate={animate} />
      <Orb size={220} color={colors.indigo} left="-10%" top="62%" dx={80} dy={-30} duration={10000} delay={900} opacity={soft ? 0.6 : 0.2} animate={animate} />
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
});
