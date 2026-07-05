import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Line, Pattern, RadialGradient, Rect, Stop } from 'react-native-svg';
import { colors } from '../theme';

/**
 * Login backdrop (native fallback). The web build renders an animated "signals
 * grid" (LoginBackground.web.tsx); on native we render the matching static grid
 * — faint teal lines + node dots over the navy ground with a soft glow.
 * Decorative only (pointerEvents none).
 */
export function LoginBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern id="signalGrid" width="46" height="46" patternUnits="userSpaceOnUse">
            <Line x1="0" y1="0" x2="46" y2="0" stroke="rgba(95,211,227,0.07)" strokeWidth="1" />
            <Line x1="0" y1="0" x2="0" y2="46" stroke="rgba(95,211,227,0.07)" strokeWidth="1" />
            <Circle cx="0" cy="0" r="1" fill="rgba(95,211,227,0.14)" />
          </Pattern>
          <RadialGradient id="signalGlow" cx="20%" cy="14%" r="70%">
            <Stop offset="0" stopColor={colors.teal} stopOpacity={0.28} />
            <Stop offset="1" stopColor={colors.navy} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#signalGrid)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#signalGlow)" />
      </Svg>
    </View>
  );
}
