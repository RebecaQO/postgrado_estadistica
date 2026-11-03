import React from 'react';
import { Cpu, Terminal, Database, Server, Code, Sparkles, CheckCircle2 } from 'lucide-react';

export const LabsSection = () => {
  const technologies = [
    {
      name: "R & RStudio Server",
      category: "Estadística & Modelamiento",
      desc: "Entornos computacionales con Tidyverse, Stan, INLA, Bioconductor y desarrollo de paquetes estadísticos.",
      badge: "Entorno Primario",
      color: "#0284c7",
      bg: "#f0f9ff"
    },
    {
      name: "Python & JupyterLab",
      category: "Data Science & Deep Learning",
      desc: "Ecosistema científico con NumPy, Pandas, Scikit-Learn, PyTorch, PyMC y pipelines reproducibles.",
      badge: "Machine Learning",
      color: "#f59e0b",
      bg: "#fffbeb"
    },
    {
      name: "Stata & SAS Analytics",
      category: "Econometría & Bioestadística",
      desc: "Paquetes especializados para análisis de ensayos clínicos, datos de panel y encuestas complejas.",
      badge: "Institucional",
      color: "#0369a1",
      bg: "#f0f9ff"
    },
    {
      name: "Julia & C++ HPC",
      category: "Cómputo de Alto Rendimiento",
      desc: "Simulaciones Monte Carlo de ultra-alta velocidad, cadenas MCMC y optimización numérica paralela.",
      badge: "HPC",
      color: "#7c3aed",
      bg: "#f5f3ff"
    },
    {
      name: "Apache Spark & PySpark",
      category: "Big Data & Cómputo Distribuido",
      desc: "Procesamiento de petabytes de microdatos, minería de datos masivos y arquitecturas Data Lake.",
      badge: "Big Data",
      color: "#e11d48",
      bg: "#fff1f2"
    },
    {
      name: "Stan & Bayesian MCMC",
      category: "Inferencia Probabilística",
      desc: "Modelado estocástico bayesiano con algoritmos No-U-Turn Sampler (NUTS) y diagnóstico de convergencia.",
      badge: "Bayesiano",
      color: "#059669",
      bg: "#ecfdf5"
    }
  ];

  return (
    <section className="section-spacing" style={{
      background: 'linear-gradient(180deg, #f8fafc 0%, #edf2f7 100%)',
      position: 'relative'
    }}>
      <div className="container">
        <div className="section-header">
          <div className="section-tag">
            <Cpu size={14} />
            <span>INFRAESTRUCTURA Y CÓMPUTO CIENTÍFICO</span>
          </div>
          <h2 className="section-title">
            Laboratorios Computacionales & Entornos de Alto Rendimiento
          </h2>
          <p className="section-subtitle">
            Nuestros maestrandos y diplomantes cuentan con acceso a clusters computacionales, servidores de cálculo estocástico y licencias de software científico de última generación.
          </p>
        </div>

        {/* Tech Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {technologies.map((tech, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: '1.75rem',
                borderLeft: `4px solid ${tech.color}`,
                background: '#ffffff'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.75rem'
              }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: tech.color,
                  letterSpacing: '0.04em'
                }}>
                  {tech.category}
                </span>

                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  background: tech.bg,
                  color: tech.color,
                  border: `1px solid ${tech.color}40`
                }}>
                  {tech.badge}
                </span>
              </div>

              <h3 style={{ fontSize: '1.2rem', color: 'var(--color-umsa-blue-dark)', marginBottom: '0.6rem' }}>
                {tech.name}
              </h3>

              <p style={{ fontSize: '0.875rem', lineHeight: '1.6', margin: 0, color: 'var(--color-text-muted)' }}>
                {tech.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Features highlight banner */}
        <div className="glass-card" style={{
          background: '#ffffff',
          border: '1.5px solid #cbd5e1',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          alignItems: 'center',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--color-accent-orange-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Server size={24} color="var(--color-accent-orange)" />
            </div>
            <div>
              <strong style={{ color: 'var(--color-umsa-blue-dark)', display: 'block', fontSize: '0.95rem' }}>Cluster HPC de la FCPN</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Procesamiento multinúcleo para tesis y proyectos.</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Terminal size={24} color="#0284c7" />
            </div>
            <div>
              <strong style={{ color: 'var(--color-umsa-blue-dark)', display: 'block', fontSize: '0.95rem' }}>Acceso Remoto 24/7</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>JupyterLab y RStudio Server en la nube UMSA.</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Database size={24} color="#059669" />
            </div>
            <div>
              <strong style={{ color: 'var(--color-umsa-blue-dark)', display: 'block', fontSize: '0.95rem' }}>Repositorio de Microdatos</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Bases de datos socioeconómicas y biomédicas.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
