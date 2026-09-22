import { type ReactNode, useMemo } from 'react';
import { StyleSheet, Text, View, type StyleProp, type TextStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';

type Block =
  | { kind: 'paragraph'; text: string }
  | { kind: 'bullet'; items: string[] }
  | { kind: 'ordered'; items: string[] };

const INLINE = /(\*\*[^*\n]+\*\*|\*[^*\n]+\*|`[^`\n]+`)/g;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let index = 0;
  let match: RegExpExecArray | null;
  INLINE.lastIndex = 0;

  while ((match = INLINE.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const token = match[0];
    const key = `${keyPrefix}-${index++}`;
    if (token.startsWith('**')) {
      nodes.push(
        <Text key={key} style={styles.bold}>
          {token.slice(2, -2)}
        </Text>,
      );
    } else if (token.startsWith('`')) {
      nodes.push(
        <Text key={key} style={styles.code}>
          {token.slice(1, -1)}
        </Text>,
      );
    } else {
      nodes.push(
        <Text key={key} style={styles.italic}>
          {token.slice(1, -1)}
        </Text>,
      );
    }
    last = match.index + token.length;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function parseBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: { kind: 'bullet' | 'ordered'; items: string[] } | null = null;

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ kind: 'paragraph', text: paragraph.join(' ') });
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list) {
      blocks.push(list);
      list = null;
    }
  };

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    const bullet = /^[-*]\s+(.*)$/.exec(line);
    const ordered = /^\d+[.)]\s+(.*)$/.exec(line);

    if (bullet) {
      flushParagraph();
      if (!list || list.kind !== 'bullet') {
        flushList();
        list = { kind: 'bullet', items: [] };
      }
      list.items.push(bullet[1]);
      continue;
    }

    if (ordered) {
      flushParagraph();
      if (!list || list.kind !== 'ordered') {
        flushList();
        list = { kind: 'ordered', items: [] };
      }
      list.items.push(ordered[1]);
      continue;
    }

    flushList();
    const heading = /^#{1,6}\s+(.*)$/.exec(line);
    paragraph.push(heading ? heading[1] : line);
  }

  flushParagraph();
  flushList();
  return blocks;
}

export function MarkdownText({ text, style }: { text: string; style?: StyleProp<TextStyle> }) {
  const blocks = useMemo(() => parseBlocks(text), [text]);

  return (
    <View style={styles.container}>
      {blocks.map((block, blockIndex) => {
        if (block.kind === 'paragraph') {
          return (
            <ThemedText key={blockIndex} type="small" style={style}>
              {renderInline(block.text, `p${blockIndex}`)}
            </ThemedText>
          );
        }
        return block.items.map((item, itemIndex) => (
          <ThemedText key={`${blockIndex}-${itemIndex}`} type="small" style={style}>
            {block.kind === 'ordered' ? `${itemIndex + 1}. ` : '•  '}
            {renderInline(item, `l${blockIndex}-${itemIndex}`)}
          </ThemedText>
        ));
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexShrink: 1,
    gap: Spacing.one,
  },
  bold: {
    fontWeight: '700',
  },
  italic: {
    fontStyle: 'italic',
  },
  code: {
    fontFamily: Fonts.mono,
    backgroundColor: 'rgba(127, 127, 127, 0.16)',
  },
});
