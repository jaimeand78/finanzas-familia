# 📋 Organiza2 — Documento de Producto v1.2

> Mayo 2026

---

## 1. Visión del Producto

> *"Todo lo que tu familia necesita organizar, en un solo lugar, con paz y tranquilidad"*

Organiza2 es una plataforma de organización familiar diseñada para familias latinoamericanas que quieren reducir el caos cotidiano, evitar olvidos y tener claridad sobre el impacto real de la vida diaria en sus finanzas.

No es simplemente una app financiera. No es solamente una agenda. No es únicamente un calendario.

**Organiza2 busca convertirse en la capa organizadora del hogar moderno.**

Todo ocurre en un mismo ecosistema: Finanzas · Eventos · Colegio · Alimentación · Responsabilidades · Recordatorios · Coordinación entre pareja.

**Todo conectado. Todo sincronizado. Todo pensado para dar tranquilidad.**

---

## 2. El Problema que Resuelve

Las familias modernas viven una fragmentación constante de información y responsabilidades.

| Problema | Descripción |
|----------|-------------|
| **Los gastos invisibles** | Regalos, disfraces, cuotas escolares, materiales, viajes cortos, salidas improvisadas. No parecen graves individualmente — pero juntos generan un impacto enorme en el presupuesto mensual. |
| **La descoordinación familiar** | Quién lleva al niño, quién compra el regalo, quién asiste a la reunión, quién prepara la lonchera. Todo depende de memoria humana. Genera estrés, reprocesos y conflictos. |
| **El caos escolar** | La información escolar vive dispersa y se pierde fácilmente. Los padres reaccionan tarde porque olvidaron la fecha, nadie vio la circular, o el recordatorio llegó demasiado tarde. |
| **El desgaste diario invisible** | Qué empacar, qué comprar, qué cocinar, qué falta, qué pagar. Decisiones repetitivas que consumen energía mental constante y terminan agotando a la familia. |

---

## 3. Propuesta de Valor

> Organiza2 no vende control financiero. Vende **tranquilidad, coordinación, claridad y paz mental**.

La sensación de: no olvidar cosas importantes, evitar gastos sorpresa, repartir responsabilidades, y sentir que el hogar está organizado.

### Diferencial Competitivo

| # | Diferencial | Descripción |
|---|-------------|-------------|
| 1 | **Diseñado para Latinoamérica** | Incluye realidades que muchas apps globales ignoran: cesantías, prima, colegios privados, cuotas extras, PSE, Nequi, gastos familiares cotidianos, organización vía WhatsApp. |
| 2 | **Contextualiza los gastos** | No es lo mismo ver "Entretenimiento: $420.000" que "Cumpleaños Sofía". Organiza2 conecta los gastos con los eventos reales de la vida. |
| 3 | **Todo conectado** | La mayoría de herramientas separan tiempo, dinero, tareas, recordatorios y familia. Organiza2 los conecta en un mismo ecosistema. |

---

## 4. Usuario Objetivo

| Perfil | Descripción |
|--------|-------------|
| **Principal** | Parejas entre 28 y 45 años: ambos trabajan, tienen 1-3 hijos, viven en ciudades intermedias o grandes, usan smartphone diariamente, sienten constantemente falta de tiempo y organización. |
| **Secundario** | Personas solteras o parejas jóvenes que quieren organizar mejor sus finanzas, construir hábitos, prepararse para vida familiar futura. |

---

## 5. El Ecosistema Organiza2

```
┌─────────────────────────────────────────┐
│           💰 NÚCLEO — FINANZAS           │
│  Presupuesto · Nómina · Empleadas        │
│  Gastos diarios · Análisis               │
└──────┬──────────┬──────────┬────────────┘
       │          │          │
       ▼          ▼          ▼
  📅 Eventos  🎒 Agenda   🥪 Lonchera
               Escolar
```

Todos los módulos alimentan automáticamente las categorías, presupuestos y métricas de Finanzas.

---

## 6. Módulos en Detalle

### 6.1 💰 Finanzas — El Núcleo

En producción desde abril 2026.

