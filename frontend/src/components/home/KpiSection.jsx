import React from 'react';
import { Award, Users, BookCheck, ShieldCheck } from 'lucide-react';
import { useScrollReveal } from '../../utils/reveal';

export const KpiSection = () => {
  // Inicializar observador de scroll y contadores animados
  useScrollReveal();

  const metrics = [
    {
      count: 40,
      prefix: '+',
      suffix: '',
      unit: 'Años',
      label: 'Trayectoria y Liderazgo Académico',
      note: 'Formando a los principales estadísticos e investigadores desde 1972',
      icon: Award
    },
    {
      count: 100,
      prefix: '',
      suffix: '%',
      unit: '',
      label: 'Docentes con Ph.D. y M.Sc.',
      note: 'Claustro de posgrado graduado en Europa, Brasil, EE.UU. y la región',
      icon: Users
    },
    {
      isText: true,
      text: 'CEUB',
      unit: 'Acreditado',
      label: 'Acreditación Nacional Plena',
      note: 'Reconocimiento y homologación en todo el Sistema Universitario Boliviano',
      icon: ShieldCheck
    },
    {
      count: 850,
      prefix: '+',
      suffix: '',
      unit: 'Graduados',
      label: 'Egresados de Posgrado',
      note: 'Liderando equipos de analítica, banca, salud, bioestadística y políticas públicas',
      icon: BookCheck
    }
  ];

  return (
    <section
      className="section-spacing section-contrast-dark"
      style={{
        background: '#0B192C',
        padding: 'clamp(3.5rem, 6vw, 5.5rem) 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}
      aria-label="Métricas de impacto institucional"
    >
      <div className="container">

        <div className="section-header" data-reveal>
          <div
            className="eyebrow eyebrow--light"
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#93c5fd',
              borderColor: 'rgba(255,255,255,0.2)',
              borderRadius: '4px',
              padding: '0.35rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 800,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              marginBottom: '0.85rem'
            }}
          >
            <ShieldCheck size={14} />
            <span>Impacto Cuantitativo &amp; Trayectoria</span>
          </div>
          <h2
            className="section-title"
            style={{
              color: '#ffffff',
              fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              fontWeight: 900,
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              marginBottom: '0.85rem'
            }}
          >
            Cinco décadas de <span style={{ color: '#68d391' }}>rigor científico</span> y liderazgo
          </h2>
          <p
            className="section-subtitle"
            style={{ color: 'rgba(226, 232, 240, 0.9)', fontSize: '1.05rem', maxWidth: '64ch' }}
          >
            Números que reflejan el compromiso académico y la excelencia de la Unidad de Posgrado en Estadística – UMSA.
          </p>
        </div>

        {/* Grilla de Métricas Premium */}
        <div className="stats">
          {metrics.map((item, idx) => {
            const Icon = item.icon;
            const accentColors = [
              { bg: 'linear-gradient(145deg, #0e2d19 0%, #174a27 100%)', icon: '#68d391', text: '#68d391', border: 'rgba(104,211,145,0.3)' },
              { bg: 'linear-gradient(145deg, #102a43 0%, #1e3e62 100%)', icon: '#93c5fd', text: '#93c5fd', border: 'rgba(147,197,253,0.3)' },
              { bg: 'linear-gradient(145deg, #24143d 0%, #3e2268 100%)', icon: '#c084fc', text: '#c084fc', border: 'rgba(192,132,252,0.3)' },
              { bg: 'linear-gradient(145deg, #15331c 0%, #255430 100%)', icon: '#86efac', text: '#86efac', border: 'rgba(134,239,172,0.3)' },
            ];
            const ac = accentColors[idx % accentColors.length];

            return (
              <article
                key={idx}
                className="stat"
                data-reveal
                style={{
                  background: ac.bg,
                  border: `1px solid ${ac.border}`,
                  borderRadius: '6px',
                  boxShadow: `0 10px 30px -6px rgba(0,0,0,0.45)`,
                  position: 'relative',
                  overflow: 'hidden',
                  padding: '1.75rem 1.4rem',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = `0 18px 40px -8px rgba(0,0,0,0.55)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 10px 30px -6px rgba(0,0,0,0.45)`;
                }}
              >
                {/* Decoración de fondo */}
                <div aria-hidden="true" style={{
                  position: 'absolute', bottom: '-20px', right: '-20px',
                  width: '90px', height: '90px', borderRadius: '50%',
                  background: `radial-gradient(circle, ${ac.icon}18 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }} />

                {/* Ícono */}
                <div style={{
                  width: '44px', height: '44px', borderRadius: '4px',
                  background: `${ac.icon}20`,
                  border: `1px solid ${ac.icon}40`,
                  color: ac.icon,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 'var(--space-xs)',
                }}>
                  <Icon size={22} />
                </div>

                {/* Número */}
                {item.isText ? (
                  <strong style={{ color: ac.text }}>{item.text}</strong>
                ) : (
                  <strong
                    data-count={item.count}
                    data-prefix={item.prefix}
                    data-suffix={item.suffix}
                    style={{ color: ac.text }}
                  >
                    0
                  </strong>
                )}

                {/* Etiqueta */}
                <span style={{ color: 'rgba(255,255,255,0.92)' }}>
                  {item.unit && (
                    <small style={{ display: 'inline', color: ac.icon, fontWeight: 800, marginRight: '4px' }}>
                      {item.unit}
                    </small>
                  )}
                  {item.label}
                </span>

                <small style={{ color: 'rgba(255,255,255,0.58)' }}>{item.note}</small>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
};

