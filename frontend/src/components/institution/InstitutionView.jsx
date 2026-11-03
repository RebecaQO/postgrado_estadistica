import React, { useState, useEffect } from 'react';
import { facultyData, authoritiesData, institutionTimeline } from '../../data/facultyData';
import { 
  Building2, 
  Target, 
  Eye, 
  Users, 
  Microscope, 
  Lightbulb, 
  Compass, 
  History,
  GraduationCap,
  Sparkles,
  ExternalLink,
  ChevronDown,
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Award,
  UserCheck,
  Briefcase,
  Navigation,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useScrollReveal } from '../../utils/reveal';

import slide1 from '../../assets/images/carrusel/slide1.jpg';
import slide2 from '../../assets/images/carrusel/slide2.jpg';
import slide3 from '../../assets/images/carrusel/slide3.jpg';
import slide4 from '../../assets/images/carrusel/slide4.jpg';
import { docenteService } from '../../services/docenteService';

export const InstitutionView = () => {
  const [docentes, setDocentes] = useState([]);
  const [loadingDocentes, setLoadingDocentes] = useState(true);
  const [openAccordion, setOpenAccordion] = useState(0);

  // Inicializar observador de scroll para [data-reveal]
  useScrollReveal();

  useEffect(() => {
    const fetchDocentes = async () => {
      try {
        setLoadingDocentes(true);
        const data = await docenteService.getPublicDocentes();
        if (Array.isArray(data) && data.length > 0) {
          setDocentes(data);
        } else {
          setDocentes(facultyData);
        }
      } catch (err) {
        console.error('Error cargando docentes:', err);
        setDocentes(facultyData);
      } finally {
        setLoadingDocentes(false);
      }
    };
    fetchDocentes();
  }, []);

  const toggleAccordion = (index) => {
    setOpenAccordion((prev) => (prev === index ? -1 : index));
  };

  const director = authoritiesData.find(a => a.isDirector) || authoritiesData[0];
  const otherAuthorities = authoritiesData.filter(a => !a.isDirector);

  return (
    <div className="institution-page" style={{ paddingBottom: 'var(--space-xl)', background: '#f8fafc' }}>
      
      {/* ── 1. Hero Institucional (Sección Clara) ── */}
      <section className="section-spacing section-contrast-light" style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container" data-reveal>
          <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center' }}>
            <span className="eyebrow" style={{ borderRadius: '4px' }}>Nuestra Institución</span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.3rem, 4.8vw, 3.8rem)', margin: 'var(--space-2xs) 0 var(--space-xs) 0', color: '#0f172a', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.12 }}>
              Excelencia Académica, Investigación &amp; Rigor Estadístico
            </h1>
            <p className="lead" style={{ color: '#475569', margin: '0 0 var(--space-md) 0', fontSize: '1.15rem' }}>
              Unidad de Posgrado e Investigación de la Carrera de Estadística — Facultad de Ciencias Puras y Naturales, Universidad Mayor de San Andrés.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ul className="pill-list pill-list--green" style={{ justifyContent: 'center' }}>
                <li>Acreditación CEUB</li>
                <li>Modelación Estocástica</li>
                <li>Ciencia de Datos &amp; IA</li>
                <li>Bioestadística</li>
                <li>Inferencia Causal</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Misión Académica y Compromiso Social (Sección Fuerte / Oscura) ── */}
      <section
        className="section-spacing section-contrast-dark"
        style={{
          background: '#0B192C',
          color: '#ffffff',
          padding: 'clamp(3.5rem, 6vw, 5.5rem) 0',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
        data-reveal
        aria-labelledby="mision-title"
      >
        <div className="container">
          <div className="split" style={{ alignItems: 'center' }}>
            <div className="split__media" style={{ borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)' }}>
              <img 
                src={slide1} 
                alt="Campus Universitario Cota Cota - Facultad de Ciencias Puras y Naturales UMSA" 
                loading="lazy" 
                decoding="async"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <div className="split__content" style={{ padding: 'clamp(1rem, 2vw, 2rem)' }}>
              <span className="eyebrow eyebrow--light" style={{ borderRadius: '4px', background: 'rgba(255,255,255,0.12)', color: '#93c5fd', borderColor: 'rgba(255,255,255,0.25)' }}>
                Misión &amp; Compromiso
              </span>
              <h2
                id="mision-title"
                style={{
                  color: '#ffffff',
                  fontSize: 'clamp(2rem, 3.6vw, 2.8rem)',
                  fontWeight: 900,
                  lineHeight: 1.15,
                  letterSpacing: '-0.025em',
                  margin: '0.2rem 0 0.85rem 0'
                }}
              >
                Formación de alto nivel para los desafíos cuantitativos de Bolivia
              </h2>
              <p style={{ color: 'rgba(226, 232, 240, 0.9)', lineHeight: 1.7, fontSize: '1.02rem', margin: '0 0 1rem 0' }}>
                Formamos investigadores y profesionales de cuarto nivel con sólida fundamentación matemática y estocástica, capaces de formular modelos probabilísticos, diseñar experimentos complejos y liderar la toma de decisiones basada en evidencia para resolver problemáticas del desarrollo científico, social, ambiental y productivo.
              </p>
              <ul className="pill-list pill-list--dark" style={{ marginTop: 'var(--space-2xs)' }}>
                <li>Fundamentación Matemática</li>
                <li>Toma de Decisiones basada en Datos</li>
                <li>Impacto Productivo</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. DIRECCIÓN Y PERSONAL ENCARGADO DE POSGRADO (NUEVA SECCIÓN PROFESIONAL) ── */}
      <section style={{ marginBlock: 'var(--space-xl)' }} data-reveal aria-labelledby="authorities-title">
        <div className="container">
          
          <div className="section-header">
            <span className="eyebrow" style={{ borderRadius: '4px' }}>
              <Users size={14} />
              <span>Dirección &amp; Encargados Administrativos</span>
            </span>
            <h2
              id="authorities-title"
              className="section-title"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.2rem, 4.2vw, 3.2rem)',
                fontWeight: 900,
                color: '#0f172a',
                lineHeight: 1.12,
                letterSpacing: '-0.03em',
                margin: 'var(--space-2xs) 0 0.5rem 0'
              }}
            >
              Dirección de Carrera y Personal Administrativo
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem', margin: 'var(--space-2xs) 0 0 0' }}>
              Liderazgo de la Carrera de Estadística y equipo administrativo de apoyo a la comunidad académica.
            </p>
          </div>

          {/* Tarjeta Ejecutiva Principal del Director */}
          {director && (
            <div
              style={{
                background: 'linear-gradient(145deg, #0B192C 0%, #173252 100%)',
                borderRadius: '8px',
                border: '1px solid rgba(30, 62, 98, 0.35)',
                boxShadow: '0 20px 45px -10px rgba(11, 25, 44, 0.35)',
                color: '#ffffff',
                padding: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                marginBottom: '2rem',
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: 'clamp(1.5rem, 3vw, 2.5rem)',
                alignItems: 'center',
              }}
              className="director-card-grid"
            >
              <div style={{ textAlign: 'center' }}>
                <img
                  src={director.avatar}
                  alt={director.name}
                  style={{
                    width: '140px',
                    height: '140px',
                    borderRadius: '8px',
                    objectFit: 'cover',
                    border: '3px solid #68d391',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                    display: 'block',
                    margin: '0 auto',
                    background: '#07111e'
                  }}
                />
                <span
                  style={{
                    display: 'inline-block',
                    marginTop: '0.75rem',
                    background: '#1e5f35',
                    color: '#ffffff',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '4px',
                    border: '1px solid #4ade80',
                  }}
                >
                  Dirección de Carrera
                </span>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#93c5fd', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  <Award size={16} />
                  <span>Máxima Autoridad</span>
                </div>
                <h3 style={{ fontSize: 'clamp(1.5rem, 2.4vw, 2rem)', fontWeight: 900, color: '#ffffff', margin: '0 0 0.25rem 0', letterSpacing: '-0.02em' }}>
                  {director.name}
                </h3>
                <div style={{ fontSize: '1.05rem', color: '#68d391', fontWeight: 700, marginBottom: '0.2rem' }}>
                  {director.role}
                </div>
                <div style={{ fontSize: '0.86rem', color: '#cbd5e1', marginBottom: '0.85rem' }}>
                  {director.degree}
                </div>
                <p style={{ color: 'rgba(226, 232, 240, 0.92)', lineHeight: 1.65, fontSize: '0.94rem', margin: '0 0 1.1rem 0' }}>
                  {director.bio}
                </p>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                    <Building2 size={15} color="#68d391" />
                    <span>{director.office}</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Grilla de 2 Encargados Administrativos (Sin correos ni teléfonos) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {otherAuthorities.map((staff) => (
              <div
                key={staff.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  boxShadow: '0 4px 18px -4px rgba(0, 0, 0, 0.06)',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 10px 24px -4px rgba(0, 0, 0, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 18px -4px rgba(0, 0, 0, 0.06)';
                }}
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                  <img
                    src={staff.avatar}
                    alt={staff.name}
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      border: '2px solid var(--color-green-inst, #267342)',
                      background: '#f1f5f9',
                      flexShrink: 0
                    }}
                  />
                  <div>
                    <span
                      style={{
                        display: 'inline-block',
                        background: 'rgba(38, 115, 66, 0.1)',
                        color: 'var(--color-green-inst, #267342)',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '4px',
                        marginBottom: '0.25rem',
                      }}
                    >
                      Personal Administrativo
                    </span>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
                      {staff.name}
                    </h4>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                      {staff.degree}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.9rem', color: 'var(--color-green-inst, #267342)', fontWeight: 800, marginBottom: '0.45rem' }}>
                  {staff.role}
                </div>

                <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.6, margin: '0 0 1.1rem 0', flex: 1 }}>
                  {staff.bio}
                </p>

                <div style={{ paddingTop: '0.85rem', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: '#64748b' }}>
                  <Building2 size={14} color="var(--color-green-inst, #267342)" />
                  <span>{staff.office}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 4. Investigación & IETA (Sección Clara) ── */}

      <section className="section-spacing section-contrast-light" style={{ background: '#ffffff', padding: 'clamp(3.5rem, 6vw, 5.5rem) 0' }} data-reveal aria-labelledby="ieta-title">
        <div className="container">
          <div className="split" data-reverse style={{ alignItems: 'center' }}>
            <div className="split__media" style={{ borderRadius: '6px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 12px 32px -8px rgba(0,0,0,0.1)' }}>
              <img 
                src={slide3} 
                alt="Laboratorio analítico e investigación en el Instituto de Estadística Teórica y Aplicada" 
                loading="lazy" 
                decoding="async"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <div className="split__content" style={{ padding: 'clamp(1rem, 2vw, 2rem)' }}>
              <span className="eyebrow eyebrow--blue" style={{ borderRadius: '4px' }}>Investigación de Frontera</span>
              <h2
                id="ieta-title"
                style={{
                  color: '#0f172a',
                  fontSize: 'clamp(2rem, 3.6vw, 2.8rem)',
                  fontWeight: 900,
                  lineHeight: 1.15,
                  letterSpacing: '-0.025em',
                  margin: '0.2rem 0 0.85rem 0'
                }}
              >
                Instituto de Estadística Teórica y Aplicada (IETA)
              </h2>
              <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '1.02rem', margin: '0 0 1rem 0' }}>
                El IETA es el motor científico de nuestra unidad, generando modelos analíticos aplicados a salud pública, econometría, cambio climático y optimización industrial. Desarrolla investigación de frontera en métodos Markov Chain Monte Carlo (MCMC), estadística bayesiana y muestreo en poblaciones complejas.
              </p>
              <ul className="pill-list" style={{ marginTop: 'var(--space-2xs)' }}>
                <li>MCMC Bayesiano</li>
                <li>Muestreo Complejo</li>
                <li>Series Temporales</li>
                <li>Modelos Epidemiológicos</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Callout Lateral: Semillero y Club Científico (Sección Fuerte / Oscura) ── */}
      <section className="container" data-reveal style={{ marginBlock: 'var(--space-lg)' }} aria-labelledby="club-title">
        <div
          className="callout"
          style={{
            background: 'linear-gradient(145deg, #102a43 0%, #1e3e62 100%)',
            borderRadius: '6px',
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 20px 45px -10px rgba(16, 42, 67, 0.35)',
            overflow: 'hidden',
            color: '#ffffff'
          }}
        >
          <div className="callout__media">
            <img 
              src={slide2} 
              alt="Estudiantes y posgraduantes en talleres y hackathons de datos" 
              loading="lazy" 
              decoding="async"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div className="callout__body" style={{ padding: 'clamp(1.5rem, 3.5vw, 3rem)' }}>
            <span className="eyebrow eyebrow--light" style={{ borderRadius: '4px', background: 'rgba(255,255,255,0.12)', color: '#93c5fd', borderColor: 'rgba(255,255,255,0.25)' }}>
              Comunidad &amp; Talento
            </span>
            <h2
              id="club-title"
              style={{
                color: '#ffffff',
                fontSize: 'clamp(1.75rem, 3vw, 2.4rem)',
                fontWeight: 900,
                letterSpacing: '-0.025em',
                lineHeight: 1.18,
                margin: '0.2rem 0 0.75rem 0'
              }}
            >
              Club Científico de Estadística
            </h2>
            <p style={{ color: 'rgba(226, 232, 240, 0.92)', lineHeight: 1.65, fontSize: '1rem', margin: '0 0 1rem 0' }}>
              Semillero activo de jóvenes investigadores y estudiantes de posgrado dedicado a datathons, coloquios de investigación, lectura crítica de papers y talleres intensivos de programación en R, Python y Julia.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap', marginTop: 'var(--space-2xs)' }}>
              <span
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: '4px',
                  padding: '0.45rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em'
                }}
              >
                Talleres de Programación &amp; Hackathons
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Trayectoria Histórica (Sección Clara) ── */}
      <section style={{ marginBlock: 'var(--space-xl)' }} data-reveal aria-labelledby="history-title">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto var(--space-md) auto' }}>
            <span className="eyebrow" style={{ borderRadius: '4px' }}>Trayectoria Institucional</span>
            <h2
              id="history-title"
              className="section-title"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.2rem, 4.2vw, 3.2rem)',
                fontWeight: 900,
                color: '#0f172a',
                lineHeight: 1.12,
                letterSpacing: '-0.03em',
                margin: 'var(--space-2xs) 0 0.5rem 0'
              }}
            >
              Más de Cinco Décadas al Servicio de la Ciencia
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem', margin: 'var(--space-2xs) 0 0 0' }}>
              Evolución y consolidación de la formación estocástica en la Universidad Mayor de San Andrés.
            </p>
          </div>

          <div className="accordion container--narrow" data-accordion>
            {institutionTimeline.map((item, idx) => {
              const isOpen = openAccordion === idx;
              return (
                <div
                  key={idx}
                  className="accordion__item"
                  style={{
                    borderRadius: '4px',
                    border: '1px solid #cbd5e1',
                    marginBottom: '0.65rem',
                    overflow: 'hidden'
                  }}
                >
                  <h3 className="accordion__header">
                    <button
                      type="button"
                      className="accordion__trigger"
                      aria-expanded={isOpen}
                      aria-controls={`panel-history-${idx}`}
                      id={`trigger-history-${idx}`}
                      onClick={() => toggleAccordion(idx)}
                      style={{
                        padding: '1.1rem 1.35rem',
                        background: isOpen ? '#f1f5f9' : '#ffffff',
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: '#0f172a'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ 
                          background: 'rgba(38, 115, 66, 0.12)', 
                          color: 'var(--color-green-inst, #006400)', 
                          padding: '0.25rem 0.65rem', 
                          borderRadius: '4px', 
                          fontSize: '0.85rem',
                          fontWeight: 800,
                          fontFamily: 'JetBrains Mono, monospace'
                        }}>
                          {item.year}
                        </span>
                        <span>{item.title}</span>
                      </span>
                      <span className="accordion__icon" aria-hidden="true" />
                    </button>
                  </h3>
                  <div
                    id={`panel-history-${idx}`}
                    role="region"
                    aria-labelledby={`trigger-history-${idx}`}
                    className={`accordion__panel ${isOpen ? 'is-open' : ''}`}
                  >
                    <div className="accordion__body" style={{ padding: '1.25rem 1.35rem', background: '#ffffff', color: '#475569', lineHeight: 1.65 }}>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 8. Claustro Docente e Investigadores (Sección con Alto Contraste) ── */}
      <section style={{ marginBlock: 'var(--space-xl)' }} data-reveal aria-labelledby="faculty-title">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto var(--space-md) auto' }}>
            <span className="eyebrow" style={{ borderRadius: '4px' }}>Claustro Académico</span>
            <h2
              id="faculty-title"
              className="section-title"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.2rem, 4.2vw, 3.2rem)',
                fontWeight: 900,
                color: '#0f172a',
                lineHeight: 1.12,
                letterSpacing: '-0.03em',
                margin: 'var(--space-2xs) 0 0.5rem 0'
              }}
            >
              Docentes e Investigadores de Posgrado
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem', margin: 'var(--space-2xs) 0 0 0' }}>
              Académicos con grado de Doctorado (Ph.D.) y Maestría (M.Sc.) vinculados activamente a la producción científica nacional e internacional.
            </p>
          </div>

          {/* Grilla de Docentes con Gama de Colores Armoniosa (Sin LinkedIn ni enlaces externos) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {docentes.map((doc, idx) => {
              const fullName = doc.nombre_completo || doc.name || `${doc.nombre || ''} ${doc.apellido || ''}`;
              const degree = doc.titulo || doc.degree || 'MSc en Estadística';
              const specialty = doc.especialidad || doc.specialty || 'Estadística Aplicada';
              const photo = doc.foto_url || doc.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
              const bio = doc.bio || 'Docente e Investigador de la Carrera de Estadística (FCPN-UMSA).';

              // Gama de colores armoniosa rotativa
              const DOCENTE_PALETTES = [
                {
                  theme: '#2563EB',
                  lightBg: '#EFF6FF',
                  borderColor: '#BFDBFE',
                  darkText: '#1D4ED8',
                  glow: 'rgba(37, 99, 235, 0.15)',
                  badge: 'Ciencia de Datos & Cómputo'
                },
                {
                  theme: '#059669',
                  lightBg: '#ECFDF5',
                  borderColor: '#A7F3D0',
                  darkText: '#047857',
                  glow: 'rgba(5, 150, 105, 0.15)',
                  badge: 'Bioestadística & Salud'
                },
                {
                  theme: '#7C3AED',
                  lightBg: '#F5F3FF',
                  borderColor: '#DDD6FE',
                  darkText: '#6D28D9',
                  glow: 'rgba(124, 58, 237, 0.15)',
                  badge: 'Modelación & IA'
                },
                {
                  theme: '#D97706',
                  lightBg: '#FFFBEB',
                  borderColor: '#FDE68A',
                  darkText: '#B45309',
                  glow: 'rgba(217, 119, 6, 0.15)',
                  badge: 'Econometría & Muestreo'
                },
                {
                  theme: '#0891B2',
                  lightBg: '#ECFEFF',
                  borderColor: '#A5F3FC',
                  darkText: '#0E7490',
                  glow: 'rgba(8, 145, 178, 0.15)',
                  badge: 'Minería de Datos'
                },
                {
                  theme: '#DC2626',
                  lightBg: '#FEF2F2',
                  borderColor: '#FECACA',
                  darkText: '#B91C1C',
                  glow: 'rgba(220, 38, 38, 0.15)',
                  badge: 'Inferencia Causal'
                }
              ];

              const palette = DOCENTE_PALETTES[idx % DOCENTE_PALETTES.length];

              return (
                <article
                  key={doc.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '1.75rem 1.5rem',
                    borderRadius: '10px',
                    border: `1.5px solid ${palette.borderColor}`,
                    borderTop: `4px solid ${palette.theme}`,
                    background: '#ffffff',
                    boxShadow: `0 4px 18px ${palette.glow}`,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 12px 28px ${palette.glow}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 4px 18px ${palette.glow}`;
                  }}
                >
                  <div style={{ position: 'relative', marginBottom: '1rem' }}>
                    <img
                      src={photo}
                      alt={fullName}
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                      }}
                      style={{
                        width: '96px',
                        height: '96px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: `3px solid ${palette.theme}`,
                        boxShadow: `0 4px 16px ${palette.glow}`,
                        display: 'block',
                        background: '#f1f5f9'
                      }}
                    />
                  </div>

                  <span
                    style={{
                      display: 'inline-block',
                      background: palette.lightBg,
                      color: palette.darkText,
                      border: `1px solid ${palette.borderColor}`,
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      padding: '0.2rem 0.65rem',
                      borderRadius: '99px',
                      marginBottom: '0.55rem'
                    }}
                  >
                    {palette.badge}
                  </span>

                  <h3 style={{ fontSize: '1.15rem', color: '#0f172a', margin: '0 0 0.25rem 0', fontWeight: 900, lineHeight: 1.25 }}>
                    {fullName}
                  </h3>

                  <div style={{
                    fontSize: '0.85rem',
                    color: palette.theme,
                    fontWeight: 800,
                    marginBottom: '0.25rem'
                  }}>
                    {degree}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginBottom: '0.85rem' }}>
                    {specialty}
                  </div>

                  <p style={{
                    fontSize: '0.86rem',
                    color: '#475569',
                    lineHeight: 1.6,
                    margin: 0,
                    flex: 1
                  }}>
                    {bio}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .director-card-grid {
            grid-template-columns: 1fr !important;
            text-align: center !important;
          }
        }
      `}</style>
    </div>
  );
};
