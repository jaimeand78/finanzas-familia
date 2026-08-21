# Organiza2 — Decisiones de Producto
## Sesión de diseño — Junio 2026

> ⚠️ **Documento parcialmente histórico.** Algunas secciones reflejan decisiones tomadas en Junio 2026 que luego evolucionaron (ej: número de categorías, pantallas de onboarding). Para el estado vigente del producto consultar `contexto_maestro.md` y `bitacora.md` Fases 15 en adelante.

---

## 1. Visión y posicionamiento

**Decisión:** Organiza2 NO es una app financiera. Es una plataforma de decisiones familiares.

- Lema: *"Organizamos tu vida en pareja"*
- El valor no está en presupuestar en detalle sino en **entender fácilmente** lo que ya pasó
- El lenguaje de la app es conversacional, nunca contable
- Objetivo: reducir la carga mental del hogar y facilitar la comunicación honesta entre la pareja

---

## 2. Arquitectura de categorías e ítems

### Principio fundamental
**Dos niveles de detalle, no uno:**

| Nivel | Dónde | Para qué |
|-------|-------|---------| 
| **Agrupado** | Presupuesto base | Planear — simple, pocas líneas |
| **Detallado** | Registro diario | Entender — ítems específicos para tomar decisiones |

El usuario presupuesta "Salud y Belleza: $600.000". Cuando registra el gasto diario elige "Peluquería" o "Droguería". El análisis muestra el desglose real.

---

## 3. Categorías v2.0 — 10 categorías oficiales

| # | Categoría | Onboarding | Config | Condición |
|---|-----------|-----------|--------|-----------|
| 1 | 🏠 Vivienda | ✓ Siempre | ✓ | — |
| 2 | 🍽️ Alimentación | ✓ Siempre | ✓ | — |
| 3 | 🚗 Transporte | ✓ Siempre | ✓ | — |
| 4 | 🎬 Entretenimiento | ✓ Siempre | ✓ | — |
| 5 | ❤️ Salud y Belleza | ✓ Siempre | ✓ | — |
| 6 | 💰 Ahorro | ✓ Siempre | ✓ | — |
| 7 | 📚 Educación | Solo Config | ✓ | Si hay hijos en perfil |
| 8 | 🛡️ Seguros e Impuestos | Solo Config | ✓ | Si hay vehículo o vivienda propia |
| 9 | 👕 Vestuario | Solo Config | ✓ | Siempre disponible, no en onboarding |
| 10 | 🎁 Regalos y Celebraciones | Solo Config | ✓ | Siempre disponible, no en onboarding |

---

## 4. Ítems del registro diario — catálogo completo

### 🏠 Vivienda (8 ítems)
| Ítem | Tipo |
|------|------|
| Arriendo / Hipoteca | Fijo |
| Administración | Fijo |
| Agua y Energía | Fijo |
| Gas | Fijo |
| Internet | Fijo |
| Telefonía | Fijo |
| Servicio doméstico | Fijo |
| Mantenimiento hogar | Variable |

### 🍽️ Alimentación (4 ítems)
| Ítem | Tipo |
|------|------|
| Frutas y verduras | Variable |
| Aseo y víveres | Variable |
| Loncheras | Variable |
| Otros* | Variable |

### 🚗 Transporte (7 ítems)
| Ítem | Tipo |
|------|------|
| Cuota crédito / leasing | Fijo |
| Combustible | Variable |
| Transporte público | Variable |
| Peajes | Variable |
| Parqueadero | Variable |
| Mantenimiento vehículo | Variable |
| Otros* | Variable |

> **Nota:** Cuota crédito/leasing va en Transporte (no Vivienda) porque es un gasto asociado a una decisión reversible — si la familia decide entregar el vehículo, desaparece.

### 🎬 Entretenimiento (7 ítems)
| Ítem | Tipo |
|------|------|
| Streaming | Fijo |
| Restaurantes | Variable |
| Cine | Variable |
| Salidas | Variable |
| Viajes | Variable |
| Vacaciones | Variable |
| Otros* | Variable |

