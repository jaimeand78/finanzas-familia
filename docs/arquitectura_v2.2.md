# 🏗️ Arquitectura Técnica — Organiza2

> Documento de referencia técnica para desarrolladores e IAs que trabajen en el proyecto.  
> Versión 2.2 | Junio 2026

---

## ⚠️ Principio Fundacional — DA-0: El Hogar es la entidad principal del sistema

> **Esta decisión es la más importante de toda la arquitectura. Cualquier IA o desarrollador que trabaje en este proyecto debe leerla primero.**

**El Hogar — no el Usuario — es la entidad central de Organiza2.**

Todos los módulos, pantallas, categorías, presupuestos, recordatorios y funcionalidades dependen del perfil del hogar. El usuario existe para autenticarse. El hogar existe para organizar la vida.

```
                    🏠 HOGAR
                 (entidad principal)
                        │
          ┌─────────────┼─────────────┐
          │             │             │
       perfil        datos         miembros
   (fuente de      (finanzas,      (usuarios
     verdad)       eventos,        del hogar)
                 alimentación)
```

**Implicaciones técnicas que nunca deben violarse:**

| Regla | Descripción |
|-------|-------------|
| **Los datos viven en el hogar** | Toda escritura va a `hogares/[codigoHogar]/...`. Nunca a un nodo personal de usuario. |
| **El perfil determina la UX** | Pantallas, categorías y funciones visibles se derivan de `getCapabilidades(perfil)`. Nunca de lógica ad-hoc dispersa. |
| **El usuario referencia al hogar** | `usuarios/[uid]/codigoHogar` es solo un puntero. El uid no es la clave de ningún dato de negocio. |
| **El hogar es independiente del plan** | Tipo de hogar (Soltero/Pareja/Familia) afecta experiencia, no límites comerciales. Los límites de plan son una capa separada. |
| **Onboarding configura el hogar, no el usuario** | El flujo de primera vez construye el perfil del hogar. Las preferencias personales del usuario son secundarias. |

---

## 1. Visión General

Organiza2 es una **Single Page Application (SPA)** construida en HTML/CSS/JS vanilla, con Firebase Realtime Database como backend y GitHub Pages como hosting. No hay build step, no hay framework, no hay dependencias npm en producción.

```
Usuario (móvil/desktop)
        │
        ▼
  GitHub Pages
  (organiza2.github.io/finanzas-familia)
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
| Base de datos | Firebase Realtime Database | Sync en tiempo real entre usuarios sin servidor propio |
| Autenticación | Firebase Auth (Google) — pendiente | Gmail tiene alta penetración en Colombia; login de un clic |
| Hosting | GitHub Pages | Gratuito, deploy automático desde rama `main` |
| PWA | manifest.json + meta tags Apple | Instalable en iPhone y Android, funciona offline |
| Offline | localStorage queue + `navigator.onLine` | Gastos se guardan localmente sin conexión y sincronizan al reconectar |
| IDE | VS Code + Git en Windows | Entorno familiar, push directo a GitHub Pages |

### ¿Por qué Firebase Realtime Database y no Firestore?
- Sync en tiempo real nativo — dos usuarios ven cambios instantáneamente sin polling
- Estructura de datos simple (JSON plano) que encaja con el modelo del hogar
- Gratuito hasta escala significativa en plan Spark

### ¿Por qué HTML vanilla y no React/Vue?
- Deploy en GitHub Pages sin build step ni configuración
- Sin dependencias que romper con actualizaciones
- Codebase completo visible en un solo archivo — ideal para desarrollo con IA

---

## 3. Estructura de Archivos

```
organiza2/finanzas-familia/
├── index.html          ← Toda la app: HTML + CSS + JS (~1600+ líneas)
├── manifest.json       ← PWA config
├── icono-181.png       ← Ícono PWA
├── docs/
│   ├── README.md
│   ├── arquitectura.md
│   ├── producto.md
│   └── bitacora.md
└── .gitignore
```

> **Nota:** La separación de CSS y JS en archivos independientes está planificada **después** de implementar el Login Google y el modelo de hogar. Ver DA-5.

---

## 4. Estructura de Datos en Firebase

Base de datos: `organiza2-a09ef-default-rtdb`  
URL: `https://organiza2-a09ef-default-rtdb.firebaseio.com`

