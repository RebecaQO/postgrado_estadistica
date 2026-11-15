
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import {
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Calendar,
  Clock,
  MapPin,
  Filter,
  AlertCircle,
  RefreshCw,
  X,
  Save,
  GraduationCap,
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle
} from 'lucide-react';

import { apiJson } from '../../../utils/api';

// ======================================================
// CONFIGURACION GENERAL
// ======================================================

const LIMITE = 20;

const FORM_VACIO = {
  id_edicion: '',
  titulo_tesis: '',
  autor: '',
  tutor: '',
  fecha_defensa: '',
  hora_defensa: '',
  lugar: '',
  resultado: 'pendiente',
  observaciones: ''
};

const normalizarResultado = (valor) => {
  const texto = String(valor || '').toLowerCase();

  if (['aprobado', 'aprobada'].includes(texto)) {
    return 'aprobado';
  }

  if (
    [
      'reprobado',
      'reprobada',
      'rechazado',
      'rechazada'
    ].includes(texto)
  ) {
    return 'reprobado';
  }

  return 'pendiente';
};

const textoError = (error) =>
  error?.message || 'Ocurrió un error inesperado.';

const obtenerId = (registro) =>
  registro?.id_defensa ?? registro?.id;

const obtenerIdEdicion = (edicion) =>
  edicion?.id_edicion ?? edicion?.id;

const formatearFecha = (fecha) => {
  if (!fecha) return 'Sin fecha';

  const partes = String(fecha).slice(0, 10).split('-');

  if (partes.length !== 3) return String(fecha);

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
};

// apiJson puede devolver directamente el array
// porque el helper desenvuelve la propiedad data.

const obtenerLista = (respuesta) => {
  if (Array.isArray(respuesta)) {
    return respuesta;
  }

  if (Array.isArray(respuesta?.data)) {
    return respuesta.data;
  }

  return [];
};

// ======================================================
// ESTILOS
// ======================================================

const estilos = {
  tarjeta: {
    background: 'var(--color-bg-card, #ffffff)',
    border: '1px solid var(--color-border, #e2e8f0)',
    borderRadius: 10,
    padding: '1rem'
  },

  etiqueta: {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: 600,
    marginBottom: '0.4rem',
    color: 'var(--color-text-main, #334155)'
  },

  control: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '0.7rem',
    borderRadius: 7,
    border: '1px solid var(--color-border, #cbd5e1)',
    fontSize: '0.9rem',
    background: 'var(--color-bg-card, #ffffff)',
    color: 'var(--color-text-main, #334155)'
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem'
  },

  acciones: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },

  error: {
    padding: '0.9rem',
    marginBottom: '1rem',
    background: '#fef2f2',
    color: '#991b1b',
    border: '1px solid #fecaca',
    borderRadius: 8
  },

  exito: {
    padding: '0.9rem',
    marginBottom: '1rem',
    background: '#ecfdf5',
    color: '#166534',
    border: '1px solid #86efac',
    borderRadius: 8
  }
};

// ======================================================
// COMPONENTE: ESTADO ACADEMICO
// ======================================================

function InsigniaEstado({ resultado }) {
  const valor = normalizarResultado(resultado);

  const configuraciones = {
    aprobado: {
      texto: 'Aprobada',
      color: '#166534',
      fondo: '#dcfce7',
      Icono: CheckCircle2
    },

    reprobado: {
      texto: 'Rechazada',
      color: '#991b1b',
      fondo: '#fee2e2',
      Icono: XCircle
    },

    pendiente: {
      texto: 'Pendiente',
      color: '#92400e',
      fondo: '#fef3c7',
      Icono: Clock
    }
  };

  const config = configuraciones[valor];
  const Icono = config.Icono;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        borderRadius: 20,
        padding: '0.35rem 0.65rem',
        fontSize: '0.78rem',
        fontWeight: 700,
        color: config.color,
        background: config.fondo,
        whiteSpace: 'nowrap'
      }}
    >
      <Icono size={13} />
      {config.texto}
    </span>
  );
}

// ======================================================
// COMPONENTE PRINCIPAL
// ======================================================

