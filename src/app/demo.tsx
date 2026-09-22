import { Ionicons } from '@expo/vector-icons';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView, type WebViewNavigation } from 'react-native-webview';

import { useTabBarClearance } from '@/components/floating-tab-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { DEMO_URL } from '@/constants/config';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const DEMO_ORIGIN = DEMO_URL.replace(/^(https?:\/\/[^/]+).*$/, '$1');
const DEMO_EMBED_URL = `${DEMO_URL}${DEMO_URL.includes('?') ? '&' : '?'}embed=1`;

export default function DemoScreen() {
  const theme = useTheme();
  const tabBarClearance = useTabBarClearance();
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    setError(null);
    setLoading(true);
    webViewRef.current?.reload();
  }, []);

  const onShouldStartLoadWithRequest = useCallback((request: WebViewNavigation) => {
    const { url } = request;
    if (
      url.startsWith(DEMO_ORIGIN) ||
      url.startsWith('about:') ||
      url.startsWith('data:') ||
      url.startsWith('blob:')
    ) {
      return true;
    }
    void Linking.openURL(url).catch(() => undefined);
    return false;
  }, []);

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.flex} edges={['top']}>
        <View style={[styles.flex, { paddingBottom: tabBarClearance }]}>
          <WebView
            ref={webViewRef}
            source={{ uri: DEMO_EMBED_URL }}
            style={[styles.webview, { backgroundColor: theme.background }]}
            originWhitelist={['*']}
            javaScriptEnabled
            domStorageEnabled
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            onLoadStart={() => {
              setLoading(true);
              setError(null);
            }}
            onLoadEnd={() => setLoading(false)}
            onError={(event) => {
              setLoading(false);
              setError(event.nativeEvent.description || 'No se pudo cargar la demo.');
            }}
            onHttpError={(event) => {
              setLoading(false);
              setError(`HTTP ${event.nativeEvent.statusCode}`);
            }}
            onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
          />

          {loading && !error ? (
            <View style={styles.overlay} pointerEvents="none">
              <ActivityIndicator size="large" color={theme.accent} />
            </View>
          ) : null}

          {error ? (
            <View style={styles.overlay}>
              <View
                style={[
                  styles.errorCard,
                  { backgroundColor: theme.background, borderColor: theme.border },
                ]}>
                <Ionicons name="cloud-offline-outline" size={28} color={theme.accent} />
                <ThemedText type="smallBold">No se pudo cargar la demo</ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.errorText}>
                  {error}
                </ThemedText>
                <ThemedText type="code" themeColor="textFaint">
                  {DEMO_EMBED_URL}
                </ThemedText>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Reintentar"
                  onPress={reload}
                  style={({ pressed }) => [
                    styles.retry,
                    {
                      backgroundColor: theme.accent,
                      opacity: pressed ? 0.75 : 1,
                    },
                  ]}>
                  <ThemedText type="smallBold" style={{ color: theme.accentContrast }}>
                    Reintentar
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  errorCard: {
    alignItems: 'center',
    gap: Spacing.two,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.lg,
    padding: Spacing.four,
    maxWidth: 420,
  },
  errorText: {
    textAlign: 'center',
  },
  retry: {
    marginTop: Spacing.two,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
});
