# 📓 Organiza2 — Bitácora Técnica v1.2

> Historial completo de desarrollo, bugs y soluciones  
> Abril — Mayo 2026

---

## 1. Resumen Ejecutivo

| ✅ Logros principales | 🔲 Pendientes para v2 |
|----------------------|----------------------|
| App PWA instalable en iPhone y Android | Login con Google (Firebase Auth) |
| Sincronización en tiempo real entre dos usuarios | Hogar compartido con código de invitación |
| Módulo de Nómina con cálculo automático | Onboarding con plantillas por perfil familiar |
| Módulo de Empleadas con prestaciones sociales | Exportar PDF y Excel |
| Gastos hormiga diarios sin loop de Firebase | Fix iOS decimal input (`type="text"` `inputmode="decimal"`) |
| Pestaña Análisis: Semáforo, Tendencia, Hormiga | Landing page Organiza2 |
| Módulo Viaje validado en uso real (Europa mayo 2026) | Empleada por días con cálculo completo |
| Cola offline: gastos sin conexión → sync automático | Seguridad social empleador en módulo Empleadas |
| Migración a Firebase organiza2 sin apellidos | Aviso sobre retención en la fuente |
| Corrección 209 labels y 33 categorías corruptas | Backups automáticos (plan Blaze) |
| Git + VS Code configurado en Windows | Arreglar manifest.json (quitar apellidos) |
| Separación identidad personal vs producto en GitHub | |

---

## 2. Cronología de Desarrollo

### 📅 Fase 1 — Origen del planeador (23 abril 2026)

> El proyecto nació de una necesidad real: organizar las finanzas familiares compartidas entre pareja.

- Stack elegido: HTML + CSS + JS vanilla — sin frameworks, liviano y controlable
- Base de datos: Firebase Realtime Database — sincronización en tiempo real gratuita
- Hosting: GitHub Pages — gratuito, deploy automático, sin límites
- Identificación de usuarios: Jaime / Anny con selección al abrir la app

### 📅 Fase 2 — Evolución y features nuevos (24-29 abril 2026)

- Migración de Netlify a GitHub Pages (créditos gratuitos agotados)
- Pestaña Presupuesto — define cuánto planear gastar por ítem
- Pestaña Nómina — cálculo de salario neto Jaime y Anny
- Pestaña Empleadas — salario + prestaciones sociales
- Prima de junio y diciembre calculada automáticamente
- Retención en la fuente auto: 7% Jaime / 9% Anny

### 📅 Fase 3 — Gastos hormiga diarios (27-28 abril 2026)

- Pestaña Hoy con registro rápido: monto, categoría, nota opcional
- Lista acumulativa de gastos del día con hora exacta
- Navegación entre días con flechas
- Totales de hormiga sumados por categoría al presupuesto mensual

### 📅 Fase 4 — Depuración masiva (2-4 mayo 2026)

> El período más complejo del proyecto — bugs encadenados que requerían soluciones arquitecturales, no parches.

- Loop infinito Firebase: `syncDailyMonth → save() → listener → renderAll → syncDailyMonth`
- Ítems duplicados en pantalla por uso de `cat.items` en vez de `planItems(cat)`
- Nombres de ítems repetidos con encodings corruptos (`?`, `\uFFFD`, `Ãí`)
- Estructura HTML inválida (scripts fuera de `<head>` y `<body>`)

### 📅 Fase 5 — Profesionalización y Organiza2 (7-10 mayo 2026)

- Migración a Firebase organiza2 — sin apellidos en la URL
- Creación de organización `organiza2` en GitHub
- Transferencia del repo a `github.com/organiza2/finanzas-familia`
- Git instalado y configurado en Windows con VS Code
- API Key restringida a `organiza2.github.io` en Google Cloud
- Pestaña Análisis con Semáforo, Tendencia y Hormiga
- Corrección masiva de encoding en Firebase: 209 labels + 33 categorías

### 📅 Fase 6 — Módulo Viaje y Cola Offline (mayo 2026)

