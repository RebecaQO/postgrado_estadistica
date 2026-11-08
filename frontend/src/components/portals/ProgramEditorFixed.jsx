
import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  GraduationCap,
  Save,
  X
} from 'lucide-react';

import { programaService } from '../../services/programaService';
import './ProgramEditorFixed.css';

const FORMULARIO_VACIO = {
  nombre_programa: '',
  descripcion: '',
  tipo_programa: 'Diplomado',
  tipo_maestria: 'Terminal',
  area_conocimiento: '',
  mencion: '',
  perfil_aspirante: '',
  perfil_egreso: '',
  enlace_pdf_programa: '',
};

const Grupo = ({ titulo, descripcion, children }) => (
  <section
    style={{
      background: '#fff',
      border: '1px solid #dbe4e9',
      borderRadius: 12,
      padding: '1.5rem',
      marginBottom: '1.25rem',
    }}
  >
    <h3
      style={{
        margin: '0 0 0.3rem',
        fontSize: '1.13rem',
        fontWeight: 800,
        color: '#24313b',
      }}
    >
      {titulo}
    </h3>

    {descripcion && (
      <p
        style={{
          margin: '0 0 1.25rem',
          fontSize: '0.85rem',
          color: '#64748b',
        }}
      >
        {descripcion}
      </p>
    )}

    {children}
  </section>
);

const Campo = ({ titulo, requerido = false, children }) => (
  <label
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.45rem',
      fontWeight: 700,
      fontSize: '0.88rem',
      color: '#273442',
    }}
  >
    <span>
      {titulo}
      {requerido && (
        <span style={{ color: '#b42318' }}> *</span>
      )}
    </span>

    {children}
  </label>
);

const estiloControl = {
  width: '100%',
  boxSizing: 'border-box',
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  padding: '0.75rem 0.85rem',
  background: '#fff',
  color: '#24313b',
  fontSize: '0.92rem',
  fontWeight: 400,
};

