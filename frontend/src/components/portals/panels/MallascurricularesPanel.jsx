import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, BookOpen, CheckCircle2, ChevronRight, Edit2, Eye, Layers, Plus, RefreshCw, Save, Search, UserCheck, UserX, Trash2, RotateCcw, X } from 'lucide-react';
import { apiJson } from '../../../utils/api';

// Las respuestas de algunas rutas pueden venir como { success, data }.
const extraer = (respuesta) => respuesta?.data ?? respuesta;
const esActivo = (valor) => valor === true || valor === 1 || valor === '1' || valor === 'true';
const mensaje = (error) => error?.message || 'No se pudo completar la operación.';
const nombrePrograma = (programa) => programa?.nombre_programa || programa?.title || `Programa #${programa?.id_programa ?? '?'}`;
const tipoPrograma = (programa) => String(programa?.tipo_programa || programa?.type || '').toLowerCase().includes('maestr') ? 'Maestria' : 'Diplomado';
const lista = (respuesta) => { const valor = extraer(respuesta); return Array.isArray(valor) ? valor : []; };
const normalizarMateria = (relacion) => ({
  id_mat: relacion?.id_mat ?? relacion?.materia?.id_mat,
  nombre_mat: relacion?.materia?.nombre_mat || relacion?.nombre_mat || 'Materia sin nombre',
  descripcion: relacion?.materia?.descripcion ?? relacion?.descripcion ?? '',
  activo: relacion?.materia?.activo ?? relacion?.activo,
  creditos: relacion?.pivot?.creditos ?? relacion?.creditos ?? '-',
  carga_horaria: relacion?.pivot?.carga_horaria ?? relacion?.carga_horaria ?? '-',
});

const boton = (accion, titulo, Icon, disabled = false, color) => (
  <button type="button" className="btn btn-secondary btn-sm" onClick={accion} disabled={disabled}
    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color }}>
    <Icon size={14} /> {titulo}
  </button>
);

