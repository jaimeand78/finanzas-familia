# 📋 Organiza2 — Documento de Producto v2.3

> Junio 2026 — Actualizado tras sesión de diseño del Presupuesto Base y Onboarding

---

## 1. Visión del Producto

> *"Organizamos tu vida en pareja."*

Organiza2 es una plataforma de organización familiar para parejas y hogares latinoamericanos.

Nació como una app financiera. Durante el uso real se descubrió algo más importante: el problema no era únicamente financiero. Las familias enfrentan una carga mental diaria relacionada con dinero, hijos, colegio, vehículos, servicio doméstico, eventos, viajes, alimentación, recordatorios y organización del hogar.

**Organiza2 no es una app financiera. Es una plataforma para organizar la vida en pareja y familia. Las finanzas son uno de sus módulos.**

> **Nota sobre el lema:** *"Organizamos tu vida en pareja"* refleja el propósito central del producto — la colaboración, la transparencia compartida y la toma de decisiones conjuntas. Sin embargo, Organiza2 también es válido para usuarios solteros que quieren organizar sus finanzas personales, construir hábitos y prepararse para futuras etapas de vida. El lema describe la experiencia más completa del producto, no una restricción de acceso.

---

## 2. El Problema que Resuelve

Las familias modernas viven una fragmentación constante de información y responsabilidades.

| Problema | Descripción |
|----------|-------------|
| **Carga mental diaria** | Qué pagar, qué comprar, qué cocinar, qué falta, qué hay que recordar. Decisiones repetitivas que agotan. |
| **Gastos invisibles** | Regalos, cuotas escolares, materiales, viajes cortos, salidas imprevistas. Individualmente pequeños — en conjunto impactan enormemente el presupuesto. |
| **Descoordinación en pareja** | Quién lleva al niño, quién compra el regalo, quién paga qué. Todo depende de memoria humana. |
| **Información dispersa** | El colegio manda circulares por WhatsApp, los gastos están en una hoja de cálculo, los recordatorios están en el teléfono de uno solo. Nada está conectado. |

---

## 3. Propuesta de Valor

> Organiza2 no vende control. Vende **claridad, coordinación y paz mental**.

La sensación de: saber cómo va el hogar, no olvidar lo importante, tomar decisiones juntos y sentir que todo está bajo control.

### Diferencial Competitivo

| # | Diferencial | Descripción |
|---|-------------|-------------|
| 1 | **Se adapta a cada hogar** | La app no obliga al usuario a adaptarse al sistema. El sistema se adapta al usuario. Un soltero ve una experiencia diferente a una familia con hijos, vehículos y empleada. |
| 2 | **Diseñado para Latinoamérica** | Cesantías, prima, colegios privados, cuotas extras, PSE, Nequi, empleada doméstica, SOAT. Realidades que apps globales ignoran. |
| 3 | **"Nuestro hogar", no "mi presupuesto"** | Construido para parejas. Transparencia compartida, coordinación real, visión conjunta. |
| 4 | **Todo conectado** | Los eventos originan gastos. El colegio genera recordatorios. La empleada genera prestaciones. Todo fluye hacia las finanzas del hogar. |

---

## 4. Usuario Objetivo

| Perfil | Descripción |
|--------|-------------|
| **Principal** | Parejas entre 28 y 45 años. Ambos trabajan. Tienen 1-3 hijos. Viven en ciudades intermedias o grandes de Colombia o Latinoamérica. Usan smartphone diariamente. Sienten falta de tiempo y organización. |
| **Secundario** | Parejas jóvenes sin hijos que quieren construir una visión financiera compartida desde el inicio de su vida juntos. |
| **Terciario** | Personas solteras que quieren organizar sus finanzas personales, construir hábitos sólidos y prepararse para futuras etapas familiares. Organiza2 les ofrece una experiencia simplificada y escalable. |

---

## 5. Principios Fundamentales

**Simplicidad.** La aplicación debe ser comprensible sin capacitación previa.

**Colaboración.** La información del hogar se construye entre todos sus integrantes.

**Transparencia.** Las parejas deben tener una visión compartida de ingresos, gastos, compromisos y metas.

**Configurar una vez.** La información estructural del hogar se configura una sola vez y se reutiliza en toda la plataforma.

**Registrar diariamente.** El uso cotidiano debe ser rápido y sin fricción.

