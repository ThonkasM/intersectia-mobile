import { useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTabBarClearance } from '@/components/floating-tab-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Badge, Button, Card, SectionHeader } from '@/components/ui';
import {
  BRAND,
  CASE_STUDY,
  DEMO_STEPS,
  HERO,
  IOT_AV_CHANNELS,
  IOT_PILLARS,
  SAE_LEVELS,
  STUDY_MODES,
  TEAM,
} from '@/constants/landing';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function WelcomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const tabBarClearance = useTabBarClearance();

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: Spacing.six + tabBarClearance }]}
          showsVerticalScrollIndicator={false}>
          <View style={styles.brandRow}>
            <Image
              source={require('@/assets/icons/intersectia-mark.png')}
              style={styles.logoImage}
            />
            <ThemedText type="heading">
              {BRAND.name.slice(0, -2)}
              <ThemedText type="heading" themeColor="accentText">
                {BRAND.name.slice(-2)}
              </ThemedText>
            </ThemedText>
          </View>

          <View style={styles.hero}>
            <Badge label={HERO.eyebrow} />
            <ThemedText type="title">{HERO.title}</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.heroText}>
              {HERO.description}
            </ThemedText>
            <Button label="Hablar con el asistente" onPress={() => router.push('/asistente')} />
            <ThemedText type="code" themeColor="textFaint">
              {HERO.stats}
            </ThemedText>
          </View>

          <Section
            eyebrow="¿Qué es IoT?"
            title="El mundo físico, conectado."
            description="Internet de las Cosas conecta objetos físicos —sensores, semáforos, vehículos— para que midan su entorno y compartan datos sin intervención humana. La intersección deja de ser un lugar ciego y pasa a ser un sistema que observa, decide y responde en milisegundos.">
            <View style={styles.grid}>
              {IOT_PILLARS.map((pillar) => (
                <Card key={pillar.title} style={styles.gridItem}>
                  <ThemedText type="heading">{pillar.title}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {pillar.body}
                  </ThemedText>
                </Card>
              ))}
            </View>
          </Section>

          <Section
            eyebrow="Vehículos autónomos"
            title="Del conductor al algoritmo."
            description="La autonomía se mide en seis niveles definidos por la SAE, de la asistencia mínima al vehículo totalmente autónomo.">
            <View style={styles.list}>
              {SAE_LEVELS.map((item) => (
                <Card key={item.level} style={styles.rowCard}>
                  <Badge label={item.level} tone="muted" />
                  <View style={styles.rowBody}>
                    <ThemedText type="smallBold">{item.title}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {item.body}
                    </ThemedText>
                  </View>
                </Card>
              ))}
            </View>
          </Section>

          <Section
            eyebrow="IoT ↔ Autónomos"
            title="La ciudad que habla con los vehículos."
            description="Un vehículo autónomo no decide solo: se coordina con los demás y con la infraestructura. El IoT es el sistema nervioso del cruce.">
            <View style={styles.list}>
              {IOT_AV_CHANNELS.map((channel) => (
                <Card key={channel.tag}>
                  <Badge label={channel.tag} />
                  <ThemedText type="heading">{channel.title}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {channel.body}
                  </ThemedText>
                </Card>
              ))}
            </View>
          </Section>

          <Section
            eyebrow="Caso de estudio"
            title="IntersectIA: el gestor de la intersección."
            description="Tres modos de gestión sobre el mismo cruce de 4 vías.">
            <View style={styles.list}>
              {STUDY_MODES.map((mode) => (
                <Card key={mode.name}>
                  <ThemedText type="heading">{mode.name}</ThemedText>
                  <Badge label={mode.badge} tone="muted" />
                  <ThemedText type="small" themeColor="textSecondary">
                    {mode.body}
                  </ThemedText>
                </Card>
              ))}
            </View>
            <Card>
              <ThemedText type="smallBold">{CASE_STUDY.problemTitle}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {CASE_STUDY.problem}
              </ThemedText>
            </Card>
            <Card>
              <ThemedText type="smallBold">{CASE_STUDY.solutionTitle}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {CASE_STUDY.solution}
              </ThemedText>
            </Card>
            <ThemedText type="small" themeColor="accentText">
              {CASE_STUDY.highlight}
            </ThemedText>
          </Section>

          <Section
            eyebrow="La demo"
            title="Cómo funciona."
            description="Toda la simulación ocurre en el backend. El frontend es solo una ventana: escucha por WebSocket, interpola y dibuja lo que el servidor ya decidió.">
            <View style={styles.list}>
              {DEMO_STEPS.map((item) => (
                <Card key={item.step} style={styles.rowCard}>
                  <Badge label={item.step} />
                  <View style={styles.rowBody}>
                    <ThemedText type="smallBold">{item.title}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {item.body}
                    </ThemedText>
                  </View>
                </Card>
              ))}
            </View>
          </Section>

          <Section eyebrow="Equipo" title="Quiénes lo construyen.">
            <View style={styles.grid}>
              {TEAM.map((member) => (
                <Card
                  key={`${member.apellido}-${member.nombre}`}
                  style={styles.teamItem}>
                  <Image
                    source={member.photo}
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />
                  <ThemedText type="smallBold" style={styles.teamName}>
                    {member.apellido} {member.nombre}
                  </ThemedText>
                </Card>
              ))}
            </View>
          </Section>

          <View style={[styles.footer, { borderTopColor: theme.border }]}>
            <ThemedText type="heading">
              {BRAND.name.slice(0, -2)}
              <ThemedText type="heading" themeColor="accentText">
                {BRAND.name.slice(-2)}
              </ThemedText>
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {BRAND.tagline}
            </ThemedText>
            <ThemedText type="code" themeColor="textFaint">
              {BRAND.footer}
            </ThemedText>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function Section({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <SectionHeader eyebrow={eyebrow} title={title} description={description} />
      {children}
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
  content: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.six,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingTop: Spacing.three,
  },
  logoImage: {
    width: 30,
    height: 30,
  },
  hero: {
    gap: Spacing.three,
    paddingTop: Spacing.four,
  },
  heroText: {
    fontSize: 17,
    lineHeight: 25,
  },
  section: {
    gap: Spacing.three,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  gridItem: {
    flexGrow: 1,
    flexBasis: 150,
  },
  list: {
    gap: Spacing.three,
  },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
  },
  rowBody: {
    flex: 1,
    gap: Spacing.one,
  },
  teamItem: {
    flexGrow: 1,
    flexBasis: 140,
    alignItems: 'center',
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: Radius.pill,
  },
  teamName: {
    textAlign: 'center',
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.four,
    gap: Spacing.one,
  },
});
