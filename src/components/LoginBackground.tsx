import { StyleSheet, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { colors } from '../theme';

/**
 * Login backdrop (native fallback). The web build uses an animated
 * constellation (LoginBackground.web.tsx); on native we render a clean, static
 * teal glow over the navy ground. Decorative only (pointerEvents none).
 */
export function LoginBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%">
        <Defs>
          <RadialGradient id="glowA" cx="18%" cy="12%" r="65%">
            <Stop offset="0" stopColor={colors.teal} stopOpacity={0.28} />
            <Stop offset="1" stopColor={colors.navy} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="glowB" cx="88%" cy="88%" r="70%">
            <Stop offset="0" stopColor={colors.tealDeep} stopOpacity={0.3} />
            <Stop offset="1" stopColor={colors.navy} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#glowA)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#glowB)" />
      </Svg>
    </View>
  );
}
