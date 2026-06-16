# 🏗️ Arquitectura Técnica — Organiza2

> Documento de referencia técnica para desarrolladores e IAs que trabajen en el proyecto.
> Versión 2.5 | Junio 2026

---

## ⚠️ Principio Fundacional — DA-0: El Hogar es la entidad principal del sistema

> **Esta decisión es la más importante de toda la arquitectura. Cualquier IA o desarrollador que trabaje en este proyecto debe leerla primero.**

**El Hogar — no el Usuario — es la entidad central de Organiza2.**

Todos los módulos, pantallas, categorías, presupuestos, recordatorios y funcionalidades dependen del perfil del hogar. El usuario existe para autenticarse. El hogar existe para organizar la vida.

| Regla | Descripción |
|-------|-------------|
| **Los datos viven en el hogar** | Toda escritura va a `hogares/[codigoHogar]/...`. Nunca a un nodo personal de usuario. |
| **El perfil determina la UX** | Pantallas, categorías y funciones visibles se derivan de `getCapabilidades(perfil)`. |
| **El usuario referencia al hogar** | `usuarios/[uid]/codigoHogar` es solo un puntero. |
| **Onboarding configura el hogar** | El flujo de primera vez construye el perfil del hogar, no el del usuario. |

---

## 1. Stack Tecnológico

| Capa | Tecnología | Razón |
|------|------------|-------|
| Frontend | HTML + CSS + JS Vanilla | Sin build step, deploy trivial con `git push` |
| Base de datos | Firebase Realtime Database | Sync en tiempo real entre usuarios |
| Autenticación | Firebase Auth (Google) | Gmail alta penetración en Colombia |
| Hosting | GitHub Pages | Gratuito, deploy automático desde `main` |
| PWA | manifest.json + meta tags Apple | Instalable en iPhone y Android |
| Offline | localStorage queue + `navigator.onLine` | Gastos sin conexión → sync automático |

**⛔ No usar:** React, Vue, Angular, npm, webpack, ni ningún build tool.

---

## 2. Estructura de Archivos

```
organiza2/hogar/
├── index.html
├── logo.png                  → Logo oficial (login screen)
├── manifest.json
├── js/
│   ├── config.js             → Firebase init, db + auth globales
│   ├── utils.js              → fmt, canonicalLabel, planItems, DAILY_ITEMS, MONTHS, COLORS, ICONS
│   ├── offline.js            → Cola offline, syncOfflineQueue
│   ├── firebase-paths.js     → dKey(), dayKey() por codigoHogar
│   ├── auth.js               → initLogin, loginWithGoogle, signOutUser
│   ├── hogar.js              → crearHogar, unirseHogar, loadHogar, onboarding UI
│   ├── finanzas.js           → subMonth, save, recalc, renderResumen (solo rojos/amarillos), renderExpSecs, defD
│   ├── presupuesto.js        → onboarding 5 pantallas, guardarPresupuestoBase, banner miembro 2
│   ├── daily.js              → subDaily, submitDaily, renderDailyList, syncDailyMonth
│   ├── analisis.js           → renderSemaforo, renderTendencia, renderHormiga, renderQuienPago
│   ├── ui.js                 → go(), goAn(), toast(), setSS(), updateDayLabel()
│   ├── telemetria.js         → trackEvent(), window.metricasPiloto() (Fase 34)
│   └── app.js                → punto de entrada, onUserReady, onHogarReady, appLista
├── css/
│   ├── base.css              → variables, reset, topbar, chip
│   ├── login.css             → pantalla login Google + onboarding hogar
│   ├── finanzas.css          → tabs, páginas, cards, forms, análisis, resumen
│   └── presupuesto.css       → onboarding presupuesto base, banner miembro 2, config
└── docs/
    ├── REGLAS_IA.md          → reglas para cualquier IA que trabaje en el proyecto
    ├── producto_v2_3.md
    ├── arquitectura_v2_3.md  → este archivo
    ├── bitacora_v2_3.md
    └── decisiones_junio2026.md
```

---

## 3. Estructura de Datos en Firebase

```
organiza2-a09ef (Realtime Database)
├── usuarios/
│   └── [uid]/
│       └── codigoHogar: "SNBDPA"     ← solo un puntero
│
└── hogares/
    └── [codigoHogar]/
        ├── meta/
        │   ├── nombre: "Ibarra Masso"
        │   ├── tipo: "familia"
        │   ├── creadoPor: [uid]
        │   ├── nombreCreador: "Jaime"
        │   ├── presupuestoBase: true   ← flag onboarding completado
        │   ├── tipoHogar: "familia"
        │   └── reto: "invisible"
        ├── miembros/
        │   └── [uid]/
        │       ├── nombre: "Jaime"
        │       ├── email: "..."
        │       └── acuerdoPresupuesto: true
        ├── pl/                         ← presupuesto mensual
        │   └── [año]/
        │       └── [mes]/
        │           ├── income: []
        │           └── categories: []
        ├── daily/                      ← gastos diarios (DA-1: nunca mezclar con pl/)
        │   └── [año]/
        │       └── [mm]/
        │           └── [dd]/
        │               └── [pushId]/
        │                   ├── amount: 12000
        │                   ├── category: "🍽️ Alimentación"
        │                   ├── item: "Frutas y verduras"
        │                   ├── note: ""
        │                   └── who: "Jaime"
```

