---
name: "organiza2"
description: "Contexto del proyecto Organiza2: PWA para organizar la vida en pareja y familia en Latinoamerica (NO es una app financiera). Usalo cuando se trabaje en diseno, codigo, arquitectura o producto de Organiza2 - identidad visual, interfaz, onboarding, piloto de familias, bugs, decisiones de arquitectura (DA)."
---

# Organiza2 - Contexto del proyecto

> Este Skill es dueno de tres cosas: **identidad breve**, **vocabulario** y **donde ir a mirar**.
> No lleva criterio de trabajo (vive en `REGLAS_IA.md`), ni decisiones (`docs/arquitectura.md`),
> ni estado (`docs/producto.md`), ni valores de diseno (los define el CSS).

## Que es

PWA en espanol para organizar la vida en pareja y familia en Latinoamerica. El hogar (no el individuo) es la entidad responsable: el usuario existe para autenticarse, el hogar existe para organizar la vida.

**NO es una aplicacion financiera.** Finanzas es solo uno de los modulos del ecosistema; Planeador y Alimentacion vienen despues.

```
Hogar (entidad principal)
   -> Finanzas . Planeador . Alimentacion
```

Todo dato vive bajo `hogares/{codigoHogar}/`.

Slogan: *"Organizamos tu vida en pareja."*

Stack: HTML/CSS/JS vanilla, sin frameworks, sin npm, sin build step. Firebase Realtime Database + Auth (Google). GitHub Pages. PWA con Service Worker.

El desarrollo completo -- que es, que NO es, ADN -- vive en `docs/contexto_maestro.md`.

## Vocabulario

| Termino | Significado |
|---|---|
| **Hogar** | La entidad principal. Codigo de 6 caracteres alfanumericos en mayusculas |
| **Perfil del hogar** | Flags configurados en P1.5 del onboarding (`tieneVehiculo`, `tieneEmpleada`, `tieneEducacion`, `tieneSeguros`). Controlan toda la UX |
| **Presupuesto Base** | La configuracion anual del hogar. No es la vista del mes |
| **Semaforo** | El indicador de color que responde "como vamos" sin cifras |
| **Piloto** | La validacion con familias reales que habilita (o no) el Planeador |
| **DA-###** | Decision de arquitectura ratificada. Viven en `docs/arquitectura.md` |
| **Fase ##** | Una sesion de trabajo cerrada. Viven en `docs/bitacora.md` |

Deuda tecnica y bugs conocidos: `docs/bitacora.md`.

## Sistema de diseno

**El CSS es el dueno de los valores. No hay una copia aqui que pueda quedar vieja.**

- Tokens globales (color, radio, tipografia): `:root` en `css/base.css`
- Los colores semanticos de estado no son tokens: hoy son literales en `css/finanzas.css` y `css/presupuesto.css`
- `admin.html` es standalone y define su propio `:root`

Lo que el CSS no puede decir, y por eso vive aqui:

- **DM Sans** para texto, **DM Mono** solo para numeros, montos y codigos de hogar. Nunca DM Mono para texto corrido
- El **logo oficial** (`logo.png`, estilo 3D suave, tono crema) comunica identidad en login y onboarding. **Nunca reemplazarlo por un emoji**
- Verde tranquilidad como color primario: la app transmite calma, no urgencia

## Donde ir a mirar

No asumir el estado del proyecto. Estos documentos cambian cada sesion; este Skill no los duplica.

| Buscas | Archivo |
|---|---|
| Criterio de trabajo, invariantes, protocolo de arranque | `REGLAS_IA.md` (raiz) |
| Que es el producto y que NO es | `docs/contexto_maestro.md` |
| Decisiones de arquitectura (DA) y funciones unicas | `docs/arquitectura.md` |
| Vision, roadmap, estado del piloto, modelo de negocio | `docs/producto.md` |
| Historial de sesiones, aprendizajes, deuda tecnica | `docs/bitacora.md` |
| Decisiones de diseno de junio 2026 (historico) | `docs/decisiones_junio2026.md` |
| Puerta de entrada e indice | `README.md` |
| Lo que la app hace de verdad | El codigo |

Repo: `github.com/organiza2/hogar` . App: `organiza2.github.io/hogar` . Firebase: `organiza2-a09ef`

## Al trabajar visualmente

**Regla de Branding.** Si existe un activo oficial -- logo, SVG, PSD, mockup, manual de marca, landing, UI oficial -- se revisa primero el archivo fuente. Nunca redisenar desde una captura, nunca reconstruir un logo desde una imagen, nunca crear variantes sin validar el activo oficial.

Los colores y la tipografia se leen del CSS, no se improvisan.
