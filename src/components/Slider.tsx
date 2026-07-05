import React, { useRef, useState } from 'react';
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  View,
} from 'react-native';
import { colors, radii } from '../theme';

interface Props {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  trackColor?: string;
}

/**
 * Lightweight draggable slider built on PanResponder so we don't pull in
 * an external slider package. Works on web + native.
 */
export function Slider({ value, min, max, step = 1, onChange, trackColor }: Props) {
  const [width, setWidth] = useState(0);
  const widthRef = useRef(0);

  const setFromX = (x: number) => {
    const w = widthRef.current;
    if (w <= 0) return;
    const ratio = Math.min(1, Math.max(0, x / w));
    const clamped = Math.min(max, Math.max(min, min + ratio * (max - min)));
    const stepped = Math.round((clamped - min) / step) * step + min;
    onChange(Math.min(max, Math.max(min, stepped)));
  };

  // Keep the latest handler in a ref so the once-created PanResponder always
  // uses the current step's min/max/onChange (the Slider instance is reused
  // across the wizard steps — capturing the first render's closure would make
  // later steps silently drag the wrong value).
  const setFromXRef = useRef(setFromX);
  setFromXRef.current = setFromX;

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    widthRef.current = w;
    setWidth(w);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e: GestureResponderEvent) => setFromXRef.current(e.nativeEvent.locationX),
      onPanResponderMove: (e: GestureResponderEvent) => setFromXRef.current(e.nativeEvent.locationX),
    })
  ).current;

  const pct = max > min ? (value - min) / (max - min) : 0;
  const fillWidth = Math.max(0, Math.min(1, pct)) * width;

  return (
    <View
      style={styles.hitArea}
      onLayout={onLayout}
      {...panResponder.panHandlers}
    >
      <View style={[styles.track, trackColor ? { backgroundColor: trackColor } : null]} />
      <View style={[styles.fill, { width: fillWidth }]} />
      <View
        style={[
          styles.thumb,
          { left: Math.max(0, Math.min(width - 24, fillWidth - 12)) },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  hitArea: {
    height: 36,
    justifyContent: 'center',
  },
  track: {
    height: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.border,
  },
  fill: {
    position: 'absolute',
    height: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.teal,
  },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.teal,
    shadowColor: '#1A1D3A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});
