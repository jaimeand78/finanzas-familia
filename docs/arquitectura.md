# 🏗️ Arquitectura Técnica — Organiza2

> Documento de referencia técnica para desarrolladores e IAs que trabajen en el proyecto.  
> Versión 1.0 | Mayo 2026

---

## 1. Visión General

Organiza2 es una **Single Page Application (SPA)** construida en HTML/CSS/JS vanilla, con Firebase Realtime Database como backend y GitHub Pages como hosting. No hay build step, no hay framework, no hay dependencias npm en producción.

```
Usuario (móvil/desktop)
        │
        ▼
  GitHub Pages
  (organiza2.github.io)
        │
        ▼
  index.html  ←── Todo el frontend: HTML + CSS + JS en un solo archivo
        │
        ▼
  Firebase Realtime Database
  (organiza2-a09ef-default-rtdb)
```

---

## 2. Stack Tecnológico

| Capa | Tecnología | Razón de la elección |
|------|------------|----------------------|
| Frontend | HTML + CSS + JS Vanilla | Sin build step, deploy trivial con `git push`, control total del código |
| Base de datos | Firebase Realtime Database | Sync en tiempo real entre dos usuarios sin servidor propio |
| Autenticación | Hardcodeado temporal (`Anny1130`) → Firebase Auth Google (próximo) | Gmail tiene alta penetración en Colombia; login de un clic |
| Hosting | GitHub Pages | Gratuito, deploy automático desde rama `main`, sin configuración |
| PWA | manifest.json + meta tags Apple | Instalable en iPhone y Android, funciona offline |
| Offline | localStorage queue + `navigator.onLine` | Gastos se guardan localmente sin conexión y sincronizan al reconectar |
| IDE | VS Code + Git en Windows | Entorno familiar, push directo a GitHub Pages |

### ¿Por qué Firebase Realtime Database y no Firestore?
- Sync en tiempo real nativo — dos usuarios ven cambios instantáneamente sin polling
- Estructura de datos simple (JSON plano) que encaja con el modelo de planeador mensual
- Gratuito hasta escala significativa en plan Spark
- Firestore tiene ventajas en queries complejas que Organiza2 no necesita en esta etapa

### ¿Por qué HTML vanilla y no React/Vue?
- Deploy en GitHub Pages sin build step ni configuración
- Sin dependencias que romper con actualizaciones
- Codebase completo visible en un solo archivo — ideal para desarrollo con IA
- Para un MVP familiar esto es una ventaja enorme en velocidad e iteración

### ¿Por qué GitHub Pages y no Netlify/Vercel?
- Migración forzada desde Netlify (créditos gratuitos agotados en abril 2026)
- GitHub Pages es gratuito sin límites para proyectos estáticos
- Deploy automático con cada `git push` a rama `main`

---

## 3. Estructura de Archivos

```
organiza2/finanzas-familia/
├── index.html          ← Toda la app: HTML + CSS + JS (~1600+ líneas)
├── manifest.json       ← PWA config (pendiente: quitar apellidos)
├── icono-181.png       ← Ícono PWA
├── docs/               ← Documentación del proyecto (esta carpeta)
│   ├── README.md
│   ├── arquitectura.md
│   ├── producto.md
│   └── bitacora.md
└── .gitignore
```

> **Nota:** La separación de CSS y JS en archivos independientes está planificada en **Fase 5 del roadmap**, después de implementar el Login Google. Separar antes generaría trabajo doble porque el Login cambia la variable `FBK` en todo el código.

---

## 4. Estructura de Datos en Firebase

Base de datos: `organiza2-a09ef-default-rtdb`  
URL: `https://organiza2-a09ef-default-rtdb.firebaseio.com`

### 4.1 Nodos principales

```
/
├── pl/                          ← Planeador mensual (finanzas)
│   └── [uid]/
│       └── [año]/
│           └── [mes 0-11]/
│               ├── income[]
│               ├── categories[]
│               ├── nomina{}
│               └── empleadas{}
│
├── daily/                       ← Gastos hormiga diarios
│   └── [uid]/
│       └── [año]/
│           └── [mes MM]/
│               └── [día DD]/
│                   └── [pushId]/
│                       ├── amount: number
│                       ├── category: string
│                       ├── note: string
│                       ├── who: string
│                       └── ts: ISO string
│
├── viaje/                       ← Gastos de viaje/eventos (prototipo)
│   └── [uid]/
│       └── [año]/
│           └── [mes MM]/
│               └── [día DD]/
│                   └── [pushId]/
│                       ├── amount: number
│                       ├── currency: "EUR"|"USD"|"COP"
│                       ├── category: string
│                       ├── note: string
│                       ├── who: string
│                       └── ts: ISO string
│
└── hist/                        ← Historial de cambios
    └── [uid]/
        └── [pushId]/
            ├── user: string
            ├── type: "income"|"expense"|"budget"
            ├── description: string
            ├── amount: number
            ├── category: string
            └── ts: ISO string
```

