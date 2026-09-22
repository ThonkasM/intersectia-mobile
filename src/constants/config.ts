import { Platform } from 'react-native';

/**
 * Android emulators reach the host machine through 10.0.2.2, not localhost.
 * On a physical device point EXPO_PUBLIC_API_URL at your machine's LAN IP
 * (e.g. http://192.168.1.20:3000).
 */
const FALLBACK_API_URL = Platform.select({
  android: 'http://10.0.2.2:3000',
  default: 'http://localhost:3000',
});

export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? FALLBACK_API_URL).replace(/\/+$/, '');

/**
 * URL de la demo 3D (Three.js) que se embebe en la tab "Demo".
 * Por defecto usa el mismo origen que el backend (nginx sirve el frontend y proxya /ai y /socket.io).
 */
export const DEMO_URL = (process.env.EXPO_PUBLIC_DEMO_URL ?? `${API_URL}/demo`).replace(/\/+$/, '');
