# Plan de operación — Ruta Clara Meta

**Versión:** 1.0 · **Fecha de elaboración:** 22 de octubre de 2026
**Vigencia:** hasta la siguiente revisión programada (véase apartado 5)
**Documento asociado:** [TERCEROS_Y_LICENCIAS.md](TERCEROS_Y_LICENCIAS.md) · [DECLARACION_DEL_EQUIPO.md](DECLARACION_DEL_EQUIPO.md) · [PRUEBAS.md](PRUEBAS.md)

Este plan responde a tres preguntas de la evaluación: **quién verifica la
información**, **con qué frecuencia** y **cómo se reporta un enlace o teléfono
inactivo**.

> **Aviso previo:** los campos marcados con `[CORREO DEL EQUIPO]`,
> `[NOMBRE]` y similares son pendientes de completar por el equipo antes de
> publicar. Su estado se controla en el apartado 11.

---

## 1. Objeto y alcance

Ruta Clara Meta publica teléfonos, horarios, direcciones y enlaces de
instituciones de salud mental. Un dato desactualizado en este contexto puede
hacer que una persona en crisis no obtenga respuesta, por lo que la verificación
se trata como una **actividad crítica**, no como una tarea de mantenimiento
opcional.

El plan cubre todos los datos que la interfaz muestra:

| Dónde vive | Qué contiene | Volumen actual | Trazabilidad actual |
|---|---|---|---|
| `data/routes.json` → `lines` | Líneas de ayuda con teléfono y WhatsApp | 4 registros | `source` + `consulta` |
| `data/routes.json` → `crisis` | Lista local de crisis | 4 registros | `source` + `verified` |
| `data/routes.json` → `closing` | Tarjeta “Dar el primer paso” | 1 registro | `source` + `consulta` |
| `data/routes.json` → `centers` | Centros presenciales: dirección, teléfono, horario | 3 registros | `source` + `consulta` |
| `data/routes.json` → `sources` | Enlaces a las fuentes oficiales | 5 registros | URL |
| `client/src/crisis.js` | Lista de crisis **sin depender de red** | 4 registros | `source` |
| `data/routes.json` → frases, hábitos, 105 momentos | Contenido de acompañamiento | 123 registros | No aplica (no son datos verificables) |

**Los teléfonos existen en dos archivos a la vez** (`routes.json` y
`crisis.js`). Toda modificación debe aplicarse en ambos y verificarse con las
pruebas automáticas; ese es precisamente el riesgo que detectó la evaluación
anterior con el filtro de líneas.

---

## 2. Responsables

| Rol | Responsabilidad | Persona |
|---|---|---|
| **Responsable de contenido** | Verifica teléfonos, horarios y enlaces; firma la bitácora; decide retiradas. | `[NOMBRE]` |
| **Responsable técnico** | Ejecuta las pruebas, el despliegue y mantiene este plan. | `[NOMBRE]` |
| **Validación externa en salud mental** | Revisa que el tono, los textos de crisis y la lista de recursos no sean dañinos ni clínicos. | `[NOMBRE]` |
| **Suplente** | Reemplaza al responsable de contenido en su ausencia. | `[NOMBRE]` |

**Regla de doble firma:** toda modificación de un teléfono, horario o enlace
requiere que **una persona distinta de quien lo cambió** confirme la verificación
en la bitácora (apartado 9).

---

## 3. Qué significa que un dato esté “verificado”

Un teléfono o enlace solo puede publicarse si cumple **los cinco criterios**:

1. **Fuente primaria oficial:** entidad con dominio `.gov.co` o la institución
   titular de la línea (MinSalud, Gobernación del Meta, Alcaldía de Villavicencio,
   Secretaría de la Mujer). No se aceptan directorios agregadores ni blogs.
2. **Comprobación en vivo:** se marcó el número y respondió el esperpén o se
   identificó el servicio; o se abrió la URL y devolvió un contenido correcto.
3. **Trazabilidad en los datos:** el registro lleva `source` (entidad) y
   `consulta` (`AAAA-MM`).
4. **Segunda persona:** otra integrante confirmó el paso 2.
5. **Prueba automatizada en verde:** `npm test` valida que el dato existe, tiene
   fuente, tiene fecha y no apunta a un servicio retirado.

Si no se cumplen los cinco, **el dato no se muestra**. No se publica “a
confirmar”.

---

## 4. Inventario de verificación

