
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import {
  ArrowLeft,
  CalendarDays,
  Edit2,
  Plus,
  Save,
  X,
  Users
} from 'lucide-react';

import { apiJson } from '../../utils/api';
import './EditionManager.css';

const ESTADOS = [
  'En Proceso',
  'Abierta',
  'En Curso',
  'Concluida',
  'Cancelada'
];

const CAMPOS = [
  ['nombre_edicion', 'Nombre de la edición', 'text'],
  ['fecha_inicio', 'Fecha de inicio', 'date'],
  ['fecha_fin', 'Fecha de finalización', 'date'],
  ['duracion', 'Duración', 'text'],
  ['horario', 'Horario', 'text'],
  ['descripcion', 'Descripción', 'textarea'],
  ['modalidad_titulacion', 'Modalidad de titulación', 'textarea'],
  ['requisitos', 'Requisitos', 'textarea'],
  ['convocatoria', 'Enlace o referencia de convocatoria', 'text'],
  ['formulario', 'Enlace o referencia del formulario', 'text']
];

const NUEVA = {
  nombre_edicion: '',
  fecha_inicio: '',
  fecha_fin: '',
  duracion: '',
  horario: '',
  descripcion: '',
  modalidad_titulacion: '',
  requisitos: '',
  convocatoria: '',
  formulario: '',
  estado: 'En Proceso',
  id_malla: ''
};

const fechaInput = (valor) =>
  valor ? String(valor).slice(0, 10) : '';

const normalizarEdicion = (edicion) => ({
  ...NUEVA,
  ...Object.fromEntries(
    Object.keys(NUEVA).map((key) => [
      key,
      edicion[key] ?? NUEVA[key]
    ])
  ),
  fecha_inicio: fechaInput(edicion.fecha_inicio),
  fecha_fin: fechaInput(edicion.fecha_fin),
  id_malla: String(edicion.id_malla ?? '')
});

const obtenerIdDocente = (docente) =>
  Number(docente?.id_doc ?? docente?.id);

const nombreDocente = (docente) => {
  const nombre = docente.nombre_doc ?? docente.nombre ?? '';
  const apellido = docente.apellido_doc ?? docente.apellido ?? '';

  return (
    `${nombre} ${apellido}`.trim() ||
    docente.nombre_completo ||
    `Docente #${obtenerIdDocente(docente)}`
  );
};

const esActivo = (valor) =>
  valor === true ||
  valor === 1 ||
  valor === '1' ||
  valor === 'true';

const obtenerIdsDocentes = (lista) =>
  Array.isArray(lista)
    ? lista
        .map(obtenerIdDocente)
        .filter(Number.isInteger)
    : [];

