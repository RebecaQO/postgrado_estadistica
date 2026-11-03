import React, { useState, useEffect, useRef } from 'react';
import { GraduationCap, BookOpen, Search } from 'lucide-react';
import { programaService } from '../../services/programaService';

const HERO_IMAGE = new URL('../../assets/images/carrusel/hero_banner.jpg', import.meta.url).href;

export const HeroSection = ({ onNavigate, onFilterPrograms }) => {
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [areas, setAreas] = useState([]);
  const bgRef = useRef(null);

  // Parallax suave en el background respetando prefers-reduced-motion
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (bgRef.current && window.scrollY < window.innerHeight) {
            bgRef.current.style.transform = `translateY(${window.scrollY * 0.22}px) scale(1.04)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch unique areas from the DB via the programas activos endpoint
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const data = await programaService.getActivos();
        if (Array.isArray(data)) {
          const unique = [...new Set(
            data
              .map(p => p.area || '')
              .filter(a => a.trim().length > 0)
          )].sort();
          setAreas(unique);
        }
      } catch (_) {
        // Fallback
      }
    };
    fetchAreas();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onFilterPrograms) {
      onFilterPrograms({
        level: selectedLevel || 'todos',
        area: selectedArea || 'todas',
        modality: 'todas',
        search: ''
      });
    } else if (onNavigate) {
      onNavigate('programas');
    }
  };

  return (
    <section className="hero" aria-label="Introducción institucional">
      {/* ── Background estático ── */}
      <div ref={bgRef} className="hero__bg" aria-hidden="true">
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${HERO_IMAGE})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>

      {/* ── Overlay ── */}
      <div className="hero__overlay" aria-hidden="true" />

      {/* ── Contenido ── */}
      <div className="hero__content" data-reveal>

        {/* Jerarquía Institucional */}
        <div style={{ marginBottom: 'var(--space-sm)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.65rem, 1.1vw, 0.82rem)',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(180, 220, 200, 0.9)',
            margin: 0,
          }}>
            Universidad Mayor de San Andrés
          </p>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.6rem, 0.95vw, 0.76rem)',
            fontWeight: 500,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(160, 205, 185, 0.8)',
            margin: 0,
          }}>
            Facultad de Ciencias Puras y Naturales
          </p>
        </div>

        {/* Título Principal */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.5rem, 6.5vw, 5rem)',
          fontWeight: 900,
          lineHeight: 1.06,
          color: '#ffffff',
          textShadow: '0 2px 28px rgba(0,0,0,0.5)',
          margin: '0 0 var(--space-sm)',
          letterSpacing: '-0.03em',
          textWrap: 'balance',
        }}>
          Unidad de Posgrado<br />
          <span style={{
            background: 'linear-gradient(90deg, #68d391 0%, #48bb78 55%, #38a169 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>en Estadística</span>
        </h1>

        {/* ── Buscador de Programas en Horizontal Lado a Lado ── */}
        <div
          className="hero-search-bar-container"
          style={{
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            borderRadius: '6px',
            padding: '0.45rem 0.55rem',
            boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.25)',
            maxWidth: '840px',
            width: '100%',
            margin: 'var(--space-md) auto 0 auto',
          }}
        >
          <form
            onSubmit={handleSearchSubmit}
            className="hero-search-form"
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '0.5rem',
              width: '100%',
            }}
            noValidate
          >
            {/* Filtro 1: Nivel Académico */}
            <div
              className="hero-filter-item"
              style={{
                flex: '1 1 0%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                padding: '0.65rem 1rem',
                minWidth: 0,
                transition: 'all 0.2s ease',
              }}
            >
              <GraduationCap size={18} color="var(--color-green-inst, #267342)" style={{ flexShrink: 0 }} />
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: '#1e293b',
                  cursor: 'pointer',
                  textOverflow: 'ellipsis',
                }}
                aria-label="Filtrar por nivel académico"
              >
                <option value="">Nivel académico...</option>
                <option value="maestria">Maestrías (M.Sc.)</option>
                <option value="diplomado">Diplomados</option>
              </select>
            </div>

            {/* Filtro 2: Especialidad o Área */}
            <div
              className="hero-filter-item"
              style={{
                flex: '1.2 1 0%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                padding: '0.65rem 1rem',
                minWidth: 0,
                transition: 'all 0.2s ease',
              }}
            >
              <BookOpen size={18} color="var(--color-blue-steel, #4f7e9f)" style={{ flexShrink: 0 }} />
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: '#1e293b',
                  cursor: 'pointer',
                  textOverflow: 'ellipsis',
                }}
                aria-label="Filtrar por especialidad o área"
              >
                <option value="">Especialidad o área...</option>
                {areas.length > 0 ? (
                  areas.map((area) => <option key={area} value={area}>{area}</option>)
                ) : (
                  <>
                    <option value="Ciencia de Datos">Ciencia de Datos &amp; IA</option>
                    <option value="Estadística Aplicada">Estadística Aplicada</option>
                    <option value="Bioestadística">Bioestadística</option>
                    <option value="Finanzas">Finanzas Cuantitativas</option>
                  </>
                )}
              </select>
            </div>

            {/* Botón Buscar */}
            <button
              type="submit"
              className="btn btn--primary"
              style={{
                padding: '0.72rem 1.6rem',
                fontSize: '0.9rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                borderRadius: '4px',
                flexShrink: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(38, 115, 66, 0.35)',
              }}
            >
              <Search size={16} />
              <span>Buscar</span>
            </button>
          </form>

          <style>{`
            @media (max-width: 640px) {
              .hero-search-bar-container {
                border-radius: 6px !important;
                padding: 0.75rem !important;
              }
              .hero-search-form {
                flex-direction: column !important;
                gap: 0.6rem !important;
              }
              .hero-filter-item {
                width: 100% !important;
                border-radius: 4px !important;
              }
              .hero-search-form button {
                width: 100% !important;
                justify-content: center !important;
                border-radius: 4px !important;
              }
            }
          `}</style>
        </div>



      </div>
    </section>
  );
};
