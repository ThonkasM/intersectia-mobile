# Logo IntersectIA — assets, colores y uso

Documento de traspaso del trabajo de logo/íconos hecho para la app mobile (`intersectia-mobile`),
para reutilizar en el frontend web.

## 1. Asset fuente

- **Archivo:** `intersectia-mobile/assets/icons/intersectia-logo.png`
- **Tamaño:** 1254 × 1254 px, **RGBA** (fondo transparente fuera del “squircle”).
- Es un ícono tipo app: squircle oscuro con la marca (rombo en outline + rombo central) en ámbar.

## 2. Paleta (muestreada del PNG)

| Elemento | Hex |
| --- | --- |
| Fondo del squircle | `#0A0E14` (muestreado ~`#090A12`; usar `#0A0E14`, es el color de marca) |
| Ámbar — arriba (gradiente) | `#FFD509` |
| Ámbar — medio | `#FDB702` |
| Ámbar — abajo (gradiente) | `#FC9D01` |
| Contorno de marca | mismo gradiente que el rombo central |
| Fuera del squircle | transparente (`alpha = 0`) |

El `#0A0E14` coincide con el `--background` oscuro del sitio (`app/globals.css`).

## 3. Assets derivados (mobile)

| Archivo | Tamaño | Contenido | Uso |
| --- | --- | --- | --- |
| `assets/images/icon.png` | 1024² | Logo completo, alpha aplanado sobre `#0A0E14` (opaco) | Ícono de app (iOS + base) |
| `ios/.../AppIcon.appiconset/App-Icon-1024x1024@1x.png` | 1024² | Igual, generado por prebuild | Ícono iOS |
| `assets/images/android-icon-foreground.png` | 1024² | **Marca** sobre transparente, escalada al 60% (safe zone adaptive) | Android adaptive foreground |
| `assets/images/android-icon-monochrome.png` | 1024² | Igual, relleno negro (usa alpha) | Android themed icon |
| `assets/images/splash-icon.png` | 512² | Marca al 82% sobre transparente | Splash (fondo `#0A0E14`) |
| `assets/icons/intersectia-mark.png` | 512² | **Marca** (outline + rombo) sobre transparente, autocrop | Logo en la UI (header) |
| `assets/images/favicon.png` | 1024² | Squircle completo | favicon web |

- Android adaptive: fondo = `#0A0E14` (color plano), sin `backgroundImage`.
- iOS: ícono **opaco** (Apple no admite alpha en App Store).

## 4. Cómo se generaron

Sin ImageMagick: se usó `jimp-compact` (ya viene con Expo) + un umbral de luminancia para separar
la marca del fondo oscuro.

```js
const Jimp = require('jimp-compact');

const SRC = 'assets/icons/intersectia-logo.png';
const BG = { r: 10, g: 14, b: 20 };          // #0A0E14
const TRANSPARENT = Jimp.rgbaToInt(0, 0, 0, 0);

function flatten(img, size, out) {            // opaca: compone alpha sobre #0A0E14
  const icon = img.clone().resize(size, size);
  icon.scan(0, 0, icon.bitmap.width, icon.bitmap.height, function (x, y, idx) {
    const d = this.bitmap.data;
    const a = d[idx + 3] / 255;
    d[idx]     = Math.round(d[idx]     * a + BG.r * (1 - a));
    d[idx + 1] = Math.round(d[idx + 1] * a + BG.g * (1 - a));
    d[idx + 2] = Math.round(d[idx + 2] * a + BG.b * (1 - a));
    d[idx + 3] = 255;
  });
  return icon.writeAsync(out);
}

function extractMark(img) {                   // marca sobre transparente
  const mark = img.clone();
  mark.scan(0, 0, mark.bitmap.width, mark.bitmap.height, function (x, y, idx) {
    const d = this.bitmap.data;
    const lum = 0.299 * d[idx] + 0.587 * d[idx + 1] + 0.114 * d[idx + 2];
    let a = Math.max(0, Math.min(1, (lum - 25) / 35)); // fondo (~14) -> 0, ámbar (~130+) -> 1
    d[idx + 3] = Math.round(255 * a * (d[idx + 3] / 255));
  });
  mark.autocrop();
  return mark;
}

async function centered(mark, size, scale, out, fill) {
  const m = mark.clone().resize(Math.round(size * scale), Jimp.AUTO);
  const canvas = new Jimp(size, size, TRANSPARENT);
  if (fill) m.scan(0, 0, m.bitmap.width, m.bitmap.height, function (x, y, idx) {
    const d = this.bitmap.data; d[idx] = fill.r; d[idx + 1] = fill.g; d[idx + 2] = fill.b;
  });
  canvas.composite(m, Math.round((size - m.bitmap.width) / 2), Math.round((size - m.bitmap.height) / 2));
  return canvas.writeAsync(out);
}

(async () => {
  const src = await Jimp.read(SRC);
  await flatten(src, 1024, 'assets/images/icon.png');
  await flatten(src, 1024, 'assets/images/favicon.png');
  const mark = extractMark(src);
  await centered(mark, 1024, 0.60, 'assets/images/android-icon-foreground.png');
  await centered(mark, 1024, 0.60, 'assets/images/android-icon-monochrome.png', { r: 0, g: 0, b: 0 });
  await centered(mark, 512, 0.82, 'assets/images/splash-icon.png');
  await centered(mark, 512, 1, 'assets/icons/intersectia-mark.png');
})();
```