### 4.1 Nodos principales — estado actual (v1)

```
/
├── pl/[uid]/[año]/[mes 0-11]/        ← Planeador mensual (finanzas)
├── daily/[uid]/[año]/[mes MM]/[día DD]/[pushId]/   ← Gastos diarios
├── viaje/[uid]/[año]/[mes MM]/[día DD]/[pushId]/   ← Gastos de viaje (prototipo)
└── hist/[uid]/[pushId]/              ← Historial de cambios
```

**uid actual:** `Anny1130` — valor hardcodeado temporal. Se migra al implementar Login Google.

---

### 4.2 Estructura de datos — v2.0 (con modelo de hogar)

Con Login Google, el uid individual del usuario existe en Firebase Auth. Los datos del hogar se comparten mediante un **código de hogar** — nodo raíz compartido entre todos los miembros.

```
/
├── hogares/
│   └── [codigoHogar]/
│       ├── meta/
│       │   ├── nombre: string
│       │   ├── tipo: "soltero" | "pareja" | "familia"
│       │   └── creadoPor: uid
│       │
│       ├── perfil/                        ← Fuente de verdad para pantallas dinámicas
│       │   ├── miembros/
│       │   │   └── [id]/
│       │   │       ├── nombre: string
│       │   │       └── rol: "adulto" | "hijo"
│       │   │
│       │   ├── vehiculos/
│       │   │   └── [id]/
│       │   │       ├── nombre: string
│       │   │       ├── tipo: string
│       │   │       ├── placa: string
│       │   │       ├── fechaSOAT: string (ISO)
│       │   │       ├── fechaSeguro: string (ISO)
│       │   │       └── fechaImpuesto: string (ISO)
│       │   │
│       │   ├── hijos/
│       │   │   └── [id]/
│       │   │       ├── nombre: string
│       │   │       ├── fechaNacimiento: string (ISO)
│       │   │       ├── institucion: string
│       │   │       └── nivel: string
│       │   │
│       │   ├── personalApoyo/
│       │   │   └── [id]/
│       │   │       ├── nombre: string
│       │   │       ├── tipo: "empleada" | "ninera" | "conductor" | "mensajero"
│       │   │       ├── fechaInicio: string (ISO)
│       │   │       └── salario: number
│       │   │
│       │   ├── ingresos/
│       │   │   └── [id]/
│       │   │       ├── label: string
│       │   │       ├── tipo: "salario" | "negocio" | "honorarios" | "otro"
│       │   │       ├── monto: number
│       │   │       └── quien: string
│       │   │
│       │   └── mascotas/                    ← RESERVADO — no implementar en v2.0
│       │       └── [id]/                    ← Veterinario · Vacunas · Alimentación · Cuidado
│       │           ├── nombre: string
│       │           ├── especie: string
│       │           └── fechaNacimiento: string (ISO)
│       │
│       ├── metas/                           ← RESERVADO — no implementar en v2.0
│       │   └── [id]/                        ← Viaje · Apartamento · Universidad · Vehículo · Emergencia
│       │       ├── nombre: string           ← "Viaje Europa 2027"
│       │       ├── tipo: string             ← "viaje" | "inmueble" | "educacion" | "vehiculo" | "emergencia" | "otro"
│       │       ├── monto: number            ← Meta en COP
│       │       ├── fechaObjetivo: string (ISO)
│       │       └── ahorroMensual: number    ← Calculado: monto / meses restantes
│       │
│       ├── pl/[año]/[mes 0-11]/           ← Presupuesto base + gastos mensuales
│       ├── daily/[año]/[mes MM]/[día DD]/[pushId]/   ← Gastos diarios
│       ├── eventos/[eventoId]/            ← Módulo Planeador (v3.0)
│       └── hist/[pushId]/                ← Historial de cambios
│
└── usuarios/
    └── [uid]/
        └── codigoHogar: string            ← Referencia al hogar del usuario
```

