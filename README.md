# 🏠 Organiza2

> **Organizamos tu vida en pareja.**

Organiza2 es una plataforma para organizar la vida en pareja y familia latinoamericana.

**App en producción:** [organiza2.github.io/hogar](https://organiza2.github.io/hogar)

---

## El problema que resuelve

Las familias modernas cargan una cantidad enorme de decisiones pequeñas que nadie coordina bien: ¿quién lleva al niño?, ¿ya pagamos el SOAT?, ¿cuánto llevamos gastado este mes?, ¿quién compra el regalo?

Esas preguntas no tienen respuesta fácil porque la información está dispersa — en el celular de uno, en una hoja de cálculo, en WhatsApp, en la memoria de dos personas que llegan cansadas a casa.

**Organiza2 existe para que esas preguntas tengan respuesta en segundos, compartida entre los dos.**

Organiza2 **no** es una aplicación financiera. Finanzas es uno de sus módulos.

---

## Ecosistema

```
            🏠 MODELO DE HOGAR
                    │
       ┌────────────┼────────────┐
       │            │            │
       ▼            ▼            ▼
 💰 Finanzas   📋 Planeador  🍽️ Alimentación
```

Todo dato vive bajo `hogares/[codigoHogar]/`.

⛔ **No construir Planeador ni Alimentación hasta cumplir los criterios de salida del piloto.** Los criterios y el estado del piloto viven en [`docs/producto.md`](./docs/producto.md) §9 y §11; el seguimiento en vivo, en `admin.html`.

---

## Stack

HTML + CSS + JS Vanilla · Firebase Realtime Database · Firebase Auth (Google) · GitHub Pages · PWA

**Sin frameworks. Sin npm. Sin build step.**

---

## Documentación

| Buscas | Archivo |
|---|---|
| **Criterio de trabajo — leer antes de tocar cualquier archivo** | [`REGLAS_IA.md`](./REGLAS_IA.md) |
| Qué es el producto y qué NO es | [`docs/contexto_maestro.md`](./docs/contexto_maestro.md) |
| Decisiones de arquitectura (DA) y funciones únicas | [`docs/arquitectura.md`](./docs/arquitectura.md) |
| Visión, roadmap, estado del piloto, modelo de negocio | [`docs/producto.md`](./docs/producto.md) |
| Historial de sesiones, aprendizajes, deuda técnica | [`docs/bitacora.md`](./docs/bitacora.md) |
| Decisiones de diseño de junio 2026 *(histórico)* | [`docs/decisiones_junio2026.md`](./docs/decisiones_junio2026.md) |
| Auditoría técnica pre-piloto *(histórico)* | [`docs/auditoria_v2_3_junio2026.md`](./docs/auditoria_v2_3_junio2026.md) |
| Lo que la app hace de verdad | El código |

`REGLAS_IA.md` vive en la raíz; el resto en [`docs/`](./docs/).

---

## Estructura

```
├── index.html          → shell de la app
├── admin.html          → dashboard del piloto (standalone)
├── sw.js               → Service Worker
├── manifest.json
├── css/                → base · login · finanzas · presupuesto
├── js/                 → config · utils · offline · firebase-paths · auth
│                         telemetria · hogar · finanzas · presupuesto
│                         daily · analisis · ui · app
└── docs/
```

---

*Organiza2*
