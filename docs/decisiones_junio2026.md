# Organiza2 — Decisiones de Producto
## Sesión de diseño — Junio 2026

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

**Contexto que originó la sesión:** ejemplos reales de la vida de Jaime/Anny donde la información no llega a tiempo a la pareja:
- Cita pediátrica avisada con 8 días de anticipación → el día llega y hay choque con otro compromiso (nadie se acordó a tiempo)
- Nota en el cuaderno del colegio ("enviar dinero en 2 días para actividad") → un miembro la lee pero no se la comunica al otro → no se envía
- Meta anual tipo "viaje a Europa" → tiene múltiples etapas (pasajes, alojamiento, transporte, presupuesto) que se extienden por meses

**Diagnóstico:** el problema no es falta de calendario (ya existen Gmail, Outlook, calendario compartido). El problema es que la información vive en la cabeza de una sola persona, no hay responsable claro, y el aviso llega el mismo día — no con anticipación.

**Núcleo de valor propuesto:** ambos miembros ven lo mismo, hay un responsable explícito (o "sin asignar" como señal de alerta), y el aviso llega con anticipación configurable — no el día del evento.

**Diferenciador frente a herramientas existentes (TimeTree, Cozi, FamilyWall, etc.):**
- Esas apps son calendarios familiares aislados — no están conectadas al hábito diario que la pareja ya construye en Organiza2 (registro de gastos en Tab Hoy)
- La conexión Planeador ↔ Finanzas (compromisos que generan gastos, metas de ahorro con etapas) es algo que las apps de calendario familiar no ofrecen — ese es el ángulo defendible

**Modelo conceptual propuesto (dos tipos, mismo objeto base):**

1. **Compromiso** — unidad base: cita, tarea, pago con plazo
   - Campos: título, tipo (evento/tarea/recordatorio), fecha, responsable (uid | "ambos" | sin asignar), recurrente (bool/frecuencia), `gastoAsociado` opcional (categoría + monto), estado (pendiente/hecho)
   - Un Compromiso con `gastoAsociado` sugiere registrar el gasto en Tab Hoy al marcarse como hecho — no escribe directo en `daily/` (respeta DA-1)

2. **Meta/Proyecto** — agrupador de Compromisos con una meta de ahorro asociada (ej. viaje a Europa: pasajes, alojamiento, transporte como Compromisos con `metaId` común + meta de ahorro continua conectada a categoría Ahorro de Presupuesto Base)

**Modelo de datos tentativo:**
```
hogares/[codigoHogar]/planeador/
   compromisos/[id]/
       titulo
       tipo: "evento" | "tarea" | "recordatorio"
       fecha
       responsable: uid | "ambos" | null
       recurrente: bool / frecuencia
       gastoAsociado: { categoria, monto } | null
       metaId: string | null
       estado: "pendiente" | "hecho"
   metas/[id]/
       nombre
       ahorroObjetivo
       fechaObjetivo
```

**Pendiente para revisión futura:**
- Validar con el piloto si las familias ya usan algún calendario/app compartido y si les funciona
- Diseño de pantalla principal del Planeador (no bocetado aún)
- Mecanismo de "anticipación configurable" — cuántos días antes, por tipo de compromiso

---

*Documento generado en sesión de diseño — Junio 2026*
*Próximo paso: implementación del onboarding Etapa E*
