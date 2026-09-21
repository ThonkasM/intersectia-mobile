import { Ionicons } from '@expo/vector-icons';
import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { forwardRef, useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { ChatTopic } from '@/lib/chat/types';

const SNAP_POINTS = ['58%', '92%'];

const CATEGORY_LABELS: Record<string, string> = {
  generales: 'Generales',
  proyecto: 'Proyecto',
};

const CATEGORY_ORDER = ['generales', 'proyecto'];

function categoryRank(categoria: string): number {
  const index = CATEGORY_ORDER.indexOf(categoria);
  return index === -1 ? CATEGORY_ORDER.length : index;
}

export type TopicsSheetProps = {
  topics: ChatTopic[];
  onSelect: (titulo: string) => void;
};

function TopicGroup({
  label,
  items,
  onSelect,
}: {
  label: string;
  items: ChatTopic[];
  onSelect: (titulo: string) => void;
}) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const rotation = useSharedValue(0);

  const toggle = useCallback(() => {
    const next = !expanded;
    setExpanded(next);
    rotation.value = withTiming(next ? 1 : 0, { duration: 180 });
  }, [expanded, rotation]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value * 90}deg` }],
  }));

  return (
    <View style={styles.group}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={label}
        onPress={toggle}
        style={({ pressed }) => [styles.groupHeader, { opacity: pressed ? 0.7 : 1 }]}>
        <ThemedText type="eyebrow" themeColor="accentText">
          {label}
        </ThemedText>
        <View style={styles.groupHeaderRight}>
          <ThemedText type="code" themeColor="textFaint">
            {items.length}
          </ThemedText>
          <Animated.View style={chevronStyle}>
            <Ionicons name="chevron-forward" size={16} color={theme.textFaint} />
          </Animated.View>
        </View>
      </Pressable>

      {expanded ? (
        <Animated.View
          layout={LinearTransition.duration(200)}
          entering={FadeIn.duration(150)}
          exiting={FadeOut.duration(120)}
          style={styles.items}>
          {items.map((topic) => (
            <Pressable
              key={topic.slug}
              accessibilityRole="button"
              accessibilityLabel={topic.titulo}
              onPress={() => onSelect(topic.titulo)}
              style={({ pressed }) => [
                styles.item,
                {
                  borderColor: theme.border,
                  backgroundColor: theme.surface,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}>
              <ThemedText type="default" style={styles.itemText}>
                {topic.titulo}
              </ThemedText>
              <Ionicons name="chevron-forward" size={16} color={theme.textFaint} />
            </Pressable>
          ))}
        </Animated.View>
      ) : null}
    </View>
  );
}

export const TopicsSheet = forwardRef<BottomSheetModal, TopicsSheetProps>(
  function TopicsSheet({ topics, onSelect }, ref) {
    const theme = useTheme();

    const groups = useMemo(() => {
      const map = new Map<string, ChatTopic[]>();
      for (const topic of topics) {
        const key = topic.categoria?.trim() || 'otros';
        const list = map.get(key);
        if (list) list.push(topic);
        else map.set(key, [topic]);
      }
      return Array.from(map, ([categoria, items]) => ({ categoria, items })).sort(
        (a, b) => categoryRank(a.categoria) - categoryRank(b.categoria),
      );
    }, [topics]);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.5}
        />
      ),
      [],
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={SNAP_POINTS}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: theme.background }}
        handleIndicatorStyle={{ backgroundColor: theme.borderStrong }}>
        <BottomSheetScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <ThemedText type="subtitle">Temas</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Elegí una pregunta sugerida sobre IoT, vehículos autónomos o la demo.
            </ThemedText>
          </View>

          {groups.map((group) => (
            <TopicGroup
              key={group.categoria}
              label={CATEGORY_LABELS[group.categoria] ?? group.categoria}
              items={group.items}
              onSelect={onSelect}
            />
          ))}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
    gap: Spacing.four,
  },
  header: {
    gap: Spacing.one,
  },
  group: {
    gap: Spacing.two,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.one,
  },
  groupHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  items: {
    gap: Spacing.two,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + Spacing.half,
  },
  itemText: {
    flex: 1,
  },
});
