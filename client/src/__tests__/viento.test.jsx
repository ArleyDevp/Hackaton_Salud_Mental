/**
 * Pruebas de "Cuéntaselo al viento".
 *
 * Cubren el contrato de privacidad del módulo (no se pide ni se guarda nada)
 * y el respeto de `prefers-reduced-motion`.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { WindTab } from '../App.jsx';

const setTab = vi.fn();
const textarea = () => document.getElementById('wind-text');
const botonViento = () =>
  screen.getByRole('button', { name: /Que se lo lleve el viento/i });
const particulas = () => document.querySelectorAll('.wind-bit');

const matchMediaReal = window.matchMedia;

/** Simula la preferencia del sistema. jsdom no la expone por sí solo. */
function forzarMovimiento(reduce) {
  window.matchMedia = (query) => ({
    matches: Boolean(reduce) && query.includes('prefers-reduced-motion'),
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent: () => false
  });
}

let llamadasFetch;

beforeEach(() => {
  setTab.mockClear();
  localStorage.clear();
  sessionStorage.clear();
  forzarMovimiento(false);
  // Cualquier intento de enviar el texto al servidor queda registrado.
  llamadasFetch = [];
  global.fetch = (...args) => {
    llamadasFetch.push(args);
    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
  };
});

afterEach(() => {
  window.matchMedia = matchMediaReal;
  cleanup();
});

describe('Cuéntaselo al viento — escritura', () => {
  it('muestra el título y el subtítulo del módulo', () => {
    render(<WindTab setTab={setTab} />);
    expect(screen.getByRole('heading', { name: 'Cuéntaselo al viento' })).not.toBeNull();
    expect(
      screen.getByText(/Escribe lo que te pesa\. El viento se encarga del resto\./)
    ).not.toBeNull();
    expect(screen.getByText('Al viento')).not.toBeNull();
  });

  it('mantiene el botón deshabilitado mientras no haya texto', () => {
    render(<WindTab setTab={setTab} />);
    expect(botonViento().disabled).toBe(true);

    fireEvent.change(textarea(), { target: { value: '   ' } });
    expect(botonViento().disabled).toBe(true);
  });

  it('habilita el botón al escribir y muestra el contador', () => {
    render(<WindTab setTab={setTab} />);
    fireEvent.change(textarea(), { target: { value: 'hoy me siento agobiado' } });
    expect(botonViento().disabled).toBe(false);
    expect(screen.getByText('22 / 1200')).not.toBeNull();
  });

  it('limita la entrada a 1200 caracteres', () => {
    render(<WindTab setTab={setTab} />);
    expect(textarea().getAttribute('maxlength')).toBe('1200');
  });
});

describe('Cuéntaselo al viento — privacidad', () => {
  it('el texto no sale de la pantalla: nada de fetch, ni localStorage, ni sessionStorage', async () => {
    render(<WindTab setTab={setTab} />);
    const privado = 'esto es privado y no debe salir';

    fireEvent.change(textarea(), { target: { value: privado } });
    fireEvent.click(botonViento());

    await waitFor(() => expect(screen.getByText(/El viento ya se lo llevó/i)).not.toBeNull(), {
      timeout: 8000
    });

    expect(textarea()).toBeNull();
    expect(document.body.textContent).not.toContain(privado);
    expect(Object.keys(localStorage)).toHaveLength(0);
    expect(Object.keys(sessionStorage)).toHaveLength(0);
    expect(llamadasFetch).toHaveLength(0);
  });

  it('tras revelarse, la caja de texto ya no existe en el DOM', async () => {
    render(<WindTab setTab={setTab} />);
    fireEvent.change(textarea(), { target: { value: 'otra frase privada' } });
    fireEvent.click(botonViento());

    await waitFor(() => expect(screen.getByText(/El viento ya se lo llevó/i)).not.toBeNull(), {
      timeout: 8000
    });

    expect(document.querySelector('.wind-input')).toBeNull();
    expect(screen.queryByLabelText(/Lo que te pesa hoy/i)).toBeNull();
  });
});