> **Nota:** Restaurantes pasa de Alimentación a Entretenimiento. Racional: "¿salimos a comer o cocinamos?" es una decisión de entretenimiento, no de mercado.

### 👕 Vestuario (4 ítems)
| Ítem | Tipo |
|------|------|
| Ropa | Variable |
| Zapatos | Variable |
| Uniforme | Variable |
| Otros* | Variable |

### ❤️ Salud y Belleza (8 ítems)
| Ítem | Tipo | Presupuesto agrupado en |
|------|------|------------------------|
| Medicina prepagada | Fijo | Salud |
| Gimnasio | Fijo | Salud |
| Droguería | Variable | Salud |
| Cita médica | Variable | Salud |
| Cita pediátrica | Variable | Salud |
| Peluquería | Variable | Belleza |
| Servicios estéticos | Variable | Belleza |
| Otros* | Variable | — |

> **Nota:** "Servicios estéticos" agrupa manicure, pedicure, depilación, barbería. El campo **nota** del registro diario especifica el detalle. Es universal — aplica para hombres y mujeres.

### 📚 Educación (6 ítems)
| Ítem | Tipo |
|------|------|
| Universidad | Fijo |
| Colegio | Fijo |
| Jardín | Fijo |
| Matrícula | Variable (frecuencia configurable: anual/semestral) |
| Actividades extracurriculares | Variable |
| Otros* | Variable |

> **Nota:** Matrícula puede ser anual, semestral o mensual. Se configura la frecuencia en Config usando `calcPresupuestoBase()`. En el onboarding se ingresa un estimado mensual.

### 🛡️ Seguros e Impuestos (6 ítems)
| Ítem | Tipo | Frecuencia |
|------|------|------------|
| Seguro de vida | Fijo | Anual |
| Seguro de hogar | Fijo | Anual |
| Seguro vehículo | Fijo | Anual |
| SOAT | Fijo | Anual (mes agosto) |
| Impuestos vehículo | Fijo | Anual (mes abril) |
| Impuesto predial | Fijo | Anual (mes marzo) |

> **Nota migración Anny1130:** "Seguro de vida / hogar" (ítem único v1) → todo el valor migra a "Seguro de hogar". "Seguro de vida" queda en cero para configurar manualmente.

### 🎁 Regalos y Celebraciones (3 ítems)
| Ítem | Tipo |
|------|------|
| Regalos | Variable |
| Celebraciones | Variable |
| Otros* | Variable |

### 💰 Ahorro (3 ítems)
| Ítem | Tipo |
|------|------|
| Ahorro programado | Fijo |
| Fondo emergencia | Fijo |
| Otros* | Variable |

---

## 5. Regla sobre el ítem "Otros"

**Dos comportamientos distintos:**

- **"Otros" en registro diario** → el campo **nota se vuelve obligatorio**. El dato queda como *"Otros — suscripción revista"*, no como un número huérfano sin contexto.
- **En Config (categorías)** → en lugar de "Otros" hay un botón **"+ Agregar ítem"**. El ítem nuevo queda guardado en el hogar y aparece en futuras sesiones. El catálogo crece con el uso real de cada familia (DA-9 — perfil progresivo).

---

## 6. Presupuesto base — estructura agrupada

El presupuesto base usa ítems **agrupados**, no el detalle del registro diario:

| Categoría | Ítem en presupuesto | Ítems diarios que lo alimentan |
|-----------|--------------------|---------------------------------|
| Alimentación | Mercado | Frutas y verduras + Aseo y víveres |
| Salud y Belleza | Salud | Droguería + Cita médica + Cita pediátrica |
| Salud y Belleza | Belleza | Peluquería + Servicios estéticos |
| Vivienda | Servicios del hogar | Agua y Energía + Gas + Internet |

---

## 7. Onboarding del Presupuesto Base

### Flujo definitivo — 5 pantallas + resumen

