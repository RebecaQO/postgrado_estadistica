import React from 'react';
import { ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import slide4 from '../../assets/images/carrusel/slide4.jpg';

export const ImpactSection = ({ onExplorePrograms, onAboutInstitution }) => {
  return (
    <section
      className="section-spacing section-contrast-light"
      data-reveal
      aria-label="Compromiso e impacto institucional"
      style={{ background: '#f8fafc', paddingInline: '1rem', padding: 'clamp(3.5rem, 6vw, 5.5rem) 0' }}
    >
      <div className="container">
        <div
          className="impact"
          style={{
            background: '#0B192C',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 20px 45px -10px rgba(11, 25, 44, 0.25)',
            overflow: 'hidden'
          }}
        >
          <div className="impact__media" style={{ borderRadius: '6px 0 0 6px', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem' }}>
            <img
              src={slide4}
              alt="Oferta académica oficial de la Unidad de Posgrado Carrera de Estadística UMSA"
              loading="lazy"
              decoding="async"
              style={{ width: '100%', height: '100%', maxHeight: '560px', objectFit: 'contain', display: 'block' }}
            />
          </div>
          <div className="impact__body" style={{ padding: 'clamp(2rem, 4vw, 3.2rem)' }}>
            <div
              className="eyebrow eyebrow--light"
              style={{
                background: 'rgba(255,255,255,0.12)',
                color: '#93c5fd',
                borderColor: 'rgba(255,255,255,0.22)',
                borderRadius: '4px',
                padding: '0.35rem 0.8rem',
                fontSize: '0.8rem',
                fontWeight: 800,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '0.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}
            >
              <Sparkles size={14} />
              <span>Descubrimiento &amp; Transformación</span>
            </div>
            <h2
              style={{
                color: '#ffffff',
                fontFamily: 'var(--font-family-heading)',
                fontSize: 'clamp(1.85rem, 3.5vw, 2.75rem)',
                margin: '0 0 1rem 0',
                lineHeight: 1.15,
                fontWeight: 900,
                letterSpacing: '-0.025em'
              }}
            >
              Investigación cuantitativa que <span style={{ color: '#68d391' }}>transforma decisiones</span> en el país
            </h2>
            <p style={{ color: 'rgba(226, 232, 240, 0.9)', lineHeight: 1.7, margin: '0 0 1.5rem 0', fontSize: '1rem' }}>
              Desde la modelación probabilística hasta la inteligencia artificial y el aprendizaje automático, nuestros programas de posgrado te preparan para liderar soluciones de alto impacto en sectores estratégicos.
            </p>
            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn--primary"
                onClick={onExplorePrograms}
                style={{
                  borderRadius: '4px',
                  padding: '0.8rem 1.6rem',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>Explorar programas</span>
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                className="btn btn--ghost-white"
                onClick={onAboutInstitution}
                style={{
                  borderRadius: '4px',
                  padding: '0.8rem 1.4rem',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  border: '1px solid rgba(255,255,255,0.25)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <BookOpen size={15} />
                <span>Nuestra historia</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

