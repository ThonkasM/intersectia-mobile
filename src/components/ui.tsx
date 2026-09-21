import { type ReactNode } from 'react';
import { Pressable, type PressableProps, StyleSheet, View, type ViewProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function Card({ style, ...rest }: ViewProps) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.surface, borderColor: theme.border },
        style,
      ]}
      {...rest}
    />
  );
}

export function Badge({ label, tone = 'accent' }: { label: string; tone?: 'accent' | 'emerald' | 'muted' }) {
  const theme = useTheme();
  const color =
    tone === 'emerald' ? theme.emerald : tone === 'muted' ? theme.textSecondary : theme.accentText;

  return (
    <View style={[styles.badge, { borderColor: color, backgroundColor: theme.surface }]}>
      <ThemedText type="code" style={{ color }}>
        {label}
      </ThemedText>
    </View>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <ThemedText type="eyebrow" themeColor="accentText">
        {eyebrow}
      </ThemedText>
      <ThemedText type="subtitle">{title}</ThemedText>
      {description ? (
        <ThemedText themeColor="textSecondary" style={styles.sectionDescription}>
          {description}
        </ThemedText>
      ) : null}
    </View>
  );
}

export function Button({
  label,
  variant = 'primary',
  style,
  ...rest
}: PressableProps & { label: string; variant?: 'primary' | 'outline' }) {
  const theme = useTheme();
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      style={(state) => [
        styles.button,
        {
          backgroundColor: isPrimary ? theme.accent : 'transparent',
          borderColor: isPrimary ? theme.accent : theme.borderStrong,
          opacity: state.pressed ? 0.75 : 1,
        },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}>
      <ThemedText
        type="smallBold"
        style={{ color: isPrimary ? theme.accentContrast : theme.text }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

export function Field({ children }: { children: ReactNode }) {
  return <View style={styles.field}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.lg,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  badge: {
    alignSelf: 'flex-start',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
  sectionHeader: {
    gap: Spacing.two,
  },
  sectionDescription: {
    maxWidth: 560,
  },
  button: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two + Spacing.half,
    alignItems: 'center',
    justifyContent: 'center',
  },
  field: {
    gap: Spacing.two,
  },
});