---

### 4.3 Esquema detallado — perfil del hogar como motor de pantallas dinámicas

El nodo `hogares/[codigoHogar]/perfil` es la **fuente de verdad** que determina qué ve cada usuario.

**Regla:** Antes de renderizar cualquier vista, la app lee el perfil del hogar y activa o desactiva secciones según su contenido.

```javascript
// Ejemplo de lógica de pantallas dinámicas
function getCapabilidades(perfil) {
  return {
    mostrarEducacion:       perfil.hijos && Object.keys(perfil.hijos).length > 0,
    mostrarVehiculos:       perfil.vehiculos && Object.keys(perfil.vehiculos).length > 0,
    mostrarServicioDom:     perfil.personalApoyo && Object.keys(perfil.personalApoyo).length > 0,
    mostrarAlimentacion:    perfil.hijos && Object.keys(perfil.hijos).length > 0,
    mostrarVistaPareja:     perfil.meta?.tipo === 'pareja' || perfil.meta?.tipo === 'familia',
  };
}
```

**Principio:** el perfil se construye progresivamente. El onboarding mínimo sólo requiere tipo de hogar. La app sugiere completar el perfil a medida que el usuario lo usa.

---

### 4.4 Esquema detallado — nodo `pl/[año]/[mes]`

```json
{
  "income": [
    { "label": "Salario Jaime", "value": 5000000, "fixed": true, "by": "Jaime" }
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
          "frecuencia": "mensual",
          "months": null
        }
      ]
    }
  ],
  "nomina": {
    "jaime": { "bruto": 6000000, "ret": 420000, "neto": 5100000, "prima": 2550000 }
  },
  "empleadas": {
    "empleada": { "salario": 1300000, "ic": 156000, "ces": 1300000, "primaJ": 650000, "primaD": 650000 }
  }
}
```

> En v2.0 se introduce el campo `frecuencia` por ítem: `"mensual"`, `"semestral"`, `"anual"`. Esto soporta el **Presupuesto Base** — cada ítem sabe con qué periodicidad aplica.

---

## 5. Arquitectura de Módulos (Frontend)

### 5.1 Tabs actuales — Finanzas v1 (en producción)

```
index.html
├── Tab: Mensual      → Vista resumen del mes
├── Tab: Presupuesto  → Define gasto planeado por ítem
├── Tab: Nómina       → Salario neto con retención y prima
├── Tab: Empleadas    → Salarios y prestaciones
├── Tab: Hoy 💸       → Registro rápido de gastos diarios
├── Tab: ✈️ Viaje     → Prototipo de Eventos (congelado)
└── Tab: Análisis 📊  → Semáforo, Tendencia, Hormiga
```

### 5.2 Tabs objetivo — Finanzas v2.0

```
index.html (reconstruido sobre modelo de hogar)
├── Tab: Hoy          → Registro unificado: gastos e ingresos del día
├── Tab: Resumen      → Dashboard: ingresos, gastos, disponible, alertas
├── Tab: Análisis     → Tendencias, histórico, patrones (incl. métrica hormiga)
└── Tab: Config       → Presupuesto Base, ingresos, vehículos, personal, perfil hogar
```

> Las secciones dentro de cada tab se renderizan dinámicamente según `getCapabilidades(perfil)`. Un soltero ve Config sin "Servicio doméstico" ni "Educación".

---

### 5.3 Funciones clave del JS — estado actual

