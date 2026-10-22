import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CRISIS_LINES } from './crisis.js';
import AnimatedBackground from './components/AnimatedBackground.jsx';
import useReducedMotion from './hooks/useReducedMotion.js';

/* Cada pestaña tiene su propio fondo animado */
const BACKGROUND_VARIANT = {
  inicio: 'inicio',
  lineas: 'ayuda',
  viento: 'viento',
  centros: 'centros',
  paz: 'paz',
  regalate: 'momentos'
};

/* ==========================================================================
   Iconos (SVG en línea, sin dependencias externas)
   ========================================================================== */
const Icon = ({ name, size = 20 }) => {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true
  };
  switch (name) {
    case 'phone':
      return (
        <svg {...common}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.1 9.9a16 16 0 0 0 6 6l1.26-1.26a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg {...common} strokeWidth={1.6}>
          <path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5z" />
        </svg>
      );
    case 'heart':
      return (
        <svg {...common}>
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'map-pin':
      return (
        <svg {...common}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case 'book':
      return (
        <svg {...common}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
    case 'leaf':
      return (
        <svg {...common}>
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      );
    case 'tree':
      // Pino de dos pisos: la silueta escalonada es la que se lee como arbol
      // a 40 px. Una copa redonda cerrada en trazo parece un globo.
      return (
        <svg {...common}>
          <path d="M12 2.5 5.5 11h3.4L5 17.2h14L16.1 11h3.4L12 2.5Z" />
          <path d="M12 17.2V21" />
          <path d="M9.5 21h5" />
        </svg>
      );
    case 'check':
      return (
        <svg {...common}>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      );
    case 'arrow':
      return (
        <svg {...common}>
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      );
    case 'menu':
      return (
        <svg {...common}>
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      );
    case 'close':
      return (
        <svg {...common}>
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      );
    case 'moon':
      return (
        <svg {...common}>
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      );
    case 'wind':
      return (
        <svg {...common}>
          <path d="M9.6 4.6A2 2 0 1 1 11 8H2M12.6 19.4A2 2 0 1 0 14 16H2M17.7 7.7A2.5 2.5 0 1 1 19.5 12H2" />
        </svg>
      );
    case 'users':
      return (
        <svg {...common}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'lock':
      return (
        <svg {...common}>
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );
    case 'sparkle':
      return (
        <svg {...common}>
          <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
        </svg>
      );
    case 'pencil':
      return (
        <svg {...common}>
          <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          <path d="M15 5l4 4" />
        </svg>
      );
    case 'music':
      return (
        <svg {...common}>
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      );
    case 'pause':
      return (
        <svg {...common}>
          <rect x="6" y="4" width="4" height="16" rx="1" />
          <rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
      );
    default:
      return null;
  }
};

/* ==========================================================================
   Datos y utilidades
   ========================================================================== */
const TABS = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'lineas', label: 'Líneas de ayuda' },
  { id: 'viento', label: 'Al viento' },
  { id: 'centros', label: 'Centros presenciales' },
  { id: 'paz', label: 'Zona de paz' },
  { id: 'regalate', label: 'Regálate momentos' }
];

const FALLBACK_PHRASES = [
  'Hoy basta con dar un paso pequeño.',
  'No tienes que tener todas las respuestas hoy.',
  'Lo que sientes es real y es pesado.',
  'Esto puede cambiar, aunque hoy no lo parezca.',
  'No estás solo/a: hay gente dispuesta a escucharte.',
  'Un paso a la vez es suficiente por hoy.',
  'Pedir ayuda también es una forma de cuidarte.',
  'Este momento también va a pasar.'
];

// Centro de Villavicencio: se usa como vista general cuando una ficha no tiene
// coordenadas verificadas (mejor un mapa sin punto que un punto inventado).
const VILLAVICENCIO_CENTRO = { lat: 4.142, lon: -73.6266 };

function tieneCoordenadas(c) {
  return Boolean(c) && Number.isFinite(c.lat) && Number.isFinite(c.lon);
}

function osmUrl(lat, lon, conMarcador = true) {
  const d = 0.07;
  const bbox = [
    (lon - d).toFixed(4),
    (lat - d).toFixed(4),
    (lon + d).toFixed(4),
    (lat + d).toFixed(4)
  ].join('%2C');
  const marcador = conMarcador
    ? `&marker=${lat.toFixed(4)}%2C${lon.toFixed(4)}`
    : '';
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik${marcador}`;
}

// Frase que rota de forma automática con efecto de desvanecer.
function useRotatingPhrase(phrases, interval = 5200) {
  const [index, setIndex] = useState(() =>
    phrases && phrases.length > 1 ? Math.floor(Math.random() * phrases.length) : 0
  );
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!phrases || phrases.length < 2) return undefined;
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % phrases.length);
        setVisible(true);
      }, 420);
    }, interval);
    return () => clearInterval(id);
  }, [phrases, interval]);

  return { text: phrases ? phrases[index] : '', visible };
}

/* --------------------------------------------------------------------------
   Música de la Zona de paz: beats suaves y tranquilizantes generados con
   Web Audio. Arranca sola al entrar a la pestaña, no hay voces ni podcasts,
   no depende de la red y siempre se puede pausar.
   -------------------------------------------------------------------------- */
const BEAT_SECONDS = 60 / 52; // 52 pulsos por minuto: ritmo lento y calmado
const CHIME_NOTES = [392.0, 440.0, 523.25, 493.88]; // sol, la, do' y si

function useCalmMusic() {
  const [playing, setPlaying] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [error, setError] = useState(false);

  const ctxRef = useRef(null);
  const masterRef = useRef(null);
  const nodesRef = useRef([]);
  const timerRef = useRef(null);
  const nextBeatRef = useRef(0);
  const beatIndexRef = useRef(0);

  // Pad cálido que respira de fondo mientras suenan los beats.
  const startPad = (ctx, master) => {
    const chord = [
      [174.61, 0.055], // F3
      [220.0, 0.05], // A3
      [261.63, 0.045], // C4
      [329.63, 0.03] // E4
    ];

    chord.forEach(([freq, level], i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(level, ctx.currentTime + 6);

      // vibrato lentísimo: el pad parece que respira
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.05 + i * 0.017;
      lfoGain.gain.value = level * 0.45;
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);

      osc.connect(gain);
      gain.connect(master);
      osc.start();
      lfo.start();
      nodesRef.current.push(osc, lfo);
    });
  };

  // Beat suave: golpe grave que se apaga despacio, como un latido calmado.
  const scheduleBeat = (ctx, master, when, index) => {
    const kick = ctx.createOscillator();
    const kickGain = ctx.createGain();
    kick.type = 'sine';
    kick.frequency.setValueAtTime(112, when);
    kick.frequency.exponentialRampToValueAtTime(45, when + 0.25);
    kickGain.gain.setValueAtTime(0.0001, when);
    kickGain.gain.exponentialRampToValueAtTime(index % 4 === 0 ? 0.16 : 0.085, when + 0.025);
    kickGain.gain.exponentialRampToValueAtTime(0.0001, when + 0.75);
    kick.connect(kickGain).connect(master);
    kick.start(when);
    kick.stop(when + 0.8);
    nodesRef.current.push(kick);

    // Cada dos beats, una campanita muy tenue y lejana.
    if (index % 2 === 1) {
      const bell = ctx.createOscillator();
      const bellGain = ctx.createGain();
      bell.type = 'sine';
      bell.frequency.value = CHIME_NOTES[((index - 1) / 2) % CHIME_NOTES.length];
      bellGain.gain.setValueAtTime(0.0001, when);
      bellGain.gain.exponentialRampToValueAtTime(0.05, when + 0.05);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, when + 1.7);
      bell.connect(bellGain).connect(master);
      bell.start(when);
      bell.stop(when + 1.8);
      nodesRef.current.push(bell);
    }
  };

  // Programa los beats que faltan dentro de una ventana corta de tiempo.
  const scheduler = () => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;
    let guard = 0;
    while (nextBeatRef.current < ctx.currentTime + 0.8 && guard < 32) {
      scheduleBeat(ctx, master, nextBeatRef.current, beatIndexRef.current);
      nextBeatRef.current += BEAT_SECONDS;
      beatIndexRef.current += 1;
      guard += 1;
    }
  };

  // Enciende los beats y el pad, con una entrada suave de 4 segundos.
  const start = () => {
    if (ctxRef.current) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) {
      setError(true);
      return;
    }

    try {
      const ctx = new AC();
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.0001, ctx.currentTime);
      master.connect(ctx.destination);

      ctxRef.current = ctx;
      masterRef.current = master;
      nodesRef.current = [];
      nextBeatRef.current = ctx.currentTime + 0.2;
      beatIndexRef.current = 0;

      master.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + 4);

      startPad(ctx, master);
      scheduler();
      timerRef.current = setInterval(scheduler, 60);

      setError(false);
      setPlaying(true);

      // Los navegadores exigen un gesto previo del usuario: si no lo hay, avisamos.
      if (ctx.state === 'suspended') {
        ctx
          .resume()
          .then(() => setBlocked(false))
          .catch(() => setBlocked(true));
      }
    } catch {
      ctxRef.current = null;
      masterRef.current = null;
      setError(true);
      setPlaying(false);
    }
  };

  const stop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    try {
      const ctx = ctxRef.current;
      const master = masterRef.current;
      nodesRef.current.forEach((n) => {
        try {
          n.stop();
        } catch {
          /* nodo ya detenido */
        }
      });
      nodesRef.current = [];
      if (ctx && master) {
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
        master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
        setTimeout(() => {
          try {
            ctx.close();
          } catch {
            /* contexto ya cerrado */
          }
        }, 1000);
      }
    } catch {
      /* la música siempre se puede apagar */
    } finally {
      ctxRef.current = null;
      masterRef.current = null;
      setPlaying(false);
      setBlocked(false);
    }
  };

  // Al salir de la pestaña la música se detiene: nada queda sonando solo.
  useEffect(() => () => stop(), []);

  // Si el navegador bloqueó el autoplay, basta con tocar la pantalla una vez.
  useEffect(() => {
    if (!blocked) return undefined;
    const resume = () => {
      const ctx = ctxRef.current;
      if (ctx && ctx.state === 'suspended') {
        ctx
          .resume()
          .then(() => setBlocked(false))
          .catch(() => { });
      }
    };
    document.addEventListener('pointerdown', resume);
    document.addEventListener('keydown', resume);
    return () => {
      document.removeEventListener('pointerdown', resume);
      document.removeEventListener('keydown', resume);
    };
  }, [blocked]);

  const toggle = () => {
    if (playing) stop();
    else start();
  };

  // Todo el sonido se genera en el dispositivo: no hay audio externo ni podcasts.

  // Arranca sola al entrar a la Zona de paz.
  useEffect(() => {
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { playing, blocked, error, toggle };
}

/* ==========================================================================
   Header (marca a la izquierda, pestañas a la derecha)
   ========================================================================== */
function Header({ tabs, activeTab, setTab }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <button className="brand" onClick={() => setTab('inicio')} aria-label="Ir al inicio">
          <span className="brand-mark">
            <span />
          </span>
          <span className="brand-copy">
            <strong>ruta clara</strong>
            <small>META</small>
          </span>
        </button>

        <nav className={`main-nav ${open ? 'open' : ''}`} aria-label="Rutas de apoyo">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`tab ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => {
                setTab(t.id);
                setOpen(false);
              }}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <button
          className="menu-button"
          aria-label="Abrir menú"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? 'close' : 'menu'} />
        </button>
      </div>
    </header>
  );
}

/* ==========================================================================
   Pantalla de ayuda inmediata (overlay)
   ========================================================================== */
