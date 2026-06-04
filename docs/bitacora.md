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
| Orden de carga JS | config → utils → offline → firebase-paths → auth → hogar → finanzas → daily → analisis → ui → app |

---

## Estructura de archivos v2.x

```
finanzas-familia/
├── index.html              ← HTML + imports únicamente
├── index-v1.html           ← Monolito original congelado — NO eliminar hasta piloto
├── css/
│   ├── base.css            ← Variables, reset, tipografía, topbar, chip
│   ├── login.css           ← Pantalla de login Google y onboarding hogar
│   └── finanzas.css        ← Tabs, páginas, cards, forms, análisis
├── js/
│   ├── config.js           ← Firebase initializeApp + db + auth globales
│   ├── utils.js            ← Constantes, fmt, canonicalLabel, planItems, migrateCategories
│   ├── offline.js          ← Cola offline, syncOfflineQueue, updateOfflineUI
│   ├── firebase-paths.js   ← dKey(), dayKey(), hKey(), vKey() por codigoHogar
│   ├── auth.js             ← initLogin(), onAuthStateChanged, signOut
│   ├── hogar.js            ← crearHogar(), unirseHogar(), loadHogar(), onboarding UI
│   ├── finanzas.js         ← subMonth(), save(), recalc(), renderAll(), defD()
│   ├── daily.js            ← subDaily(), submitDaily(), renderDailyList(), syncDailyMonth()
│   ├── analisis.js         ← renderAnalisis(), renderSemaforo(), renderTendencia(), renderHormiga()
│   ├── ui.js               ← go(), goAn(), toast(), setSS(), renderMLabel(), checkPWA()
│   └── app.js              ← Punto de entrada — orquesta el arranque
└── docs/
    ├── producto_v2.2.md
    ├── arquitectura_v2.2.md
    ├── decision_arquitectura_v2.md
    ├── auditoria_v2.md
    └── bitacora.md         ← este archivo
```

---

## Estructura Firebase v2.x

```
/
├── usuarios/
│   └── [uid]/
│       └── codigoHogar: string
│
└── hogares/
    └── [codigoHogar]/
        ├── meta/
        │   ├── nombre:    string
        │   ├── tipo:      "soltero" | "pareja" | "familia"
        │   ├── creadoPor: uid
        │   └── creadoEn:  timestamp
        ├── miembros/
        │   └── [uid]/
        │       └── rol: "propietario" | "miembro"
        ├── perfil/
        │   └── _init: true
        ├── pl/[año]/[mes]/         ← presupuesto mensual
        ├── daily/[año]/[mes]/[día]/ ← gastos diarios
        ├── viaje/[año]/[mes]/[día]/ ← módulo viaje (congelado)
        └── hist/                    ← historial de cambios
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
    }
  }
}
```

> Los nodos `pl/`, `daily/`, `viaje/` y `hist/` fueron eliminados al migrar los datos a `hogares/`.
> Las reglas de `hogares` son permisivas para cualquier usuario autenticado — se ajustan en Etapa E.

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

**Criterio de éxito cumplido:** Login con Google funcional. uid real en sesión.

---

### ✅ Etapa B — Modelo de Hogar mínimo
**Fecha:** Junio 2026
**Objetivo:** Validar que múltiples usuarios pueden pertenecer al mismo hogar.

**Archivos creados:**
- `js/hogar.js` — lógica completa de hogar + UI de onboarding (4 pasos)

**Archivos modificados:**
- `js/app.js` — `onUserReady()` verifica hogar antes de arrancar
- `index.html` — pantalla de onboarding agregada

**Funciones implementadas:**

| Función | Descripción |
|---|---|
| `generarCodigo()` | 6 chars alfanuméricos sin O/0/I/1 |
| `getCodigoHogar(uid)` | Lee `usuarios/[uid]/codigoHogar` |
| `crearHogar(uid, nombre, tipo)` | Crea hogar + vincula usuario como propietario |
| `unirseHogar(uid, codigoHogar)` | Valida código + vincula usuario como miembro |
| `loadHogar(codigoHogar)` | Lee hogar completo → `window.HOGAR` |

**Bugs resueltos:**

**Bug B-1** — `hogar.js` no cargaba: `index.html` no tenía el `<script>` — push del index correcto.

**Bug B-2** — `permission_denied` al unirse: `db.ref().update()` con paths de dos nodos raíz falla porque Firebase evalúa en `/`. Solución: escrituras separadas. Además la regla exigía ser miembro para escribir — se simplificó a `auth !== null`.

**Resultado validado:**
```
usuarios/[uid_jaime]/codigoHogar: "SNBDPA"
usuarios/[uid_anny]/codigoHogar:  "SNBDPA"
hogares/SNBDPA/miembros/[uid_jaime]/rol: "propietario"
hogares/SNBDPA/miembros/[uid_anny]/rol:  "miembro"
```

---

### ✅ Etapa C — Migración de datos Anny1130
**Fecha:** Junio 2026
**Objetivo:** Mover los datos reales al nodo del hogar y actualizar los paths de Firebase.

**Archivos creados:**
- `js/firebase-paths.js` — `dKey()`, `dayKey()`, `hKey()`, `vKey()` usando `window.HOGAR.codigoHogar`

**Migración ejecutada desde consola del navegador:**

| Nodo origen | Nodo destino | Estado |
|---|---|---|
| `pl/Anny1130/2025` | `hogares/SNBDPA/pl/2025` | ✅ |
| `pl/Anny1130/2026` | `hogares/SNBDPA/pl/2026` | ✅ |
| `daily/Anny1130/2026` | `hogares/SNBDPA/daily/2026` | ✅ |
| `viaje/Anny1130/2026` | `hogares/SNBDPA/viaje/2026` | ✅ |

