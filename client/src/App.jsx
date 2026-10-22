import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CRISIS_LINES } from './crisis.js';

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

function osmUrl(lat, lon) {
  const d = 0.07;
  const bbox = [
    (lon - d).toFixed(4),
    (lat - d).toFixed(4),
    (lon + d).toFixed(4),
    (lat + d).toFixed(4)
  ].join('%2C');
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat.toFixed(
    4
  )}%2C${lon.toFixed(4)}`;
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
          .catch(() => {});
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
   Inicio
   ========================================================================== */
function HomeTab({ data, phrases, setTab, openCrisis, scrollTo }) {
  const [selected, setSelected] = useState(null);
  const needs = data?.needs || [];
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
              <article className={`resource-card ${r.icon === 'heart' ? 'lavender' : r.icon === 'users' ? 'sand' : ''}`} key={r.title}>
                <div className="resource-illustration">
                  <span />
                  <Icon name={r.icon} size={40} />
                </div>
                <div className="resource-copy">
                  <span>{r.kicker}</span>
                  <h3>{r.title}</h3>
                  <p>{r.text}</p>
                  <button onClick={() => setTab('paz')}>
                    Explorar recurso <Icon name="arrow" size={15} />
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
              <div>
                <span className="section-number">{closing.kicker}</span>
                <h2 style={{ marginTop: 16 }}>{closing.title}</h2>
              </div>
              <div className="closing-action">
                <p>{closing.text}</p>
                <a className="light-button" href={closing.buttonHref}>
                  <Icon name="phone" size={17} /> {closing.buttonLabel}
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

/* ==========================================================================
   Líneas de ayuda
   ========================================================================== */
function LinesTab({ lines }) {
  const [filter, setFilter] = useState('Todas');
  const all = lines || CRISIS_LINES;
  const filtered = filter === 'Todas' ? all : all.filter((l) => l.scope === 'Villavicencio');

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
            {['Todas', 'En Villavicencio'].map((f) => (
              <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="routes-grid">
          {filtered.map((l) => (
            <article className={`route-card ${l.featured ? 'featured' : ''}`} key={l.id}>
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

function WindTab({ setTab }) {
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
function CentersTab({ centers }) {
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
                src={osmUrl(current.lat, current.lon)}
                loading="lazy"
              />
            )}
            <div className="map-caption">
              {current
                ? `${current.name} · ${current.address}. Ubicación aproximada para el prototipo; confirma con la entidad.`
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

function TreeSvg() {
  return (
    <svg className="tree-svg" viewBox="0 0 340 340" aria-hidden="true">
      <defs>
        <linearGradient id="rc-foliage-a" x1="0.2" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#a8d48a" />
          <stop offset="100%" stopColor="#5f9a5f" />
        </linearGradient>
        <linearGradient id="rc-foliage-b" x1="0.2" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#c0e2a0" />
          <stop offset="100%" stopColor="#77ae68" />
        </linearGradient>
        <linearGradient id="rc-trunk" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#a37c58" />
          <stop offset="100%" stopColor="#6b4f37" />
        </linearGradient>
        <radialGradient id="rc-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#d9eec4" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#d9eec4" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* luz suave detrás del árbol */}
      <ellipse cx="170" cy="122" rx="152" ry="134" fill="url(#rc-glow)" />

      {/* suelo */}
      <ellipse cx="170" cy="320" rx="106" ry="13" fill="#cde0b4" opacity="0.75" />

      {/* tronco */}
      <path d="M157 322 L183 322 L176 212 L164 212 Z" fill="url(#rc-trunk)" />

      {/* ramas */}
      <g className="tree-branches" fill="none" stroke="url(#rc-trunk)" strokeLinecap="round">
        <path d="M170 234 C 150 210 122 198 90 188" strokeWidth="11" />
        <path d="M170 234 C 190 210 218 198 250 188" strokeWidth="11" />
        <path d="M170 208 C 160 180 148 160 130 140" strokeWidth="9" />
        <path d="M170 208 C 180 180 192 160 210 140" strokeWidth="9" />
        <path d="M170 192 C 170 168 170 154 170 132" strokeWidth="8" />
      </g>

      {/* copa */}
      <g className="tree-foliage">
        <ellipse cx="170" cy="118" rx="92" ry="78" fill="url(#rc-foliage-a)" />
        <ellipse cx="96" cy="162" rx="62" ry="50" fill="url(#rc-foliage-b)" />
        <ellipse cx="244" cy="162" rx="62" ry="50" fill="url(#rc-foliage-b)" />
        <ellipse cx="130" cy="86" rx="50" ry="42" fill="url(#rc-foliage-b)" />
        <ellipse cx="214" cy="94" rx="46" ry="38" fill="url(#rc-foliage-a)" />
        <circle cx="126" cy="128" r="6.5" fill="#fff" opacity="0.4" />
        <circle cx="210" cy="140" r="5" fill="#fff" opacity="0.34" />
        <circle cx="166" cy="72" r="7" fill="#fff" opacity="0.3" />
        <circle cx="234" cy="114" r="4" fill="#fff" opacity="0.32" />
        <circle cx="84" cy="150" r="4.5" fill="#fff" opacity="0.3" />
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
              const top = 58 + ((i * 19) % 122); // dentro de la copa
              const left = 14 + ((i * 23) % 73);
              const duration = 8 + ((i * 7) % 6);
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
            <div className="meadow" aria-hidden="true">
              <div className="meadow-blades" />
            </div>
          </div>
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

  // El título de la pestaña sigue a la sección visible; en la barra de
  // navegación se muestra el nombre corto "Al viento" para no desarmar el menú.
  useEffect(() => {
    const tab = TABS.find((t) => t.id === activeTab);
    document.title =
      activeTab === 'viento'
        ? 'Cuéntaselo al viento | Ruta Clara Meta'
        : tab && activeTab !== 'inicio'
          ? `${tab.label} | Ruta Clara Meta`
          : 'Ruta Clara Meta | Orientación en salud mental';
  }, [activeTab]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const setTab = (id) => {
    setActiveTab(id);
    if (id !== 'inicio') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const lines = data?.lines?.length ? data.lines : CRISIS_LINES;

  return (
    <div className="app-shell">
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

        {activeTab === 'inicio' && (
          <HomeTab
            data={data}
            phrases={phrases}
            setTab={setTab}
            openCrisis={() => setCrisisOpen(true)}
            scrollTo={scrollTo}
          />
        )}
        {activeTab === 'lineas' && <LinesTab lines={lines} />}
        {activeTab === 'viento' && <WindTab setTab={setTab} />}
        {activeTab === 'centros' && <CentersTab centers={data?.centers} />}
        {activeTab === 'paz' && <PeaceTab phrases={phrases} setTab={setTab} />}
        {activeTab === 'regalate' && <RegalateTab activities={data?.regalate} />}
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
