# Fotos del equipo

Fotos de los 5 integrantes que se muestran en la sección **Equipo** del Inicio.

## Archivos

| Archivo | Apellido | Nombre |
| --- | --- | --- |
| `Arteaga-Miguel.jpeg` | Arteaga | Miguel |
| `Caballero-Cesar.jpeg` | Caballero | Cesar |
| `Carvajal-Jorge.jpeg` | Carvajal | Jorge |
| `Veslasquez-Arnulfo.jpeg` | Veslasquez | Arnulfo |
| `Yebara-Diego.jpeg` | Yebara | Diego |

- Formato: JPEG (RN `Image` lo renderiza en iOS y Android; **WebP no funciona en iOS**).
- Se muestran en círculo (`borderRadius: pill`, `resizeMode="cover"`), 64×64.
- Ideal: cuadrada, ≥256×256.

## Nombres y orden

Los datos viven en `src/constants/landing.ts` (constante `TEAM`). El orden de la lista es el orden en
que se muestran: **alfabético por apellido**. El texto visible es **"Apellido Nombre"** (los roles no
se muestran).

Cada integrante se referencia con `require('@/assets/equipo/<Archivo>.jpeg')`. Si reemplazás una foto,
mantené el mismo nombre de archivo para no tocar código; si la renombrás, actualizá el `require`.
