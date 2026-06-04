# 📓 Bitácora Técnica — Organiza2 v2.x

> Registro de desarrollo, decisiones, bugs y aprendizajes desde la migración a v2.0.
> Continuación del historial documentado en el monolito `index-v1.html`.

---

## Contexto de la migración

En junio 2026 se tomó la decisión de reconstruir Organiza2 desde cero en lugar de refactorizar el monolito existente (`index.html`, 2.229 líneas). La auditoría técnica determinó que ~65% del código debía reconstruirse de todas formas para soportar el modelo de hogar, múltiples usuarios y pantallas dinámicas.

**Decisión:** Reconstruir en arquitectura modular (14 archivos JS, máx. 300 líneas c/u) sobre un `index.html` limpio que solo contiene HTML e imports.

**Referencia:** `decision_arquitectura_v2.md`

---

## Stack v2.x

| Componente | Tecnología |
|---|---|
| Frontend | HTML + CSS + JS Vanilla (sin frameworks) |
| Autenticación | Firebase Auth — proveedor Google |
| Base de datos | Firebase Realtime Database (`organiza2-a09ef`) |
| Hosting | GitHub Pages — `organiza2.github.io/finanzas-familia` |
| Orden de carga JS | config → auth → hogar → app (orden estricto via `<script src>`) |

---

## Estructura de archivos v2.x

```
finanzas-familia/
├── index.html          ← HTML + imports únicamente
├── index-v1.html       ← Monolito original congelado — NO eliminar hasta piloto
├── css/
│   ├── base.css        ← Variables, reset, tipografía, topbar, chip
│   └── login.css       ← Pantalla de login Google
├── js/
│   ├── config.js       ← Firebase initializeApp + db + auth globales
│   ├── auth.js         ← initLogin(), onAuthStateChanged, signOut
│   ├── hogar.js        ← crearHogar(), unirseHogar(), loadHogar(), onboarding UI
│   └── app.js          ← Punto de entrada — orquesta el arranque
└── docs/
    ├── producto_v2.2.md
    ├── arquitectura_v2.2.md
    ├── decision_arquitectura_v2.md
    ├── auditoria_v2.md
    └── bitacora.md     ← este archivo
```

---

## Estructura Firebase v2.x

```
/
├── usuarios/
│   └── [uid]/
│       └── codigoHogar: string
│
├── hogares/
│   └── [codigoHogar]/
│       ├── meta/
│       │   ├── nombre:    string
│       │   ├── tipo:      "soltero" | "pareja" | "familia"
│       │   ├── creadoPor: uid
│       │   └── creadoEn:  timestamp
│       ├── miembros/
│       │   └── [uid]/
│       │       └── rol: "propietario" | "miembro"
│       └── perfil/
│           └── _init: true   ← nodo placeholder hasta Etapa D
│
├── pl/[uid]/...        ← datos v1 — pendiente migración Etapa C
├── daily/[uid]/...     ← datos v1 — pendiente migración Etapa C
└── viaje/[uid]/...     ← datos v1 — pendiente migración Etapa C
```

---

## Reglas de seguridad Firebase — estado actual

```json
{
  "rules": {
    "usuarios": {
      "$uid": {
        ".read":  "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "hogares": {
      "$codigoHogar": {
        ".read":  "auth !== null",
        ".write": "auth !== null"
      }
    },
    "pl":     { ".read": "auth !== null", ".write": "auth !== null" },
    "daily":  { ".read": "auth !== null", ".write": "auth !== null" },
    "viaje":  { ".read": "auth !== null", ".write": "auth !== null" },
    "hist":   { ".read": "auth !== null", ".write": "auth !== null" }
  }
}
```

> ⚠️ Las reglas de `hogares` y nodos v1 son permisivas para cualquier usuario autenticado.
> Se ajustan en la Etapa C cuando los datos migren al nodo del hogar.

---

## Historial de desarrollo

---

### ✅ Etapa A — Login Google + Identidad real
**Fecha:** Junio 2026
**Objetivo:** Reemplazar `const FBK = 'Anny1130'` por autenticación real con Firebase Auth.

**Archivos creados:**
- `index.html` — HTML limpio con login screen y app shell
- `css/base.css` — variables CSS, reset, topbar, chip
- `css/login.css` — pantalla de login Google
- `js/config.js` — Firebase init, expone `db` y `auth` globales
- `js/auth.js` — `initLogin()`, `onAuthStateChanged`, `loginWithGoogle()`, `signOutUser()`
- `js/app.js` — `DOMContentLoaded` → `initLogin()`, callback `onUserReady()`

**Resultado:**
- Usuario autenticado con Google
- `window.UID` contiene el uid real
- Sesión persistente con `firebase.auth.Auth.Persistence.LOCAL`
- `index-v1.html` congelado — monolito original preservado

**Criterio de éxito cumplido:** Login con Google funcional. uid real en sesión.

---

