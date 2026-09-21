import { Ionicons } from '@expo/vector-icons';
import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { API_URL } from '@/constants/config';
import { Radius, Spacing } from '@/constants/theme';
import { useChat } from '@/hooks/use-chat';
import { useTheme } from '@/hooks/use-theme';
import {
  CHAT_SESSION_KEY,
  createMemoryStore,
  createSessionId,
  resolveSessionId,
} from '@/lib/chat/session';
import type { ChatMessage } from '@/lib/chat/types';

const ERROR_TEXT = `No pude contactar al asistente en ${API_URL}. Verificá que el backend esté corriendo y accesible desde el dispositivo.`;

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    role: 'assistant',
    text: '¡Hola! Soy el asistente de IntersectIA. Preguntame sobre IoT, vehículos autónomos o la demo.',
  },
];

const sessionStore = createMemoryStore();

export default function AssistantScreen() {
  const theme = useTheme();
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const [sessionId, setSessionId] = useState(() => resolveSessionId(sessionStore, CHAT_SESSION_KEY));
  const [input, setInput] = useState('');
  const { messages, topics, loading, send, reset } = useChat({
    baseUrl: API_URL,
    sessionId,
    initialMessages: INITIAL_MESSAGES,
    errorText: ERROR_TEXT,
  });

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  }, []);

  const onSend = useCallback(
    (value: string) => {
      const text = value.trim();
      if (text.length === 0 || loading) return;
      setInput('');
      void send(text);
    },
    [loading, send],
  );

  const onReset = useCallback(() => {
    reset();
    setInput('');
    setSessionId(createSessionId());
  }, [reset]);

  const suggestions = messages.length <= 1 ? topics.slice(0, 6) : [];

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <View style={styles.headerText}>
            <ThemedText type="heading">Asistente IntersectIA</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              IoT · Vehículos autónomos · Demo
            </ThemedText>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Reiniciar conversación"
            onPress={onReset}
            style={({ pressed }) => [
              styles.iconButton,
              { borderColor: theme.border, opacity: pressed ? 0.7 : 1 },
            ]}>
            <Ionicons name="refresh-outline" size={18} color={theme.text} />
          </Pressable>
        </View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
          <FlatList
            ref={listRef}
            data={messages}
            renderItem={({ item }) => <Bubble message={item} />}
            keyExtractor={(_, index) => String(index)}
            contentContainerStyle={styles.list}
            onContentSizeChange={scrollToEnd}
            keyboardShouldPersistTaps="handled"
            ListFooterComponent={
              loading ? (
                <View style={[styles.bubbleRow, styles.bubbleRowAssistant]}>
                  <View
                    style={[
                      styles.bubble,
                      styles.bubbleAssistant,
                      { backgroundColor: theme.surfaceStrong, borderColor: theme.border },
                    ]}>
                    <ActivityIndicator size="small" color={theme.accent} />
                    <ThemedText type="small" themeColor="textSecondary">
                      Escribiendo…
                    </ThemedText>
                  </View>
                </View>
              ) : null
            }
          />

          {suggestions.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              style={[styles.suggestions, { borderTopColor: theme.border }]}
              contentContainerStyle={styles.suggestionsContent}>
              {suggestions.map((topic) => (
                <Pressable
                  key={topic.slug}
                  accessibilityRole="button"
                  onPress={() => onSend(topic.titulo)}
                  style={({ pressed }) => [
                    styles.chip,
                    {
                      borderColor: theme.border,
                      backgroundColor: theme.surface,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}>
                  <ThemedText type="small" themeColor="textSecondary">
                    {topic.titulo}
                  </ThemedText>
                </Pressable>
              ))}
            </ScrollView>
          ) : null}

          <View style={[styles.composer, { borderTopColor: theme.border }]}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Escribí tu pregunta…"
              placeholderTextColor={theme.textFaint}
              style={[
                styles.input,
                {
                  color: theme.text,
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
              multiline
              maxLength={2000}
              editable={!loading}
              onSubmitEditing={() => onSend(input)}
              returnKeyType="send"
              submitBehavior="submit"
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Enviar mensaje"
              onPress={() => onSend(input)}
              disabled={loading || input.trim().length === 0}
              style={({ pressed }) => [
                styles.sendButton,
                {
                  backgroundColor: theme.accent,
                  opacity: loading || input.trim().length === 0 ? 0.4 : pressed ? 0.75 : 1,
                },
              ]}>
              <Ionicons name="send" size={18} color={theme.accentContrast} />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

function Bubble({ message }: { message: ChatMessage }) {
  const theme = useTheme();
  const isUser = message.role === 'user';

  return (
    <View style={[styles.bubbleRow, isUser ? styles.bubbleRowUser : styles.bubbleRowAssistant]}>
      <View
        style={[
          styles.bubble,
          isUser ? styles.bubbleUser : styles.bubbleAssistant,
          {
            backgroundColor: isUser ? theme.accent : theme.surface,
            borderColor: theme.border,
          },
        ]}>
        <ThemedText type="small" style={{ color: isUser ? theme.accentContrast : theme.text }}>
          {message.text}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerText: {
    flex: 1,
    gap: Spacing.half,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  bubbleRow: {
    flexDirection: 'row',
  },
  bubbleRowUser: {
    justifyContent: 'flex-end',
  },
  bubbleRowAssistant: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '85%',
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    gap: Spacing.two,
  },
  bubbleUser: {
    borderTopRightRadius: Radius.sm,
  },
  bubbleAssistant: {
    borderTopLeftRadius: Radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestions: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  suggestionsContent: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  chip: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + Spacing.half,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
    fontSize: 15,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
