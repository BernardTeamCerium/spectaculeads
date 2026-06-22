import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, fonts, radii } from '../theme';

/**
 * The "SL" logo mark — teal S, white L on an indigo tile.
 * (Gradient on the S is approximated with the teal accent to avoid extra deps.)
 */
export function LogoMark({ size = 64, style }: { size?: number; style?: ViewStyle }) {
  const fontSize = size * 0.5;
  return (
    <View
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          borderRadius: size * 0.28,
        },
        style,
      ]}
    >
      <Text style={[styles.mark, { fontSize }]}>
        <Text style={{ color: colors.teal }}>S</Text>
        <Text style={{ color: colors.white }}>L</Text>
      </Text>
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
  mark: {
    fontFamily: fonts.heading,
    letterSpacing: -1,
    includeFontPadding: false,
  },
  word: {
    fontFamily: fonts.heading,
    fontSize: 22,
    letterSpacing: -0.4,
  },
});

export { radii };
