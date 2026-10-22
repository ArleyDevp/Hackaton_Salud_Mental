/**
 * Pruebas de la pestaña Líneas de ayuda.
 *
 * Usan el mismo conjunto de datos sintéticos que las pruebas del backend
 * (`tests/fixtures/datos-sinteticos.json`): teléfonos, instituciones y fechas
 * inventados que nunca se sirven en producción.
 *
 * Se usan solo las aserciones nativas de Vitest para no añadir dependencias.
 */

import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { LinesTab } from '../App.jsx';
import datos from '../../../tests/fixtures/datos-sinteticos.json';

// Red de seguridad además de la limpieza automática de RTL.
afterEach(cleanup);

const lineas = datos.lines;
const tarjetas = () => document.querySelectorAll('.route-card');
const nombres = () =>
  [...document.querySelectorAll('.route-card h3')].map((n) => n.textContent);
const presionado = (name) =>
  screen.getByRole('button', { name }).getAttribute('aria-pressed');

describe('Líneas de ayuda — listado', () => {
  it('pinta una tarjeta por cada línea recibida', () => {
    render(<LinesTab lines={lineas} />);
    expect(tarjetas()).toHaveLength(3);
    expect(nombres()).toEqual(lineas.map((l) => l.name));
  });

  it('muestra la fuente y la fecha de consulta en cada tarjeta', () => {
    render(<LinesTab lines={lineas} />);
    expect(screen.getAllByText(/^Fuente:/)).toHaveLength(3);
    expect(screen.getAllByText(/^Consulta:/)).toHaveLength(3);
    expect(screen.getAllByText(/octubre de 2099/)).toHaveLength(3);
  });

  it('todo teléfono visible enlaza con un href tel: válido', () => {
    render(<LinesTab lines={lineas} />);
    const llamadas = [...document.querySelectorAll('.call-button')].filter(
      (a) => !a.getAttribute('href').startsWith('http')
    );
    expect(llamadas.length).toBeGreaterThan(0);
    for (const a of llamadas) {
      expect(a.getAttribute('href')).toMatch(/^tel:/);
      expect(a.getAttribute('href')).not.toBe('tel:');
    }
  });
});

describe('Líneas de ayuda — filtro "En Villavicencio"', () => {
  it('con "Todas" muestra las tres', () => {
    render(<LinesTab lines={lineas} />);
    expect(tarjetas()).toHaveLength(3);
  });

  it('filtra con la bandera booleana y no con el texto de scope', () => {
    render(<LinesTab lines={lineas} />);
    fireEvent.click(screen.getByRole('button', { name: 'En Villavicencio' }));

    // Quedan exactamente las dos marcadas con enVillavicencio: true.
    expect(nombres()).toEqual([
      'Línea Sintética Uno — Prueba',
      'Línea Sintética Dos — Prueba'
    ]);

    // La incluida número dos lleva un scope con una redacción distinta
    // ("Zona de ensayo"): si el filtrado fuera textual, habría quedado fuera.
    expect(lineas[1].scope).toBe('Zona de ensayo');
    expect(lineas[1].enVillavicencio).toBe(true);

    // La excluida no se descarta por el texto, sino por su bandera.
    expect(lineas[2].scope).toBe('Cobertura nacional');
    expect(lineas[2].enVillavicencio).toBe(false);
    expect(nombres()).not.toContain('Línea Sintética Tres — Emergencias');
  });

  it('vuelve a las tres con "Todas"', () => {
    render(<LinesTab lines={lineas} />);
    fireEvent.click(screen.getByRole('button', { name: 'En Villavicencio' }));
    expect(tarjetas()).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', { name: 'Todas' }));
    expect(tarjetas()).toHaveLength(3);
  });

  it('el botón activo queda marcado con aria-pressed', () => {
    render(<LinesTab lines={lineas} />);
    expect(presionado('Todas')).toBe('true');

    fireEvent.click(screen.getByRole('button', { name: 'En Villavicencio' }));
    expect(presionado('En Villavicencio')).toBe('true');
    expect(presionado('Todas')).toBe('false');
  });
});

describe('Líneas de ayuda — estado vacío', () => {
  it('si ningún registro tiene la bandera, avisa en lugar de dejar la zona en blanco', () => {
    const ninguna = lineas.map((l) => ({ ...l, enVillavicencio: false }));
    render(<LinesTab lines={ninguna} />);
    fireEvent.click(screen.getByRole('button', { name: 'En Villavicencio' }));

    expect(tarjetas()).toHaveLength(0);
    expect(
      screen.getByText(/Todavía no hay líneas disponibles con este filtro/i)
    ).not.toBeNull();
  });

  it('si la lista llega vacía, también muestra el estado vacío', () => {
    render(<LinesTab lines={[]} />);
    expect(tarjetas()).toHaveLength(0);
    expect(
      screen.getByText(/Todavía no hay líneas disponibles con este filtro/i)
    ).not.toBeNull();
  });

  it('sin propiedades usa la lista local de crisis (la que no depende de la red)', () => {
    render(<LinesTab />);
    // crisis.js tiene 4 canales: 3 regionales + la nacional 123.
    expect(tarjetas()).toHaveLength(4);
    fireEvent.click(screen.getByRole('button', { name: 'En Villavicencio' }));
    expect(tarjetas()).toHaveLength(3);
  });
});