| Función | Responsabilidad |
|---------|----------------|
| `subMonth()` | Suscripción Firebase al mes actual — listener principal |
| `renderAll()` | Renderiza toda la pestaña Mensual |
| `recalc()` | Recalcula totales y actualiza cards/progreso/gráfica |
| `planItems(cat)` | **Función canónica** — obtiene ítems reales de una categoría (excluye auto) |
| `canonicalLabel(label)` | Corrige encodings corruptos de tildes/eñes al leer de Firebase |
| `save()` | Debounce 800ms → escribe en Firebase o encola si offline |
| `syncDailyMonth()` | Lee gastos diarios del mes y los suma en `dailyTotals{}` (en memoria) |
| `syncOfflineQueue()` | Procesa la cola offline al reconectar |
| `calcNom()` | Calcula neto de nómina |
| `calcEmp()` | Calcula salario + prestaciones empleadas |

### 5.4 Funciones nuevas requeridas para v2.0

| Función | Responsabilidad |
|---------|----------------|
| `initLogin()` | Flujo Firebase Auth Google — reemplaza `const FBK = 'Anny1130'` |
| `loadPerfil()` | Lee `hogares/[codigoHogar]/perfil` al iniciar |
| `getCapabilidades(perfil)` | Devuelve objeto con flags de qué mostrar según el perfil |
| `renderDynamic()` | Renderiza tabs y secciones según `getCapabilidades()` |
| `onboardingMinimo()` | Flujo de primera vez — solo tipo de hogar |
| `sugerirCompletarPerfil()` | Detecta uso y sugiere agregar vehículos, hijos, etc. |
| `calcPresupuestoBase()` | Genera presupuesto mensual automático desde ítems con frecuencia |

---

## 6. Decisiones Arquitecturales Críticas

### DA-1: Gastos diarios FUERA del nodo mensual
**Problema:** Guardar totales diarios en `pl/[uid]/[año]/[mes]` causaba loop infinito:  
`syncDailyMonth → save() → listener → renderAll → syncDailyMonth → ∞`

**Solución:** Los gastos diarios viven únicamente en `daily/`. El total por categoría se calcula en memoria (`dailyTotals{}`) y `recalc()` lo suma al mostrar. **Nunca se escribe en el nodo mensual.**

---

### DA-2: `planItems(cat)` como función canónica
**Regla:** Nunca usar `cat.items` directamente. Siempre usar `planItems(cat)`.  
**Razón:** Filtra ítems `auto`, garantiza índices `ri` correctos, evita duplicados en pantalla.

---

### DA-3: `canonicalLabel()` al leer, no al escribir
**Problema:** Labels en Firebase con 4 tipos de encoding corrupto: `?` (003f), `\uFFFD` (fffd), `Ãí` (mojibake), correcto (00ed).  
**Solución:** Normalizar al leer en `subMonth()`, `loadFixed()` y `cleanDuplicates()`. La función tiene un mapa exhaustivo de todas las variantes corruptas conocidas. Nunca modificar este comportamiento.

---

### DA-4: Cola offline con localStorage
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
**Razón:** El Login reemplaza `const FBK = 'Anny1130'` por una variable dinámica que se usa en ~30 funciones. Separar primero generaría trabajo doble.

---

### DA-6: Hogar compartido con código de invitación
```
Firebase Auth → uid individual (por usuario)
        │
        ▼
usuarios/[uid]/codigoHogar  →  referencia al nodo compartido
        │
        ▼
hogares/[codigoHogar]/...   ←  Jaime y Anny comparten este nodo
```
Quien crea el hogar genera el código. Quien entra con el código accede a los mismos datos.

---

### DA-7: Perfil del hogar como motor de UX (NUEVO — v2.0)
**Principio:** El nodo `hogares/[codigoHogar]/perfil` es la fuente de verdad de la experiencia.

**Regla:** Ninguna sección de la UI se muestra o esconde con lógica ad-hoc. Todo pasa por `getCapabilidades(perfil)`.

**Onboarding progresivo:**
- Primera vez: solo se pide tipo de hogar (Soltero/Pareja/Familia)
- La app sugiere completar perfil según el uso real (primer gasto de educación → sugerir registrar hijo; primer gasto de vehículo → sugerir registrar vehículo)
- El perfil completo vive en Config y puede editarse en cualquier momento

