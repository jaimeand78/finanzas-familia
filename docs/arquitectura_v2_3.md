# 🏗️ Arquitectura Técnica — Organiza2

> Documento de referencia técnica para desarrolladores e IAs que trabajen en el proyecto.
> Versión 2.3 | Junio 2026

---

## ⚠️ Principio Fundacional — DA-0: El Hogar es la entidad principal del sistema

> **Esta decisión es la más importante de toda la arquitectura. Cualquier IA o desarrollador que trabaje en este proyecto debe leerla primero.**

**El Hogar — no el Usuario — es la entidad central de Organiza2.**

Todos los módulos, pantallas, categorías, presupuestos, recordatorios y funcionalidades dependen del perfil del hogar. El usuario existe para autenticarse. El hogar existe para organizar la vida.

**Implicaciones técnicas que nunca deben violarse:**

| Regla | Descripción |
|-------|-------------|
| **Los datos viven en el hogar** | Toda escritura va a `hogares/[codigoHogar]/...`. Nunca a un nodo personal de usuario. |
| **El perfil determina la UX** | Pantallas, categorías y funciones visibles se derivan de `getCapabilidades(perfil)`. Nunca de lógica ad-hoc dispersa. |
| **El usuario referencia al hogar** | `usuarios/[uid]/codigoHogar` es solo un puntero. |
| **El hogar es independiente del plan** | Tipo de hogar afecta experiencia, no límites comerciales. |
| **Onboarding configura el hogar, no el usuario** | El flujo de primera vez construye el perfil del hogar. |

---

## 1. Visión General

Organiza2 es una **Single Page Application (SPA)** construida en HTML/CSS/JS vanilla, con Firebase Realtime Database como backend y GitHub Pages como hosting. No hay build step, no hay framework, no hay dependencias npm en producción.

---

## 2. Stack Tecnológico

| Capa | Tecnología | Razón |
|------|------------|-------|
| Frontend | HTML + CSS + JS Vanilla | Sin build step, deploy trivial con `git push` |
| Base de datos | Firebase Realtime Database | Sync en tiempo real entre usuarios |
| Autenticación | Firebase Auth (Google) | Gmail alta penetración en Colombia |
| Hosting | GitHub Pages | Gratuito, deploy automático desde `main` |
| PWA | manifest.json + meta tags Apple | Instalable en iPhone y Android |
| Offline | localStorage queue + `navigator.onLine` | Gastos sin conexión → sync automático |

---

## 3. Estructura de Archivos

```
organiza2/finanzas-familia/
├── index.html
├── js/
│   ├── config.js         → Firebase init, db + auth globales
│   ├── utils.js          → fmt, canonicalLabel, planItems, MONTHS, COLORS, ICONS
│   ├── offline.js        → Cola offline, syncOfflineQueue
│   ├── firebase-paths.js → dKey(), dayKey(), hKey(), vKey() por codigoHogar
│   ├── auth.js           → initLogin, loginWithGoogle, signOutUser
│   ├── hogar.js          → crearHogar, unirseHogar, loadHogar, onboarding UI
│   ├── finanzas.js       → subMonth, save, recalc, renderAll, defD, arrancarFinanzas
│   ├── presupuesto.js    → renderPresupuestoBase, guardarPresupuestoBase (NUEVO)
│   ├── daily.js          → subDaily, submitDaily, renderDailyList, syncDailyMonth
│   ├── analisis.js       → renderSemaforo, renderTendencia, renderHormiga
│   ├── ui.js             → go(), goAn(), toast(), setSS(), updateDayLabel()
│   └── app.js            → punto de entrada, onUserReady, onHogarReady, appLista
├── css/
│   ├── base.css          → variables, reset, topbar, chip
│   ├── login.css         → pantalla login Google
│   └── finanzas.css      → tabs, páginas, cards, forms, análisis, presupuesto base
├── manifest.json
└── docs/
    ├── producto_v2_3.md
    ├── arquitectura_v2_3.md
    ├── bitacora.md
    └── decisiones_sesion_junio2026.md
```

---

## 4. Estructura de Datos en Firebase

### 4.1 Estructura v2.0