| Pantalla | Contenido | Saltable |
|----------|-----------|---------| 
| 1. ¿Cómo es su hogar? | Soltero / Pareja / Familia / Mixto | No — define personalización |
| 2. ¿Cuál es su mayor reto? | 4 opciones de dolor principal | Sí — "Prefiero no decir" |
| 3. ¿Con cuánto cuentan? | Ingreso fijo + Ingreso adicional opcional | Sí |
| 4. Lo que sí o sí pagan | Arriendo · Servicios del hogar · Transporte | Sí |
| 5. Lo que varía | Mercado · Entretenimiento · Ahorro | Sí |
| Resumen | Ingresos − Gastos = Disponible + insight | — |

**Reglas del onboarding:**
- Máximo 3 campos por pantalla
- "Saltar por ahora" disponible en pantallas 3, 4 y 5
- Pantallas 1 y 2 requieren selección (personalizan todo lo que sigue)
- Lenguaje conversacional en todo el flujo — nunca contable
- El detalle (Vestuario, Regalos, Seguros, Educación, frecuencias) va en Config

**Pantallas condicionales dentro del onboarding:**
- Cuota crédito/leasing → aparece en pantalla 4 solo si perfil tiene vehículo financiado
- Educación → no aparece en onboarding, solo en Config si hay hijos

---

## 8. Trabajo en equipo — modelo de colaboración

**Decisión:** el onboarding lo llena quien crea el hogar. No hay dos onboardings paralelos.

**Flujo cuando se une el miembro 2:**
1. Al final del onboarding aparece: *"¿Quieres invitar a tu pareja para que revise esto juntos?"* → `[Enviar invitación]` / `[Lo hago después]`
2. Cuando el miembro 2 entra por primera vez, ve el presupuesto configurado con un banner: *"[Nombre] configuró el presupuesto base. ¿Estás de acuerdo con estos números?"* → `[Se ve bien]` / `[Tengo un ajuste]`
3. Si elige "Tengo un ajuste" → campo de comentario simple por ítem (una línea, visible para ambos)

**Para después (post-piloto):** historial de cambios, notificaciones push, votación por ítem.

---

## 9. Migración Anny1130 → v2.0

**Regla:** la migración es un script de uso único (`migracion-anny1130.html`), separado del código de la app. No forma parte del deploy.

**Año a migrar:** solo 2026. No hay datos antes ni después.

**Mapa de migración:**

| Origen v1 | Destino v2 | Lógica |
|-----------|-----------|--------|
| Salario Empleada + Salario Niñera | Vivienda / Servicio doméstico | Suma de salarios base |
| Prestaciones (cesantías, prima, intereses) | Vivienda / Servicio doméstico | Se suman en el mes que aplica — automático |
| Frutas y verduras + Aseo y víveres | Alimentación / Mercado | Suma |
| Lonchera | Alimentación / Loncheras | Directo |
| Restaurantes | Entretenimiento / Restaurantes | Cambio de categoría |
| Seguro de vida / hogar (único) | Seguros / Seguro de hogar | Todo el valor al nuevo ítem |
| Peluquería + Manicure + Depilación | Salud y Belleza / Belleza | Suma |
| Droguería + Citas médicas + Citas pediátricas | Salud y Belleza / Salud | Suma |
| Ahorro mensual | Ahorro / Ahorro programado | Directo |

---

## 10. Decisiones técnicas derivadas

| Decisión | Detalle |
|----------|---------| 
| `calcPresupuestoBase(item, mes)` | Función canónica — única que calcula provisión mensual por frecuencia |
| `defD()` | Ingresos dinámicos desde `perfil.miembros` — nunca hardcodeados con nombres |
| Ítems con `frecuencia` | `mensual` (default) · `bimestral` · `trimestral` · `semestral` · `anual` |
| Ítems estacionales | Campo `months[]` con índices de mes (0=enero) |
| Medicina prepagada | Ítem fijo mensual en Salud y Belleza — igual que Gimnasio |
| Matrículas educación | `frecuencia` configurable en Config — onboarding solo pide estimado mensual |
| Cuota crédito vehículo | En Transporte (no Vivienda) — gasto reversible |

