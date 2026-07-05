import { useId } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Pattern, RadialGradient, Rect, Stop } from 'react-native-svg';
import { colors } from '../theme';

/**
 * Light "high-tech" backdrop: a faint blueprint dot-grid with a soft teal glow.
 * Decorative only (pointerEvents none). IDs are unique per instance so multiple
 * mounts during screen transitions don't clash.
 */
export function TechBackdrop({ glowY = '28%' }: { glowY?: string }) {
  const uid = useId().replace(/:/g, '');
  const grid = `grid-${uid}`;
  const glow = `glow-${uid}`;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern id={grid} width="26" height="26" patternUnits="userSpaceOnUse">
            <Circle cx="1.2" cy="1.2" r="1.2" fill="rgba(32,35,78,0.07)" />
          </Pattern>
          <RadialGradient id={glow} cx="50%" cy={glowY} r="62%">
            <Stop offset="0" stopColor={colors.teal} stopOpacity={0.16} />
            <Stop offset="1" stopColor={colors.teal} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#${grid})`} />
        <Rect width="100%" height="100%" fill={`url(#${glow})`} />
      </Svg>
    </View>
  );
}
