import type { ImageSourcePropType } from 'react-native';

export const BRAND = {
  name: 'IntersectIA',
  tagline: 'IoT y vehículos autónomos en una intersección que se gestiona sola.',
  footer: 'Proyecto académico · Ingeniería de Software II',
};

export const HERO = {
  eyebrow: 'IoT × Vehículos autónomos',
  title: 'Una intersección que se gestiona sola.',
  description:
    'IntersectIA es una demo en vivo de cómo el IoT hace las intersecciones más seguras y eficientes: un nodo IoT central decide quién cruza, en tiempo real, y los vehículos autónomos solo ejecutan la orden.',
  stats: '3 modos de simulación · 20 ticks/s · 1 nodo IoT central',
};

export type Pillar = { title: string; body: string };

export const IOT_PILLARS: Pillar[] = [
  {
    title: 'Sensores',
    body: 'Miden el entorno: presencia de vehículos, velocidad, distancia y cruce de líneas.',
  },
  {
    title: 'Conectividad',
    body: 'Llevan esas lecturas a un nodo central a través de la red, con baja latencia.',
  },
  {
    title: 'Edge / Cloud',
    body: 'El procesamiento ocurre cerca de los datos (edge) o se agrega en la nube.',
  },
  {
    title: 'Datos en tiempo real',
    body: 'El valor está en la inmediatez: decidir con lecturas del instante, no de ayer.',
  },
];

export type SaeLevel = { level: string; title: string; body: string };

export const SAE_LEVELS: SaeLevel[] = [
  { level: 'L0', title: 'Sin automatización', body: 'El conductor controla todo el tiempo.' },
  { level: 'L1', title: 'Asistencia al conductor', body: 'Ayuda puntual en dirección o velocidad.' },
  {
    level: 'L2',
    title: 'Automatización parcial',
    body: 'Dirección y aceleración simultáneas con conductor atento.',
  },
  {
    level: 'L3',
    title: 'Automatización condicional',
    body: 'El sistema conduce; el humano interviene cuando se le pide.',
  },
  {
    level: 'L4',
    title: 'Alta automatización',
    body: 'Conduce sin intervención en zonas y condiciones definidas.',
  },
  {
    level: 'L5',
    title: 'Automatización completa',
    body: 'Sin volante ni conductor: decide y actúa por sí mismo.',
  },
];

export type Channel = { tag: string; title: string; body: string };

export const IOT_AV_CHANNELS: Channel[] = [
  {
    tag: 'V2V',
    title: 'Vehículo a vehículo',
    body: 'Los vehículos comparten posición, velocidad e intención entre sí para coordinar maniobras sin esperar señales externas.',
  },
  {
    tag: 'V2I',
    title: 'Vehículo a infraestructura',
    body: 'El vehículo conversa con el semáforo o el nodo de la intersección. Es el canal que IntersectIA usa para recibir la orden de cruzar.',
  },
  {
    tag: 'Edge vs Cloud',
    title: 'Latencia',
    body: 'Las decisiones críticas necesitan el edge: milisegundos, no idas y vueltas a la nube. El nodo IoT gestiona la intersección localmente, en tiempo real.',
  },
];

export type StudyMode = { name: string; badge: string; body: string };

export const STUDY_MODES: StudyMode[] = [
  {
    name: 'Modo tradicional',
    badge: 'Art. 52 · Sin gestor',
    body: 'Prioridad al de la derecha: cada conductor negocia, espera y asume riesgo. Largas colas en hora pico.',
  },
  {
    name: 'Modo IoT gestionado',
    badge: 'Algoritmo determinista FIFO',
    body: 'Un nodo central registra cada llegada y otorga el paso en orden estricto. Sin ambigüedad ni regateos.',
  },
  {
    name: 'Modo IoT + IA',
    badge: 'Política de decisión IA',
    body: 'El gestor compara una política basada en IA contra el algoritmo determinista para medir la mejora.',
  },
];

export const CASE_STUDY = {
  problemTitle: 'Problemática',
  problem:
    'En un cruce de 4 vías con prioridad a la derecha —el Art. 52 del Código Nacional de Tránsito de Bolivia— cada conductor negocia el paso por su cuenta. El resultado: esperas reales, atascos en hora pico y riesgo permanente de choque.',
  solutionTitle: 'Solución',
  solution:
    'IntersectIA concentra la decisión en un nodo IoT central (backend): él decide quién cruza y los vehículos solo renderizan y ejecutan lo que el nodo indica. Así la intersección se gestiona sola, sin ambigüedad.',
  highlight:
    'La demo mide el tiempo de espera promedio por modo para cuantificar la mejora frente al Art. 52.',
};

export type DemoStep = { step: string; title: string; body: string };

export const DEMO_STEPS: DemoStep[] = [
  {
    step: '01',
    title: 'El backend simula',
    body: 'Genera los vehículos, los mueve, los encola y decide quién cruza según el modo activo: Art. 52, FIFO o IA.',
  },
  {
    step: '02',
    title: 'Emite snapshots por WebSocket',
    body: 'Cada 50 ms (20 Hz) publica el estado de cada vehículo: posición, carril y estado.',
  },
  {
    step: '03',
    title: 'Three.js interpola y dibuja',
    body: 'El frontend interpola las posiciones entre mensajes y renderiza la escena en 3D.',
  },
];

export type TeamMember = {
  apellido: string;
  nombre: string;
  photo: ImageSourcePropType;
};

export const TEAM: TeamMember[] = [
  {
    apellido: 'Arteaga',
    nombre: 'Miguel',
    photo: require('@/assets/equipo/Arteaga-Miguel.jpeg'),
  },
  {
    apellido: 'Caballero',
    nombre: 'Cesar',
    photo: require('@/assets/equipo/Caballero-Cesar.jpeg'),
  },
  {
    apellido: 'Carvajal',
    nombre: 'Jorge',
    photo: require('@/assets/equipo/Carvajal-Jorge.jpeg'),
  },
  {
    apellido: 'Veslasquez',
    nombre: 'Arnulfo',
    photo: require('@/assets/equipo/Veslasquez-Arnulfo.jpeg'),
  },
  {
    apellido: 'Yebara',
    nombre: 'Diego',
    photo: require('@/assets/equipo/Yebara-Diego.jpeg'),
  },
];