**Separación negocio / experiencia:**
- Tipo de hogar = personalización de UX únicamente
- Límites de plan (si existen) = lógica independiente, no relacionada con tipo de hogar

---

### DA-8: Presupuesto Base con frecuencia por ítem (NUEVO — v2.0)

**Rol en el sistema:** El Presupuesto Base es el corazón financiero de Organiza2. No es una lista de gastos mensuales — es la descripción financiera completa del hogar a lo largo del año.

**Flujo conceptual:**
```
Perfil del Hogar
       ↓
Presupuesto Base  ←  se configura una vez, genera el año entero
       ↓
Resumen Mensual   ←  plan vs real del mes en curso
       ↓
Análisis          ←  patrones, tendencias, desviaciones
```

**Problema que resuelve:** El presupuesto mensual manual requería que el usuario recordara dividir gastos anuales (SOAT, impuesto predial, prima) entre 12. Cada vez que llegaban esos gastos, "sorprendían" al hogar.

**Solución:** Cada ítem del presupuesto tiene un campo `frecuencia`. La app calcula automáticamente la provisión mensual equivalente y en el mes que corresponde muestra el gasto real contra el presupuestado:

```javascript
{ label: "SOAT", budget: 450000, frecuencia: "anual", months: [7] }
// Provisión mensual: 450000 / 12 = 37.500
// En agosto (mes 7): gasto real vs 450.000 presupuestado
```

**Valores de frecuencia:** `"mensual"` | `"bimestral"` | `"trimestral"` | `"semestral"` | `"anual"`

**Regla de implementación:** `calcPresupuestoBase()` es la única función que genera valores de provisión mensual. Nunca calcular provisiones inline en `renderAll()` o `recalc()`.

---

### DA-9: El hogar se construye progresivamente (NUEVO — v2.0)

**Principio:** Nunca solicitar información que todavía no genera valor para el usuario.

El onboarding mínimo solo pide el tipo de hogar. Todo lo demás se sugiere en el momento en que el usuario hace algo que lo requiere. La app no muestra formularios vacíos — muestra sugerencias contextuales.

**Regla:** `sugerirCompletarPerfil()` se dispara por eventos de uso, no por timers ni pantallas genéricas de "completa tu perfil".

**Gatillos definidos:**

| Evento de uso | Sugerencia que se dispara |
|---------------|--------------------------|
| Primer gasto en categoría Educación | "¿Tienes hijos? Regístralos para personalizar tu experiencia" |
| Primer gasto en categoría Transporte (subcategoría SOAT/Seguro) | "¿Tienes vehículo? Regístralo para activar recordatorios automáticos" |
| Primer gasto en categoría Servicio Doméstico | "¿Tienes empleada o niñera? Regístrala para calcular prestaciones automáticamente" |
| Primer ingreso registrado por un segundo usuario del hogar | "¿Tu pareja también trabaja? Agrégala como fuente de ingreso del hogar" |

**Características del banner de sugerencia:**
- No bloquea el flujo del usuario
- Aparece una sola vez por tipo de sugerencia (dismissible y no repetible)
- Lleva directamente al formulario de configuración relevante
- Se puede ignorar sin consecuencias

**Relación con DA-7:** DA-7 define que `getCapabilidades(perfil)` controla qué se muestra. DA-9 define cómo se construye ese perfil en el tiempo. Son complementarios, no alternativos.

**Filosofía que sostiene esta decisión:**
> Configurar una vez. Registrar diariamente. Entender fácilmente.
> El perfil completo no es un requisito de entrada — es el resultado del uso.

---

## 7. Reglas de Seguridad Firebase

**Estado actual (v1 — sin login, abierto):**
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