export const ProgramEditorFixed = ({
  initialProgramId = null,
  onSaved,
  onCancel,
}) => {
  const [form, setForm] = useState({
    ...FORMULARIO_VACIO,
  });

  const [cargando, setCargando] = useState(
    Boolean(initialProgramId)
  );

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const esEdicion =
    initialProgramId !== null &&
    initialProgramId !== undefined;

  useEffect(() => {
    let activo = true;

    if (!esEdicion) {
      setForm({ ...FORMULARIO_VACIO });
      setError('');
      setCargando(false);
      return;
    }

    const cargar = async () => {
      setCargando(true);
      setError('');

      try {
        const resultado = await programaService.getById(
          initialProgramId
        );

        const programa = resultado?.data ?? resultado;

        if (!programa || !programa.id_programa) {
          throw new Error(
            'Laravel no devolvió los datos del programa.'
          );
        }

        if (!activo) return;

        setForm({
          nombre_programa:
            programa.nombre_programa ?? '',

          descripcion:
            programa.descripcion ?? '',

          tipo_programa:
            programa.tipo_programa === 'Maestria'
              ? 'Maestria'
              : 'Diplomado',

          tipo_maestria:
            programa.maestria?.tipo ?? 'Terminal',

          area_conocimiento:
            programa.area_conocimiento ?? '',

          mencion:
            programa.mencion ?? '',

          perfil_aspirante:
            programa.perfil_aspirante ?? '',

          perfil_egreso:
            programa.perfil_egreso ?? '',

          enlace_pdf_programa:
            programa.enlace_pdf_programa ?? '',
        });

      } catch (err) {
        if (activo) {
          setError(
            err.message ||
            'No se pudo consultar el programa.'
          );
        }
      } finally {
        if (activo) setCargando(false);
      }
    };

    cargar();

    return () => {
      activo = false;
    };
  }, [initialProgramId, esEdicion]);

  const cambiar = (campo, valor) => {
    setForm((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  };

  const guardar = async (evento) => {
    evento.preventDefault();

    if (guardando) return;

    setError('');

    const datos = {
      nombre_programa:
        form.nombre_programa.trim(),

      descripcion:
        form.descripcion.trim(),

      area_conocimiento:
        form.area_conocimiento.trim() || null,

      mencion:
        form.mencion.trim() || null,

      perfil_aspirante:
        form.perfil_aspirante.trim() || null,

      perfil_egreso:
        form.perfil_egreso.trim() || null,

      enlace_pdf_programa:
        form.enlace_pdf_programa.trim() || null,
    };

    if (!datos.nombre_programa || !datos.descripcion) {
      setError(
        'El nombre y la descripción del programa son obligatorios.'
      );
      return;
    }

    // La clasificación académica se envía solo al crear.
    // El backend no permite cambiarla posteriormente.
    if (!esEdicion) {
      datos.tipo_programa = form.tipo_programa;

      if (form.tipo_programa === 'Maestria') {
        datos.tipo_maestria = form.tipo_maestria;
      }
    }

    setGuardando(true);

    try {
      if (esEdicion) {
        await programaService.update(
          initialProgramId,
          datos
        );
      } else {
        await programaService.create(datos);
      }

      onSaved?.();

    } catch (err) {
      setError(
        err.message ||
        'No se pudo guardar el programa.'
      );
    } finally {
      setGuardando(false);
    }
  };

  const control = (campo, props = {}) => ({
    ...props,

    style: estiloControl,

    value: form[campo],

    onChange: (e) => {
      cambiar(campo, e.target.value);
    },

    disabled:
      cargando ||
      guardando ||
      Boolean(props.disabled),
  });

  return (
    <div
      className="animate-fade-in"
      style={{
        maxWidth: 1120,
        margin: '0 auto',
        paddingBottom: '2rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary btn-sm"
            disabled={guardando}
          >
            <ArrowLeft size={15} />
            Volver a programas
          </button>

          <h2
            style={{
              fontSize: '1.75rem',
              color: '#23313c',
              fontWeight: 800,
              margin: '1rem 0 0.35rem',
            }}
          >
            <GraduationCap
              size={26}
              style={{
                display: 'inline',
                verticalAlign: 'middle',
                marginRight: 10,
              }}
            />

            {esEdicion
              ? 'Editar Programa Académico'
              : 'Crear Nuevo Programa Académico'}
          </h2>

          <p
            style={{
              color: '#64748b',
              margin: 0,
            }}
          >
            Solo información del programa. Las mallas,
            ediciones, convocatorias y docentes se
            administran por separado.
          </p>
        </div>
      </div>

      {error && (
        <div
          className="em-alert em-alert-error"
          role="alert"
          style={{
            marginBottom: '1rem',
            whiteSpace: 'pre-wrap',
          }}
        >
          {error}
        </div>
      )}

      {cargando ? (
        <p>Cargando datos del programa...</p>
      ) : (
        <form onSubmit={guardar}>
          <Grupo
            titulo="Información general"
            descripcion="Identificación y clasificación académica del programa."
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(270px, 1fr))',
                gap: '1rem',
              }}
            >
              <Campo
                titulo="Nombre oficial del programa"
                requerido
              >
                <input
                  {...control('nombre_programa', {
                    required: true,
                    maxLength: 150,
                    placeholder:
                      'Ej. Maestría en Ciencia de Datos',
                  })}
                />
              </Campo>

              <Campo
                titulo="Tipo de programa"
                requerido
              >
                <select
                  {...control('tipo_programa', {
                    disabled: esEdicion,
                  })}
                >
                  <option value="Diplomado">
                    Diplomado
                  </option>

                  <option value="Maestria">
                    Maestría
                  </option>
                </select>
              </Campo>

              {form.tipo_programa === 'Maestria' && (
                <Campo
                  titulo="Tipo de maestría"
                  requerido
                >
                  <select
                    {...control('tipo_maestria', {
                      disabled: esEdicion,
                    })}
                  >
                    <option value="Terminal">
                      Terminal
                    </option>

                    <option value="Autosostenible">
                      Autosostenible
                    </option>
                  </select>
                </Campo>
              )}

              <Campo titulo="Área de conocimiento">
                <input
                  {...control('area_conocimiento', {
                    maxLength: 150,
                    placeholder:
                      'Ej. Ciencias Exactas',
                  })}
                />
              </Campo>

              <Campo titulo="Mención o especialidad">
                <input
                  {...control('mencion', {
                    maxLength: 150,
                    placeholder: 'Si corresponde',
                  })}
                />
              </Campo>
            </div>

            {esEdicion && (
              <p
                style={{
                  marginTop: '0.9rem',
                  fontSize: '0.8rem',
                  color: '#64748b',
                }}
              >
                El tipo de programa no puede modificarse
                después de su creación.
              </p>
            )}
          </Grupo>

          <Grupo
            titulo="Descripción y perfiles académicos"
            descripcion="Contenido institucional propio del programa."
          >
            <div
              style={{
                display: 'grid',
                gap: '1rem',
              }}
            >
              <Campo
                titulo="Descripción general"
                requerido
              >
                <textarea
                  {...control('descripcion', {
                    required: true,
                    rows: 5,
                    placeholder:
                      'Objetivos, alcance y características del programa...',
                  })}
                />
              </Campo>

              <Campo titulo="Perfil del aspirante">
                <textarea
                  {...control('perfil_aspirante', {
                    rows: 4,
                    placeholder:
                      '¿A quién está dirigido el programa?',
                  })}
                />
              </Campo>

              <Campo titulo="Perfil de egreso">
                <textarea
                  {...control('perfil_egreso', {
                    rows: 4,
                    placeholder:
                      'Competencias y capacidades del egresado...',
                  })}
                />
              </Campo>
            </div>
          </Grupo>

          <Grupo
            titulo="Documentación académica"
            descripcion="Enlace de información del programa, sin crear una convocatoria."
          >
            <Campo titulo="Enlace al PDF del programa">
              <input
                type="url"
                {...control('enlace_pdf_programa', {
                  maxLength: 2048,
                  placeholder: 'https://...',
                })}
              />
            </Campo>
          </Grupo>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <button
              type="button"
              onClick={onCancel}
              disabled={guardando}
              className="btn btn-secondary"
            >
              <X size={16} />
              Cancelar
            </button>

            <button
              type="submit"
              disabled={guardando}
              className="btn btn-primary"
            >
              <Save size={16} />

              {guardando
                ? 'Guardando...'
                : esEdicion
                  ? 'Guardar cambios'
                  : 'Crear programa'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