```
/
├── hogares/
│   └── [codigoHogar]/
│       ├── meta/         → nombre, tipo, creadoPor
│       ├── miembros/     → [uid]/rol
│       ├── perfil/       → miembros, vehiculos, hijos, personalApoyo, ingresos
│       ├── pl/[año]/[mes 0-11]/   → presupuesto mensual
│       ├── daily/[año]/[mes]/[día]/[pushId]/
│       ├── viaje/
│       └── hist/
└── usuarios/
    └── [uid]/codigoHogar
```

### 4.2 Esquema del nodo `pl/[año]/[mes]` — v2.0

```json
{
  "_v2": true,
  "income": [
    { "label": "Ingreso [nombre miembro]", "value": 0, "fixed": true }
  ],
  "categories": [
    {
      "name": "🏠 Vivienda",
      "items": [
        {
          "label": "Arriendo / Hipoteca",
          "value": 0,
          "budget": 0,
          "fixed": true,
          "frecuencia": "mensual"
        },
        {
          "label": "SOAT",
          "value": 0,
          "budget": 450000,
          "fixed": true,
          "frecuencia": "anual",
          "months": [7]
        }
      ]
    }
  ]
}
```

> El campo `_v2: true` es el flag que indica que el documento ya está en formato v2. `migrateCategories()` lo usa para no re-migrar.

---

## 5. Decisiones Arquitecturales Críticas

### DA-0: El Hogar es la entidad principal *(ver encabezado)*

### DA-1: Gastos diarios FUERA del nodo mensual
Los gastos diarios viven únicamente en `daily/`. El total por categoría se calcula en memoria (`dailyTotals{}`). **Nunca se escribe en el nodo mensual.** Evita el loop infinito Firebase.

### DA-2: `planItems(cat)` como función canónica
**Regla:** Nunca usar `cat.items` directamente. Siempre usar `planItems(cat)`.

### DA-3: `canonicalLabel()` al leer, no al escribir
Normaliza encoding corrupto (tildes, eñes) al leer de Firebase. Nunca modificar ni eliminar.

### DA-4: Cola offline con localStorage
Gastos se guardan en localStorage cuando offline. UI optimista — el gasto aparece inmediatamente. Se sincronizan al detectar evento `'online'`.

### DA-5: Login primero, separar código después
Login Google ya implementado (Etapa A). El código JS ya está separado en 14 archivos modulares (Etapa D). Esta decisión fue respetada — el Login se implementó antes de la separación de código.

### DA-6: Hogar compartido con código de invitación
Quien crea el hogar genera el código. Quien entra con el código accede a los mismos datos en `hogares/[codigoHogar]/`.

### DA-7: Perfil del hogar como motor de UX
El nodo `perfil` es la fuente de verdad. Toda lógica de pantallas dinámicas pasa por `getCapabilidades(perfil)`. Nunca lógica ad-hoc dispersa.

### DA-8: Presupuesto Base con frecuencia por ítem
Cada ítem tiene `frecuencia`: `"mensual"` | `"bimestral"` | `"trimestral"` | `"semestral"` | `"anual"`.

**Función canónica — regla absoluta:**
```javascript
// ÚNICA función que calcula provisión mensual. Nunca calcular inline.
function calcPresupuestoBase(item, mesActual) {
  const b = item.budget || 0;
  if (!b) return 0;
  const frec = item.frecuencia || 'mensual';
  if (frec === 'mensual') return b;
  if (item.months && item.months.includes(mesActual)) return b;
  const divisores = { bimestral:2, trimestral:3, semestral:6, anual:12 };
  return Math.round(b / (divisores[frec] || 1));
}
```

### DA-9: El hogar se construye progresivamente
El onboarding mínimo solo pide tipo de hogar. El perfil completo se construye por uso real, no por formularios al inicio.

### DA-10: Dos niveles de detalle en categorías *(NUEVO — junio 2026)*

**Principio:** El Presupuesto Base usa ítems agrupados. El registro diario usa ítems detallados.

**Por qué:** Reduce fricción en el onboarding sin sacrificar la capacidad de análisis. Una mamá con poco tiempo configura 3 campos por pantalla. Un usuario avanzado obtiene el desglose completo desde el registro diario.