function CrisisModal({ lines, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="crisis-overlay" onClick={onClose}>
      <div
        className="crisis-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="crisis-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="crisis-close" ref={closeRef} onClick={onClose} aria-label="Cerrar">
          <Icon name="close" size={18} />
        </button>

        <span className="crisis-kicker">Ayuda inmediata · Villavicencio</span>
        <h2 id="crisis-title">Necesito hablar con alguien ahora</h2>
        <p className="crisis-lead">
          Estás a un toque de hablar con alguien. Estos canales son gratuitos y atienden las 24
          horas. Elige el que te sea más fácil y llama o escribe.
        </p>

        <div className="crisis-validate">
          Lo que sientes es real y es pesado. Esto puede cambiar, aunque hoy no lo parezca. Da un
          paso pequeño: habla con alguien hoy.
        </div>

        <div className="crisis-list">
          {lines.map((l) => (
            <div className="crisis-item" key={l.id}>
              <div className="crisis-item-top">
                <div>
                  <h3>{l.name}</h3>
                  <small>
                    {l.kind} · {l.hours}
                  </small>
                </div>
                <span className={`crisis-badge ${l.badge}`}>
                  {l.badge === 'urgent' ? 'Peligro inmediato' : l.scope}
                </span>
              </div>

              <div className="crisis-actions">
                {l.phones.map((p) => (
                  <a className="crisis-call" href={p.tel} key={p.number}>
                    <Icon name="phone" size={17} /> {p.label}: {p.number}
                  </a>
                ))}
                {l.whatsapp && (
                  <a className="crisis-call wa" href={l.whatsapp.url} target="_blank" rel="noreferrer">
                    <Icon name="whatsapp" size={17} /> {l.whatsapp.label}: {l.whatsapp.number}
                  </a>
                )}
              </div>

              <p className="crisis-source">Fuente: {l.source}</p>
            </div>
          ))}
        </div>

        <div className="crisis-footer">
          <Icon name="heart" size={15} />
          <span>
            Si estás en peligro inmediato, llama al <strong>123</strong> o acude a urgencias. Este
            espacio acompaña, pero no reemplaza la atención profesional.
          </span>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   Separador entre secciones
   Un pequeño brote con dos hojas —el motivo que ya usa toda la app— y dos
   líneas que se desvanecen hacia los lados. Marca el cambio de sección
   sin cortar la lectura ni añadir ruido.
   ========================================================================== */
function SectionDivider() {
  return (
    <div className="section-divider" aria-hidden="true">
      <svg
        className="section-divider-sprig"
        viewBox="0 0 48 28"
        width="30"
        height="17.5"
        focusable="false"
      >
        <path
          d="M24 26.5C24 21.5 24 16.5 24 12"
          fill="none"
          stroke="#7cae6a"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path d="M24 17.5C16 17.5 10 13.5 10 6.5C18 6.5 24 10.5 24 17.5Z" fill="#a3cd87" />
        <path d="M24 12.5C30 12.5 35 9 35 4C29 4 24 7.5 24 12.5Z" fill="#b9d69b" />
      </svg>
    </div>
  );
}

/* ==========================================================================
   Dibujo libre
   ========================================================================== */
// Tonos pasteles de la paleta Calm UI. Se eligen visibles sobre el papel
// crema: versiones más claras de la misma paleta se perderían de verdad.
const DRAW_COLORS = [
  { name: 'Azul', value: '#287787' },
  { name: 'Celeste', value: '#8ec9dc' },
  { name: 'Verde', value: '#8fbfa0' },
  { name: 'Lavanda', value: '#a89ee0' },
  { name: 'Arena', value: '#dcc79b' },
  { name: 'Rosa', value: '#e0a3ae' },
  { name: 'Tinta', value: '#3d5a63' }
];

function DrawModal({ onClose }) {
  const canvasRef = useRef(null);
  const closeRef = useRef(null);
  const paintingRef = useRef(false);
  const lastRef = useRef(null);
  const usedRef = useRef(false);
  const [color, setColor] = useState(DRAW_COLORS[0].value);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  // El lienzo se ajusta a su espacio y se reescala con la pantalla sin
  // perder lo que ya se dibujo.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const fit = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = window.devicePixelRatio || 1;
      const foto = usedRef.current ? canvas.toDataURL() : null;

      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (foto) {
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
        img.src = foto;
      }
    };

    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  const punto = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const trazo = (ctx, desde, hasta) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(desde.x, desde.y);
    ctx.lineTo(hasta.x, hasta.y);
    ctx.stroke();
  };

  // Pointer events: el mismo trazo sirve con mouse, dedo o lapiz.
  const empezar = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.setPointerCapture?.(e.pointerId);
    } catch {
      // Algunos entornos no capturan punteros sinteticos: se dibuja igual.
    }
    paintingRef.current = true;    usedRef.current = true;
    const p = punto(e);
    lastRef.current = p;
    const ctx = canvas.getContext('2d');
    trazo(ctx, p, { x: p.x + 0.1, y: p.y });
  };

  const mover = (e) => {
    if (!paintingRef.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const p = punto(e);
    trazo(ctx, lastRef.current, p);
    lastRef.current = p;
  };

  const terminar = () => {
    paintingRef.current = false;
  };

  const limpiar = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    usedRef.current = false;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  };

  const contenido = (
    <div className="crisis-overlay" onClick={onClose}>
      <div
        className="crisis-panel draw-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="draw-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="crisis-close" ref={closeRef} onClick={onClose} aria-label="Cerrar">
          <Icon name="close" size={18} />
        </button>

        <span className="crisis-kicker">Creatividad</span>
        <h2 id="draw-title">Dibujo libre</h2>
        <p className="crisis-lead">
          Diez minutos, una hoja y ninguna expectativa. Deja que la mano se mueva: aquí no hay nada
          que dibujar bien.
        </p>

        <div className="draw-stage">
          <canvas
            ref={canvasRef}
            className="draw-canvas"
            onPointerDown={empezar}
            onPointerMove={mover}
            onPointerUp={terminar}
            onPointerLeave={terminar}
            onPointerCancel={terminar}
            aria-label="Lienzo en blanco para dibujar"
          />
        </div>

        <div className="draw-controls">
          <div className="draw-swatches" role="group" aria-label="Color del pincel">
            {DRAW_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                className={`draw-swatch ${color === c.value ? 'is-active' : ''}`}
                style={{ background: c.value }}
                onClick={() => setColor(c.value)}
                aria-label={c.name}
                aria-pressed={color === c.value}
                title={c.name}
              />
            ))}
          </div>

          <div className="draw-actions">
            <button type="button" className="draw-clear" onClick={limpiar}>
              Limpiar
            </button>
            <button type="button" className="draw-done" onClick={onClose}>
              Listo
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Se monta en <body>: dentro de <main> el overlay queda atrapado en un
  // contexto de apilado con z-index 1 y el boton flotante de crisis lo tapaba.
  return createPortal(contenido, document.body);
}

/* ==========================================================================
   Talleres y espacios comunitarios
   ========================================================================== */

const FILTROS_TALLERES = [
  { id: 'todos', label: 'Todos' },
  { id: 'presencial', label: 'Presenciales' },
  { id: 'virtual', label: 'Virtuales' }
];