4 nodos copiados, 0 errores. Nodos originales eliminados desde Firebase Console.

**Validación:**
```javascript
dKey(2026, 5) // → "hogares/SNBDPA/pl/2026/5" ✅
```

---

### ✅ Etapa D — Finanzas v2 reconstruida
**Fecha:** Junio 2026
**Objetivo:** Reconstruir los módulos de Finanzas sobre el modelo de hogar con arquitectura modular.

**Decisiones de producto tomadas antes de codificar:**
- MVP reducido a 4 tabs: Hoy / Resumen / Análisis / Config
- `nomina.js`, `empleados.js` y `viaje.js` pospuestos — no críticos para el piloto
- `viaje.js` pasa a ser parte del Planeador v3.0, no de Finanzas
- Tab Análisis con navegación de mes independiente — perfil de usuario distinto al del Tab Hoy

**Archivos creados:**

| Archivo | Líneas | Responsabilidad |
|---|---|---|
| `css/finanzas.css` | 255 | Estilos completos de la app |
| `js/utils.js` | 240 | Constantes, fmt, canonicalLabel, planItems, migrateCategories |
| `js/offline.js` | 92 | Cola offline — lógica validada en viaje Europa 2026 |
| `js/finanzas.js` | 279 | subMonth, loadFixed, save, recalc, renderAll, defD |
| `js/daily.js` | 184 | subDaily, submitDaily, renderDailyList, syncDailyMonth |
| `js/analisis.js` | 167 | renderSemaforo, renderTendencia, renderHormiga |
| `js/ui.js` | 124 | go(), goAn(), toast(), setSS(), checkPWA() |

**Archivos modificados:**
- `index.html` — estructura 4 tabs, scripts actualizados
- `js/app.js` — orquesta arranque completo via `arrancarFinanzas()` → `appLista()`

**Cambios respecto al v1:**
- `type="number"` → `type="text" inputmode="decimal"` en todos los inputs de monto (fix iOS)
- `dailyTotals` calculados con path `hogares/[codigoHogar]/daily/` en lugar de `daily/FBK/`
- Tab Análisis tiene `curYx`/`curMx` propios — se sincroniza al mes del Resumen al abrirse pero navega independientemente
- "Gastos hormiga" renombrado a "Gastos del día" en el Resumen
- Categorías por defecto simplificadas en `defD()` — sin nombres hardcodeados Jaime/Anny

**Bugs resueltos:**

**Bug D-1** — `onHogarReady` fallaba con `Cannot set properties of null`: intentaba escribir en `#mainContent` que ya no existe en el nuevo HTML. Solución: reemplazar por llamada a `arrancarFinanzas()`.

**Bug D-2** — Tab Análisis sin navegación de mes: comportamiento intencional inicial pero corregido por decisión de producto — usuarios que consultan análisis quieren navegar meses libremente.

**Criterio de éxito cumplido:**
- ✅ 4 tabs funcionando con datos reales
- ✅ Registro de gastos diarios operativo
- ✅ Presupuesto mensual cargando desde `hogares/SNBDPA/`
- ✅ Análisis con Semáforo, Tendencia y Hormiga
- ✅ Navegación de mes independiente en Análisis
- ✅ Offline queue operativo
- ✅ Sin errores en consola (solo warnings cosméticos)

---

## Próximas etapas

### 🔲 Etapa E — Onboarding progresivo
**Objetivo:** La app sugiere completar el perfil del hogar según el uso real.
- Detectar categorías usadas → sugerir completar perfil (vehículos, hijos, personal)
- Banners de sugerencia no intrusivos
- Pantalla de Configuración del Hogar editable

### 🔲 Etapa F — Piloto con familias (v2.3)
**Objetivo:** Validar con 5-10 familias reales durante 4 semanas antes de construir el Planeador.
- Condición de salida: ≥5 hogares activos · ≥3 con Presupuesto Base configurado

### 🔲 Pendientes técnicos menores
- Corregir meta tag `apple-mobile-web-app-capable` deprecado
- Agregar `favicon.ico`
- `nomina.js` y `empleados.js` — implementar después del piloto
- Reglas Firebase más estrictas por hogar

---

## Aprendizajes técnicos

| # | Aprendizaje |
|---|---|
| 1 | `db.ref().update()` con paths de múltiples nodos raíz falla si las reglas no cubren `/` — separar en escrituras individuales |
| 2 | Las reglas de Firebase se cachean en el cliente — hard refresh después de cambiar reglas |
| 3 | GitHub Pages cachea agresivamente — hard refresh al probar cambios recién pusheados |
| 4 | `Cross-Origin-Opener-Policy` con `signInWithPopup` es un warning del navegador, no un error funcional |
| 5 | `firebase.auth.Auth.Persistence.LOCAL` persiste la sesión — el popup de Google no reaparece. Comportamiento correcto |
| 6 | El orden de carga de `<script src>` es crítico — `utils.js` debe ir antes que cualquier módulo que use `fmt()` o `canonicalLabel()` |
| 7 | `migrateCategories()` en el monolito llamaba `db.ref().set()` directamente — en la arquitectura modular el guardado lo hace `finanzas.js`, no `utils.js` |
| 8 | El tab Análisis necesita estado de mes propio (`curYx/curMx`) — perfiles de uso distintos dentro del mismo hogar |

---

*Organiza2 — Bitácora Técnica v2.x | Junio 2026*