---

## 11. Planeador Familiar — Ideas conceptuales (sin implementar)

**Estado:** Exploración de diseño durante el piloto v2.3. Ningún código pendiente — solo para revisar más adelante en v3.0. No viola la regla de validación porque no hay implementación.

---

### Casos reales que originaron el modelo

Todos son situaciones reales del hogar Ibarra Masso (Jaime + Anny):

1. **Cita pediátrica** — Anny avisa con 8 días de anticipación, Jaime se olvida, el día llega y tiene conflicto de trabajo. Nadie coordinó con tiempo.
2. **Pago actividad del colegio** — Jaime lee la nota en el cuaderno de María José, no le avisa a Anny, llega el día y no se envió el dinero porque ninguno se acordó.
3. **Viaje a Europa** — meta anual con múltiples etapas (pasajes, alojamiento, transporte, presupuesto acumulado). No es un compromiso puntual sino un proyecto con sub-pasos y ahorro asociado.
4. **Mensaje del jardín por WhatsApp** — el jardín avisa lonchera temática o vestimenta especial, uno lo ve en WhatsApp pero no hace nada, llega el día y ya pasó. La información ya existe, el problema es que se pierde en el scroll.
5. **Terapia familiar sin pagar** — compromiso con gasto asociado que quedó sin ejecutar 15 días hasta que llamaron a cobrar. Nadie lo registró en Finanzas, nadie tomó ownership.
6. **Servicios públicos** — recurrentes y predecibles → quedan en Finanzas, NO en el Planeador. Define la frontera entre módulos.

---

### Diagnóstico

El problema no es falta de calendario — Jaime y Anny ya tienen Gmail, Outlook y calendario compartido. El problema es:
- La información vive en la cabeza de **una sola persona**
- No hay un **responsable claro** (o nadie lo asumió)
- El aviso llega **el mismo día**, cuando ya no hay margen para reaccionar
- Los gastos comprometidos **no tienen seguimiento** hasta que alguien llama a cobrar

---

### Filosofía de diseño

> **No hay responsable individual — el hogar es el responsable.**

La visibilidad compartida ES la responsabilidad compartida. Ambos miembros ven lo mismo; cualquiera que llegue primero lo resuelve. Esto es radicalmente distinto a apps de tareas (Todoist, Asana) que asignan a una persona — y conecta directamente con el lema *"Organizamos tu vida en pareja"*.

---

### Diferenciador frente a herramientas existentes (TimeTree, Cozi, FamilyWall, etc.)

- Esas apps son calendarios familiares **aislados** — no conectados al hábito diario que la pareja ya construye en Organiza2
- La conexión Planeador ↔ Finanzas (compromisos que generan gastos, metas con ahorro acumulado) es algo que las apps de calendario familiar no ofrecen — ese es el ángulo defendible

---

### Modelo conceptual: 3 tipos con naturaleza distinta

| Tipo | Ejemplos reales | Fecha | Monto | ¿Se vence? |
|------|----------------|-------|-------|------------|
| 🔔 **Recordatorio** | Lonchera jardín, pago actividad colegio | Corta (hoy/mañana/en 2 días) | No | No aplica |
| 📅 **Compromiso** | Cita pediatra, terapia familiar | Específica | Opcional | Sí — sigue visible hasta cerrarse |
| 🎯 **Meta** | Viaje a Europa | Horizonte (meses) | Sí (ahorro acumulado) | No — tiene progreso |

**Comportamiento clave del Compromiso vencido:** si llega la fecha y no se marcó como hecho, no desaparece — se vuelve más visible ("⚠️ venció hace X días") hasta que alguien lo resuelva.

**Frontera con Finanzas:** lo recurrente y predecible (servicios públicos, arriendo, mercado) queda en Finanzas. El Planeador es solo para lo puntual e impredecible.