---

## 4. Tabs de la App

| Tab | ID | Función | Tipo |
|-----|-----|---------|------|
| 💰 Hoy | `pd` | Registro de gastos diarios | Escritura |
| 📊 Resumen | `pm` | Estado del mes — semáforo por categoría | Solo lectura (DA-14) |
| 📈 Análisis | `px` | Semáforo histórico, tendencia, hormiga | Solo lectura |
| ⚙️ Config | `pc` | Info hogar + Presupuesto Base | Configuración (DA-16) |

---

## 5. Funciones Canónicas — No modificar sin revisar

| Función | Archivo | Descripción |
|---------|---------|-------------|
| `planItems(cat)` | `utils.js` | ÚNICA forma de obtener ítems de una categoría — nunca usar `cat.items` directamente |
| `canonicalLabel(s)` | `utils.js` | Corrige encoding corrupto de Firebase — nunca modificar sin revisar migraciones |
| `calcPresupuestoBase(item, mes)` | `finanzas.js` | ÚNICA función que calcula provisión mensual por frecuencia — nunca calcular inline |
| `defD()` | `finanzas.js` | Estructura base de categorías del presupuesto |
| `buildIncomeFromPerfil(perfil)` | `finanzas.js` | Genera ingresos dinámicos desde perfil — nunca hardcodear nombres |
| `renderResumen()` | `finanzas.js` | Renderiza el tab Resumen — solo lectura, semáforo |
| `renderExpSecs()` | `finanzas.js` | Renderiza categorías editables — SOLO se llama desde Config |
| `migrateCategories(data)` | `utils.js` | Migración incremental entre versiones de defD() |

---

## 6. Catálogo Único — DA-10 (actualizado Junio 2026)

**`defD()` y `DAILY_ITEMS` son el mismo catálogo.** Desde v2.3 ambos tienen exactamente las mismas categorías e ítems con los mismos labels.

| Constante/Función | Dónde se usa | Propósito |
|------------------|--------------|-----------|
| `defD()` | Tab Config, presupuesto base, onboarding | Planear el mes — incluye `budget`, `fixed`, `months` |
| `DAILY_ITEMS` | Tab Hoy, registro diario | Registrar gastos — incluye `Otros` en cada categoría |

**Diferencia única:** `DAILY_ITEMS` tiene `Otros` en cada categoría. `defD()` no.

**Regla crítica:** Cualquier cambio en categorías o ítems debe aplicarse en los tres artefactos simultáneamente: `defD()` + `DAILY_ITEMS` + `migrateCategories`. Nunca modificar uno sin los otros.

---

## 7. Reglas de calcPresupuestoBase — DA-8

```javascript
// ÚNICA función para calcular provisión mensual
function calcPresupuestoBase(item, mesActual) {
  const b = item.budget || 0;
  if (!b) return 0;
  const frec = item.frecuencia || 'mensual';
  if (frec === 'mensual') return b;
  // Ítems con meses específicos (SOAT en agosto, predial en marzo)
  if (item.months && item.months.length) {
    return item.months.includes(mesActual) ? b : 0;
  }
  // Frecuencias periódicas → prorratear
  const divisores = { bimestral:2, trimestral:3, semestral:6, anual:12 };
  return Math.round(b / (divisores[frec] || 1));
}
```

---

## 8. Reglas de Seguridad Firebase

> Reglas desplegadas en producción — Junio 2026. Archivo histórico en `docs/firebase-rules.json`.

```json
{
  "rules": {
    "usuarios": {
      "$uid": {
        ".read":  "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    },
    "hogares": {
      "$codigoHogar": {
        ".read": "auth != null && root.child('hogares').child($codigoHogar).child('miembros').child(auth.uid).exists()",
        "meta": {
          ".read":  "auth != null",
          ".write": "auth != null && (!data.exists() || root.child('hogares').child($codigoHogar).child('miembros').child(auth.uid).exists())"
        },
        "miembros": {
          "$uid": {
            ".read":  "auth != null && auth.uid === $uid",
            ".write": "auth != null && auth.uid === $uid"
          }
        },
        "perfil": {
          ".write": "auth != null && (!root.child('hogares').child($codigoHogar).child('meta').exists() || root.child('hogares').child($codigoHogar).child('miembros').child(auth.uid).exists())"
        },
        "pl":    { ".write": "auth != null && root.child('hogares').child($codigoHogar).child('miembros').child(auth.uid).exists()" },
        "daily": { ".write": "auth != null && root.child('hogares').child($codigoHogar).child('miembros').child(auth.uid).exists()" },
        "hist":  { ".write": "auth != null && root.child('hogares').child($codigoHogar).child('miembros').child(auth.uid).exists()" }
      }
    },
    "pl":    { ".read": "false", ".write": "false" },
    "daily": { ".read": "false", ".write": "false" },
    "viaje": { ".read": "false", ".write": "false" },
    "hist":  { ".read": "false", ".write": "false" },
    "metricas": {
      "eventos": {
        ".read": "auth != null",
        ".write": "auth != null",
        "$pushId": {
          ".validate": "newData.hasChildren(['tipo','timestamp']) && newData.child('tipo').isString() && newData.child('timestamp').isNumber()"
        }
      }
    }
  }
}
```