Cada fila es un ciclo de verificación individual.

| ID | Dato | Fuente primaria | Comprobación |
|---|---|---|---|
| L-01 | 01 8000 931 089 · WhatsApp 316 390 7010 — *Yo Te Escucho* | Alcaldía de Villavicencio | Llamada de prueba + WhatsApp |
| L-02 | #775 · 312 575 1135 — *Línea Amiga de Salud Mental* | Gobernación del Meta | Llamada desde celular y desde fija |
| L-03 | 316 742 6938 — *Línea Violeta* | Secretaría de la Mujer de Villavicencio | Llamada + WhatsApp |
| L-04 | 123 — *Emergencias* | Línea nacional | Llamada (no abusar del canal) |
| C-01 | Teléfonos de los 3 centros presenciales | Cada centro | Llamada de prueba |
| C-02 | Direcciones y horarios de los 3 centros | Cada centro | Visita o llamada de confirmación |
| E-01 | Enlaces del bloque `sources` | Cada entidad | HTTP 200 y contenido correcto |
| F-01 | Botón de la tarjeta “Dar el primer paso” | Alcaldía de Villavicencio | Debe coincidir con L-01 |

---

## 5. Frecuencia

| Disparador | Frecuencia | Alcance | Responsable |
|---|---|---|---|
| **Antes de cada entrega o presentación** | Obligatoria | Inventario completo (L-01…F-01) | Responsable de contenido |
| **Revisión ordinaria en operación** | **Cada 30 días** | Todos los teléfonos y horarios | Responsable de contenido |
| **Revisión de enlaces** | Cada 30 días | Todas las URLs de `sources` y de centros | Responsable técnico |
| **Reconciliación de directorio oficial** | Cada 6 meses | Comparar contra el Directorio Nacional de Líneas de Salud Mental de MinSalud | Responsable de contenido |
| **Revisión de texto y tono** | Cada 6 meses y antes de cada entrega | Frases de crisis, recursos, cierre | Validación externa |
| **Reporte recibido** | **≤ 48 horas hábiles** desde el acuse | El dato reportado y sus duplicados en `crisis.js` | Responsable de contenido |

Las fechas de la última revisión ordinaria y de la próxima quedan registradas en
la bitácora (apartado 9) y **se muestran en la interfaz** en el campo `consulta`
de cada ficha, para que la persona usuaria vea la antigüedad del dato.

---

## 6. Procedimiento de verificación

**Paso 1 — Descargar la fuente vigente.** Directorio Nacional de Líneas de Salud
Mental del MinSalud y páginas oficiales de Alcaldía, Gobernación y Secretaría de
la Mujer. Guardar la fecha de descarga.

**Paso 2 — Comprobar cada teléfono** (apartado 4): marcar, anotar horario de
llamada, resultado y persona que atendió. Llamar en horario laboral y fuera de
él para confirmar el 24/7.

**Paso 3 — Abrir cada enlace**: verificar respuesta HTTP 200, que el destino
siga siendo el esperado y que no haya redirección a otra entidad.

**Paso 4 — Actualizar los datos** en `data/routes.json` **y**
`client/src/crisis.js`. Cambiar `consulta` a `AAAA-MM`. Nunca editar un archivo
sin su par.

**Paso 5 — Ejecutar las pruebas** en la raíz:

    npm test

Si algo falla, no se continúa hasta dejarlo en verde.

**Paso 6 — Reconstruir y publicar:**

    npm run build

**Paso 7 — Registrar y firmar** en la bitácora (apartado 9), incluyendo
evidencia (captura o nota de llamada).

---

## 7. Canal de reporte de un enlace o teléfono inactivo

### 7.1 Cómo puede reportarlo la persona usuaria

| Canal | Cuándo usarlo | Dónde está |
|---|---|---|
| **Correo del equipo** | Reporte formal, con captura o nota | `[CORREO DEL EQUIPO]` |
| **Repositorio del proyecto** | Si está publicado: abrir una incidencia con la plantilla del apartado 7.2 | `[URL DEL REPOSITORIO]` |
| **En el stand / demostración** | Durante la hackatón | Escrito en el material del stand |
| **Canal de la entidad titular** | Para corregir un dato de la propia institución | Se redirige y se da seguimiento |

La aplicación **no recoge datos personales**: no pide correo, nombre ni
ubicación, y no almacena lo que la persona escribe. Por eso el reporte se hace
por los canales externos de la tabla, nunca dentro del producto.