### 4.2 Esquema detallado — nodo `pl/[uid]/[año]/[mes]`

```json
{
  "income": [
    {
      "label": "Salario Jaime",
      "value": 5000000,
      "fixed": true,
      "by": "Jaime"
    }
  ],
  "categories": [
    {
      "name": "Vivienda",
      "items": [
        {
          "label": "Hipoteca / Arriendo",
          "value": 1200000,
          "budget": 1200000,
          "fixed": true,
          "by": "Anny",
          "months": null
        },
        {
          "label": "Impuesto predial",
          "value": 0,
          "budget": 800000,
          "fixed": true,
          "months": [3]
        }
      ]
    }
  ],
  "nomina": {
    "jaime": {
      "bruto": 6000000,
      "ret": 420000,
      "afc": 0,
      "med": 0,
      "neto": 5100000,
      "prima": 2550000,
      "bonoVac": 0,
      "bonoRes": 0,
      "primaExtra": 0
    },
    "anny": { "..." : "..." }
  },
  "empleadas": {
    "empleada": {
      "salario": 1300000,
      "ic": 156000,
      "ces": 1300000,
      "primaJ": 650000,
      "primaD": 650000
    },
    "ninera": { "..." : "..." }
  }
}
```

### 4.3 Usuario actual

El uid actual es **`Anny1130`** — valor hardcodeado temporal definido en:
```javascript
const FBK = 'Anny1130';
```

Cuando se implemente Login Google (Fase 1), `FBK` se reemplaza por el uid real de Firebase Auth y los datos de `Anny1130` se migran al hogar correspondiente.

---

## 5. Arquitectura de Módulos (Frontend)

### 5.1 Tabs actuales

```
index.html
├── Tab: Mensual      → Vista resumen del mes con ingresos, gastos y progreso
├── Tab: Presupuesto  → Define cuánto planear gastar por ítem
├── Tab: Nómina       → Calcula salario neto Jaime y Anny con retención y prima
├── Tab: Empleadas    → Salarios y prestaciones de empleada y niñera
├── Tab: Hoy 💸       → Gastos hormiga del día (registro rápido)
├── Tab: ✈️ Viaje     → Prototipo de Eventos — gastos con moneda extranjera
└── Tab: Análisis 📊  → Semáforo, Tendencia, Hormiga
```

### 5.2 Funciones clave del JS

| Función | Responsabilidad |
|---------|----------------|
| `subMonth()` | Suscripción Firebase al mes actual — listener principal |
| `renderAll()` | Renderiza toda la pestaña Mensual |
| `recalc()` | Recalcula totales y actualiza cards/progreso/gráfica |
| `planItems(cat)` | **Función canónica** — obtiene ítems reales de una categoría (excluye auto) |
| `canonicalLabel(label)` | Corrige encodings corruptos de tildes/eñes al leer de Firebase |
| `save()` | Debounce 800ms → escribe en Firebase o encola si offline |
| `syncDailyMonth()` | Lee gastos hormiga del mes y los suma en `dailyTotals{}` (en memoria) |
| `syncOfflineQueue()` | Procesa la cola offline al reconectar |
| `calcNom()` | Calcula neto de nómina Jaime y Anny |
| `calcEmp()` | Calcula salario + prestaciones empleadas |

---

## 6. Decisiones Arquitecturales Críticas

### DA-1: Gastos hormiga FUERA del nodo mensual
**Problema:** Guardar totales hormiga en `pl/[uid]/[año]/[mes]` causaba un loop infinito:  
`syncDailyMonth → save() → listener → renderAll → syncDailyMonth → ∞`

**Solución:** Los gastos hormiga viven ÚNICAMENTE en `daily/[uid]/...`. El total por categoría se calcula en el objeto en memoria `dailyTotals{}` y `recalc()` lo suma al mostrar. **Nunca se escribe en el nodo mensual.**

---

### DA-2: `planItems(cat)` como función canónica
**Regla:** Nunca usar `cat.items` directamente. Siempre usar `planItems(cat)`.  
**Razón:** Filtra ítems `auto`, garantiza índices `ri` correctos, evita duplicados en pantalla.

---

### DA-3: `canonicalLabel()` al leer, no al escribir
**Problema:** Labels en Firebase con 4 tipos de encoding corrupto: `?` (003f), `\uFFFD` (fffd), `Ãí` (mojibake), correcto (00ed).  
**Solución:** Normalizar al leer en `subMonth()`, `loadFixed()` y `cleanDuplicates()`. La función tiene un mapa exhaustivo de todas las variantes corruptas conocidas.

---

