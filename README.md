# IntersectIA Mobile

App de Expo (SDK 57) con tres pantallas:

- **Inicio** — página de bienvenida que reúne el contenido de la landing de `intersectia-frontend`
  (hero, qué es IoT, vehículos autónomos, relación IoT↔AV, caso de estudio, cómo funciona la demo, equipo).
- **Asistente** — chatbot que consume el mismo endpoint que la web: `POST /ai/chat`. Los temas
  sugeridos (`GET /ai/chat/topics`) se eligen en una bottom sheet scrolleable agrupada por categoría
  (`@gorhom/bottom-sheet`).
- **Demo** — la demo 3D (Three.js) de la landing embebida con `react-native-webview` en
  `https://d18bljllhxk5n7.cloudfront.net/demo` (configurable con `EXPO_PUBLIC_DEMO_URL`).

Stack: Expo Router (tabs) + TypeScript. No hay lógica de simulación aquí; la app solo muestra
contenido y conversa con el backend NestJS.

Navegación:

- **iOS** — `NativeTabs` (`expo-router/unstable-native-tabs`): tab bar nativa del sistema, con Liquid
  Glass en iOS 26+.
- **Android / web** — `Tabs` con una tab bar flotante custom (`src/components/floating-tab-bar.tsx`):
  pill absoluta con indicador animado (Reanimated).

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

## EAS build (Android, APK)

La URL del backend y de la demo vienen de **EAS Environment Variables** (environment `production`),
no del repo. El perfil `deployed` de `eas.json` sólo referencia `environment: "production"`.

```bash
eas build --platform android --profile deployed --local \
  --output ./builds/intersectia-mobile-deployed.apk
```

- Ver/cambiar valores sin tocar código:
  ```bash
  eas env:list --environment production
  eas env:set --environment production --name EXPO_PUBLIC_API_URL \
    --value https://<cloudfront> --visibility plaintext
  ```
- **Siempre** pasá `--profile deployed`; otro perfil no carga este environment y la app caería al
  fallback (`10.0.2.2`/`localhost`).
- `.env` es para desarrollo local (`expo run:*`); no se sube a EAS (está gitignoreado).

## Build local para iOS

Requiere macOS con **Xcode 26+** (en Xcode 27 / SDK iOS 27 el ciclo de vida `UIScene` es obligatorio).

```bash
npm run prebuild:ios   # genera ios/ (aplica el scene lifecycle)
npm run ios            # prebuild + pod install + compila + instala + lanza
```

`app.json` habilita `ios.enableSceneSupport` vía `expo-build-properties`, que hace que `AppDelegate`
adopte `ExpoReactNativeFactoryProvider` y agrega `UIApplicationSceneManifest` a `Info.plist`
(apunta a `EXExpoAppSceneDelegate`). Sin esto, con Xcode 27 la app se instala pero **no arranca**:
`Application failed to launch: UIScene life cycle is required for apps built with this SDK`.

### Firma (simulador vs device)

- **Simulador:** no hace falta firmar. El plugin `plugins/with-ios-signing.js` desactiva la firma
  solo para `sdk=iphonesimulator*`, así que `npx expo run:ios` no toca el keychain ni se queda colgado
  en el prompt "codesign wants to access key".
- **iPhone físico:** requiere Apple ID. `ios.appleTeamId` está en `7MWYA8BMK6` (Personal Team gratis):
  perfil de 7 días, ~3 devices, sin Push/iCloud/App Groups. No uses el team company `PSL2B979R5`.
- **Primer build a device (una vez):** el CLI de Expo no pasa `-allowProvisioningUpdates` cuando ya hay
  team en el proyecto, así que `npx expo run:ios --device` falla con "No profiles … were found". Hacé
  el primero a mano y luego el CLI funciona:

  ```bash
  xcodebuild -workspace ios/IntersectIA.xcworkspace -scheme IntersectIA -configuration Debug \
    -destination 'id=<UDID-del-iPhone>' \
    -allowProvisioningUpdates -allowProvisioningDeviceRegistration \
    DEVELOPMENT_TEAM=7MWYA8BMK6 build
  ```

  Eso crea el certificado + perfil y registra el device (aceptá "Always Allow"). Cuando el perfil
  expire (7 días), repetí ese build con el flag.
- `npx expo run:ios --device` (con el iPhone conectado) para device; `npx expo run:ios` para simulador.

Si ya tenías un `ios/` generado antes de activar la opción, regeneralo: `rm -rf ios && npm run prebuild:ios`.
`expo-build-properties` (~57.0.21) + `expo` ≥ 57.0.23 son necesarios; en SDK 58 la opción es no-op.

## Verificación hecha

- `npx expo-doctor` → 21/21 checks OK.
- `npm run typecheck` → sin errores.
- Android (JDK 17 + SDK 36): `./gradlew assembleDebug` y `assembleRelease` → `BUILD SUCCESSFUL`.
- iOS (Xcode 27, simulador iOS 27): build Debug OK y la app **arranca y renderiza** tras
  `ios.enableSceneSupport`.