- Presupuesto mensual por categorías con ítems personalizables
- Nómina doméstica completa: salario, cesantías, prima por empleada y niñera
- Gastos hormiga diarios — registro rápido con categoría, monto y responsable
- Historial anual con comparación mes a mes
- Pestaña Hoy — vista del día con todos los gastos registrados
- Análisis: Semáforo, Tendencia, Hormiga
- Cola offline — gastos se guardan localmente sin conexión y sincronizan al reconectar
- **PRÓXIMO:** Login Google, multiusuario, exportar Excel/PDF

### 6.2 📅 Eventos

> **Origen real del módulo:** Nació del módulo Viaje construido y validado durante un viaje a Europa en mayo 2026. Sin proponérselo, se validaron: registro rápido de gastos, multiusuario en tiempo real, uso real desde móviles, resumen acumulado, conversión de monedas y funcionamiento en condiciones reales de viaje.

Evolución del módulo Viaje — cubre cualquier tipo de evento familiar con impacto financiero.

**Tipos de evento:**
- Vacaciones grandes (nacional o internacional)
- Fin de semana / salida corta
- Cumpleaños
- Regreso a clases
- Primera comunión / matrimonio / grado
- Navidad / Semana Santa
- Salida escolar

**Flujo en 3 fases:**

| PLANEACIÓN | EJECUCIÓN | CIERRE |
|------------|-----------|--------|
| Crear evento | Registrar gastos en tiempo real | Resumen presupuesto vs real |
| Definir presupuesto estimado | Ambos esposos desde celular | Gastos por categoría |
| Checklist | Ver total acumulado | Conexión automática a Finanzas |
| Asignar responsables | Navegación por días | Exportar |

**Lo que ya existe como prototipo validado (módulo Viaje):**
- ✅ Registro de gastos en tiempo real
- ✅ Multiusuario — ambos esposos sincronizan
- ✅ Categorías de gasto
- ✅ Resumen acumulado con barras por categoría
- ✅ Navegación por días
- ✅ Conversión de monedas EUR/USD/COP
- ✅ Cola offline — gastos en zonas sin internet

**Lo que se agrega en la versión completa:**
- Tipos de evento (viaje, cumpleaños, salida, etc.)
- Presupuesto estimado previo
- Comparación presupuesto vs real al cerrar
- Checklist de preparativos con responsable
- Conexión automática a Finanzas del mes

### 6.3 🎒 Agenda Escolar

- Captura rápida: foto a la circular, reenvío de WhatsApp, entrada manual
- Recordatorios escalonados: 1 semana antes, 3 días antes, la noche anterior
- Asignación de responsable: ¿quién lleva el disfraz? ¿quién va a la reunión?
- Calendario compartido entre pareja con vista semanal y mensual
- Conexión con Finanzas: cuotas extras, materiales y regalos afectan el presupuesto

### 6.4 🥪 Lonchera

- Perfil por hijo: alergias, preferencias, lo que no le gusta
- Generador de menú semanal balanceado con rotación inteligente
- Lista de mercado automática basada en el menú planeado
- Recetas guardadas con tiempo de preparación e ingredientes
- Conexión con Finanzas: el mercado semanal afecta el presupuesto de Alimentación

---

## 7. Filosofía de Producto

**Organiza2 simplifica. No complica.**

> El filtro de cada decisión: *"¿Esto reduce estrés o agrega complejidad innecesaria?"*

El objetivo NO es llenar la plataforma de herramientas. El objetivo es reducir carga mental, automatizar organización, y hacer visible lo importante.

---

## 8. Identidad Visual

**Valores visuales:** Tranquilidad · Cercanía · Orden

- Colores cálidos — no fríos ni corporativos
- Estilo moderno tipo iPhone/iPad — familiar e intuitivo
- Iconografía amable — cercana, no técnica
- Diseño limpio — espacio en blanco generoso
- Color principal: `#1D9E75` (verde tranquilidad)

> La interfaz debe sentirse: **Humana. Cotidiana. No técnica.** Como si un amigo muy organizado hubiera diseñado algo específicamente para tu familia.

---

## 9. Hoja de Ruta Estratégica — v1.2

> Roadmap actualizado mayo 2026 — 10 fases ordenadas por prioridad real.

