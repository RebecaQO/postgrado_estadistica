import React, { useEffect, useState } from 'react';
import { useApplicants } from '../../context/ApplicantsContext';
import { printOrDownloadOfficialCertificate } from '../../utils/downloader';
import { 
  User, 
  GraduationCap, 
  Upload, 
  CreditCard, 
  CheckCircle, 
  FileText, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Download, 
  Printer, 
  CheckCircle2, 
  AlertCircle,
  FileCheck,
  Building
} from 'lucide-react';
import { programaService } from '../../services/programaService';

export const AdmissionWizard = ({ preselectedProgramId, onFinished }) => {
  const { addApplicant } = useApplicants();

  const [programList, setProgramList] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [submittedApplicant, setSubmittedApplicant] = useState(null);

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const data = await programaService.getActivos();
        const validPrograms = Array.isArray(data) ? data : [];
        setProgramList(validPrograms);

        if (validPrograms.length > 0 && !validPrograms.some(p => p.id === preselectedProgramId)) {
          setFormData(prev => ({
            ...prev,
            programId: validPrograms[0].id,
            programTitle: validPrograms[0].title,
          }));
        }
      } catch (error) {
        console.error('Error cargando programas para admisión:', error);
        setProgramList([]);
      }
    };

    loadPrograms();
  }, [preselectedProgramId]);

  // Form State
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    ci: '',
    ciExp: 'LP',
    email: '',
    phone: '',
    city: 'La Paz',
    university: '',
    undergraduateDegree: '',
    graduationYear: '2023',
    programId: preselectedProgramId || 'msc-ciencia-datos',
    programTitle: '',
    paymentOption: 'Plan en Cuotas (18 Cuotas)',
    documents: {
      titulo: 'Titulo_Provision_Nacional.pdf',
      diploma: 'Diploma_Academico.pdf',
      ci: 'Cedula_Identidad.pdf',
      cv: 'Curriculum_Vitae_Documentado.pdf',
      pago: 'Boleta_Deposito_Postulacion.pdf'
    }
  });

  const [uploadedFiles, setUploadedFiles] = useState({
    titulo: true,
    diploma: true,
    ci: true,
    cv: true,
    pago: true
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileToggle = (field) => {
    setUploadedFiles(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const nextStep = () => {
    // Validation
    if (currentStep === 1) {
      if (!formData.nombres || !formData.apellidos || !formData.ci || !formData.email || !formData.phone) {
        alert("Por favor complete todos los campos obligatorios del Paso 1.");
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.university || !formData.undergraduateDegree) {
        alert("Por favor complete los datos de su formación académica universitaria.");
        return;
      }
    }
    if (currentStep === 3) {
      const allUploaded = Object.values(uploadedFiles).every(Boolean);
      if (!allUploaded) {
        alert("Asegúrese de cargar los 5 documentos requeridos en formato PDF.");
        return;
      }
    }

    if (currentStep === 4) {
      const prog = programList.find(p => p.id === formData.programId) || programList[0];
      const dataToSubmit = {
        ...formData,
        programTitle: prog ? prog.title : formData.programTitle || 'Programa de posgrado'
      };
      const created = addApplicant(dataToSubmit);
      setSubmittedApplicant(created);
      setCurrentStep(5);
      return;
    }

    setCurrentStep(prev => prev + 1);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const steps = [
    { num: 1, label: 'Datos Personales' },
    { num: 2, label: 'Formación Académica' },
    { num: 3, label: 'Carga de Documentos' },
    { num: 4, label: 'Modalidad de Pago' },
    { num: 5, label: 'Emisión de Ticket' }
  ];

  return (
    <div className="glass-card" style={{ padding: '2.5rem 2rem', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-md)' }}>
      {/* Wizard Step Indicator */}
      <div className="wizard-steps">
        {steps.map((s) => {
          const isActive = currentStep === s.num;
          const isCompleted = currentStep > s.num;

          return (
            <div
              key={s.num}
              className={`wizard-step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
            >
              <div className="wizard-step-circle">
                {isCompleted ? <CheckCircle2 size={20} /> : s.num}
              </div>
              <div className="wizard-step-label">
                {s.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* STEP 1: Datos Personales */}
      {currentStep === 1 && (
        <div className="animate-fade-in">
          <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <h3 style={{ color: 'var(--color-umsa-blue-dark)', fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={20} color="var(--color-accent-orange)" />
              Paso 1: Identificación y Datos Personales del Postulante
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
              Ingrese la información exacta tal como figura en su Cédula de Identidad boliviana o Pasaporte.
            </p>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Nombres Completos *</label>
              <input
                type="text"
                required
                placeholder="Ej: Marcelo Rodrigo"
                value={formData.nombres}
                onChange={(e) => handleInputChange('nombres', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Apellidos Paterno y Materno *</label>
              <input
                type="text"
                required
                placeholder="Ej: Quispe Condori"
                value={formData.apellidos}
                onChange={(e) => handleInputChange('apellidos', e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Número de C.I. *</label>
              <input
                type="text"
                required
                placeholder="Ej: 8472910"
                value={formData.ci}
                onChange={(e) => handleInputChange('ci', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Expedido *</label>
              <select
                value={formData.ciExp}
                onChange={(e) => handleInputChange('ciExp', e.target.value)}
                className="form-select"
              >
                <option value="LP">LP (La Paz)</option>
                <option value="CBBA">CB (Cochabamba)</option>
                <option value="SCZ">SC (Santa Cruz)</option>
                <option value="OR">OR (Oruro)</option>
                <option value="PT">PT (Potosí)</option>
                <option value="CH">CH (Chuquisaca)</option>
                <option value="TJ">TJ (Tarija)</option>
                <option value="BE">BN (Beni)</option>
                <option value="PD">PD (Pando)</option>
                <option value="EXT">EXT (Extranjero)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Ciudad de Residencia *</label>
              <input
                type="text"
                required
                placeholder="Ej: La Paz / El Alto"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Correo Electrónico Personal *</label>
              <input
                type="email"
                required
                placeholder="marcelo.quispe@gmail.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Teléfono / WhatsApp Móvil *</label>
              <input
                type="tel"
                required
                placeholder="+591 76543210"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Programa de Posgrado al que Postula *</label>
            <select
              value={formData.programId}
              onChange={(e) => handleInputChange('programId', e.target.value)}
              className="form-select"
            >
              {programList.length === 0 ? (
                <option value="">Cargando programas vigentes...</option>
              ) : (
                programList.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.type} - {p.periodo || 'Gestión 2026'})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      )}

      {/* STEP 2: Formación Académica */}
      {currentStep === 2 && (
        <div className="animate-fade-in">
          <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <h3 style={{ color: 'var(--color-umsa-blue-dark)', fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GraduationCap size={20} color="var(--color-accent-orange)" />
              Paso 2: Formación Académica Universitaria Previa
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
              Datos del Título de Licenciatura o Grado Académico obtenido previamente.
            </p>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Universidad de Origen *</label>
              <input
                type="text"
                required
                placeholder="Ej: Universidad Mayor de San Andrés (UMSA)"
                value={formData.university}
                onChange={(e) => handleInputChange('university', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Carrera / Título de Grado *</label>
              <input
                type="text"
                required
                placeholder="Ej: Licenciatura en Estadística / Informática / Ing. Sistemas"
                value={formData.undergraduateDegree}
                onChange={(e) => handleInputChange('undergraduateDegree', e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Año de Titulación / Graduación *</label>
              <input
                type="number"
                min="1980"
                max="2026"
                value={formData.graduationYear}
                onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Número de Registro / Folio del Título</label>
              <input
                type="text"
                placeholder="Ej: FOLIO-2023-9912 (Opcional)"
                className="form-input"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Carga de Documentación */}
      {currentStep === 3 && (
        <div className="animate-fade-in">
          <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <h3 style={{ color: 'var(--color-umsa-blue-dark)', fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Upload size={20} color="var(--color-accent-orange)" />
              Paso 3: Carga de Requisitos Documentales Digitalizados (PDF)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
              Formato permitido: Archivos PDF individuales (Máximo 5MB por archivo). Se realiza validación y hash de integridad digital.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { id: 'titulo', name: 'Fotocopia Legalizada del Título en Provisión Nacional', desc: 'Anverso y reverso con sello oficial' },
              { id: 'diploma', name: 'Diploma Académico de Licenciatura', desc: 'Copia digitalizada en alta resolución' },
              { id: 'ci', name: 'Cédula de Identidad Vigente o Pasaporte', desc: 'Escaneo legible por ambas caras' },
              { id: 'cv', name: 'Hoja de Vida (Curriculum Vitae Documentado)', desc: 'Formato estándar con certificados principales' },
              { id: 'pago', name: 'Boleta de Depósito Bancario / CPT de Postulación', desc: 'Comprobante Banco Unión o Sistema Recaudación UMSA' }
            ].map((doc) => {
              const isLoaded = uploadedFiles[doc.id];

              return (
                <div
                  key={doc.id}
                  style={{
                    background: isLoaded ? '#f0fdf4' : '#f8fafc',
                    border: isLoaded ? '1.5px solid #86efac' : '1px solid #e2e8f0',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: 'var(--radius-sm)',
                      background: isLoaded ? '#dcfce7' : '#e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isLoaded ? '#15803d' : '#64748b'
                    }}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <strong style={{ color: 'var(--color-umsa-blue-dark)', fontSize: '0.9rem', display: 'block' }}>
                        {doc.name}
                      </strong>
                      <span style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)' }}>
                        {doc.desc} • {isLoaded ? `Cargado: ${doc.id}_postulante.pdf (1.8 MB)` : 'Pendiente'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleFileToggle(doc.id)}
                    className={`btn btn-sm ${isLoaded ? 'btn-secondary' : 'btn-primary'}`}
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
                  >
                    {isLoaded ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#15803d', fontWeight: 700 }}>
                        <CheckCircle size={14} /> Archivo Válido (Modificar)
                      </span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Upload size={14} /> Seleccionar PDF
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 4: Modalidad de Pago Seleccionada */}
      {currentStep === 4 && (
        <div className="animate-fade-in">
          <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <h3 style={{ color: 'var(--color-umsa-blue-dark)', fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={20} color="var(--color-accent-orange)" />
              Paso 4: Modalidad de Pago de Colegiatura Seleccionada
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
              Seleccione la opción financiera con la que formalizará su postulación e inscripción en caso de ser admitido.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            {[
              {
                id: 'Plan en Cuotas (18 Cuotas)',
                title: 'Plan en Cuotas Mensuales',
                desc: 'Cuota inicial de matrícula + 18 pagos mensuales programados sin interés.',
                badge: 'Más Solicitado'
              },
              {
                id: 'Pago al Contado (Con Descuento)',
                title: 'Pago Único al Contado',
                desc: 'Aplica a un 10% a 12% de descuento directo sobre la colegiatura total.',
                badge: 'Descuento Institucional'
              },
              {
                id: 'Solicitud de Beca Docente-Funcionario',
                title: 'Postulación a Beca UMSA',
                desc: 'Descuento por convenio docente/administrativo FCPN sujeto a evaluación de méritos.',
                badge: 'Sujeto a Concurso'
              }
            ].map((opt) => (
              <div
                key={opt.id}
                onClick={() => handleInputChange('paymentOption', opt.id)}
                className="glass-card"
                style={{
                  cursor: 'pointer',
                  border: formData.paymentOption === opt.id ? '2px solid var(--color-accent-orange)' : '1px solid #e2e8f0',
                  background: formData.paymentOption === opt.id ? 'var(--color-accent-orange-subtle)' : '#ffffff',
                  boxShadow: formData.paymentOption === opt.id ? 'var(--shadow-md)' : 'var(--shadow-xs)'
                }}
              >
                <span className="badge badge-orange" style={{ marginBottom: '0.65rem' }}>
                  {opt.badge}
                </span>
                <h4 style={{ color: 'var(--color-umsa-blue-dark)', fontSize: '1.05rem', marginBottom: '0.4rem' }}>
                  {opt.title}
                </h4>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.5, margin: 0, color: 'var(--color-text-muted)' }}>
                  {opt.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 5: Resumen y Emisión de Ticket */}
      {currentStep === 5 && submittedApplicant && (
        <div className="animate-fade-in" style={{ textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#ecfdf5',
            border: '2px solid #059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
            color: '#059669'
          }}>
            <CheckCircle2 size={36} />
          </div>

          <h2 style={{ color: 'var(--color-umsa-blue-dark)', fontSize: '1.75rem', marginBottom: '0.5rem' }}>
            ¡Postulación Registrada Exitosamente!
          </h2>

          <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            Su expediente digital ha sido ingresado al sistema de admisiones de Posgrado en Estadística (FCPN - UMSA). Se le ha asignado el siguiente código de seguimiento:
          </p>

          {/* Ticket Card Printable */}
          <div className="glass-card" style={{
            maxWidth: '650px',
            margin: '0 auto 2rem auto',
            padding: '2rem',
            textAlign: 'left',
            background: '#ffffff',
            border: '2px dashed var(--color-accent-orange)',
            boxShadow: 'var(--shadow-md)',
            position: 'relative'
          }}>
            {/* Ticket Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-accent-orange)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  COMPROBANTE OFICIAL DE POSTULACIÓN ACADÉMICA
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-umsa-blue-dark)' }}>
                  Universidad Mayor de San Andrés • FCPN
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Carrera de Estadística — Unidad de Posgrado
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Código Único:</div>
                <div style={{
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-family-mono)',
                  color: 'var(--color-accent-orange)',
                  background: 'var(--color-accent-orange-subtle)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-accent-orange-border)'
                }}>
                  {submittedApplicant.ticketCode}
                </div>
              </div>
            </div>

            {/* Ticket Data Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ color: 'var(--color-text-subtle)', display: 'block' }}>Postulante:</span>
                <strong style={{ color: 'var(--color-text-main)' }}>{submittedApplicant.fullName}</strong>
              </div>

              <div>
                <span style={{ color: 'var(--color-text-subtle)', display: 'block' }}>C.I. / Expedición:</span>
                <strong style={{ color: 'var(--color-text-main)' }}>{submittedApplicant.ci} {submittedApplicant.ciExp}</strong>
              </div>

              <div>
                <span style={{ color: 'var(--color-text-subtle)', display: 'block' }}>Programa Solicitado:</span>
                <strong style={{ color: 'var(--color-text-main)' }}>{submittedApplicant.programTitle}</strong>
              </div>

              <div>
                <span style={{ color: 'var(--color-text-subtle)', display: 'block' }}>Modalidad Financiera:</span>
                <strong style={{ color: 'var(--color-text-main)' }}>{submittedApplicant.paymentOption}</strong>
              </div>

              <div>
                <span style={{ color: 'var(--color-text-subtle)', display: 'block' }}>Fecha de Registro:</span>
                <strong style={{ color: 'var(--color-text-main)' }}>{new Date(submittedApplicant.applicationDate).toLocaleString('es-ES')}</strong>
              </div>

              <div>
                <span style={{ color: 'var(--color-text-subtle)', display: 'block' }}>Estado Inicial:</span>
                <span className="badge badge-blue">{submittedApplicant.status}</span>
              </div>
            </div>

            {/* Security note */}
            <div style={{
              background: '#f8fafc',
              padding: '0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              color: 'var(--color-text-muted)',
              border: '1px solid #e2e8f0'
            }}>
              Nota: Guarde este comprobante digital. Podrá consultar la evolución de su expediente ingresando su C.I. ({submittedApplicant.ci}) o su Código ({submittedApplicant.ticketCode}) en la pestaña de <strong>Consulta de Resultados</strong>.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => printOrDownloadOfficialCertificate(submittedApplicant)}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Download size={16} />
              <span>Descargar / Imprimir Boleta Oficial (PDF)</span>
            </button>

            <button
              onClick={() => onFinished(submittedApplicant.ci)}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <span>Ir a Consulta de Resultados</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Navigation Buttons for Steps 1-4 */}
      {currentStep < 5 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #e2e8f0'
        }}>
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <ArrowLeft size={16} />
              <span>Paso Anterior</span>
            </button>
          ) : <div />}

          <button
            type="button"
            onClick={nextStep}
            className="btn btn-primary btn-lg"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span>{currentStep === 4 ? 'Confirmar y Enviar Postulación' : 'Siguiente Paso'}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};