### 7.2 Plantilla de reporte

    Sección: [Inicio / Líneas de ayuda / Centros presenciales / Zona de paz / Otro]
    Dato: [número, dirección o enlace exacto como aparece en pantalla]
    Qué ocurre: [no contesta / contesta otro servicio / enlace caído 404 / dato desactualizado]
    Fecha y hora de la prueba:
    Evidencia: [captura o descripción]
    Medio de contacto si desea respuesta (opcional):

### 7.3 Compromiso de respuesta (SLA)

| Etapa | Plazo |
|---|---|
| Acuse de recibo | 24 horas hábiles |
| Verificación del dato reportado | 48 horas hábiles |
| **Retirada inmediata si no se confirma** | **Mismo día de la verificación** |
| Corrección publicada con nueva `consulta` | Junto con la retirada |
| Cierre del reporte ante quien lo emitió | Dentro de los 5 días hábiles |

---

## 8. Protocolo ante un dato que no se puede verificar

**Nunca se deja un número dudoso en pantalla.** Se retira primero y se decide
después.

1. **Retirar** el campo completo de `data/routes.json` **y**
   `client/src/crisis.js`. Si solo se retira de uno, la prueba
   `tests/datos-reales.test.js` falla y bloquea la publicación.
2. **Ejecutar** `npm test`. Debe quedar en verde.
3. **Reconstruir** con `npm run build` y publicar.
4. **Registrar** en la bitácora el motivo y la fecha.
5. **Reincorporar** solo cuando se cumplan los cinco criterios del apartado 3.

Si el dato retirado pertenece a una línea de crisis y no hay sustituto
verificado, se **sustituye por la emergencia nacional 123** y se deja constancia
de que no hay alternativa local confirmada.

---

## 9. Bitácora de verificación

Registro obligatorio. Se mantiene en este archivo y cada entrada requiere dos
firmas (apartado 2).

| Fecha | Alcance | Responsable | Confirma | Resultado | Acción | Evidencia |
|---|---|---|---|---|---|---|
| 2026-08 | Directorio MinSalud 2025 + fuentes locales | `[NOMBRE]` | `[NOMBRE]` | 4 líneas y 3 centros con fuente | Publicado | PDF MinSalud, páginas gov.co |
| 2026-10 | Revisión completa | `[NOMBRE]` | `[NOMBRE]` | 4 líneas, 3 centros y tarjeta de cierre con fuente y fecha; **retirado el botón “Llamar al 106”** por no tener fuente verificada para Villavicencio | Publicado | Commit de octubre de 2026 |
| `[AAAA-MM-DD]` | Revisión ordinaria | `[NOMBRE]` | `[NOMBRE]` | `[PENDIENTE]` | `[PENDIENTE]` | `[PENDIENTE]` |

**Próxima revisión ordinaria programada:** `[AAAA-MM-DD]` (máximo 30 días desde
la última).

---

## 10. Indicadores de control

Se comprueban automáticamente en cada ejecución de `npm test`:

| Indicador | Meta | Cómo se mide |
|---|---|---|
| Teléfonos mostrados con `source` y `consulta` | 100 % | `tests/datos-reales.test.js` |
| Números sin verificar en pantalla | 0 | Lista blanca de formatos permitidos + ausencia de `tel:106` |
| Duplicidad de las listas de crisis (`routes.json` ↔ `crisis.js`) | Coincidencia exacta | `tests/datos-reales.test.js` |
| Bandera `enVillavicencio` coherente en ambas fuentes | Coincidencia exacta | `tests/datos-reales.test.js` |
| Reportes atendidos en el plazo del apartado 7.3 | 100 % | Revisión de la bitácora |

---

## 11. Pendientes antes de publicar

| # | Pendiente | Responsable |
|---|---|---|
| 1 | Sustituir `[CORREO DEL EQUIPO]` y `[URL DEL REPOSITORIO]` (apartado 7.1). | `[NOMBRE]` |
| 2 | Completar nombres y roles de los apartados 2 y 9. | `[NOMBRE]` |
| 3 | Fijar la fecha de la próxima revisión ordinaria. | `[NOMBRE]` |
| 4 | Confirmar la disponibilidad del 106 en Villavicencio y, en su caso, documentar el hallazgo en la bitácora. Actualmente **no se muestra** porque no superó el criterio 2 del apartado 3. | `[NOMBRE]` |