describe('Cuéntaselo al viento — animación', () => {
  it('suelta partículas por pantalla en el camino normal', () => {
    forzarMovimiento(false);
    render(<WindTab setTab={setTab} />);
    fireEvent.change(textarea(), { target: { value: 'tres palabras de prueba' } });
    fireEvent.click(botonViento());

    expect(particulas().length).toBeGreaterThanOrEqual(20);
    expect(textarea().readOnly).toBe(true);
    expect(
      screen.getByRole('button', { name: /El viento lo lleva/i }).disabled
    ).toBe(true);
  });

  it('con prefers-reduced-motion no lanza ninguna partícula y termina antes', async () => {
    forzarMovimiento(true);
    render(<WindTab setTab={setTab} />);
    fireEvent.change(textarea(), { target: { value: 'algo pesado' } });
    fireEvent.click(botonViento());

    expect(particulas()).toHaveLength(0);

    // El texto se retira en 260 ms en lugar de los 3400 ms de la animación.
    await waitFor(() => expect(screen.getByText(/El viento ya se lo llevó/i)).not.toBeNull(), {
      timeout: 3000
    });
    expect(textarea()).toBeNull();
  });
});

describe('Cuéntaselo al viento — después de soltar', () => {
  it('pregunta cómo se siente la persona con las tres opciones', async () => {
    render(<WindTab setTab={setTab} />);
    fireEvent.change(textarea(), { target: { value: 'algo' } });
    fireEvent.click(botonViento());
    await waitFor(() => expect(screen.getByText(/¿Cómo te sientes ahora\?/i)).not.toBeNull(), {
      timeout: 8000
    });

    const opciones = [...document.querySelectorAll('.wind-moods button')].map((b) => b.textContent);
    expect(opciones).toHaveLength(3);
  });

  it('si responde "igual", ofrece Zona de paz y líneas de ayuda', async () => {
    render(<WindTab setTab={setTab} />);
    fireEvent.change(textarea(), { target: { value: 'algo' } });
    fireEvent.click(botonViento());
    await waitFor(() => expect(screen.getByText(/¿Cómo te sientes ahora\?/i)).not.toBeNull(), {
      timeout: 8000
    });

    const igual = [...document.querySelectorAll('.wind-moods button')].find((b) =>
      /igual/i.test(b.textContent)
    );
    fireEvent.click(igual);

    // Respuesta cálida, sin culpa ni obligación de sentirse mejor.
    const reply = document.querySelector('.wind-reply-text').textContent;
    expect(reply).toMatch(/Está bien sentirse igual/);
    expect(reply).not.toMatch(/deber[íi]as/i);
    expect(reply).not.toMatch(/culpa/i);

    const irPaz = screen.getByRole('button', { name: /Ir a Zona de paz/i });
    const verLineas = screen.getByRole('button', { name: /Ver líneas de ayuda/i });
    expect(irPaz).not.toBeNull();
    expect(verLineas).not.toBeNull();

    fireEvent.click(verLineas);
    expect(setTab).toHaveBeenCalledWith('lineas');

    // El regreso a Zona de paz también está disponible.
    fireEvent.click(screen.getByRole('button', { name: /Ir a Zona de paz/i }));
    expect(setTab).toHaveBeenCalledWith('paz');
  });

  it('permite escribir otra vez sin dejar residuos del texto anterior', async () => {
    render(<WindTab setTab={setTab} />);
    fireEvent.change(textarea(), { target: { value: 'primera cosa' } });
    fireEvent.click(botonViento());
    await waitFor(() => expect(screen.getByText(/¿Cómo te sientes ahora\?/i)).not.toBeNull(), {
      timeout: 8000
    });

    // "Escribir otra vez" se ofrece después de responder cómo se siente.
    fireEvent.click([...document.querySelectorAll('.wind-moods button')][0]);
    fireEvent.click(screen.getByRole('button', { name: /Escribir otra vez/i }));

    expect(textarea()).not.toBeNull();
    expect(textarea().value).toBe('');
    expect(botonViento().disabled).toBe(true);
    expect(Object.keys(localStorage)).toHaveLength(0);
    expect(llamadasFetch).toHaveLength(0);
  });
});