**Estado objetivo (v2 — con Login Google y modelo de hogar):**
```json
{
  "rules": {
    "hogares": {
      "$codigoHogar": {
        ".read": "auth != null && root.child('usuarios').child(auth.uid).child('codigoHogar').val() === $codigoHogar",
        ".write": "auth != null && root.child('usuarios').child(auth.uid).child('codigoHogar').val() === $codigoHogar"
      }
    },
    "usuarios": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```

> **Nota:** Firebase no tiene herencia automática de reglas. Cada nuevo nodo requiere cobertura explícita.

---

## 8. Flujo de Datos — Casos de Uso Principales

### 8.1 Registro de gasto diario (v2.0 — flujo unificado)
```
submitGasto()
        │
        ├── UI optimista: agrega item al DOM inmediatamente
        │
        ├── navigator.onLine?
        │       ├── false → oqAdd() → localStorage
        │       └── true  → db.ref(dayKey()).push(entry)
        │
        └── syncDailyMonth() → dailyTotals{} → recalc()
```

### 8.2 Generación de presupuesto mensual desde Presupuesto Base
```
calcPresupuestoBase(perfil, presupuestoBase)
        │
        ▼
Para cada ítem: calcular valor mensual según frecuencia
        │
        ▼
Filtrar por capabilidades(perfil): excluir categorías no aplicables
        │
        ▼
Guardar en pl/[codigoHogar]/[año]/[mes]
        │
        ▼
renderAll() → usuario ve el mes pre-cargado con valores base
```

### 8.3 Onboarding progresivo
```
Primera visita
        │
        ▼
¿Existe hogares/[uid]/meta?
        ├── NO → onboardingMinimo(): tipo de hogar + nombre
        └── SÍ → loadPerfil() → getCapabilidades() → renderDynamic()
                        │
                        ▼
              ¿Perfil incompleto?
                        │
                        └── sugerirCompletarPerfil() según uso
```

### 8.4 Sincronización entre dos usuarios del hogar
```
Jaime registra gasto  →  hogares/[codigoHogar]/daily/...
                                    │
                            Firebase listener
                                    │
                        subMonth() on('value')
                                    │
                        renderAll()  →  Anny ve el cambio en tiempo real
```

---

## 9. Módulo Viaje — Estado actual (prototipo congelado)

El tab `✈️ Viaje` fue construido y validado durante el viaje a Europa de mayo 2026. **Está congelado** — no se le agregarán más features. Será refactorizado como motor del Planeador en v3.0.

**Lo que valida:**
- Registro rápido desde móvil en condiciones reales
- Multiusuario simultáneo
- Conversión de monedas EUR/USD/COP
- Cola offline funcional
- Resumen acumulado con barras por categoría

**Estructura de datos del futuro módulo Planeador:**
```
hogares/[codigoHogar]/eventos/[eventoId]/
├── meta: { nombre, tipo, fechaInicio, fechaFin, presupuesto }
├── gastos/[día]/[pushId]: { amount, currency, category, note, who, ts }
└── checklist/[pushId]: { tarea, responsable, done }
```

---

## 10. PWA — Configuración

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

**Instalación en iPhone:** Safari → botón compartir ⬆️ → "Agregar a pantalla de inicio"

---

## 11. Migración de Datos — Anny1130 → v2.0

Al implementar Login Google, los datos actuales bajo uid `Anny1130` deben migrarse al nuevo modelo de hogar.

**Plan de migración:**
```
1. Usuario hace login con Google → obtiene uid real
2. Se crea hogar con codigoHogar generado automáticamente
3. Script de migración copia:
   pl/Anny1130/  →  hogares/[codigoHogar]/pl/
   daily/Anny1130/  →  hogares/[codigoHogar]/daily/
   viaje/Anny1130/  →  hogares/[codigoHogar]/viaje/
4. usuarios/[uid]/codigoHogar = [codigoHogar]
5. Reglas Firebase se actualizan a modo autenticado
```

> La migración se ejecuta una sola vez, validada manualmente antes de activar las nuevas reglas de seguridad.

---

*Organiza2 — Arquitectura Técnica v2.2 | Junio 2026*
