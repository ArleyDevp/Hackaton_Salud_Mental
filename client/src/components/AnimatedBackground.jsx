import { useEffect, useState } from 'react';
import useParallax from '../hooks/useParallax';
import useReducedMotion from '../hooks/useReducedMotion';
import './AnimatedBackground.css';

/* Pétalos del fondo de "Al viento": posición, color, tamaño y ritmo.
   Son puramente decorativos; el texto del usuario nunca pasa por aquí. */
const WIND_PETALS = [
  { id: 'p1', y: '16%', x: '8vw', delay: '-3s', dur: 26, size: 13, color: '#ffb3c9' },
  { id: 'p2', y: '32%', x: '42vw', delay: '-11s', dur: 31, size: 10, color: '#ffd66b' },
  { id: 'p3', y: '52%', x: '22vw', delay: '-7s', dur: 28, size: 14, color: '#bfe5ed' },
  { id: 'p4', y: '68%', x: '58vw', delay: '-17s', dur: 34, size: 11, color: '#dedaf0' },
  { id: 'p5', y: '84%', x: '14vw', delay: '-21s', dur: 30, size: 12, color: '#cfe3d5' },
  { id: 'p6', y: '24%', x: '66vw', delay: '-13s', dur: 36, size: 9, color: '#ffb3c9' },
  { id: 'p7', y: '44%', x: '34vw', delay: '-5s', dur: 24, size: 12, color: '#dedaf0' },
  { id: 'p8', y: '74%', x: '48vw', delay: '-9s', dur: 33, size: 10, color: '#bfe5ed' }
];

/**
 * Fondo animado del sitio. Es una capa fija, decorativa y sin interacción
 * (`pointer-events: none`, `aria-hidden`), siempre por debajo del contenido.
 *
 * variant: 'inicio' | 'ayuda' | 'viento' | 'centros' | 'paz' | 'momentos'
 */
