import React, { useState } from 'react';
import { newsAndDefensesData } from '../../data/newsData';
import { 
  Newspaper, 
  Video, 
  BookOpen, 
  Calendar, 
  ExternalLink, 
  GraduationCap, 
  Clock, 
  User, 
  CheckCircle2 
} from 'lucide-react';

export const NewsView = () => {
  const [filterType, setFilterType] = useState('todos');

  const filteredItems = newsAndDefensesData.filter(item => {
    if (filterType === 'defensas' && item.type !== 'defense') return false;
    if (filterType === 'publicaciones' && item.type !== 'paper') return false;
    if (filterType === 'eventos' && item.type !== 'workshop') return false;
    return true;
  });

  return (
    <div className="section-spacing animate-fade-in" style={{ background: '#f8fafc' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Newspaper size={14} />
            <span>ACTIVIDAD INVESTIGATIVA & COMUNICACIÓN CIENTÍFICA</span>
          </div>
          <h1 className="section-title">
            Noticias, Defensas de Tesis y Publicaciones
          </h1>
          <p className="section-subtitle">
            Convocatorias a defensas públicas de grado, artículos de impacto en revistas indexadas y eventos científicos organizados por el Instituto de Investigaciones Estadísticas.
          </p>
        </div>

        {/* Filter Sub-tabs */}
        <div className="tabs-header" style={{ maxWidth: '640px', margin: '0 auto 3rem auto' }}>
          <button
            className={`tab-btn ${filterType === 'todos' ? 'active' : ''}`}
            onClick={() => setFilterType('todos')}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <span>Todos ({newsAndDefensesData.length})</span>
          </button>

          <button
            className={`tab-btn ${filterType === 'defensas' ? 'active' : ''}`}
            onClick={() => setFilterType('defensas')}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <GraduationCap size={16} />
            <span>Defensas de Tesis</span>
          </button>

          <button
            className={`tab-btn ${filterType === 'publicaciones' ? 'active' : ''}`}
            onClick={() => setFilterType('publicaciones')}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <BookOpen size={16} />
            <span>Papers & Artículos</span>
          </button>

          <button
            className={`tab-btn ${filterType === 'eventos' ? 'active' : ''}`}
            onClick={() => setFilterType('eventos')}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <Calendar size={16} />
            <span>Simposios</span>
          </button>
        </div>

        {/* News Grid with Rich Imagery */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '2rem'
        }}>
          {filteredItems.map((item) => {
            const isDefense = item.type === 'defense';

            return (
              <div
                key={item.id}
                className="glass-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: 0,
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  boxShadow: 'var(--shadow-sm)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden'
                }}
              >
                {/* News Image Header */}
                <div style={{ position: 'relative', height: '220px', width: '100%', overflow: 'hidden' }}>
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />

                  {/* Gradient Overlay and Top Badges */}
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    right: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span className={`badge ${isDefense ? 'badge-orange' : 'badge-blue'}`} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}>
                      {item.category}
                    </span>

                    <span className="badge badge-green" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}>
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-accent-orange)', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={13} /> {item.date}
                    </div>

                    <h3 style={{ fontSize: '1.25rem', color: 'var(--color-umsa-blue-dark)', marginBottom: '0.85rem', lineHeight: 1.35 }}>
                      {item.title}
                    </h3>

                    {isDefense ? (
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
                        <div><strong style={{ color: 'var(--color-umsa-blue-dark)' }}>Postulante:</strong> {item.author}</div>
                        <div><strong style={{ color: 'var(--color-umsa-blue-dark)' }}>Tutor:</strong> {item.tutor}</div>
                        <div><strong style={{ color: 'var(--color-umsa-blue-dark)' }}>Tribunal:</strong> {item.tribunal.join(' • ')}</div>
                        <div style={{ color: 'var(--color-text-subtle)', marginTop: '0.2rem' }}>
                          <strong>Modalidad:</strong> {item.modality}
                        </div>
                      </div>
                    ) : (
                      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '1rem',
                    borderTop: '1px solid #f1f5f9'
                  }}>
                    {isDefense ? (
                      <a
                        href={item.zoomLink}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        <Video size={14} />
                        <span>Ingresar a Transmisión Zoom</span>
                      </a>
                    ) : (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        <span>Ver Publicación Oficial</span>
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