| Fase | Módulo | Hitos clave | Est. | Estado |
|------|--------|-------------|------|--------|
| 1 | 🔐 Login Google + Hogar | Firebase Auth · Pantalla login · Código de hogar · Migración Anny1130 · Reglas Firebase | 2-3 sem. | 🔄 Siguiente |
| 2 | 💰 Finanzas v2 | PDF/Excel · Fix iOS · UX móvil · Manifest fix | 1-2 sem. | 🔲 Pendiente |
| 3 | 🧪 Pruebas familias | 5-10 familias · Feedback real · NO construir nada nuevo | 3-4 sem. | 🔲 Pendiente |
| 4 | 📅 Eventos MVP | Tipos evento · Presupuesto · Motor Viaje refactorizado · Checklist · Conexión Finanzas | 3-4 sem. | 🔲 Pendiente |
| 5 | 🏗️ Separar código | JS separado · CSS separado · Sin frameworks | 1 sem. | 🔲 Pendiente |
| 6 | 🌐 Infraestructura | organiza2.app · Landing page · Branding | 1 sem. | 🔲 Pendiente |
| 7 | 🎒 Agenda Escolar | Circulares · Recordatorios · Coordinación pareja | 4-6 sem. | 🔲 Pendiente |
| 8 | 🥪 Lonchera | Perfil hijo · Menú semanal · Lista mercado | 4-6 sem. | 🔲 Pendiente |
| 9 | 🏠 Dashboard Familiar | Vista unificada · Alertas · Pendientes del día | 3-4 sem. | 🔲 Pendiente |
| 10 | 💳 Monetización | Gratuito vs premium · PSE/Nequi · Onboarding | 4-6 sem. | 🔲 Pendiente |

> **Principio central:** Primero Login y validación real con familias. Luego separar código. Luego construir nuevos módulos sobre base probada.

---

## 10. Modelo de Negocio

| Plan | Precio | Incluye |
|------|--------|---------|
| 🆓 Gratuito | $0 | 1 perfil, Finanzas básico, historial 3 meses, 1 módulo adicional |
| ⭐ Premium | $15.000 COP/mes | Todos los módulos, perfiles ilimitados, historial completo, exportar PDF/Excel |
| 👨‍👩‍👧 Familiar | $25.000 COP/mes | Todo Premium + 2 usuarios, coordinación tiempo real, dashboard unificado |

> **Potencial:** Colombia tiene ~4M hogares con hijos en edad escolar. 0.1% con plan Premium = 4.000 familias × $15.000 = $60M COP/mes. Mercado latinoamericano amplía esto 10x.

---

## 11. Stack Técnico

| Componente | Tecnología | Razón |
|------------|------------|-------|
| Frontend | HTML + CSS + JS Vanilla | Sin frameworks, sin build, deploy trivial |
| Base de datos | Firebase Realtime Database | Sync en tiempo real, gratuito en escala inicial |
| Autenticación | Firebase Auth (Google) — PRÓXIMO | Login seguro, un clic, alta penetración en Colombia |
| Hosting | GitHub Pages | Gratuito, deploy automático con git push |
| PWA | Service Worker + manifest.json | Instalable en iPhone y Android |
| Offline | LocalStorage Queue + navigator.onLine | Gastos sin conexión → sync automático |
| Dominio | organiza2.app — PENDIENTE | Brandable, memorable |

---

## 12. Próximos Pasos Inmediatos

1. Implementar Login Google en Firebase Auth
2. Diseñar pantalla de login profesional
3. Implementar sistema de hogar compartido con código de invitación
4. Migrar datos de `Anny1130` al nuevo sistema de hogares
5. Configurar reglas de seguridad Firebase por uid autenticado
6. Arreglar `manifest.json` — quitar apellidos del `name` y `description`
7. Compartir con 5-10 familias conocidas para feedback real
8. Validar patrones de uso antes de construir el segundo módulo

> **Principio central:** Primero una experiencia excelente con Login real y validación con familias, luego el ecosistema. Organiza2 debe crecer desde uso real, problemas reales y familias reales. No desde funcionalidades vacías.

---

*Organiza2 — Documento de Producto v1.2 | Mayo 2026*
