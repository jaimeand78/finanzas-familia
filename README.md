# 💰 Organiza2 — Finanzas

> El sistema operativo del hogar familiar latinoamericano.  
> Módulo activo: **Finanzas** | Estado: ✅ En producción

**App:** [organiza2.github.io/finanzas-familia](https://organiza2.github.io/finanzas-familia)  
**Firebase:** organiza2-a09ef (Realtime Database)  
**Stack:** HTML + CSS + JS Vanilla · Firebase · GitHub Pages · PWA

---

## ¿Qué es Organiza2?

Organiza2 es una plataforma de organización familiar para familias latinoamericanas. No es solo una app financiera — es la capa organizadora del hogar: finanzas, eventos, colegio y alimentación, todo conectado.

**Visión:** *"Todo lo que tu familia necesita organizar, en un solo lugar, con paz y tranquilidad."*

---

## Estado actual del proyecto

| Módulo | Estado | Descripción |
|--------|--------|-------------|
| 💰 Finanzas | ✅ En producción | Presupuesto, nómina, empleadas, gastos diarios, análisis |
| ✈️ Viaje | ✅ Prototipo validado | Congelado — se refactoriza como motor de Eventos |
| 📅 Eventos | 🔲 Fase 4 | Nace del módulo Viaje validado en Europa mayo 2026 |
| 🎒 Agenda Escolar | 🔲 Fase 7 | Circulares, recordatorios, coordinación pareja |
| 🥪 Lonchera | 🔲 Fase 8 | Menú semanal, lista de mercado, perfiles por hijo |

---

## Tabs del módulo Finanzas

| Tab | Función |
|-----|---------|
| Mensual | Resumen del mes: ingresos, gastos reales vs presupuesto |
| Presupuesto | Define cuánto planear gastar por ítem |
| Nómina | Calcula salario neto con retención, AFC y prima |
| Empleadas | Salarios y prestaciones (cesantías, prima) de empleada y niñera |
| Hoy 💸 | Registro rápido de gastos hormiga del día |
| ✈️ Viaje | Gastos de viaje con conversión EUR/USD/COP |
| Análisis 📊 | Semáforo por categoría, tendencia 6 meses, análisis hormiga |

---

## Roadmap — 10 Fases

| Fase | Módulo | Estado |
|------|--------|--------|
| 1 | 🔐 Login Google + Hogar compartido | 🔄 **Siguiente** |
| 2 | 💰 Finanzas v2 (PDF/Excel/iOS fix) | 🔲 Pendiente |
| 3 | 🧪 Pruebas con 5-10 familias | 🔲 Pendiente |
| 4 | 📅 Eventos MVP | 🔲 Pendiente |
| 5 | 🏗️ Separar código JS/CSS | 🔲 Pendiente |
| 6 | 🌐 Dominio + Landing page | 🔲 Pendiente |
| 7 | 🎒 Agenda Escolar | 🔲 Pendiente |
| 8 | 🥪 Lonchera | 🔲 Pendiente |
| 9 | 🏠 Dashboard Familiar | 🔲 Pendiente |
| 10 | 💳 Monetización | 🔲 Pendiente |

> **Principio:** Login Google primero, separar código después. El Login cambia `FBK` en todo el código — separar antes genera trabajo doble.

---

## Decisiones clave para cualquier IA que trabaje en este proyecto

1. **Nunca usar `cat.items` directamente** — siempre usar `planItems(cat)`
2. **Los gastos hormiga NO se guardan en el nodo mensual** — viven en `daily/` y se suman en memoria (`dailyTotals{}`)
3. **`canonicalLabel()`** debe aplicarse al leer de Firebase — corrige encodings corruptos de tildes/eñes
4. **`save()`** tiene debounce de 800ms y maneja la cola offline automáticamente
5. **`FBK = 'Anny1130'`** es temporal — será reemplazado por uid de Firebase Auth en Fase 1
6. **Cada nuevo nodo Firebase requiere regla explícita** — no hay herencia automática de reglas
7. **iOS Safari ignora `inputmode="decimal"` en `type="number"`** — usar `type="text"` con `inputmode="decimal"`

---

## Estructura Firebase

```
pl/[uid]/[año]/[mes]          ← Datos del planeador mensual
daily/[uid]/[año]/[mes]/[día] ← Gastos hormiga diarios
viaje/[uid]/[año]/[mes]/[día] ← Gastos de viaje/eventos
hist/[uid]                    ← Historial de cambios
```

`uid` actual hardcodeado: **`Anny1130`**

---

## Documentación

| Documento | Descripción |
|-----------|-------------|
| [arquitectura.md](./docs/arquitectura.md) | Estructura técnica, Firebase, flujos de datos, decisiones arquitecturales |
| [producto.md](./docs/producto.md) | Visión, propuesta de valor, módulos, modelo de negocio |
| [bitacora.md](./docs/bitacora.md) | Cronología de desarrollo, bugs resueltos, aprendizajes |

---

## Contexto colombiano diferenciador

- **Nómina:** Retención en la fuente (7% Jaime / 9% Anny), seguridad social 8%, fondo solidaridad 1%, AFC, medicina prepagada, prima junio/diciembre
- **Empleadas domésticas:** Cesantías (1 salario/año), intereses cesantías (12%), prima semestral (0.5 salario), calculadas automáticamente por mes
- **Moneda:** COP con formato `$1.200.000` (locale `es-CO`)
- **Pagos:** PSE / Nequi planificados para monetización

---

*Organiza2 | Mayo 2026 | organiza2.github.io*