**Lógica por nodo:**
| Nodo | Read | Write |
|------|------|-------|
| `usuarios/$uid` | Propio uid | Propio uid |
| `hogares/$codigo` | Miembro del hogar | — |
| `hogares/$codigo/meta` | Cualquier auth (validar código al unirse) | Hogar nuevo o miembro |
| `hogares/$codigo/miembros/$uid` | Propio uid (antes de ser miembro) | Propio uid |
| `hogares/$codigo/perfil` | Hereda de `$codigo` | Hogar nuevo o miembro |
| `hogares/$codigo/pl/daily/hist` | Hereda de `$codigo` | Solo miembros |
| `pl/daily/viaje/hist` (raíz, v1) | Bloqueado | Bloqueado |
| `metricas/eventos` | Cualquier auth (lectura admin vía consola) | Cualquier auth (trackEvent) |

---

## 9. Decisiones Arquitecturales (DAs)

| DA | Decisión | Estado |
|----|----------|--------|
| DA-0 | Hogar es la entidad principal — datos en `hogares/[codigoHogar]/` | ✅ Implementado |
| DA-1 | Gastos diarios en `daily/` — nunca mezclar con `pl/` | ✅ Implementado |
| DA-2 | `planItems(cat)` es la fuente canónica de ítems | ✅ Implementado |
| DA-3 | `canonicalLabel()` se aplica al leer de Firebase — nunca modificar | ✅ Implementado |
| DA-4 | Firebase SDK compat v9.23.0 | ✅ |
| DA-5 | Google Login antes de separar JS en módulos | ✅ Implementado |
| DA-6 | Código de hogar = 6 caracteres alfanuméricos uppercase | ✅ Implementado |
| DA-7 | `getCapabilidades(perfil)` controla toda la UX — pendiente implementar | 🔲 Pendiente |
| DA-8 | `calcPresupuestoBase(item, mes)` — única función de provisión mensual | ✅ Implementado |
| DA-9 | Perfil progresivo — app sugiere completar contextualmente | 🔲 Pendiente |
| DA-10 | Catálogo único: `defD()` y `DAILY_ITEMS` son idénticos — modificar siempre juntos con `migrateCategories` | ✅ Implementado |
| DA-11 | Ingresos dinámicos desde `buildIncomeFromPerfil()` | ✅ Implementado |
| DA-12 | Cuota crédito vehículo en Transporte, no en Vivienda | ✅ Implementado |
| DA-13 | Restaurantes en Entretenimiento y Salidas — eliminado de Alimentación | ✅ Implementado |
| DA-14 | Tab Resumen es solo lectura — sin inputs | ✅ Implementado |
| DA-15 | Login con logo oficial `logo.png` | ✅ Implementado |
| DA-16 | Config solo muestra configuración — no gastos reales del mes | ✅ Implementado |
| DA-17 | Siempre pedir archivo actual antes de modificarlo — ver REGLAS_IA.md | ✅ Regla activa |
| DA-18 | Config es vista de configuración anual — nunca filtrar ítems de fecha fija (`months[]`) por el mes actual. Siempre mostrar `budget` real con badge del mes | ✅ Implementado |
| DA-19 | Telemetría del piloto: módulo aislado `telemetria.js`, función única `trackEvent(tipo)`, nodo `metricas/eventos`. Solo 6 métricas oficiales, sin datos sensibles (montos, categorías, nombres, emails) | ✅ Implementado |

---

## 10. Limitaciones Conocidas

### save() — last-write-wins en edición concurrente (B2)

`save()` en `finanzas.js` hace un `set` completo del nodo mensual `pl/[año]/[mes]/`. Si dos miembros del hogar editan el presupuesto en Config simultáneamente, el último en guardar pisa los cambios del primero (debounce de 800ms no es suficiente para cubrir este escenario).

**Impacto real:** muy bajo. Config lo configura típicamente una sola persona. Para que ocurra el conflicto ambos miembros deben estar en Config al mismo tiempo editando campos distintos.

**Solución futura:** migrar `save()` a `update()` por ítem o por categoría en lugar de `set` completo del objeto.

---

## 11. Migración Anny1130 — v1 → v2.0

**Estado:** ✅ Ejecutada. Los datos de `pl/Anny1130/2026/` fueron migrados a `hogares/SNBDPA/pl/2026/`.

---

## 12. PWA

```json
{
  "name": "Organiza2",
  "short_name": "Organiza2",
  "start_url": "./index.html",
  "display": "standalone",
  "background_color": "#F5F3EE",
  "theme_color": "#1D9E75"
}
```

---

*Organiza2 — Arquitectura Técnica v2.5 | Junio 2026*