### ✅ Etapa B — Modelo de Hogar mínimo
**Fecha:** Junio 2026
**Objetivo:** Validar que múltiples usuarios pueden pertenecer al mismo hogar.

**Archivos creados:**
- `js/hogar.js` — lógica completa de hogar + UI de onboarding

**Archivos modificados:**
- `js/app.js` — `onUserReady()` ahora verifica hogar antes de arrancar
- `index.html` — pantalla de onboarding con 4 pasos

**Flujo implementado:**
1. Usuario autenticado → `getCodigoHogar(uid)`
2. Sin hogar → `mostrarOnboarding()` (4 pasos: decisión, crear, unirse, confirmación)
3. Con hogar → `loadHogar(codigoHogar)` → `onHogarReady()`

**Funciones implementadas en `hogar.js`:**

| Función | Descripción |
|---|---|
| `generarCodigo()` | 6 chars alfanuméricos sin O/0/I/1 |
| `getCodigoHogar(uid)` | Lee `usuarios/[uid]/codigoHogar` |
| `crearHogar(uid, nombre, tipo)` | Crea hogar + vincula usuario como propietario |
| `unirseHogar(uid, codigoHogar)` | Valida código + vincula usuario como miembro |
| `loadHogar(codigoHogar)` | Lee hogar completo → `window.HOGAR` |
| `mostrarOnboarding()` | Muestra `#hogarScreen` en paso-decision |
| `mostrarPaso(id)` | Navega entre los 4 pasos del onboarding |

**Bugs encontrados y resueltos:**

#### Bug B-1 — `hogar.js` no cargaba (404)
**Causa:** `index.html` en GitHub no tenía `<script src="js/hogar.js">` — se subió `hogar.js` pero no el `index.html` actualizado.
**Solución:** Push del `index.html` correcto.

#### Bug B-2 — `permission_denied` al unirse al hogar
**Causa 1:** `db.ref().update(updates)` con paths de dos nodos diferentes (`hogares/` y `usuarios/`) — Firebase evalúa la escritura en el path raíz `/` que no tiene regla permisiva.
**Solución 1:** Separar en dos escrituras independientes: `db.ref('hogares/...').set()` y `db.ref('usuarios/...').set()`.

**Causa 2:** Regla de escritura de `hogares` exigía que el usuario ya fuera miembro para poder escribir — pero Anny necesita escribirse como miembro antes de serlo.
**Solución 2:** Simplificar regla a `"auth !== null"` para esta etapa.

**Resultado validado en Firebase Console:**
```
usuarios/[uid_jaime]/codigoHogar: "SNBDPA"
usuarios/[uid_anny]/codigoHogar:  "SNBDPA"
hogares/SNBDPA/meta/nombre:       "Hogar Ibarra"
hogares/SNBDPA/miembros/[uid_jaime]/rol: "propietario"
hogares/SNBDPA/miembros/[uid_anny]/rol:  "miembro"
```

**Criterio de éxito cumplido:** Jaime y Anny tienen uid diferentes, comparten el mismo `codigoHogar`, están registrados en `miembros/`, y recuperan el hogar al volver a iniciar sesión.

---

## Próximas etapas

### 🔲 Etapa C — Migración de datos Anny1130
**Objetivo:** Mover los datos reales de `pl/Anny1130/` y `daily/Anny1130/` al nodo del hogar.

**Pasos:**
1. Backup manual de `pl/Anny1130/` desde Firebase Console (descargar JSON)
2. Script de migración en consola del navegador
3. Actualizar `dKey()`, `dayKey()`, `hKey()` para usar `window.HOGAR.codigoHogar`
4. Activar reglas de seguridad estrictas por hogar

> ⚠️ Hacer backup ANTES de cualquier cambio. Los datos son reales.

### 🔲 Etapa D — Finanzas v2 reconstruida
**Objetivo:** Reconstruir los módulos de Finanzas sobre el modelo de hogar.

Incluye: presupuesto mensual, gastos diarios, nómina dinámica, empleados, análisis.

---

## Aprendizajes técnicos

| # | Aprendizaje |
|---|---|
| 1 | `db.ref().update()` con paths de múltiples nodos raíz falla si las reglas no cubren el path `/` — separar en escrituras individuales por nodo |
| 2 | Las reglas de Firebase se cachean en el cliente — después de cambiar reglas, hacer hard refresh (Ctrl+Shift+R) |
| 3 | GitHub Pages cachea agresivamente — siempre hacer hard refresh al probar cambios recién pusheados |
| 4 | El SDK compat de Firebase Auth genera warnings de `Cross-Origin-Opener-Policy` con `signInWithPopup` — es un warning del navegador, no un error funcional |
| 5 | `firebase.auth.Auth.Persistence.LOCAL` persiste la sesión entre recargas — el popup de Google no vuelve a aparecer si ya hay sesión activa. Comportamiento esperado y correcto |

---

*Organiza2 — Bitácora Técnica v2.x | Junio 2026*