**Regla de implementación:**
- `defD()` define las categorías con ítems del **presupuesto** (agrupados)
- `DAILY_ITEMS` (constante separada) define el catálogo de ítems del **registro diario** (detallados)
- El registro diario usa `DAILY_ITEMS`, nunca `defD().categories`
- El análisis cruza ambos: agrupa los ítems diarios detallados bajo la categoría del presupuesto

**Mapa de agrupación presupuesto ← diario:**

| Ítem presupuesto | Ítems diarios que lo alimentan |
|-----------------|-------------------------------|
| Mercado | Frutas y verduras · Aseo y víveres |
| Salud | Droguería · Cita médica · Cita pediátrica · Medicina prepagada · Gimnasio |
| Belleza | Peluquería · Servicios estéticos |
| Servicios del hogar (onboarding) | Agua y Energía · Gas · Internet |

### DA-11: Ingresos dinámicos desde perfil *(NUEVO — junio 2026)*

**Regla:** Los labels de ingresos en `defD()` nunca están hardcodeados con nombres de personas.

```javascript
// CORRECTO — dinámico desde perfil
function buildIncomeFromPerfil(perfil) {
  const miembros = Object.values(perfil.miembros || {})
    .filter(m => m.rol === 'adulto');
  const income = miembros.map(m => ({
    label: `Ingreso ${m.nombre}`, value: 0, fixed: true
  }));
  income.push({ label: 'Otros ingresos', value: 0, fixed: false });
  return income;
}

// INCORRECTO — nunca hacer esto
income: [
  { label: 'Salario Jaime', value: 0 },  // ❌ hardcodeado
  { label: 'Salario Anny',  value: 0 },  // ❌ hardcodeado
]
```

### DA-12: Cuota crédito vehículo en Transporte, no Vivienda *(NUEVO — junio 2026)*

**Decisión:** La cuota de crédito o leasing del vehículo va en la categoría Transporte.

**Racional:** Es un gasto asociado a una decisión reversible — si la familia decide entregar el vehículo, el gasto desaparece. Diferente al arriendo/hipoteca que es un gasto estructural del hogar.

### DA-13: "Servicios estéticos" como ítem universal *(NUEVO — junio 2026)*

**Decisión:** Los ítems Manicure, Pedicure y Depilación se consolidan en "Servicios estéticos" en el registro diario.

**Racional:** Es un ítem universal — aplica para hombres (barbería) y mujeres por igual. El campo **nota** del registro especifica el detalle cuando se necesita.

---

## 6. `defD()` — Estructura oficial v2.0

