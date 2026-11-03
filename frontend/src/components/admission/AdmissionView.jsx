import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  ClipboardList, 
  CheckCircle2, 
  ExternalLink,
  FileText,
  Info,
  ArrowRight
} from 'lucide-react';
import { programaService } from '../../services/programaService';

export const AdmissionView = ({ targetProgramId = null }) => {
  const [programs, setPrograms] = useState([]);
  const [selectedProgramId, setSelectedProgramId] = useState(targetProgramId || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await programaService.getActivos();
        const items = Array.isArray(data) ? data : [];
        setPrograms(items);
        if (!selectedProgramId && items.length > 0) {
          setSelectedProgramId(targetProgramId || items[0].id);
        }
      } catch (err) {
        console.error('Error cargando programas para inscripción:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, [targetProgramId]);

  const selectedProg = programs.find(p => p.id === selectedProgramId) || programs[0] || null;

  const defaultFormUrl = selectedProg?.enlace_formulario_inscripcion ||
    'https://docs.google.com/forms/d/e/1FAIpQLSd_posgrado_estadistica_umsa_postulacion_2026/viewform';

  const defaultPdfUrl = selectedProg?.enlace_pdf_programa ||
    'https://drive.google.com/file/d/1_desc_programa_estadistica_fcpn_2026/view';

  const requirementsList = [
    { name: 'Fotocopia legalizada del Título en Provisión Nacional', desc: 'Nivel Licenciatura universitaria' },
    { name: 'Diploma Académico Universitario', desc: 'Legalizado o copia digital de alta resolución' },
    { name: 'Cédula de Identidad vigente o Pasaporte', desc: 'Indicando expedición en Bolivia o extranjería' },
    { name: 'Certificado de Nacimiento Computarizado', desc: 'Emitido por SERECÍ' },
    { name: 'Hoja de Vida Documentada', desc: 'Formato estándar con certificaciones relevantes' },
    { name: 'Carta de Solicitud de Admisión & Compromiso', desc: 'Dirigida a la Dirección de Posgrado FCPN' },
    { name: 'Comprobante de Pago por Matrícula / Postulación', desc: 'Depósito Banco Unión o Recaudaciones UMSA' }
  ];

  return (
    <div className="section-spacing animate-fade-in" style={{ background: '#f8fafc' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <GraduationCap size={14} />
            <span>PROCESO DE ADMISIÓN & MATRÍCULA 2026</span>
          </div>
          <h1 className="section-title">
            Inscripción Oficial de Posgrado
          </h1>
          <p className="section-subtitle">
            Postúlate en línea mediante el <strong>Formulario Oficial de Google Forms</strong> habilitado por la Unidad de Posgrado e Investigación de la Carrera de Estadística FCPN - UMSA.
          </p>
        </div>

        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* Main Application Action Box */}
          <div className="glass-card" style={{
            background: '#ffffff',
            border: '2px solid var(--color-green-inst)',
            boxShadow: 'var(--shadow-md)',
            padding: '2.5rem 2rem',
            marginBottom: '2.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span className="badge badge-green-inst" style={{ fontSize: '0.85rem', padding: '0.35rem 0.8rem' }}>
                ✓ Convocatoria Gestión 2026 Vigente
              </span>
              <span className="badge badge-blue">Acreditación CEUB</span>
              {selectedProg?.resolucion_hcu && (
                <span className="badge" style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>
                  {selectedProg.resolucion_hcu}
                </span>
              )}
            </div>

            <h2 style={{ color: 'var(--color-umsa-blue-dark)', fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Postulación al Programa de Posgrado
            </h2>

            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.75rem' }}>
              Seleccione el programa de su interés para acceder directamente al <strong>Formulario Oficial de Inscripción (Google Forms)</strong> respaldado por la Unidad de Posgrado e Investigación de la Carrera de Estadística (FCPN - UMSA).
            </p>

            {/* Program Selector */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>
                Seleccione el Programa de Postgrado:
              </label>
              <select
                value={selectedProgramId}
                onChange={(e) => setSelectedProgramId(e.target.value)}
                className="form-select"
                style={{ fontSize: '1rem', padding: '0.8rem 1rem', background: '#f8fafc', borderColor: 'var(--color-green-inst)', fontWeight: 600 }}
              >
                {programs.map((prog) => (
                  <option key={prog.id} value={prog.id}>
                    {prog.title} ({prog.type} · {prog.periodo || '2026-1'})
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Program Details */}
            {selectedProg && (
              <div style={{
                background: 'var(--color-bg-primary)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                border: '1.5px solid var(--color-border)',
                marginBottom: '2rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)', fontFamily: 'var(--font-family-mono)', fontWeight: 700 }}>
                      {selectedProg.code || selectedProg.id}
                    </span>
                    <h3 style={{ color: 'var(--color-text-main)', fontSize: '1.3rem', margin: '0.25rem 0 0.5rem 0' }}>
                      {selectedProg.title}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>
                      {selectedProg.description}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>Modalidad / Duración</div>
                    <div style={{ fontWeight: 800, color: 'var(--color-green-inst)' }}>
                      {selectedProg.duration || '18 meses'} · {selectedProg.modality || 'Híbrida'}
                    </div>
                  </div>
                </div>

                {/* Pricing summary */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--color-border)',
                  fontSize: '0.85rem'
                }}>
                  <div>
                    <span style={{ color: 'var(--color-text-subtle)', display: 'block' }}>Pago al Contado:</span>
                    <strong style={{ color: 'var(--color-green-inst)', fontSize: '1rem' }}>
                      {selectedProg.descuento_contado_porcentaje || 10}% de Descuento
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-subtle)', display: 'block' }}>Plan de Cuotas:</span>
                    <strong style={{ color: 'var(--color-blue-steel)', fontSize: '1rem' }}>
                      {selectedProg.numero_cuotas || 18} cuotas mensuales de {selectedProg.monto_cuota || 850} BOB
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-subtle)', display: 'block' }}>Matrícula UMSA:</span>
                    <strong style={{ color: 'var(--color-text-main)', fontSize: '1rem' }}>
                      {selectedProg.valor_matricula ? `${selectedProg.valor_matricula} BOB` : 'Gratuita'}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              {/* 1. Main Google Forms button */}
              <a
                href={defaultFormUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.65rem',
                  padding: '1rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: 800,
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(38, 115, 66, 0.3)'
                }}
              >
                <ExternalLink size={20} />
                <span>Completar Formulario en Google Forms</span>
                <ArrowRight size={16} />
              </a>

              {/* 2. Download PDF of program */}
              <a
                href={defaultPdfUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.65rem',
                  padding: '1rem 1.5rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                <FileText size={18} />
                <span>Descargar Programa (PDF)</span>
              </a>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8rem',
              color: 'var(--color-text-muted)',
              marginTop: '1rem'
            }}>
              <Info size={15} color="var(--color-green-inst)" />
              <span>
                El enlace oficial de Google Forms es sincronizado directamente desde la base de datos de Posgrado. Correo de soporte: <strong>estapost@fcpn.edu.bo</strong>
              </span>
            </div>
          </div>

          {/* Requirements Summary Banner */}
          <div className="glass-card" style={{
            background: '#ffffff',
            borderLeft: '4px solid var(--color-accent-orange)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <h3 style={{ color: 'var(--color-umsa-blue-dark)', fontSize: '1.15rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ClipboardList size={18} color="var(--color-accent-orange)" />
                Requisitos Obligatorios para la Postulación (CEUB / FCPN UMSA)
              </h3>
              <span className="badge badge-orange">Reglamento General CEUB</span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '0.85rem'
            }}>
              {requirementsList.map((req, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <CheckCircle2 size={16} color="var(--color-green-inst)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <strong style={{ color: 'var(--color-text-main)', fontSize: '0.85rem', display: 'block' }}>{req.name}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{req.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
