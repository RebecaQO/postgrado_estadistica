import React, { useEffect, useState } from 'react';
import { Eye, ArrowLeft, Pencil, CalendarDays } from 'lucide-react';
import { programaService } from '../../services/programaService';

const show = (v) => (v === null || v === undefined || v === '' ? 'No registrado' : String(v));

export const ProgramOverview = ({ program, onBack, onEdit, onEditions }) => {
  const [details, setDetails] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setDetails(null);
    programaService.getById(program.id_programa || program.id)
      .then((result) => { if (active) setDetails(result); })
      .catch((err) => { if (active) setError(err.message || 'No fue posible consultar el programa'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [program.id, program.id_programa]);

  const p = details || program;
  const ediciones = Array.isArray(p.ediciones) ? p.ediciones : [];
  const mallas = Array.isArray(p.mallas) ? p.mallas : [];
  const rows = [
    ['Identificador', p.id_programa || p.id],
    ['Nombre del programa', p.nombre_programa || p.title],
    ['Tipo / nivel', p.tipo_programa || p.type],
    ['Clasificación de maestría', p.maestria?.tipo || p.typeFilter],
    ['Área de conocimiento', p.area_conocimiento || p.area],
    ['Mención', p.mencion],
    ['Descripción', p.descripcion || p.description],
    ['Perfil del aspirante', p.perfil_aspirante],
    ['Perfil de egreso', p.perfil_egreso],
    ['Estado', typeof p.activo === 'boolean' ? (p.activo ? 'Activo' : 'Inactivo') : p.status],
  ];

  return (
    <section className="animate-fade-in" aria-label="Detalle del programa">
      <button type="button" className="btn btn-secondary" onClick={onBack} style={{ marginBottom: '1rem' }}>
        <ArrowLeft size={17} /> Volver al catálogo
      </button>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
        <Eye size={24} /> Información del programa
      </h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>{program.title}</p>
      <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap', marginBottom: '1.4rem' }}>
        <button type="button" className="btn btn-secondary" onClick={onEdit}><Pencil size={16} /> Editar información</button>
        <button type="button" className="btn btn-primary" onClick={onEditions}><CalendarDays size={16} /> Gestionar ediciones</button>
      </div>
      {loading && <p role="status">Consultando información completa...</p>}
      {error && <p role="alert" style={{ color: 'var(--color-status-danger)' }}>No se pudo cargar el detalle completo: {error}. Se muestra la información disponible del catálogo.</p>}
      <div className="data-table-container" style={{ marginBottom: '1.25rem' }}>
        <table className="data-table"><tbody>
          {rows.map(([label, value]) => (
            <tr key={label}><th style={{ width: '35%', textAlign: 'left' }}>{label}</th><td style={{ overflowWrap: 'anywhere' }}>{show(value)}</td></tr>
          ))}
        </tbody></table>
      </div>
      {!loading && !error && (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', color: 'var(--color-text-muted)' }}>
          <span><strong>{ediciones.length}</strong> ediciones vinculadas</span>
          <span><strong>{mallas.length}</strong> mallas curriculares</span>
        </div>
      )}
    </section>
  );
};
