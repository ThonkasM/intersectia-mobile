import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { useEffect, useState } from 'react';
import {
  type LayoutChangeEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type IoniconName = keyof typeof Ionicons.glyphMap;

const TAB_META: Record<string, { icon: IoniconName; label: string }> = {
  index: { icon: 'home-outline', label: 'Inicio' },
  asistente: { icon: 'chatbubble-ellipses-outline', label: 'Asistente' },
};

const BAR_PADDING = 6;
const TAB_GAP = 4;
const TAB_HEIGHT = 54;
const WRAPPER_PADDING = 8;

export const FLOATING_TAB_BAR_SPACE = BAR_PADDING * 2 + TAB_HEIGHT + WRAPPER_PADDING * 2;

export function useTabBarClearance(): number {
  const insets = useSafeAreaInsets();
  if (Platform.OS === 'ios') return insets.bottom;
  return insets.bottom + FLOATING_TAB_BAR_SPACE + Spacing.three;
}

export default function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [barWidth, setBarWidth] = useState(0);

  const activeIndex = state.index;
  const tabCount = state.routes.length;
  const availableWidth = barWidth - BAR_PADDING * 2 - TAB_GAP * (tabCount - 1);
  const tabWidth = barWidth > 0 ? availableWidth / tabCount : 0;

  const pillTranslateX = useSharedValue(0);
  const pillOpacity = useSharedValue(0);

  useEffect(() => {
    if (tabWidth > 0) {
      pillTranslateX.value = withSpring(activeIndex * (tabWidth + TAB_GAP), {
        damping: 24,
        stiffness: 280,
        mass: 0.8,
      });
      pillOpacity.value = withTiming(1, { duration: 200 });
    }
  }, [activeIndex, tabWidth, pillTranslateX, pillOpacity]);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pillTranslateX.value }],
    width: tabWidth,
    opacity: pillOpacity.value,
  }));

  const handleBarLayout = (event: LayoutChangeEvent) => {
    setBarWidth(event.nativeEvent.layout.width);
  };

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrapper, { paddingBottom: insets.bottom + WRAPPER_PADDING }]}>
      <View
        onLayout={handleBarLayout}
        style={[styles.bar, { backgroundColor: theme.background, borderColor: theme.border }]}>
        {tabWidth > 0 ? (
          <Animated.View
            style={[styles.pill, { backgroundColor: theme.accent }, pillStyle]}
          />
        ) : null}
        {state.routes.map((route, index) => {
          const isActive = index === activeIndex;
          const meta = TAB_META[route.name];
          const options = descriptors[route.key]?.options;
          const label = meta?.label ?? options?.title ?? route.name;

          return (
            <Pressable
              key={route.key}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!isActive && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
              onLongPress={() => {
                navigation.emit({ type: 'tabLongPress', target: route.key });
              }}
              android_ripple={{ color: 'transparent' }}
              accessibilityRole="button"
              accessibilityState={isActive ? { selected: true } : {}}
              accessibilityLabel={options?.tabBarAccessibilityLabel ?? label}
              style={({ pressed }) => [
                styles.tabItem,
                { width: tabWidth, opacity: pressed ? 0.7 : 1 },
              ]}>
              <Ionicons
                name={meta?.icon ?? 'ellipse-outline'}
                size={22}
                color={isActive ? theme.accentContrast : theme.textFaint}
              />
              {isActive ? (
                <Animated.View entering={FadeIn.duration(150)} exiting={FadeOut.duration(100)}>
                  <Text style={[styles.label, { color: theme.accentContrast }]} numberOfLines={1}>
                    {label}
                  </Text>
                </Animated.View>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: WRAPPER_PADDING,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: TAB_GAP,
    width: '100%',
    maxWidth: 480,
    padding: BAR_PADDING,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.xl,
    elevation: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
  },
  pill: {
    position: 'absolute',
    top: BAR_PADDING,
    left: BAR_PADDING,
    bottom: BAR_PADDING,
    borderRadius: Radius.xl - BAR_PADDING,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    height: TAB_HEIGHT,
    gap: Spacing.half,
    borderRadius: Radius.xl - BAR_PADDING,
    zIndex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
});