export const EditionManager = ({
  program,
  onBack,
  onSaved,
  initialEditionId = null
}) => {
  const programId = Number(
    program?.id_programa ?? program?.id
  );

  const [ediciones, setEdiciones] = useState([]);
  const [mallas, setMallas] = useState([]);
  const [docentes, setDocentes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [teacherError, setTeacherError] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...NUEVA });

  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [originalTeachers, setOriginalTeachers] = useState([]);

  // Evita abrir la misma edicion varias veces al actualizar datos.
  const edicionInicialAbiertaRef = useRef(null);

  // ======================================
  // CARGAR EDICIONES Y MALLAS
  // ======================================

  const cargar = useCallback(async () => {
    setLoading(true);

    try {
      const [edicionesData, programaData] =
        await Promise.all([
          apiJson('/api/ediciones'),
          apiJson(`/api/programas/${programId}`)
        ]);

      const lista = Array.isArray(edicionesData)
        ? edicionesData
        : [];

      setEdiciones(
        lista.filter(
          (ed) => Number(ed.id_programa) === programId
        )
      );

      const mallasLista =
        Array.isArray(programaData?.mallas)
          ? programaData.mallas
          : [];

      setMallas(mallasLista);

      return true;
    } catch (err) {
      setError(
        `No se pudieron cargar las ediciones o mallas: ${err.message}`
      );
      return false;
    } finally {
      setLoading(false);
    }
  }, [programId]);

  // ======================================
  // CARGAR DOCENTES DISPONIBLES
  // ======================================

  const cargarDocentes = useCallback(async () => {
    setLoadingTeachers(true);
    setTeacherError('');

    try {
      const data = await apiJson('/api/docentes');

      const lista = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
          ? data.items
          : [];

      setDocentes(lista);

      return true;
    } catch (err) {
      setDocentes([]);
      setTeacherError(
        `No se pudo cargar la lista de docentes: ${err.message}`
      );
      return false;
    } finally {
      setLoadingTeachers(false);
    }
  }, []);

  useEffect(() => {
    cargar();
    cargarDocentes();
  }, [cargar, cargarDocentes]);

  // ======================================
  // MALLAS ACTIVAS
  // ======================================

  const mallasActivas = useMemo(
    () =>
      mallas.filter(
        (m) =>
          Number(m.id_programa ?? programId) === programId &&
          esActivo(m.activo)
      ),
    [mallas, programId]
  );

  // ======================================
  // DOCENTES QUE SE PUEDEN SELECCIONAR
  // ======================================

  const docentesDisponibles = useMemo(() => {
    return docentes
      .filter((d) => {
        const id = obtenerIdDocente(d);

        if (!Number.isInteger(id)) return false;

        // Se mantienen visibles docentes ya asignados,
        // incluso si actualmente están inactivos.
        if (originalTeachers.includes(id)) return true;

        return esActivo(d.activo);
      })
      .sort((a, b) =>
        nombreDocente(a).localeCompare(nombreDocente(b), 'es')
      );
  }, [docentes, originalTeachers]);

  // ======================================
  // NUEVA EDICIÓN
  // ======================================

  const nuevaEdicion = () => {
    setEditingId(null);

    setForm({
      ...NUEVA,
      id_malla:
        mallasActivas.length === 1
          ? String(mallasActivas[0].id_malla)
          : ''
    });

    setSelectedTeachers([]);
    setOriginalTeachers([]);
    setError('');
    setNotice('');
    setShowForm(true);
  };

  // ======================================
  // OBTENER DOCENTES DE UNA EDICIÓN
  // ======================================

  const consultarDocentesEdicion = async (id) => {
    const data = await apiJson(
      `/api/ediciones/${id}/docentes`
    );

    const lista = Array.isArray(data)
      ? data
      : Array.isArray(data?.docentes)
        ? data.docentes
        : null;

    if (!lista) {
      throw new Error(
        'Laravel no devolvió una lista válida de docentes.'
      );
    }

    return obtenerIdsDocentes(lista);
  };

  // ======================================
  // EDITAR EDICIÓN EXISTENTE
  // ======================================

  const editar = async (edicion) => {
    setError('');
    setNotice('');
    setLoadingTeachers(true);

    try {
      const ids = await consultarDocentesEdicion(
        edicion.id_edicion
      );

      setEditingId(edicion.id_edicion);
      setForm(normalizarEdicion(edicion));

      setSelectedTeachers(ids);
      setOriginalTeachers(ids);

      setShowForm(true);
    } catch (err) {
      setError(
        `No se pudieron consultar los docentes asignados: ${err.message}`
      );
    } finally {
      setLoadingTeachers(false);
    }
  };

  // Abrir directamente la edicion recibida desde Convocatorias.
  // No altera el flujo habitual de "Gestionar ediciones".
  useEffect(() => {
    if (loading || initialEditionId == null) return;

    const clave = `${programId}:${initialEditionId}`;
    if (edicionInicialAbiertaRef.current === clave) return;

    const encontrada = ediciones.find(
      (ed) => String(ed.id_edicion) === String(initialEditionId)
    );

    if (encontrada) {
      edicionInicialAbiertaRef.current = clave;
      editar(encontrada);
    }
  }, [loading, ediciones, initialEditionId, programId]);

  // ======================================
  // SELECCIONAR / DESELECCIONAR DOCENTE
  // ======================================

  const toggleTeacher = (idDocente) => {
    const id = Number(idDocente);

    setSelectedTeachers((anteriores) => {
      if (anteriores.includes(id)) {
        return anteriores.filter((item) => item !== id);
      }

      return [...anteriores, id];
    });
  };

  // ======================================
  // GUARDAR EDICIÓN + DOCENTES
  // ======================================

  const guardar = async (event) => {
    event.preventDefault();

    if (saving) return;

    setError('');
    setNotice('');

    if (form.fecha_fin < form.fecha_inicio) {
      setError(
        'La fecha de finalización no puede ser anterior a la de inicio.'
      );
      return;
    }

    if (
      !editingId &&
      !mallasActivas.some(
        (m) => Number(m.id_malla) === Number(form.id_malla)
      )
    ) {
      setError(
        'Selecciona una malla activa perteneciente a este programa.'
      );
      return;
    }

    const payload = Object.fromEntries(
      CAMPOS.map(([key]) => [
        key,
        String(form[key] ?? '').trim()
      ])
    );

    payload.estado = form.estado;

    if (!editingId) {
      payload.id_programa = programId;
      payload.id_malla = Number(form.id_malla);
    }

    setSaving(true);

    let idEdicion = editingId;

    try {
      // PASO 1: Guardar datos académicos
      if (editingId) {
        await apiJson(`/api/ediciones/${editingId}`, {
          method: 'PUT',
          body: payload
        });
      } else {
        const creada = await apiJson('/api/ediciones', {
          method: 'POST',
          body: payload
        });

        idEdicion = Number(creada?.id_edicion);

        if (!Number.isInteger(idEdicion)) {
          throw new Error(
            'La edición fue enviada, pero Laravel no devolvió su identificador. Verifica el registro antes de intentarlo nuevamente.'
          );
        }

        // Evitar crear una segunda edición si
        // falla una asignación y se pulsa Guardar otra vez.
        setEditingId(idEdicion);
      }

      // PASO 2: Comparar docentes actuales y seleccionados
      const actuales = await consultarDocentesEdicion(
        idEdicion
      );

      const agregar = selectedTeachers.filter(
        (id) => !actuales.includes(id)
      );

      const quitar = actuales.filter(
        (id) => !selectedTeachers.includes(id)
      );

      const fallos = [];

      // PASO 3: Asignar docentes nuevos
      for (const idDoc of agregar) {
        try {
          await apiJson(
            `/api/ediciones/${idEdicion}/docentes`,
            {
              method: 'POST',
              body: { id_doc: idDoc }
            }
          );
        } catch (err) {
          fallos.push(
            `No se pudo asignar el docente #${idDoc}: ${err.message}`
          );
        }
      }

      // PASO 4: Quitar asignaciones desmarcadas
      for (const idDoc of quitar) {
        try {
          await apiJson(
            `/api/ediciones/${idEdicion}/docentes/${idDoc}`,
            {
              method: 'DELETE'
            }
          );
        } catch (err) {
          fallos.push(
            `No se pudo quitar el docente #${idDoc}: ${err.message}`
          );
        }
      }

      // PASO 5: Actualizar estado real de asignaciones
      try {
        const idsActualizados =
          await consultarDocentesEdicion(idEdicion);

        setOriginalTeachers(idsActualizados);
      } catch (err) {
        fallos.push(
          `No se pudo verificar la lista final de docentes: ${err.message}`
        );
      }

      await cargar();
      onSaved?.();

      if (fallos.length > 0) {
        setError(
          `Los datos de la edición #${idEdicion} se guardaron, ` +
          'pero algunas asignaciones requieren revisión:\n' +
          fallos.join('\n')
        );

        // Mantener abierto el formulario
        // para que se puedan revisar los errores.
        return;
      }

      setShowForm(false);

      setNotice(
        editingId
          ? 'Edición y asignaciones docentes actualizadas correctamente.'
          : 'Nueva edición y asignaciones docentes guardadas correctamente.'
      );
    } catch (err) {
      setError(
        err.message ||
        'No se pudo guardar la edición.'
      );
    } finally {
      setSaving(false);
    }
  };

  // ======================================
  // INTERFAZ
  // ======================================

  return (
    <section className="em-shell">

      <div className="em-heading">
        <div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onBack}
          >
            <ArrowLeft size={15} />
            Volver al catálogo
          </button>

          <h2>
            <CalendarDays size={23} />
            Gestionar ediciones
          </h2>

          <p>
            <strong>
              {program?.nombre_programa || program?.title}
            </strong>
            {' '}· Programa #{programId}
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={nuevaEdicion}
            disabled={
              loading ||
              mallasActivas.length === 0
            }
          >
            <Plus size={16} />
            Nueva edición
          </button>
        )}
      </div>

      {error && (
        <div
          className="em-alert em-alert-error"
          role="alert"
          style={{ whiteSpace: 'pre-line' }}
        >
          {error}
        </div>
      )}

      {notice && (
        <div
          className="em-alert em-alert-success"
          role="status"
        >
          {notice}
        </div>
      )}

      {!loading &&
        mallasActivas.length === 0 &&
        !showForm && (
          <div className="em-alert">
            No se encontraron mallas activas para este programa.
            Para crear una edición, primero debes activar o
            registrar una malla curricular vinculada.
          </div>
        )}

      {showForm ? (
        <form className="em-form" onSubmit={guardar}>

          <div className="em-form-head">
            <h3>
              {editingId
                ? `Editar edición #${editingId}`
                : 'Nueva edición'}
            </h3>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setShowForm(false)}
              disabled={saving}
            >
              <X size={15} />
              Cancelar
            </button>
          </div>

          {/* DATOS GENERALES */}

          <div className="em-fields">

            <label className="em-field">
              Programa
              <input
                value={
                  program?.nombre_programa ||
                  program?.title ||
                  ''
                }
                disabled
              />
            </label>

            <label className="em-field">
              Malla curricular

              <select
                required
                value={form.id_malla}
                disabled={Boolean(editingId)}
                onChange={(e) =>
                  setForm({
                    ...form,
                    id_malla: e.target.value
                  })
                }
              >
                <option value="">
                  Selecciona una malla activa
                </option>

                {editingId &&
                  !mallasActivas.some(
                    (m) =>
                      String(m.id_malla) ===
                      String(form.id_malla)
                  ) && (
                    <option value={form.id_malla}>
                      Malla #{form.id_malla} (asignación existente)
                    </option>
                  )}

                {mallasActivas.map((m) => (
                  <option
                    key={m.id_malla}
                    value={m.id_malla}
                  >
                    {m.nombre_malla ||
                      `Malla #${m.id_malla}`}
                  </option>
                ))}
              </select>

              {editingId && (
                <small>
                  La malla no puede cambiarse después
                  de crear la edición.
                </small>
              )}
            </label>

            {CAMPOS.map(([key, label, type]) => (
              <label
                className={`em-field ${
                  type === 'textarea'
                    ? 'em-wide'
                    : ''
                }`}
                key={key}
              >
                {label}

                {type === 'textarea' ? (
                  <textarea
                    rows={3}
                    required
                    value={form[key]}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [key]: e.target.value
                      })
                    }
                  />
                ) : (
                  <input
                    type={type}
                    required
                    maxLength={
                      key === 'nombre_edicion' ||
                      key === 'duracion'
                        ? 100
                        : key === 'horario'
                          ? 150
                          : undefined
                    }
                    value={form[key]}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [key]: e.target.value
                      })
                    }
                  />
                )}
              </label>
            ))}

            <label className="em-field">
              Estado

              <select
                value={form.estado}
                onChange={(e) =>
                  setForm({
                    ...form,
                    estado: e.target.value
                  })
                }
              >
                {ESTADOS.map((estado) => (
                  <option
                    key={estado}
                    value={estado}
                  >
                    {estado}
                  </option>
                ))}
              </select>
            </label>

          </div>

          {/* ASIGNACIÓN DE DOCENTES */}

          <div
            className="em-teacher-section"
            style={{
              marginTop: '1.75rem',
              padding: '1.25rem',
              border: '1px solid var(--color-border)',
              borderRadius: '12px'
            }}
          >
            <h3
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}
            >
              <Users size={20} />
              Docentes de esta edición
            </h3>

            <p
              style={{
                color: 'var(--color-text-muted)',
                fontSize: '0.875rem',
                marginBottom: '1rem'
              }}
            >
              Selecciona los docentes que participarán
              en esta edición. Puedes asignar varios.
              Las asignaciones no afectan otras ediciones.
            </p>

            {teacherError && (
              <div
                className="em-alert em-alert-error"
                role="alert"
              >
                {teacherError}
              </div>
            )}

            {loadingTeachers ? (
              <p>Cargando docentes...</p>
            ) : docentesDisponibles.length === 0 ? (
              <div className="em-alert">
                No hay docentes activos disponibles.
                Registra o activa docentes desde
                Planta Docente antes de asignarlos.
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '0.75rem'
                  }}
                >
                  {docentesDisponibles.map((doc) => {
                    const id = obtenerIdDocente(doc);

                    const seleccionado =
                      selectedTeachers.includes(id);

                    const activo = esActivo(doc.activo);

                    return (
                      <label
                        key={id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.7rem',
                          padding: '0.85rem',
                          border: seleccionado
                            ? '1.5px solid var(--color-green-inst)'
                            : '1px solid var(--color-border)',
                          borderRadius: '10px',
                          cursor: activo
                            ? 'pointer'
                            : 'default',
                          background: seleccionado
                            ? 'var(--color-green-inst-subtle)'
                            : 'transparent'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={seleccionado}
                          disabled={
                            saving ||
                            (!activo && !seleccionado)
                          }
                          onChange={() =>
                            toggleTeacher(id)
                          }
                        />

                        <div>
                          <strong
                            style={{
                              display: 'block',
                              fontSize: '0.875rem'
                            }}
                          >
                            {nombreDocente(doc)}
                          </strong>

                          <small
                            style={{
                              color: 'var(--color-text-muted)'
                            }}
                          >
                            Docente #{id}
                            {!activo && ' · Inactivo'}
                          </small>
                        </div>
                      </label>
                    );
                  })}
                </div>

                <p
                  style={{
                    marginTop: '1rem',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}
                >
                  Docentes seleccionados:
                  {' '}{selectedTeachers.length}
                </p>
              </>
            )}
          </div>

          {/* ACCIONES */}

          <div className="em-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowForm(false)}
              disabled={saving}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={
                saving ||
                loadingTeachers ||
                Boolean(teacherError)
              }
            >
              {saving ? (
                'Guardando...'
              ) : (
                <>
                  <Save size={16} />
                  Guardar edición y docentes
                </>
              )}
            </button>
          </div>

        </form>
      ) : loading ? (
        <p>Cargando ediciones y mallas curriculares...</p>
      ) : ediciones.length === 0 ? (
        <div className="em-empty">
          Este programa todavía no tiene
          ediciones registradas.
        </div>
      ) : (
        <div className="data-table-container">
          <table className="data-table em-table">
            <thead>
              <tr>
                <th>Edición</th>
                <th>Fechas</th>
                <th>Malla</th>
                <th>Estado</th>
                <th>Docentes</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {ediciones.map((ed) => (
                <tr key={ed.id_edicion}>
                  <td>
                    <strong>
                      {ed.nombre_edicion}
                    </strong>

                    <div className="em-muted">
                      #{ed.id_edicion}
                    </div>
                  </td>

                  <td>
                    {fechaInput(ed.fecha_inicio)}
                    {' — '}
                    {fechaInput(ed.fecha_fin)}
                  </td>

                  <td>
                    {ed.malla?.nombre_malla ||
                      mallas.find(
                        (m) =>
                          Number(m.id_malla) ===
                          Number(ed.id_malla)
                      )?.nombre_malla ||
                      `Malla #${ed.id_malla}`}
                  </td>

                  <td>
                    <span className="badge badge-blue">
                      {ed.estado}
                    </span>
                  </td>

                  <td>
                    <span className="em-teachers">
                      <Users size={14} />
                      {' '}
                      {Array.isArray(ed.docentes)
                        ? ed.docentes.length
                        : '—'}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => editar(ed)}
                      disabled={loadingTeachers}
                    >
                      <Edit2 size={14} />
                      Editar edición
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </section>
  );
};