```javascript
function defD() {
  return {
    _v2: true,
    income: buildIncomeFromPerfil(window.PERFIL || {}),
    categories: [
      { name: '🏠 Vivienda', items: [
        { label: 'Arriendo / Hipoteca',  value:0, budget:0, fixed:true  },
        { label: 'Administración',        value:0, budget:0, fixed:true  },
        { label: 'Agua y Energía',        value:0, budget:0, fixed:true  },
        { label: 'Gas',                   value:0, budget:0, fixed:true  },
        { label: 'Internet',              value:0, budget:0, fixed:true  },
        { label: 'Telefonía',             value:0, budget:0, fixed:true  },
        { label: 'Mantenimiento hogar',   value:0, budget:0, fixed:false },
        { label: 'Servicio doméstico',    value:0, budget:0, fixed:true  },
        { label: 'Otros',                 value:0, budget:0, fixed:false },
      ]},
      { name: '🍽️ Alimentación', items: [
        { label: 'Mercado',   value:0, budget:0, fixed:false },
        { label: 'Loncheras', value:0, budget:0, fixed:false },
        { label: 'Otros',     value:0, budget:0, fixed:false },
      ]},
      { name: '🚗 Transporte', items: [
        { label: 'Cuota crédito / leasing', value:0, budget:0, fixed:true  },
        { label: 'Combustible',              value:0, budget:0, fixed:false },
        { label: 'Transporte público',       value:0, budget:0, fixed:false },
        { label: 'Peajes',                   value:0, budget:0, fixed:false },
        { label: 'Parqueadero',              value:0, budget:0, fixed:false },
        { label: 'Mantenimiento vehículo',   value:0, budget:0, fixed:false },
        { label: 'Otros',                    value:0, budget:0, fixed:false },
      ]},
      { name: '🎬 Entretenimiento', items: [
        { label: 'Streaming',    value:0, budget:0, fixed:true  },
        { label: 'Cine',         value:0, budget:0, fixed:false },
        { label: 'Restaurantes', value:0, budget:0, fixed:false },
        { label: 'Salidas',      value:0, budget:0, fixed:false },
        { label: 'Viajes',       value:0, budget:0, fixed:false },
        { label: 'Vacaciones',   value:0, budget:0, fixed:false },
        { label: 'Otros',        value:0, budget:0, fixed:false },
      ]},
      { name: '👕 Vestuario', items: [
        { label: 'Ropa',     value:0, budget:0, fixed:false },
        { label: 'Zapatos',  value:0, budget:0, fixed:false },
        { label: 'Uniforme', value:0, budget:0, fixed:false },
        { label: 'Otros',    value:0, budget:0, fixed:false },
      ]},
      { name: '❤️ Salud y Belleza', items: [
        { label: 'Medicina prepagada', value:0, budget:0, fixed:true  },
        { label: 'Gimnasio',           value:0, budget:0, fixed:true  },
        { label: 'Salud',              value:0, budget:0, fixed:false },
        { label: 'Belleza',            value:0, budget:0, fixed:false },
        { label: 'Otros',              value:0, budget:0, fixed:false },
      ]},
      { name: '📚 Educación', items: [
        { label: 'Universidad',                   value:0, budget:0, fixed:true  },
        { label: 'Colegio',                       value:0, budget:0, fixed:true  },
        { label: 'Jardín',                        value:0, budget:0, fixed:true  },
        { label: 'Matrícula',                     value:0, budget:0, fixed:false },
        { label: 'Actividades extracurriculares', value:0, budget:0, fixed:false },
        { label: 'Otros',                         value:0, budget:0, fixed:false },
      ]},
      { name: '🛡️ Seguros e Impuestos', items: [
        { label: 'Seguro de vida',     value:0, budget:0, fixed:true, frecuencia:'anual'              },
        { label: 'Seguro de hogar',    value:0, budget:0, fixed:true, frecuencia:'anual'              },
        { label: 'Seguro vehículo',    value:0, budget:0, fixed:true, frecuencia:'anual'              },
        { label: 'SOAT',               value:0, budget:0, fixed:true, frecuencia:'anual', months:[7]  },
        { label: 'Impuestos vehículo', value:0, budget:0, fixed:true, frecuencia:'anual', months:[3]  },
        { label: 'Impuesto predial',   value:0, budget:0, fixed:true, frecuencia:'anual', months:[2]  },
        { label: 'Otros',              value:0, budget:0, fixed:false                                 },
      ]},
      { name: '🎁 Regalos y Celebraciones', items: [
        { label: 'Regalos',       value:0, budget:0, fixed:false },
        { label: 'Celebraciones', value:0, budget:0, fixed:false },
        { label: 'Otros',         value:0, budget:0, fixed:false },
      ]},
      { name: '💰 Ahorro', items: [
        { label: 'Ahorro programado', value:0, budget:0, fixed:true  },
        { label: 'Fondo emergencia',  value:0, budget:0, fixed:true  },
        { label: 'Otros',             value:0, budget:0, fixed:false },
      ]},
    ],
    nomina:    null,
    empleadas: null
  };
}
```

---

## 7. Catálogo de ítems del registro diario — `DAILY_ITEMS`