**Entender fácilmente.** La app debe responder rápidamente: *¿Cómo vamos?*

---

## 6. El Ecosistema Organiza2

```
┌──────────────────────────────────────────────────┐
│              🏠 MODELO DE HOGAR                   │
│  Perfil · Miembros · Vehículos · Hijos            │
│  Personal de apoyo · Ingresos                     │
└────┬──────────────┬──────────────┬───────────────┘
     │              │              │
     ▼              ▼              ▼
💰 Finanzas    📋 Planeador    🍽️ Alimentación
```

El Modelo de Hogar es la fuente de verdad que determina qué ve cada usuario y cómo se comporta cada módulo.

---

## 7. Modelo de Hogar

Organiza2 no debe pedir al usuario configurar categorías complejas. Debe pedirle describir su hogar.

### Onboarding progresivo

La configuración es gradual. El usuario comienza con información mínima y la app sugiere completar el perfil según el uso. El objetivo es reducir fricción inicial y evitar formularios largos.

### Tipos de hogar (orientados a experiencia, no a límites)

| Tipo | Experiencia |
|------|-------------|
| **Soltero** | Finanzas personales. Sin educación, loncheras ni servicio doméstico por defecto. |
| **Pareja** | Vista compartida. Sin sección educativa por defecto. |
| **Familia** | Experiencia completa: educación, hijos, recordatorios escolares, alimentación. |
| **Mixto** | Hogar con familiares, roomies u otros integrantes. |

> El tipo de hogar personaliza pantallas, categorías y recordatorios visibles. **No impone límites de miembros ni restricciones comerciales.**

### Componentes del perfil

**Miembros:** adultos e hijos del hogar. Cada miembro tiene nombre y rol.

**Vehículos:** por cada vehículo se registran nombre, tipo, placa, y fechas de SOAT, seguro e impuesto. La app genera recordatorios automáticamente.

**Hijos:** por cada hijo se registran nombre, fecha de nacimiento, institución educativa y nivel. Habilita categorías educativas y futuras funciones del Planeador.

**Personal de apoyo:** empleada doméstica, niñera, conductor, mensajero. Por cada persona se registran nombre, tipo, fecha de inicio y salario. La app genera prestaciones de referencia y recordatorios asociados.

**Ingresos:** múltiples fuentes generadas dinámicamente desde `perfil.miembros`. Los labels de ingresos nunca están hardcodeados en el código — reflejan los nombres reales del hogar.

**Mascotas _(extensión futura — no implementar en v2.0)_:** nodo `perfil/mascotas/` reservado.

**Metas _(extensión futura — no implementar en v2.0)_:** nodo `perfil/metas/` reservado.

### Pantallas dinámicas

| Configuración | Se habilita automáticamente |
|---------------|----------------------------|
| Tipo: Familia con hijos | Educación · Actividades extracurriculares · Alimentación |
| Vehículos registrados | SOAT · Seguro · Impuestos · Recordatorios · Cuota crédito/leasing |
| Personal de apoyo | Servicio doméstico · Prestaciones · Recordatorios |
| Pareja | Vista compartida · Coordinación · Transparencia financiera |

---

## 8. Módulos en Detalle

### 8.1 💰 Finanzas — v2.0

**Objetivo:** responder tres preguntas.
1. ¿Cuánto dinero entra?
2. ¿En qué se va?
3. ¿Cómo vamos?

**Estructura de vistas:**

| Vista | Contenido |
|-------|-----------|
| **Hoy** | Registro diario de gastos e ingresos. |
| **Resumen** | Dashboard principal: ingresos, gastos, disponible, alertas, presupuesto vs realidad. |
| **Análisis** | Tendencias, comparaciones históricas, patrones. La métrica "gasto hormiga" vive aquí. |
| **Configuración** | Presupuesto Base, ingresos, vehículos, personal de apoyo, categorías, perfil del hogar. |

---

## 8.1.1 🧱 Presupuesto Base — El corazón financiero de Organiza2

### Dos niveles de detalle — principio fundamental

> **El Presupuesto Base usa ítems agrupados para planear. El registro diario usa ítems detallados para entender.**

Este principio resuelve la tensión entre simplicidad en el onboarding y utilidad en el análisis:

| Nivel | Dónde | Para qué |
|-------|-------|---------|
| **Agrupado** | Presupuesto Base | Planear — simple, pocas líneas, sin fricción |
| **Detallado** | Registro diario | Entender — ítems específicos para tomar decisiones |

