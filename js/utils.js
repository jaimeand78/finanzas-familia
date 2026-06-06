// js/utils.js
// Responsabilidad: constantes, utilidades puras, canonicalLabel, planItems.
// No importa nada de otros módulos.
// Todos los demás módulos dependen de este.

// ── CONSTANTES ────────────────────────────────────────────────────────────────

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const MSHORT = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const COLORS  = ['#1D9E75','#378ADD','#D85A30','#BA7517','#D4537E','#534AB7','#639922','#6b6b68'];

// Categorías oficiales v2.0 — íconos por nombre (sin emoji en la clave)
const ICONS = {
  'Vivienda':               '🏠',
  'Alimentación':           '🧺',
  'Transporte':             '🚗',
  'Entretenimiento':        '🍿',
  'Vestuario':              '👕',
  'Salud y Belleza':        '💅',
  'Educación':              '📚',
  'Seguros e Impuestos':    '🛡️',
  'Regalos y Celebraciones':'🎁',
  'Ahorro':                 '🐷',
  'Servicio Doméstico':     '🤝',
  'Otros':                  '💸'
};

// ── CATÁLOGO DE REGISTRO DIARIO — DA-10 ──────────────────────────────────────
// SEPARADO de defD(). Solo para el selector del tab Hoy.
// Regla: cuando el usuario elige "Otros", la nota es OBLIGATORIA.

const DAILY_ITEMS = {
  '🏠 Vivienda': [
    'Arriendo / Hipoteca','Administración','Agua y Energía',
    'Gas','Internet','Telefonía','Servicio doméstico','Mantenimiento hogar','Otros'
  ],
  '🧺 Alimentación': [
    'Frutas y verduras','Aseo y víveres','Loncheras','Otros'
  ],
  '🚗 Transporte': [
    'Cuota crédito / leasing','Combustible','Transporte público',
    'Peajes','Parqueadero','Mantenimiento vehículo','Otros'
  ],
  '🍿 Entretenimiento': [
    'Streaming','Restaurantes','Cine','Salidas','Viajes','Vacaciones','Otros'
  ],
  '👕 Vestuario': [
    'Ropa','Zapatos','Uniforme','Otros'
  ],
  '💅 Salud y Belleza': [
    'Medicina prepagada','Gimnasio','Droguería',
    'Cita médica','Cita pediátrica','Peluquería','Servicios estéticos','Otros'
  ],
  '📚 Educación': [
    'Universidad','Colegio','Jardín','Matrícula','Actividades extracurriculares','Otros'
  ],
  '🛡️ Seguros e Impuestos': [
    'Seguro de vida','Seguro de hogar','Seguro vehículo',
    'SOAT','Impuestos vehículo','Impuesto predial'
  ],
  '🎁 Regalos y Celebraciones': [
    'Regalos','Celebraciones','Otros'
  ],
  '🐷 Ahorro': [
    'Ahorro programado','Fondo emergencia','Otros'
  ]
};

// ── RENOMBRES HISTÓRICOS ──────────────────────────────────────────────────────

const ITEM_RENAMES = {
  'Seguro vida / hogar':      'Seguro de vida / hogar',
  'Impuesto vehículo':        'Impuestos vehículo',
  'Combustible / peajes':     'Gasolina',
  'Colegios / universidades': 'Colegio'
};

// ── FORMATEADORES ─────────────────────────────────────────────────────────────

function fmt(n) {
  return '$' + Math.round(n || 0).toLocaleString('es-CO');
}

function raw(id) {
  return parseFloat(document.getElementById(id)?.value) || 0;
}

// ── ÍTEMS DE CATEGORÍA ────────────────────────────────────────────────────────

// DA-2: planItems() es la única forma correcta de obtener ítems de una categoría
function isAutoItem(item) {
  return !!item && (item.auto === true || /Gastos hormiga/i.test(item.label || ''));
}

function planItems(cat) {
  return (cat.items || []).filter(item => !isAutoItem(item));
}

function stripAutoItems(data) {
  if (data && data.categories)
    data.categories = data.categories.map(cat => ({ ...cat, items: planItems(cat) }));
  return data;
}

