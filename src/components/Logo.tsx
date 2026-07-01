import React, { useId } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Text as SvgText, TSpan } from 'react-native-svg';
import { colors, fonts } from '../theme';

/**
 * The "SL" logo mark — a teal-gradient "S" and a white "L" on an indigo tile.
 * The gradient fill is rendered with react-native-svg so it works on web + native.
 */
export function LogoMark({ size = 64, style }: { size?: number; style?: ViewStyle }) {
  const fontSize = size * 0.52;
  // Unique gradient id per instance — a shared id breaks fill="url(#…)" on web
  // when multiple marks are mounted (e.g. across screen transitions).
  const gradId = `slTeal-${useId().replace(/:/g, '')}`;
  return (
    <View
      style={[
        styles.tile,
        { width: size, height: size, borderRadius: size * 0.28 },
        style,
      ]}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <LinearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors.tealDeep} />
            <Stop offset="0.55" stopColor={colors.teal} />
            <Stop offset="1" stopColor={colors.tealLight} />
          </LinearGradient>
        </Defs>
        <SvgText
          x={size / 2}
          y={size * 0.7}
          textAnchor="middle"
          fontFamily={fonts.heading}
          fontWeight="700"
          fontSize={fontSize}
        >
          <TSpan fill={`url(#${gradId})`}>S</TSpan>
          <TSpan fill={colors.white}>L</TSpan>
        </SvgText>
      </Svg>
    </View>
  );
}

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <Text style={[styles.word, { color: light ? colors.white : colors.text }]}>
      Spectacu<Text style={{ color: colors.teal }}>leads</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: colors.indigo,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(95,211,227,0.35)',
  },
  word: {
    fontFamily: fonts.heading,
    fontSize: 22,
    letterSpacing: -0.4,
  },
});