> Esta fase nació de una necesidad concreta: el viaje a Europa de mayo 2026. Se construyó el módulo Viaje como una prueba rápida para registrar gastos en tiempo real. Sin proponérselo, se convirtió en la validación más completa del producto hasta la fecha.

**Lo que se validó con uso real durante el viaje:**
- Registro rápido de gastos desde móvil en condiciones reales
- Multiusuario — ambos esposos registrando desde sus teléfonos
- Sincronización en tiempo real entre dispositivos
- Navegación por días del viaje
- Resumen acumulado con barras por categoría
- Conversión de monedas EUR/USD/COP con tasas editables
- Cola offline en zonas sin internet

**Estado del módulo Viaje:**  
El módulo cumplió su misión como prueba. **Está congelado** — no se le agregarán más funcionalidades. Será refactorizado como motor genérico del módulo Eventos en la Fase 4 del roadmap.

---

## 3. Registro de Bugs y Soluciones

### 🐛 Bug #1 — Firebase no se conectaba
**Fecha:** 23-24 abril 2026  
**Causa:** Scripts de Firebase con `type="module"` impedían que `firebase` quedara disponible en scope global antes de `initApp()`.  
**Solución:** Reemplazar import ES modules por librería compat de Firebase cargada via CDN clásico en el `<head>`.  
**Estado:** ✅ Resuelto

---

### 🐛 Bug #2 — Pantalla de config visible aunque estuviera hardcodeada
**Fecha:** 24 abril 2026  
**Causa:** CSS tenía `#configScreen { display: flex }` que sobreescribía cualquier `display:none` de JavaScript.  
**Solución:** Poner `style="display:none"` directamente en el HTML del elemento. Los estilos inline tienen mayor prioridad.  
**Estado:** ✅ Resuelto

---

### 🐛 Bug #3 — Gastos estacionales aparecían en meses incorrectos
**Fecha:** 29 abril 2026  
**Causa:** `loadFixed()` filtraba correctamente al copiar datos del mes anterior, pero al cargar datos existentes de Firebase no respetaba la restricción de meses.  
**Solución:** Agregar limpieza de valores al cargar:
```javascript
if(item.months && !item.months.includes(curM)) item.value = 0;
```
**Estado:** ✅ Resuelto

---

### 🐛 Bug #4 — Loop infinito en pestaña Hoy ⚠️ El más crítico
**Fecha:** 2-3 mayo 2026  
**Causa:** Flujo cíclico:
```
agregar gasto → Firebase daily → syncDailyMonth() → save() → listener → renderAll() → syncDailyMonth() → ∞
```
**Solución arquitectural:** Sacar hormiga completamente de Firebase `D` (datos del mes). Gastos hormiga SOLO en nodo `daily/`. Total por categoría calculado en memoria (`dailyTotals`) sin tocar Firebase.  
**Estado:** ✅ Resuelto

---

### 🐛 Bug #5 — Ítems duplicados en pantalla
**Fecha:** 6 mayo 2026  
**Causa:** `renderAll()` iteraba `cat.items.filter(r=>!r.auto)` con índices `ri` que no coincidían con los índices reales.  
**Solución:** Reemplazar por `planItems(cat)` — la función canónica. Agregar normalización al inicio de `renderAll()` para eliminar duplicados en memoria antes de pintar.  
**Estado:** ✅ Resuelto

---

### 🐛 Bug #6 — Encoding corrupto de tildes y eñes en Firebase
**Fecha:** 6-7 mayo 2026  
**Causa:** Labels guardados con 4 tipos de encoding corrupto: `003f` (?), `fffd` (\uFFFD), `Ãí` (mojibake), `00ed` (correcto). `normalizeCategoryItems()` no detectaba duplicados porque agrupaba por label exacto.  
**Solución:** 
1. Scripts de limpieza directa en Firebase — 209 labels + 33 categorías corregidos
2. Función `canonicalLabel()` que corrige cualquier versión corrupta al leer de Firebase, antes de renderizar