> Nota: el umbral de luminancia (25–60) funciona porque el fondo es muy oscuro y la marca ámbar muy
> luminosa. Si la marca cambia, ajustar ese rango.

## 5. Config mobile (`app.json`)

```json
{
  "icon": "./assets/images/icon.png",
  "ios": { "bundleIdentifier": "com.intersectia.mobile" },
  "android": {
    "adaptiveIcon": {
      "backgroundColor": "#0a0e14",
      "foregroundImage": "./assets/images/android-icon-foreground.png",
      "monochromeImage": "./assets/images/android-icon-monochrome.png"
    }
  },
  "plugins": [
    ["expo-splash-screen", {
      "backgroundColor": "#0a0e14",
      "image": "./assets/images/splash-icon.png",
      "imageWidth": 150
    }]
  ],
  "web": { "favicon": "./assets/images/favicon.png" }
}
```

Se **quitó** `ios.icon` (apuntaba al `.icon` de Expo por defecto) para que iOS use el PNG. Un
`expo prebuild` limpio deja `ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon`.

En la UI, el header usa `<Image source={require('@/assets/icons/intersectia-mark.png')} />`
(30×30) junto al wordmark "IntersectIA" (la "IA" en `#F5A623` / accent).

## 6. Para el frontend web (recomendaciones)

Reutilizar el mismo asset para no divergir. Exportar versiones optimizadas (el PNG fuente pesa ~1 MB).

- **Header/navbar:** `intersectia-mark.png` (transparente) + wordmark. Funciona en light y dark
  (ámbar sobre `#F7F8FA` y sobre `#0A0E14`).
- **Botón/avatar de marca:** el squircle (`icon.png`).
- **favicon:** `favicon.ico` (16/32/48) + `favicon-32x32.png` / `favicon-16x16.png`.
- **apple-touch-icon:** 180×180 **opaco** (squircle) — sin transparencia.
- **PWA manifest:** 192×192 y 512×512; para `purpose: "maskable"` usar la **marca** sobre `#0A0E14`
  con la marca dentro del 80% central (safe zone).
- **OG/Twitter card:** 1200×630, fondo `#0A0E14`, squircle o marca + wordmark centrados.
- **Formatos:** exportar WebP/AVIF y PNG de respaldo; NO servir el PNG 1254 directo.
- **Dark mode:** si se usa la marca sobre fondo claro, el ámbar `#FDB702` tiene buen contraste;
  sobre oscuro, el mismo asset ya trae el gradiente.

## 7. Estado

- Assets generados y config aplicada. El ícono de launcher se ve tras reconstruir el binario
  nativo (`npx expo run:ios` / `npx expo run:android`); el logo del header ya se ve con solo
  recargar JS.
- Fuente de verdad: `intersectia-mobile/assets/icons/intersectia-logo.png`. Cualquier variante web
  debería derivarse de ese archivo con la sección 4.