---

### Flujo de entrada rápida (diseño crítico)

El momento de creación ocurre cuando el usuario está en WhatsApp o leyendo el cuaderno del colegio — tiene 10 segundos de atención. El flujo mínimo es:

```
1. Título (texto libre, teclado ya abierto)
2. ¿Para cuándo? → un toque:
   [ Hoy ]  [ Mañana ]  [ En 2 días ]  [ En 1 semana ]  [ Elegir fecha ]
3. Guardar
```

El picker de calendario completo solo aparece si el usuario toca "Elegir fecha". El 90% de los casos del jardín se resuelven con "Mañana" o "En 2 días".

---

### Flujo de cierre con gasto asociado (Compromiso)

```
Usuario abre Organiza2
→ ve "⚠️ Pagar terapia familiar — venció hace 15 días"
→ toca → "¿Ya lo pagaste?" → Sí
→ ¿Registrar el gasto en Tab Hoy? → Sí, $X, categoría Salud
→ Compromiso cerrado + gasto registrado en daily/
```

El Planeador **nunca escribe directamente en `daily/`** — sugiere el registro al usuario (respeta DA-1).

---

### Modelo de datos tentativo

```
hogares/[codigoHogar]/planeador/
   items/[id]/
       titulo
       tipo: "recordatorio" | "compromiso" | "meta"
       fecha                          // timestamp
       gastoAsociado: { categoria, monto } | null
       metaId: string | null          // solo para sub-compromisos de una Meta
       estado: "pendiente" | "hecho" | "vencido"
       creadoPor: uid
       creadoEn: timestamp
   metas/[id]/
       nombre
       ahorroObjetivo
       fechaObjetivo
```

---

### Diseño de interfaz (mockups aprobados)

**Integración en la navegación existente — sin tabs nuevos:**

Los 4 tabs principales no cambian. El Planeador se integra como sub-tabs dentro de tabs existentes:

```
Tab Hoy          →  [ 💸 Gastos ]  [ 📋 Pendientes ]
Tab Cómo vamos   →  [ 💰 Finanzas ]  [ 📋 Pendientes ]
```

- Tab Hoy / Gastos → igual que hoy, sin cambios
- Tab Hoy / Pendientes → formulario de creación rápida (sin lista)
- Cómo vamos / Finanzas → igual que hoy, sin cambios
- Cómo vamos / Pendientes → lista del estado del hogar (vencidos + próximos)

Este patrón ya existe en Análisis (sub-tabs Semáforo / Tendencia / Hormiga / ¿Quién pagó?) — el usuario lo conoce.

**Formulario de creación — selector de tipo primero:**

El formulario abre con 3 opciones de tipo. Según la selección, los campos se adaptan:

| Tipo | Color | Campos |
|------|-------|--------|
| 🔔 Recordatorio | Verde (#1D9E75) | Título + chips de fecha rápida |
| 📅 Compromiso | Azul (#378ADD) | Título + chips de fecha + gasto opcional + categoría opcional |
| 🎯 Meta | Ámbar (#BA7517) | Nombre + monto objetivo + fecha horizonte |

**Chips de fecha rápida** (aplica a Recordatorio y Compromiso):
```
[ Hoy ]  [ Mañana ]  [ En 2 días ]  [ En 1 semana ]  [ Elegir fecha ]
```
El picker de calendario completo solo aparece si el usuario toca "Elegir fecha".

**Meta:** los sub-pasos NO se crean en el formulario inicial — se agregan después de guardar la meta. El formulario de Meta es intencionalmente simple: nombre + monto + fecha horizonte.

**Vista Cómo vamos / Pendientes — dos secciones:**
- "Vencidos" (badge naranja con conteo) — compromisos que pasaron su fecha sin cerrarse
- "Próximos" (badge verde con conteo) — ordenados por fecha más cercana

---

### Pendiente para revisión futura

- Validar con el piloto si las familias ya usan algún calendario/app compartido y si les funciona
- Mecanismo de alertas: dentro de la app al abrir (sin push notifications para v3.0) vs. notificaciones push (post v3.0)
- Definir cuántos días antes muestra alerta según tipo (Recordatorio: 1 día; Compromiso: 2-3 días; Meta: por etapas)
- Vista detalle de una Meta con sus sub-pasos y progreso de ahorro (no bocetado aún)

---

*Documento generado en sesión de diseño — Junio 2026*
*Próximo paso: implementación del onboarding Etapa E*

---

## 12. Footer presupuesto base — total mes y total año

**Problema identificado (piloto):** El footer de la sección "Presupuesto base" en Config mostraba un único "Total" que sumaba el valor máximo anual de cada ítem, incluyendo ítems de fecha fija (cesantías, SOAT, predial, primas) como si fueran mensuales. El número resultaba inflado e incorrecto.

**Decisión:** Reemplazar el total único por dos líneas:

- **Total mes (ej: jun)** — suma usando `calcPresupuestoBase(item, curM)`, que respeta la frecuencia y el mes de cada ítem. Solo cuenta lo que realmente toca pagar ese mes.
- **Total año** — suma `calcPresupuestoBase(item, m)` para los 12 meses, reflejando el presupuesto anual real.

**Etiquetas:** "Total mes" y "Total año" — sin repetir la palabra "Presupuesto" que ya aparece en el encabezado de la sección.

**Visual:** Total mes en verde (`--color-success`) como dato principal; total año en gris como referencia.

**Archivos modificados:** `presupuesto.js` (cálculo), `presupuesto.css` (estilos footer).

**No se agregan flechas de navegación de mes a Config** — Config es configuración, no consulta histórica (DA-16). El mes actual se indica en la etiqueta del total.

---

## 13. Regla de orden de commits con sw.js

**Problema descubierto (Fase 44):** Al subir el bump de `sw.js` antes que los archivos corregidos, el service worker instalaba el cache con la versión bugueada. Los commits posteriores no tenían efecto porque el SW servía desde cache.

**Regla establecida:** El commit de `sw.js` siempre debe ser el **último**, después de confirmar que todos los archivos modificados ya están en GitHub Pages. El orden correcto es:

1. `git add [archivos modificados]` → `git commit` → `git push`
2. Esperar 1-2 minutos para propagación en GitHub Pages
3. `git add sw.js` → `git commit -m "fix: bump cache vX-Y"` → `git push`

---

## 14. calcPresupuestoBase — months tiene prioridad sobre frecuencia

**Problema:** Los ítems de fecha fija (SOAT, predial, cesantías, primas) tienen `frecuencia: undefined` en Firebase. `calcPresupuestoBase` chequeaba `frecuencia` primero y al ser `undefined` asumía `'mensual'`, sumando esos ítems todos los meses.

**Decisión:** `months` siempre tiene prioridad sobre `frecuencia`. Si un ítem tiene `months`, es de fecha fija — independientemente de lo que diga `frecuencia`.

**Alcance del fix:** `finanzas.js` (función), `recalc()`, `renderResumen()`, `analisis.js` (`_renderSemaforoConData`), `presupuesto.js` (footer totales).

**Presupuesto base vive en un solo nodo:** El presupuesto no se propaga a los 12 meses en Firebase — vive en el mes donde fue configurado. Los otros meses lo proyectan en memoria con `calcPresupuestoBase`. `loadFixed()` busca hacia atrás hasta 12 meses para encontrar el nodo con budgets.

---

## 15. Educación depende de hijos, no del tipo de hogar

**Fecha:** Agosto 2026 · **Origen:** feedback real del piloto (Fase 47) · **Estado:** ✅ Implementado

**Problema.** P1 pregunta *"¿Cómo es tu hogar?"* pero el subtexto de `soltero` — *"Manejo mis finanzas"* — describe **quién opera la app**, no **quién vive en el hogar**. Un padre casado que lleva el control financiero él solo elige esa opción de buena fe. Y `presupuesto.js` forzaba `tieneEducacion = false` para todo tipo distinto de `familia`, de modo que la categoría 📚 Educación desaparecía de P4, P5 y del tab Hoy (DA-7). Ese usuario no podía registrar el colegio de su hija — probablemente su mayor gasto del año.

**Opciones evaluadas:**

| Opción | Descartada porque |
|--------|-------------------|
| Reescribir P1 con 4 opciones (añadir monoparental) | Cambia una pantalla estable y en producción; multiplica casillas sin resolver la raíz. **Mockup rechazado por el product owner.** |
| Mostrar Educación siempre en P1.5 | Obliga a inventar un valor por defecto para hogares sin hijos — suposición en lugar de dato. |
| **Preguntar explícitamente solo en el caso ambiguo** | **Elegida.** |

**Decisión.** P1 no se toca. En P1.5, cuando `tipoHogar === 'soltero'`, aparece un bloque con la pregunta **¿Tienes hijos?** (Sí / No) y el botón *Continuar* queda deshabilitado hasta responder. El toggle de Educación se muestra si el hogar es `familia` **o** es `soltero` con hijos.

`pareja` y `familia` no reciben la pregunta: sus subtextos en P1 (*"Sin hijos por ahora"* y *"Con hijos"*) ya la respondieron. **`soltero` es el único tipo ambiguo, y por eso el único que se pregunta.**

**Persistencia.** `tieneHijos` **no** se guarda en Firebase. En el flujo `_soloFlags` se infiere de `perfil.tieneEducacion === true`. Evita un campo nuevo y una DA de esquema. Costo aceptado: quien tenga hijos pero haya apagado Educación a mano verá la pregunta en blanco al reconfigurar.

**Regresión verificada — los tres casos existentes dan resultado idéntico al anterior:**

| Caso | `tieneEducacion` | |
|------|------------------|---|
| Familia | `true` | igual que antes |
| Familia apagando el toggle | `false` | igual que antes |
| Pareja | `false` | igual que antes |
| **Soltero con hijos** | **`true`** | **caso nuevo — el papá** |
| Soltero con hijos, toggle apagado | `false` | nuevo |
| Soltero sin hijos | `false` | igual que antes |

**Fuera de alcance, al backlog post-piloto:**
- El lenguaje sigue en singular para `soltero` aunque conviva con pareja — `_tx()` sigue atado a `tipoHogar`. Cosmético.
- Madre o padre soltero con hijos aún debe elegir entre "Familia" (plural) o "Solo" (singular + responder Sí). Funciona, no es elegante.

---

## 16. Mascotas — aplazada conscientemente

**Fecha:** Agosto 2026 · **Estado:** ⏸️ Backlog

Se evaluó añadir 🐾 Mascotas como categoría. **El caso de producto es sólido:** gasto recurrente, real e invisible (veterinario, alimento, vacunas, guardería, peluquería) — encaja con la tesis de gasto hormiga y es **ortogonal al tipo de hogar**, por lo que sería un `tieneMascotas` limpio en P1.5, más simple que Educación.

Se verificó que **Mascotas no está documentada como nodo reservado** en ningún archivo del repo — no existía tal restricción.

**Por qué se aplaza:**
- Toca tres artefactos simultáneamente (DA-10): `defD()`, `DAILY_ITEMS` y `migrateCategories()`. Es una migración, no una línea.
- No es feedback reportado por un usuario, sino observación interna — por la regla de disciplina de alcance, va al backlog.
- Había dos cambios sin cerrar en la misma sesión; mezclarlos impediría aislar una regresión.

**Argumento a favor de hacerlo pronto (registrado para no perderlo):** incorporarla **antes** de reclutar la fase 2 evita migrar en caliente a familias que apenas están tomando el hábito.

**Pendiente de diseño antes de codificar:** qué ítems y con qué frecuencia — alimento es mensual, vacunas anual, veterinario imprevisto. Eso determina el comportamiento de `calcPresupuestoBase()`.