function WorkshopsModal({ talleres, onClose }) {
  const closeRef = useRef(null);
  const [filtro, setFiltro] = useState('todos');
  const [abierto, setAbierto] = useState(talleres[0]?.id ?? null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const visibles = filtro === 'todos' ? talleres : talleres.filter((t) => t.tipo === filtro);
  const cuenta = (id) =>
    id === 'todos' ? talleres.length : talleres.filter((t) => t.tipo === id).length;

  const cambiarFiltro = (id) => {
    const lista = id === 'todos' ? talleres : talleres.filter((t) => t.tipo === id);
    setFiltro(id);
    // Si el taller abierto deja de estar visible, abrimos el primero del filtro.
    if (!lista.some((t) => t.id === abierto)) setAbierto(lista[0]?.id ?? null);
  };

  const contenido = (
    <div className="crisis-overlay" onClick={onClose}>
      <div
        className="crisis-panel workshop-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="workshop-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="crisis-close" ref={closeRef} onClick={onClose} aria-label="Cerrar">
          <Icon name="close" size={18} />
        </button>

        <span className="crisis-kicker workshop-kicker">Talleres y espacios comunitarios</span>
        <h2 id="workshop-title">Actividades para estar con otras personas.</h2>
        <p className="crisis-lead">
          Espacios para compartir con otras personas, presenciales y virtuales. Los datos son de
          ejemplo del prototipo: confirma siempre con la organización antes de asistir.
        </p>

        <div className="workshop-toolbar">
          <div className="workshop-filters" role="group" aria-label="Filtrar por modalidad">
            {FILTROS_TALLERES.map((f) => (
              <button
                key={f.id}
                type="button"
                className="workshop-filter"
                onClick={() => cambiarFiltro(f.id)}
                aria-pressed={filtro === f.id}
              >
                {f.label}
                <span>{cuenta(f.id)}</span>
              </button>
            ))}
          </div>
          <p className="workshop-count" role="status" aria-live="polite">
            {visibles.length} de {talleres.length} talleres
          </p>
        </div>

        {visibles.length === 0 ? (
          <p className="workshop-empty">No hay talleres de ese tipo por ahora.</p>
        ) : (
          <ul className="workshop-list">
            {visibles.map((t, i) => {
              const abiertoAhora = abierto === t.id;

              return (
                <li
                  className={`workshop-item ${abiertoAhora ? 'open' : ''}`}
                  key={t.id}
                  style={{ '--i': i }}
                >
                  <button
                    type="button"
                    className="workshop-toggle"
                    onClick={() => setAbierto(abiertoAhora ? null : t.id)}
                    aria-expanded={abiertoAhora}
                    aria-controls={`taller-${t.id}`}
                  >
                    <span className="workshop-toggle-copy">
                      <strong>{t.actividad}</strong>
                      <small>
                        {t.fecha} · {t.horario}
                      </small>
                    </span>
                    <span className={`workshop-type ${t.tipo === 'virtual' ? 'virtual' : ''}`}>
                      {t.tipo === 'virtual' ? 'Virtual' : 'Presencial'}
                    </span>
                    <span className="workshop-chevron" aria-hidden="true">
                      <Icon name="arrow" size={13} />
                    </span>
                  </button>

                  <div className="workshop-body" id={`taller-${t.id}`} aria-hidden={!abiertoAhora}>
                    <div className="workshop-body-inner">
                      <dl className="workshop-meta">
                        <div>
                          <dt>Día y fecha</dt>
                          <dd>{t.fecha}</dd>
                        </div>
                        <div>
                          <dt>Horario</dt>
                          <dd>{t.horario}</dd>
                        </div>
                        <div>
                          <dt>Duración</dt>
                          <dd>{t.duracion}</dd>
                        </div>
                        <div>
                          <dt>Lugar</dt>
                          <dd>{t.lugar}</dd>
                        </div>
                        <div>
                          <dt>Modalidad</dt>
                          <dd>{t.modalidad}</dd>
                        </div>
                        <div>
                          <dt>Organiza</dt>
                          <dd>{t.organiza}</dd>
                        </div>
                        <div>
                          <dt>Dirigido a</dt>
                          <dd>{t.publico}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="calm-actions workshop-actions">
          <button className="calm-button" onClick={onClose}>
            <Icon name="check" size={16} />
            Entendido
          </button>
        </div>
      </div>
    </div>
  );

  // Mismo motivo que el modal de dibujo: dentro de <main> quedaria debajo
  // del boton flotante de crisis.
  return createPortal(contenido, document.body);
}

/* ==========================================================================
   Inicio
   ========================================================================== */
function HomeTab({ data, phrases, setTab, openCrisis, scrollTo }) {
  const [selected, setSelected] = useState(null);
  const [drawOpen, setDrawOpen] = useState(false);
  const [talleresOpen, setTalleresOpen] = useState(false);
  const needs = data?.needs || [];
  const talleres = data?.talleres || [];
  const phrase = useRotatingPhrase(phrases);

  const choose = (need) => setSelected(need.id);

  const ctaFor = (need) => {
    if (need.route === 'crisis') return { label: 'Ver canales disponibles ahora', action: openCrisis };
    if (need.route === 'lineas') return { label: 'Ver líneas de ayuda', action: () => setTab('lineas') };
    return { label: 'Ver centros en Villavicencio', action: () => setTab('centros') };
  };

  const closing = data?.closing;

  return (
    <>
      <section className="hero">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">
              <span /> Un lugar seguro para orientarte
            </div>
            <h1>
              Encontrar apoyo puede ser <em>más claro</em>.
            </h1>
            <p className="hero-lead">
              Te acompañamos a conocer rutas confiables de salud mental en Villavicencio, a tu ritmo
              y sin juicios.
            </p>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => scrollTo('orientate')}>
                Quiero orientarme
              </button>
            </div>
            <div className="privacy-note">
              <Icon name="lock" size={14} />
              <span>No pedimos ni guardamos tus datos personales.</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="sun-shape" />
            <div className="visual-card">
              <span className="visual-kicker">Recuerda</span>
              <p className={`phrase ${phrase.visible ? 'in' : 'out'}`}>{phrase.text}</p>
              <div className="breath-line">
                <span />
                <small>Haz una pausa</small>
                <span />
              </div>
              <div className="calm-actions centered visual-actions">
                <button className="calm-button" onClick={() => setTab('paz')}>
                  <Icon name="leaf" size={17} /> Zona de paz
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="orientation-section" id="orientate">
        <div className="container">
          <div className="section-heading centered">
            <span className="section-number">01 · Oriéntate</span>
            <h2>¿Qué necesitas en este momento?</h2>
            <p>
              Elige una opción para encontrar un punto de partida. Esto no es una evaluación ni un
              diagnóstico.
            </p>
          </div>

          <div className="need-grid">
            {needs.map((n) => (
              <button
                key={n.id}
                className={`need-card ${selected === n.id ? 'selected' : ''}`}
                onClick={() => choose(n)}
                aria-pressed={selected === n.id}
              >
                <span className="need-icon">
                  <Icon name={n.route === 'crisis' ? 'phone' : 'map-pin'} size={22} />
                </span>
                <span>
                  <strong>{n.title}</strong>
                  <small>{n.subtitle}</small>
                </span>
                <span className="choice-mark">
                  <Icon name="arrow" size={13} />
                </span>
              </button>
            ))}
          </div>

          <div className="need-extra">
            <button
              className="need-card"
              onClick={() => setTalleresOpen(true)}
              aria-haspopup="dialog"
            >
              <span className="need-icon">
                <Icon name="users" size={22} />
              </span>
              <span>
                <strong>Talleres y espacios comunitarios</strong>
                <small>Talleres, caminatas y encuentros</small>
              </span>
              <span className="choice-mark">
                <Icon name="arrow" size={13} />
              </span>
            </button>
          </div>

          {selected && (
            <div className="orientation-result" role="status">
              <div>
                <Icon name="check" size={15} />
                <span>{needs.find((n) => n.id === selected)?.message}</span>
              </div>
              <button onClick={() => ctaFor(needs.find((n) => n.id === selected)).action()}>
                {ctaFor(needs.find((n) => n.id === selected)).label}
              </button>
            </div>
          )}
        </div>
      </section>

      <SectionDivider />

      <section className="resources-section" id="recursos">
        <div className="container">
          <div className="section-heading centered">
            <span className="section-number">02 · Autocuidado</span>
            <h2>Recursos para ir con calma.</h2>
            <p>
              Lecturas breves y prácticas sencillas. No reemplazan la orientación de un profesional.
            </p>
          </div>

          <div className="resource-grid">
            {(data?.resources || []).map((r) => (
              // El color de la tarjeta lo declara el dato (tone), no el icono:
              // así cada recurso puede cambiar de dibujo sin perder su fondo.
              <article className={`resource-card ${r.tone || ''}`} key={r.title}>
                <div className="resource-illustration">
                  <span />
                  {/* Iconos flotando: decoración suave, sin texto ni interacción */}
                  <div className="resource-drift" aria-hidden="true">
                    <span className="resource-drift__item resource-drift__item--a">
                      <Icon name="sparkle" size={14} />
                    </span>
                    <span className="resource-drift__item resource-drift__item--b">
                      <Icon name="leaf" size={12} />
                    </span>
                    <span className="resource-drift__item resource-drift__item--c">
                      <Icon name="heart" size={10} />
                    </span>
                  </div>
                  <Icon name={r.icon} size={40} />
                </div>
                <div className="resource-copy">
                  <span>{r.kicker}</span>
                  <h3>{r.title}</h3>
                  <p>{r.text}</p>
                  <button
                    onClick={() =>
                      r.action === 'draw' ? setDrawOpen(true) : setTab(r.target || 'paz')
                    }
                  >
                    {r.cta || 'Explorar recurso'} <Icon name="arrow" size={15} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {closing && (
        <section className="closing-section">
          <div className="container">
            <div className="closing-card">
              {/* Atmósfera decorativa: ondas de sonar, estrellitas y el brillo
                  que respira detrás de "Llamar gratis". No altera el contenido. */}
              <div className="closing-atmo" aria-hidden="true">
                <span className="closing-atmo__glow" />
                <span className="closing-atmo__sonar closing-atmo__sonar--a" />
                <span className="closing-atmo__sonar closing-atmo__sonar--b" />
                <span className="closing-atmo__sonar closing-atmo__sonar--c" />
                <span className="closing-atmo__star closing-atmo__star--a" />
                <span className="closing-atmo__star closing-atmo__star--b" />
                <span className="closing-atmo__star closing-atmo__star--c" />
                <span className="closing-atmo__star closing-atmo__star--d" />
                <span className="closing-atmo__star closing-atmo__star--e" />
                <span className="closing-atmo__star closing-atmo__star--f" />
              </div>
              <div>
                <span className="section-number">{closing.kicker}</span>
                <h2 style={{ marginTop: 16 }}>{closing.title}</h2>
              </div>
              <div className="closing-action">
                <p>{closing.text}</p>
                <a className="light-button" href={closing.buttonHref}>
                  <Icon name="phone" size={17} /> {closing.buttonLabel}
                </a>
                {closing.secondaryLabel && (
                  <button
                    className="closing-link"
                    type="button"
                    onClick={() => setTab(closing.secondaryTab || 'lineas')}
                  >
                    {closing.secondaryLabel}
                  </button>
                )}
                {closing.source && (
                  <p className="closing-source">
                    <Icon name="shield" size={14} />
                    <span>
                      Fuente: {closing.source}
                      {closing.consulta && <> · Consulta: {closing.consulta}</>}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {drawOpen && <DrawModal onClose={() => setDrawOpen(false)} />}
      {talleresOpen && (
        <WorkshopsModal talleres={talleres} onClose={() => setTalleresOpen(false)} />
      )}
    </>
  );
}

/* ==========================================================================
   Líneas de ayuda
   ========================================================================== */
// El filtro no depende de cómo esté redactado el campo "scope": usa un
// indicador explícito en los datos (routes.json y crisis.js). Así no se vuelve
// a romper si alguien cambia la etiqueta de un texto.
const FILTROS_LINEAS = [
  { id: 'todas', label: 'Todas' },
  { id: 'villavicencio', label: 'En Villavicencio' }
];

/* Clon decorativo que se desvanece en el sitio de la tarjeta que sale.
   Se cuelga fuera de React unos 280 ms y se retira solo. */
function spawnExitGhost(card) {
  const rect = card.getBoundingClientRect();
  if (!rect.width || !rect.height) return;

  const ghost = card.cloneNode(true);
  ghost.removeAttribute('data-line-id');
  ghost.setAttribute('aria-hidden', 'true');
  ghost.className = `${card.className} route-card--ghost`;
  ghost.style.position = 'fixed';
  ghost.style.left = `${rect.left}px`;
  ghost.style.top = `${rect.top}px`;
  ghost.style.width = `${rect.width}px`;
  ghost.style.height = `${rect.height}px`;
  ghost.style.margin = '0';
  ghost.style.pointerEvents = 'none';
  if ('inert' in ghost) ghost.inert = true;

  (document.querySelector('.app-shell') || document.body).appendChild(ghost);

  // Fuerza el estilo inicial para que el fundido arranque en el acto.
  void ghost.offsetWidth;
  ghost.classList.add('is-out');
  window.setTimeout(() => ghost.remove(), 280);
}

export function LinesTab({ lines }) {
  const [filter, setFilter] = useState('todas');
  const all = lines || CRISIS_LINES;
  const filtered =
    filter === 'todas' ? all : all.filter((l) => l.enVillavicencio === true);

  const reduced = useReducedMotion();
  const gridRef = useRef(null);
  const rectsRef = useRef(null);

  /* Cambio de filtro: la tarjeta que sale se despide con un clon que se
     desvanece en su antiguo sitio, y las que se quedan se deslizan a su
     nueva posición (FLIP, 340 ms). Con movimiento reducido, cambio directo. */
  const changeFilter = (next) => {
    if (next === filter) return;

    const nextList = next === 'todas' ? all : all.filter((l) => l.enVillavicencio === true);
    const nextIds = new Set(nextList.map((l) => l.id));
    const grid = gridRef.current;

    if (!reduced && grid) {
      const rects = new Map();

      grid.querySelectorAll('[data-line-id]').forEach((card) => {
        if (nextIds.has(card.dataset.lineId)) {
          rects.set(card.dataset.lineId, card.getBoundingClientRect());
        } else {
          spawnExitGhost(card);
        }
      });

      rectsRef.current = rects;
    }

    setFilter(next);
  };

  useLayoutEffect(() => {
    const prev = rectsRef.current;
    const grid = gridRef.current;
    rectsRef.current = null;
    if (!prev || !grid) return undefined;

    const cleanups = [];

    grid.querySelectorAll('[data-line-id]').forEach((card) => {
      const before = prev.get(card.dataset.lineId);
      if (!before) return;

      const now = card.getBoundingClientRect();
      const dx = Math.round(before.left - now.left);
      const dy = Math.round(before.top - now.top);
      if (!dx && !dy) return;

      card.style.transition = 'none';
      card.style.transform = `translate(${dx}px, ${dy}px)`;
      void card.offsetWidth;
      card.style.transition = 'transform 340ms cubic-bezier(0.22, 0.61, 0.36, 1)';
      card.style.transform = '';

      const done = () => {
        card.style.transition = '';
        card.style.transform = '';
      };
      card.addEventListener('transitionend', done, { once: true });
      cleanups.push(() => {
        card.removeEventListener('transitionend', done);
        done();
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [filter]);

  return (
    <section className="tab-section routes-section">
      <div className="container">
        <div className="section-topline">
          <div className="section-heading">
            <span className="section-number">Líneas de ayuda</span>
            <h2>Ayuda confiable, cuando la necesites.</h2>
            <p>
              Canales públicos de orientación con acceso directo desde tu celular. Verificados para
              Villavicencio.
            </p>
          </div>
          <div className="filter-control">
            {FILTROS_LINEAS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={filter === f.id ? 'active' : ''}
                aria-pressed={filter === f.id}
                onClick={() => changeFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="routes-grid" ref={gridRef}>
          {filtered.length === 0 && (
            <p className="prototype-note routes-empty">
              Todavía no hay líneas disponibles con este filtro. Prueba con “Todas”.
            </p>
          )}
          {filtered.map((l) => (
            <article
              className={`route-card ${l.featured ? 'featured' : ''}`}
              data-line-id={l.id}
              key={l.id}
            >
              <div className="route-top">
                <span className="route-icon">
                  <Icon name={l.badge === 'urgent' ? 'shield' : 'phone'} size={22} />
                </span>
                {l.featured && <span className="recommended">Recomendada</span>}
              </div>
              <span className="route-eyebrow">{l.eyebrow || `${l.scope} · ${l.hours}`}</span>
              <h3>{l.name}</h3>
              <p>{l.description || l.kind}</p>

              <div className="route-actions">
                {(l.phones || []).map((p) => (
                  <a className="call-button" href={p.tel} key={p.number}>
                    <Icon name="phone" size={16} /> {p.label}: {p.number}
                  </a>
                ))}
                {l.whatsapp && (
                  <a className="call-button wa" href={l.whatsapp.url} target="_blank" rel="noreferrer">
                    <Icon name="whatsapp" size={16} /> {l.whatsapp.label}: {l.whatsapp.number}
                  </a>
                )}
              </div>

              <div className="source">
                <Icon name="shield" size={14} />
                <span>
                  Fuente: {l.source}
                  <small>Consulta: {l.consulta || 'octubre de 2026'}</small>
                </span>
              </div>
            </article>
          ))}
        </div>

        <p className="prototype-note">
          Información integrada para el prototipo TRL 4. Confirma vigencia y disponibilidad con la
          entidad antes de desplazarte.
        </p>
      </div>
    </section>
  );
}

/* ==========================================================================
   Cuéntaselo al viento — reemplaza a "Libros"
   La persona escribe lo que le pesa y lo suelta. El texto no sale nunca de
   su pantalla: no se pide ningún dato ni se guarda nada en ningún lugar.
   ========================================================================== */
const WIND_PETALS = ['#ffb3c9', '#ffd66b', '#bfe5ed', '#dedaf0', '#cfe3d5'];
const WIND_GIFTS = ['flower', 'butterfly', 'light'];
const WIND_MOODS = [
  { id: 'igual', label: 'Igual' },
  { id: 'poco', label: 'Un poco mejor' },
  { id: 'mucho', label: 'Mucho mejor' }
];

// Cada partícula nace dentro del recuadro y sale disparada hacia la derecha.
function windBits(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: 3 + ((i * 37) % 93),
    top: 6 + ((i * 53) % 78),
    delay: ((i * 13) % 95) / 100,
    dur: 2.3 + ((i * 7) % 9) * 0.17,
    dx: 540 + ((i * 29) % 440),
    dy: -150 - ((i * 17) % 210),
    rot: 140 + ((i * 41) % 340),
    size: 9 + ((i * 5) % 9),
    color: WIND_PETALS[i % WIND_PETALS.length],
    kind: i % 3
  }));
}

function WindBit({ bit }) {
  return (
    <span
      className={`wind-bit wind-bit-${bit.kind}`}
      aria-hidden="true"
      style={{
        left: `${bit.left}%`,
        top: `${bit.top}%`,
        width: `${bit.size}px`,
        height: `${bit.size}px`,
        color: bit.color,
        animationDuration: `${bit.dur}s`,
        animationDelay: `${bit.delay}s`,
        '--dx': `${bit.dx}px`,
        '--dy': `${bit.dy}px`,
        '--rot': `${bit.rot}deg`
      }}
    >
      <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
        {bit.kind === 0 && (
          <path d="M12 2C7 7 5 12 6 16c1 4 3 6 6 6s5-2 6-6c1-4-1-9-6-14z" fill="currentColor" />
        )}
        {bit.kind === 1 && (
          <ellipse cx="12" cy="12" rx="6.5" ry="9" fill="currentColor" transform="rotate(25 12 12)" />
        )}
        {bit.kind === 2 && <circle cx="12" cy="12" r="5" fill="currentColor" />}
      </svg>
    </span>
  );
}

// Lo que el viento devuelve: una flor, una mariposa o una luz encendida.
function WindGift({ kind }) {
  if (kind === 'butterfly') {
    return (
      <svg className="gift-svg" viewBox="0 0 120 120" aria-hidden="true">
        <g className="gift-wing gift-wing-left">
          <path d="M60 60C46 36 24 30 18 44c-5 12 8 24 24 26 8 1 14-3 18-10z" fill="#bfe5ed" />
          <path d="M60 60C44 74 34 92 44 98c9 5 20-6 22-20 1-7 0-13-6-18z" fill="#dedaf0" />
        </g>
        <g className="gift-wing gift-wing-right">
          <path d="M60 60c14-24 36-30 42-16 5 12-8 24-24 26-8 1-14-3-18-10z" fill="#bfe5ed" />
          <path d="M60 60c16 14 26 32 16 38-9 5-20-6-22-20-1-7 0-13 6-18z" fill="#dedaf0" />
        </g>
        <path d="M60 42v36" stroke="#526a71" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M60 45l-7-9M60 45l7-9" stroke="#526a71" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === 'light') {
    return (
      <svg className="gift-svg" viewBox="0 0 120 120" aria-hidden="true">
        <g className="gift-rays">
          {Array.from({ length: 8 }).map((_, i) => (
            <rect
              key={i}
              x="58.5"
              y="6"
              width="3.5"
              height="15"
              rx="1.75"
              fill="#ffd66b"
              transform={`rotate(${i * 45} 60 60)`}
            />
          ))}
        </g>
        <circle className="gift-glow" cx="60" cy="60" r="25" fill="#ffe08a" />
        <circle cx="60" cy="60" r="16" fill="#ffd66b" />
        <circle cx="54" cy="54" r="5.5" fill="#fff" opacity="0.9" />
      </svg>
    );
  }

  return (
    <svg className="gift-svg" viewBox="0 0 120 120" aria-hidden="true">
      <path d="M60 76v34" stroke="#7cae6a" strokeWidth="4" strokeLinecap="round" />
      <path d="M60 98c-10 0-15-5-16-12 8-1 14 4 16 12z" fill="#96c47f" />
      <g className="gift-bloom">
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <ellipse
            key={a}
            cx="60"
            cy="34"
            rx="13"
            ry="21"
            fill="#ffb3c9"
            transform={`rotate(${a} 60 60)`}
          />
        ))}
        <circle cx="60" cy="60" r="13" fill="#ffd66b" />
      </g>
    </svg>
  );
}

export function WindTab({ setTab }) {
  const [text, setText] = useState('');
  const [phase, setPhase] = useState('write'); // 'write' | 'blowing' | 'revealed'
  const [bits, setBits] = useState([]);
  const [gift, setGift] = useState('flower');
  const [feeling, setFeeling] = useState(null);
  const timerRef = useRef(null);
  const settledRef = useRef(false);

  const stopTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // El texto desaparece para siempre en cuanto el viento se lo lleva.
  const settle = () => {
    if (settledRef.current) return;
    settledRef.current = true;
    stopTimer();
    setGift(WIND_GIFTS[Math.floor(Math.random() * WIND_GIFTS.length)]);
    setBits([]);
    setText('');
    setPhase('revealed');
  };

  // Red de seguridad por si el navegador pausa los timers.
  const onAnimationEnd = (e) => {
    if (e.target && e.target.classList && e.target.classList.contains('wind-bit')) settle();
  };

  const release = () => {
    if (phase !== 'write' || !text.trim()) return;
    const reduced =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const palabras = text.trim().split(/\s+/).length;
    const cantidad = Math.max(20, Math.min(48, palabras * 3));

    settledRef.current = false;
    setBits(reduced ? [] : windBits(cantidad));
    setFeeling(null);
    setPhase('blowing');
    // El fondo de la sección acelera junto con las partículas del texto.
    if (!reduced && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('rc:wind-burst'));
    }
    stopTimer();
    timerRef.current = setTimeout(settle, reduced ? 260 : 3400);
  };

  const reset = () => {
    stopTimer();
    settledRef.current = true;
    setBits([]);
    setText('');
    setFeeling(null);
    setPhase('write');
  };

  useEffect(() => stopTimer, []);

  return (
    <section className="tab-section wind-section" id="viento">
      <div className="container">
        <div className="section-heading centered">
          <span className="section-number">Al viento</span>
          <h2>Cuéntaselo al viento</h2>
          <p>Escribe lo que te pesa. El viento se encarga del resto.</p>
        </div>

        <div className="wind-stage">
          <div className="wind-layer" onAnimationEnd={onAnimationEnd} aria-hidden="true">
            {bits.map((b) => (
              <WindBit key={b.id} bit={b} />
            ))}
          </div>

          <div className="wind-card">
            {phase !== 'revealed' ? (
              <>
                <label className="wind-label" htmlFor="wind-text">
                  Lo que te pesa hoy
                </label>
                <textarea
                  id="wind-text"
                  className={`wind-input ${phase === 'blowing' ? 'blowing' : ''}`}
                  value={text}
                  readOnly={phase === 'blowing'}
                  maxLength={1200}
                  rows={7}
                  placeholder="Escríbelo con tus palabras: estrés, rabia, tristeza, cansancio… lo que sea."
                  onChange={(e) => setText(e.target.value)}
                />
                <div className="wind-card-foot">
                  <button
                    className="wind-release"
                    onClick={release}
                    disabled={phase === 'blowing' || !text.trim()}
                  >
                    <Icon name="wind" size={18} />
                    {phase === 'blowing' ? 'El viento lo lleva…' : 'Que se lo lleve el viento'}
                  </button>
                  <span className="wind-count">{text.length} / 1200</span>
                </div>
              </>
            ) : (
              <div className="wind-after">
                <div className="wind-gift">
                  <WindGift kind={gift} />
                </div>

                <h3 className="wind-thanks">El viento ya se lo llevó. Gracias por contarlo.</h3>

                {!feeling ? (
                  <div className="wind-ask">
                    <p>¿Cómo te sientes ahora?</p>
                    <div className="wind-moods">
                      {WIND_MOODS.map((m) => (
                        <button key={m.id} type="button" onClick={() => setFeeling(m.id)}>
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="wind-reply">
                    <p className="wind-reply-text">
                      {feeling === 'igual'
                        ? 'Está bien sentirse igual. Soltar no siempre se nota al instante y no tienes que forzarlo.'
                        : feeling === 'poco'
                          ? 'Es un paso. A veces alivia de a poquito, y eso también cuenta.'
                          : 'Qué bueno. Lleva lo ligero contigo el resto del día.'}
                    </p>

                    <div className="wind-next">
                      {feeling === 'igual' ? (
                        <>
                          <button className="calm-button" type="button" onClick={() => setTab('paz')}>
                            <Icon name="leaf" size={17} /> Ir a Zona de paz
                          </button>
                          <button
                            className="calm-button soft"
                            type="button"
                            onClick={() => setTab('lineas')}
                          >
                            <Icon name="phone" size={17} /> Ver líneas de ayuda
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="calm-button" type="button" onClick={() => setTab('paz')}>
                            <Icon name="leaf" size={17} /> Seguir en Zona de paz
                          </button>
                          <button
                            className="calm-button soft"
                            type="button"
                            onClick={() => setTab('lineas')}
                          >
                            <Icon name="phone" size={17} /> Ver líneas de ayuda
                          </button>
                        </>
                      )}
                    </div>

                    <button className="wind-again" type="button" onClick={reset}>
                      Escribir otra vez
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="wind-notes">
          <p>
            <Icon name="lock" size={15} />
            <span>
              No pedimos tu nombre, tu correo ni tu ubicación. Lo que escribas solo existe en pantalla
              mientras lo escribes: al soltarlo, desaparece.
            </span>
          </p>
          <p>
            <Icon name="heart" size={15} />
            <span>
              Si te cuesta sostenerlo a solas, acércate a las{' '}
              <button className="wind-link" type="button" onClick={() => setTab('lineas')}>
                líneas de ayuda
              </button>
              . También puedes escribir cuando quieras: no hay forma correcta de hacerlo.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   Centros presenciales
   ========================================================================== */
export function CentersTab({ centers }) {
  const list = centers || [];
  const [active, setActive] = useState(list[0]?.id || null);
  const current = list.find((c) => c.id === active) || list[0];

  return (
    <section className="tab-section centers-section">
      <div className="container">
        <div className="section-heading">
          <span className="section-number">Centros presenciales</span>
          <h2>Atención cerca, en Villavicencio.</h2>
          <p>
            Los centros se muestran en un mapa fijo. No usamos ni pedimos tu ubicación en ningún
            momento.
          </p>
        </div>

        <div className="centers-grid">
          {/* Halo verde suave detrás de la lista de centros (decorativo). */}
          <div className="centers-halo" aria-hidden="true" />
          <div className="center-list">
            {list.map((c) => (
              <button
                key={c.id}
                className={`center-item ${active === c.id ? 'active' : ''}`}
                onClick={() => setActive(c.id)}
                aria-pressed={active === c.id}
              >
                <span className="center-pin">
                  <Icon name="map-pin" size={20} />
                </span>
                <span>
                  <strong>{c.name}</strong>
                  <small>
                    <Icon name="map-pin" size={13} /> {c.address}
                  </small>
                  <small>{c.hours}</small>
                  <small>{c.phone}</small>
                  <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                    {c.verified ? (
                      <span className="center-verified">Verificado</span>
                    ) : (
                      <span className="center-pending">Por confirmar</span>
                    )}
                    {c.tel && (
                      <a className="center-call" href={c.tel} onClick={(e) => e.stopPropagation()}>
                        <Icon name="phone" size={14} /> Llamar
                      </a>
                    )}
                  </span>
                </span>
              </button>
            ))}
          </div>

          <div className="map-frame">
            {current && (
              <iframe
                key={current.id}
                title="Mapa de Villavicencio"
                src={
                  tieneCoordenadas(current)
                    ? osmUrl(current.lat, current.lon)
                    : osmUrl(VILLAVICENCIO_CENTRO.lat, VILLAVICENCIO_CENTRO.lon, false)
                }
                loading="lazy"
              />
            )}
            <div className="map-caption">
              {current
                ? `${current.name} · ${current.address}. ${
                    tieneCoordenadas(current)
                      ? 'Ubicación aproximada para el prototipo; confirma con la entidad.'
                      : 'Ficha sin coordenadas verificadas: el mapa no señala un punto exacto. Confirma la dirección con la entidad.'
                  }`
                : 'Mapa general de Villavicencio.'}
            </div>
          </div>
        </div>

        <p className="prototype-note">
          Ubicaciones aproximadas para el prototipo. Confirma dirección y horario con la entidad antes
          de desplazarte.
        </p>
      </div>
    </section>
  );
}

/* ==========================================================================
   Zona de paz (contenido centrado)
   ========================================================================== */
function PeaceTab({ phrases, setTab }) {
  const [showGrounding, setShowGrounding] = useState(false);
  const phrase = useRotatingPhrase(phrases);
  const music = useCalmMusic();

  return (
    <section className="tab-section peace-section">
      <div className="container">
        <div className="peace-centered">
          <span className="section-number">Zona de paz</span>
          <h2 className="peace-title">Un minuto solo para ti.</h2>
          <p className="peace-lead">
            Sigue el círculo con tu respiración. No hay forma correcta de hacerlo.
          </p>
          <p className={`peace-phrase phrase ${phrase.visible ? 'in' : 'out'}`}>{phrase.text}</p>

          <div className="breath-stage">
            <div className="breath-ring" />
            <div className="breath-circle" />
            <ul aria-hidden="true">
              <li>Inhala</li>
              <li>Sostén</li>
              <li>Exhala</li>
              <li>Sostén</li>
            </ul>
          </div>

          <div className="music-player">
            <button
              className={`music-toggle ${music.playing ? 'playing' : ''}`}
              onClick={music.toggle}
              aria-pressed={music.playing}
            >
              <Icon name={music.playing ? 'pause' : 'music'} size={18} />
              {music.playing ? 'Pausar música' : 'Poner música suave'}
            </button>
            <small className="music-note">
              {music.error
                ? 'No se pudo generar el sonido en este dispositivo. Puedes seguir con la respiración.'
                : music.blocked
                  ? 'Para escuchar, toca en cualquier lugar de la pantalla una vez.'
                  : music.playing
                    ? 'Beats lentos y tranquilizantes, sin voces · ajústalo al volumen que te sirva'
                    : 'Beats suaves de fondo. Puedes pausarla cuando quieras.'}
            </small>
          </div>

          <div className="calm-actions centered">
            <button
              className="calm-button"
              onClick={() => setShowGrounding((v) => !v)}
              aria-pressed={showGrounding}
            >
              <Icon name="wind" size={17} /> {showGrounding ? 'Ocultar anclaje' : 'Anclaje 5-4-3-2-1'}
            </button>
            <button className="calm-button" onClick={() => setTab('regalate')}>
              <Icon name="leaf" size={17} /> Regálate ese momento
            </button>
          </div>

          {showGrounding && (
            <div className="grounding-card centered-card">
              <h3>Anclaje 5-4-3-2-1</h3>
              <ol>
                <li>5 cosas que puedas ver</li>
                <li>4 que puedas tocar</li>
                <li>3 que puedas escuchar</li>
                <li>2 que puedas oler</li>
                <li>1 que puedas saborear</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   Regálate momentos (árbol con hojas que caen)
   ========================================================================== */
const LEAF_COLORS = ['#8fbf7a', '#a3cd87', '#7cae6a', '#b9d69b', '#96c47f', '#c7dfa6'];

/* --- Formas orgánicas del árbol ------------------------------------------
   Todo se calcula con una semilla fija (sin Math.random) para que la copa se
   vea ilustrada a mano pero idéntica en cada render. */
function treeRand(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* Devuelve un "blob" cerrado con borde ondulado (Catmull-Rom -> Bézier) */
function blobPath(cx, cy, rx, ry, wobble, points, seed) {
  const rnd = treeRand(seed);
  const pts = Array.from({ length: points }, (_, i) => {
    const angle = (i / points) * Math.PI * 2;
    const k = 1 + (rnd() - 0.5) * 2 * wobble;
    return [cx + Math.cos(angle) * rx * k, cy + Math.sin(angle) * ry * k];
  });
  const n = pts.length;
  const p = (pt) => `${pt[0].toFixed(1)} ${pt[1].toFixed(1)}`;
  let d = `M${p(pts[0])}`;
  for (let i = 0; i < n; i += 1) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${p(c1)} ${p(c2)} ${p(p2)}`;
  }
  return `${d}Z`;
}

/* Contorno del tronco: ancho en la base y más fino arriba.
   El SVG mide 420 x 500 y la línea del pasto está en y = 440. */
const TREE_TRUNK_D =
  'M183 486C180 434 186 376 194 330C197 314 197.5 303 198 296L222 296C223 306 225 320 229 348C235 396 240 444 238 486Z';

/* Masas de la copa (4 manchas con borde irregular) */
const TREE_MASSES = [
  { key: 'main', cx: 210, cy: 190, rx: 131, ry: 103, seed: 91 },
  { key: 'left', cx: 109, cy: 234, rx: 91, ry: 77, seed: 173 },
  { key: 'right', cx: 307, cy: 238, rx: 89, ry: 75, seed: 251 },
  { key: 'top', cx: 171, cy: 111, rx: 79, ry: 63, seed: 347 }
].map((m) => ({ ...m, d: blobPath(m.cx, m.cy, m.rx, m.ry, 0.13, 18, m.seed) }));

/* Racimos de hojas: 3 planos de profundidad según la luz (arriba-izquierda) */
const TREE_CLUSTERS = (() => {
  const out = [];
  TREE_MASSES.forEach((m, mi) => {
    const rnd = treeRand(m.seed + 11);
    const count = mi === 0 ? 15 : 10;
    for (let i = 0; i < count; i += 1) {
      const angle = (i / count) * Math.PI * 2 + rnd() * 0.55;
      const radius = 0.56 + rnd() * 0.46;
      const cx = m.cx + Math.cos(angle) * m.rx * radius;
      const cy = m.cy + Math.sin(angle) * m.ry * radius;
      const light = (-(cx - m.cx) / m.rx - (cy - m.cy) / m.ry) / 2;
      const r = 13 + rnd() * 12;
      const leafCount = 2 + Math.floor(rnd() * 3);
      const leaves = Array.from({ length: leafCount }, () => {
        const a = rnd() * Math.PI * 2;
        const dist = r * (0.3 + rnd() * 0.55);
        return {
          x: cx + Math.cos(a) * dist,
          y: cy + Math.sin(a) * dist * 0.9,
          rot: (a * 180) / Math.PI + 90 + (rnd() - 0.5) * 34,
          scale: 0.55 + rnd() * 0.45
        };
      });
      out.push({
        id: `${m.key}-${i}`,
        cx,
        cy,
        depth: light > 0.16 ? 'front' : light < -0.2 ? 'back' : 'mid',
        d: blobPath(cx, cy, r, r * 0.86, 0.22, 9, m.seed + i * 13),
        leaves
      });
    }
  });
  return out;
})();

const TREE_CLUSTER_FILL = {
  back: ['#4d8955', '#578f5b', '#5e9e62'],
  mid: ['#74ae66', '#82b96f', '#8cc277'],
  front: ['#a9d287', '#b8dd96', '#bee09a']
};

/* Hojas sueltas a punto de desprenderse del borde de la copa */
const TREE_LOOSE_LEAVES = [
  { x: 63, y: 214, rot: -34, scale: 0.92, fill: '#a5cf83' },
  { x: 349, y: 208, rot: 42, scale: 0.85, fill: '#8fc178' },
  { x: 133, y: 52, rot: -18, scale: 0.8, fill: '#c2e29e' },
  { x: 288, y: 88, rot: 26, scale: 0.88, fill: '#9bcb7e' },
  { x: 55, y: 276, rot: 58, scale: 0.75, fill: '#8bbd74' },
  { x: 356, y: 150, rot: -12, scale: 0.7, fill: '#b2d98f' }
];

/* Hojas quietas sobre el pasto, junto a la base del tronco */
const TREE_GROUND_LEAVES = [
  { x: 122, y: 478, rot: -22, scale: 0.82, fill: '#a3cd87' },
  { x: 292, y: 474, rot: 34, scale: 0.78, fill: '#8fbf7a' },
  { x: 158, y: 488, rot: 12, scale: 0.72, fill: '#b9d69b' },
  { x: 262, y: 490, rot: -40, scale: 0.74, fill: '#96c47f' },
  { x: 214, y: 492, rot: 8, scale: 0.66, fill: '#c0dd9f' }
];

/* Matas de pasto delanteras: tapan la base del tronco y parte de las raíces */
const TREE_TUFT_D =
  'M0 0C-2-10-1-20 2-30C4-20 3-10 2 0ZM2 0C5-8 10-16 16-22C11-13 8-6 6 0ZM-1 0C-5-7-10-13-16-16C-10-9-6-4-3 0Z';

const TREE_BASE_TUFTS = (() => {
  const rnd = treeRand(733);
  const colors = ['#8cba73', '#a7cf8b', '#96c47f', '#7fae69', '#b3d492'];
  return Array.from({ length: 16 }, (_, i) => {
    const spread = i / 15;
    return {
      id: `tuft-${i}`,
      x: 76 + spread * 268 + (rnd() - 0.5) * 12,
      y: 466 + rnd() * 28,
      scale: 0.72 + rnd() * 0.6,
      rot: (rnd() - 0.5) * 18,
      flip: rnd() > 0.5 ? -1 : 1,
      fill: colors[i % colors.length]
    };
  });
})();

/* --- Pasto de la colina ---------------------------------------------------
   Briznas rellenas (base de 2 a 4 px que se afina hasta la punta) agrupadas
   en matitas de 3 a 6. Todo se calcula con semilla fija: la composición es
   idéntica en cada carga. Las bases se apoyan en la misma curva que el borde
   de la colina (.meadow: 84 px de alto y 22 px de radio arriba). */

const GRASS_VIEW_W = 1000;
const GRASS_VIEW_H = 130;

/* Altura del borde de la colina, en unidades del SVG (y crece hacia abajo). */
function grassHillY(u) {
  const d = Math.abs(u - 0.5);
  const t = Math.min(1, Math.max(0, (d - 0.1) / 0.4));
  return 68 - 22 * Math.sqrt(1 - t * t);
}

/* Seis briznas reutilizables. La base queda en (0, 0) y la punta arriba. */
const GRASS_BLADES = [
  { id: 'a', tip: [0, -40], d: 'M-1.5 0C-1.3-9-1-21 0-40 1.1-21 1.4-9 1.5 0Z' },
  { id: 'b', tip: [4.2, -38], d: 'M-1.4 0C-0.7-10 1.4-24 4.2-38 3.6-24 2.5-10 1.4 0Z' },
  { id: 'c', tip: [-4.2, -38], d: 'M-1.4 0C-2.5-10-3.6-24-4.2-38-1.4-24 0.7-10 1.4 0Z' },
  { id: 'd', tip: [0.4, -40], d: 'M-1.1 0C-0.95-10-0.7-24 0.4-40 1.2-24 1.35-10 1.1 0Z' },
  { id: 'e', tip: [3.8, -38], d: 'M-1.4 0C-1.8-12 1.2-22 3.8-38 3.2-22 1.4-11 1.4 0Z' },
  { id: 'f', tip: [0.3, -39], d: 'M-1.9 0C-1.5-9-1.2-22 0.3-39 1.6-22 1.9-10 1.9 0Z' }
];

/* Cuatro planos: lejano (bajo y translúcido), dos medios y primer plano. */
const GRASS_LAYERS = [
  { key: 'far', seed: 1181, count: 9, heights: [10, 17], offset: -2.5, duration: [4.6, 5.8], tilt: 14 },
  { key: 'midA', seed: 1297, count: 10, heights: [14, 24], offset: 0, duration: [3.9, 5.2], tilt: 16 },
  { key: 'midB', seed: 1409, count: 10, heights: [19, 30], offset: 2.5, duration: [3.5, 4.9], tilt: 17 },
  { key: 'front', seed: 1523, count: 9, heights: [26, 40], offset: 5.5, duration: [3.2, 4.6], tilt: 18 }
];

const GRASS_TUFTS = (() => {
  const tufts = [];
  const tips = [];

  GRASS_LAYERS.forEach((layer) => {
    const rnd = treeRand(layer.seed);
    const step = GRASS_VIEW_W / (layer.count - 1);

    for (let i = 0; i < layer.count; i += 1) {
      const x = Math.min(996, Math.max(4, i * step + (rnd() - 0.5) * 30));
      const y = grassHillY(x / GRASS_VIEW_W) + layer.offset + (rnd() - 0.5) * 2;
      const bladeCount = 3 + Math.floor(rnd() * 4);
      const blades = [];

      for (let b = 0; b < bladeCount; b += 1) {
        const shape = GRASS_BLADES[Math.floor(rnd() * GRASS_BLADES.length)];
        const height = layer.heights[0] + rnd() * (layer.heights[1] - layer.heights[0]);
        const tilt = (rnd() - 0.5) * 2 * layer.tilt;
        const sx = 0.92 + rnd() * 0.13;
        const sy = height / 40;
        const bx = x + (rnd() - 0.5) * 3.4;
        const rad = (tilt * Math.PI) / 180;
        const tx = shape.tip[0] * sx;
        const ty = shape.tip[1] * sy;

        const blade = {
          key: `${layer.key}-${i}-${b}`,
          shape: shape.id,
          x: bx,
          y,
          tilt,
          sx,
          sy,
          tipX: bx + tx * Math.cos(rad) - ty * Math.sin(rad),
          tipY: y + tx * Math.sin(rad) + ty * Math.cos(rad)
        };

        blades.push(blade);
        tips.push(blade);
      }

      tufts.push({
        id: `${layer.key}-${i}`,
        layer: layer.key,
        blades,
        dew: [],
        duration: Number((layer.duration[0] + rnd() * (layer.duration[1] - layer.duration[0])).toFixed(2)),
        delay: Number((-(tufts.length * 0.37 + rnd() * 0.18)).toFixed(2))
      });
    }
  });

  /* Rocío: diez gotitas sobre puntas de briznas. Van dentro de la matita
     para que se balanceen con ella. */
  const dewRnd = treeRand(9011);
  const chosen = new Set();

  while (chosen.size < 10) {
    chosen.add(Math.floor(dewRnd() * tips.length));
  }

  chosen.forEach((index) => {
    const blade = tips[index];
    const owner = tufts.find((tuft) => tuft.blades.includes(blade));
    owner.dew.push({
      x: blade.tipX,
      y: blade.tipY,
      r: 0.9 + dewRnd() * 0.5,
      opacity: 0.65 + dewRnd() * 0.3
    });
  });

  return tufts;
})();

/* Florecitas diminutas repartidas por la base del pasto. */
const GRASS_FLOWERS = (() => {
  const rnd = treeRand(7723);
  return Array.from({ length: 10 }, (_, i) => {
    const x = 30 + (i / 9) * 940 + (rnd() - 0.5) * 34;
    return {
      x,
      y: grassHillY(x / GRASS_VIEW_W) + 1.5 + rnd() * 5,
      scale: 0.75 + rnd() * 0.4,
      rot: (rnd() - 0.5) * 22
    };
  });
})();

function TreeCluster({ cluster }) {
  const fills = TREE_CLUSTER_FILL[cluster.depth];
  return (
    <g>
      <path d={cluster.d} fill={fills[0]} />
      {cluster.leaves.map((leaf, i) => (
        <use
          key={i}
          href="#tree-leaf"
          width="24"
          height="34"
          fill={fills[(i % (fills.length - 1)) + 1]}
          transform={`translate(${leaf.x.toFixed(1)} ${leaf.y.toFixed(1)}) rotate(${leaf.rot.toFixed(0)}) scale(${leaf.scale.toFixed(2)}) translate(-12 -17)`}
        />
      ))}
    </g>
  );
}

function TreeSvg() {
  return (
    <svg
      className="tree-svg"
      viewBox="0 0 420 500"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        {/* --- degradados de la copa (atrás oscuro, medio, delante claro) --- */}
        <linearGradient id="tree-mass-fill" x1="0.18" y1="0" x2="0.72" y2="1">
          <stop offset="0%" stopColor="var(--tree-leaf-light)" />
          <stop offset="55%" stopColor="var(--tree-leaf-mid)" />
          <stop offset="100%" stopColor="var(--tree-leaf-dark)" />
        </linearGradient>
        <radialGradient id="tree-inner-shade" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#3d6b40" stopOpacity="0.34" />
          <stop offset="70%" stopColor="#3d6b40" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#3d6b40" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tree-sheen" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="70%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="tree-crown-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2f4f34" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#2f4f34" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="tree-halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#eaf7d6" stopOpacity="0.85" />
          <stop offset="60%" stopColor="#eaf7d6" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#eaf7d6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tree-ground-shadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#3f6b46" stopOpacity="0.42" />
          <stop offset="55%" stopColor="#3f6b46" stopOpacity="0.26" />
          <stop offset="100%" stopColor="#3f6b46" stopOpacity="0" />
        </radialGradient>

        {/* --- degradados de la madera --- */}
        <linearGradient id="tree-bark" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--tree-trunk-light)" />
          <stop offset="32%" stopColor="var(--tree-trunk)" />
          <stop offset="70%" stopColor="#7f5c3c" />
          <stop offset="100%" stopColor="var(--tree-trunk-dark)" />
        </linearGradient>
        <linearGradient id="tree-root" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#8a6444" />
          <stop offset="100%" stopColor="#4f3a26" />
        </linearGradient>

        {/* --- hoja reutilizable (con nervio central) --- */}
        <symbol id="tree-leaf" viewBox="0 0 24 34">
          <path d="M12 1.2C6.4 7.6 3.4 15 5.4 22.4c1.2 4.4 3.8 7.8 6.6 10.4 2.8-2.6 5.4-6 6.6-10.4 2-7.4-1-14.8-6.6-21.2Z" />
          <path
            d="M12 4.6c0 8 0 16.4 0 24.6"
            stroke="var(--tree-leaf-vein)"
            strokeWidth="0.9"
            strokeOpacity="0.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M12 11.5 8.6 9.1M12 16.4l-3.6-2.6M12 21.3l-3.4-2.6"
            stroke="var(--tree-leaf-vein)"
            strokeWidth="0.7"
            strokeOpacity="0.35"
            fill="none"
            strokeLinecap="round"
          />
        </symbol>

        {/* --- recortes: cada masa de la copa y el tronco --- */}
        {TREE_MASSES.map((m) => (
          <clipPath key={`clip-${m.key}`} id={`tree-clip-${m.key}`}>
            <path d={m.d} />
          </clipPath>
        ))}
        <clipPath id="tree-trunk-clip">
          <path d={TREE_TRUNK_D} />
        </clipPath>
      </defs>

      {/* ==================== luz suave detrás de la copa ==================== */}
      <ellipse className="tree-halo" cx="210" cy="196" rx="196" ry="176" fill="url(#tree-halo)" />

      {/* ==================== sombra sobre el pasto ========================== */}
      <ellipse cx="210" cy="462" rx="98" ry="21" fill="url(#tree-ground-shadow)" />

      {/* ==================== hojas ya posadas en el pasto =================== */}
      <g className="tree-ground-leaves">
        {TREE_GROUND_LEAVES.map((leaf) => (
          <use
            key={`ground-${leaf.x}`}
            href="#tree-leaf"
            width="24"
            height="34"
            fill={leaf.fill}
            transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.rot}) scale(${leaf.scale}) translate(-12 -17)`}
          />
        ))}
      </g>

      {/* ==================== raíces (campana, hacia el suelo) =============== */}
      <g className="tree-roots">
        <path d="M188 466C172 480 150 490 126 496 146 501 172 495 194 481Z" fill="url(#tree-root)" />
        <path d="M190 474C180 488 168 496 154 500 168 502 184 496 194 486Z" fill="url(#tree-root)" />
        <path d="M230 474C240 488 252 496 266 500 252 502 236 496 226 486Z" fill="url(#tree-root)" />
        <path d="M232 466C248 480 270 490 294 496 274 501 248 495 226 481Z" fill="url(#tree-root)" />
      </g>

      {/* ==================== ramas (van detrás del tronco: unión suave) ==== */}
      <g
        className="tree-branches"
        fill="none"
        stroke="var(--tree-branch)"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M216 374C188 358 156 332 128 302 116 290 106 278 100 268" strokeWidth="15" />
        <path d="M204 374C232 358 264 332 292 302 304 290 314 280 320 270" strokeWidth="15" />
        <path d="M213 340C197 314 179 290 169 266" strokeWidth="11" />
        <path d="M207 338C223 312 239 290 247 266" strokeWidth="11" />
        <path d="M210 322C208 298 208 278 210 256" strokeWidth="10" />
        {/* ramillas secundarias que se pierden entre las hojas */}
        <path d="M128 302C112 290 98 286 84 286" strokeWidth="5" />
        <path d="M292 302C308 292 322 290 336 294" strokeWidth="5" />
        <path d="M169 266C158 250 148 242 138 236" strokeWidth="4" />
      </g>
      <g
        className="tree-branches-light"
        fill="none"
        stroke="#c69f72"
        strokeOpacity="0.32"
        strokeLinecap="round"
      >
        <path d="M214 370C188 354 158 330 132 302" strokeWidth="4" />
        <path d="M206 370C232 354 262 330 288 302" strokeWidth="4" />
      </g>

      {/* ==================== tronco ======================================== */}
      <path className="tree-trunk" d={TREE_TRUNK_D} fill="url(#tree-bark)" />

      {/* corteza: vetas curvas (oscuras y claras), nudo, grieta y sombra de copa */}
      <g clipPath="url(#tree-trunk-clip)">
        <g fill="none" strokeLinecap="round">
          <path
            d="M197 480C195 430 199 380 205 336"
            stroke="var(--tree-bark-dark)"
            strokeWidth="2.2"
            strokeOpacity="0.45"
          />
          <path
            d="M212 482C209 434 213 384 217 340"
            stroke="var(--tree-bark-dark)"
            strokeWidth="1.6"
            strokeOpacity="0.32"
          />
          <path
            d="M228 476C226 438 229 396 232 352"
            stroke="var(--tree-bark-dark)"
            strokeWidth="1.4"
            strokeOpacity="0.26"
          />
          <path
            d="M189 478C187 436 191 392 197 350"
            stroke="var(--tree-bark-light)"
            strokeWidth="2"
            strokeOpacity="0.38"
          />
          <path
            d="M221 468C219 430 221 392 225 356"
            stroke="var(--tree-bark-light)"
            strokeWidth="1.2"
            strokeOpacity="0.28"
          />
        </g>
        {/* nudo / cicatriz */}
        <ellipse cx="206" cy="404" rx="6.4" ry="9.2" fill="var(--tree-bark-dark)" opacity="0.55" />
        <ellipse cx="205.4" cy="403.4" rx="3" ry="5.4" fill="var(--tree-bark-light)" opacity="0.35" />
        <path
          d="M206 413c-1.6 7-1.4 12 0.6 18"
          stroke="var(--tree-bark-dark)"
          strokeWidth="1.6"
          strokeOpacity="0.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* grieta fina */}
        <path d="M224 372c-1 10-1.6 18-2 28" stroke="var(--tree-bark-dark)" strokeWidth="1.1" strokeOpacity="0.4" fill="none" />
        {/* sombra que proyecta la copa sobre el tronco alto */}
        <rect x="180" y="292" width="62" height="66" fill="url(#tree-crown-shade)" />
      </g>

      {/* ==================== copa ========================================== */}
      <g className="tree-canopy">
        {/* plano trasero: racimos oscuros y desaturados */}
        <g className="tree-cluster-group tree-cluster-back">
          {TREE_CLUSTERS.filter((c) => c.depth === 'back').map((c) => (
            <TreeCluster key={c.id} cluster={c} />
          ))}
        </g>

        {/* masas principales */}
        <g className="tree-masses">
          {TREE_MASSES.map((m) => (
            <path key={m.key} d={m.d} fill="url(#tree-mass-fill)" />
          ))}
        </g>

        {/* sombras internas (abajo-derecha) y pliegues entre masas */}
        <g className="tree-shading">
          {TREE_MASSES.map((m) => (
            <g key={`shade-${m.key}`} clipPath={`url(#tree-clip-${m.key})`}>
              <ellipse
                cx={m.cx + m.rx * 0.3}
                cy={m.cy + m.ry * 0.38}
                rx={m.rx * 0.86}
                ry={m.ry * 0.8}
                fill="url(#tree-inner-shade)"
              />
            </g>
          ))}
          <g fill="none" stroke="var(--tree-leaf-dark)" strokeOpacity="0.22" strokeLinecap="round">
            <path d="M138 168C150 200 150 232 138 260" strokeWidth="10" />
            <path d="M282 176C272 206 274 236 286 258" strokeWidth="10" />
            <path d="M176 108C186 138 190 166 186 190" strokeWidth="8" />
          </g>
        </g>

        {/* plano medio */}
        <g className="tree-cluster-group tree-cluster-mid">
          {TREE_CLUSTERS.filter((c) => c.depth === 'mid').map((c) => (
            <TreeCluster key={c.id} cluster={c} />
          ))}
        </g>

        {/* plano delantero: lo más claro, hacia la luz */}
        <g className="tree-cluster-group tree-cluster-front">
          {TREE_CLUSTERS.filter((c) => c.depth === 'front').map((c) => (
            <TreeCluster key={c.id} cluster={c} />
          ))}
        </g>

        {/* brillos translúcidos arriba-izquierda */}
        <g clipPath="url(#tree-clip-main)">
          <ellipse cx="166" cy="150" rx="86" ry="70" fill="url(#tree-sheen)" opacity="0.75" />
        </g>
        <g clipPath="url(#tree-clip-top)">
          <ellipse cx="146" cy="88" rx="54" ry="42" fill="url(#tree-sheen)" opacity="0.8" />
        </g>
        <g fill="#f6fce9">
          <circle cx="150" cy="140" r="5" opacity="0.42" />
          <circle cx="204" cy="108" r="4" opacity="0.36" />
          <circle cx="118" cy="196" r="3.5" opacity="0.32" />
          <circle cx="246" cy="150" r="3" opacity="0.3" />
          <circle cx="176" cy="236" r="3" opacity="0.28" />
        </g>

        {/* hojas sueltas a punto de caer */}
        <g className="tree-loose-leaves">
          {TREE_LOOSE_LEAVES.map((leaf) => (
            <use
              key={`loose-${leaf.x}-${leaf.y}`}
              href="#tree-leaf"
              width="24"
              height="34"
              fill={leaf.fill}
              transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.rot}) scale(${leaf.scale}) translate(-12 -17)`}
            />
          ))}
        </g>
      </g>

      {/* ==================== pasto delantero (tapa la base) ================ */}
      <g className="tree-base-grass">
        {TREE_BASE_TUFTS.map((t) => (
          <path
            key={t.id}
            d={TREE_TUFT_D}
            fill={t.fill}
            transform={`translate(${t.x.toFixed(1)} ${t.y.toFixed(1)}) scale(${(t.scale * t.flip).toFixed(2)} ${t.scale.toFixed(2)}) rotate(${t.rot.toFixed(0)})`}
          />
        ))}
        {/* dos florecitas entre las matas */}
        <g>
          <circle cx="150" cy="470" r="3.4" fill="#fff" opacity="0.9" />
          <circle cx="150" cy="470" r="1.5" fill="#f7d98a" />
          <circle cx="268" cy="477" r="3" fill="#fff" opacity="0.85" />
          <circle cx="268" cy="477" r="1.4" fill="#f7d98a" />
        </g>
      </g>
    </svg>
  );
}

/* Pasto a todo el ancho, sobre la curva de la colina (no toca el árbol). */
function GrassSvg() {
  return (
    <svg
      className="tree-grass"
      viewBox={`0 0 ${GRASS_VIEW_W} ${GRASS_VIEW_H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="grass-fill" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="var(--grass-base, #5e9e62)" />
          <stop offset="100%" stopColor="var(--grass-tip, #bee09a)" />
        </linearGradient>

        {GRASS_BLADES.map((blade) => (
          <symbol key={blade.id} id={`grass-blade-${blade.id}`} overflow="visible">
            <path d={blade.d} fill="url(#grass-fill)" />
          </symbol>
        ))}

        <symbol id="grass-flower" overflow="visible">
          <g fill="var(--grass-flower, #fffdf4)">
            <circle cx="0" cy="-2.7" r="1.5" />
            <circle cx="2.57" cy="-0.83" r="1.5" />
            <circle cx="1.59" cy="2.18" r="1.5" />
            <circle cx="-1.59" cy="2.18" r="1.5" />
            <circle cx="-2.57" cy="-0.83" r="1.5" />
          </g>
          <circle cx="0" cy="0" r="1.5" fill="var(--grass-flower-core, #f4cf6f)" />
        </symbol>
      </defs>

      {GRASS_TUFTS.map((tuft) => (
        <g
          key={tuft.id}
          className={`grass-tuft grass-tuft--${tuft.layer}`}
          style={{
            animationDuration: `${tuft.duration}s`,
            animationDelay: `${tuft.delay}s`
          }}
        >
          {tuft.blades.map((blade) => (
            <use
              key={blade.key}
              href={`#grass-blade-${blade.shape}`}
              transform={`translate(${blade.x.toFixed(2)} ${blade.y.toFixed(2)}) rotate(${blade.tilt.toFixed(1)}) scale(${blade.sx.toFixed(2)} ${blade.sy.toFixed(3)})`}
            />
          ))}
          {tuft.dew.map((drop, i) => (
            <circle
              key={`dew-${tuft.id}-${i}`}
              cx={drop.x.toFixed(2)}
              cy={(drop.y + 0.5).toFixed(2)}
              r={drop.r.toFixed(2)}
              fill="var(--grass-dew, #f4fbf1)"
              opacity={drop.opacity.toFixed(2)}
            />
          ))}
        </g>
      ))}

      <g className="grass-flowers">
        {GRASS_FLOWERS.map((flower, i) => (
          <use
            key={`grass-flower-${i}`}
            href="#grass-flower"
            transform={`translate(${flower.x.toFixed(1)} ${flower.y.toFixed(1)}) rotate(${flower.rot.toFixed(0)}) scale(${flower.scale.toFixed(2)})`}
          />
        ))}
      </g>
    </svg>
  );
}

function RegalateTab({ activities }) {
  const [open, setOpen] = useState(null);
  const leaves = activities || [];

  return (
    <section className="tab-section regalate-section">
      <div className="container">
        <div className="section-heading centered">
          <span className="section-number">Regálate momentos</span>
          <h2>Un árbol de pequeños momentos.</h2>
          <p>
            Toca una hoja caída para descubrir una actividad sencilla que puedes regalarte hoy. No
            hay forma correcta de hacerlo: elige la que más te guste.
          </p>
        </div>

        <div className="tree-scene">
          {/* Cielo animado: solo nubes y rayos de luz, detrás del árbol.
              No modifica el dibujo del árbol ni la franja de pasto. */}
          <div className="tree-sky" aria-hidden="true">
            <span className="tree-sky__ray tree-sky__ray--a" />
            <span className="tree-sky__ray tree-sky__ray--b" />
            <span className="tree-sky__ray tree-sky__ray--c" />
            <span className="tree-sky__cloud tree-sky__cloud--a" />
            <span className="tree-sky__cloud tree-sky__cloud--b" />
            <span className="tree-sky__cloud tree-sky__cloud--c" />
          </div>

          <div className="tree-holder">
            <TreeSvg />
          </div>

          <div className="tree-sparkles" aria-hidden="true">
            {Array.from({ length: 14 }).map((_, i) => (
              <span
                key={`sp-${i}`}
                style={{
                  left: `${10 + ((i * 31) % 80)}%`,
                  top: `${8 + ((i * 23) % 26)}%`,
                  animationDelay: `${(i * 1.3) % 6}s`,
                  animationDuration: `${5 + ((i * 2) % 5)}s`
                }}
              />
            ))}
          </div>

          {/* Las hojas nacen dentro de la copa y se desprenden desde ahí */}
          <div className="leaves">
            {leaves.map((a, i) => {
              // nacen dentro de la copa y bajan hasta posarse en la franja verde
              const top = 96 + ((i * 29) % 150);
              const left = 20 + ((i * 23) % 60);
              const landing = 470 + ((i * 11) % 36);
              const fall = landing - top;
              const duration = 11 + ((i * 7) % 6);
              const delay = -((i * 11) % 16);
              const sway = ((i % 9) - 4) * 17;
              const color = LEAF_COLORS[i % LEAF_COLORS.length];
              const size = 19 + ((i * 3) % 13);
              return (
                <button
                  key={`${a.actividad}-${i}`}
                  className="leaf"
                  aria-label={a.actividad}
                  title={a.actividad}
                  onClick={() => setOpen(a)}
                  style={{
                    top: `${top}px`,
                    left: `${left}%`,
                    animationDuration: `${duration}s`,
                    animationDelay: `${delay}s`,
                    '--sway': `${sway}px`,
                    '--fall': `${fall}px`,
                    '--leaf-color': color
                  }}
                >
                  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
                    <path
                      d="M12 2C8 6 5 10 6 15c.6 3 3 5 6 7 3-2 5.4-4 6-7 1-5-2-9-6-13z"
                      fill={color}
                      stroke="#4f8349"
                      strokeOpacity="0.45"
                      strokeWidth="0.9"
                    />
                    <path d="M12 5v14" stroke="#4f8349" strokeOpacity="0.32" strokeWidth="1" />
                    <path
                      d="M12 9.2l3.1-2.5M12 12.6l3.3-2.7M12 16l2.9-2.3"
                      stroke="#4f8349"
                      strokeOpacity="0.24"
                      strokeWidth="0.9"
                    />
                  </svg>
                </button>
              );
            })}
          </div>

          <div className="tree-ground">
            <div className="meadow" aria-hidden="true" />
          </div>

          <GrassSvg />
        </div>

        <p className="prototype-note">
          {leaves.length} momentos para regalarte · Toca una hoja que se desprenda del árbol.
        </p>
      </div>

      {open && (
        <div className="crisis-overlay" onClick={() => setOpen(null)}>
          <div
            className="crisis-panel habit-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="habit-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="crisis-close" onClick={() => setOpen(null)} aria-label="Cerrar">
              <Icon name="close" size={18} />
            </button>
            <span className="crisis-kicker">{open.categoria}</span>
            <h2 id="habit-title">{open.actividad}</h2>
            <p className="crisis-lead">{open.descripcion}</p>
            <div className="calm-actions">
              <button className="calm-button" onClick={() => setOpen(null)}>
                <Icon name="check" size={17} /> Ya me lo regalé
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ==========================================================================
   Soporte: landing para reportar fallos
   ========================================================================== */
// Dirección sintética (`.test` está reservado y no puede existir de verdad).
// El buzón real se cambia con la variable de entorno SUPPORT_EMAIL.
const SUPPORT_EMAIL_DESTINO = 'soporte@rutaclara.test';

const SUPPORT_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** La landing de soporte se sirve en /soporte (la SPA resuelve la ruta). */
const esRutaSoporte = (ruta) => /^\/soporte\/?$/i.test(ruta || '');

const SUPPORT_TIPOS = [
  { id: 'no-carga', label: 'Algo no carga o se ve roto' },
  { id: 'no-responde', label: 'Un botón o enlace no responde' },
  { id: 'texto', label: 'Un texto o un dato está mal' },
  { id: 'accesibilidad', label: 'Un problema de accesibilidad' },
  { id: 'otro', label: 'Otro' }
];

const SUPPORT_GRAVEDAD = [
  { id: 'baja', label: 'Baja', ayuda: 'Molesta, pero puedo seguir usando el sitio.' },
  { id: 'media', label: 'Media', ayuda: 'Me impide terminar lo que estaba haciendo.' },
  { id: 'alta', label: 'Alta', ayuda: 'No puedo usar la sección o muestra información riesgosa.' }
];

const SUPPORT_SECCIONES = [
  { id: 'inicio', label: 'Inicio · Autocuidado' },
  { id: 'lineas', label: 'Líneas de ayuda' },
  { id: 'viento', label: 'Cuéntaselo al viento' },
  { id: 'centros', label: 'Centros de atención' },
  { id: 'paz', label: 'Zona de paz' },
  { id: 'regalate', label: 'Regálate un momento' },
  { id: 'soporte', label: 'Esta página de soporte' },
  { id: 'otra', label: 'Otra / no estoy seguro' }
];

const SUPPORT_VACIO = {
  nombre: '',
  correo: '',
  tipo: 'no-responde',
  gravedad: 'media',
  seccion: 'inicio',
  mensaje: '',
  pasos: ''
};

function SupportPage({ onBack }) {
  const [form, setForm] = useState(SUPPORT_VACIO);
  const [estado, setEstado] = useState('inicio'); // inicio | enviando | ok | error
  const [errores, setErrores] = useState({});
  const [ticket, setTicket] = useState('');
  const [fallo, setFallo] = useState('');
  const exitoRef = useRef(null);

  const cambiar = (campo) => (e) => {
    setForm((previo) => ({ ...previo, [campo]: e.target.value }));
    setErrores((previo) => ({ ...previo, [campo]: undefined }));
  };

  const validar = () => {
    const nuevos = {};
    if (form.mensaje.trim().length < 15) {
      nuevos.mensaje = 'Describe qué pasó con al menos una frase completa.';
    }
    if (form.correo.trim() && !SUPPORT_EMAIL_RE.test(form.correo.trim())) {
      nuevos.correo = 'Revisa el correo: parece estar incompleto.';
    }
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  };

  const enviar = async (evento) => {
    evento.preventDefault();
    if (!validar()) return;

    setEstado('enviando');
    setFallo('');
    try {
      const respuesta = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, contexto: navigator.userAgent })
      });
      const datos = await respuesta.json().catch(() => ({}));
      if (!respuesta.ok) throw new Error(datos.error || 'No pudimos enviar el reporte.');
      setTicket(datos.ticket || '');
      setEstado('ok');
    } catch (error) {
      setFallo(
        error.message ||
          'No pudimos enviar el reporte. Revisa tu conexión e inténtalo otra vez.'
      );
      setEstado('error');
    }
  };

  useEffect(() => {
    if (estado === 'ok' && exitoRef.current) exitoRef.current.focus();
  }, [estado]);

  if (estado === 'ok') {
    return (
      <section className="support-page">
        <div className="container support-narrow">
          <div className="support-card support-success" role="status" ref={exitoRef} tabIndex={-1}>
            <span className="support-success-icon">
              <Icon name="check" size={22} />
            </span>
            <h1>Reporte enviado</h1>
            <p className="support-lead">
              Llegó a <strong>{SUPPORT_EMAIL_DESTINO}</strong>. Si dejaste un correo, te escribimos
              ahí para avisarte cuando esté corregido.
            </p>
            <p className="support-ticket">
              Tu número de seguimiento es <strong>{ticket}</strong>
            </p>
            <div className="support-success-actions">
              <button
                type="button"
                className="primary-button support-submit"
                onClick={() => {
                  setForm(SUPPORT_VACIO);
                  setErrores({});
                  setEstado('inicio');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Enviar otro reporte
              </button>
              <button type="button" className="support-link" onClick={onBack}>
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="support-page">
      <div className="container">
        <button type="button" className="support-back" onClick={onBack}>
          <span className="support-back-icon" aria-hidden="true">
            <Icon name="arrow" size={14} />
          </span>
          Volver al inicio
        </button>

        <div className="support-head">
          <span className="section-number">Soporte</span>
          <h1>
            Algo no está funcionando.
            <br />
            Cuéntanos qué pasó.
          </h1>
          <p className="support-lead">
            Este espacio es para fallos del sitio: una pantalla en blanco, un botón que no responde,
            un dato equivocado. Tu reporte llega a {SUPPORT_EMAIL_DESTINO} y nos ayuda a corregirlo.
          </p>
        </div>

        <div className="support-grid">
          <form className="support-card" onSubmit={enviar} noValidate>
            <div className="support-row">
              <div className="support-field">
                <label className="support-label" htmlFor="sup-nombre">
                  Nombre o apodo <span className="support-opt">(opcional)</span>
                </label>
                <input
                  id="sup-nombre"
                  className="support-input"
                  type="text"
                  maxLength={80}
                  autoComplete="name"
                  value={form.nombre}
                  onChange={cambiar('nombre')}
                  placeholder="Cómo quieres que te llamemos"
                />
              </div>

              <div className="support-field">
                <label className="support-label" htmlFor="sup-correo">
                  Correo para responderte <span className="support-opt">(opcional)</span>
                </label>
                <input
                  id="sup-correo"
                  className={`support-input ${errores.correo ? 'is-error' : ''}`}
                  type="email"
                  maxLength={120}
                  autoComplete="email"
                  value={form.correo}
                  onChange={cambiar('correo')}
                  placeholder="tu@correo.com"
                  aria-invalid={Boolean(errores.correo)}
                  aria-describedby={errores.correo ? 'sup-correo-error' : undefined}
                />
                {errores.correo && (
                  <p className="support-error" id="sup-correo-error">
                    {errores.correo}
                  </p>
                )}
              </div>
            </div>

            <div className="support-row">
              <div className="support-field">
                <label className="support-label" htmlFor="sup-tipo">
                  ¿Qué pasó?
                </label>
                <select
                  id="sup-tipo"
                  className="support-select"
                  value={form.tipo}
                  onChange={cambiar('tipo')}
                >
                  {SUPPORT_TIPOS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="support-field">
                <label className="support-label" htmlFor="sup-seccion">
                  ¿Dónde lo viste?
                </label>
                <select
                  id="sup-seccion"
                  className="support-select"
                  value={form.seccion}
                  onChange={cambiar('seccion')}
                >
                  {SUPPORT_SECCIONES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <fieldset className="support-levels">
              <legend className="support-label">¿Qué tanto te afecta?</legend>
              <div className="support-chips">
                {SUPPORT_GRAVEDAD.map((g) => (
                  <label
                    key={g.id}
                    className={`support-chip ${form.gravedad === g.id ? 'is-on' : ''}`}
                    title={g.ayuda}
                  >
                    <input
                      type="radio"
                      name="gravedad"
                      value={g.id}
                      checked={form.gravedad === g.id}
                      onChange={cambiar('gravedad')}
                    />
                    {g.label}
                  </label>
                ))}
              </div>
              <p className="support-hint">
                {SUPPORT_GRAVEDAD.find((g) => g.id === form.gravedad)?.ayuda}
              </p>
            </fieldset>

            <div className="support-field">
              <label className="support-label" htmlFor="sup-mensaje">
                Cuéntanos qué pasó
              </label>
              <textarea
                id="sup-mensaje"
                className={`support-textarea ${errores.mensaje ? 'is-error' : ''}`}
                rows={5}
                maxLength={2000}
                value={form.mensaje}
                onChange={cambiar('mensaje')}
                placeholder="Por ejemplo: en Centros de atención el mapa se queda en blanco y no aparece ningún centro."
                aria-invalid={Boolean(errores.mensaje)}
                aria-describedby={errores.mensaje ? 'sup-mensaje-error' : 'sup-mensaje-ayuda'}
                required
              />
              {errores.mensaje ? (
                <p className="support-error" id="sup-mensaje-error">
                  {errores.mensaje}
                </p>
              ) : (
                <p className="support-hint" id="sup-mensaje-ayuda">
                  Con qué estabas, qué esperabas y qué apareció en su lugar.
                </p>
              )}
            </div>

            <div className="support-field">
              <label className="support-label" htmlFor="sup-pasos">
                Pasos para reproducirlo <span className="support-opt">(opcional)</span>
              </label>
              <textarea
                id="sup-pasos"
                className="support-textarea support-textarea--short"
                rows={3}
                maxLength={1200}
                value={form.pasos}
                onChange={cambiar('pasos')}
                placeholder={'1. Abrí Inicio\n2. Toqué Explorar en Dibujo libre\n3. El lienzo no respondió'}
              />
            </div>

            {estado === 'error' && (
              <p className="support-alert" role="alert">
                {fallo}
              </p>
            )}

            <div className="support-foot">
              <button type="submit" className="primary-button support-submit" disabled={estado === 'enviando'}>
                {estado === 'enviando' ? 'Enviando…' : 'Enviar reporte'}
              </button>
              <p className="support-privacy">
                <Icon name="lock" size={13} />
                Se envía solo lo que escribes aquí. No incluyas datos de salud ni de otras personas.
              </p>
            </div>
          </form>

          <aside className="support-aside">
            <h2 className="support-aside-title">Qué nos ayuda a arreglarlo</h2>
            <ul className="support-list">
              <li>En qué pantalla estabas y qué botón tocaste.</li>
              <li>Qué esperabas ver y qué apareció en su lugar.</li>
              <li>Si pasa siempre o solo a veces.</li>
              <li>Si usas celular, tableta o computador.</li>
            </ul>

            <div className="support-aside-block">
              <span className="support-label">Buzón del proyecto</span>
              <p className="support-email">{SUPPORT_EMAIL_DESTINO}</p>
              <p className="support-hint">
                Cada reporte recibe un número de seguimiento para que puedas mencionarlo después.
              </p>
            </div>

            <div className="support-aside-block support-aside-block--calm">
              <span className="support-label">Si necesitas ayuda ahora</span>
              <p className="support-hint">
                Este formulario no es un canal de urgencias. Si estás en crisis, usa el botón
                «Necesito hablar con alguien ahora» que está en todas las pantallas.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   Footer
   ========================================================================== */
function Footer({ sources, setPanel }) {
  return (
    <footer>
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="brand-mark">
              <span />
            </span>
            <div>
              <strong>ruta clara</strong>
              <small>META · VILLAVICENCIO</small>
            </div>
          </div>
          <p>Información clara para encontrar apoyo a tiempo.</p>
          <div className="footer-links">
            <button onClick={() => setPanel('sources')}>Fuentes oficiales</button>
            <span>·</span>
            <button onClick={() => setPanel('privacy')}>Privacidad</button>
            <span>·</span>
            <button onClick={() => setPanel('about')}>Acerca del proyecto</button>
            <span>·</span>
            <a
              className="footer-support"
              href="/soporte"
              target="_blank"
              rel="noreferrer"
              title="Reportar un problema del sistema (se abre en una pestaña nueva)"
              aria-label="Soporte: reportar un problema del sistema, se abre en una pestaña nueva"
            >
              Soporte
            </a>
          </div>
        </div>

        <div className="ethics-note">
          <Icon name="lock" size={13} />
          <span>
            Ruta Clara no diagnostica, no predice riesgos y no almacena información sensible. Este
            espacio acompaña, pero no reemplaza la atención profesional.
          </span>
        </div>
      </div>
    </footer>
  );
}

function InfoModal({ panel, setPanel, sources }) {
  const content = {
    sources: {
      title: 'Fuentes oficiales',
      body: (
        <div style={{ display: 'grid', gap: 10 }}>
          {(sources || []).map((s) => (
            <a key={s.label} href={s.url} target="_blank" rel="noreferrer" style={{ color: 'var(--blue-deep)', fontSize: 13 }}>
              {s.label}
            </a>
          ))}
        </div>
      )
    },
    privacy: {
      title: 'Privacidad',
      body: (
        <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--ink-soft)' }}>
          No creamos cuentas, no pedimos tu ubicación y no guardamos lo que escribes. Todo el
          contenido funciona en tu dispositivo. No hay cookies de seguimiento ni analítica de
          terceros.
        </p>
      )
    },
    about: {
      title: 'Acerca del proyecto',
      body: (
        <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--ink-soft)' }}>
          Ruta Clara Meta es un prototipo TRL 4 creado para la Hackatón Villavicencio. Reúne rutas
          de apoyo verificadas y las presenta de forma clara y calmada. No sustituye la orientación
          de un profesional de salud mental.
        </p>
      )
    }
  }[panel];

  if (!content) return null;

  return (
    <div className="crisis-overlay" onClick={() => setPanel(null)}>
      <div
        className="crisis-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="info-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="crisis-close" onClick={() => setPanel(null)} aria-label="Cerrar">
          <Icon name="close" size={18} />
        </button>
        <h2 id="info-title" style={{ marginBottom: 14 }}>
          {content.title}
        </h2>
        {content.body}
      </div>
    </div>
  );
}

/* ==========================================================================
   App
   ========================================================================== */
export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState('inicio');
  const [crisisOpen, setCrisisOpen] = useState(false);
  const [panel, setPanel] = useState(null);
  // La landing de soporte vive en /soporte: se puede enlazar y recargar.
  const [enSoporte, setEnSoporte] = useState(() => esRutaSoporte(window.location.pathname));

  const phrases = useMemo(
    () => (data?.phrases?.length ? data.phrases : FALLBACK_PHRASES),
    [data]
  );

  useEffect(() => {
    fetch('/api/routes')
      .then((res) => {
        if (!res.ok) throw new Error('bad response');
        return res.json();
      })
      .then(setData)
      .catch(() => setError(true));
  }, []);

  // Atrás / adelante del navegador también cambian de página.
  useEffect(() => {
    const alVolver = () => setEnSoporte(esRutaSoporte(window.location.pathname));
    window.addEventListener('popstate', alVolver);
    return () => window.removeEventListener('popstate', alVolver);
  }, []);

  // El título de la pestaña sigue a la sección visible; en la barra de
  // navegación se muestra el nombre corto "Al viento" para no desarmar el menú.
  useEffect(() => {
    if (enSoporte) {
      document.title = 'Soporte | Ruta Clara Meta';
      return;
    }
    const tab = TABS.find((t) => t.id === activeTab);
    document.title =
      activeTab === 'viento'
        ? 'Cuéntaselo al viento | Ruta Clara Meta'
        : tab && activeTab !== 'inicio'
          ? `${tab.label} | Ruta Clara Meta`
          : 'Ruta Clara Meta | Orientación en salud mental';
  }, [activeTab, enSoporte]);

  // Animación de desvanecido/revelado al navegar y hacer scroll (subir o bajar)
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
          } else {
            // Al salir del campo de visión (subiendo o bajando), retiramos la clase
            // para que al volver a entrar se vuelva a desvanecer suavemente.
            entry.target.classList.remove('section-visible');
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    const elements = document.querySelectorAll('section, .section-divider');
    elements.forEach((el) => {
      el.classList.add('section-fade');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [activeTab, enSoporte]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const volverAlInicio = () => {
    if (window.location.pathname !== '/') window.history.pushState({}, '', '/');
    setEnSoporte(false);
    setActiveTab('inicio');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const setTab = (id) => {
    if (enSoporte) {
      window.history.pushState({}, '', '/');
      setEnSoporte(false);
    }
    setActiveTab(id);
    if (id !== 'inicio') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const lines = data?.lines?.length ? data.lines : CRISIS_LINES;

  return (
    <div className="app-shell">
      {/* Fondo animado común a todo el sitio (decorativo, sin interacción) */}
      <AnimatedBackground variant={BACKGROUND_VARIANT[activeTab] || 'inicio'} />

      <a
        href="#contenido"
        style={{
          position: 'absolute',
          left: -9999,
          top: 0,
          background: 'var(--ink)',
          color: '#fff',
          padding: '10px 16px',
          zIndex: 200
        }}
      >
        Saltar al contenido
      </a>

      <Header tabs={TABS} activeTab={activeTab} setTab={setTab} />

      <main id="contenido">
        {error && (
          <div className="container" style={{ padding: '20px 0' }}>
            <p className="prototype-note">
              No se pudo cargar la información desde el servidor. La ayuda inmediata sigue disponible
              con los botones de esta pantalla.
            </p>
          </div>
        )}

        {!enSoporte && activeTab === 'inicio' && (
          <HomeTab
            data={data}
            phrases={phrases}
            setTab={setTab}
            openCrisis={() => setCrisisOpen(true)}
            scrollTo={scrollTo}
          />
        )}
        {!enSoporte && activeTab === 'lineas' && <LinesTab lines={lines} />}
        {!enSoporte && activeTab === 'viento' && <WindTab setTab={setTab} />}
        {!enSoporte && activeTab === 'centros' && <CentersTab centers={data?.centers} />}
        {!enSoporte && activeTab === 'paz' && <PeaceTab phrases={phrases} setTab={setTab} />}
        {!enSoporte && activeTab === 'regalate' && <RegalateTab activities={data?.regalate} />}
        {enSoporte && <SupportPage onBack={volverAlInicio} />}
      </main>

      <Footer sources={data?.sources} setPanel={setPanel} />

      <button className="emergency-fab" onClick={() => setCrisisOpen(true)}>
        <span>
          <Icon name="phone" size={18} />
        </span>
        <span>
          <small>¿Necesitas ayuda ahora?</small>
          <strong>Necesito hablar con alguien ahora</strong>
        </span>
      </button>

      {crisisOpen && <CrisisModal lines={CRISIS_LINES} onClose={() => setCrisisOpen(false)} />}
      <InfoModal panel={panel} setPanel={setPanel} sources={data?.sources} />
    </div>
  );
}