```javascript
// Constante separada de defD() — solo para el selector del registro diario
const DAILY_ITEMS = {
  '🏠 Vivienda':      ['Arriendo / Hipoteca','Administración','Agua y Energía','Gas','Internet','Telefonía','Servicio doméstico','Mantenimiento hogar'],
  '🍽️ Alimentación':  ['Frutas y verduras','Aseo y víveres','Loncheras','Otros'],
  '🚗 Transporte':    ['Cuota crédito / leasing','Combustible','Transporte público','Peajes','Parqueadero','Mantenimiento vehículo','Otros'],
  '🎬 Entretenimiento':['Streaming','Restaurantes','Cine','Salidas','Viajes','Vacaciones','Otros'],
  '👕 Vestuario':     ['Ropa','Zapatos','Uniforme','Otros'],
  '❤️ Salud y Belleza':['Medicina prepagada','Gimnasio','Droguería','Cita médica','Cita pediátrica','Peluquería','Servicios estéticos','Otros'],
  '📚 Educación':     ['Universidad','Colegio','Jardín','Matrícula','Actividades extracurriculares','Otros'],
  '🛡️ Seguros e Impuestos':['Seguro de vida','Seguro de hogar','Seguro vehículo','SOAT','Impuestos vehículo','Impuesto predial'],
  '🎁 Regalos y Celebraciones':['Regalos','Celebraciones','Otros'],
  '💰 Ahorro':        ['Ahorro programado','Fondo emergencia','Otros'],
};

// Regla: cuando el usuario elige "Otros", el campo nota es OBLIGATORIO
```

---

## 8. Reglas de Seguridad Firebase

**Estado objetivo (v2 — con Login Google):**
```json
{
  "rules": {
    "hogares": {
      "$codigoHogar": {
        ".read":  "auth != null && root.child('usuarios').child(auth.uid).child('codigoHogar').val() === $codigoHogar",
        ".write": "auth != null && root.child('usuarios').child(auth.uid).child('codigoHogar').val() === $codigoHogar"
      }
    },
    "usuarios": {
      "$uid": {
        ".read":  "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```

---

## 9. Funciones clave

| Función | Archivo | Responsabilidad |
|---------|---------|----------------|
| `calcPresupuestoBase(item, mes)` | `finanzas.js` | **Canónica** — única que calcula provisión mensual por frecuencia |
| `planItems(cat)` | `utils.js` | **Canónica** — única forma de obtener ítems de una categoría |
| `canonicalLabel(s)` | `utils.js` | Corrige encoding corrupto — nunca modificar |
| `defD()` | `finanzas.js` | Estructura base de categorías agrupadas (presupuesto) |
| `buildIncomeFromPerfil(perfil)` | `finanzas.js` | Genera ingresos dinámicos desde perfil — nunca hardcodear nombres |
| `getCapabilidades(perfil)` | `hogar.js` | Determina qué pantallas/categorías mostrar |
| `renderPresupuestoBase()` | `presupuesto.js` | Renderiza el flujo de onboarding y config del presupuesto |
| `guardarPresupuestoBase()` | `presupuesto.js` | Persiste el presupuesto base en Firebase |
| `migrateCategories(data)` | `finanzas.js` | Migración incremental entre versiones de defD() |

---

## 10. Migración Anny1130 — v1 → v2.0

**Estado:** ✅ Ejecutada. Los datos de `pl/Anny1130/2026/` fueron migrados a `hogares/SNBDPA/pl/2026/`. Los ítems migrados se verán correctamente cuando se implemente `defD()` v2.0 en Etapa E — la estructura de datos es correcta, la interfaz aún no muestra todas las categorías nuevas.

**Script usado:** `migracion-anny1130.html` — archivo de uso único, fuera del código de la app, no forma parte del deploy.

**Mapa de transformación:**

| Origen v1 | Destino v2 | Lógica |
|-----------|-----------|--------|
| Salario Empleada + Niñera | Vivienda / Servicio doméstico | Suma salarios base |
| Prestaciones (mes 0,1,5,11) | Vivienda / Servicio doméstico | Suma automática en el mes que aplica |
| Frutas y verduras + Aseo y víveres | Alimentación / Mercado | Suma |
| Lonchera | Alimentación / Loncheras | Directo |
| Restaurantes | Entretenimiento / Restaurantes | Cambio de categoría |
| Seguro de vida / hogar | Seguros / Seguro de hogar | Todo el valor al nuevo ítem |
| Peluquería + Manicure + Depilación | Salud y Belleza / Belleza | Suma |
| Droguería + Citas | Salud y Belleza / Salud | Suma |
| Ahorro mensual | Ahorro / Ahorro programado | Directo |

---

## 11. PWA — Configuración

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

*Organiza2 — Arquitectura Técnica v2.3 | Junio 2026*