export default function AnimatedBackground({ variant = 'inicio' }) {
  const reduced = useReducedMotion();
  const rootRef = useParallax({ disabled: reduced });
  const [flash, setFlash] = useState(null);

  /* Pausa todas las animaciones cuando la pestaña queda oculta.
     `is-paused` cubre la capa fija; `amb-paused` en <html> cubre las
     atmósferas que viven dentro del contenido (tarjeta oscura, pines). */
  useEffect(() => {
    const element = rootRef.current;
    if (!element) return undefined;

    const sync = () => {
      const hidden = document.hidden;
      element.classList.toggle('is-paused', hidden);
      document.documentElement.classList.toggle('amb-paused', hidden);
    };

    sync();
    document.addEventListener('visibilitychange', sync);
    return () => {
      document.removeEventListener('visibilitychange', sync);
      element.classList.remove('is-paused');
      document.documentElement.classList.remove('amb-paused');
    };
  }, [rootRef]);

  /* Destello suave al hacer clic. */
  useEffect(() => {
    if (reduced) {
      setFlash(null);
      return undefined;
    }

    let timeout = 0;
    const onPointerDown = (event) => {
      setFlash({ id: event.timeStamp, x: event.clientX, y: event.clientY });
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => setFlash(null), 1700);
    };

    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [reduced]);

  /* En Inicio el degradado cambia de tono a medida que se hace scroll. */
  useEffect(() => {
    const element = rootRef.current;
    if (!element) return undefined;

    if (variant !== 'inicio') {
      element.style.setProperty('--amb-scroll', '0');
      return undefined;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      element.style.setProperty('--amb-scroll', progress.toFixed(3));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [variant, rootRef]);

  /* Anclajes: la capa fija se alinea con elementos reales de la página.
     - paz:   las ondas nacen en el círculo de respiración.
     - ayuda: el brillo respira detrás de la tarjeta "Recomendada". */
  useEffect(() => {
    const element = rootRef.current;
    if (!element) return undefined;

    const ANCHORS = {
      paz: { selector: '.breath-stage', x: '--breath-x', y: '--breath-y' },
      ayuda: {
        selector: '.route-card.featured',
        x: '--reco-x',
        y: '--reco-y',
        w: '--reco-w',
        h: '--reco-h',
        pad: 70
      }
    };
    const anchor = ANCHORS[variant];
    if (!anchor) return undefined;

    let frame = 0;
    let last = {};

    const update = () => {
      frame = 0;
      const node = document.querySelector(anchor.selector);

      // Si la tarjeta no está en pantalla, el brillo se oculta (tamaño 0).
      if (!node) {
        if (anchor.w) {
          element.style.setProperty(anchor.w, '0px');
          element.style.setProperty(anchor.h, '0px');
          last = {};
        }
        return;
      }

      const box = node.getBoundingClientRect();
      const x = Math.round(box.left + box.width / 2);
      const y = Math.round(box.top + box.height / 2);
      const w = anchor.pad ? Math.round(box.width + anchor.pad * 2) : 0;
      const h = anchor.pad ? Math.round(box.height + anchor.pad * 2) : 0;

      if (last.x === x && last.y === y && last.w === w && last.h === h) return;
      last = { x, y, w, h };

      element.style.setProperty(anchor.x, `${x}px`);
      element.style.setProperty(anchor.y, `${y}px`);
      if (anchor.w) element.style.setProperty(anchor.w, `${w}px`);
      if (anchor.h) element.style.setProperty(anchor.h, `${h}px`);
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    // La lista de líneas se filtra: si cambia el DOM, se vuelve a medir.
    let observer = null;
    if (anchor.w && typeof MutationObserver === 'function') {
      observer = new MutationObserver(schedule);
      observer.observe(document.querySelector('main') || document.body, { childList: true, subtree: true });
    }

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      if (observer) observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [variant, rootRef]);

  /* Al viento: "Que se lo lleve el viento" acelera el fondo 3,6 s. */
  useEffect(() => {
    const element = rootRef.current;
    if (!element || variant !== 'viento') return undefined;

    let timeout = 0;
    const onBurst = () => {
      element.classList.add('is-burst');
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => element.classList.remove('is-burst'), 3600);
    };

    window.addEventListener('rc:wind-burst', onBurst);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener('rc:wind-burst', onBurst);
      element.classList.remove('is-burst');
    };
  }, [variant, rootRef]);

  return (
    <div className={`amb-bg amb-bg--${variant}`} ref={rootRef} aria-hidden="true">
      {/* base: degradado lento entre tonos pastel */}
      <div className="amb-bg__base" />
      <div className="amb-bg__drift" />

      {/* Inicio: tres tonos que se recorren con el scroll */}
      {variant === 'inicio' ? (
        <div className="amb-bg__scroll-tones" />
      ) : (
        <div className="amb-bg__wash" />
      )}

      <div className="amb-bg__parallax">
        {/* blobs de luz difuminados */}
        <div className="amb-bg__blobs">
          <span className="amb-bg__blob amb-bg__blob--a" />
          <span className="amb-bg__blob amb-bg__blob--b" />
          <span className="amb-bg__blob amb-bg__blob--c" />
          <span className="amb-bg__blob amb-bg__blob--d" />
        </div>

        {/* Al viento: líneas de viento y pétalos */}
        {variant === 'viento' && (
          <div className="amb-wind">
            <span className="amb-wind__line amb-wind__line--a" />
            <span className="amb-wind__line amb-wind__line--b" />
            <span className="amb-wind__line amb-wind__line--c" />
            {WIND_PETALS.map((petal) => (
              <span
                key={petal.id}
                className="amb-wind__petal"
                style={{
                  '--petal-y': petal.y,
                  '--petal-x': petal.x,
                  '--petal-delay': petal.delay,
                  '--petal-dur': `${petal.dur}s`,
                  '--petal-size': `${petal.size}px`,
                  '--petal-color': petal.color
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Inicio: cuadrícula de puntitos que responde al cursor, con una
          oleada de brillo cada 11 s. La máscara usa las variables del
          puntero, así que no hace falta un elemento por punto. */}
      {variant === 'inicio' && (
        <>
          <div className="amb-dots" />
          <span className="amb-dots__sweep" />
        </>
      )}

      {/* Líneas de ayuda: brillo que respira detrás de la tarjeta "Recomendada". */}
      {variant === 'ayuda' && <span className="amb-reco" />}

      {/* Centros: cuadrícula, curvas de nivel y puntos que laten en los bordes.
          Los puntos viven en los márgenes de la pantalla, nunca sobre las
          tarjetas ni sobre el mapa. */}
      {variant === 'centros' && (
        <div className="amb-map">
          <span className="amb-map__grid" />
          <span className="amb-map__contours" />
          {Array.from({ length: 7 }).map((_, i) => (
            <span key={`map-dot-${i}`} className={`amb-map__dot amb-map__dot--${i + 1}`} />
          ))}
        </div>
      )}

      {/* Zona de paz: ondas sincronizadas con inhala / sostén / exhala.
          Van fuera del parallax para quedar centradas en el círculo real. */}
      {variant === 'paz' && (
        <div className="amb-paz">
          <span className="amb-paz__halo" />
          <span className="amb-paz__wave amb-paz__wave--inhala" />
          <span className="amb-paz__wave amb-paz__wave--sostener" />
          <span className="amb-paz__wave amb-paz__wave--exhala" />
          <span className="amb-paz__wave amb-paz__wave--pausa" />
        </div>
      )}

      {/* luz discreta que sigue al cursor */}
      <span className="amb-bg__cursor" />

      {/* destello del clic */}
      {flash && (
        <span
          key={flash.id}
          className="amb-bg__flash"
          style={{ '--fx': `${flash.x}px`, '--fy': `${flash.y}px` }}
        />
      )}
    </div>
  );
}
