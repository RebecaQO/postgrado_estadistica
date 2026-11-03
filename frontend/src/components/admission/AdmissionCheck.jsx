import React, { useState, useEffect } from 'react';
import { useApplicants } from '../../context/ApplicantsContext';
import { printOrDownloadOfficialCertificate } from '../../utils/downloader';
import confetti from 'canvas-confetti';
import { 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Upload, 
  Download, 
  ShieldCheck, 
  QrCode, 
  GraduationCap, 
  ExternalLink,
  Sparkles,
  Info,
  Printer
} from 'lucide-react';

export const AdmissionCheck = ({ initialSearchQuery = '' }) => {
  const { applicants, findApplicant, resubmitDocument } = useApplicants();
  
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [searchedApplicant, setSearchedApplicant] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  const [correctingDoc, setCorrectingDoc] = useState(null);
  const [submittingCorrection, setSubmittingCorrection] = useState(false);

  useEffect(() => {
    if (initialSearchQuery) {
      handleSearch(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  const handleSearch = (queryToUse) => {
    const q = (queryToUse || searchQuery).trim();
    if (!q) return;

    const result = findApplicant(q);
    setSearchedApplicant(result || null);
    setHasSearched(true);

    if (result && result.status === 'Habilitado / Admitido') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Fallback
      }
    }
  };

  const handleResubmit = (docName) => {
    if (!searchedApplicant) return;
    setSubmittingCorrection(true);
    setTimeout(() => {
      resubmitDocument(searchedApplicant.id, docName);
      setSubmittingCorrection(false);
      setCorrectingDoc(null);
      const updated = findApplicant(searchedApplicant.ci);
      setSearchedApplicant(updated);
      alert("¡Documento rectificado y enviado al Comité Académico con éxito!");
    }, 800);
  };

  return (
    <div className="glass-card" style={{ padding: '2.5rem 2rem', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-md)' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem auto' }}>
        <div className="section-tag" style={{ marginBottom: '0.75rem' }}>
          <Search size={14} />
          <span>CONSULTA DE ADMISIONES EN TIEMPO REAL</span>
        </div>
        <h2 style={{ fontSize: '1.75rem', color: 'var(--color-umsa-blue-dark)', marginBottom: '0.5rem' }}>
          Estado de su Postulación y Expediente Académico
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          Consulte la resolución del Comité de Admisión ingresando su número de Cédula de Identidad o el Código Único de Postulante.
        </p>

        {/* Search Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} style={{
          display: 'flex',
          gap: '0.5rem',
          marginTop: '1.5rem',
          maxWidth: '540px',
          margin: '1.5rem auto 1rem auto'
        }}>
          <input
            type="text"
            required
            placeholder="Ingrese su C.I. o Código (ej. 8472910)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ fontSize: '1rem', padding: '0.85rem 1.25rem', background: '#f8fafc', border: '1.5px solid #cbd5e1' }}
          />

          <button
            type="submit"
            className="btn btn-primary"
            style={{ padding: '0 1.75rem', fontWeight: 800 }}
          >
            <Search size={18} />
            <span>Consultar</span>
          </button>
        </form>

        {/* Fast Test Demo Helper Chips */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.8rem' }}>
          <span style={{ color: 'var(--color-text-subtle)' }}>C.I. de prueba rápida:</span>
          <button
            type="button"
            onClick={() => { setSearchQuery('8472910'); handleSearch('8472910'); }}
            style={{ background: '#ecfdf5', border: '1px solid #86efac', color: '#15803d', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600 }}
          >
            8472910 (Admitido)
          </button>
          <button
            type="button"
            onClick={() => { setSearchQuery('6834921'); handleSearch('6834921'); }}
            style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#b45309', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600 }}
          >
            6834921 (Observado)
          </button>
          <button
            type="button"
            onClick={() => { setSearchQuery('4920193'); handleSearch('4920193'); }}
            style={{ background: '#f0f9ff', border: '1px solid #bae6fd', color: '#0369a1', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600 }}
          >
            4920193 (En Revisión)
          </button>
        </div>
      </div>

      {/* Dynamic Results Card */}
      {hasSearched && (
        <div className="animate-fade-in" style={{ maxWidth: '820px', margin: '0 auto' }}>
          {!searchedApplicant ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 2rem', background: '#f8fafc' }}>
              <AlertTriangle size={36} color="#d97706" style={{ marginBottom: '1rem' }} />
              <h3 style={{ color: 'var(--color-umsa-blue-dark)', marginBottom: '0.5rem' }}>No se encontró ningún registro</h3>
              <p style={{ fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto 1.5rem auto', color: 'var(--color-text-muted)' }}>
                Verifique que el número de C.I. ingresado sea el mismo con el que completó el formulario de postulación digital.
              </p>
            </div>
          ) : (
            <div>
              {/* Applicant Header Info */}
              <div className="glass-panel" style={{
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-accent-orange)', fontWeight: 800 }}>
                    EXPEDIENTE: {searchedApplicant.ticketCode}
                  </div>
                  <h3 style={{ color: 'var(--color-umsa-blue-dark)', margin: 0, fontSize: '1.25rem' }}>
                    {searchedApplicant.fullName}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    C.I.: {searchedApplicant.ci} {searchedApplicant.ciExp} • Programa: <strong style={{ color: 'var(--color-umsa-blue-dark)' }}>{searchedApplicant.programTitle}</strong>
                  </div>
                </div>

                {/* Main Status Badge */}
                <div>
                  {searchedApplicant.status === 'Habilitado / Admitido' && (
                    <span className="badge badge-green" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                      <CheckCircle2 size={16} /> HABILITADO / ADMITIDO
                    </span>
                  )}
                  {searchedApplicant.status === 'Observado' && (
                    <span className="badge badge-yellow" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                      <AlertTriangle size={16} /> OBSERVADO
                    </span>
                  )}
                  {searchedApplicant.status === 'En Revisión Documental' && (
                    <span className="badge badge-blue" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                      <Clock size={16} /> EN REVISIÓN DOCUMENTAL
                    </span>
                  )}
                </div>
              </div>

              {/* STATE 1: Habilitado / Admitido */}
              {searchedApplicant.status === 'Habilitado / Admitido' && (
                <div className="glass-card" style={{ border: '2px solid #86efac', background: '#ffffff', boxShadow: 'var(--shadow-md)' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1.5rem',
                    borderBottom: '1px solid #e2e8f0',
                    paddingBottom: '1rem'
                  }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: '#dcfce7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#15803d'
                    }}>
                      <GraduationCap size={24} />
                    </div>
                    <div>
                      <h4 style={{ color: 'var(--color-umsa-blue-dark)', margin: 0, fontSize: '1.2rem' }}>
                        ¡Felicidades! Ha sido Admitido al Programa de Posgrado
                      </h4>
                      <div style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)' }}>
                        Resolución de Admisión Nº {searchedApplicant.acceptanceDetails?.admissionNumber || 'ADM-2026-EST-019'}
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem', color: 'var(--color-text-muted)' }}>
                    El Comité Académico de Posgrado de la Facultad de Ciencias Puras y Naturales (UMSA) ha verificado favorablemente sus antecedentes y méritos académicos, declarando su admisión formal para la Gestión Académica 2026.
                  </p>

                  {/* Acceptance Card PDF preview box */}
                  <div style={{
                    background: '#f8fafc',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <FileText size={32} color="#059669" />
                      <div>
                        <strong style={{ color: 'var(--color-umsa-blue-dark)', display: 'block', fontSize: '0.95rem' }}>
                          Carta Oficial de Aceptación con Firma Digital UMSA
                        </strong>
                        <span style={{ fontSize: '0.785rem', color: 'var(--color-text-subtle)' }}>
                          Documento PDF firmado digitalmente bajo el estándar CEUB • Código QR de Verificación
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => printOrDownloadOfficialCertificate(searchedApplicant)}
                      className="btn btn-primary btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <Download size={15} />
                      <span>Descargar Carta Oficial (PDF)</span>
                    </button>
                  </div>

                  {/* Generated Credentials for Moodle & Campus */}
                  <div style={{
                    background: '#f0f9ff',
                    border: '1.5px solid #bae6fd',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem'
                  }}>
                    <h5 style={{ color: 'var(--color-umsa-blue-dark)', fontSize: '0.95rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ShieldCheck size={16} color="#0284c7" />
                      Credenciales Provisorias de Acceso al Campus Virtual Moodle
                    </h5>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem', fontSize: '0.85rem' }}>
                      <div>
                        <span style={{ color: 'var(--color-text-subtle)', display: 'block' }}>Usuario de Acceso:</span>
                        <strong style={{ color: 'var(--color-text-main)', fontFamily: 'var(--font-family-mono)' }}>
                          {searchedApplicant.acceptanceDetails?.campusUsername || `${searchedApplicant.ci}.est`}
                        </strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--color-text-subtle)', display: 'block' }}>Contraseña Inicial:</span>
                        <strong style={{ color: 'var(--color-accent-orange)', fontFamily: 'var(--font-family-mono)' }}>
                          {searchedApplicant.acceptanceDetails?.initialPass || 'Estadistica2026*'}
                        </strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--color-text-subtle)', display: 'block' }}>Matrícula Estudiantil:</span>
                        <strong style={{ color: '#0284c7', fontFamily: 'var(--font-family-mono)' }}>
                          {searchedApplicant.acceptanceDetails?.matriculaId || 'MAT-2026-0091'}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STATE 2: Observado */}
              {searchedApplicant.status === 'Observado' && (
                <div className="glass-card" style={{ border: '2px solid #fde68a', background: '#ffffff', boxShadow: 'var(--shadow-md)' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#fffbeb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#d97706'
                    }}>
                      <AlertTriangle size={22} />
                    </div>
                    <div>
                      <h4 style={{ color: 'var(--color-umsa-blue-dark)', margin: 0, fontSize: '1.15rem' }}>
                        Su postulación cuenta con observaciones documentales
                      </h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        Debe subsanar los requisitos señalados antes del cierre del periodo de postulaciones.
                      </div>
                    </div>
                  </div>

                  {/* Observation box */}
                  <div style={{
                    background: '#fffbeb',
                    border: '1px solid #fde68a',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem 1.25rem',
                    marginBottom: '1.5rem',
                    color: '#92400e',
                    fontSize: '0.9rem',
                    lineHeight: 1.6
                  }}>
                    <strong>Detalle de la Observación del Comité:</strong>
                    <div style={{ marginTop: '0.35rem' }}>
                      {searchedApplicant.observations || "El archivo del Diploma Académico adjunto se encuentra ilegible o sin sello de autenticidad. Favor de volver a escanear en alta resolución (300 DPI) y subirlo nuevamente."}
                    </div>
                  </div>

                  {/* Documents list */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <strong style={{ color: 'var(--color-umsa-blue-dark)', fontSize: '0.9rem', display: 'block', marginBottom: '0.75rem' }}>
                      Estado individual de los documentos cargados:
                    </strong>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {searchedApplicant.documents.map((doc, dIdx) => (
                        <div
                          key={dIdx}
                          style={{
                            background: '#f8fafc',
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-sm)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            border: doc.status === 'Observado' ? '1.5px solid #fde68a' : '1px solid #e2e8f0'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FileText size={16} color={doc.status === 'Observado' ? '#d97706' : '#059669'} />
                            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-main)', fontWeight: 600 }}>{doc.name}</span>
                          </div>

                          <div>
                            {doc.status === 'Observado' ? (
                              <button
                                onClick={() => handleResubmit(doc.name)}
                                className="btn btn-primary btn-sm"
                                style={{ fontSize: '0.785rem', padding: '0.35rem 0.75rem' }}
                              >
                                <Upload size={13} />
                                <span>Subir Archivo Corregido (PDF)</span>
                              </button>
                            ) : (
                              <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
                                {doc.status}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STATE 3: En Revisión Documental */}
              {searchedApplicant.status === 'En Revisión Documental' && (
                <div className="glass-card" style={{ border: '2px solid #bae6fd', background: '#ffffff', boxShadow: 'var(--shadow-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#f0f9ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0284c7'
                    }}>
                      <Clock size={22} />
                    </div>
                    <div>
                      <h4 style={{ color: 'var(--color-umsa-blue-dark)', margin: 0, fontSize: '1.15rem' }}>
                        Expediente en Proceso de Evaluación Documental
                      </h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        Fecha de recepción: {new Date(searchedApplicant.applicationDate).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.9rem', lineHeight: 1.6, margin: 0, color: 'var(--color-text-muted)' }}>
                    El Comité Académico y la Dirección de Posgrado se encuentran verificando la autenticidad de su Título en Provisión Nacional, Diploma Académico y evaluación de méritos. Los resultados definitivos serán actualizados en esta misma plataforma.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