**Ejemplo:** El hogar presupuesta "Salud y Belleza: $600.000". Al registrar el gasto diario elige "Peluquería" o "Droguería". El análisis al final del mes muestra el desglose real y permite responder *"¿en qué se fue Salud este mes?"*

---

### Categorías oficiales v2.0 — 10 categorías

| # | Categoría | Aparece en onboarding | Condición |
|---|-----------|----------------------|-----------|
| 1 | 🏠 Vivienda | ✓ Siempre | — |
| 2 | 🍽️ Alimentación | ✓ Siempre | — |
| 3 | 🚗 Transporte | ✓ Siempre | — |
| 4 | 🎬 Entretenimiento | ✓ Siempre | — |
| 5 | ❤️ Salud y Belleza | ✓ Siempre | — |
| 6 | 💰 Ahorro | ✓ Siempre | — |
| 7 | 📚 Educación | Solo Config | Si hay hijos en perfil |
| 8 | 🛡️ Seguros e Impuestos | Solo Config | Si hay vehículo o vivienda propia |
| 9 | 👕 Vestuario | Solo Config | Disponible, no en onboarding |
| 10 | 🎁 Regalos y Celebraciones | Solo Config | Disponible, no en onboarding |

---

### Catálogo de ítems — registro diario

El catálogo detallado para el registro diario. Estos ítems permiten tomar decisiones reales al final del mes.

**🏠 Vivienda**
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

**🍽️ Alimentación**
| Ítem | Tipo | Nota |
|------|------|------|
| Frutas y verduras | Variable | Se agrupa como "Mercado" en presupuesto |
| Aseo y víveres | Variable | Se agrupa como "Mercado" en presupuesto |
| Loncheras | Variable | |
| Otros* | Variable | Nota obligatoria |

**🚗 Transporte**
| Ítem | Tipo | Nota |
|------|------|------|
| Cuota crédito / leasing | Fijo | En Transporte, no Vivienda — gasto reversible |
| Combustible | Variable | |
| Transporte público | Variable | |
| Peajes | Variable | |
| Parqueadero | Variable | |
| Mantenimiento vehículo | Variable | |
| Otros* | Variable | Nota obligatoria |

**🎬 Entretenimiento**
| Ítem | Tipo | Nota |
|------|------|------|
| Streaming | Fijo | |
| Restaurantes | Variable | Viene de Alimentación v1 — decisión de ocio, no de mercado |
| Cine | Variable | |
| Salidas | Variable | |
| Viajes | Variable | |
| Vacaciones | Variable | |
| Otros* | Variable | Nota obligatoria |

**👕 Vestuario**
| Ítem | Tipo |
|------|------|
| Ropa | Variable |
| Zapatos | Variable |
| Uniforme | Variable |
| Otros* | Variable |

**❤️ Salud y Belleza**
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

> "Servicios estéticos" agrupa manicure, pedicure, depilación, barbería. Universal — aplica para hombres y mujeres. El campo **nota** del registro especifica el detalle.

**📚 Educación**
| Ítem | Tipo | Nota |
|------|------|------|
| Universidad | Fijo | |
| Colegio | Fijo | |
| Jardín | Fijo | |
| Matrícula | Variable | Frecuencia configurable: anual/semestral/mensual |
| Actividades extracurriculares | Variable | |
| Otros* | Variable | Nota obligatoria |

**🛡️ Seguros e Impuestos**
| Ítem | Tipo | Frecuencia |
|------|------|------------|
| Seguro de vida | Fijo | Anual |
| Seguro de hogar | Fijo | Anual |
| Seguro vehículo | Fijo | Anual |
| SOAT | Fijo | Anual (agosto) |
| Impuestos vehículo | Fijo | Anual (abril) |
| Impuesto predial | Fijo | Anual (marzo) |

**🎁 Regalos y Celebraciones**
| Ítem | Tipo |
|------|------|
| Regalos | Variable |
| Celebraciones | Variable |
| Otros* | Variable |

**💰 Ahorro**
| Ítem | Tipo |
|------|------|
| Ahorro programado | Fijo |
| Fondo emergencia | Fijo |
| Otros* | Variable |

---

### Regla sobre el ítem "Otros"

**Dos comportamientos distintos:**

