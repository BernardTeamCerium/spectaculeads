import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { colors, fonts, radii } from '../theme';

type Variant = 'primary' | 'teal' | 'secondary' | 'ghost';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  style,
  fullWidth = true,
}: Props) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        fullWidth && styles.fullWidth,
        variantStyles[variant].container,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.row}>
        {loading && (
          <ActivityIndicator
            size="small"
            color={variant === 'secondary' || variant === 'ghost' ? colors.text : colors.white}
            style={{ marginRight: 8 }}
          />
        )}
        <Text style={[styles.label, variantStyles[variant].label]}>{label}</Text>
      </View>
    </Pressable>
  );
}

const variantStyles: Record<Variant, { container: ViewStyle; label: any }> = {
  primary: {
    container: { backgroundColor: colors.indigo },
    label: { color: colors.white },
  },
  teal: {
    container: { backgroundColor: colors.teal },
    label: { color: colors.navy },
  },
  secondary: {
    container: {
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.border,
    },
    label: { color: colors.text },
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    label: { color: colors.teal },
  },
};

const styles = StyleSheet.create({
  base: {
    height: 54,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  fullWidth: { alignSelf: 'stretch' },
  row: { flexDirection: 'row', alignItems: 'center' },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.45 },
  label: {
    fontFamily: fonts.bodySemi,
    fontSize: 16,
    letterSpacing: 0.2,
    textTransform: 'capitalize',
  },
});
