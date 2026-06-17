# 📋 Organiza2 — Documento de Producto v2.3

> Junio 2026 — Actualizado con Fases 25–41 · Piloto activo

---

## 1. Visión del Producto

> *"Organizamos tu vida en pareja."*

Organiza2 es una plataforma de organización familiar para parejas y hogares latinoamericanos.

Nació como una app financiera. Durante el uso real se descubrió algo más importante: el problema no era únicamente financiero. Las familias enfrentan una carga mental diaria relacionada con dinero, hijos, colegio, vehículos, servicio doméstico, eventos, viajes, alimentación, recordatorios y organización del hogar.

**Organiza2 no es una app financiera. Es una plataforma para organizar la vida en pareja y familia. Las finanzas son uno de sus módulos.**

> **Nota sobre el lema:** *"Organizamos tu vida en pareja"* refleja la experiencia más completa del producto. Organiza2 también es válido para usuarios solteros — el lema describe la colaboración, no una restricción.

---

## 2. El Problema que Resuelve

| Problema | Descripción |
|----------|-------------|
| **Carga mental diaria** | Qué pagar, qué comprar, qué cocinar, qué falta, qué hay que recordar. Decisiones repetitivas que agotan. |
| **Gastos invisibles** | Regalos, cuotas escolares, materiales, viajes cortos, salidas imprevistas. Individualmente pequeños — en conjunto enormes. |
| **Descoordinación en pareja** | Quién lleva al niño, quién compra el regalo, quién paga qué. Todo depende de memoria humana. |
| **Información dispersa** | El colegio manda circulares por WhatsApp, los gastos en una hoja de cálculo, los recordatorios en el teléfono de uno solo. |

---

## 3. Propuesta de Valor

> Organiza2 no vende control. Vende **claridad, coordinación y paz mental**.

La sensación de: saber cómo va el hogar, no olvidar lo importante, tomar decisiones juntos y sentir que todo está bajo control.

**En el login:**
- ✅ Saben en qué se va el dinero
- ✅ Deciden juntos, sin sorpresas
- ✅ Paz mental a fin de mes

### Diferencial Competitivo

| # | Diferencial | Descripción |
|---|-------------|-------------|
| 1 | **Se adapta a cada hogar** | Un soltero ve una experiencia diferente a una familia con hijos, vehículos y empleada. |
| 2 | **Diseñado para Latinoamérica** | Cesantías, prima, colegios privados, cuotas extras, SOAT, empleada doméstica. |
| 3 | **"Nuestro hogar", no "mi presupuesto"** | Transparencia compartida, coordinación real, visión conjunta. |
| 4 | **Todo conectado** | Los eventos originan gastos. El colegio genera recordatorios. La empleada genera prestaciones. |

---

## 4. Usuario Objetivo

| Perfil | Descripción |
|--------|-------------|
| **Principal** | Parejas entre 28 y 45 años. Ambos trabajan. Tienen 1-3 hijos. Viven en ciudades de Colombia o Latinoamérica. |
| **Secundario** | Parejas jóvenes sin hijos que quieren construir visión financiera compartida. |
| **Terciario** | Personas solteras que quieren organizar sus finanzas personales. |

---

## 5. Principios

**Simplicidad.** Comprensible sin capacitación.
**Colaboración.** La información del hogar se construye entre todos.
**Transparencia.** Visión compartida de ingresos, gastos y metas.
**Configurar una vez.** La información del hogar se configura una vez y se reutiliza siempre.
**Registrar diariamente.** Rápido y sin fricción — máximo 10 segundos por gasto.
**Entender fácilmente.** La app responde *¿cómo vamos?* en 2 segundos.

---

## 6. El Ecosistema

```
            🏠 MODELO DE HOGAR
    (la fuente de verdad de toda la plataforma)
                    │
       ┌────────────┼────────────┐
       │            │            │
       ▼            ▼            ▼
 💰 Finanzas   📋 Planeador  🍽️ Alimentación
 (v2.3 ✅)    (v3.0 🔲)     (v4.0 🔲)
```

---

## 7. Módulo Finanzas — Estado v2.3

### Tabs

| Tab | Propósito | Tipo |
|-----|-----------|------|
| ✏️ Hoy | Registrar gastos del día | Escritura |
| 📊 Cómo vamos | Ver cómo va el mes — diseño simple para cualquier usuario | Solo lectura |
| 📈 Análisis | Semáforo histórico, tendencia, hormiga, balance por miembro | Solo lectura |
| ⚙️ Config | Info hogar + Presupuesto Base | Configuración |

### Tab Análisis — Sub-tabs v2.3

| Sub-tab | Propósito |
|---------|-----------|
| 🚦 Semáforo | Todas las categorías con detalle, navegable por mes |
| 📉 Tendencia | Gastos vs presupuesto últimos 6 meses con promedio |
| 🐜 Hormiga | Gastos pequeños — total, % del mes, por categoría |
| 👥 ¿Quién pagó? | Balance por miembro — real vs proporcional según ingresos |

**¿Quién pagó? — diseño:**
- Balance global con barras de porcentaje por miembro
- Proporción esperada calculada automáticamente desde los ingresos del perfil
- Veredicto: *"Están nivelados"* / *"Jaime pagó $X más de lo esperado"*
- Desglose por categoría con barras dobles por miembro

### Tab Cómo vamos — Diseño v2.3

El tab responde una sola pregunta: **¿cómo vamos?** Diseñado para el usuario no técnico — una ama de casa debe entenderlo de primera vista, sin fricción.