export default function DefensasPanel() {

  // ----------------------------------------------------
  // ESTADOS
  // ----------------------------------------------------

  const [defensas, setDefensas] = useState([]);
  const [ediciones, setEdiciones] = useState([]);

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [procesandoId, setProcesandoId] = useState(null);

  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({ ...FORM_VACIO });

  // Pestañas disponibles:
  // pendientes | finalizadas | eliminadas

  const [pestanaActiva, setPestanaActiva] =
    useState('pendientes');

  const [filtroResultado, setFiltroResultado] =
    useState('all');

  const [filtroEdicion, setFiltroEdicion] =
    useState('all');

  const [busqueda, setBusqueda] = useState('');

  const [pagina, setPagina] = useState(1);
  const [recarga, setRecarga] = useState(0);

  // ----------------------------------------------------
  // CARGA DE DATOS
  // ----------------------------------------------------

  useEffect(() => {
    let cancelado = false;

    const cargarDatos = async () => {
      setLoading(true);
      setError('');

      try {
        const parametros = new URLSearchParams();

        parametros.set('page', String(pagina));
        parametros.set('grupo', pestanaActiva);

        if (filtroResultado !== 'all') {
          parametros.set(
            'resultado',
            filtroResultado
          );
        }

        if (filtroEdicion !== 'all') {
          parametros.set(
            'id_edicion',
            filtroEdicion
          );
        }

        const [
          respuestaDefensas,
          respuestaEdiciones
        ] = await Promise.all([
          apiJson(
            `/api/defensas-tesis?${parametros.toString()}`
          ),
          apiJson('/api/ediciones')
        ]);

        if (cancelado) return;

        setDefensas(
          obtenerLista(respuestaDefensas)
        );

        setEdiciones(
          obtenerLista(respuestaEdiciones)
        );

      } catch (err) {
        if (!cancelado) {
          setDefensas([]);
          setError(textoError(err));
        }
      } finally {
        if (!cancelado) {
          setLoading(false);
        }
      }
    };

    cargarDatos();

    return () => {
      cancelado = true;
    };

  }, [
    pagina,
    pestanaActiva,
    filtroResultado,
    filtroEdicion,
    recarga
  ]);

  // ----------------------------------------------------
  // FUNCIONES GENERALES
  // ----------------------------------------------------

  const refrescar = () => {
    setRecarga((valor) => valor + 1);
  };

  const cambiarPestana = (nuevaPestana) => {
    setPestanaActiva(nuevaPestana);
    setPagina(1);
    setFiltroResultado('all');
    setBusqueda('');
    setError('');
    setExito('');
  };

  const cambiarResultado = (valor) => {
    setFiltroResultado(valor);
    setPagina(1);
  };

  const cambiarEdicion = (valor) => {
    setFiltroEdicion(valor);
    setPagina(1);
  };

  const cambiarCampo = (campo, valor) => {
    setForm((anterior) => ({
      ...anterior,
      [campo]: valor
    }));
  };

  const irAPrimeraPaginaYRefrescar = () => {
    setPagina(1);
    refrescar();
  };

  // ----------------------------------------------------
  // CREAR DEFENSA
  // ----------------------------------------------------

  const abrirCrear = () => {
    setEditing(null);
    setFieldErrors({});
    setError('');
    setExito('');

    setForm({ ...FORM_VACIO });
    setModalOpen(true);
  };

  // ----------------------------------------------------
  // EDITAR DEFENSA
  // ----------------------------------------------------

  const abrirEditar = (defensa) => {
    if (defensa.activo === false) {
      setError(
        'Primero debes restaurar la defensa para editarla.'
      );
      return;
    }

    setEditing(defensa);
    setFieldErrors({});
    setError('');
    setExito('');

    setForm({
      id_edicion: String(
        defensa.id_edicion ?? ''
      ),

      titulo_tesis:
        defensa.titulo_tesis ?? '',

      autor:
        defensa.autor ?? '',

      tutor:
        defensa.tutor ?? '',

      fecha_defensa:
        String(
          defensa.fecha_defensa ?? ''
        ).slice(0, 10),

      hora_defensa:
        String(
          defensa.hora_defensa ?? ''
        ).slice(0, 5),

      lugar:
        defensa.lugar ??
        defensa.lugar_defensa ??
        '',

      resultado: normalizarResultado(
        defensa.resultado ??
        defensa.estado
      ),

      observaciones:
        defensa.observaciones ?? ''
    });

    setModalOpen(true);
  };

  const cerrarModal = () => {
    if (guardando) return;

    setModalOpen(false);
    setEditing(null);
    setFieldErrors({});
    setError('');
  };

  // ----------------------------------------------------
  // GUARDAR DEFENSA
  // ----------------------------------------------------

  const guardar = async (evento) => {
    evento.preventDefault();

    if (guardando) return;

    setGuardando(true);
    setFieldErrors({});
    setError('');
    setExito('');

    const estabaEditando = Boolean(editing);

    const payload = {
      titulo_tesis:
        form.titulo_tesis.trim(),

      autor:
        form.autor.trim(),

      tutor:
        form.tutor.trim() || null,

      fecha_defensa:
        form.fecha_defensa,

      hora_defensa:
        form.hora_defensa || null,

      lugar:
        form.lugar.trim() || null,

      resultado:
        form.resultado,

      observaciones:
        form.observaciones.trim() || null
    };

    // La edición académica solo se envía al crear.
    // El backend no permite modificarla después.

    if (!estabaEditando) {
      payload.id_edicion =
        Number(form.id_edicion);
    }

    try {
      if (estabaEditando) {
        await apiJson(
          `/api/defensas-tesis/${obtenerId(editing)}`,
          {
            method: 'PUT',
            body: payload
          }
        );

      } else {
        await apiJson(
          '/api/defensas-tesis',
          {
            method: 'POST',
            body: payload
          }
        );
      }

      setModalOpen(false);
      setEditing(null);

      setExito(
        estabaEditando
          ? 'La defensa se actualizó correctamente.'
          : 'La defensa se registró correctamente.'
      );

      // Mostrar el registro en la pestaña
      // correspondiente a su resultado.

      const nuevaPestana =
        payload.resultado === 'pendiente'
          ? 'pendientes'
          : 'finalizadas';

      setPestanaActiva(nuevaPestana);
      setFiltroResultado('all');
      setFiltroEdicion('all');
      setBusqueda('');

      irAPrimeraPaginaYRefrescar();

    } catch (err) {
      if (err.status === 422 && err.errors) {
        setFieldErrors(err.errors);
      }

      setError(textoError(err));

    } finally {
      setGuardando(false);
    }
  };

  // ----------------------------------------------------
  // ELIMINAR DEFENSA (BORRADO LOGICO)
  // ----------------------------------------------------

  const eliminarDefensa = async (defensa) => {
    const id = obtenerId(defensa);

    if (!id || procesandoId !== null) return;

    const confirmado = window.confirm(
      `¿Deseas eliminar la defensa de tesis?\n\n` +
      `Título: ${defensa.titulo_tesis || 'Sin título'}\n` +
      `Autor: ${defensa.autor || 'Sin autor'}\n\n` +
      'El registro no se borrará de la base de datos. ' +
      'Podrás restaurarlo desde la pestaña Eliminadas.'
    );

    if (!confirmado) return;

    setProcesandoId(id);
    setError('');
    setExito('');

    try {
      await apiJson(
        `/api/defensas-tesis/${id}`,
        {
          method: 'DELETE'
        }
      );

      setExito(
        'Defensa eliminada correctamente. ' +
        'Puedes recuperarla desde Eliminadas.'
      );

      irAPrimeraPaginaYRefrescar();

    } catch (err) {
      setError(textoError(err));

    } finally {
      setProcesandoId(null);
    }
  };

  // ----------------------------------------------------
  // RESTAURAR DEFENSA
  // ----------------------------------------------------

  const restaurarDefensa = async (defensa) => {
    const id = obtenerId(defensa);

    if (!id || procesandoId !== null) return;

    const confirmado = window.confirm(
      `¿Deseas restaurar la defensa "${defensa.titulo_tesis || 'Sin título'}"?`
    );

    if (!confirmado) return;

    setProcesandoId(id);
    setError('');
    setExito('');

    try {
      await apiJson(
        `/api/defensas-tesis/${id}/reactivar`,
        {
          method: 'PATCH'
        }
      );

      setExito(
        'Defensa restaurada correctamente. ' +
        'Ya se encuentra disponible en su pestaña académica.'
      );

      irAPrimeraPaginaYRefrescar();

    } catch (err) {
      setError(textoError(err));

    } finally {
      setProcesandoId(null);
    }
  };

  // ----------------------------------------------------
  // ERRORES DE VALIDACION
  // ----------------------------------------------------

  const mostrarErrorCampo = (campo) => {
    const mensajes = fieldErrors[campo];

    if (!mensajes) return null;

    return (
      <p
        style={{
          color: '#dc2626',
          fontSize: '0.78rem',
          margin: '0.3rem 0 0'
        }}
      >
        {Array.isArray(mensajes)
          ? mensajes[0]
          : mensajes}
      </p>
    );
  };

  // ----------------------------------------------------
  // BUSQUEDA LOCAL
  // ----------------------------------------------------

  const defensasFiltradas = defensas.filter(
    (defensa) => {
      const texto = [
        defensa.titulo_tesis,
        defensa.autor,
        defensa.tutor,
        defensa.edicion?.nombre_edicion,
        defensa.edicion?.programa?.nombre_programa
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return texto.includes(
        busqueda.trim().toLowerCase()
      );
    }
  );

  const puedeAvanzar =
    defensas.length === LIMITE;

  // ----------------------------------------------------
  // PESTAÑAS
  // ----------------------------------------------------

  const pestanas = [
    {
      valor: 'pendientes',
      nombre: 'Defensas pendientes',
      Icono: Clock
    },
    {
      valor: 'finalizadas',
      nombre: 'Defensas finalizadas',
      Icono: CheckCircle2
    },
    {
      valor: 'eliminadas',
      nombre: 'Defensas eliminadas',
      Icono: Trash2
    }
  ];

  // ----------------------------------------------------
  // RENDERIZADO
  // ----------------------------------------------------

  return (
    <div className="animate-fade-in">

      {/* ===============================================
          ENCABEZADO
      =============================================== */}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}
      >
        <div>
          <h3
            style={{
              margin: '0 0 0.4rem',
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--color-text-main)'
            }}
          >
            <GraduationCap
              size={25}
              style={{
                display: 'inline',
                verticalAlign: 'middle',
                marginRight: 10
              }}
            />
            Tesis y Defensas de Tesis
          </h3>

          <p
            style={{
              margin: 0,
              fontSize: '0.875rem',
              color: 'var(--color-text-muted)'
            }}
          >
            Registro, programación y seguimiento de
            defensas académicas.
          </p>
        </div>

        <div style={estilos.acciones}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={refrescar}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Actualizar
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={abrirCrear}
          >
            <Plus size={16} />
            Nueva defensa
          </button>
        </div>
      </div>

      {/* ===============================================
          MENSAJES
      =============================================== */}

      {exito && (
        <div role="status" style={estilos.exito}>
          <CheckCircle2
            size={17}
            style={{
              display: 'inline',
              marginRight: 8,
              verticalAlign: 'middle'
            }}
          />
          {exito}
        </div>
      )}

      {error && !modalOpen && (
        <div role="alert" style={estilos.error}>
          <AlertCircle
            size={17}
            style={{
              display: 'inline',
              marginRight: 8,
              verticalAlign: 'middle'
            }}
          />
          {error}
        </div>
      )}

      {/* ===============================================
          PESTAÑAS
      =============================================== */}

      <div
        role="tablist"
        aria-label="Estado de defensas de tesis"
        style={{
          display: 'flex',
          gap: '0.75rem',
          flexWrap: 'wrap',
          borderBottom:
            '1px solid var(--color-border, #e2e8f0)',
          paddingBottom: '0.85rem',
          marginBottom: '1.25rem'
        }}
      >
        {pestanas.map((pestana) => {
          const activa =
            pestanaActiva === pestana.valor;

          const Icono = pestana.Icono;

          return (
            <button
              key={pestana.valor}
              type="button"
              role="tab"
              aria-selected={activa}
              className={`btn ${
                activa
                  ? 'btn-primary'
                  : 'btn-secondary'
              }`}
              onClick={() =>
                cambiarPestana(pestana.valor)
              }
            >
              <Icono size={17} />
              {pestana.nombre}
            </button>
          );
        })}
      </div>

      {/* ===============================================
          FILTROS
      =============================================== */}

      <div
        style={{
          ...estilos.tarjeta,
          marginBottom: '1.25rem'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.85rem'
          }}
        >
          <Filter size={16} />
          <strong>Filtros de búsqueda</strong>
        </div>

        <div style={estilos.grid}>

          {/* FILTRO ESTADO */}

          <div>
            <label style={estilos.etiqueta}>
              Estado de defensa
            </label>

            <select
              style={estilos.control}
              value={filtroResultado}
              onChange={(e) =>
                cambiarResultado(e.target.value)
              }
            >
              {pestanaActiva === 'pendientes' ? (
                <option value="all">
                  Defensas pendientes
                </option>
              ) : (
                <>
                  <option value="all">
                    {pestanaActiva === 'eliminadas'
                      ? 'Todas las eliminadas'
                      : 'Todas las finalizadas'}
                  </option>

                  <option value="aprobado">
                    Aprobadas
                  </option>

                  <option value="reprobado">
                    Rechazadas
                  </option>

                  {pestanaActiva === 'eliminadas' && (
                    <option value="pendiente">
                      Pendientes
                    </option>
                  )}
                </>
              )}
            </select>
          </div>

          {/* FILTRO EDICION */}

          <div>
            <label style={estilos.etiqueta}>
              Edición académica
            </label>

            <select
              style={estilos.control}
              value={filtroEdicion}
              onChange={(e) =>
                cambiarEdicion(e.target.value)
              }
            >
              <option value="all">
                Todas las ediciones
              </option>

              {ediciones.map((edicion) => (
                <option
                  key={obtenerIdEdicion(edicion)}
                  value={obtenerIdEdicion(edicion)}
                >
                  {edicion.nombre_edicion ||
                    `Edición #${obtenerIdEdicion(edicion)}`}
                </option>
              ))}
            </select>
          </div>

          {/* BUSQUEDA */}

          <div>
            <label style={estilos.etiqueta}>
              Buscar tesis o postgraduante
            </label>

            <div style={{ position: 'relative' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: 13,
                  color: '#64748b'
                }}
              />

              <input
                type="search"
                style={{
                  ...estilos.control,
                  paddingLeft: 36
                }}
                placeholder="Buscar en esta página..."
                value={busqueda}
                onChange={(e) =>
                  setBusqueda(e.target.value)
                }
              />
            </div>
          </div>

        </div>
      </div>

      {/* ===============================================
          TABLA DE DEFENSAS
      =============================================== */}

      {loading ? (
        <div
          style={{
            ...estilos.tarjeta,
            padding: '2.5rem',
            textAlign: 'center'
          }}
        >
          Cargando defensas de tesis...
        </div>
      ) : (
        <>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tesis</th>
                  <th>Postgraduante</th>
                  <th>Programa / Edición</th>
                  <th>Fecha y Hora</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {defensasFiltradas.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        padding: '2rem',
                        textAlign: 'center',
                        color: 'var(--color-text-muted)'
                      }}
                    >
                      {pestanaActiva === 'pendientes'
                        ? 'No se encontraron defensas pendientes.'
                        : pestanaActiva === 'finalizadas'
                          ? 'No se encontraron defensas finalizadas.'
                          : 'No se encontraron defensas eliminadas.'}
                    </td>
                  </tr>
                ) : (
                  defensasFiltradas.map((defensa) => {
                    const id = obtenerId(defensa);

                    return (
                      <tr key={id}>

                        {/* TESIS */}

                        <td>
                          <strong>
                            {defensa.titulo_tesis ||
                              'Sin título registrado'}
                          </strong>

                          {defensa.tutor && (
                            <div
                              style={{
                                fontSize: '0.8rem',
                                marginTop: 5,
                                color:
                                  'var(--color-text-muted)'
                              }}
                            >
                              Tutor: {defensa.tutor}
                            </div>
                          )}
                        </td>

                        {/* AUTOR */}

                        <td>
                          {defensa.autor ||
                            'Sin autor registrado'}
                        </td>

                        {/* PROGRAMA */}

                        <td>
                          <strong>
                            {defensa.edicion?.programa
                              ?.nombre_programa ||
                              'Programa no disponible'}
                          </strong>

                          <div
                            style={{
                              fontSize: '0.8rem',
                              marginTop: 4,
                              color:
                                'var(--color-text-muted)'
                            }}
                          >
                            {defensa.edicion
                              ?.nombre_edicion ||
                              `Edición #${defensa.id_edicion}`}
                          </div>
                        </td>

                        {/* FECHA Y LUGAR */}

                        <td>
                          <div>
                            <Calendar
                              size={13}
                              style={{
                                display: 'inline',
                                marginRight: 5
                              }}
                            />

                            {formatearFecha(
                              defensa.fecha_defensa
                            )}
                          </div>

                          {defensa.hora_defensa && (
                            <div
                              style={{ marginTop: 5 }}
                            >
                              <Clock
                                size={13}
                                style={{
                                  display: 'inline',
                                  marginRight: 5
                                }}
                              />

                              {String(
                                defensa.hora_defensa
                              ).slice(0, 5)}
                            </div>
                          )}

                          {(defensa.lugar ||
                            defensa.lugar_defensa) && (
                            <div
                              style={{
                                fontSize: '0.78rem',
                                marginTop: 5,
                                color:
                                  'var(--color-text-muted)'
                              }}
                            >
                              <MapPin
                                size={12}
                                style={{
                                  display: 'inline',
                                  marginRight: 5
                                }}
                              />

                              {defensa.lugar ||
                                defensa.lugar_defensa}
                            </div>
                          )}
                        </td>

                        {/* ESTADO */}

                        <td>
                          <InsigniaEstado
                            resultado={
                              defensa.resultado ??
                              defensa.estado
                            }
                          />

                          {pestanaActiva ===
                            'eliminadas' && (
                            <div
                              style={{
                                marginTop: 6,
                                fontSize: '0.75rem',
                                color: '#dc2626'
                              }}
                            >
                              Registro eliminado
                            </div>
                          )}
                        </td>

                        {/* ACCIONES */}

                        <td>
                          <div style={estilos.acciones}>

                            {pestanaActiva ===
                              'eliminadas' ? (

                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() =>
                                  restaurarDefensa(defensa)
                                }
                                disabled={
                                  procesandoId !== null
                                }
                                title="Restaurar defensa"
                              >
                                <RotateCcw size={15} />

                                {procesandoId === id
                                  ? 'Restaurando...'
                                  : 'Restaurar'}
                              </button>

                            ) : (
                              <>

                                {/* EDITAR */}

                                <button
                                  type="button"
                                  className="btn btn-secondary btn-sm"
                                  onClick={() =>
                                    abrirEditar(defensa)
                                  }
                                  disabled={
                                    procesandoId !== null
                                  }
                                  title="Editar defensa"
                                >
                                  <Edit2 size={15} />
                                  Editar
                                </button>

                                {/* ELIMINAR */}

                                <button
                                  type="button"
                                  className="btn btn-secondary btn-sm"
                                  onClick={() =>
                                    eliminarDefensa(defensa)
                                  }
                                  disabled={
                                    procesandoId !== null
                                  }
                                  title="Eliminar defensa"
                                  style={{
                                    color: '#dc2626'
                                  }}
                                >
                                  <Trash2 size={15} />

                                  {procesandoId === id
                                    ? 'Eliminando...'
                                    : 'Eliminar'}
                                </button>

                              </>
                            )}

                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ===========================================
              PAGINACION
          =========================================== */}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.8rem',
              marginTop: '1rem'
            }}
          >
            <span
              style={{
                fontSize: '0.85rem',
                color: 'var(--color-text-muted)'
              }}
            >
              Página {pagina} · {defensas.length}
              {' '}registros recibidos
            </span>

            <div style={estilos.acciones}>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={
                  pagina === 1 || loading
                }
                onClick={() =>
                  setPagina((actual) =>
                    Math.max(1, actual - 1)
                  )
                }
              >
                <ChevronLeft size={15} />
                Anterior
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={
                  !puedeAvanzar || loading
                }
                onClick={() =>
                  setPagina((actual) =>
                    actual + 1
                  )
                }
              >
                Siguiente
                <ChevronRight size={15} />
              </button>

            </div>
          </div>

        </>
      )}

      {/* ===============================================
          MODAL CREAR / EDITAR
          Se utiliza createPortal para evitar cortes.
      =============================================== */}

      {modalOpen && createPortal(
        (
          <div
            className="modal-backdrop"
            style={{
              position: 'fixed',
              inset: 0,
              width: '100vw',
              height: '100dvh',
              background:
                'rgba(15, 23, 42, 0.65)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 20,
              boxSizing: 'border-box',
              overflowY: 'auto',
              zIndex: 99999
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label={
                editing
                  ? 'Editar defensa de tesis'
                  : 'Registrar defensa de tesis'
              }
              style={{
                background:
                  'var(--color-bg-card, #ffffff)',
                color:
                  'var(--color-text-main, #334155)',
                width: '100%',
                maxWidth: 760,
                maxHeight:
                  'calc(100dvh - 40px)',
                minHeight: 0,
                boxSizing: 'border-box',
                overflowY: 'auto',
                overscrollBehavior: 'contain',
                padding: '1.5rem',
                borderRadius: 12,
                boxShadow:
                  '0 20px 60px rgba(0,0,0,0.25)'
              }}
            >

              {/* ENCABEZADO DEL MODAL */}

              <div
                style={{
                  display: 'flex',
                  justifyContent:
                    'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1.25rem'
                }}
              >
                <h3 style={{ margin: 0 }}>
                  {editing
                    ? 'Editar defensa de tesis'
                    : 'Registrar nueva defensa de tesis'}
                </h3>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={cerrarModal}
                  disabled={guardando}
                  title="Cerrar"
                >
                  <X size={17} />
                </button>
              </div>

              {/* ERROR DEL FORMULARIO */}

              {error && (
                <div
                  role="alert"
                  style={estilos.error}
                >
                  <AlertCircle
                    size={16}
                    style={{
                      display: 'inline',
                      marginRight: 8
                    }}
                  />
                  {error}
                </div>
              )}

              <form onSubmit={guardar}>

                {/* =====================================
                    EDICION Y ESTADO
                ===================================== */}

                <div
                  style={{
                    ...estilos.grid,
                    marginBottom: '1rem'
                  }}
                >

                  <div>
                    <label style={estilos.etiqueta}>
                      Edición académica *
                    </label>

                    <select
                      style={estilos.control}
                      value={form.id_edicion}
                      disabled={
                        Boolean(editing) ||
                        guardando
                      }
                      required
                      onChange={(e) =>
                        cambiarCampo(
                          'id_edicion',
                          e.target.value
                        )
                      }
                    >
                      <option value="">
                        Seleccionar edición...
                      </option>

                      {ediciones.map(
                        (edicion) => (
                          <option
                            key={
                              obtenerIdEdicion(edicion)
                            }
                            value={
                              obtenerIdEdicion(edicion)
                            }
                          >
                            {edicion.nombre_edicion ||
                              `Edición #${obtenerIdEdicion(edicion)}`}
                            {' — '}
                            {edicion.programa
                              ?.nombre_programa ||
                              'Programa'}
                          </option>
                        )
                      )}
                    </select>

                    {mostrarErrorCampo(
                      'id_edicion'
                    )}

                    {editing && (
                      <p
                        style={{
                          fontSize: '0.78rem',
                          color:
                            'var(--color-text-muted)'
                        }}
                      >
                        La edición no puede
                        modificarse después del
                        registro.
                      </p>
                    )}
                  </div>

                  <div>
                    <label style={estilos.etiqueta}>
                      Resultado académico *
                    </label>

                    <select
                      style={estilos.control}
                      value={form.resultado}
                      disabled={guardando}
                      required
                      onChange={(e) =>
                        cambiarCampo(
                          'resultado',
                          e.target.value
                        )
                      }
                    >
                      <option value="pendiente">
                        Pendiente
                      </option>

                      <option value="aprobado">
                        Aprobada
                      </option>

                      <option value="reprobado">
                        Rechazada
                      </option>
                    </select>

                    {mostrarErrorCampo(
                      'resultado'
                    )}
                  </div>

                </div>

                {/* =====================================
                    TITULO
                ===================================== */}

                <div
                  style={{
                    marginBottom: '1rem'
                  }}
                >
                  <label style={estilos.etiqueta}>
                    Título de la tesis *
                  </label>

                  <input
                    type="text"
                    style={estilos.control}
                    value={form.titulo_tesis}
                    maxLength={255}
                    required
                    disabled={guardando}
                    placeholder="Título completo de la investigación"
                    onChange={(e) =>
                      cambiarCampo(
                        'titulo_tesis',
                        e.target.value
                      )
                    }
                  />

                  {mostrarErrorCampo(
                    'titulo_tesis'
                  )}
                </div>

                {/* =====================================
                    AUTOR Y TUTOR
                ===================================== */}

                <div
                  style={{
                    ...estilos.grid,
                    marginBottom: '1rem'
                  }}
                >

                  <div>
                    <label style={estilos.etiqueta}>
                      Postgraduante / Autor *
                    </label>

                    <input
                      type="text"
                      style={estilos.control}
                      value={form.autor}
                      maxLength={255}
                      required
                      disabled={guardando}
                      onChange={(e) =>
                        cambiarCampo(
                          'autor',
                          e.target.value
                        )
                      }
                    />

                    {mostrarErrorCampo(
                      'autor'
                    )}
                  </div>

                  <div>
                    <label style={estilos.etiqueta}>
                      Tutor académico
                    </label>

                    <input
                      type="text"
                      style={estilos.control}
                      value={form.tutor}
                      maxLength={255}
                      disabled={guardando}
                      onChange={(e) =>
                        cambiarCampo(
                          'tutor',
                          e.target.value
                        )
                      }
                    />

                    {mostrarErrorCampo(
                      'tutor'
                    )}
                  </div>

                </div>

                {/* =====================================
                    FECHA Y HORA
                ===================================== */}

                <div
                  style={{
                    ...estilos.grid,
                    marginBottom: '1rem'
                  }}
                >

                  <div>
                    <label style={estilos.etiqueta}>
                      Fecha de defensa *
                    </label>

                    <input
                      type="date"
                      style={estilos.control}
                      value={
                        form.fecha_defensa
                      }
                      required
                      disabled={guardando}
                      onChange={(e) =>
                        cambiarCampo(
                          'fecha_defensa',
                          e.target.value
                        )
                      }
                    />

                    {mostrarErrorCampo(
                      'fecha_defensa'
                    )}
                  </div>

                  <div>
                    <label style={estilos.etiqueta}>
                      Hora de defensa
                    </label>

                    <input
                      type="time"
                      style={estilos.control}
                      value={
                        form.hora_defensa
                      }
                      disabled={guardando}
                      onChange={(e) =>
                        cambiarCampo(
                          'hora_defensa',
                          e.target.value
                        )
                      }
                    />

                    {mostrarErrorCampo(
                      'hora_defensa'
                    )}
                  </div>

                </div>

                {/* =====================================
                    LUGAR
                ===================================== */}

                <div
                  style={{
                    marginBottom: '1rem'
                  }}
                >
                  <label style={estilos.etiqueta}>
                    Lugar de la defensa
                  </label>

                  <input
                    type="text"
                    style={estilos.control}
                    value={form.lugar}
                    maxLength={255}
                    disabled={guardando}
                    placeholder="Auditorio, sala o plataforma virtual"
                    onChange={(e) =>
                      cambiarCampo(
                        'lugar',
                        e.target.value
                      )
                    }
                  />

                  {mostrarErrorCampo('lugar')}
                </div>

                {/* =====================================
                    OBSERVACIONES
                ===================================== */}

                <div
                  style={{
                    marginBottom: '1.5rem'
                  }}
                >
                  <label style={estilos.etiqueta}>
                    Observaciones académicas
                  </label>

                  <textarea
                    style={{
                      ...estilos.control,
                      minHeight: 110,
                      resize: 'vertical'
                    }}
                    value={
                      form.observaciones
                    }
                    disabled={guardando}
                    placeholder="Observaciones del tribunal o información adicional"
                    onChange={(e) =>
                      cambiarCampo(
                        'observaciones',
                        e.target.value
                      )
                    }
                  />

                  {mostrarErrorCampo(
                    'observaciones'
                  )}
                </div>

                {/* =====================================
                    BOTONES DEL FORMULARIO
                ===================================== */}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: '0.75rem',
                    flexWrap: 'wrap',
                    borderTop:
                      '1px solid var(--color-border, #e2e8f0)',
                    paddingTop: '1rem'
                  }}
                >

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={cerrarModal}
                    disabled={guardando}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={guardando}
                  >
                    <Save size={16} />

                    {guardando
                      ? 'Guardando...'
                      : editing
                        ? 'Guardar cambios'
                        : 'Registrar defensa'}
                  </button>

                </div>

              </form>
            </div>
          </div>
        ),
        document.body
      )}

    </div>
  );
}