function mergeItem(base, item) {
  base.value  = (base.value  || 0) + (item.value  || 0);
  base.budget = Math.max(base.budget || 0, item.budget || 0);
  base.fixed  = !!(base.fixed || item.fixed);
  if (item.by) base.by = item.by;
  if (item.frecuencia && !base.frecuencia) base.frecuencia = item.frecuencia;
  if (item.months || base.months)
    base.months = [...new Set([...(base.months || []), ...(item.months || [])])].sort((a, b) => a - b);
}

function normalizeCategoryItems(cat) {
  const byLabel = {};
  planItems(cat).forEach(item => {
    const label = ITEM_RENAMES[item.label] || item.label;
    const clean = { ...item, label, auto: false };
    if (byLabel[label]) mergeItem(byLabel[label], clean);
    else byLabel[label] = clean;
  });
  return Object.values(byLabel);
}

// ── CANONICAL LABEL — DA-3 ────────────────────────────────────────────────────
// Repara encodings corruptos. NUNCA modificar sin revisar migraciones históricas.

function canonicalLabel(label) {
  if (!label) return '';
  const EXACT = {
    'Agua y Energ?a':'Agua y Energía','Administraci?n':'Administración',
    'Alimentaci?n':'Alimentación','Aseo y v?veres':'Aseo y víveres',
    'Transporte p?blico':'Transporte público','Educaci?n':'Educación',
    'Jard?n':'Jardín','Servicio Dom?stico':'Servicio Doméstico',
    'Intereses Cesant?as Empleada':'Intereses Cesantías Empleada',
    'Cesant?as Empleada':'Cesantías Empleada',
    'Prima Medio A?o Empleada':'Prima Junio Empleada',
    'Prima Fin de A?o Empleada':'Prima Diciembre Empleada',
    'Salario Ni?era':'Salario Niñera',
    'Intereses Cesant?as Ni?era':'Intereses Cesantías Niñera',
    'Cesant?as Ni?era':'Cesantías Niñera',
    'Prima Medio A?o Ni?era':'Prima Junio Niñera',
    'Prima Fin de A?o Ni?era':'Prima Diciembre Niñera',
    'Prima Junio Ni?era':'Prima Junio Niñera',
    'Prima Diciembre Ni?era':'Prima Diciembre Niñera',
    'Peluquer?a':'Peluquería','Depilaci?n':'Depilación',
    'Droguer?a':'Droguería','Citas m?dicas':'Citas médicas',
    'Citas pedi?tricas':'Citas pediátricas',
    'Seguro veh?culo':'Seguro vehículo',
    'Impuestos veh?culo':'Impuestos vehículo',
    'SOAT veh?culo':'SOAT vehículo',
    'Agua y Energ\uFFFDa':'Agua y Energía','Administraci\uFFFDn':'Administración',
    'Alimentaci\uFFFDn':'Alimentación','Aseo y v\uFFFDveres':'Aseo y víveres',
    'Transporte p\uFFFDblico':'Transporte público','Educaci\uFFFDn':'Educación',
    'Jard\uFFFDn':'Jardín','Servicio Dom\uFFFDstico':'Servicio Doméstico',
    'Intereses Cesant\uFFFDas Empleada':'Intereses Cesantías Empleada',
    'Cesant\uFFFDas Empleada':'Cesantías Empleada',
    'Prima Medio A\uFFFDo Empleada':'Prima Junio Empleada',
    'Prima Fin de A\uFFFDo Empleada':'Prima Diciembre Empleada',
    'Salario Ni\uFFFDera':'Salario Niñera',
    'Intereses Cesant\uFFFDas Ni\uFFFDera':'Intereses Cesantías Niñera',
    'Cesant\uFFFDas Ni\uFFFDera':'Cesantías Niñera',
    'Prima Medio A\uFFFDo Ni\uFFFDera':'Prima Junio Niñera',
    'Prima Fin de A\uFFFDo Ni\uFFFDera':'Prima Diciembre Niñera',
    'Prima Junio Ni\uFFFDera':'Prima Junio Niñera',
    'Prima Diciembre Ni\uFFFDera':'Prima Diciembre Niñera',
    'Peluquer\uFFFDa':'Peluquería','Depilaci\uFFFDn':'Depilación',
    'Droguer\uFFFDa':'Droguería','Citas m\uFFFDdicas':'Citas médicas',
    'Citas pedi\uFFFDtricas':'Citas pediátricas',
    'Seguro veh\uFFFDculo':'Seguro vehículo',
    'Impuestos veh\uFFFDculo':'Impuestos vehículo',
    'SOAT veh\uFFFDculo':'SOAT vehículo',
    'Servicio Dom\uFFFDstico':'Servicio Doméstico',
    'Seguro vehÃ­culo':'Seguro vehículo',
    'Impuestos vehÃ­culo':'Impuestos vehículo',
    'SOAT vehÃ­culo':'SOAT vehículo',
    'Medicina prepagadaJaime':'Medicina prepagada',
    'Impuestos vehiculoMay':'Impuestos vehículo'
  };
  let s = label.trim();
  s = s.replace(/Ã­/g,'í').replace(/Ã©/g,'é').replace(/Ã¡/g,'á')
       .replace(/Ã³/g,'ó').replace(/Ãº/g,'ú').replace(/Ã±/g,'ñ');
  if (EXACT[s])        s = EXACT[s];
  if (ITEM_RENAMES[s]) s = ITEM_RENAMES[s];
  return s;
}