export default function MallasCurricularesPanel({ programas = [], onMallasChange }) {
  const [mallas, setMallas] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [seleccion, setSeleccion] = useState(null);
  const [detalle, setDetalle] = useState(null);
  const [modalMalla, setModalMalla] = useState(null); // null | crear | editar
  const [formMalla, setFormMalla] = useState({ nombre_malla: '', id_programa: '' });
  const [modalModulo, setModalModulo] = useState(null); // null | crear | editar
  const [formModulo, setFormModulo] = useState({ nombre_mod: '', id_mod: null });
  const [modalMateria, setModalMateria] = useState(null); // null | crear | editar | asignar
  const [formMateria, setFormMateria] = useState({ nombre_mat: '', descripcion: '', id_mat: '', creditos: 8, carga_horaria: 128 });
  const [moduloDestino, setModuloDestino] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [vistaEliminados, setVistaEliminados] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState('');
  const [error, setError] = useState('');

  const programasPorId = useMemo(() => new Map(programas.map(p => [String(p.id_programa ?? p.id), p])), [programas]);
  const programaDe = (malla) => malla?.programa || programasPorId.get(String(malla?.id_programa));
  const maestriaSeleccionada = tipoPrograma(programaDe(detalle || seleccion)) === 'Maestria';

  const recargar = useCallback(async () => {
    setCargando(true);
    try {
      const [rMallas, rMaterias] = await Promise.all([apiJson('/api/mallas'), apiJson('/api/materias')]);
      const resultado = lista(rMallas);
      setMallas(resultado);
      setMaterias(lista(rMaterias));
      setError('');
      onMallasChange?.(resultado);
    } catch (e) { setError(`No se pudieron cargar las mallas: ${mensaje(e)}`); }
    finally { setCargando(false); }
  }, [onMallasChange]);

  const cargarDetalle = useCallback(async (id) => {
    try {
      const respuesta = extraer(await apiJson(`/api/mallas/${id}`));
      setDetalle(respuesta);
      setSeleccion(id);
      setError('');
    } catch (e) { setError(`No se pudo abrir la malla: ${mensaje(e)}`); }
  }, []);

  useEffect(() => { recargar(); }, [recargar]);

  const ejecutar = async (operacion, avisoExito, recargarDetalle = true) => {
    setGuardando(true);
    setError('');
    try {
      const resultado = await operacion();
      setAviso(avisoExito);
      await recargar();
      if (recargarDetalle && seleccion != null) await cargarDetalle(seleccion);
      return resultado;
    } catch (e) { setError(mensaje(e)); return null; }
    finally { setGuardando(false); }
  };

  const abrirNuevaMalla = () => {
    setFormMalla({ nombre_malla: '', id_programa: '' });
    setSeleccion(null); setDetalle(null); setModalMalla('crear'); setError('');
  };
  const abrirEditarMalla = (malla) => {
    setFormMalla({ nombre_malla: malla.nombre_malla ?? '', id_programa: String(malla.id_programa) });
    setModalMalla('editar'); setError('');
  };
  const guardarMalla = async (evento) => {
    evento.preventDefault();
    const creando = modalMalla === 'crear';
    const id = detalle?.id_malla ?? seleccion;
    const payload = creando
      ? { nombre_malla: formMalla.nombre_malla.trim(), id_programa: Number(formMalla.id_programa) }
      : { nombre_malla: formMalla.nombre_malla.trim() };
    const respuesta = await ejecutar(
      () => apiJson(creando ? '/api/mallas' : `/api/mallas/${id}`, { method: creando ? 'POST' : 'PUT', body: payload }),
      creando ? 'Malla curricular creada correctamente.' : 'Malla curricular actualizada.',
      !creando
    );
    if (respuesta) {
      setModalMalla(null);
      const nuevaId = extraer(respuesta)?.id_malla;
      if (creando && nuevaId) await cargarDetalle(nuevaId);
      else if (!creando) await cargarDetalle(id);
    }
  };

  const cambiarEstadoMalla = async (malla) => {
    const activar = !esActivo(malla.activo);
    if (!window.confirm(`¿${activar ? 'Restaurar' : 'Eliminar'} la malla "${malla.nombre_malla}"?\nEs una eliminación lógica: se conservan sus módulos, materias y ediciones.`)) return;
    await ejecutar(
      () => apiJson(`/api/mallas/${malla.id_malla}/${activar ? 'reactivar' : 'desactivar'}`, { method: 'PATCH' }),
      `Malla ${activar ? 'restaurada' : 'eliminada lógicamente'} correctamente.`
    );
  };

  const abrirModulo = (modulo = null) => {
    setFormModulo({ nombre_mod: modulo?.nombre_mod || '', id_mod: modulo?.id_mod ?? null });
    setModalModulo(modulo ? 'editar' : 'crear'); setError('');
  };
  const guardarModulo = async (evento) => {
    evento.preventDefault();
    const creando = modalModulo === 'crear';
    const respuesta = await ejecutar(
      () => apiJson(creando ? '/api/modulos' : `/api/modulos/${formModulo.id_mod}`, {
        method: creando ? 'POST' : 'PUT',
        body: creando ? { nombre_mod: formModulo.nombre_mod.trim(), id_malla: detalle.id_malla } : { nombre_mod: formModulo.nombre_mod.trim() },
      }), creando ? 'Módulo creado.' : 'Módulo actualizado.'
    );
    if (respuesta) setModalModulo(null);
  };
  const cambiarEstadoModulo = async (modulo) => {
    const activar = !esActivo(modulo.activo);
    if (!window.confirm(`¿${activar ? 'Restaurar' : 'Eliminar'} el módulo "${modulo.nombre_mod}"?\nSe conservará en la base de datos.`)) return;
    await ejecutar(() => apiJson(`/api/modulos/${modulo.id_mod}/${activar ? 'reactivar' : 'desactivar'}`, { method: 'PATCH' }), `Módulo ${activar ? 'restaurado' : 'eliminado lógicamente'}.`);
  };
  const abrirMateria = (modo, modulo = null, materia = null) => {
    setModuloDestino(modulo?.id_mod ?? null);
    setFormMateria({ nombre_mat: materia?.nombre_mat || '', descripcion: materia?.descripcion || '', id_mat: String(materia?.id_mat ?? ''), creditos: 8, carga_horaria: 128 });
    setModalMateria(modo); setError('');
  };
  const guardarMateria = async (evento) => {
    evento.preventDefault();
    const tipo = maestriaSeleccionada ? 'Maestria' : 'Diplomado';
    const esEdicion = modalMateria === 'editar';
    const esAsignacion = modalMateria === 'asignar';
    const destino = maestriaSeleccionada ? `/api/modulos/${moduloDestino}/materias` : `/api/mallas/${detalle.id_malla}/materias`;
    setGuardando(true); setError('');
    try {
      if (esEdicion) {
        await apiJson(`/api/materias/${formMateria.id_mat}`, { method: 'PUT', body: { nombre_mat: formMateria.nombre_mat.trim(), descripcion: formMateria.descripcion.trim() } });
      } else {
        let idMat = Number(formMateria.id_mat);
        if (!esAsignacion && !idMat) {
          const creada = extraer(await apiJson('/api/materias', {
            method: 'POST', body: { nombre_mat: formMateria.nombre_mat.trim(), descripcion: formMateria.descripcion.trim(), tipo },
          }));
          idMat = Number(creada?.id_mat);
          if (!Number.isInteger(idMat)) throw new Error('Laravel creó la materia pero no devolvió su ID. Verifica la materia antes de repetir la operación.');
          // Guardar el ID localmente para no crear otra materia si falla su vinculación.
          setFormMateria(prev => ({ ...prev, id_mat: String(idMat) }));
        }
        await apiJson(destino, {
          method: 'POST', body: { id_mat: idMat, creditos: Number(formMateria.creditos), carga_horaria: Number(formMateria.carga_horaria) },
        });
      }
      setModalMateria(null);
      setAviso(esEdicion ? 'Materia actualizada.' : 'Materia vinculada correctamente.');
      await recargar();
      await cargarDetalle(seleccion);
    } catch (e) { setError(mensaje(e)); }
    finally { setGuardando(false); }
  };
  const cambiarEstadoMateria = async (materia) => {
    const activar = !esActivo(materia.activo);
    if (!window.confirm(`¿${activar ? 'Restaurar' : 'Eliminar'} la materia "${materia.nombre_mat}"?\nEste cambio afecta a esa materia en todas las mallas o módulos donde esté asignada.`)) return;
    await ejecutar(() => apiJson(`/api/materias/${materia.id_mat}/${activar ? 'reactivar' : 'desactivar'}`, { method: 'PATCH' }), `Materia ${activar ? 'restaurada' : 'eliminada lógicamente'}.`);
  };

  const mallasFiltradas = mallas.filter(m => {
    const valor = `${m.nombre_malla} ${nombrePrograma(programaDe(m))} ${m.id_malla}`.toLowerCase();
    return esActivo(m.activo) !== vistaEliminados && valor.includes(busqueda.toLowerCase());
  });
  const modulos = Array.isArray(detalle?.modulos) ? detalle.modulos : [];
  const modulosVisibles = modulos.filter(mod =>
    !vistaEliminados
      ? esActivo(mod.activo)
      : !esActivo(mod.activo) || (mod.materias || []).some(mat => !esActivo(normalizarMateria(mat).activo))
  );
  const materiasDirectas = Array.isArray(detalle?.materias_diplomado) ? detalle.materias_diplomado :
    Array.isArray(detalle?.materiasDiplomado) ? detalle.materiasDiplomado : [];
  const yaAsignadas = new Set((maestriaSeleccionada
    ? (modulos.find(m => String(m.id_mod) === String(moduloDestino))?.materias ?? [])
    : materiasDirectas).map(m => String(m.id_mat ?? m.materia?.id_mat)));
  const materiasCompatibles = materias.filter(m => {
    const subtipo = maestriaSeleccionada ? m.materia_maestria ?? m.materiaMaestria : m.modulo_diplomado ?? m.moduloDiplomado;
    return subtipo && esActivo(m.activo) && !yaAsignadas.has(String(m.id_mat));
  });

  const pintarMaterias = (relaciones, modulo = null) => {
    const items = (relaciones || []).map(normalizarMateria).filter(mat =>
      vistaEliminados ? !esActivo(mat.activo) || !esActivo(modulo?.activo ?? true) || !esActivo(detalle?.activo) : esActivo(mat.activo)
    );
    return <div style={{ display: 'grid', gap: 9, marginTop: 12 }}>
      {items.length === 0 && <p style={{ color: 'var(--color-text-muted)' }}>{vistaEliminados ? 'No hay materias eliminadas en este apartado.' : 'No hay materias activas asignadas.'}</p>}
      {items.map(mat => <div key={mat.id_mat} style={{ padding: 13, border: '1px solid var(--color-border)', borderRadius: 9, background: '#f8fafc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div><strong>{mat.nombre_mat}</strong> <small>#{mat.id_mat}</small>
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{mat.descripcion}</div>
            <div style={{ fontSize: 12, marginTop: 5 }}>Créditos: <strong>{mat.creditos}</strong> · Horas: <strong>{mat.carga_horaria}</strong> · {esActivo(mat.activo) ? 'Activa' : 'Inactiva'}</div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            {!vistaEliminados && boton(() => abrirMateria('editar', modulo, mat), 'Editar', Edit2, !esActivo(mat.activo))}
            {esActivo(mat.activo) ? (!vistaEliminados && boton(() => cambiarEstadoMateria(mat), 'Eliminar', Trash2)) : boton(() => cambiarEstadoMateria(mat), 'Restaurar', RotateCcw, !esActivo(detalle?.activo) || (modulo && !esActivo(modulo.activo)))}
          </div>
        </div>
      </div>)}
    </div>;
  };

  return <section className="animate-fade-in" style={{ display: 'grid', gap: 20 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 15, flexWrap: 'wrap' }}>
      <div><h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Mallas Curriculares</h3>
        <p style={{ margin: '6px 0 0', color: 'var(--color-text-muted)' }}>Administración de planes de estudio, módulos y materias de diplomados y maestrías.</p></div>
      <div style={{ display: 'flex', gap: 8 }}>
        {boton(recargar, 'Actualizar', RefreshCw, cargando || guardando)}
        <button type="button" onClick={abrirNuevaMalla} className="btn btn-primary"><Plus size={16} /> Nueva malla</button>
      </div>
    </div>
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <button type="button" className={`btn ${!vistaEliminados ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setVistaEliminados(false)}>Activos</button>
      <button type="button" className={`btn ${vistaEliminados ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setVistaEliminados(true)}><Trash2 size={15} /> Eliminados</button>
      <small style={{ alignSelf: 'center', color: 'var(--color-text-muted)' }}>Los eliminados se conservan en PostgreSQL y no deben aparecer en la página pública.</small>
    </div>
    {error && <div className="em-alert em-alert-error" role="alert">{error}</div>}
    {aviso && <div className="em-alert em-alert-success" role="status">{aviso}</div>}

    {detalle ? <>
      <div>{boton(() => { setDetalle(null); setSeleccion(null); setError(''); }, 'Volver a todas las mallas', ArrowLeft)}</div>
      <div className="glass-card" style={{ padding: 20, background: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div><h3 style={{ marginTop: 0 }}>{detalle.nombre_malla} <small>#{detalle.id_malla}</small></h3>
            <p style={{ margin: 0 }}>{nombrePrograma(programaDe(detalle))} · {maestriaSeleccionada ? 'Maestría' : 'Diplomado'} · {esActivo(detalle.activo) ? 'Activa' : 'Inactiva'}</p></div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {!vistaEliminados && boton(() => abrirEditarMalla(detalle), 'Editar malla', Edit2, !esActivo(detalle.activo))}
            {boton(() => cambiarEstadoMalla(detalle), esActivo(detalle.activo) ? 'Eliminar' : 'Restaurar', esActivo(detalle.activo) ? Trash2 : RotateCcw)}
          </div>
        </div>
      </div>
      {maestriaSeleccionada ? <>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center' }}><h3>Módulos de la maestría</h3>
          <button type="button" className="btn btn-primary" disabled={vistaEliminados || !esActivo(detalle.activo) || !esActivo(programaDe(detalle)?.activo)} onClick={() => abrirModulo()}><Plus size={16} /> Crear módulo</button></div>
        {modulosVisibles.length === 0 && <p>{vistaEliminados ? 'No hay módulos eliminados en esta malla.' : 'No hay módulos activos en esta malla.'}</p>}
        {modulosVisibles.map(mod => <div className="glass-card" key={mod.id_mod} style={{ padding: 18, background: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <div><h4 style={{ margin: 0 }}>{mod.nombre_mod} <small>#{mod.id_mod}</small></h4><small>{esActivo(mod.activo) ? 'Activo' : 'Inactivo'}</small></div>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
              {!vistaEliminados && boton(() => abrirModulo(mod), 'Editar', Edit2, !esActivo(mod.activo) || !esActivo(detalle.activo))}
              {esActivo(mod.activo) ? (!vistaEliminados && boton(() => cambiarEstadoModulo(mod), 'Eliminar', Trash2)) : boton(() => cambiarEstadoModulo(mod), 'Restaurar', RotateCcw, !esActivo(detalle.activo))}
              {!vistaEliminados && boton(() => abrirMateria('crear', mod), 'Nueva materia', Plus, !esActivo(mod.activo) || !esActivo(detalle.activo))}
              {!vistaEliminados && boton(() => abrirMateria('asignar', mod), 'Asignar existente', Layers, !esActivo(mod.activo) || !esActivo(detalle.activo))}
            </div>
          </div>
          {pintarMaterias(mod.materias, mod)}
        </div>)}
      </> : <div className="glass-card" style={{ background: '#fff', padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div><h3 style={{ margin: 0 }}>Materias del diplomado</h3><small>Se asignan directamente a la malla curricular.</small></div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {!vistaEliminados && boton(() => abrirMateria('crear'), 'Nueva materia', Plus, !esActivo(detalle.activo))}
            {!vistaEliminados && boton(() => abrirMateria('asignar'), 'Asignar existente', Layers, !esActivo(detalle.activo))}
          </div>
        </div>
        {pintarMaterias(materiasDirectas)}
      </div>}
    </> : <>
      <div style={{ position: 'relative' }}><Search size={16} style={{ position: 'absolute', left: 12, top: 13 }} />
        <input className="form-input" style={{ paddingLeft: 36 }} placeholder="Buscar malla o programa..." value={busqueda} onChange={e => setBusqueda(e.target.value)} /></div>
      {cargando ? <p>Cargando mallas curriculares...</p> : <div className="data-table-container"><table className="data-table"><thead><tr><th>ID</th><th>Malla curricular</th><th>Programa asociado</th><th>Tipo</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody>{mallasFiltradas.length === 0 ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: 30 }}>{vistaEliminados ? 'No hay mallas eliminadas.' : 'No se encontraron mallas activas.'}</td></tr> : mallasFiltradas.map(m => <tr key={m.id_malla}>
          <td>#{m.id_malla}</td><td><strong>{m.nombre_malla}</strong></td><td>{nombrePrograma(programaDe(m))}</td><td>{tipoPrograma(programaDe(m)) === 'Maestria' ? 'Maestría' : 'Diplomado'}</td>
          <td><span className={`badge ${esActivo(m.activo) ? 'badge-green' : 'badge-red'}`}>{esActivo(m.activo) ? 'Activa' : 'Inactiva'}</span></td>
          <td><div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {boton(() => cargarDetalle(m.id_malla), 'Ver / gestionar', Eye)}
            {!vistaEliminados && boton(() => { setSeleccion(m.id_malla); abrirEditarMalla(m); }, 'Editar', Edit2, !esActivo(m.activo))}
            {boton(() => { setSeleccion(m.id_malla); cambiarEstadoMalla(m); }, esActivo(m.activo) ? 'Eliminar' : 'Restaurar', esActivo(m.activo) ? Trash2 : RotateCcw)}
          </div></td>
        </tr>)}</tbody></table></div>}
    </>}

    {modalMalla && <div className="modal-overlay" onClick={() => setModalMalla(null)}><div className="modal-content" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
      <div className="modal-header"><h3>{modalMalla === 'crear' ? 'Nueva malla curricular' : 'Editar malla curricular'}</h3><button type="button" className="modal-close-btn" onClick={() => setModalMalla(null)}><X size={18}/></button></div>
      <form className="modal-body" onSubmit={guardarMalla}><label className="form-label">Nombre de la malla curricular</label>
        <input className="form-input" maxLength={150} required value={formMalla.nombre_malla} onChange={e => setFormMalla({ ...formMalla, nombre_malla: e.target.value })} />
        <label className="form-label" style={{ marginTop: 14 }}>Programa académico</label>
        <select className="form-select" required disabled={modalMalla === 'editar'} value={formMalla.id_programa} onChange={e => setFormMalla({ ...formMalla, id_programa: e.target.value })}>
          <option value="">Seleccionar programa...</option>{programas.map(p => <option key={p.id_programa ?? p.id} value={p.id_programa ?? p.id} disabled={!esActivo(p.activo) && p.status !== 'Activo'}>{nombrePrograma(p)} ({tipoPrograma(p) === 'Maestria' ? 'Maestría' : 'Diplomado'})</option>)}
        </select>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>El tipo de estructura curricular depende del programa. No se puede cambiar el programa de una malla ya creada.</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'end', marginTop: 22 }}>{boton(() => setModalMalla(null), 'Cancelar', X)}<button type="submit" disabled={guardando} className="btn btn-primary"><Save size={16}/> Guardar malla</button></div>
      </form></div></div>}

    {modalModulo && <div className="modal-overlay" onClick={() => setModalModulo(null)}><div className="modal-content" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
      <div className="modal-header"><h3>{modalModulo === 'crear' ? 'Crear módulo' : 'Editar módulo'}</h3><button type="button" className="modal-close-btn" onClick={() => setModalModulo(null)}><X size={18}/></button></div>
      <form className="modal-body" onSubmit={guardarModulo}><label className="form-label">Nombre del módulo</label><input className="form-input" maxLength={150} required value={formModulo.nombre_mod} onChange={e => setFormModulo({ ...formModulo, nombre_mod: e.target.value })} />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'end', marginTop: 20 }}>{boton(() => setModalModulo(null), 'Cancelar', X)}<button disabled={guardando} type="submit" className="btn btn-primary"><Save size={16}/> Guardar módulo</button></div>
      </form></div></div>}

    {modalMateria && <div className="modal-overlay" onClick={() => setModalMateria(null)}><div className="modal-content" style={{ maxWidth: 570, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
      <div className="modal-header"><h3>{modalMateria === 'editar' ? 'Editar materia' : modalMateria === 'asignar' ? 'Asignar materia existente' : 'Crear y asignar materia'}</h3><button type="button" className="modal-close-btn" onClick={() => setModalMateria(null)}><X size={18}/></button></div>
      <form className="modal-body" onSubmit={guardarMateria}>
        {modalMateria === 'asignar' ? <><label className="form-label">Materia existente de {maestriaSeleccionada ? 'maestría' : 'diplomado'}</label>
          <select required className="form-select" value={formMateria.id_mat} onChange={e => setFormMateria({ ...formMateria, id_mat: e.target.value })}><option value="">Selecciona una materia...</option>
            {materiasCompatibles.map(m => <option key={m.id_mat} value={m.id_mat}>{m.nombre_mat} (#{m.id_mat})</option>)}
          </select>{materiasCompatibles.length === 0 && <p>No hay materias compatibles sin asignar. Usa «Nueva materia».</p>}</> : <>
          <label className="form-label">Nombre de la materia</label><input className="form-input" required maxLength={150} value={formMateria.nombre_mat} onChange={e => setFormMateria({ ...formMateria, nombre_mat: e.target.value })} />
          <label className="form-label" style={{ marginTop: 12 }}>Descripción</label><textarea rows={3} required className="form-textarea" value={formMateria.descripcion} onChange={e => setFormMateria({ ...formMateria, descripcion: e.target.value })} />
        </>}
        {modalMateria !== 'editar' && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
          <label className="form-label">Créditos<input type="number" min="1" required className="form-input" value={formMateria.creditos} onChange={e => setFormMateria({ ...formMateria, creditos: e.target.value })} /></label>
          <label className="form-label">Carga horaria<input type="number" min="1" required className="form-input" value={formMateria.carga_horaria} onChange={e => setFormMateria({ ...formMateria, carga_horaria: e.target.value })} /></label>
        </div>}
        {modalMateria === 'editar' && <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Los créditos y la carga horaria corresponden a la asignación curricular. El backend actual no proporciona una ruta para modificarlos después de asignar la materia.</p>}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'end', marginTop: 20 }}>{boton(() => setModalMateria(null), 'Cancelar', X)}<button className="btn btn-primary" disabled={guardando || (modalMateria === 'asignar' && materiasCompatibles.length === 0)} type="submit"><Save size={16}/> Guardar</button></div>
      </form></div></div>}
  </section>;
}