- **"Otros" en registro diario** → el campo **nota se vuelve obligatorio**. El dato queda como *"Otros — suscripción revista"*, no como un número huérfano sin contexto.
- **En Config (categorías)** → en lugar de "Otros" hay un botón **"+ Agregar ítem"**. El ítem nuevo queda guardado en el hogar y aparece en futuras sesiones. El catálogo crece con el uso real de cada familia (DA-9).

---

### Ítems agrupados en el Presupuesto Base

| Categoría | Ítem en presupuesto | Ítems diarios que lo alimentan |
|-----------|--------------------|---------------------------------|
| Alimentación | Mercado | Frutas y verduras + Aseo y víveres |
| Salud y Belleza | Salud | Droguería + Cita médica + Cita pediátrica + Medicina prepagada + Gimnasio |
| Salud y Belleza | Belleza | Peluquería + Servicios estéticos |
| Vivienda | Servicios del hogar | Agua y Energía + Gas + Internet (agrupados en onboarding) |

---

## 8.1.2 🚀 Onboarding del Presupuesto Base

### Principio de diseño

> El onboarding pide lo mínimo para que la app tenga valor inmediato. El detalle se agrega después, cuando el usuario quiera.

**Organiza2 no es una app financiera** — el onboarding no debe sentirse como configurar un presupuesto contable. Debe sentirse como *"cuéntanos cómo es tu hogar"*.

### Flujo definitivo — 5 pantallas + resumen

| # | Pantalla | Contenido | Saltable |
|---|----------|-----------|---------|
| 1 | ¿Cómo es su hogar? | Soltero / Pareja / Familia / Mixto | No — define personalización |
| 2 | ¿Cuál es su mayor reto? | 4 opciones de dolor principal | Sí — "Prefiero no decir" |
| 3 | ¿Con cuánto cuentan? | Ingreso fijo + Ingreso adicional opcional | Sí |
| 4 | Lo que sí o sí pagan | Arriendo · Servicios del hogar · Transporte | Sí |
| 5 | Lo que varía | Mercado · Entretenimiento · Ahorro | Sí |
| 6 | Así queda el mes | Resumen: ingresos − gastos = disponible + insight | — |

### Lenguaje del onboarding

El lenguaje es conversacional, nunca contable:

| ❌ Lenguaje financiero | ✅ Lenguaje Organiza2 |
|----------------------|----------------------|
| Ingreso del hogar | ¿Con cuánto cuentan este mes? |
| Gastos fijos | Lo que sí o sí hay que pagar |
| Gastos variables | Lo que varía según el mes |
| Ahorro mensual | ¿Cuánto quieren guardar? |
| Disponible | Les queda libre |

### Reglas del onboarding

- Máximo 3 campos por pantalla
- Pantallas 1 y 2 requieren selección — personalizan todo lo que sigue
- "Saltar por ahora" disponible en pantallas 3, 4 y 5
- El resumen final muestra números reales ingresados + insight contextual
- Vestuario, Regalos, Seguros, Educación, frecuencias → solo en Config

### Pantallas condicionales dentro del onboarding

- Cuota crédito/leasing → aparece en pantalla 4 solo si perfil tiene vehículo financiado
- Educación → no aparece en onboarding, solo en Config si hay hijos

### Opciones de la pantalla 2 — "¿Cuál es su mayor reto?"

| Opción | Subtítulo |
|--------|-----------|
| No sé en qué se va el dinero | El mes acaba y no queda nada |
| No nos ponemos de acuerdo | Cada uno ve el dinero diferente |
| Llego muy justo a fin de mes | Siempre falta un poco |
| Quiero ahorrar pero no logro | La plata siempre se gasta primero |

> Esta respuesta personaliza el tono de los mensajes y los insights del análisis. No afecta funcionalidad.

---

## 8.1.3 🤝 Trabajo en Equipo — modelo de colaboración

### Principio

> La app facilita la conversación en pareja. No la reemplaza ni la arbitra.

El presupuesto lo decide la pareja conversando. La app provee los datos para que esa conversación sea honesta y basada en información real.

### Flujo de incorporación del segundo miembro

1. Al final del onboarding aparece: *"¿Quieres invitar a tu pareja para que revise esto juntos?"* → `[Enviar invitación]` / `[Lo hago después]`
2. Cuando el miembro 2 entra por primera vez, ve el presupuesto configurado con un banner: *"[Nombre] configuró el presupuesto base. ¿Estás de acuerdo con estos números?"* → `[Se ve bien]` / `[Tengo un ajuste]`
3. Si elige "Tengo un ajuste" → campo de comentario simple por ítem — una línea, visible para ambos miembros