**Estado:** ✅ Resuelto

---

### 🐛 Bug #7 — Firebase security rules no cubrían nodo `viaje/`
**Fecha:** Mayo 2026  
**Causa:** Las reglas de Firebase no tenían el nodo `viaje/` definido explícitamente. Firebase denegaba escrituras silenciosamente con error genérico.  
**Solución:** Agregar regla explícita para `viaje/` en Firebase Console.  
**Aprendizaje:** Firebase requiere cobertura explícita de cada nuevo nodo — no hay herencia automática de reglas.  
**Estado:** ✅ Resuelto

---

### 🐛 Bug #8 — iOS Safari ignora `inputmode="decimal"` en `type="number"`
**Fecha:** Mayo 2026  
**Causa:** iOS Safari no muestra teclado decimal en inputs `type="number"` con `inputmode="decimal"`. Impedía registrar montos con decimales (ej: €12.50) en iPhone durante el viaje.  
**Solución temporal:** Redondear montos durante el viaje.  
**Solución definitiva pendiente:** Cambiar a `type="text"` `inputmode="decimal"` en todos los inputs de monto.  
**Estado:** 🔲 Pendiente

---

### 🐛 Bug #9 — Pestaña Hoy no carga las categorías al abrir por primera vez
**Fecha:** Junio 2026  
**Causa:** La cola offline introdujo una condición de carrera: al abrir la pestaña Hoy, `subDaily()` llamaba `populateCatSel()` inmediatamente, pero `D.categories` todavía estaba vacío porque Firebase no había respondido. El select quedaba sin opciones. Al navegar a otro día o volver al tab, `D` ya estaba listo y las categorías aparecían.  
**Solución:** Dos cambios coordinados:
1. En `subDaily()`: solo llamar `populateCatSel()` si `D.categories` ya tiene datos — evita poblar un select vacío.
2. En `renderAll()`: llamar `populateCatSel()` al final si `curTab === 'd'` — cuando Firebase entrega los datos y renderiza, el select se repuebla automáticamente.

**Estado:** ✅ Resuelto

---

### Tabla resumen de issues

| Fecha | Problema | Solución | Estado |
|-------|----------|----------|--------|
| Abr 23 | Firebase no carga (module scope) | CDN compat en `<head>` | ✅ |
| Abr 24 | Pantalla config visible siempre | `style="display:none"` inline | ✅ |
| Abr 29 | Gastos estacionales en mes incorrecto | Filtrar `months[]` al cargar | ✅ |
| May 2-3 | Loop infinito pestaña Hoy | Hormiga solo en memoria | ✅ |
| May 6 | Ítems repetidos en renderAll | `planItems(cat)` como función canónica | ✅ |
| May 6-7 | Encoding corrupto tildes/eñes | `canonicalLabel()` + scripts limpieza | ✅ |
| May 9 | Apellidos en URL Firebase | Nuevo proyecto organiza2 | ✅ |
| May 2026 | Firebase rules no cubren `viaje/` | Regla explícita en Console | ✅ |
| May 2026 | iOS decimales en `type="number"` | Pendiente: `type="text"` | 🔲 |
| May 2026 | `manifest.json` tiene apellidos | Pendiente: actualizar name/description | 🔲 |
| Jun 2026 | Pestaña Hoy sin categorías al abrir | Guard en `subDaily()` + `populateCatSel()` en `renderAll()` | ✅ |

---

## 4. Decisiones Arquitecturales Clave

### DA-1: Gastos hormiga fuera de D
Los gastos hormiga del día se guardan en `daily/[uid]/[año]/[mes]/[día]` y **NUNCA** se escriben en el nodo del mes (`pl/[uid]/[año]/[mes]`). Esto evita el loop infinito de Firebase. El total hormiga por categoría se calcula en memoria (`dailyTotals{}`) y `recalc()` lo suma al mostrar.

### DA-2: `planItems()` como función canónica
La función `planItems(cat)` es la **única forma correcta** de obtener los ítems reales de una categoría. Filtra los ítems `auto` y garantiza que los índices `ri` sean correctos. Nunca usar `cat.items` directamente.