// ── MIGRACIÓN DE CATEGORÍAS ───────────────────────────────────────────────────

function migrateCategories(data) {
  if (!data || !data.categories) return data;
  const plan = {
    'Seguros e Impuestos': {
      remove: ['Seguro vida / hogar','Impuesto vehículo'],
      ensure: [
        { label:'Seguro de vida / hogar', fixed:true },
        { label:'Seguro vehículo',        fixed:true },
        { label:'Impuesto predial',       fixed:true, months:[3] },
        { label:'Impuestos vehículo',     fixed:true, months:[4] },
        { label:'SOAT vehículo',          fixed:true, months:[8] }
      ]
    },
    'Alimentación': {
      remove: [],
      ensure: [
        { label:'Frutas y verduras', fixed:false },
        { label:'Aseo y víveres',    fixed:false },
        { label:'Lonchera',          fixed:false },
        { label:'Restaurantes',      fixed:false }
      ]
    },
    'Transporte': {
      remove: ['Combustible / peajes'],
      ensure: [
        { label:'Gasolina',            fixed:false },
        { label:'Peajes',              fixed:false },
        { label:'Transporte público',  fixed:false }
      ]
    },
    'Educación': {
      remove: ['Colegios / universidades'],
      ensure: [
        { label:'Colegio',                      fixed:true  },
        { label:'Jardín',                       fixed:true  },
        { label:'Actividades extracurriculares',fixed:false },
        { label:'Cuotas extras',                fixed:false }
      ]
    },
    'Servicio Doméstico': {
      remove: [],
      ensure: [
        { label:'Salario Empleada',             fixed:true              },
        { label:'Intereses Cesantías Empleada', fixed:true, months:[0]  },
        { label:'Cesantías Empleada',           fixed:true, months:[1]  },
        { label:'Prima Junio Empleada',         fixed:true, months:[5]  },
        { label:'Prima Diciembre Empleada',     fixed:true, months:[11] },
        { label:'Salario Niñera',               fixed:true              },
        { label:'Intereses Cesantías Niñera',   fixed:true, months:[0]  },
        { label:'Cesantías Niñera',             fixed:true, months:[1]  },
        { label:'Prima Junio Niñera',           fixed:true, months:[5]  },
        { label:'Prima Diciembre Niñera',       fixed:true, months:[11] }
      ]
    }
  };
  let changed = false;
  data.categories = data.categories.map(cat => {
    const mig = plan[cat.name];
    if (!mig) return cat;
    let items = cat.items.map(it => {
      if (ITEM_RENAMES[it.label]) { it = { ...it, label: ITEM_RENAMES[it.label] }; changed = true; }
      return it;
    }).filter(it => {
      if (!(mig.remove || []).includes(it.label)) return true;
      if ((it.value || 0) > 0 || (it.budget || 0) > 0) return true;
      changed = true; return false;
    });
    mig.ensure.forEach(newIt => {
      const exists = items.find(it => it.label === newIt.label);
      if (!exists) {
        items.push({ label:newIt.label, value:0, budget:0, fixed:newIt.fixed, ...(newIt.months ? { months:newIt.months } : {}) });
        changed = true;
      } else if (newIt.months && !exists.months) {
        exists.months = newIt.months; changed = true;
      }
    });
    items = normalizeCategoryItems({ items });
    return { ...cat, items };
  });
  return { data, changed };
}
