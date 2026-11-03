import React, { useState, useEffect } from 'react';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw,
  X, 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';
import { programaService } from '../../services/programaService';
import { docenteService } from '../../services/docenteService';
import './ProgramEditorFixed.css';

export const ProgramEditorFixed = ({ initialProgramId = null, onSaved, onCancel }) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Generador de identificadores sugeridos
  const uid = (prefix) => `${prefix}-${Math.floor(100 + Math.random() * 900)}`;

  // Modo de selección de Malla
  const [mallaMode, setMallaMode] = useState('new');
  const [savedMallas, setSavedMallas] = useState([]);

  // Materias existentes en la Base de Datos para reutilización
  const [dbMaterias, setDbMaterias] = useState([]);
  const [selectedDbMatId, setSelectedDbMatId] = useState('');
  const [diplomaDbMatSelect, setDiplomaDbMatSelect] = useState('');

  // 1. Datos del Programa
  const [program, setProgram] = useState({
    id: uid('PG-EST'),
    name: '',
    description: '',
    kind: 'Diplomado', // 'Diplomado' | 'Maestría'
    type: 'Terminal',  // 'Terminal' | 'Autosostenible'
  });

  // 2. Plan de Estudios (Por defecto NO tiene ningún módulo ni materia)
  const [malla, setMalla] = useState({
    id: `MALLA-${uid('PG-EST')}`,
    name: 'Plan de Estudios 2026',
    modules: [],  // Por defecto VACÍO
    subjects: [], // Por defecto VACÍO
  });

  // 3. Edición, Convocatoria y Horarios
  const [edition, setEdition] = useState({
    id: `ED-2026-${uid('PG')}`,
    start: new Date().toISOString().split('T')[0],
    end: new Date(Date.now() + 180 * 24 * 3600 * 1000).toISOString().split('T')[0],
    duration: '6 meses',
    schedule: 'Lunes a Viernes 19:00 - 22:00',
    description: 'Edición oficial del programa de posgrado con modalidad semipresencial.',
    degree: 'Aprobación de módulos y presentación de trabajo final o monografía.',
    requirements: 'Título en Provisión Nacional a nivel Licenciatura, Carnet de Identidad y CV documentado.',
    call: 'https://drive.google.com/drive/folders/posgrado_estadistica_2026',
    form: 'https://docs.google.com/forms/d/e/postulacion_posgrado_2026/viewform',
    callLink: 'https://drive.google.com/file/d/convocatoria_oficial_2026.pdf',
    banner: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop',
    poster: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop',
    publicidad: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop',
    perfilPro: 'Profesional capacitado en el tratamiento riguroso de información cuantitativa y toma de decisiones.',
    profesiones: 'Estadística, Informática, Economía, Ingeniería de Sistemas, Ciencias Exactas y ramas afines.',
    competenciasMaestria: 'Modelación estadística, análisis predictivo, formulación de proyectos y publicación científica.',
    state: 'En Proceso',
  });

  // 4. Plantel Docente
  const [availableTeachers, setAvailableTeachers] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [teacherDrafts, setTeacherDrafts] = useState([]);

  // Sub-formulario para agregar materia dentro de un módulo (Totalmente inline)
  const [activeModuleForSubject, setActiveModuleForSubject] = useState(null);
  const [inlineSubjectDraft, setInlineSubjectDraft] = useState({
    id: uid('MAT'),
    name: '',
    description: '',
    credits: 4,
    hours: 64,
  });

  // Cargar materias de la BD y docentes existentes al iniciar
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);

        // 1. Cargar materias existentes de la Base de Datos para reutilización
        const materiasList = await programaService.getMaterias().catch(() => []);
        setDbMaterias(Array.isArray(materiasList) ? materiasList : []);

        // 2. Cargar docentes del sistema
        const docs = await docenteService.getPublicDocentes().catch(() => []);
        if (Array.isArray(docs) && docs.length > 0) {
          setAvailableTeachers(docs);
        } else {
          setAvailableTeachers([
            { id: 'DOC-01', id_doc: 'DOC-01', nombre_completo: 'Dr. Roberto Gutiérrez', especialidad: 'Estadística Matemática' },
            { id: 'DOC-02', id_doc: 'DOC-02', nombre_completo: 'MSc. Elena Mendoza', especialidad: 'Ciencia de Datos y Machine Learning' },
            { id: 'DOC-03', id_doc: 'DOC-03', nombre_completo: 'Dr. Carlos Paredes', especialidad: 'Bioestadística y Modelado' },
          ]);
        }

        // 3. Cargar datos si es edición de programa existente
        if (initialProgramId) {
          const wizardData = await programaService.getWizardData(initialProgramId);
          if (wizardData) {
            if (wizardData.program) setProgram(wizardData.program);
            if (wizardData.malla) setMalla(wizardData.malla);
            if (wizardData.mallas) setSavedMallas(wizardData.mallas);
            if (wizardData.edition) setEdition(wizardData.edition);
            if (wizardData.selectedTeachers) setSelectedTeachers(wizardData.selectedTeachers);
          }
        }
      } catch (err) {
        console.error('Error inicializando editor:', err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [initialProgramId]);

  // Cambio de modalidad (Diplomado vs Maestría) sin cargar módulos ficticios
  const handleKindChange = (newKind) => {
    setProgram((prev) => ({
      ...prev,
      kind: newKind,
      type: newKind === 'Maestría' ? (prev.type || 'Terminal') : 'Terminal',
    }));

    if (newKind === 'Diplomado') {
      setEdition((prev) => ({
        ...prev,
        duration: '6 meses',
        degree: 'Aprobación de módulos y presentación de monografía / tesina final.',
      }));
    } else {
      setEdition((prev) => ({
        ...prev,
        duration: '18 meses',
        degree: 'Tesis de Maestría y publicación de artículo científico en revista indexada.',
      }));
    }
  };

  // Reutilizar materia existente de la BD en Diplomado
  const handleAddExistingMateriaToDiploma = () => {
    if (!diplomaDbMatSelect) return;
    const found = dbMaterias.find((m) => m.id === diplomaDbMatSelect);
    if (!found) return;

    setMalla((prev) => ({
      ...prev,
      subjects: [
        ...prev.subjects,
        {
          id: found.id,
          name: found.name,
          description: found.description || '',
          credits: found.credits || 4,
          hours: found.hours || 64,
        }
      ]
    }));
    setDiplomaDbMatSelect('');
  };

  // Crear materia personalizada desde cero en Diplomado
  const addDiplomaSubject = () => {
    setMalla((prev) => ({
      ...prev,
      subjects: [
        ...prev.subjects,
        { id: uid('MAT'), name: '', description: '', credits: 4, hours: 64 }
      ]
    }));
  };

  const updateDiplomaSubject = (index, field, value) => {
    setMalla((prev) => {
      const copy = [...prev.subjects];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, subjects: copy };
    });
  };

  const removeDiplomaSubject = (index) => {
    setMalla((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index)
    }));
  };

  // Crear un nuevo módulo en Maestría (comienza sin materias)
  const addMasterModule = () => {
    const nextNum = malla.modules.length + 1;
    setMalla((prev) => ({
      ...prev,
      modules: [
        ...prev.modules,
        { id: uid('MOD'), name: `Módulo ${nextNum}: `, subjects: [] }
      ]
    }));
  };

  const updateMasterModule = (modIdx, field, value) => {
    setMalla((prev) => {
      const copy = [...prev.modules];
      copy[modIdx] = { ...copy[modIdx], [field]: value };
      return { ...prev, modules: copy };
    });
  };

  const removeMasterModule = (modIdx) => {
    setMalla((prev) => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== modIdx)
    }));
  };

  // Abrir formulario inline para agregar materia a un módulo
  const openInlineSubject = (modIdx) => {
    setActiveModuleForSubject(modIdx);
    setSelectedDbMatId('');
    setInlineSubjectDraft({
      id: uid('MAT'),
      name: '',
      description: '',
      credits: 4,
      hours: 64,
    });
  };

  // Seleccionar materia existente desde la barra desplegable para autocompletar
  const handlePickDbMateriaForModule = (matId) => {
    setSelectedDbMatId(matId);
    if (!matId || matId === '__NEW__') {
      setInlineSubjectDraft({
        id: uid('MAT'),
        name: '',
        description: '',
        credits: 4,
        hours: 64,
      });
      return;
    }

    const found = dbMaterias.find((m) => m.id === matId);
    if (found) {
      setInlineSubjectDraft({
        id: found.id,
        name: found.name,
        description: found.description || '',
        credits: found.credits || 4,
        hours: found.hours || 64,
      });
    }
  };

  // Guardar materia en el módulo
  const saveInlineSubject = () => {
    const matName = inlineSubjectDraft.name.trim() || 'Nueva Materia';
    setMalla((prev) => {
      const copy = [...prev.modules];
      copy[activeModuleForSubject].subjects = [
        ...copy[activeModuleForSubject].subjects,
        { ...inlineSubjectDraft, name: matName }
      ];
      return { ...prev, modules: copy };
    });
    setActiveModuleForSubject(null);
    setSelectedDbMatId('');
  };

  const removeSubjectFromModule = (modIdx, subjIdx) => {
    setMalla((prev) => {
      const copy = [...prev.modules];
      copy[modIdx].subjects = copy[modIdx].subjects.filter((_, i) => i !== subjIdx);
      return { ...prev, modules: copy };
    });
  };

  // Manejo de docentes
  const toggleTeacher = (id) => {
    setSelectedTeachers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const addTeacherDraft = () => {
    setTeacherDrafts((prev) => [
      ...prev,
      { id: uid('DOC'), name: '', last: '', photo: '' }
    ]);
  };

  const updateTeacherDraft = (idx, field, val) => {
    setTeacherDrafts((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  const removeTeacherDraft = (idx) => {
    setTeacherDrafts((prev) => prev.filter((_, i) => i !== idx));
  };

  const commitTeacherDrafts = () => {
    const newItems = teacherDrafts.map((t) => ({
      id: t.id,
      id_doc: t.id,
      nombre: t.name || 'Docente',
      apellido: t.last || 'Posgrado',
      nombre_completo: `${t.name || 'Docente'} ${t.last || 'Posgrado'}`.trim(),
      foto_url: t.photo || '',
    }));

    setAvailableTeachers((prev) => [...prev, ...newItems]);
    setSelectedTeachers((prev) => [...prev, ...teacherDrafts.map((t) => t.id)]);
    setTeacherDrafts([]);
  };

  // Navegación libre entre pestañas
  const handleTabClick = (index) => {
    setStep(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    setStep((prev) => Math.min(4, prev + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setStep((prev) => Math.max(0, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reiniciar formulario
  const handleReset = () => {
    if (window.confirm('¿Deseas reiniciar los datos del formulario?')) {
      const newId = uid('PG-EST');
      setProgram({
        id: newId,
        name: '',
        description: '',
        kind: 'Diplomado',
        type: 'Terminal',
      });
      setMalla({
        id: `MALLA-${newId}`,
        name: 'Plan de Estudios 2026',
        modules: [],
        subjects: [],
      });
      setSelectedTeachers([]);
      setTeacherDrafts([]);
      setStep(0);
    }
  };

  // Guardado en Base de Datos
  const handleSaveToDatabase = async () => {
    try {
      setSaving(true);
      setErrorMessage('');
      setSuccessMessage('');

      const cleanProgram = {
        ...program,
        id: program.id.trim() || uid('PG-EST'),
        name: program.name.trim() || 'Nuevo Programa Académico',
        description: program.description.trim() || 'Programa oficial de posgrado de la UMSA.',
      };

      const cleanMalla = {
        ...malla,
        id: malla.id.trim() || `MALLA-${cleanProgram.id}`,
        name: malla.name.trim() || 'Plan de Estudios Académico',
      };

      const cleanEdition = {
        ...edition,
        id: edition.id.trim() || `ED-2026-${cleanProgram.id}`,
        duration: edition.duration.trim() || (cleanProgram.kind === 'Maestría' ? '18 meses' : '6 meses'),
        schedule: edition.schedule.trim() || 'Lunes a Viernes 19:00 - 22:00',
      };

      // Solo enviar docentes realmente seleccionados (evitar docentes ficticios no registrados en BD remota)
      const finalTeachers = selectedTeachers.filter(Boolean);

      const payload = {
        program: cleanProgram,
        malla: cleanMalla,
        edition: cleanEdition,
        teachers: teacherDrafts,
        selectedTeachers: finalTeachers,
      };

      console.log('[ProgramEditor] Enviando al servidor:', JSON.stringify(payload, null, 2));

      const result = await programaService.saveWizardProgram(payload);

      console.log('[ProgramEditor] Respuesta del servidor:', result);
      setSuccessMessage(`¡El programa "${cleanProgram.name}" se guardó exitosamente en el sistema académico!`);
      
      if (onSaved) {
        setTimeout(() => {
          onSaved(result);
        }, 1200);
      }
    } catch (err) {
      console.error('[ProgramEditor] Error guardando en la BD:', err);
      // Mostrar el mensaje real del servidor si está disponible
      const serverMsg = err?.message || err?.data?.error || err?.data?.message || null;
      const humanMsg = serverMsg
        ? `No se pudo guardar: ${serverMsg}`
        : 'No se pudo guardar la información. Por favor verifique su conexión e intente nuevamente.';
      setErrorMessage(humanMsg);
    } finally {
      setSaving(false);
    }
  };

  // Pestañas de navegación
  const tabs = [
    { title: 'Programa Académico', icon: GraduationCap, desc: 'Nombre y clasificación' },
    { title: 'Plan de Estudios', icon: BookOpen, desc: 'Módulos y materias' },
    { title: 'Convocatoria y Horarios', icon: Calendar, desc: 'Fechas y requisitos' },
    { title: 'Plantel Docente', icon: Users, desc: 'Profesores asignados' },
    { title: 'Confirmar y Guardar', icon: CheckCircle2, desc: 'Revisión final' },
  ];

  if (loading) {
    return (
      <div className="program-editor-fullscreen-wrapper" style={{ padding: '60px', textAlign: 'center' }}>
        <p style={{ color: 'var(--pe-primary)', fontWeight: 700 }}>Cargando datos del programa...</p>
      </div>
    );
  }

  // Cálculos de resumen
  const totalMaterias = program.kind === 'Diplomado' 
    ? malla.subjects.length 
    : malla.modules.reduce((acc, m) => acc + m.subjects.length, 0);

  const totalModulos = program.kind === 'Diplomado' 
    ? malla.subjects.length 
    : malla.modules.length;

  return (
    <div className="program-editor-fullscreen-wrapper">
      {/* ── CABECERA ADMINISTRATIVA LIMPIA (Sin banner gigante) ── */}
      <div className="pe-clean-header">
        <div className="pe-header-left">
          <div className="pe-breadcrumb">
            {onCancel && (
              <button className="pe-back-link" onClick={onCancel} title="Volver al catálogo de programas">
                <ArrowLeft size={13} /> Volver al listado
              </button>
            )}
            <span className="pe-crumb-sep">/</span>
            <span>Posgrado</span>
            <span className="pe-crumb-sep">&gt;</span>
            <span>Estadística</span>
            <span className="pe-crumb-sep">&gt;</span>
            <span className="pe-crumb-current">
              {initialProgramId ? 'Editar Programa' : 'Crear Nuevo Programa'}
            </span>
          </div>

          <h1 className="pe-title">
            {initialProgramId ? `Editar: ${program.name || program.id}` : 'Crear Nuevo Programa Académico'}
          </h1>
          <p className="pe-subtitle">
            Ingresa los datos generales, estructura curricular por módulos o materias, cronograma y plantel docente.
          </p>
        </div>

        <div className="pe-header-right-actions">
          <button
            className="pe-btn outline"
            onClick={handleSaveToDatabase}
            disabled={saving}
            title="Guardar borrador de trabajo"
          >
            <Save size={14} /> Guardar Borrador
          </button>
          {onCancel && (
            <button className="pe-btn outline-danger" onClick={onCancel} title="Cancelar y volver">
              <X size={14} /> Cancelar
            </button>
          )}
          <button className="pe-btn outline" onClick={handleReset} title="Restablecer formulario">
            <RotateCcw size={14} /> Reiniciar
          </button>
        </div>
      </div>

      {/* ── WIZARD DE PASOS DUAL Y RESPONSIVO ── */}
      {/* Móvil & Tablet (< 768px): Selector desplegable con % */}
      <div className="pe-mobile-step-selector">
        <div className="pe-mobile-step-header">
          <div>
            <span className="pe-mobile-step-badge">
              Paso {step + 1} de {tabs.length} ({Math.round(((step + 1) / tabs.length) * 100)}%)
            </span>
            <div className="pe-mobile-step-current-title">{tabs[step].title}</div>
          </div>
          <select
            className="pe-mobile-step-dropdown"
            value={step}
            onChange={(e) => handleTabClick(Number(e.target.value))}
            aria-label="Seleccionar paso del formulario"
          >
            {tabs.map((t, idx) => (
              <option key={idx} value={idx}>
                Paso {idx + 1}: {t.title} {idx < step ? '✓' : ''}
              </option>
            ))}
          </select>
        </div>
        <div className="pe-progress-track">
          <div
            className="pe-progress-bar"
            style={{ width: `${((step + 1) / tabs.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Escritorio (>= 768px): Barra horizontal compacta con indicador de progreso */}
      <div className="pe-desktop-steps">
        <div className="pe-progress-track">
          <div
            className="pe-progress-bar"
            style={{ width: `${((step + 1) / tabs.length) * 100}%` }}
          />
        </div>
        <div className="pe-steps">
          {tabs.map((tabItem, i) => {
            const Icon = tabItem.icon;
            const isCurrent = i === step;
            const isDone = i < step;

            return (
              <div
                key={i}
                className={`pe-step ${isCurrent ? 'current' : isDone ? 'done' : ''}`}
                onClick={() => handleTabClick(i)}
                role="button"
                tabIndex={0}
                title={`Ir a ${tabItem.title}`}
              >
                <strong>{isDone ? <Check size={13} /> : (i + 1)}</strong>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Icon size={14} />
                    <span>{tabItem.title}</span>
                  </div>
                  <div className="pe-step-desc">
                    {tabItem.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CONTENIDO ── */}
      <div className="pe-content">
        {successMessage && (
          <div className="pe-alert-success">
            <CheckCircle2 size={18} />
            <span>{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="pe-alert-error">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            PESTAÑA 01 · INFORMACIÓN GENERAL DEL PROGRAMA
           ══════════════════════════════════════════════════════════════════════ */}
        {step === 0 && (
          <div className="pe-panel">
            <span className="pe-eyebrow">PASO 1 DE 5</span>
            <h2>Datos Principales del Programa</h2>
            <p>Ingresa el nombre, clasificación y descripción de la propuesta académica.</p>

            <div className="pe-grid">
              <div className="pe-field">
                <label>Código o Identificador del Programa</label>
                <input
                  type="text"
                  value={program.id}
                  onChange={(e) => setProgram({ ...program, id: e.target.value })}
                  placeholder="Ej: PG-EST-001"
                />
              </div>

              <div className="pe-field">
                <label>Nombre Oficial del Programa</label>
                <input
                  type="text"
                  value={program.name}
                  onChange={(e) => setProgram({ ...program, name: e.target.value })}
                  placeholder="Ej: Maestría en Ciencia de Datos y Machine Learning"
                />
              </div>

              <div className="pe-field">
                <label>Nivel o Tipo de Programa</label>
                <select
                  value={program.kind}
                  onChange={(e) => handleKindChange(e.target.value)}
                >
                  <option value="Diplomado">Diplomado (Especialidad Modular)</option>
                  <option value="Maestría">Maestría (Grado Académico)</option>
                </select>
              </div>

              {program.kind === 'Maestría' ? (
                <div className="pe-field">
                  <label>Modalidad de Maestría</label>
                  <select
                    value={program.type}
                    onChange={(e) => setProgram({ ...program, type: e.target.value })}
                  >
                    <option value="Terminal">Terminal (con Tesis de Grado)</option>
                    <option value="Autosostenible">Autosostenible</option>
                  </select>
                </div>
              ) : (
                <div className="pe-field">
                  <label>Duración Estándar</label>
                  <input type="text" value="6 meses lectivos" disabled />
                </div>
              )}

              <div className="pe-field full">
                <label>Descripción General del Programa</label>
                <textarea
                  value={program.description}
                  onChange={(e) => setProgram({ ...program, description: e.target.value })}
                  placeholder="Describe los objetivos académicos, perfil de ingreso y valor formativo del posgrado..."
                />
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            PESTAÑA 02 · PLAN DE ESTUDIOS (REUTILIZACIÓN CON BARRA DESPLEGABLE)
           ══════════════════════════════════════════════════════════════════════ */}
        {step === 1 && (
          <div className="pe-panel">
            <span className="pe-eyebrow">PASO 2 DE 5</span>
            <h2>Plan de Estudios: {program.name || program.kind}</h2>
            <p>
              Agrega los módulos y materias. Puedes seleccionar materias existentes de la base de datos mediante la barra desplegable o crearlas desde cero.
            </p>

            {/* Alternar Malla */}
            <div className="pe-actions">
              <button
                className={`pe-btn ${mallaMode === 'new' ? '' : 'outline'}`}
                onClick={() => setMallaMode('new')}
              >
                + Diseñar nuevo plan de estudios
              </button>
              {savedMallas.length > 0 && (
                <button
                  className={`pe-btn ${mallaMode === 'existing' ? '' : 'outline'}`}
                  onClick={() => setMallaMode('existing')}
                >
                  Cargar plan existente ({savedMallas.length})
                </button>
              )}
            </div>

            {mallaMode === 'existing' ? (
              <div>
                <h3 style={{ fontSize: '14.5px', marginBottom: '10px' }}>Planes de estudio disponibles:</h3>
                {savedMallas.map((sm, i) => (
                  <div
                    key={i}
                    className={`pe-choice ${malla.id === sm.id ? 'selected' : ''}`}
                    onClick={() => setMalla(JSON.parse(JSON.stringify(sm)))}
                  >
                    <b>{sm.name}</b> <span className="pe-tag">{sm.id}</span>
                    <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#687b6f' }}>
                      {sm.modules?.length || 0} módulos registrados
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <div className="pe-grid">
                  <div className="pe-field">
                    <label>Código del Plan de Estudios</label>
                    <input
                      type="text"
                      value={malla.id}
                      onChange={(e) => setMalla({ ...malla, id: e.target.value })}
                    />
                  </div>
                  <div className="pe-field">
                    <label>Título del Plan de Estudios</label>
                    <input
                      type="text"
                      value={malla.name}
                      onChange={(e) => setMalla({ ...malla, name: e.target.value })}
                    />
                  </div>
                </div>

                <hr style={{ margin: '22px 0', border: 'none', borderTop: '1px solid #e4ede6' }} />

                {/* ── CASO A: DIPLOMADO ── */}
                {program.kind === 'Diplomado' ? (
                  <div>
                    {/* Barra desplegable para reutilizar materias de la BD */}
                    <div style={{ background: '#f0f7f2', padding: '16px 20px', borderRadius: '12px', border: '1.5px solid #c1dec7', marginBottom: '18px' }}>
                      <label style={{ color: 'var(--pe-primary)', fontWeight: 800, fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <BookOpen size={16} />
                        Reutilizar materia registrada en la base de datos (Barra desplegable):
                      </label>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <select
                          value={diplomaDbMatSelect}
                          onChange={(e) => setDiplomaDbMatSelect(e.target.value)}
                          style={{ flex: 1, minWidth: '280px', borderColor: '#267342' }}
                        >
                          <option value="">-- Seleccionar materia de la base de datos para reutilizar --</option>
                          {dbMaterias.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name} ({m.id}) · {m.credits} créditos · {m.hours} hrs
                            </option>
                          ))}
                        </select>
                        <button
                          className="pe-btn"
                          type="button"
                          onClick={handleAddExistingMateriaToDiploma}
                          disabled={!diplomaDbMatSelect}
                        >
                          + Reutilizar esta materia
                        </button>
                        <button
                          className="pe-btn outline"
                          type="button"
                          onClick={addDiplomaSubject}
                        >
                          + Crear materia desde cero
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <h3 style={{ fontSize: '15px', margin: 0, fontWeight: 800 }}>
                        Materias del Diplomado ({malla.subjects.length})
                      </h3>
                    </div>

                    {malla.subjects.length > 0 ? (
                      malla.subjects.map((sub, i) => (
                        <div key={i} className="pe-item">
                          <div className="pe-itemhead">
                            <b>Materia #{i + 1}: {sub.name || 'Sin título'}</b>
                            <button className="pe-btn danger" onClick={() => removeDiplomaSubject(i)}>
                              <Trash2 size={13} /> Quitar
                            </button>
                          </div>

                          <div className="pe-grid">
                            <div className="pe-field">
                              <label>Código Asignatura</label>
                              <input
                                type="text"
                                value={sub.id}
                                onChange={(e) => updateDiplomaSubject(i, 'id', e.target.value)}
                              />
                            </div>
                            <div className="pe-field">
                              <label>Nombre de la Materia</label>
                              <input
                                type="text"
                                value={sub.name}
                                onChange={(e) => updateDiplomaSubject(i, 'name', e.target.value)}
                                placeholder="Ej: Análisis Exploratorio y Minería de Datos"
                              />
                            </div>
                            <div className="pe-field">
                              <label>Créditos Académicos</label>
                              <input
                                type="number"
                                min="1"
                                value={sub.credits}
                                onChange={(e) => updateDiplomaSubject(i, 'credits', e.target.value)}
                              />
                            </div>
                            <div className="pe-field">
                              <label>Carga Horaria (Horas)</label>
                              <input
                                type="number"
                                min="1"
                                value={sub.hours}
                                onChange={(e) => updateDiplomaSubject(i, 'hours', e.target.value)}
                              />
                            </div>
                            <div className="pe-field full">
                              <label>Contenido Mínimo o Temario</label>
                              <textarea
                                value={sub.description}
                                onChange={(e) => updateDiplomaSubject(i, 'description', e.target.value)}
                                placeholder="Breve descripción del temario de la asignatura..."
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="pe-hint" style={{ textAlign: 'center', padding: '28px 20px', background: '#fafdfa', border: '1.5px dashed #c0dbca' }}>
                        <BookOpen size={28} style={{ color: 'var(--pe-primary)', marginBottom: '8px' }} />
                        <h4 style={{ margin: '4px 0 6px', color: '#163320', fontSize: '15px' }}>Plan de estudios sin materias iniciales</h4>
                        <p style={{ margin: 0, fontSize: '13px', color: '#687c6f' }}>
                          Selecciona una materia existente en la barra desplegable de arriba para reutilizarla, o haz clic en "+ Crear materia desde cero".
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* ── CASO B: MAESTRÍA (Módulos y Materias con Barra Desplegable) ── */
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '15px', margin: 0, fontWeight: 800 }}>
                        Módulos de la Maestría ({malla.modules.length})
                      </h3>
                      <button className="pe-btn" onClick={addMasterModule}>
                        <Plus size={15} /> + Crear Nuevo Módulo
                      </button>
                    </div>

                    {malla.modules.length > 0 ? (
                      malla.modules.map((mod, modIdx) => (
                        <div key={modIdx} className="pe-item" style={{ borderLeft: '4px solid var(--pe-primary)' }}>
                          <div className="pe-itemhead">
                            <b>Módulo {modIdx + 1}: {mod.name || 'Sin título'}</b>
                            <button className="pe-btn danger" onClick={() => removeMasterModule(modIdx)}>
                              <Trash2 size={13} /> Eliminar Módulo
                            </button>
                          </div>

                          <div className="pe-grid">
                            <div className="pe-field">
                              <label>Código del Módulo</label>
                              <input
                                type="text"
                                value={mod.id}
                                onChange={(e) => updateMasterModule(modIdx, 'id', e.target.value)}
                              />
                            </div>
                            <div className="pe-field">
                              <label>Nombre del Módulo</label>
                              <input
                                type="text"
                                value={mod.name}
                                onChange={(e) => updateMasterModule(modIdx, 'name', e.target.value)}
                                placeholder="Ej: Módulo I: Fundamentos y Computación Científica"
                              />
                            </div>
                          </div>

                          {/* Materias del módulo */}
                          <div style={{ marginTop: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                              <span style={{ fontSize: '13px', fontWeight: 750, color: '#324b38' }}>
                                Materias asignadas a este módulo ({mod.subjects.length}):
                              </span>
                              <button
                                className="pe-btn outline"
                                style={{ padding: '6px 14px', fontSize: '12px', minHeight: '32px' }}
                                onClick={() => openInlineSubject(modIdx)}
                              >
                                <Plus size={13} /> + Añadir Materia al Módulo
                              </button>
                            </div>

                            {mod.subjects.length > 0 ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {mod.subjects.map((sub, sIdx) => (
                                  <div
                                    key={sIdx}
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      background: '#ffffff',
                                      border: '1px solid #d8e5dc',
                                      borderRadius: '8px',
                                      padding: '10px 14px',
                                      fontSize: '13px',
                                    }}
                                  >
                                    <div>
                                      <b style={{ color: 'var(--pe-primary)' }}>{sub.name}</b>{' '}
                                      <span style={{ color: '#728578', fontSize: '12px' }}>({sub.id})</span> ·{' '}
                                      <span className="pe-tag">{sub.credits} créditos</span> ·{' '}
                                      <span style={{ color: '#4d6957', fontSize: '12px' }}>{sub.hours} hrs</span>
                                    </div>
                                    <button
                                      className="pe-btn danger"
                                      style={{ padding: '4px 10px', fontSize: '12px', minHeight: '28px' }}
                                      onClick={() => removeSubjectFromModule(modIdx, sIdx)}
                                      title="Quitar materia"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="pe-hint" style={{ margin: '6px 0' }}>
                                Este módulo aún no tiene materias asignadas. Haz clic en "+ Añadir Materia al Módulo" para reutilizar alguna de la base de datos o registrar una nueva.
                              </div>
                            )}

                            {/* Sub-formulario inline interactivo con Barra Desplegable */}
                            {activeModuleForSubject === modIdx && (
                              <div className="pe-inline-subform">
                                <div className="pe-inline-subform-header">
                                  <BookOpen size={16} />
                                  Añadir Materia al Módulo {modIdx + 1} ({mod.name})
                                </div>

                                {/* Barra Desplegable para reutilizar materias de la BD */}
                                <div className="pe-field full" style={{ background: '#f0f7f2', padding: '14px', borderRadius: '10px', border: '1.5px solid #c1dec7', marginBottom: '14px' }}>
                                  <label style={{ color: 'var(--pe-primary)', fontWeight: 800, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Sparkles size={14} /> Reutilizar materia de la base de datos (Barra desplegable):
                                  </label>
                                  <select
                                    value={selectedDbMatId}
                                    onChange={(e) => handlePickDbMateriaForModule(e.target.value)}
                                    style={{ borderColor: '#267342', fontWeight: 600, background: '#ffffff', marginTop: '4px' }}
                                  >
                                    <option value="">-- Elige una materia de la base de datos para autocompletar --</option>
                                    {dbMaterias.map((m) => (
                                      <option key={m.id} value={m.id}>
                                        {m.name} ({m.id}) · {m.credits} créditos · {m.hours} hrs
                                      </option>
                                    ))}
                                    <option value="__NEW__">✏️ Registrar una nueva materia personalizada...</option>
                                  </select>
                                  <span style={{ fontSize: '11.5px', color: '#4a6b54', marginTop: '4px', display: 'block' }}>
                                    Al elegir una materia existente, sus créditos, horas y descripción se cargarán automáticamente en los campos inferiores.
                                  </span>
                                </div>

                                <div className="pe-grid">
                                  <div className="pe-field">
                                    <label>Código de Materia</label>
                                    <input
                                      type="text"
                                      value={inlineSubjectDraft.id}
                                      onChange={(e) => setInlineSubjectDraft({ ...inlineSubjectDraft, id: e.target.value })}
                                    />
                                  </div>
                                  <div className="pe-field">
                                    <label>Nombre de la Asignatura</label>
                                    <input
                                      type="text"
                                      value={inlineSubjectDraft.name}
                                      onChange={(e) => setInlineSubjectDraft({ ...inlineSubjectDraft, name: e.target.value })}
                                      placeholder="Ej: Inferencia Bayesiana Aplicada"
                                    />
                                  </div>
                                  <div className="pe-field">
                                    <label>Créditos Académicos</label>
                                    <input
                                      type="number"
                                      min="1"
                                      value={inlineSubjectDraft.credits}
                                      onChange={(e) => setInlineSubjectDraft({ ...inlineSubjectDraft, credits: e.target.value })}
                                    />
                                  </div>
                                  <div className="pe-field">
                                    <label>Horas Académicas</label>
                                    <input
                                      type="number"
                                      min="1"
                                      value={inlineSubjectDraft.hours}
                                      onChange={(e) => setInlineSubjectDraft({ ...inlineSubjectDraft, hours: e.target.value })}
                                    />
                                  </div>
                                  <div className="pe-field full">
                                    <label>Descripción / Bibliografía básica</label>
                                    <textarea
                                      value={inlineSubjectDraft.description}
                                      onChange={(e) => setInlineSubjectDraft({ ...inlineSubjectDraft, description: e.target.value })}
                                      placeholder="Temario y objetivos de aprendizaje..."
                                    />
                                  </div>
                                </div>

                                <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                                  <button className="pe-btn" onClick={saveInlineSubject}>
                                    ✓ Guardar Materia en Módulo
                                  </button>
                                  <button className="pe-btn outline" onClick={() => setActiveModuleForSubject(null)}>
                                    Cancelar
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="pe-hint" style={{ textAlign: 'center', padding: '32px 20px', background: '#fafdfa', border: '1.5px dashed #c0dbca' }}>
                        <Layers size={30} style={{ color: 'var(--pe-primary)', marginBottom: '8px' }} />
                        <h4 style={{ margin: '4px 0 6px', color: '#163320', fontSize: '15px' }}>Plan de estudios sin módulos iniciales</h4>
                        <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#687c6f' }}>
                          No hay módulos precargados. Haz clic en el botón para crear el primer módulo y agregar materias (reutilizadas de la base de datos o nuevas).
                        </p>
                        <button className="pe-btn" onClick={addMasterModule}>
                          <Plus size={15} /> + Crear Primer Módulo
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            PESTAÑA 03 · CONVOCATORIA, FECHAS Y HORARIOS
           ══════════════════════════════════════════════════════════════════════ */}
        {step === 2 && (
          <div className="pe-panel">
            <span className="pe-eyebrow">PASO 3 DE 5</span>
            <h2>Convocatoria, Fechas y Modalidades</h2>
            <p>Configura las fechas de inicio, horarios, enlaces de postulación y recursos de difusión.</p>

            <div className="pe-grid">
              <div className="pe-field">
                <label>Identificador de la Convocatoria</label>
                <input
                  type="text"
                  value={edition.id}
                  onChange={(e) => setEdition({ ...edition, id: e.target.value })}
                  placeholder="Ej: ED-2026-01"
                />
              </div>

              <div className="pe-field">
                <label>Estado de la Convocatoria</label>
                <select
                  value={edition.state}
                  onChange={(e) => setEdition({ ...edition, state: e.target.value })}
                >
                  <option value="En Proceso">En Proceso / Planificada</option>
                  <option value="Abierta">Abierta (Inscripciones habilitadas)</option>
                  <option value="En Curso">En Curso (Clases iniciadas)</option>
                  <option value="Concluida">Concluida (Finalizada)</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>

              <div className="pe-field">
                <label>Fecha de Inicio de Clases</label>
                <input
                  type="date"
                  value={edition.start}
                  onChange={(e) => setEdition({ ...edition, start: e.target.value })}
                />
              </div>

              <div className="pe-field">
                <label>Fecha Estimada de Finalización</label>
                <input
                  type="date"
                  value={edition.end}
                  onChange={(e) => setEdition({ ...edition, end: e.target.value })}
                />
              </div>

              <div className="pe-field">
                <label>Duración del Programa</label>
                <input
                  type="text"
                  value={edition.duration}
                  onChange={(e) => setEdition({ ...edition, duration: e.target.value })}
                  placeholder="Ej: 18 meses (4 semestres)"
                />
              </div>

              <div className="pe-field">
                <label>Horarios y Días de Clases</label>
                <input
                  type="text"
                  value={edition.schedule}
                  onChange={(e) => setEdition({ ...edition, schedule: e.target.value })}
                  placeholder="Ej: Lunes a Jueves 19:00 - 22:00"
                />
              </div>

              <div className="pe-field full">
                <label>Modalidad de Titulación / Graduación</label>
                <textarea
                  value={edition.degree}
                  onChange={(e) => setEdition({ ...edition, degree: e.target.value })}
                  placeholder="Ej: Tesis de Maestría y artículo científico en revista indexada..."
                />
              </div>

              <div className="pe-field full">
                <label>Requisitos de Admisión para el Postulante</label>
                <textarea
                  value={edition.requirements}
                  onChange={(e) => setEdition({ ...edition, requirements: e.target.value })}
                  placeholder="Título en Provisión Nacional, Carnet de Identidad, CV documentado, fotos..."
                />
              </div>

              <div className="pe-field">
                <label>Carpeta Oficial en Google Drive (URL)</label>
                <input
                  type="text"
                  value={edition.call}
                  onChange={(e) => setEdition({ ...edition, call: e.target.value })}
                  placeholder="https://drive.google.com/..."
                />
              </div>

              <div className="pe-field">
                <label>Formulario de Preinscripción en Línea (URL)</label>
                <input
                  type="text"
                  value={edition.form}
                  onChange={(e) => setEdition({ ...edition, form: e.target.value })}
                  placeholder="https://docs.google.com/forms/..."
                />
              </div>

              <div className="pe-field full">
                <label>Enlace Directo al PDF Oficial de Convocatoria</label>
                <input
                  type="text"
                  value={edition.callLink}
                  onChange={(e) => setEdition({ ...edition, callLink: e.target.value })}
                  placeholder="https://drive.google.com/file/d/convocatoria.pdf"
                />
              </div>

              <div className="pe-field">
                <label>Imagen de Portada / Banner (URL)</label>
                <input
                  type="text"
                  value={edition.banner}
                  onChange={(e) => setEdition({ ...edition, banner: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="pe-field">
                <label>Afiche Oficial o Póster (URL)</label>
                <input
                  type="text"
                  value={edition.poster}
                  onChange={(e) => setEdition({ ...edition, poster: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="pe-field full">
                <label>Perfil Profesional de Egreso</label>
                <textarea
                  value={edition.perfilPro}
                  onChange={(e) => setEdition({ ...edition, perfilPro: e.target.value })}
                  placeholder="Habilidades cuantitativas y competencias del profesional egresado..."
                />
              </div>

              <div className="pe-field full">
                <label>Profesiones de Destino / Dirigido a</label>
                <textarea
                  value={edition.profesiones}
                  onChange={(e) => setEdition({ ...edition, profesiones: e.target.value })}
                  placeholder="Licenciados en Estadística, Informática, Economía, Ingeniería..."
                />
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            PESTAÑA 04 · PLANTEL DOCENTE
           ══════════════════════════════════════════════════════════════════════ */}
        {step === 3 && (
          <div className="pe-panel">
            <span className="pe-eyebrow">PASO 4 DE 5</span>
            <h2>Plantel Docente</h2>
            <p>
              Selecciona los profesores asignados a este programa o registra nuevos docentes.
            </p>

            <div className="pe-actions">
              <button className="pe-btn" onClick={addTeacherDraft}>
                <Plus size={15} /> + Registrar Nuevo Docente
              </button>
            </div>

            {/* Registro inline de nuevos profesores */}
            {teacherDrafts.length > 0 && (
              <div className="pe-inline-subform">
                <div className="pe-inline-subform-header">
                  <Users size={16} />
                  Docentes nuevos por registrar ({teacherDrafts.length})
                </div>

                {teacherDrafts.map((td, i) => (
                  <div key={i} className="pe-item" style={{ background: '#ffffff' }}>
                    <div className="pe-itemhead">
                      <b>Docente Nuevo #{i + 1}</b>
                      <button className="pe-btn danger" onClick={() => removeTeacherDraft(i)}>
                        ✕ Quitar
                      </button>
                    </div>

                    <div className="pe-grid">
                      <div className="pe-field">
                        <label>Código o Identificador</label>
                        <input
                          type="text"
                          value={td.id}
                          onChange={(e) => updateTeacherDraft(i, 'id', e.target.value)}
                        />
                      </div>
                      <div className="pe-field">
                        <label>Nombres</label>
                        <input
                          type="text"
                          value={td.name}
                          onChange={(e) => updateTeacherDraft(i, 'name', e.target.value)}
                          placeholder="Ej: Marcelo"
                        />
                      </div>
                      <div className="pe-field">
                        <label>Apellidos</label>
                        <input
                          type="text"
                          value={td.last}
                          onChange={(e) => updateTeacherDraft(i, 'last', e.target.value)}
                          placeholder="Ej: Ramos Gutiérrez"
                        />
                      </div>
                      <div className="pe-field">
                        <label>Foto de Perfil (URL opcional)</label>
                        <input
                          type="text"
                          value={td.photo}
                          onChange={(e) => updateTeacherDraft(i, 'photo', e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button className="pe-btn outline" onClick={commitTeacherDrafts}>
                  ✓ Finalizar e incorporar a la lista de docentes
                </button>
              </div>
            )}

            <h3 style={{ fontSize: '15px', marginTop: '20px', marginBottom: '10px' }}>
              Docentes disponibles ({availableTeachers.length}):
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
              {availableTeachers.map((t) => {
                const teacherId = t.id || t.id_doc;
                const isSelected = selectedTeachers.includes(teacherId);
                return (
                  <div
                    key={teacherId}
                    className={`pe-choice ${isSelected ? 'selected' : ''}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}
                    onClick={() => toggleTeacher(teacherId)}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <div>
                      <b style={{ display: 'block', fontSize: '13.5px' }}>
                        {t.nombre_completo || `${t.nombre || t.nombre_doc || ''} ${t.apellido || t.apellido_doc || ''}`}
                      </b>
                      <span className="pe-tag">{t.especialidad || 'Docente Investigador'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            PESTAÑA 05 · CONFIRMAR Y GUARDAR (RESUMEN NATURAL Y AMIGABLE SIN JSON)
           ══════════════════════════════════════════════════════════════════════ */}
        {step === 4 && (
          <div className="pe-panel">
            <span className="pe-eyebrow">PASO 5 DE 5</span>
            <h2>Confirmación y Guardado del Programa</h2>
            <p>Revisa la información consolidada antes de registrarla en el sistema oficial.</p>

            {/* Tarjetas de Resumen Naturales y Elegantes */}
            <div className="pe-summary-grid">
              <div className="pe-summary-card">
                <div className="pe-summary-card-title">
                  <GraduationCap size={15} /> Programa Académico
                </div>
                <div className="pe-summary-card-value">{program.name || 'Programa de Posgrado'}</div>
                <div className="pe-summary-card-sub">
                  Nivel: <b>{program.kind}</b> {program.kind === 'Maestría' ? `(${program.type})` : ''} · Código: {program.id}
                </div>
              </div>

              <div className="pe-summary-card">
                <div className="pe-summary-card-title">
                  <BookOpen size={15} /> Plan de Estudios
                </div>
                <div className="pe-summary-card-value">{totalMaterias} Materia(s) en {totalModulos} Módulo(s)</div>
                <div className="pe-summary-card-sub">
                  {malla.name} ({malla.id})
                </div>
              </div>

              <div className="pe-summary-card">
                <div className="pe-summary-card-title">
                  <Clock size={15} /> Duración y Horarios
                </div>
                <div className="pe-summary-card-value">{edition.duration || 'Duración regular'}</div>
                <div className="pe-summary-card-sub">
                  {edition.schedule} · Estado: <span className="pe-tag">{edition.state}</span>
                </div>
              </div>

              <div className="pe-summary-card">
                <div className="pe-summary-card-title">
                  <Users size={15} /> Plantel Docente
                </div>
                <div className="pe-summary-card-value">{selectedTeachers.length} Docente(s) Asignados</div>
                <div className="pe-summary-card-sub">
                  {availableTeachers
                    .filter((t) => selectedTeachers.includes(t.id || t.id_doc))
                    .map((t) => t.nombre_completo || `${t.nombre || t.nombre_doc} ${t.apellido || t.apellido_doc}`)
                    .join(', ') || 'Sin docentes asignados'}
                </div>
              </div>
            </div>

            {/* Botón principal de guardado */}
            <div className="pe-actions" style={{ marginTop: '24px' }}>
              <button
                className="pe-btn"
                style={{ fontSize: '14.5px', padding: '14px 28px' }}
                onClick={handleSaveToDatabase}
                disabled={saving}
              >
                <Save size={18} /> {saving ? 'Guardando en el Sistema...' : 'Guardar Programa Académico'}
              </button>

              {onCancel && (
                <button className="pe-btn outline" onClick={onCancel}>
                  Volver al Catálogo
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── FOOTER DE NAVEGACIÓN ENTRE PESTAÑAS (Escritorio) ── */}
        <div className="pe-footer">
          <button
            className="pe-btn outline"
            onClick={handleBack}
            style={{ visibility: step === 0 ? 'hidden' : 'visible' }}
          >
            <ArrowLeft size={15} /> Anterior
          </button>

          <span className="pe-footer-status">
            Paso {step + 1} de {tabs.length}: <strong>{tabs[step].title}</strong>
          </span>

          {step < 4 ? (
            <button className="pe-btn" onClick={handleNext}>
              Siguiente <ArrowRight size={15} />
            </button>
          ) : (
            <button
              className="pe-btn"
              onClick={handleSaveToDatabase}
              disabled={saving}
            >
              <CheckCircle2 size={16} /> {saving ? 'Guardando...' : 'Finalizar y Guardar'}
            </button>
          )}
        </div>
      </div>

      {/* ── BOTONES FLOTANTES EN MÓVIL (< 768px) ── */}
      <div className="pe-mobile-floating-bar">
        <button
          className="pe-btn outline"
          onClick={handleBack}
          disabled={step === 0}
          style={{ opacity: step === 0 ? 0.35 : 1 }}
        >
          <ArrowLeft size={14} /> Anterior
        </button>
        <span className="pe-floating-status">
          Paso {step + 1}/{tabs.length}
        </span>
        {step < 4 ? (
          <button className="pe-btn" onClick={handleNext}>
            Siguiente <ArrowRight size={14} />
          </button>
        ) : (
          <button className="pe-btn" onClick={handleSaveToDatabase} disabled={saving}>
            <Save size={14} /> {saving ? 'Guardando...' : 'Guardar'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProgramEditorFixed;
