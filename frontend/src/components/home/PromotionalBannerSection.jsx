import React from 'react';
import { ArrowRight, MessageCircle, CheckCircle2 } from 'lucide-react';
import cienciaBanner from '../../assets/images/banner/banner_maestria_datos.png';

export const PromotionalBannerSection = ({ onSelectProgram }) => {
  const handleRedirect = () => {
    if (onSelectProgram) {
      onSelectProgram('PG-EST-002');
    } else {
      window.location.hash = 'programa/PG-EST-002';
    }
  };

  const whatsappMessage = encodeURIComponent(
    'Hola, deseo consultar sobre la Maestría en Ciencia y Análisis de Datos (III Versión).'
  );

  return (
    <section
      style={{
        background: '#0B192C',
        width: '100%',
        position: 'relative',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 0.95fr) minmax(0, 1.15fr)',
          width: '100%',
          background: '#0B192C',
          alignItems: 'center',
        }}
        className="promo-banner-grid"
      >
        {/* ── Imagen completa a un lado ── */}
        <div
          onClick={handleRedirect}
          title="Haz clic para ver más información de la maestría"
          style={{
            position: 'relative',
            background: '#060e18',
            cursor: 'pointer',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.75rem 1rem',
            height: '100%',
          }}
          className="promo-image-box"
        >
          <img
            src={cienciaBanner}
            alt="Maestría en Ciencia y Análisis de Datos - UMSA"
            style={{
              maxWidth: '100%',
              maxHeight: '340px',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              display: 'block',
              borderRadius: '6px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
              transition: 'transform 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        </div>

        {/* ── Panel en tono azul elegante ── */}
        <div
          style={{
            background: 'linear-gradient(145deg, #0B192C 0%, #1E3E62 100%)',
            padding: 'clamp(1.5rem, 2.5vw, 2.2rem) clamp(1.5rem, 4vw, 3.5rem)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '0.75rem',
            color: '#ffffff',
          }}
        >
          {/* Encabezado */}
          <div>
            <p
              style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#93c5fd',
                margin: '0 0 0.35rem 0',
              }}
            >
              UMSA · Facultad de Ciencias Puras y Naturales · Carrera de Estadística
            </p>
            <h2
              style={{
                fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)',
                fontWeight: 900,
                color: '#ffffff',
                margin: 0,
                lineHeight: 1.15,
                letterSpacing: '-0.025em',
              }}
            >
              Maestría en Ciencia y Análisis de Datos
            </h2>
            <p
              style={{
                fontSize: '0.92rem',
                color: '#93c5fd',
                margin: '0.25rem 0 0 0',
                fontWeight: 700,
              }}
            >
              III Versión — Modalidad Semipresencial
            </p>
          </div>

          {/* Párrafo descriptivo alineado al nuevo afiche */}
          <p
            style={{
              fontSize: '0.92rem',
              color: '#e2e8f0',
              lineHeight: 1.6,
              margin: 0,
              maxWidth: '68ch',
            }}
          >
            Aprende R, Python, Machine Learning, Big Data, Minería de Datos, Inteligencia Artificial y Modelos lineales generalizados en un programa multidisciplinario enfocado en profesionales que buscan impacto real.
          </p>

          {/* Acciones principales */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap',
              marginTop: '0.25rem',
            }}
          >
            <button
              onClick={handleRedirect}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                padding: '0.65rem 1.4rem',
                fontSize: '0.85rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#1d4ed8';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#2563eb';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>Ver Maestría en Más Información</span>
              <ArrowRight size={15} />
            </button>

            <a
              href={`https://wa.me/59176543210?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '4px',
                padding: '0.65rem 1.2rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                textDecoration: 'none',
                backdropFilter: 'blur(6px)',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
            >
              <MessageCircle size={15} />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .promo-banner-grid {
            grid-template-columns: 1fr !important;
          }
          .promo-image-box {
            max-height: 240px !important;
            min-height: 200px !important;
          }
        }
      `}</style>
    </section>
  );
};