- **Número grande de disponible** — verde si hay margen, rojo si se pasó
- **Barra de progreso** — *Gastado $X de $Y* — contexto inmediato sin dos cifras frías
- **Ahorro del mes** — siempre visible si tiene presupuesto, badge "✓ cumplido"
- **Solo categorías en rojo/amarillo** — el problema se ve de inmediato
- **"El resto de categorías van bien ✅"** — mensaje tranquilizador si todo está en orden

**Principio de diseño:** Una mamá mira colores, no números. Si todo está verde, respira. Si hay rojo, se enfoca ahí.

### Presupuesto Base — Onboarding 6 pantallas

| Pantalla | Pregunta | Saltable |
|----------|---------|---------|
| P1 | ¿Cómo es su hogar? (Soltero/Pareja/Familia) | No |
| P1.5 | Perfil del hogar — Vehículo, Servicio Doméstico, Educación, Seguros | Sí |
| P2 | ¿Cuál es su mayor reto? | Sí |
| P3 | ¿Con cuánto cuentan este mes? | Sí |
| P4 | Lo que sí o sí hay que pagar | Sí |
| P5 | Lo que varía según el mes | Sí |
| Resumen | Ingresan / Se van / Les queda + insight | — |

Lenguaje conversacional, no financiero. *"Lo que sí o sí hay que pagar"* en lugar de *"Gastos fijos"*.

### Categorías Oficiales v2.3

| # | Categoría | Tipo |
|---|-----------|------|
| 1 | 🏠 Vivienda | Fijos + variables |
| 2 | 🧺 Alimentación | Variables |
| 3 | 🚗 Transporte | Fijos + variables |
| 4 | 🍿 Entretenimiento y Salidas | Fijos + variables |
| 5 | 👕 Vestuario | Variables |
| 6 | 💅 Salud y Belleza | Fijos + variables |
| 7 | 📚 Educación | Fijos + variables |
| 8 | 🛡️ Seguros e Impuestos | Anuales / por mes |
| 9 | 🎁 Regalos y Celebraciones | Variables |
| 10 | 🐷 Ahorro | Fijo mensual |
| 11 | 🤝 Servicio Doméstico | Fijos + variables |

### Modelo de Colaboración

1. Quien crea el hogar configura el presupuesto base
2. El miembro 2 ve banner: *"[Nombre] configuró el presupuesto base. ¿Estás de acuerdo?"*
3. Opciones: *"Se ve bien 👍"* / *"Tengo un ajuste"* (redirige a Config)

---

## 8. Pantalla de Login

- Logo oficial `logo.png` como protagonista
- Tres beneficios alineados con la propuesta de valor
- Botón "Entrar con Google" con SVG inline

---

## 9. ⛔ Regla de Validación

**No se desarrollará el Planeador ni la Alimentación hasta que Finanzas v2.3 haya sido validado con familias reales durante al menos 4 semanas.**

El piloto con 5–10 familias debe confirmar: onboarding sin fricción, modelo de hogar correcto, presupuesto base con valor real, transparencia en pareja funcional, registro diario suficientemente rápido.

> **Estado actual:** Piloto activo — Junio 2026. Canal de feedback: WhatsApp "Organiza2 · Piloto Familias". URL: `bit.ly/Organiza2`.

---

## 10. Hoja de Ruta

| Versión | Hitos | Estado |
|---------|-------|--------|
| **v2.0** | Auditoría · Redefinición de visión · Documentación | ✅ |
| **v2.1** | Login Google · Hogar · Invitación · Migración Anny1130 · Finanzas modular | ✅ |
| **v2.2** | Presupuesto Base · Onboarding · Resumen rediseñado · Login con logo | ✅ |
| **v2.3** | Piloto 5–10 familias · Feedback real | 🔄 En curso |
| **v3.0** | Planeador MVP | 🔲 |
| **v4.0** | Alimentación | 🔲 |
| **v5.0** | Monetización · PSE/Nequi · Planes freemium | 🔲 |

---

## 11. Estado del Piloto v2.3

✅ Piloto activo desde Junio 2026.

| Item | Estado | Fase |
|------|--------|------|
| Rediseño tab Config | ✅ | Fases 17, 18, 24 |
| Tab Análisis — afinar | ✅ | Fase 19 |
| Fix iOS decimal | ✅ | Fase 19 |
| Identidad de marca Organiza2 | ✅ | Fase 25 |
| Catálogo unificado defD / DAILY_ITEMS | ✅ | Fase 27 |
| Onboarding P1.5 — perfil del hogar | ✅ | Fase 24 |
| Tab "Cómo vamos" rediseñado | ✅ | Fase 30 |
| Sub-tab "¿Quién pagó?" | ✅ | Fase 30 |
| Reglas de seguridad Firebase | ✅ | Fase 31 |
| Telemetría piloto (6 métricas) | ✅ | Fase 34 |
| Edición de registros diarios | ✅ | Fase 35 |
| Service Worker PWA | ✅ | Fase 39 |
| Limpieza código huérfano | ✅ | Fase 40 |

---

## 12. Modelo de Negocio

| Plan | Precio | Incluye |
|------|--------|---------| 
| 🆓 Gratuito | $0 | Finanzas básico · 1 hogar · Historial 3 meses |
| ⭐ Premium | $15.000 COP/mes | Todos los módulos · Historial completo · Exportar PDF/Excel |
| 👨‍👩‍👧 Familiar | $25.000 COP/mes | Todo Premium · 2+ usuarios · Coordinación tiempo real |

---

## 13. Identidad Visual

- Color principal: `#1D9E75` (verde tranquilidad)
- Tipografía: DM Sans (texto) + DM Mono (números)
- Estilo: moderno, móvil primero, sin estética corporativa
- Logo: `logo.png` (estilo 3D suave, crema, fondo redondeado)

---

*Organiza2 — Documento de Producto v2.3 | Junio 2026*