### DA-3: `canonicalLabel()` al leer, no al limpiar
La corrección de encoding se aplica al leer de Firebase, no solo al limpiar manualmente. Se aplica en `subMonth()`, `loadFixed()` y `cleanDuplicates()`.

### DA-4: Firebase como única fuente de verdad
No hay estado local en localStorage más allá del nombre del usuario y la cola offline. Todos los datos financieros viven en Firebase.

### DA-5: Un solo archivo HTML
Toda la app vive en un solo `index.html` con CSS y JS inline. Sin build steps, sin frameworks, sin dependencias npm. Deploy trivial: `git push`. La separación de código está planificada en Fase 5, **DESPUÉS** del Login Google.

### DA-6: Separación identidad personal vs producto
El repositorio se transfirió de `jaimeand78` a la organización `organiza2`. Protege la identidad personal, facilita colaboradores futuros.

### DA-7: Cola offline con localStorage
Gastos se guardan en localStorage cuando `navigator.onLine` es `false`. Se sincronizan automáticamente al detectar el evento `'online'`. UI optimista: el gasto aparece en pantalla antes de confirmar Firebase.

### DA-8: Login primero, separar código después ⭐
Decisión tomada mayo 2026: **NO separar el código en módulos JS** hasta tener el Login Google implementado. El Login reemplaza `const FBK = 'Anny1130'` en ~30 funciones. Separar primero genera trabajo doble.

---

## 5. Deuda Técnica Consolidada

### 🔴 Prioridad Alta
- Login Google (Firebase Auth)
- Hogar compartido con código de invitación
- Onboarding con plantillas por perfil familiar
- Fix iOS decimal: `type="text"` `inputmode="decimal"`
- Reglas Firebase avanzadas (por uid autenticado)
- Migración datos `Anny1130` → hogar real
- Arreglar `manifest.json` (quitar apellidos)

### 🟡 Prioridad Media
- Exportar mes a PDF
- Exportar año completo a Excel
- Landing page organiza2.app
- Activar plan Blaze + backups Firebase
- Aviso retención en la fuente en Nómina
- Vacaciones 4.17% en cálculo empleadas
- Revisar tabla DIAN 2026 para retención
- Separar código JS (después del Login)

### 🟢 Prioridad Baja
- Modo oscuro
- Metas de ahorro con barra de progreso
- Proyección de fin de año
- Comparar mes actual vs mismo mes año anterior
- Notas por mes
- Swipe para borrar gasto hormiga en móvil

---

## 6. Estructura de Datos en Firebase

```
pl/[uid]/[año]/[mes]/
├── income[]
│   └── { label, value, fixed, by }
├── categories[]
│   └── { name, items[] }
│       └── { label, value, budget, fixed, by, months[] }
├── nomina{}
│   ├── jaime: { bruto, ret, afc, med, neto, prima, bonoVac, bonoRes, primaExtra }
│   └── anny: { ... }
└── empleadas{}
    ├── empleada: { salario, ic, ces, primaJ, primaD }
    └── ninera: { ... }

daily/[uid]/[año]/[mes MM]/[día DD]/[pushId]/
└── { amount, category, note, who, ts }

viaje/[uid]/[año]/[mes MM]/[día DD]/[pushId]/
└── { amount, currency, category, note, who, ts }

hist/[uid]/[pushId]/
└── { user, type, description, amount, category, ts }
```

> **uid actual:** `Anny1130` — hardcodeado temporal. Se reemplaza por uid real de Firebase Auth en Fase 1.

---

## 7. Historial de Commits

