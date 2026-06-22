import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';

interface Props {
  children: React.ReactNode;
  /** "light" = #EAEDF3 light screens, "dark" = navy brand screens. */
  variant?: 'light' | 'dark';
  /** Wrap content in a ScrollView (default true). */
  scroll?: boolean;
  /** Apply default horizontal padding (default true). */
  padded?: boolean;
  contentStyle?: ViewStyle;
}

/**
 * Standard screen container: safe-area aware, themed background, optional scroll.
 * Keeps every screen consistent so individual screens only render content.
 */
export function Screen({
  children,
  variant = 'light',
  scroll = true,
  padded = true,
  contentStyle,
}: Props) {
  const insets = useSafeAreaInsets();
  const bg = variant === 'dark' ? colors.navy : colors.lightBg;

  const padding: ViewStyle = {
    paddingTop: insets.top + spacing.lg,
    paddingBottom: insets.bottom + spacing.xxl,
    paddingHorizontal: padded ? spacing.lg : 0,
  };

  if (scroll) {
    return (
      <View style={[styles.fill, { backgroundColor: bg }]}>
        <ScrollView
          contentContainerStyle={[padding, contentStyle]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.fill, { backgroundColor: bg }, padding, contentStyle]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
