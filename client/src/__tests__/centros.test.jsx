/**
 * Pruebas de la pestaña Centros presenciales.
 *
 * Reglas cubiertas: no se pide la ubicación de la persona, cada ficha declara
 * su estado de verificación y una ficha sin coordenadas verificadas no coloca
 * un marcador inventado en el mapa.
 */

import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { CentersTab } from '../App.jsx';
import datos from '../../../tests/fixtures/datos-sinteticos.json';

afterEach(cleanup);

const mapa = () => screen.getByTitle('Mapa de Villavicencio');
const src = () => mapa().getAttribute('src');

describe('Centros presenciales — mapa', () => {
  it('usa OpenStreetMap y nunca llama a la geolocalización de la persona', () => {
    render(<CentersTab centers={datos.centers} />);
    expect(src()).toContain('openstreetmap.org/export/embed.html');

    // Se espía la API de posiciones del navegador (si jsdom la expone) para
    // demostrar que el mapa fijo no la invoca en ningún momento.
    const geo = navigator.geolocation;
    const llamadas = [];
    if (geo) {
      for (const metodo of ['getCurrentPosition', 'watchPosition']) {
        if (typeof geo[metodo] === 'function') {
          geo[metodo] = (...args) => llamadas.push(args);
        }
      }
    }

    fireEvent.click(screen.getByRole('button', { name: /Centro Sintético B/ }));
    expect(llamadas).toHaveLength(0);
  });

  it('el URL del mapa nunca contiene NaN', () => {
    render(<CentersTab centers={datos.centers} />);
    expect(src()).not.toContain('NaN');
    fireEvent.click(screen.getByRole('button', { name: /Centro Sintético B/ }));
    expect(src()).not.toContain('NaN');
  });

  it('una ficha con coordenadas muestra el marcador', () => {
    render(<CentersTab centers={datos.centers} />);
    expect(src()).toContain('marker=');
  });

  it('una ficha sin coordenadas no inventa un punto y lo dice en el pie', () => {
    render(<CentersTab centers={datos.centers} />);
    expect(datos.centers[1].lat).toBeUndefined();

    fireEvent.click(screen.getByRole('button', { name: /Centro Sintético B/ }));

    expect(src()).not.toContain('marker=');
    expect(src()).not.toContain('NaN');
    expect(screen.getByText(/sin coordenadas verificadas/i)).not.toBeNull();
  });
});

describe('Centros presenciales — verificación', () => {
  it('cada ficha declara si está verificada y ninguna queda "por confirmar"', () => {
    render(<CentersTab centers={datos.centers} />);
    expect(screen.getAllByText('Verificado')).toHaveLength(datos.centers.length);
    expect(screen.queryByText('Por confirmar')).toBeNull();
  });

  it('el botón de llamar solo aparece en fichas con teléfono', () => {
    const sinTel = datos.centers.map((c, i) => (i === 0 ? { ...c, tel: null } : c));
    render(<CentersTab centers={sinTel} />);

    const primero = screen.getByRole('button', { name: /Centro Sintético A/ });
    const segundo = screen.getByRole('button', { name: /Centro Sintético B/ });
    const enlaces = (btn) => [...btn.querySelectorAll('a')].filter((a) => /tel:/.test(a.href));

    expect(enlaces(primero)).toHaveLength(0);
    expect(enlaces(segundo)).toHaveLength(1);
  });

  it('al elegir una ficha, el pie refleja su nombre y dirección', () => {
    render(<CentersTab centers={datos.centers} />);
    fireEvent.click(screen.getByRole('button', { name: /Centro Sintético B/ }));
    const pie = document.querySelector('.map-caption').textContent;
    expect(pie).toContain('Centro Sintético B');
    expect(pie).toContain(datos.centers[1].address);
  });
});
