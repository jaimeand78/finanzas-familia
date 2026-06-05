# 🏠 Organiza2

> **Organizamos tu vida en pareja.**

Organiza2 es una plataforma para organizar la vida en pareja y familia latinoamericana.

**App en producción:** [organiza2.github.io/finanzas-familia](https://organiza2.github.io/finanzas-familia)

---

## Estado actual — v2.2 ✅

| Módulo | Estado |
|--------|--------|
| Login Google + Firebase Auth | ✅ |
| Modelo de Hogar — crear/unirse por código | ✅ |
| Finanzas v2 — arquitectura modular | ✅ |
| Presupuesto Base + Onboarding 5 pantallas | ✅ |
| Tab Resumen — semáforo por categoría | ✅ |
| Pantalla login con logo | ✅ |
| **Piloto 5-10 familias** | 🔲 Siguiente |

> **Hogar activo:** SNBDPA ("Ibarra Masso") — 2 miembros en producción.

---

## El problema que resuelve

Las familias modernas cargan una cantidad enorme de decisiones pequeñas que nadie coordina bien: ¿quién lleva al niño?, ¿ya pagamos el SOAT?, ¿cuánto llevamos gastado este mes?, ¿quién compra el regalo?

Esas preguntas no tienen respuesta fácil porque la información está dispersa — en el celular de uno, en una hoja de cálculo, en WhatsApp, en la memoria de dos personas que llegan cansadas a casa.

**Organiza2 existe para que esas preguntas tengan respuesta en segundos, compartida entre los dos.**

---

## Ecosistema

```
            🏠 MODELO DE HOGAR
                    │
       ┌────────────┼────────────┐
       │            │            │
       ▼            ▼            ▼
 💰 Finanzas   📋 Planeador  🍽️ Alimentación
 (v2.2 ✅)    (v3.0 🔲)     (v4.0 🔲)
```

⛔ **No construir Planeador ni Alimentación hasta validar Finanzas v2.0 con familias reales.**

---

## Roadmap

| Versión | Hitos | Estado |
|---------|-------|--------|
| v2.1 | Login · Hogar · Finanzas modular | ✅ |
| v2.2 | Presupuesto Base · Onboarding · Resumen · Login | ✅ |
| v2.3 | Piloto 5-10 familias | 🔲 Siguiente |
| v3.0 | Planeador | 🔲 |
| v4.0 | Alimentación | 🔲 |
| v5.0 | Monetización | 🔲 |

---

## Stack

HTML + CSS + JS Vanilla · Firebase Realtime Database · Firebase Auth (Google) · GitHub Pages · PWA

**Sin frameworks. Sin npm. Sin build step.**

---

## Para IAs y desarrolladores

**Leer antes de tocar cualquier archivo:** [`REGLAS_IA.md`](./REGLAS_IA.md)

Reglas clave:
- Hogar es la entidad principal — datos en `hogares/[codigoHogar]/`
- Nunca usar `cat.items` directamente — siempre `planItems(cat)`
- `calcPresupuestoBase(item, mes)` — única función de provisión mensual
- `DAILY_ITEMS` ≠ `defD()` — nunca mezclar
- Tab Resumen = solo lectura / Tab Config = solo configuración
- Siempre pedir el archivo actual antes de modificarlo

Documentación completa en `docs/`.

---

*Organiza2 | Junio 2026*
