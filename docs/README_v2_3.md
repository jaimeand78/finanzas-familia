# 🏠 Organiza2

> **Organizamos tu vida en pareja.**

Organiza2 es una plataforma para organizar la vida en pareja y familia.  
No es una app de gastos. No es una agenda. No es un recordatorio.  
Es todo eso junto — conectado, compartido y pensado para hogares latinoamericanos.

**App:** [organiza2.github.io/finanzas-familia](https://organiza2.github.io/finanzas-familia)

---

## ¿Por qué existe Organiza2?

Todo empezó como una app para controlar los gastos del hogar.

Pero en el uso real apareció algo más importante: **el problema no era solo financiero**.

Las familias modernas cargan cada día con una cantidad enorme de decisiones pequeñas que nadie coordina bien:

- ¿Quién lleva al niño al colegio mañana?
- ¿Ya pagamos el SOAT?
- ¿Cuánto llevamos gastado este mes?
- ¿Quién compra el regalo del cumpleaños?
- ¿Alcanza el sueldo para las vacaciones?
- ¿La empleada cuándo tiene prima?

Esas preguntas no tienen respuesta fácil porque la información está dispersa — en el celular de uno, en una hoja de cálculo, en un chat de WhatsApp, en la memoria de dos personas que trabajan todo el día y llegan cansadas a casa.

**Organiza2 existe para que esas preguntas tengan respuesta en segundos, compartida entre los dos.**

---

## El problema que resuelve

| Problema | Cómo se vive |
|----------|-------------|
| **Carga mental** | Recordar qué pagar, qué comprar, qué vence, qué falta. Decisiones repetitivas que agotan a diario. |
| **Gastos invisibles** | Cuotas del colegio, regalos, salidas, materiales. Pequeños por separado — enormes en conjunto. |
| **Descoordinación en pareja** | Uno sabe, el otro no. Uno paga, el otro no entiende por qué falta dinero. |
| **Información dispersa** | Los gastos en una app, el colegio por WhatsApp, los vencimientos en ninguna parte. |
| **Falta de visión compartida** | Cada uno tiene su versión de cómo van las finanzas. Nunca coinciden del todo. |

---

## La visión

> Organiza2 quiere convertirse en el **sistema operativo del hogar latinoamericano**.

No una app más. Una plataforma que entiende cómo vive tu familia, se adapta a tu realidad y te da claridad sin pedirte que configures cosas que no necesitas.

El principio central es simple:

**El hogar es la entidad principal. Todo lo demás depende de él.**

Cuando describes tu hogar — quiénes viven ahí, si tienes hijos, si tienes vehículo, si tienes empleada — Organiza2 se adapta automáticamente. Solo ves lo que aplica para tu vida. Nada más.

---

## El ecosistema

```
            🏠 MODELO DE HOGAR
    (la fuente de verdad de toda la plataforma)
                    │
       ┌────────────┼────────────┐
       │            │            │
       ▼            ▼            ▼
 💰 Finanzas   📋 Planeador  🍽️ Alimentación
```

### 💰 Finanzas
Responde tres preguntas: ¿cuánto entra? ¿en qué se va? ¿cómo vamos?

El corazón de Finanzas es el **Presupuesto Base**: cada gasto del hogar declara su frecuencia (mensual, semestral, anual) y la app calcula automáticamente cuánto provisionar cada mes. El SOAT de agosto, la prima de la empleada en junio, las vacaciones de enero — todo está previsto desde el primer día del año.

El registro diario usa un catálogo de 56 ítems en 10 categorías — suficientemente detallado para tomar decisiones reales, suficientemente simple para registrar en 10 segundos.

**Estado:** Login + Hogar implementados (v2.1). Presupuesto Base y onboarding en construcción (v2.2).

### 📋 Planeador
Organiza todo lo que no es dinero pero que afecta el dinero y el tiempo: eventos, cumpleaños, viajes, compromisos del colegio, vencimientos, recordatorios.

**Estado:** Planificado para v3.0. Base validada con el módulo Viaje (Europa, mayo 2026).

### 🍽️ Alimentación
Menú semanal, lista de mercado automática, perfil por hijo con alergias y preferencias.

**Estado:** Planificado para v4.0.

---

## Principios

**Simplicidad.** Cualquier persona puede usarla sin manual ni capacitación.

**Transparencia.** Ambos miembros del hogar ven los mismos datos, en tiempo real. No hay versiones distintas de la realidad.

**Colaboración.** La información del hogar se construye entre todos. No es la app de uno — es la app del hogar.

**Configurar una vez.** Tu hogar se describe una vez. Organiza2 usa esa información para siempre.

**Registrar diariamente.** El uso cotidiano debe ser rápido. Registrar un gasto no puede tomar más de 10 segundos.

**Entender fácilmente.** La app debe responder *¿cómo vamos?* sin que tengas que buscar la respuesta.

---

## ¿Por qué Organiza2 y no otra app?

| Diferencial | Descripción |
|-------------|-------------|
| **Pensado para Latinoamérica** | Cesantías, prima semestral, SOAT, empleada doméstica, retención en la fuente. Realidades que apps globales ignoran. |
| **Diseñado para parejas** | La transparencia financiera entre pareja no es una función — es el propósito. Pasar de "mi presupuesto" a "nuestro hogar". |
| **Se adapta a ti** | Un soltero, una pareja sin hijos y una familia con tres hijos ven experiencias completamente diferentes. |
| **Todo conectado** | Los eventos originan gastos. El colegio genera recordatorios. La empleada genera prestaciones. |
| **Progresivo** | Empiezas con lo mínimo. La app sugiere agregar más información solo cuando tiene sentido hacerlo. |

---

## Estado actual del proyecto

| Capa | Estado |
|------|--------|
| **Visión estratégica v2.0** | ✅ Definida y documentada |
| **Login Google + Firebase Auth** | ✅ Implementado (Etapa A) |
| **Modelo de Hogar** | ✅ Implementado — crear/unirse por código (Etapa B) |
| **Migración datos a hogares/** | ✅ Implementado (Etapa C) |
| **Finanzas v2 — arquitectura modular** | ✅ Implementado (Etapa D) |
| **Presupuesto Base + Onboarding** | 🔄 En construcción (v2.2 / Etapa E) |
| **Piloto con familias** | 🔲 v2.3 |
| **Planeador** | 🔲 v3.0 |
| **Alimentación** | 🔲 v4.0 |

> **Hogar activo:** SNBDPA ("Hogar Ibarra") — 2 miembros en producción.

### ⛔ Regla de validación

**El Planeador y la Alimentación no se construyen hasta que Finanzas v2.0 haya sido validado con 5-10 familias reales durante al menos 4 semanas.**

---

## Roadmap

| Versión | Qué incluye | Estado |
|---------|-------------|--------|
| **v2.1** *(Etapas A-D)* | Login Google · Hogar · Código de invitación · Migración Anny1130 · Finanzas modular | ✅ |
| **v2.2** *(Etapa E)* | Presupuesto Base · Onboarding 5 pantallas · defD() v2.0 · Registro diario detallado · Pantallas dinámicas | 🔄 |
| **v2.3** | Piloto con 10 familias reales · Feedback · Sin nuevas funciones hasta validar | 🔲 |
| **v3.0** | Planeador — eventos, recordatorios, compromisos del hogar | 🔲 |
| **v4.0** | Alimentación — menú semanal, lista de mercado, perfiles por hijo | 🔲 |
| **v5.0** | Monetización · Planes freemium · PSE / Nequi | 🔲 |

---

## Stack tecnológico

| Componente | Tecnología |
|------------|------------|
| Frontend | HTML + CSS + JS Vanilla (sin frameworks) |
| Base de datos | Firebase Realtime Database |
| Autenticación | Firebase Auth (Google) |
| Hosting | GitHub Pages |
| PWA | Instalable en iPhone y Android |
| Offline | Cola local con sincronización automática |

---

## Documentación completa

| Documento | Contenido |
|-----------|-----------|
| [producto_v2_3.md](./docs/producto_v2_3.md) | Visión, propuesta de valor, módulos, onboarding, modelo de hogar, roadmap |
| [arquitectura_v2_3.md](./docs/arquitectura_v2_3.md) | Estructura técnica, Firebase, decisiones arquitecturales DA-0 a DA-13 |
| [bitacora.md](./docs/bitacora.md) | Historial de desarrollo, bugs resueltos, aprendizajes, deuda técnica |

---

## Para desarrolladores e IAs que trabajen en este proyecto

Antes de tocar cualquier línea de código, leer estas reglas:

1. **El Hogar es la entidad principal** — los datos viven en `hogares/[codigoHogar]/`, nunca en nodos personales de usuario. Ver DA-0.
2. **Nunca usar `cat.items` directamente** — siempre `planItems(cat)`. Ver DA-2.
3. **Los gastos diarios NO van al nodo mensual** — viven en `daily/` y se suman en memoria. Ver DA-1.
4. **`canonicalLabel()` se aplica al leer de Firebase** — nunca modificar. Ver DA-3.
5. **Login antes de separar código** — el Login afecta ~30 funciones. Separar antes es trabajo doble. Ver DA-5.
6. **Cada nuevo nodo Firebase requiere regla explícita** — no hay herencia automática.
7. **iOS Safari:** `type="text" inputmode="decimal"` en todos los campos de monto.
8. **El perfil del hogar determina qué se muestra** — toda lógica de visibilidad pasa por `getCapabilidades(perfil)`. Ver DA-7.
9. **El hogar se construye progresivamente** — nunca pedir información que no genera valor todavía. Ver DA-9.
10. **Dos niveles de detalle** — `defD()` para el presupuesto (agrupado), `DAILY_ITEMS` para el registro diario (detallado). Nunca mezclar. Ver DA-10.
11. **Ingresos dinámicos** — los labels de ingresos vienen del perfil del hogar, nunca hardcodeados con nombres. Ver DA-11.
12. **`calcPresupuestoBase(item, mes)`** — única función que calcula provisión mensual por frecuencia. Nunca calcular inline. Ver DA-8.
13. **Cuota crédito vehículo va en Transporte** — no en Vivienda. Ver DA-12.

---

*Organiza2 | Junio 2026 | [organiza2.github.io/finanzas-familia](https://organiza2.github.io/finanzas-familia)*
