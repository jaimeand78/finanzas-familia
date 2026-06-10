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
    'Gas','Internet','Telefonía','Mantenimiento Hogar','Otros'
  ],
  '🧺 Alimentación': [
    'Frutas y Verduras','Aseo y Víveres','Loncheras','Otros'
  ],
  '🚗 Transporte': [
    'Combustible','Transporte Público','Peajes',
    'Parqueaderos','Mantenimiento Vehículo','Cuota Crédito / Leasing','Otros'
  ],
  '🍿 Entretenimiento y Salidas': [
    'Streaming','Restaurantes','Cine','Salidas','Viajes','Vacaciones','Otros'
  ],
  '👕 Vestuario': [
    'Ropa','Zapatos','Uniformes','Otros'
  ],
  '💅 Salud y Belleza': [
    'Medicina Prepagada','Gimnasio','Droguería',
    'Cita Médica','Cita Pediátrica','Peluquería','Servicios Estéticos','Otros'
  ],
  '📚 Educación': [
    'Universidad','Colegio','Jardín','Matrícula','Actividades Extracurriculares','Otros'
  ],
  '🛡️ Seguros e Impuestos': [
    'Seguro de Vida','Seguro de Hogar','Seguro Vehículo',
    'SOAT','Impuestos Vehículo','Impuesto Predial','Otros'
  ],
  '🎁 Regalos y Celebraciones': [
    'Regalos','Celebraciones','Otros'
  ],
  '🐷 Ahorro': [
    'Ahorro Programado','Fondo Emergencia','Otros'
  ],
  '🤝 Servicio Doméstico': [
    'Salario','Prestaciones','Otros'
  ]
};

// ── RENOMBRES HISTÓRICOS ──────────────────────────────────────────────────────

