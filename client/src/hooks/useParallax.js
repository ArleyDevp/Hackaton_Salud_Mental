import { useEffect, useRef } from 'react';

const LERP = 0.055; // suavidad del seguimiento (más bajo = más lento)
const EPSILON = 0.001;

/**
 * Parallax con el puntero + luz que sigue al cursor.
 *
 * Escribe variables CSS en el elemento referenciado (nunca re-renderiza):
 *   --amb-px / --amb-py  posición normalizada del puntero (-1 .. 1)
 *   --amb-cx / --amb-cy  posición del puntero en píxeles
 *
 * - Usa un único rAF y bucle con lerp.
 * - Pausa cuando la pestaña no está visible.
 * - Limpia todos los listeners al desmontar.
 * - No hace nada si el usuario pide movimiento reducido.
 */
export default function useParallax({ disabled = false } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || disabled) return undefined;
    if (typeof window === 'undefined') return undefined;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    let frame = 0;
    let visible = !document.hidden;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let pointerX = Math.round(window.innerWidth / 2);
    let pointerY = Math.round(window.innerHeight * 0.42);

    const write = () => {
      element.style.setProperty('--amb-px', currentX.toFixed(3));
      element.style.setProperty('--amb-py', currentY.toFixed(3));
      element.style.setProperty('--amb-cx', `${Math.round(pointerX)}px`);
      element.style.setProperty('--amb-cy', `${Math.round(pointerY)}px`);
    };

    const tick = () => {
      frame = 0;
      currentX += (targetX - currentX) * LERP;
      currentY += (targetY - currentY) * LERP;
      write();

      const settled =
        Math.abs(targetX - currentX) < EPSILON && Math.abs(targetY - currentY) < EPSILON;

      if (settled) {
        currentX = targetX;
        currentY = targetY;
        write();
        return;
      }

      if (visible) frame = window.requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame || !visible) return;
      frame = window.requestAnimationFrame(tick);
    };

    const onPointerMove = (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      targetX = (event.clientX / window.innerWidth) * 2 - 1;
      targetY = (event.clientY / window.innerHeight) * 2 - 1;
      element.setAttribute('data-pointer', 'on');
      start();
    };

    const onPointerLeave = () => {
      targetX = 0;
      targetY = 0;
      start();
    };

    const onVisibility = () => {
      visible = !document.hidden;
      if (!visible) {
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
        return;
      }
      start();
    };

    write();

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('blur', onPointerLeave);
    window.addEventListener('resize', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('blur', onPointerLeave);
      window.removeEventListener('resize', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [disabled]);

  return ref;
}
