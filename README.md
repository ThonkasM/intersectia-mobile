# IntersectIA Mobile

App de Expo (SDK 57) con dos pantallas:

- **Inicio** — página de bienvenida que reúne el contenido de la landing de `intersectia-frontend`
  (hero, qué es IoT, vehículos autónomos, relación IoT↔AV, caso de estudio, cómo funciona la demo, equipo).
- **Asistente** — chatbot que consume el mismo endpoint que la web: `POST /ai/chat`.

Stack: Expo Router (tabs) + TypeScript. No hay lógica de simulación aquí; la app solo muestra
contenido y conversa con el backend NestJS.

## Requisitos

| Herramienta | Versión |
| --- | --- |
| Node.js | 22.13+ |
| JDK | 17 (`JAVA_HOME` apuntando a él) |
| Android SDK Platform | 36 |
| Android Build-Tools | 36.0.0 |
| Android NDK | 27.1.12297006 |
| Gradle | 9.3.1 (lo baja el wrapper) |

Variables de entorno:

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export JAVA_HOME="$(/usr/libexec/java_home -v 17)"
export PATH="$ANDROID_HOME/platform-tools:$PATH"
```

## Instalación

```bash
npm install
```

## Configuración

El backend (NestJS) debe estar corriendo y accesible desde el dispositivo. La app lee la URL base de
`EXPO_PUBLIC_API_URL`:

```bash
cp .env.example .env
```

Valores típicos:

- **Emulador Android:** `http://10.0.2.2:3000` (el host se ve como `10.0.2.2`, no `localhost`). Es
  además el valor por defecto del código si no definís la variable.
- **Dispositivo físico:** `http://<IP-LAN-de-tu-máquina>:3000`.

`usesCleartextTraffic` está activado (vía `expo-build-properties`) para permitir HTTP en desarrollo.
Desactivalo si vas a publicar y usás HTTPS.

## Desarrollo

```bash
npm start          # Metro; luego 'a' para Android o escaneá el QR
npm run android    # compila e instala en emulador/dispositivo (expo run:android)
npm run typecheck  # tsc --noEmit
```

## Build local para Android (sin EAS)

```bash
# Generar/actualizar la carpeta nativa (android/ está en .gitignore)
npm run prebuild:android

# Build de debug (APK que carga el bundle desde Metro)
npm run android

# Build de release (APK autónomo, con el bundle embebido) — instala y corre con Metro
npm run android:release

# O directo con Gradle:
cd android
./gradlew assembleDebug     # android/app/build/outputs/apk/debug/app-debug.apk
./gradlew assembleRelease   # android/app/build/outputs/apk/release/app-release.apk
```

Notas:

- El `release` del template de Expo se firma con el **debug keystore**: instala y corre, pero **no
  sirve para Play Store**. Configurá tu propio keystore antes de publicar.
- Arquitectura nueva (Fabric/TurboModules) y Hermes están activados por defecto en SDK 57.
- `expo prebuild` limpia `android/` por defecto; usá `--no-clean` (ya incluido en el script) para
  conservar ediciones manuales.

## Verificación hecha

- `npx expo-doctor` → 21/21 checks OK.
- `npm run typecheck` → sin errores.
- `./gradlew assembleDebug` y `assembleRelease` → `BUILD SUCCESSFUL` con JDK 17 + SDK 36.