### Para después del piloto (v2.3+)

Historial de cambios por ítem, notificaciones push, votación de ítems en disputa.

---

### 8.2 📋 Planeador

**Estado:** planificado para v3.0. No desarrollar hasta validar Finanzas v2.0 con familias reales.

---

### 8.3 🍽️ Alimentación

**Estado:** planificado para v4.0. No desarrollar todavía.

---

## 9. Transparencia Financiera como Objetivo Estratégico

> *De "mi presupuesto" a "nuestro hogar".*

| Objetivo | Descripción |
|----------|-------------|
| **Visión compartida** | Ambos integrantes ven los mismos datos, en tiempo real, desde sus dispositivos. |
| **Transparencia financiera** | Ingresos, gastos, presupuesto y disponible son información del hogar — no de una persona. |
| **Comunicación basada en datos** | Las conversaciones sobre dinero parten de información real, no de suposiciones. |
| **Planeación conjunta** | El presupuesto base, los eventos y las metas se construyen juntos. |

**La transparencia no es una función. Es el producto.**

---

## 10. Filosofía de Producto

**Organiza2 simplifica. No complica.**

> El filtro de cada decisión: *"¿Esto reduce estrés o agrega complejidad innecesaria?"*

**El sistema se adapta al usuario. No al revés.**

**De "mi presupuesto" a "nuestro hogar".**

---

## 11. Identidad Visual

**Valores visuales:** Tranquilidad · Cercanía · Orden

- Color principal: `#1D9E75` (verde tranquilidad)
- Tipografía: DM Sans (texto) + DM Mono (números)
- Estilo: moderno, móvil primero, sin estética corporativa
- Lenguaje visual: humano, cotidiano, no técnico

---

## 12. ⛔ Regla de Validación — No construir sin validar

**No se desarrollará el Planeador ni el módulo de Alimentación hasta que Finanzas v2.0 haya sido validado con familias reales.**

El piloto con 5-10 familias debe confirmar: onboarding sin fricción, modelo de hogar correcto, presupuesto base con valor real, transparencia en pareja funcional, registro diario suficientemente rápido.

---

## 13. Hoja de Ruta Estratégica — v2.0

| Versión | Hitos clave | Estado |
|---------|-------------|--------|
| **v2.0** | Auditoría estratégica · Redefinición de visión · Nuevo modelo de hogar · Categorías oficiales · Diseño onboarding | ✅ Completado |
| **v2.1** *(Etapas A-D)* | Login Google · Creación de hogares · Invitación de pareja · Migración Anny1130 · Finanzas modular · Reglas Firebase | ✅ Completado |
| **v2.2** *(Etapa E)* | Presupuesto Base · Onboarding 5 pantallas · defD() v2.0 · Registro diario detallado · Pantallas dinámicas | 🔄 Siguiente |
| **v2.3** | Piloto con 10 familias · Feedback real · Comentarios en presupuesto | 🔲 Pendiente |
| **v3.0** | Planeador MVP | 🔲 Pendiente |
| **v4.0** | Alimentación | 🔲 Pendiente |
| **v5.0** | Monetización · PSE/Nequi · Planes freemium | 🔲 Pendiente |

---

## 14. Modelo de Negocio

| Plan | Precio | Incluye |
|------|--------|---------| 
| 🆓 Gratuito | $0 | Finanzas básico · 1 hogar · Historial 3 meses |
| ⭐ Premium | $15.000 COP/mes | Todos los módulos · Historial completo · Exportar PDF/Excel |
| 👨‍👩‍👧 Familiar | $25.000 COP/mes | Todo Premium · 2+ usuarios · Coordinación tiempo real |

---

## 15. Stack Técnico

| Componente | Tecnología |
|------------|------------|
| Frontend | HTML + CSS + JS Vanilla |
| Base de datos | Firebase Realtime Database |
| Autenticación | Firebase Auth (Google) |
| Hosting | GitHub Pages |
| PWA | Service Worker + manifest.json |
| Offline | LocalStorage Queue + navigator.onLine |

---

*Organiza2 — Documento de Producto v2.3 | Junio 2026*