| Hash | Fecha | Descripción |
|------|-------|-------------|
| be4e223 | 9 mayo 2026 | test: verificar conexión con GitHub |
| da9d89d | 9 mayo 2026 | config: migrar a Firebase organiza2, quitar apellidos |
| 856cb50 | 10 mayo 2026 | fix: pestaña Hoy muestra solo categorías del presupuesto |
| [pendiente] | 10 mayo 2026 | feat: agregar pestaña Análisis con Semáforo, Tendencia y Hormiga |
| [pendiente] | Mayo 2026 | feat: agregar módulo Viaje con cola offline |
| [pendiente] | Mayo 2026 | feat: implementar offline queue para gastos diarios y viaje |
| [pendiente] | Jun 2026 | fix: pestaña Hoy sin categorías por condición de carrera con offline queue |

---

## 8. Roadmap Estratégico — v1.2

| Fase | Módulo | Hitos clave | Est. | Estado |
|------|--------|-------------|------|--------|
| 1 | 🔐 Login Google + Hogar | Firebase Auth · Pantalla login · Código de hogar · Migración Anny1130 · Reglas Firebase | 2-3 sem. | 🔄 Siguiente |
| 2 | 💰 Finanzas v2 | PDF/Excel · Fix iOS · UX móvil · Manifest fix | 1-2 sem. | 🔲 |
| 3 | 🧪 Pruebas familias | 5-10 familias · Feedback real · Validar uso | 3-4 sem. | 🔲 |
| 4 | 📅 Eventos MVP | Tipos evento · Presupuesto · Motor Viaje refactorizado · Checklist · Conexión Finanzas | 3-4 sem. | 🔲 |
| 5 | 🏗️ Separar código | JS separado · CSS separado · Sin frameworks | 1 sem. | 🔲 |
| 6 | 🌐 Infraestructura | organiza2.app · Landing · Branding | 1 sem. | 🔲 |
| 7 | 🎒 Agenda Escolar | Circulares · Recordatorios · Coordinación pareja | 4-6 sem. | 🔲 |
| 8 | 🥪 Lonchera | Perfil hijo · Menú semanal · Lista mercado | 4-6 sem. | 🔲 |
| 9 | 🏠 Dashboard Familiar | Vista unificada · Alertas · Pendientes | 3-4 sem. | 🔲 |
| 10 | 💳 Monetización | Gratuito vs premium · PSE/Nequi · Onboarding | 4-6 sem. | 🔲 |

---

## 9. Aprendizajes Clave

> **El bug más difícil fue arquitectural, no de código.**  
> El loop infinito de Firebase no se resolvía con parches — requería cambiar cómo fluían los datos. Cuando un bug reaparece después de múltiples fixes, la solución es rediseñar el flujo, no agregar más condiciones.

> **Firebase guarda lo que le das, exactamente como lo das.**  
> El encoding corrupto ocurrió porque en algún momento temprano los datos se guardaron con encoding incorrecto. Firebase no normaliza ni valida el texto. La función `canonicalLabel()` es la defensa definitiva.

> **Firebase requiere cobertura explícita de cada nuevo nodo.**  
> Las reglas de seguridad NO tienen herencia automática. Cada nueva ruta de datos necesita su propia regla en Firebase Console. Sin esto, las escrituras se deniegan silenciosamente con errores genéricos.

> **iOS Safari ignora `inputmode="decimal"` en `type="number"`.**  
> La solución correcta para inputs de montos en móvil es `type="text"` con `inputmode="decimal"`. Aplica a todos los campos de monto en la app.

> **El uso real en condiciones extremas valida más que semanas de desarrollo.**  
> El módulo Viaje usado durante el viaje a Europa validó en días lo que habría tomado semanas de pruebas controladas: multiusuario real, offline real, uso diario real, bugs reales.

> **Un solo archivo HTML tiene sus ventajas y sus límites.**  
> Para un MVP es perfecto. Cuando la app crece (1600+ líneas), la falta de separación dificulta el debugging. La separación está planificada en Fase 5, después del Login Google.

> **Separar identidad personal de producto desde el día 1.**  
> Mezclar el repositorio personal con el producto crea deuda de marca. Una organización GitHub dedicada facilita el escalado y la presentación profesional.

---

*Organiza2 — Bitácora Técnica v1.2 | Mayo 2026*