### DA-4: Cola offline con localStorage
**Flujo:**
```
navigator.onLine = false
        │
        ▼
oqAdd({type, path, data})  →  localStorage['organiza2_offline_queue']
        │
        ▼
UI optimista: gasto aparece en pantalla inmediatamente (opacidad 0.6)
        │
        ▼
window.addEventListener('online')
        │
        ▼
syncOfflineQueue()  →  procesa cada item  →  db.ref(path).push/set(data)
        │
        ▼
Toast de confirmación + recarga de vista
```

---

### DA-5: Login primero, separar código después
**Decisión (mayo 2026):** NO separar el código en archivos JS separados hasta tener Login Google implementado.  
**Razón:** El Login reemplaza `const FBK = 'Anny1130'` por una variable dinámica que se usa en ~30 funciones. Separar primero generaría trabajo doble al tener que actualizar todos los archivos.

---

### DA-6: Hogar compartido con código de invitación
**Diseño planeado:**
```
Firebase Auth → uid individual (por usuario)
        │
        ▼
Código de hogar → nodo compartido
        │
pl/[codigoHogar]/[año]/[mes]   ← Jaime y Anny comparten este nodo
daily/[codigoHogar]/...
viaje/[codigoHogar]/...
```
Quien crea el hogar genera el código. Quien entra con el código accede a los mismos datos.

---

## 7. Reglas de Seguridad Firebase (Estado Actual)

Las reglas actuales cubren los nodos existentes. Cada nuevo nodo requiere cobertura explícita — Firebase **no tiene herencia automática** de reglas.

```json
{
  "rules": {
    "pl": { ".read": true, ".write": true },
    "daily": { ".read": true, ".write": true },
    "viaje": { ".read": true, ".write": true },
    "hist": { ".read": true, ".write": true }
  }
}
```

> ⚠️ **Pendiente:** Con Login Google, las reglas cambian a autenticación por uid:
> ```json
> { "rules": { "pl": { "$uid": { ".read": "$uid === auth.uid", ".write": "$uid === auth.uid" } } } }
> ```

---

## 8. Flujo de Datos — Casos de Uso Principales

### 8.1 Registro de gasto mensual
```
Usuario edita input en Tab Mensual
        │
        ▼
updExp(ci, ri, value)
        │
        ▼
D.categories[ci].items[ri].value = value
        │
        ▼
recalc()  →  actualiza UI inmediatamente
        │
        ▼
save()  →  debounce 800ms  →  db.ref(dKey(curY,curM)).set(D)
```

### 8.2 Registro de gasto hormiga
```
submitDaily()
        │
        ├── UI optimista: agrega item al DOM inmediatamente
        │
        ├── navigator.onLine?
        │       │
        │     false → oqAdd() → localStorage
        │       │
        │     true  → db.ref(dayKey(date)).push(entry)
        │
        ▼
syncDailyMonth()  →  lee todos los gastos del mes
        │
        ▼
dailyTotals{categoria: total}  →  solo en memoria
        │
        ▼
recalc()  →  suma hormiga al total de cada categoría en pantalla
```

### 8.3 Sincronización entre dos usuarios
```
Usuario A registra gasto  →  Firebase
                                │
                        Firebase listener
                                │
                        subMonth() on('value')
                                │
                        renderAll()  →  Usuario B ve el cambio en tiempo real
```

---

## 9. PWA — Configuración

```json
// manifest.json
{
  "name": "Finanzas — Organiza2",
  "short_name": "Organiza2",
  "start_url": "./index.html",
  "display": "standalone",
  "background_color": "#F5F3EE",
  "theme_color": "#1D9E75"
}
```

> ⚠️ **Bug conocido:** El `manifest.json` en producción todavía tiene apellidos en `name` y `description`. Pendiente de corrección en Fase 2.

**Instalación en iPhone:** Safari → botón compartir ⬆️ → "Agregar a pantalla de inicio"

---

## 10. Módulo Viaje — Prototipo de Eventos

El tab `✈️ Viaje` fue construido para el viaje a Europa de mayo 2026. **Está congelado** — no se le agregarán más features. Será refactorizado como motor genérico del módulo Eventos en Fase 4.

**Lo que valida como prototipo:**
- Registro rápido desde móvil en condiciones reales
- Multiusuario simultáneo (Jaime y Anny)
- Conversión de monedas EUR/USD/COP con tasas editables
- Cola offline funcional
- Resumen acumulado con barras por categoría

**Estructura de datos del futuro módulo Eventos:**
```
eventos/[codigoHogar]/[eventoId]/
├── meta: { nombre, tipo, fechaInicio, fechaFin, presupuesto }
├── gastos/[día]/[pushId]: { amount, currency, category, note, who, ts }
└── checklist/[pushId]: { tarea, responsable, done }
```

---

*Organiza2 — Arquitectura Técnica v1.0 | Mayo 2026*
