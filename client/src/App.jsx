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
  { id: 'libros', label: 'Libros' },
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

// Enlaces reales de los libros consultando el backend (Open Library, con caché).
function useBookLinks(books) {
  const [links, setLinks] = useState({});

  useEffect(() => {
    let alive = true;
    (books || []).forEach((b) => {
      const q = new URLSearchParams({ title: b.title, author: b.author });
      fetch(`/api/books?${q.toString()}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((link) => {
          if (link && alive) setLinks((prev) => ({ ...prev, [b.title]: link }));
        })
        .catch(() => {});
    });
    return () => {
      alive = false;
    };
  }, [books]);

  return links;
}

/* --------------------------------------------------------------------------
   Música de relajación para la Zona de paz.
   Intenta traer una pista real desde Internet Archive (API abierta, sin clave).
   Si la red falla, genera un ambiente suave en el propio navegador para que
   el botón siempre funcione. Nunca suena sola: siempre la enciende la persona.
   -------------------------------------------------------------------------- */
function useCalmMusic() {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const audioRef = useRef(null);
  const ctxRef = useRef(null);
  const nodesRef = useRef([]);
  const fadeRef = useRef(null);
  const modeRef = useRef(null); // 'stream' | 'synth'
  const urlRef = useRef(null);

  const stop = () => {
    try {
      if (fadeRef.current) {
        clearInterval(fadeRef.current);
        fadeRef.current = null;
      }
      if (modeRef.current === 'stream' && audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (modeRef.current === 'synth' && ctxRef.current) {
        nodesRef.current.forEach((n) => {
          try {
            n.stop();
          } catch {
            /* nodo ya detenido */
          }
        });
        nodesRef.current = [];
        const ctx = ctxRef.current;
        ctxRef.current = null;
        ctx.close();
      }
    } catch {
      /* aunque algo falle, la música siempre se puede apagar */
    } finally {
      modeRef.current = null;
      setPlaying(false);
    }
  };

  useEffect(
    () => () => stop(),
    []
  );

  // Respaldo: un pad suave generado con Web Audio (sin internet, sin archivos).
  const startSynth = () => {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    const ctx = new AC();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.value = 0.0001;
    master.connect(ctx.destination);
    master.gain.exponentialRampToValueAtTime(0.07, ctx.currentTime + 4);

    const freqs = [174.61, 261.63, 329.63, 392.0];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = i % 2 ? 'sine' : 'triangle';
      osc.frequency.value = f;
      gain.gain.value = 0.2 / (i + 1);

      // vibrato lentísimo para que el sonido "respire"
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.04 + i * 0.013;
      lfoGain.gain.value = 0.1 / (i + 1);
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);

      osc.connect(gain);
      gain.connect(master);
      osc.start();
      lfo.start();
      nodesRef.current.push(osc, lfo);
    });

    modeRef.current = 'synth';
    return true;
  };

  // Algunos navegadores dejan `play()` en espera; no queremos quedarnos colgados.
  const withTimeout = (promise, ms) =>
    Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('tiempo agotado')), ms))
    ]);

  const stopSynth = () => {
    if (modeRef.current !== 'synth' || !ctxRef.current) return;
    nodesRef.current.forEach((n) => {
      try {
        n.stop();
      } catch {
        /* nodo ya detenido */
      }
    });
    nodesRef.current = [];
    const ctx = ctxRef.current;
    ctxRef.current = null;
    ctx.close();
  };

  const startStream = async (url) => {
    const audio = new Audio();
    audio.src = url;
    audio.loop = true;
    audio.volume = 0;
    audio.preload = 'auto';
    await withTimeout(audio.play(), 8000);

    // La pista real ya suena: recién ahora apagamos el ambiente generado.
    stopSynth();
    audioRef.current = audio;
    modeRef.current = 'stream';

    const start = Date.now();
    fadeRef.current = setInterval(() => {
      const v = Math.min(0.5, ((Date.now() - start) / 4000) * 0.5);
      audio.volume = v;
      if (v >= 0.5 && fadeRef.current) {
        clearInterval(fadeRef.current);
        fadeRef.current = null;
      }
    }, 120);
  };

  // Busca una pista de relajación real en Internet Archive (API abierta, sin clave).
  const resolveTrack = async () => {
    const q = new URLSearchParams({
      q: 'mediatype:audio AND (title:(meditation OR ambient OR relaxing OR "new age" OR calm OR sleep OR rain OR nature OR piano OR zen OR spa) OR subject:(meditation OR ambient OR "new age"))',
      sort: 'downloads desc',
      rows: '30',
      page: '1',
      output: 'json'
    });
    // Ojo: no se puede repetir la clave en un objeto; se agregan con append.
    q.append('fl[]', 'identifier');
    q.append('fl[]', 'title');

    const res = await withTimeout(
      fetch(`https://archive.org/advancedsearch.php?${q.toString()}`),
      9000
    );
    const json = await res.json();

    const calm =
      /medita|ambient|relax|new age|calm|sleep|rain|nature|piano|zen|spa|chill|ocean|forest/i;
    const pool = (json?.response?.docs || []).filter((d) =>
      calm.test(`${d.title || ''} ${d.identifier || ''}`)
    );
    if (!pool.length) throw new Error('sin resultados');

    // Probamos hasta 3 candidatas antes de quedarnos con el sonido generado.
    for (let n = 0; n < 3 && pool.length > 0; n += 1) {
      const pick = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
      try {
        const meta = await withTimeout(
          fetch(`https://archive.org/metadata/${encodeURIComponent(pick.identifier)}`),
          9000
        ).then((r) => r.json());

        const files = (meta?.files || []).filter(
          (f) => /\.(mp3|ogg|m4a)$/i.test(f.name) && f.name.indexOf('__') !== 0
        );
        const mp3 =
          files.find((f) => /\.mp3$/i.test(f.name) && Number(f.size || 0) < 25000000) ||
          files.find((f) => Number(f.size || 0) < 25000000) ||
          files[0];
        if (!mp3) continue;

        return `https://archive.org/download/${encodeURIComponent(
          pick.identifier
        )}/${encodeURIComponent(mp3.name)}`;
      } catch {
        /* probamos la siguiente candidata */
      }
    }
    throw new Error('sin reproducible');
  };

  const toggle = async () => {
    if (playing) {
      stop();
      return;
    }
    setError(false);

    // 1) El sonido de ambiente arranca al instante y no depende de la red.
    if (!startSynth()) {
      setError(true);
      return;
    }
    setPlaying(true);

    // 2) En segundo plano buscamos una pista real y, si llega, la cambiamos
    //    sin cortar la calma. Si no llega, seguimos con el sonido generado.
    if (urlRef.current) {
      startStream(urlRef.current).catch(() => {});
      return;
    }

    setLoading(true);
    try {
      const url = await resolveTrack();
      urlRef.current = url;
      if (modeRef.current === 'synth') await startStream(url);
    } catch {
      /* seguimos con el sonido generado; no es un error para quien nos visita */
    } finally {
      setLoading(false);
    }
  };

  return { playing, loading, error, toggle };
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
            </div>
            <div className="calm-actions centered visual-actions">
              <button className="calm-button" onClick={() => setTab('paz')}>
                <Icon name="leaf" size={17} /> Zona de paz
              </button>
            </div>
          </div>
        </div>
      </section>

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
   Libros (con enlaces reales vía Google Books)
   ========================================================================== */
function BookLink({ book, link }) {
  if (link?.readUrl) {
    return (
      <a className="book-link read" href={link.readUrl} target="_blank" rel="noreferrer">
        <Icon name="book" size={16} /> Leer ahora
      </a>
    );
  }
  if (link) {
    return (
      <a className="book-link buy" href={link.buyUrl} target="_blank" rel="noreferrer">
        <Icon name="sparkle" size={16} /> Toca comprarlo
      </a>
    );
  }
  return (
    <a
      className="book-link search"
      href={`https://openlibrary.org/search?q=${encodeURIComponent(`${book.title} ${book.author}`)}`}
      target="_blank"
      rel="noreferrer"
    >
      <Icon name="book" size={16} /> Buscar en Open Library
    </a>
  );
}

function BooksTab({ books }) {
  const all = books || [];
  const links = useBookLinks(all);

  return (
    <section className="tab-section books-section">
      <div className="container">
        <div className="section-heading">
          <span className="section-number">Libros</span>
          <h2>Lecturas para acompañarte.</h2>
          <p>
            Libros para relajarte y cuidar tu ánimo. Cada uno abre directamente su página: si se
            puede leer en línea, te lleva ahí; si hay que comprarlo, te lo decimos con claridad.
          </p>
        </div>

        <div className="book-grid">
          {all.map((b) => (
            <article className="book-card" key={b.title}>
              <span className="book-spine">
                <Icon name="book" size={22} />
              </span>
              <h3>{b.title}</h3>
              <small>{b.author}</small>
              <p>{b.description}</p>
              <BookLink book={b} link={links[b.title]} />
            </article>
          ))}
        </div>

        <p className="prototype-note">
          {all.length} libros para acompañarte · Enlaces obtenidos de Open Library (puede tardar unos
          segundos en cargar).
        </p>
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
              aria-busy={music.loading}
            >
              <Icon name={music.playing ? 'pause' : 'music'} size={18} />
              {music.playing ? 'Detener música' : 'Poner música tranquila'}
            </button>
            <small className="music-note">
              {music.error
                ? 'No se pudo generar el sonido en este dispositivo. Puedes seguir con la respiración.'
                : !music.playing
                ? 'Música de relajación en bucle. Nunca suena sola: tú la enciendes.'
                : music.loading
                ? 'Sonido suave activo · Buscando una pista de relajación en línea…'
                : 'Sonido suave de fondo · Ajústalo al volumen que te sirva'}
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
const LEAF_COLORS = ['#ffb3c9', '#ff96b8', '#ffcadc', '#ffb9a8', '#ffc9a3', '#ffdcc0'];

function TreeSvg() {
  return (
    <svg className="tree-svg" viewBox="0 0 340 340" aria-hidden="true">
      <defs>
        <linearGradient id="rc-foliage-a" x1="0.2" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#ffd6e2" />
          <stop offset="100%" stopColor="#ff9fbe" />
        </linearGradient>
        <linearGradient id="rc-foliage-b" x1="0.2" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#ffe4ec" />
          <stop offset="100%" stopColor="#ffb2c9" />
        </linearGradient>
        <linearGradient id="rc-trunk" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#9c7757" />
          <stop offset="100%" stopColor="#6c4f37" />
        </linearGradient>
        <radialGradient id="rc-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ffd9e5" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ffd9e5" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* luz suave detrás del árbol */}
      <ellipse cx="170" cy="122" rx="152" ry="134" fill="url(#rc-glow)" />

      {/* suelo */}
      <ellipse cx="170" cy="320" rx="106" ry="13" fill="#ecc9d4" opacity="0.65" />

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
        <circle cx="126" cy="128" r="6.5" fill="#fff" opacity="0.36" />
        <circle cx="210" cy="140" r="5" fill="#fff" opacity="0.3" />
        <circle cx="166" cy="72" r="7" fill="#fff" opacity="0.28" />
        <circle cx="234" cy="114" r="4" fill="#fff" opacity="0.3" />
        <circle cx="84" cy="150" r="4.5" fill="#fff" opacity="0.28" />
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
                      stroke="#d4738d"
                      strokeOpacity="0.45"
                      strokeWidth="0.9"
                    />
                    <path d="M12 5v14" stroke="#d4738d" strokeOpacity="0.32" strokeWidth="1" />
                    <path
                      d="M12 9.2l3.1-2.5M12 12.6l3.3-2.7M12 16l2.9-2.3"
                      stroke="#d4738d"
                      strokeOpacity="0.24"
                      strokeWidth="0.9"
                    />
                  </svg>
                </button>
              );
            })}
          </div>

          <div className="tree-ground" />
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
        {activeTab === 'libros' && <BooksTab books={data?.books} />}
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
