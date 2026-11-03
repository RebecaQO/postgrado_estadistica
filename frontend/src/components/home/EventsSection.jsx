import React from 'react';
import { Calendar, Video, ArrowRight, ExternalLink, GraduationCap, Users, Clock, MapPin, Award } from 'lucide-react';
import { useDefensas } from '../../hooks/useDefensas';

export const EventsSection = ({ onNavigate }) => {
  const { defensas: defenses, loading } = useDefensas();

  return (
    <section className="section-spacing" style={{ position: 'relative', background: '#f8fafc' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-tag">
            <Calendar size={14} />
            <span>ACTIVIDAD CIENTÍFICA & DEFENSAS PÚBLICAS</span>
          </div>
          <h2 className="section-title">
            Calendario de Admisiones y Defensas de Grado
          </h2>
          <p className="section-subtitle">
            Sustentaciones públicas de tesis de maestría y trabajos de grado administrados en tiempo real desde la base de datos de Posgrado FCPN.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-green-inst)' }}>
            Cargando defensas programadas desde el servidor...
          </div>
        ) : defenses.length === 0 ? (
          <div className="glass-card" style={{ background: '#ffffff', textAlign: 'center', padding: '3rem', border: '1px solid #e2e8f0', color: 'var(--color-text-muted)' }}>
            No hay defensas programadas en este momento. La Dirección publicará las próximas convocatorias de defensa aquí.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.75rem'
          }}>
            {defenses.map((def) => (
              <div
                key={def.id}
                className="glass-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: 0,
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {/* Event Header Banner */}
                <div style={{
                  background: 'linear-gradient(135deg, #1e3a5f 0%, #267342 100%)',
                  padding: '1.25rem 1.5rem',
                  color: '#ffffff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <GraduationCap size={18} />
                    <span style={{ fontSize: '0.825rem', fontWeight: 700, letterSpacing: '0.04em' }}>
                      {def.programa || 'Posgrado en Estadística'}
                    </span>
                  </div>
                  <span className="badge" style={{
                    background: def.estado === 'Aprobada' ? 'rgba(38,115,66,0.9)' : 'rgba(234,88,12,0.9)',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: 'none'
                  }}>
                    {def.estado || 'Programada'}
                  </span>
                </div>

                <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.825rem', color: 'var(--color-green-inst)', fontWeight: 700, marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar size={14} />
                      <span>{def.fecha ? `${def.fecha} • ${def.hora || '16:00'}` : 'Fecha por confirmar'}</span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', color: 'var(--color-umsa-blue-dark)', marginBottom: '1rem', lineHeight: 1.4, fontWeight: 800 }}>
                      {def.titulo}
                    </h3>

                    <div style={{
                      background: '#f8fafc',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      fontSize: '0.85rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      marginBottom: '1.25rem',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div>
                        <strong style={{ color: 'var(--color-umsa-blue-dark)' }}>Postulante:</strong> {def.postulante}
                      </div>
                      <div>
                        <strong style={{ color: 'var(--color-umsa-blue-dark)' }}>Tutor / Director:</strong> {def.tutor}
                      </div>
                      {def.tribunal && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          <strong>Tribunal:</strong> {def.tribunal}
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-subtle)', marginTop: '0.25rem', fontSize: '0.8rem' }}>
                        <MapPin size={13} color="var(--color-green-inst)" />
                        <span>{def.lugar || 'Auditorio Posgrado FCPN'}</span>
                      </div>
                      {def.nota && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-green-inst)', fontWeight: 700, fontSize: '0.85rem', marginTop: '0.2rem' }}>
                          <Award size={14} />
                          <span>Calificación Final: {def.nota} / 100</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {def.enlace_acta ? (
                      <a
                        href={def.enlace_acta}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}
                      >
                        <ExternalLink size={13} />
                        <span>Ver Acta / Enlace</span>
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-subtle)' }}>
                        Modalidad: {def.modalidad || 'Tesis'}
                      </span>
                    )}

                    <button
                      onClick={() => onNavigate && onNavigate('programas')}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.8rem' }}
                    >
                      <span>Ver Oferta</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
