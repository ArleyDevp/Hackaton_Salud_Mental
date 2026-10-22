// ---------------------------------------------------------------------------
// Ayuda inmediata — lista depurada y verificada para Villavicencio.
// Se mantiene local a propósito: la ayuda en crisis nunca debe depender de una
// petición de red ni quedar escondida si el servidor no responde.
// Fuentes: Directorio Nacional de Líneas de Salud Mental (MinSalud, 2025),
// Alcaldía de Villavicencio, Gobernación del Meta, Secretaría de la Mujer.
// ---------------------------------------------------------------------------
export const CRISIS_LINES = [
  {
    id: 'yo-te-escucho',
    name: 'Yo Te Escucho — Villavicencio',
    kind: 'Línea local de escucha y orientación',
    scope: 'Villavicencio',
    enVillavicencio: true,
    badge: 'local',
    hours: '24 horas, 7 días',
    phones: [{ label: 'Llamada gratuita', number: '01 8000 931 089', tel: 'tel:018000931089' }],
    whatsapp: { label: 'WhatsApp', number: '316 390 7010', url: 'https://wa.me/573163907010' },
    source: 'Alcaldía de Villavicencio · ESE Municipal'
  },
  {
    id: 'meta',
    name: 'Línea Amiga de Salud Mental — Meta',
    kind: 'Línea departamental de apoyo psicológico',
    scope: 'Departamento del Meta',
    enVillavicencio: true,
    badge: 'local',
    hours: '24 horas, 7 días',
    phones: [
      { label: 'Desde celular', number: '#775', tel: 'tel:#775' },
      { label: 'Línea fija / celular', number: '312 575 1135', tel: 'tel:3125751135' }
    ],
    whatsapp: null,
    source: 'Gobernación del Meta · E.S.E. “Solución Salud”'
  },
  {
    id: 'violeta',
    name: 'Línea Violeta — Villavicencio',
    kind: 'Orientación en crisis por violencia de género',
    scope: 'Villavicencio',
    enVillavicencio: true,
    badge: 'local',
    hours: '24 horas, 7 días',
    phones: [{ label: 'Llamada', number: '316 742 6938', tel: 'tel:3167426938' }],
    whatsapp: { label: 'WhatsApp', number: '316 742 6938', url: 'https://wa.me/573167426938' },
    source: 'Secretaría de la Mujer de Villavicencio'
  },
  {
    id: 'emergencias',
    name: 'Emergencias — Peligro inmediato',
    kind: 'Activa ambulancia o Policía Metropolitana',
    scope: 'Nacional',
    badge: 'urgent',
    hours: '24 horas, 7 días',
    phones: [{ label: 'Línea nacional', number: '123', tel: 'tel:123' }],
    whatsapp: null,
    source: 'Línea nacional de emergencias'
  }
];