const ITEM_RENAMES = {
  'Seguro vida / hogar':      'Seguro de Vida',
  'Seguro de vida / hogar':   'Seguro de Vida',
  'Impuesto vehículo':        'Impuestos Vehículo',
  'Impuestos vehículo':       'Impuestos Vehículo',
  'SOAT vehículo':            'SOAT',
  'Combustible / peajes':     'Combustible',
  'Gasolina':                 'Combustible',
  'Colegios / universidades': 'Colegio',
  'Ahorro mensual':           'Ahorro Programado',
  'Ahorro programado':        'Ahorro Programado',
  'Fondo emergencia':         'Fondo Emergencia',
  'Transporte público':       'Transporte Público',
  'Mantenimiento hogar':      'Mantenimiento Hogar',
  'Mantenimiento vehículo':   'Mantenimiento Vehículo',
  'Cuota crédito / leasing':  'Cuota Crédito / Leasing',
  'Frutas y verduras':        'Frutas y Verduras',
  'Aseo y víveres':           'Aseo y Víveres',
  'Lonchera':                 'Loncheras',
  'Medicina prepagada':       'Medicina Prepagada',
  'Cita médica':              'Cita Médica',
  'Citas médicas':            'Cita Médica',
  'Cita pediátrica':          'Cita Pediátrica',
  'Citas pediátricas':        'Cita Pediátrica',
  'Servicios estéticos':      'Servicios Estéticos',
  'Actividades extracurriculares': 'Actividades Extracurriculares',
  'Seguro vehículo':          'Seguro Vehículo',
  'Seguro de hogar':          'Seguro de Hogar',
  'Seguro de vida':           'Seguro de Vida',
  'Impuesto predial':         'Impuesto Predial',
  'Salario empleada':         'Salario',
  'Salario niñera':           'Salario',
  'Salario Empleada':         'Salario',
  'Salario Niñera':           'Salario',
  'Uniforme':                 'Uniformes',
  'Parqueadero':              'Parqueaderos',
  'Ropa':                     'Ropa',
  'Zapatos':                  'Zapatos'
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
      remove: ['Seguro vida / hogar','Seguro de vida / hogar','Impuesto vehículo','SOAT vehículo'],
      ensure: [
        { label:'Seguro de Vida',     fixed:true },
        { label:'Seguro de Hogar',    fixed:true },
        { label:'Seguro Vehículo',    fixed:true },
        { label:'SOAT',               fixed:true, months:[8] },
        { label:'Impuestos Vehículo', fixed:true, months:[4] },
        { label:'Impuesto Predial',   fixed:true, months:[3] }
      ]
    },
    'Alimentación': {
      remove: ['Restaurantes','Mercado'],
      ensure: [
        { label:'Frutas y Verduras', fixed:false },
        { label:'Aseo y Víveres',    fixed:false },
        { label:'Loncheras',         fixed:false }
      ]
    },
    'Transporte': {
      remove: ['Combustible / peajes','Gasolina'],
      ensure: [
        { label:'Combustible',             fixed:false },
        { label:'Transporte Público',      fixed:false },
        { label:'Peajes',                  fixed:false },
        { label:'Parqueaderos',            fixed:false },
        { label:'Mantenimiento Vehículo',  fixed:false },
        { label:'Cuota Crédito / Leasing', fixed:true  }
      ]
    },
    'Entretenimiento': {
      remove: [],
      ensure: [],
      rename: 'Entretenimiento y Salidas'
    },
    'Entretenimiento y Salidas': {
      remove: [],
      ensure: [
        { label:'Streaming',    fixed:true  },
        { label:'Restaurantes', fixed:false },
        { label:'Cine',         fixed:false },
        { label:'Salidas',      fixed:false },
        { label:'Viajes',       fixed:false },
        { label:'Vacaciones',   fixed:false }
      ]
    },
    'Educación': {
      remove: ['Colegios / universidades','Cuotas extras','Actividades extracurriculares'],
      ensure: [
        { label:'Universidad',                   fixed:true  },
        { label:'Colegio',                       fixed:true  },
        { label:'Jardín',                        fixed:true  },
        { label:'Matrícula',                     fixed:false },
        { label:'Actividades Extracurriculares', fixed:false }
      ]
    },
    'Servicio Doméstico': {
      remove: [
        'Salario Empleada','Salario Niñera','Salario empleada','Salario niñera',
        'Intereses Cesantías Empleada','Cesantías Empleada',
        'Prima Junio Empleada','Prima Diciembre Empleada',
        'Intereses Cesantías Niñera','Cesantías Niñera',
        'Prima Junio Niñera','Prima Diciembre Niñera'
      ],
      ensure: [
        { label:'Salario',      fixed:true  },
        { label:'Prestaciones', fixed:false }
      ]
    },
    'Vivienda': {
      remove: ['Servicio doméstico','Hipoteca / Arriendo'],
      ensure: [
        { label:'Arriendo / Hipoteca', fixed:true  },
        { label:'Administración',      fixed:true  },
        { label:'Agua y Energía',      fixed:true  },
        { label:'Gas',                 fixed:true  },
        { label:'Internet',            fixed:true  },
        { label:'Telefonía',           fixed:false },
        { label:'Mantenimiento Hogar', fixed:false }
      ]
    },
    'Vestuario': {
      remove: ['Uniforme'],
      ensure: [
        { label:'Ropa',      fixed:false },
        { label:'Zapatos',   fixed:false },
        { label:'Uniformes', fixed:false }
      ]
    },
    'Salud y Belleza': {
      remove: ['Citas médicas','Cita médica','Citas pediátricas'],
      ensure: [
        { label:'Medicina Prepagada',  fixed:true  },
        { label:'Gimnasio',            fixed:true  },
        { label:'Droguería',           fixed:false },
        { label:'Cita Médica',         fixed:false },
        { label:'Cita Pediátrica',     fixed:false },
        { label:'Peluquería',          fixed:false },
        { label:'Servicios Estéticos', fixed:false }
      ]
    },
    'Ahorro': {
      remove: ['Ahorro mensual','Ahorro programado'],
      ensure: [
        { label:'Ahorro Programado', fixed:true  },
        { label:'Fondo Emergencia',  fixed:false }
      ]
    }
  };

  // Categorías nuevas en v2 — se agregan si el hogar no las tiene
  const newCats = [
    { name:'Vestuario', items:[
      { label:'Ropa',      value:0, budget:0, fixed:false },
      { label:'Zapatos',   value:0, budget:0, fixed:false },
      { label:'Uniformes', value:0, budget:0, fixed:false }
    ]},
    { name:'Regalos y Celebraciones', items:[
      { label:'Regalos',       value:0, budget:0, fixed:false },
      { label:'Celebraciones', value:0, budget:0, fixed:false }
    ]},
    { name:'Entretenimiento y Salidas', items:[
      { label:'Streaming',    value:0, budget:0, fixed:true  },
      { label:'Restaurantes', value:0, budget:0, fixed:false },
      { label:'Cine',         value:0, budget:0, fixed:false },
      { label:'Salidas',      value:0, budget:0, fixed:false },
      { label:'Viajes',       value:0, budget:0, fixed:false },
      { label:'Vacaciones',   value:0, budget:0, fixed:false }
    ]}
  ];

  let changed = false;

  // Renombrar categoría Entretenimiento → Entretenimiento y Salidas
  data.categories = data.categories.map(c => {
    if (c.name === 'Entretenimiento') { changed = true; return { ...c, name: 'Entretenimiento y Salidas' }; }
    return c;
  });

  newCats.forEach(nc => {
    if (!data.categories.find(c => c.name === nc.name)) {
      data.categories.push(nc);
      changed = true;
    }
  });

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
