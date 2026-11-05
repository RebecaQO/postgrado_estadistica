import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import UsuariosPanel from './panels/UsuariosPanel';
import DefensasPanel from './panels/DefensasPanel';
import CarreraPanel from './panels/CarreraPanel';
import AdminSectionHeader from './AdminSectionHeader';
import {
  programaService,
  adminService,
  docenteService,
  convocatoriaService,
  defensaService,
  institucionService,
} from '../../services';
import { 
  GraduationCap, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Search, 
  Eye, 
  Check, 
  X, 
  Settings, 
  Layers, 
  Plus, 
  Edit2, 
  Trash2, 
  UserCheck, 
  UserX, 
  Shield, 
  BookOpen, 
  Activity, 
  Calendar, 
  Award, 
  Clock, 
  Save, 
  RefreshCw, 
  FolderPlus, 
  BookMarked, 
  ExternalLink, 
  FileDown, 
  Percent, 
  Archive,
  Landmark,
  Building,
  MapPin,
  Mail,
  Globe,
  PhoneCall,
  Menu,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Info
} from 'lucide-react';
import { ProgramEditorFixed } from './ProgramEditorFixed';
import '../../styles/admin-portal.css';

export const AdminPortal = ({ onExitAdmin }) => {
  const { currentUser } = useAuth();

  // Sidebar sections reuse the existing screens; maestrias/diplomados are catalog filters.
  const [activeTab, setActiveTab] = useState('dashboard');

  // Sidebar responsivo & buscador global
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [programStatusFilter, setProgramStatusFilter] = useState('todos');
  const [expandedProgramId, setExpandedProgramId] = useState(null);

  // Data states
  const [programCatalog, setProgramCatalog] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [convocatoriasPasadas, setConvocatoriasPasadas] = useState([]);
  const [defensasTesis, setDefensasTesis] = useState([]);
  const [carreraInfo, setCarreraInfo] = useState({
    direccion: 'Campus Universitario Cota Cota, Calle 27, Edificio FCPN - Carrera de Estadística, La Paz - Bolivia',
    email_principal: 'estapost@fcpn.edu.bo',
    campus_virtual_url: 'https://maestria.estadistica.fcpn.edu.bo',
    ieta_descripcion: 'Instituto de Estadística Teórica y Aplicada (IETA): Centro de investigación cuantitativa avanzada y consultoría estadística aplicada para el desarrollo nacional.',
    club_cientifico_descripcion: 'Club Científico de Estadística: Comunidad estudiantil y académica de investigación formativa, semilleros y proyectos de ciencia de datos.',
    telefono: '+591 (2) 279-2999',
    whatsapp: '+591 76543210',
    horario_atencion: 'Lunes a Viernes 08:30 - 18:30',
    director_nombre: 'Dirección de la Carrera de Estadística y Posgrado'
  });
  const [isSavingCarreraInfo, setIsSavingCarreraInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('todos');

  // Modulos & Materias state
  const [selectedProgramForCurriculum, setSelectedProgramForCurriculum] = useState('');
  const [curriculumMallas, setCurriculumMallas] = useState([]);
  const [selectedMallaForCurriculum, setSelectedMallaForCurriculum] = useState('');
  const [isLoadingMallas, setIsLoadingMallas] = useState(false);
  const [programModules, setProgramModules] = useState([]);
  const [programMallaSubjects, setProgramMallaSubjects] = useState([]);
  const [isLoadingModules, setIsLoadingModules] = useState(false);
  const [curriculumError, setCurriculumError] = useState('');
  const [curriculumSearch, setCurriculumSearch] = useState('');
  const [subjectStatusFilter, setSubjectStatusFilter] = useState('todos');

  // Catálogo Integral de Materias & Ediciones
  const [catalogMaterias, setCatalogMaterias] = useState([]);
  const [allEdiciones, setAllEdiciones] = useState([]);
  const [materiasSubView, setMateriasSubView] = useState('catalogo'); // 'catalogo' | 'malla'
  const [materiaSearch, setMateriaSearch] = useState('');
  const [materiaProgramFilter, setMateriaProgramFilter] = useState('todos');
  const [materiaStatusFilter, setMateriaStatusFilter] = useState('todos');
  const [inlineCreateMateriaOpen, setInlineCreateMateriaOpen] = useState(false);
  const [inlineEditMateriaId, setInlineEditMateriaId] = useState(null);
  const [expandedMateriaId, setExpandedMateriaId] = useState(null);
  const [newMateriaForm, setNewMateriaForm] = useState({
    nombre_mat: '',
    descripcion: '',
    tipo: 'Maestria',
  });
  const [editMateriaForm, setEditMateriaForm] = useState({
    nombre_mat: '',
    descripcion: '',
  });
  const [materiaFieldErrors, setMateriaFieldErrors] = useState({});

  // Asignaciones de Docentes
  const [managingDocenteAssignment, setManagingDocenteAssignment] = useState(null);
  const [selectedEdicionToAssign, setSelectedEdicionToAssign] = useState('');
  const [expandedDocenteId, setExpandedDocenteId] = useState(null);
  const [docenteProgramFilter, setDocenteProgramFilter] = useState('todos');

  // Defensas de Tesis Modal CRUD
  const [defensaModalOpen, setDefensaModalOpen] = useState(false);
  const [editingDefensa, setEditingDefensa] = useState(null);
  const [defensaForm, setDefensaForm] = useState({
    id: '',
    titulo: '',
    postulante: '',
    programa: '',
    modalidad: 'Tesis',
    tutor: '',
    tribunal: '',
    fecha: '',
    hora: '16:00',
    lugar: 'Auditorio de Posgrado FCPN - Campus Cota Cota Calle 27',
    estado: 'Programada',
    nota: '',
    enlace_acta: ''
  });

  // Program Fixed In-Page Editor (Misma ventana, interactivo sin modales)
  const [fixedEditorOpen, setFixedEditorOpen] = useState(false);
  const [selectedProgramForEditor, setSelectedProgramForEditor] = useState(null);

  // Program Modal CRUD
  const [programModalOpen, setProgramModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [programForm, setProgramForm] = useState({
    id: '',
    title: '',
    description: '',
    area: 'Ciencias Exactas',
    credits: 60,
    tipo_programa: 'Autofinanciada',
    mencion: '',
    status: 'Activo',
    resolution: 'CU-RES-2026-001',
    resolucion_hcu: 'Resolución HCU N° 284/2024 - Aprobación Plena UMSA',
    cupo_total: 25,
    enlace_convocatoria_drive: 'https://drive.google.com/drive/folders/1umsa_posgrado_estadistica_2026_convocatoria',
    enlace_pdf_programa: 'https://drive.google.com/file/d/1_desc_programa_estadistica_fcpn_2026/view',
    enlace_formulario_inscripcion: 'https://docs.google.com/forms/d/e/1FAIpQLSd_posgrado_estadistica_umsa_postulacion_2026/viewform',
    descuento_contado_porcentaje: 10,
    numero_cuotas: 18,
    monto_cuota: 850,
    perfil_aspirante: '',
    perfil_egreso: '',
    requisitos_admision: '',
    modalidad_titulacion: ''
  });

  // Convocatoria Pasada Modal CRUD
  const [convocatoriaModalOpen, setConvocatoriaModalOpen] = useState(false);
  const [convocatoriaForm, setConvocatoriaForm] = useState({
    id: '',
    gestion: 'Gestión 2025',
    titulo: '',
    programa: '',
    nivel: 'Maestría',
    resolucion_hcu: 'Resolución HCU N° 284/2024',
    enlace_drive: 'https://drive.google.com',
    enlace_pdf: 'https://drive.google.com',
    descripcion: '',
    id_programa: '',
    id_edicion: ''
  });

  // Modulo Modal
  const [moduloModalOpen, setModuloModalOpen] = useState(false);
  const [moduloForm, setModuloForm] = useState({ nombre_mod: '' });

  // Materia Modal
  const [materiaModalOpen, setMateriaModalOpen] = useState(false);
  const [targetModuloId, setTargetModuloId] = useState('');
  const [materiaForm, setMateriaForm] = useState({
    nombre_mat: '',
    creditos: 8,
    carga_horaria: 128,
    descripcion: '',
  });
  const [pendingMateriaAssignment, setPendingMateriaAssignment] = useState(null);

  // User Form
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', tipo: 'Estudiante', rol: 'ROL-004', password: '' });

  // Docente form limited to the currently persisted API fields.
  const [docenteModalOpen, setDocenteModalOpen] = useState(false);
  const [editingDocente, setEditingDocente] = useState(null);
  const [docenteSearch, setDocenteSearch] = useState('');
  const [docenteStatusFilter, setDocenteStatusFilter] = useState('todos');
  const [docenteForm, setDocenteForm] = useState({
    nombre_doc: '',
    apellido_doc: '',
    foto: '',
  });

  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const showNotification = (msg, type = 'success') => {
    setFeedbackMessage({ text: msg, type });
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [progData, userData, roleData, docData, convData, infoData, defensasData, materiasData, edicionesData] = await Promise.all([
        programaService.adminGetAll(),
        adminService.getUsuarios(),
        adminService.getRoles(),
        docenteService.getAdminDocentes(),
        convocatoriaService.getConvocatoriasPasadas(),
        institucionService.getInfo(),
        defensaService.getDefensasTesis(),
        programaService.getMaterias().catch(() => []),
        programaService.getAllEdiciones().catch(() => []),
      ]);

      const rawProgItems = Array.isArray(progData)
        ? progData
        : (Array.isArray(progData?.items) ? progData.items : (Array.isArray(progData?.data) ? progData.data : []));

      const items = normalizeProgramas(rawProgItems);

      setProgramCatalog(items);
      if (items.length > 0 && !selectedProgramForCurriculum) {
        setSelectedProgramForCurriculum(items[0].id);
      }

      setUsuarios(Array.isArray(userData) ? userData : []);
      setRoles(Array.isArray(roleData) ? roleData : []);
      setDocentes(Array.isArray(docData) ? docData.map((docente) => ({
        ...docente,
        id: docente.id_doc || docente.id,
        nombre_completo: docente.nombre_completo || `${docente.nombre_doc || ''} ${docente.apellido_doc || ''}`.trim(),
        foto_url: docente.foto || docente.foto_url || '',
      })) : []);
      setConvocatoriasPasadas(Array.isArray(convData) ? convData : []);
      if (infoData && !infoData.error) setCarreraInfo(infoData);
      setDefensasTesis(Array.isArray(defensasData) ? defensasData : []);
      setCatalogMaterias(Array.isArray(materiasData) ? materiasData : (materiasData?.data || []));
      setAllEdiciones(Array.isArray(edicionesData) ? edicionesData : (edicionesData?.data || []));
    } catch (error) {
      console.error('Error cargando datos de administración:', error);
      showNotification('Error al conectar con la base de datos', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const normalizeProgramas = (items) => items.map((programa) => {
    const tipoPrograma = programa.tipo_programa || programa.type || '';
    const esMaestria = tipoPrograma.toLowerCase().includes('maestr');
    return {
      ...programa,
      id: programa.id || programa.id_programa,
      id_programa: programa.id_programa || programa.id,
      title: programa.title || programa.nombre_programa || 'Sin título',
      nombre_programa: programa.nombre_programa || programa.title,
      description: programa.description || programa.descripcion || '',
      type: esMaestria ? 'Maestría' : 'Diplomado',
      tipo_programa: esMaestria ? 'Maestria' : 'Diplomado',
      typeFilter: programa.maestria?.tipo || programa.typeFilter || '',
      activo: programa.activo !== false,
      status: programa.activo === false ? 'Inactivo' : 'Activo',
      mencion: programa.mencion || '',
    };
  });

  const fetchProgramCatalog = async () => {
    setIsLoading(true);
    try {
      const response = await programaService.adminGetAll();
      const rawItems = Array.isArray(response)
        ? response
        : (Array.isArray(response?.items) ? response.items : []);
      const items = normalizeProgramas(rawItems);
      setProgramCatalog(items);
      return items;
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProgramCatalog = programCatalog
    .filter((programa) => {
      if (activeTab === 'maestrias' && programa.tipo_programa !== 'Maestria') return false;
      if (activeTab === 'diplomados' && programa.tipo_programa !== 'Diplomado') return false;
      if (programStatusFilter === 'activos' && !programa.activo) return false;
      if (programStatusFilter === 'inactivos' && programa.activo) return false;
      const query = globalSearch.trim().toLocaleLowerCase();
      if (!query) return true;
      return [programa.title, programa.id, programa.mencion, programa.area_conocimiento]
        .some((value) => String(value || '').toLocaleLowerCase().includes(query));
    })
    .sort((a, b) => Number(b.activo) - Number(a.activo) || Number(b.id) - Number(a.id));
  const featuredProgramIds = new Set(filteredProgramCatalog.filter((programa) => programa.activo).slice(0, 3).map((programa) => String(programa.id)));
  const matchesMateriaSearch = (relacion) => {
    const materia = relacion.materia || {};
    const activo = materia.activo !== false;
    const query = curriculumSearch.trim().toLocaleLowerCase();
    const matchesText = !query || [relacion.id_mat, materia.nombre_mat, materia.descripcion]
      .some((value) => String(value || '').toLocaleLowerCase().includes(query));
    return matchesText && (subjectStatusFilter === 'todos' || (subjectStatusFilter === 'activos' ? activo : !activo));
  };
  const filteredProgramModules = programModules
    .map((modulo) => ({ ...modulo, materias: (modulo.materias || []).filter(matchesMateriaSearch) }))
    .filter((modulo) => !curriculumSearch.trim() || modulo.nombre_mod?.toLocaleLowerCase().includes(curriculumSearch.trim().toLocaleLowerCase()) || modulo.materias.length > 0);
  const filteredProgramMallaSubjects = programMallaSubjects.filter(matchesMateriaSearch);
  const getMateriaPrograms = (materia) => {
    const progs = new Map();
    if (materia.materia_maestria?.modulos) {
      materia.materia_maestria.modulos.forEach((mod) => {
        const p = mod.malla?.programa;
        if (p) progs.set(String(p.id_programa || p.id), p.nombre_programa || p.title);
      });
    }
    if (materia.modulo_diplomado?.mallas) {
      materia.modulo_diplomado.mallas.forEach((mal) => {
        const p = mal.programa;
        if (p) progs.set(String(p.id_programa || p.id), p.nombre_programa || p.title);
      });
    }
    return Array.from(progs.entries()).map(([id, name]) => ({ id, name }));
  };

  const getMateriaDocentes = (materia) => {
    const docs = new Map();
    const checkEdiciones = (ediciones) => {
      if (!Array.isArray(ediciones)) return;
      ediciones.forEach((ed) => {
        if (Array.isArray(ed.docentes)) {
          ed.docentes.forEach((d) => {
            const nom = d.nombre_completo || `${d.nombre_doc || ''} ${d.apellido_doc || ''}`.trim();
            docs.set(String(d.id_doc || d.id), nom);
          });
        }
      });
    };
    if (materia.materia_maestria?.modulos) {
      materia.materia_maestria.modulos.forEach((mod) => {
        checkEdiciones(mod.malla?.programa?.ediciones);
      });
    }
    if (materia.modulo_diplomado?.mallas) {
      materia.modulo_diplomado.mallas.forEach((mal) => {
        checkEdiciones(mal.programa?.ediciones);
      });
    }
    return Array.from(docs.values());
  };

  const filteredCatalogMaterias = catalogMaterias
    .filter((mat) => {
      if (materiaStatusFilter === 'activos' && mat.activo === false) return false;
      if (materiaStatusFilter === 'inactivos' && mat.activo !== false) return false;
      if (materiaProgramFilter !== 'todos') {
        const progs = getMateriaPrograms(mat);
        if (!progs.some((p) => String(p.id) === String(materiaProgramFilter))) return false;
      }
      const query = materiaSearch.trim().toLocaleLowerCase();
      if (!query) return true;
      return [mat.id_mat, mat.nombre_mat, mat.descripcion]
        .some((val) => String(val || '').toLocaleLowerCase().includes(query));
    })
    .sort((a, b) => (Number(b.activo !== false) - Number(a.activo !== false)) || (Number(a.id_mat) - Number(b.id_mat)));

  const filteredDocentes = docentes.filter((docente) => {
    if (docenteStatusFilter === 'activos' && docente.activo === false) return false;
    if (docenteStatusFilter === 'inactivos' && docente.activo !== false) return false;
    if (docenteProgramFilter !== 'todos') {
      const isAssigned = Array.isArray(docente.ediciones) && docente.ediciones.some((ed) =>
        String(ed.id_programa || ed.programa?.id_programa || ed.programa?.id) === String(docenteProgramFilter)
      );
      if (!isAssigned) return false;
    }
    const query = docenteSearch.trim().toLocaleLowerCase();
    if (!query) return true;
    return [docente.nombre_completo, docente.id, docente.nombre_doc, docente.apellido_doc]
      .some((value) => String(value || '').toLocaleLowerCase().includes(query));
  });

  const fetchCurriculumMallas = async (progId) => {
    setCurriculumError('');
    setProgramModules([]);
    setSelectedMallaForCurriculum('');
    if (!progId) {
      setCurriculumMallas([]);
      return;
    }
    setIsLoadingMallas(true);
    try {
      const mallas = await programaService.getMallas(progId);
      const items = Array.isArray(mallas) ? mallas : [];
      setCurriculumMallas(items);
      setSelectedMallaForCurriculum((currentId) =>
        items.some((malla) => String(malla.id_malla) === String(currentId))
          ? String(currentId)
          : String(items[0]?.id_malla || '')
      );
    } catch (err) {
      setCurriculumMallas([]);
      setCurriculumError(err.message || 'No se pudieron cargar las mallas del programa.');
    } finally {
      setIsLoadingMallas(false);
    }
  };

  // The modules endpoint takes a malla ID, not a program ID.
  const fetchCurriculumModules = async (mallaId) => {
    setCurriculumError('');
    setProgramMallaSubjects([]);
    if (!mallaId) {
      setProgramModules([]);
      return;
    }
    setIsLoadingModules(true);
    try {
      const selectedProgram = programCatalog.find(
        (programa) => String(programa.id) === String(selectedProgramForCurriculum)
      );
      if (selectedProgram?.tipo_programa === 'Diplomado') {
        const malla = await programaService.getMallaById(mallaId);
        setProgramModules([]);
        setProgramMallaSubjects(Array.isArray(malla?.materias_diplomado) ? malla.materias_diplomado : []);
        return;
      }
      const data = await programaService.getModulos(mallaId);
      setProgramModules(Array.isArray(data) ? data : []);
    } catch (err) {
      setProgramModules([]);
      setCurriculumError(err.message || 'Error al cargar los módulos de la malla.');
    } finally {
      setIsLoadingModules(false);
    }
  };

  useEffect(() => {
    fetchCurriculumMallas(selectedProgramForCurriculum);
  }, [selectedProgramForCurriculum]);

  useEffect(() => {
    fetchCurriculumModules(selectedMallaForCurriculum);
  }, [selectedMallaForCurriculum]);

  // PROGRAM CRUD HANDLERS (Editor de Pantalla Completa Ajustado a bd.sql)
  const handleOpenCreateProgram = () => {
    setSelectedProgramForEditor(null);
    setFixedEditorOpen(true);
  };

  const handleOpenEditProgram = (prog) => {
    setSelectedProgramForEditor(prog.id);
    setFixedEditorOpen(true);
  };

  const handleSaveProgram = async (e) => {
    e.preventDefault();
    try {
      if (editingProgram) {
        await programaService.update(editingProgram.id, programForm);
      } else {
        await programaService.create(programForm);
      }
      showNotification(editingProgram ? 'Programa actualizado correctamente' : 'Nuevo programa registrado con éxito');
      setProgramModalOpen(false);
      fetchAllData();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleDeleteProgram = async (progId) => {
    if (!window.confirm(`¿Está seguro de eliminar el programa "${progId}"? Esta acción no se puede deshacer.`)) return;
    try {
      await programaService.delete(progId);
      showNotification('Programa eliminado de la base de datos');
      setProgramCatalog((current) => current.filter((programa) => String(programa.id) !== String(progId)));
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleToggleProgramStatus = async (programId, currentStatus) => {
    const nextStatus = currentStatus === 'Activo' ? 'Inactivo' : 'Activo';
    try {
      await programaService.updateStatus(programId, nextStatus);
      showNotification(`Estado de ${programId} cambiado a ${nextStatus}`);
      setProgramCatalog((current) => current.map((programa) => String(programa.id) === String(programId)
        ? { ...programa, activo: nextStatus === 'Activo', status: nextStatus }
        : programa));
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleConcluirPrograma = async (progId, progTitle) => {
    if (!window.confirm(`¿Desea dar por concluida la edición de "${progTitle}" y mandarla al repositorio histórico de Convocatorias Pasadas?`)) return;
    try {
      const data = await programaService.concluir(progId);
      showNotification(`Edición concluida: ${data.message || 'Archivada en Convocatorias Pasadas'}`);
      fetchAllData();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // MODULO CRUD
  const handleCreateModulo = async (e) => {
    e.preventDefault();
    if (!selectedMallaForCurriculum || !moduloForm.nombre_mod.trim()) return;
    try {
      await programaService.createModulo({
        id_malla: Number(selectedMallaForCurriculum),
        nombre_mod: moduloForm.nombre_mod
      });
      showNotification(`Módulo "${moduloForm.nombre_mod}" creado con éxito`);
      setModuloModalOpen(false);
      setModuloForm({ nombre_mod: '' });
      fetchCurriculumModules(selectedMallaForCurriculum);
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleDeleteModulo = async (idMod) => {
    if (!window.confirm('¿Eliminar este módulo vacío? Los módulos con materias asociadas no se pueden eliminar.')) return;
    try {
      await programaService.deleteModulo(idMod);
      showNotification('Módulo eliminado correctamente.');
      fetchCurriculumModules(selectedMallaForCurriculum);
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // MATERIA CRUD
  const handleOpenCreateMateria = (idMod) => {
    setTargetModuloId(idMod);
    setPendingMateriaAssignment(null);
    setMateriaForm({
      nombre_mat: '',
      creditos: 8,
      carga_horaria: 128,
      descripcion: '',
    });
    setMateriaModalOpen(true);
  };

  const handleSaveMateria = async (e) => {
    e.preventDefault();
    const programaSeleccionado = programCatalog.find(
      (programa) => String(programa.id) === String(selectedProgramForCurriculum)
    );
    const tipoPrograma = pendingMateriaAssignment?.tipoPrograma || programaSeleccionado?.tipo_programa;
    const mallaId = pendingMateriaAssignment?.mallaId || selectedMallaForCurriculum;
    const moduloId = pendingMateriaAssignment?.moduloId || targetModuloId;
    const esDiplomado = tipoPrograma === 'Diplomado';
    if (!tipoPrograma || (!esDiplomado && !moduloId) || !mallaId) {
      showNotification('Selecciona un programa, malla y destino curricular válidos antes de guardar la materia.', 'error');
      return;
    }
    let materia = pendingMateriaAssignment?.materia;
    if (!materia) {
      try {
        materia = await programaService.createMateria({
          nombre_mat: materiaForm.nombre_mat.trim(),
          descripcion: materiaForm.descripcion.trim(),
          tipo: tipoPrograma,
        });
      } catch (err) {
        showNotification(`No se pudo crear la materia: ${err.message}`, 'error');
        return;
      }
    }

    try {
      const payloadAsignacion = {
        id_mat: Number(materia.id_mat),
        creditos: Number(materiaForm.creditos),
        carga_horaria: Number(materiaForm.carga_horaria),
      };
      if (esDiplomado) {
        await programaService.assignMateriaToMalla(mallaId, payloadAsignacion);
      } else {
        await programaService.assignMateriaToModulo(moduloId, payloadAsignacion);
      }
      setPendingMateriaAssignment(null);
      showNotification(`Materia "${materiaForm.nombre_mat}" creada y asignada exitosamente`);
      setMateriaModalOpen(false);
      fetchCurriculumModules(selectedMallaForCurriculum);
    } catch (err) {
      setPendingMateriaAssignment({
        materia,
        moduloId,
        mallaId,
        tipoPrograma,
      });
      showNotification(
        err.status === 409
          ? `La materia se creó, pero ya estaba asignada al plan. ${err.message}`
          : `La materia ${materia.id_mat} sí se creó, pero no se pudo asignar al plan: ${err.message}`,
        'warning'
      );
      fetchCurriculumModules(selectedMallaForCurriculum);
    }
  };

  const handleToggleMateriaStatus = async (idMat, activo) => {
    if (activo && !window.confirm('¿Desactivar esta materia? Se conservarán el registro y sus relaciones históricas.')) return;
    try {
      await programaService.updateMateriaStatus(idMat, !activo);
      showNotification(`Materia ${activo ? 'desactivada' : 'reactivada'} correctamente.`);
      fetchCurriculumModules(selectedMallaForCurriculum);
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // USER CRUD HANDLERS
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await adminService.createUsuario(newUser);
      showNotification('Usuario creado exitosamente');
      setUserModalOpen(false);
      setNewUser({ email: '', tipo: 'Estudiante', rol: 'ROL-004', password: '' });
      fetchAllData();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'Activo' ? 'Inactivo' : 'Activo';
    try {
      await adminService.updateUsuarioEstado(userId, nextStatus);
      showNotification(`Usuario ${userId} marcado como ${nextStatus}`);
      fetchAllData();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm(`¿Eliminar usuario ${userId}?`)) return;
    try {
      await adminService.deleteUsuario(userId);
      showNotification('Usuario eliminado correctamente');
      fetchAllData();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // DOCENTE HANDLERS (API-supported fields)
  const handleOpenCreateDocente = () => {
    setEditingDocente(null);
    setDocenteForm({
      nombre_doc: '',
      apellido_doc: '',
      foto: '',
    });
    setDocenteModalOpen(true);
  };

  const handleOpenEditDocente = (doc) => {
    setEditingDocente(doc);
    setDocenteForm({
      nombre_doc: doc.nombre_doc || doc.nombre || '',
      apellido_doc: doc.apellido_doc || doc.apellido || '',
      foto: doc.foto || doc.foto_url || '',
    });
    setDocenteModalOpen(true);
  };

  const handleSaveDocente = async (e) => {
    e.preventDefault();
    const payload = {
      nombre_doc: docenteForm.nombre_doc.trim(),
      apellido_doc: docenteForm.apellido_doc.trim(),
      foto: docenteForm.foto.trim() || null,
    };
    try {
      let savedDocente;
      if (editingDocente) {
        savedDocente = await docenteService.update(editingDocente.id, payload);
      } else {
        savedDocente = await docenteService.create(payload);
      }
      showNotification(editingDocente ? 'Docente actualizado correctamente' : 'Docente registrado con éxito');
      setDocenteModalOpen(false);
      const normalized = {
        ...savedDocente,
        id: savedDocente.id_doc || savedDocente.id || editingDocente?.id,
        nombre_completo: savedDocente.nombre_completo || `${savedDocente.nombre_doc || payload.nombre_doc} ${savedDocente.apellido_doc || payload.apellido_doc}`.trim(),
        foto_url: savedDocente.foto || savedDocente.foto_url || payload.foto || '',
      };
      setDocentes((current) => editingDocente
        ? current.map((docente) => String(docente.id) === String(normalized.id) ? { ...docente, ...normalized } : docente)
        : [normalized, ...current]);
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleToggleDocenteStatus = async (docente) => {
    const activo = docente.activo !== false;
    try {
      const updatedDocente = await docenteService.updateStatus(docente.id, !activo);
      showNotification(`Docente ${activo ? 'desactivado' : 'reactivado'} correctamente.`);
      setDocentes((current) => current.map((item) => String(item.id) === String(docente.id)
        ? { ...item, ...(updatedDocente || {}), activo: !activo }
        : item));
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleDeleteDocente = async (docId, docNombre) => {
    if (!window.confirm(`¿Eliminar al docente ${docNombre}? Solo puede eliminarse si no está asignado a ediciones.`)) return;
    try {
      await docenteService.delete(docId);
      showNotification('Docente eliminado de la base de datos');
      setDocentes((current) => current.filter((docente) => String(docente.id) !== String(docId)));
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const reloadCatalogMaterias = async () => {
    try {
      const res = await programaService.getMaterias();
      setCatalogMaterias(Array.isArray(res) ? res : (res?.data || []));
    } catch (e) {
      console.error('Error recargando materias:', e);
    }
  };

  const handleCreateCatalogMateria = async (e) => {
    e.preventDefault();
    setMateriaFieldErrors({});
    try {
      await programaService.createMateria(newMateriaForm);
      showNotification('Materia creada correctamente en la base de datos');
      setInlineCreateMateriaOpen(false);
      setNewMateriaForm({ nombre_mat: '', descripcion: '', tipo: 'Maestria' });
      await reloadCatalogMaterias();
    } catch (err) {
      if (err.status === 422 && err.data?.errors) {
        setMateriaFieldErrors(err.data.errors);
      } else {
        showNotification(err.message || 'Error al crear materia', 'error');
      }
    }
  };

  const handleStartInlineEditMateria = (materia) => {
    setInlineEditMateriaId(materia.id_mat);
    setEditMateriaForm({
      nombre_mat: materia.nombre_mat || '',
      descripcion: materia.descripcion || '',
    });
  };

  const handleSaveInlineEditMateria = async (idMat) => {
    try {
      await programaService.updateMateria(idMat, editMateriaForm);
      showNotification('Materia actualizada correctamente');
      setInlineEditMateriaId(null);
      await reloadCatalogMaterias();
    } catch (err) {
      showNotification(err.message || 'Error al actualizar materia', 'error');
    }
  };

  const handleToggleCatalogMateriaStatus = async (idMat, currentActivo) => {
    try {
      await programaService.updateMateriaStatus(idMat, !currentActivo);
      showNotification(`Materia ${currentActivo ? 'desactivada' : 'reactivada'} correctamente`);
      setCatalogMaterias((prev) => prev.map((m) => m.id_mat === idMat ? { ...m, activo: !currentActivo } : m));
    } catch (err) {
      showNotification(err.message || 'Error al cambiar estado de la materia', 'error');
    }
  };

  const handleAssignDocenteToEdicion = async (docId, idEdicion) => {
    if (!idEdicion) return;
    try {
      await docenteService.assignToEdicion(idEdicion, docId);
      showNotification('Docente asignado a la edición exitosamente');
      const [newDocs, newEdics] = await Promise.all([
        docenteService.getAdminDocentes(),
        programaService.getAllEdiciones().catch(() => []),
      ]);
      setDocentes(Array.isArray(newDocs) ? newDocs.map((docente) => ({
        ...docente,
        id: docente.id_doc || docente.id,
        nombre_completo: docente.nombre_completo || `${docente.nombre_doc || ''} ${docente.apellido_doc || ''}`.trim(),
        foto_url: docente.foto || docente.foto_url || '',
      })) : []);
      setAllEdiciones(Array.isArray(newEdics) ? newEdics : (newEdics?.data || []));
      setSelectedEdicionToAssign('');
    } catch (err) {
      showNotification(err.message || 'Error al asignar docente a la edición', 'error');
    }
  };

  const handleRemoveDocenteFromEdicion = async (docId, idEdicion) => {
    if (!window.confirm('¿Seguro que deseas retirar a este docente de la edición seleccionada?')) return;
    try {
      await docenteService.removeFromEdicion(idEdicion, docId);
      showNotification('Docente retirado de la edición');
      const [newDocs, newEdics] = await Promise.all([
        docenteService.getAdminDocentes(),
        programaService.getAllEdiciones().catch(() => []),
      ]);
      setDocentes(Array.isArray(newDocs) ? newDocs.map((docente) => ({
        ...docente,
        id: docente.id_doc || docente.id,
        nombre_completo: docente.nombre_completo || `${docente.nombre_doc || ''} ${docente.apellido_doc || ''}`.trim(),
        foto_url: docente.foto || docente.foto_url || '',
      })) : []);
      setAllEdiciones(Array.isArray(newEdics) ? newEdics : (newEdics?.data || []));
    } catch (err) {
      showNotification(err.message || 'Error al retirar docente de la edición', 'error');
    }
  };

  // CONVOCATORIAS PASADAS HANDLERS
  const handleOpenCreateConvocatoria = () => {
    setConvocatoriaForm({
      id: `CONV-${Date.now().toString().slice(-4)}`,
      gestion: 'Gestión 2025',
      titulo: '',
      programa: '',
      nivel: 'Maestría',
      resolucion_hcu: 'Resolución HCU N° 284/2024',
      enlace_drive: 'https://drive.google.com',
      enlace_pdf: 'https://drive.google.com',
      descripcion: '',
      id_programa: '',
      id_edicion: ''
    });
    setConvocatoriaModalOpen(true);
  };

  const handleSelectProgramForConvocatoria = (progId) => {
    const p = programCatalog.find(item => item.id === progId);
    if (!p) return;
    setConvocatoriaForm({
      ...convocatoriaForm,
      id: `CONV-${new Date().getFullYear()}-${p.id.replace('PG-', '')}`,
      gestion: `Gestión ${new Date().getFullYear()}`,
      titulo: `Convocatoria Pública - ${p.title}`,
      programa: p.title,
      nivel: p.type || 'Maestría',
      resolucion_hcu: p.resolucion_hcu || p.resolution || 'Resolución HCU Aprobada',
      enlace_drive: p.enlace_convocatoria_drive || 'https://drive.google.com',
      enlace_pdf: p.enlace_pdf_programa || 'https://drive.google.com',
      descripcion: p.description || '',
      id_programa: p.id
    });
  };

  const handleSyncConvocatorias = async () => {
    try {
      const data = await convocatoriaService.sincronizarEdiciones();
      showNotification(data.message || 'Ediciones concluidas sincronizadas');
      fetchAllData();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleSaveConvocatoria = async (e) => {
    e.preventDefault();
    try {
      await convocatoriaService.create(convocatoriaForm);
      showNotification('Convocatoria histórica guardada exitosamente');
      setConvocatoriaModalOpen(false);
      fetchAllData();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleDeleteConvocatoria = async (idConv, tit) => {
    if (!window.confirm(`¿Eliminar la convocatoria histórica "${tit}"?`)) return;
    try {
      await convocatoriaService.delete(idConv);
      showNotification('Convocatoria histórica eliminada');
      fetchAllData();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // DEFENSAS DE TESIS HANDLERS
  const handleOpenCreateDefensa = () => {
    setEditingDefensa(null);
    setDefensaForm({
      id: `TIT-${Math.floor(100 + Math.random() * 900)}`,
      titulo: '',
      postulante: '',
      programa: programCatalog.length > 0 ? programCatalog[0].title : '',
      modalidad: 'Tesis de Grado',
      tutor: '',
      tribunal: '',
      fecha: new Date().toISOString().split('T')[0],
      hora: '16:00',
      lugar: 'Auditorio de Posgrado FCPN - Campus Cota Cota Calle 27',
      estado: 'Programada',
      nota: '',
      enlace_acta: ''
    });
    setDefensaModalOpen(true);
  };

  const handleOpenEditDefensa = (def) => {
    setEditingDefensa(def);
    setDefensaForm({
      id: def.id,
      titulo: def.titulo || '',
      postulante: def.postulante || '',
      programa: def.programa || '',
      modalidad: def.modalidad || 'Tesis de Grado',
      tutor: def.tutor || '',
      tribunal: def.tribunal || '',
      fecha: def.fecha || '',
      hora: def.hora || '16:00',
      lugar: def.lugar || 'Auditorio de Posgrado FCPN - Campus Cota Cota Calle 27',
      estado: def.estado || 'Programada',
      nota: def.nota ?? '',
      enlace_acta: def.enlace_acta || ''
    });
    setDefensaModalOpen(true);
  };

  const handleSaveDefensa = async (e) => {
    e.preventDefault();
    try {
      await defensaService.save(defensaForm);
      showNotification(editingDefensa ? 'Defensa de tesis actualizada' : 'Nueva defensa de tesis registrada con éxito');
      setDefensaModalOpen(false);
      fetchAllData();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleDeleteDefensa = async (idTit, tit) => {
    if (!window.confirm(`¿Eliminar la defensa de tesis "${tit}"?`)) return;
    try {
      await defensaService.delete(idTit);
      showNotification('Registro de defensa eliminado');
      fetchAllData();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // INFORMACIÓN DE CARRERA HANDLER
  const handleSaveCarreraInfo = async (e) => {
    e.preventDefault();
    setIsSavingCarreraInfo(true);
    try {
      await institucionService.updateInfo(carreraInfo);
      showNotification('Información de la carrera actualizada en la base de datos');
      fetchAllData();
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setIsSavingCarreraInfo(false);
    }
  };

  return (
    <>
    <div className="adm-shell">
      {/* ── TOPBAR 60px DE ADMINISTRACIÓN ── */}
      <header className="adm-topbar">
        {/* Toggle Hamburger / Collapse */}
        <button
          className="adm-topbar-toggle"
          onClick={() => {
            if (window.innerWidth <= 768) {
              setIsMobileSidebarOpen(!isMobileSidebarOpen);
            } else {
              setIsSidebarCollapsed(!isSidebarCollapsed);
            }
          }}
          title={isSidebarCollapsed ? "Expandir menú lateral" : "Colapsar menú lateral"}
          aria-label="Alternar menú de navegación"
        >
          <Menu size={20} />
        </button>

        {/* Logo Posgrado UMSA */}
        <div className="adm-topbar-logo">
          <div className="adm-topbar-logo-icon">EST</div>
          <div className="adm-topbar-logo-text">
            <strong>Posgrado Estadística</strong>
            <small>UMSA · FCPN · Administración</small>
          </div>
        </div>

        {/* ── SEPARADOR ── */}
        <div className="adm-topbar-divider" />

        {/* ── PERFIL DE USUARIO (LADO IZQUIERDO tras logo) ── */}
        <div className="adm-topbar-user-left">
          {/* Avatar/foto circular con iniciales */}
          <div className="adm-topbar-user-avatar" title="Administrador activo">
            {currentUser?.username ? currentUser.username.substring(0, 2).toUpperCase() : 'AD'}
          </div>
          <div className="adm-topbar-user-info">
            <span className="adm-topbar-user-name">
              {currentUser?.nombre || currentUser?.username || 'Administrador'}
            </span>
            <span className="adm-topbar-user-role">Administrador del Sistema</span>
          </div>

          {/* Botón de salir / volver al portal */}
          {onExitAdmin && (
            <button
              className="adm-exit-btn"
              onClick={onExitAdmin}
              title="Volver al portal público institucional"
            >
              <LogOut size={13} />
              <span>Salir</span>
            </button>
          )}
        </div>

        {/* Buscador global (Ctrl + K) — crece al centro */}
        <div className="adm-topbar-search">
          <Search size={15} className="adm-topbar-search-icon" />
          <input
            type="text"
            placeholder="Buscar programas por nombre, identificador o área..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
          />
        </div>

        {/* Acciones Derecha: Sincronizar y Notificaciones */}
        <div className="adm-topbar-right">
          <button
            className="adm-topbar-icon-btn"
            onClick={fetchAllData}
            title="Recargar y sincronizar datos con la base de datos"
          >
            <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
          </button>

          <button className="adm-topbar-icon-btn" title="Notificaciones del sistema">
            <Bell size={15} />
            <span className="adm-notif-dot"></span>
          </button>
        </div>
      </header>

      {/* ── TOAST NOTIFICACIÓN ── */}
      {feedbackMessage && (
        <div className={`adm-toast adm-toast-${feedbackMessage.type === 'error' ? 'error' : (feedbackMessage.type === 'warning' ? 'warning' : 'success')}`}>
          <CheckCircle2 size={18} />
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* ── CUERPO (SIDEBAR + MAIN CONTENIDO FLUIDO) ── */}
      <div className="adm-body">
        {/* SIDEBAR COLAPSABLE */}
        <aside className={`adm-sidebar ${isSidebarCollapsed ? 'collapsed' : ''} ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>
          <div className="adm-sidebar-section-label">Panel</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', padding: '0 6px' }}>
            <button onClick={() => { setActiveTab('dashboard'); setIsMobileSidebarOpen(false); }} className={`adm-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} title="Panel de administración">
              <span className="adm-nav-icon"><Activity size={18} /></span><span className="adm-nav-label">Resumen</span>
            </button>
          </div>

          <div className="adm-sidebar-section-label">Oferta académica</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', padding: '0 6px' }}>
            {[
              { id: 'programas', label: 'Todos los programas', icon: GraduationCap, count: programCatalog.length },
              { id: 'maestrias', label: 'Maestrías', icon: Award, count: programCatalog.filter((item) => item.tipo_programa === 'Maestria').length },
              { id: 'diplomados', label: 'Diplomados', icon: BookOpen, count: programCatalog.filter((item) => item.tipo_programa === 'Diplomado').length },
              { id: 'modulos', label: 'Materias y mallas', icon: BookMarked, count: catalogMaterias.length },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.id} onClick={() => { setActiveTab(item.id); setIsMobileSidebarOpen(false); }} className={`adm-nav-item ${activeTab === item.id ? 'active' : ''}`} title={item.label}>
                  <span className="adm-nav-icon"><Icon size={18} /></span><span className="adm-nav-label">{item.label}</span>
                  {item.count !== undefined && <span className="adm-badge">{item.count}</span>}
                </button>
              );
            })}
          </div>

          <div className="adm-sidebar-section-label">Administración</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', padding: '0 6px' }}>
            {[
              { id: 'docentes', label: 'Docentes', icon: Users, count: docentes.length },
              { id: 'usuarios', label: 'Usuarios', icon: UserCheck, count: usuarios.length },
              { id: 'roles', label: 'Roles y permisos', icon: Shield },
              { id: 'convocatorias', label: 'Convocatorias', icon: Archive, count: convocatoriasPasadas.length },
              { id: 'defensas', label: 'Defensas', icon: Award, count: defensasTesis.length },
              { id: 'carrera', label: 'Carrera e IETA', icon: Landmark },
              { id: 'metricas', label: 'Métricas', icon: TrendingUp },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.id} onClick={() => { setActiveTab(item.id); setIsMobileSidebarOpen(false); }} className={`adm-nav-item ${activeTab === item.id ? 'active' : ''}`} title={item.label}>
                  <span className="adm-nav-icon"><Icon size={18} /></span><span className="adm-nav-label">{item.label}</span>
                  {item.count !== undefined && <span className="adm-badge">{item.count}</span>}
                </button>
              );
            })}
          </div>

          {/* Botón inferior de colapso para escritorio */}
          <div style={{ marginTop: 'auto', padding: '12px 14px', borderTop: '1px solid var(--adm-border)' }}>
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="adm-nav-item"
              style={{ margin: 0, width: '100%', justifyContent: isSidebarCollapsed ? 'center' : 'flex-start' }}
              title={isSidebarCollapsed ? "Expandir barra lateral" : "Colapsar barra lateral"}
            >
              <span className="adm-nav-icon">
                {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </span>
              <span className="adm-nav-label">Colapsar menú</span>
            </button>
          </div>
        </aside>

        {/* OVERLAY PARA MÓVIL */}
        <div
          className={`adm-sidebar-overlay ${isMobileSidebarOpen ? 'visible' : ''}`}
          onClick={() => setIsMobileSidebarOpen(false)}
        />

        {/* ÁREA DE CONTENIDO FLUIDA A PANTALLA COMPLETA */}
        <main className="adm-main">
          <div className="adm-content">
            {activeTab === 'dashboard' && (
              <section className="animate-fade-in" aria-labelledby="admin-dashboard-title">
                <AdminSectionHeader
                  title="Panel de administración"
                  description="Resumen de registros disponibles en la API."
                  actions={<button className="adm-btn adm-btn-secondary" onClick={fetchAllData} disabled={isLoading}>
                    <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} /> Actualizar datos
                  </button>}
                />
                {isLoading ? <div className="adm-loading-state" role="status">Cargando resumen…</div> : (
                  <div className="adm-dashboard-grid">
                    {[
                      { label: 'Programas', value: programCatalog.length, tab: 'programas', icon: GraduationCap },
                      { label: 'Maestrías', value: programCatalog.filter((item) => item.tipo_programa === 'Maestria').length, tab: 'maestrias', icon: Award },
                      { label: 'Diplomados', value: programCatalog.filter((item) => item.tipo_programa === 'Diplomado').length, tab: 'diplomados', icon: BookOpen },
                      { label: 'Materias', value: catalogMaterias.length, tab: 'modulos', icon: BookMarked },
                      { label: 'Docentes', value: docentes.length, tab: 'docentes', icon: Users },
                      { label: 'Usuarios', value: usuarios.length, tab: 'usuarios', icon: UserCheck },
                    ].map((item) => {
                      const Icon = item.icon;
                      return <button key={item.tab} className="adm-dashboard-card" onClick={() => setActiveTab(item.tab)}>
                        <span className="adm-dashboard-card-icon"><Icon size={18} /></span>
                        <span className="adm-dashboard-card-label">{item.label}</span>
                        <strong className="adm-dashboard-card-value">{item.value}</strong>
                        <span className="adm-dashboard-card-link">Abrir módulo <ChevronRight size={14} /></span>
                      </button>;
                    })}
                  </div>
                )}
              </section>
            )}

            {activeTab === 'roles' && (
              <section className="animate-fade-in" aria-labelledby="roles-panel-title">
                <AdminSectionHeader title="Roles y permisos" description="Resumen del control de acceso que aplica actualmente la API." section="Administración · Accesos" />
                <div className="adm-role-grid">
                  <article className="adm-card">
                    <h2 className="adm-card-title"><Shield size={17} /> Administrador</h2>
                    <p>Puede gestionar los registros protegidos por el middleware de administrador.</p>
                    <span className="adm-status adm-status-active">Rol vigente</span>
                  </article>
                  <article className="adm-card">
                    <h2 className="adm-card-title"><UserCheck size={17} /> Usuario</h2>
                    <p>Rol válido para autenticación; las operaciones administrativas permanecen protegidas.</p>
                    <span className="adm-status adm-status-info">Rol vigente</span>
                  </article>
                </div>
                <p className="adm-access-note" role="note">La API solo admite los roles <strong>admin</strong> y <strong>usuario</strong>. La asignación de permisos granulares no está implementada como entidad independiente; este panel es informativo y no altera autorizaciones.</p>
              </section>
            )}

            {/* 1. SECCIÓN PROGRAMAS */}
            {['programas', 'maestrias', 'diplomados'].includes(activeTab) && (
              <div className="animate-fade-in">
                <>
                {fixedEditorOpen && (
                  <ProgramEditorFixed
                    initialProgramId={selectedProgramForEditor}
                    existingPrograms={programCatalog}
                    onSaved={async () => {
                      setFixedEditorOpen(false);
                      setSelectedProgramForEditor(null);
                      try {
                        await fetchProgramCatalog();
                        showNotification('¡Programa guardado y sincronizado correctamente con la base de datos!');
                      } catch (error) {
                        showNotification(`El programa se guardó, pero no se pudo actualizar el catálogo: ${error.message}`, 'error');
                      }
                    }}
                    onCancel={() => {
                      setFixedEditorOpen(false);
                      setSelectedProgramForEditor(null);
                    }}
                  />
                )}
                <div className={fixedEditorOpen ? 'adm-catalog-editor-open' : ''}>
                    <AdminSectionHeader
                      section="Administración · Oferta académica"
                      title={activeTab === 'maestrias' ? 'Maestrías' : activeTab === 'diplomados' ? 'Diplomados' : 'Programas académicos'}
                      description="Catálogo institucional con estado, clasificación y acceso a edición integrada."
                      actions={<button
                        onClick={handleOpenCreateProgram}
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                      >
                        <Plus size={16} />
                        <span>Nuevo Programa</span>
                      </button>}
                    />

                    <div className="adm-table-notice">
                      <Info size={14} aria-hidden="true" />
                      Los cursos habilitados se muestran primero. Los 3 primeros aparecen destacados.
                    </div>
                    <div className="adm-table-toolbar adm-program-toolbar">
                      <div className="adm-table-search">
                        <Search size={15} className="adm-table-search-icon" />
                        <input
                          type="search"
                          aria-label="Buscar programas"
                          placeholder="Buscar por nombre, identificador, mención o área..."
                          value={globalSearch}
                          onChange={(event) => setGlobalSearch(event.target.value)}
                        />
                      </div>
                      <select aria-label="Filtrar programas por estado" className="adm-filter-select" value={programStatusFilter} onChange={(event) => setProgramStatusFilter(event.target.value)}>
                        <option value="todos">Todos los estados</option>
                        <option value="activos">Activos</option>
                        <option value="inactivos">Inactivos</option>
                      </select>
                      <span className="adm-result-count">{filteredProgramCatalog.length} resultados</span>
                    </div>

                    {isLoading && <div className="adm-loading-state" role="status">Actualizando catálogo…</div>}

                    <div className="data-table-container">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Código / ID</th>
                            <th>Nombre del Programa</th>
                            <th>Tipo / Nivel</th>
                            <th>Mención / área</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProgramCatalog.map((prog) => {
                            const isActivo = prog.activo;
                            const isExpanded = String(expandedProgramId) === String(prog.id);
                            return (
                              <React.Fragment key={prog.id}>
                              <tr className={featuredProgramIds.has(String(prog.id)) ? 'adm-program-row-featured' : ''}>
                                <td style={{ fontWeight: 700, fontFamily: 'var(--font-family-mono)', color: 'var(--color-text-main)' }}>
                                  {prog.id}
                                </td>
                                <td>
                                  <button className="adm-program-title-button" onClick={() => setExpandedProgramId(isExpanded ? null : prog.id)} aria-expanded={isExpanded}>
                                    {prog.title}
                                    {featuredProgramIds.has(String(prog.id)) && <span className="adm-badge-featured">Prioritario</span>}
                                  </button>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                                    {prog.description || 'Sin descripción disponible'}
                                  </div>
                                </td>
                                <td>
                                  <span className={`badge ${prog.type === 'Maestría' ? 'badge-green-inst' : 'badge-blue'}`}>
                                    {prog.type}{prog.typeFilter ? ` · ${prog.typeFilter}` : ''}
                                  </span>
                                </td>
                                <td>{prog.mencion || prog.area_conocimiento || '—'}</td>
                                <td>
                                  <button
                                    onClick={() => handleToggleProgramStatus(prog.id, isActivo ? 'Activo' : 'Inactivo')}
                                    className={`badge ${isActivo ? 'badge-green' : 'badge-red'}`}
                                    style={{ cursor: 'pointer', border: 'none' }}
                                    title="Clic para alternar estado"
                                  >
                                    {isActivo ? '✓ Activo' : '✕ Inactivo'}
                                  </button>
                                </td>
                                <td>
                                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                                    <button
                                      onClick={() => handleOpenEditProgram(prog)}
                                      className="btn btn-secondary btn-sm"
                                      style={{ padding: '0.35rem 0.6rem', color: 'var(--color-blue-steel)' }}
                                      title="Editar programa"
                                    >
                                      <Edit2 size={14} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteProgram(prog.id)}
                                      className="btn btn-secondary btn-sm"
                                      style={{ padding: '0.35rem 0.6rem', color: 'var(--color-status-danger)' }}
                                      title="Eliminar programa"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                    <button onClick={() => setExpandedProgramId(isExpanded ? null : prog.id)} className="btn btn-secondary btn-sm" title={isExpanded ? 'Ocultar detalle' : 'Ver detalle'} aria-label={isExpanded ? 'Ocultar detalle' : 'Ver detalle'}>
                                      <Eye size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                              {isExpanded && (
                                <tr className="adm-program-detail-row">
                                  <td colSpan={6}>
                                    <div className="adm-program-detail-grid">
                                      <div><strong>Descripción</strong><p>{prog.description || 'No registrada'}</p></div>
                                      <div><strong>Área de conocimiento</strong><p>{prog.area_conocimiento || 'No registrada'}</p></div>
                                      <div><strong>Perfil aspirante</strong><p>{prog.perfil_aspirante || 'No registrado'}</p></div>
                                      <div><strong>Perfil de egreso</strong><p>{prog.perfil_egreso || 'No registrado'}</p></div>
                                      <div><strong>Mallas</strong><p>{Array.isArray(prog.mallas) ? prog.mallas.map((malla) => malla.nombre_malla).filter(Boolean).join(', ') || 'Sin mallas' : 'Sin mallas'}</p></div>
                                      <div><strong>Ediciones</strong><p>{Array.isArray(prog.ediciones) ? prog.ediciones.map((edicion) => edicion.nombre_edicion).filter(Boolean).join(', ') || 'Sin ediciones' : 'Sin ediciones'}</p></div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                              </React.Fragment>
                            );
                          })}
                          {filteredProgramCatalog.length === 0 && (
                            <tr><td colSpan={6} className="adm-empty-row">No hay programas que coincidan con los filtros.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                </div>
                </>
              </div>
            )}

            {/* SECCIÓN CONVOCATORIAS PASADAS / HISTÓRICAS */}
            {activeTab === 'convocatorias' && (
              <div className="animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', color: 'var(--color-text-main)', fontWeight: 800, margin: 0 }}>
                      Convocatorias Anteriores & Archivo Histórico
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
                      Registro y repositorio de convocatorias públicas pasadas, respaldadas en Google Drive y resoluciones HCU.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={handleSyncConvocatorias}
                      className="btn btn-secondary"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-green-inst)', borderColor: 'var(--color-green-inst)' }}
                      title="Sincronizar e importar automáticamente ediciones concluidas de programas"
                    >
                      <RefreshCw size={16} />
                      <span>Sincronizar Ediciones Concluidas</span>
                    </button>

                    <button
                      onClick={handleOpenCreateConvocatoria}
                      className="btn btn-primary"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      <Plus size={16} />
                      <span>Registrar Convocatoria Histórica</span>
                    </button>
                  </div>
                </div>

                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Gestión</th>
                        <th>Programa & Nivel</th>
                        <th>Título Oficial & Resumen</th>
                        <th>Aprobación HCU</th>
                        <th>Enlaces Oficiales</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {convocatoriasPasadas.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-text-muted)' }}>
                            No hay convocatorias históricas registradas en la base de datos.
                          </td>
                        </tr>
                      ) : (
                        convocatoriasPasadas.map((c) => (
                          <tr key={c.id}>
                            <td style={{ fontWeight: 800, color: 'var(--color-green-inst)', whiteSpace: 'nowrap' }}>
                              {c.gestion}
                            </td>
                            <td>
                              <div style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>{c.programa}</div>
                              <span className={`badge ${c.nivel === 'Maestría' ? 'badge-green-inst' : 'badge-blue'}`} style={{ fontSize: '0.7rem' }}>
                                {c.nivel}
                              </span>
                            </td>
                            <td>
                              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-main)' }}>{c.titulo}</div>
                              {c.descripcion && (
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', marginTop: '0.2rem' }}>
                                  {c.descripcion}
                                </div>
                              )}
                            </td>
                            <td>
                              <span className="badge badge-amber" style={{ fontSize: '0.72rem', whiteSpace: 'normal', display: 'inline-block' }}>
                                {c.resolucion_hcu || 'Resolución HCU Aprobada'}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                {c.enlace_drive && (
                                  <a
                                    href={c.enlace_drive}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--color-green-inst)', fontWeight: 600, textDecoration: 'none' }}
                                  >
                                    <ExternalLink size={12} />
                                    <span>Google Drive</span>
                                  </a>
                                )}
                                {c.enlace_pdf && (
                                  <a
                                    href={c.enlace_pdf}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--color-status-danger)', fontWeight: 600, textDecoration: 'none' }}
                                  >
                                    <FileDown size={12} />
                                    <span>PDF Oficial</span>
                                  </a>
                                )}
                              </div>
                            </td>
                            <td>
                              <button
                                onClick={() => handleDeleteConvocatoria(c.id, c.titulo)}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '0.35rem 0.6rem', color: 'var(--color-status-danger)' }}
                                title="Eliminar registro histórico"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 2. SECCIÓN MÓDULOS & MATERIAS (GESTIÓN INTEGRAL) */}
            {activeTab === 'modulos' && (
              <div className="animate-fade-in">
                <AdminSectionHeader
                  section="Administración · Oferta académica"
                  title="Gestión Integral de Materias"
                  description="Catálogo de asignaturas, relaciones curriculares con programas y docentes asignados."
                  actions={
                    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <div style={{ display: 'inline-flex', background: 'var(--adm-border)', padding: '2px', borderRadius: '6px' }}>
                        <button
                          type="button"
                          onClick={() => setMateriasSubView('catalogo')}
                          className={`btn btn-sm ${materiasSubView === 'catalogo' ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ border: 'none' }}
                        >
                          Catálogo General ({catalogMaterias.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setMateriasSubView('malla')}
                          className={`btn btn-sm ${materiasSubView === 'malla' ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ border: 'none' }}
                        >
                          Estructura por Malla
                        </button>
                      </div>
                      {materiasSubView === 'catalogo' ? (
                        <button
                          onClick={() => setInlineCreateMateriaOpen(!inlineCreateMateriaOpen)}
                          className="btn btn-primary"
                          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                          <Plus size={16} />
                          <span>{inlineCreateMateriaOpen ? 'Cerrar Formulario' : 'Nueva Materia'}</span>
                        </button>
                      ) : (
                        programCatalog.find((p) => String(p.id) === String(selectedProgramForCurriculum))?.tipo_programa === 'Diplomado' ? (
                          <button onClick={() => handleOpenCreateMateria('')} className="btn btn-primary" disabled={!selectedMallaForCurriculum} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Plus size={16} />
                            <span>Agregar a Malla</span>
                          </button>
                        ) : (
                          <button onClick={() => setModuloModalOpen(true)} className="btn btn-primary" disabled={!selectedMallaForCurriculum} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FolderPlus size={16} />
                            <span>Crear Módulo</span>
                          </button>
                        )
                      )}
                    </div>
                  }
                />

                {/* SUB-VIEW 1: CATÁLOGO GENERAL DE TODAS LAS MATERIAS */}
                {materiasSubView === 'catalogo' && (
                  <>
                    <div className="adm-table-notice">
                      <Info size={14} aria-hidden="true" />
                      Las materias activas se muestran primero. Puedes editar directamente el nombre y descripción en línea o consultar docentes y programas relacionados.
                    </div>

                    {/* Inline Form to create new subject */}
                    {inlineCreateMateriaOpen && (
                      <section className="glass-card" aria-labelledby="catalog-new-materia-title" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.25rem', background: '#ffffff', border: '1.5px solid var(--color-border)' }}>
                        <h4 id="catalog-new-materia-title" style={{ marginTop: 0, color: 'var(--color-text-main)' }}>
                          Nueva Materia para el Catálogo
                        </h4>
                        <form onSubmit={handleCreateCatalogMateria}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                            <div className="form-group">
                              <label className="form-label" htmlFor="new-cat-mat-name">Nombre de la materia *</label>
                              <input
                                id="new-cat-mat-name"
                                type="text"
                                required
                                maxLength={150}
                                value={newMateriaForm.nombre_mat}
                                onChange={(e) => setNewMateriaForm({ ...newMateriaForm, nombre_mat: e.target.value })}
                                className="form-input"
                                placeholder="Ej. Bioestadística Avanzada"
                              />
                              {materiaFieldErrors.nombre_mat && (
                                <span className="adm-field-error">{materiaFieldErrors.nombre_mat[0]}</span>
                              )}
                            </div>

                            <div className="form-group">
                              <label className="form-label" htmlFor="new-cat-mat-type">Tipo académico *</label>
                              <select
                                id="new-cat-mat-type"
                                value={newMateriaForm.tipo}
                                onChange={(e) => setNewMateriaForm({ ...newMateriaForm, tipo: e.target.value })}
                                className="form-select"
                              >
                                <option value="Maestria">Maestría (Asignatura modular)</option>
                                <option value="Diplomado">Diplomado (Módulo diplomado)</option>
                              </select>
                            </div>
                          </div>

                          <div className="form-group" style={{ marginTop: '0.75rem' }}>
                            <label className="form-label" htmlFor="new-cat-mat-desc">Descripción / Contenido sintético *</label>
                            <textarea
                              id="new-cat-mat-desc"
                              required
                              rows={3}
                              value={newMateriaForm.descripcion}
                              onChange={(e) => setNewMateriaForm({ ...newMateriaForm, descripcion: e.target.value })}
                              className="form-textarea"
                              placeholder="Breve sumario del contenido académico..."
                            />
                            {materiaFieldErrors.descripcion && (
                              <span className="adm-field-error">{materiaFieldErrors.descripcion[0]}</span>
                            )}
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                            <button
                              type="button"
                              onClick={() => { setInlineCreateMateriaOpen(false); setMateriaFieldErrors({}); }}
                              className="btn btn-secondary"
                            >
                              Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary">
                              Guardar Materia
                            </button>
                          </div>
                        </form>
                      </section>
                    )}

                    {/* Toolbar de búsqueda y filtros */}
                    <div className="adm-table-toolbar adm-program-toolbar">
                      <div className="adm-table-search">
                        <Search size={15} className="adm-table-search-icon" />
                        <input
                          type="search"
                          aria-label="Buscar materias"
                          placeholder="Buscar por nombre, código o descripción..."
                          value={materiaSearch}
                          onChange={(e) => setMateriaSearch(e.target.value)}
                        />
                      </div>

                      <select
                        aria-label="Filtrar materias por programa"
                        className="adm-filter-select"
                        value={materiaProgramFilter}
                        onChange={(e) => setMateriaProgramFilter(e.target.value)}
                      >
                        <option value="todos">Todos los programas</option>
                        {programCatalog.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.title}
                          </option>
                        ))}
                      </select>

                      <select
                        aria-label="Filtrar materias por estado"
                        className="adm-filter-select"
                        value={materiaStatusFilter}
                        onChange={(e) => setMateriaStatusFilter(e.target.value)}
                      >
                        <option value="todos">Todos los estados</option>
                        <option value="activos">Activas</option>
                        <option value="inactivos">Inactivas</option>
                      </select>

                      <span className="adm-result-count">{filteredCatalogMaterias.length} materias</span>
                    </div>

                    {/* Tabla Interactiva de Materias */}
                    <div className="data-table-container">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Código</th>
                            <th>Materia / Asignatura</th>
                            <th>Tipo</th>
                            <th>Programas relacionados</th>
                            <th>Docentes</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCatalogMaterias.map((mat) => {
                            const isActivo = mat.activo !== false;
                            const isExpanded = expandedMateriaId === mat.id_mat;
                            const isEditing = inlineEditMateriaId === mat.id_mat;
                            const relatedPrograms = getMateriaPrograms(mat);
                            const assignedDocentes = getMateriaDocentes(mat);
                            const tipoLabel = mat.materia_maestria ? 'Maestría' : (mat.modulo_diplomado ? 'Diplomado' : 'General');

                            return (
                              <React.Fragment key={mat.id_mat}>
                                <tr>
                                  <td style={{ fontWeight: 700, fontFamily: 'var(--font-family-mono)', color: 'var(--color-green-inst)' }}>
                                    #{mat.id_mat}
                                  </td>
                                  <td>
                                    {isEditing ? (
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                        <input
                                          type="text"
                                          className="form-input"
                                          value={editMateriaForm.nombre_mat}
                                          onChange={(e) => setEditMateriaForm({ ...editMateriaForm, nombre_mat: e.target.value })}
                                        />
                                        <textarea
                                          className="form-textarea"
                                          rows={2}
                                          value={editMateriaForm.descripcion}
                                          onChange={(e) => setEditMateriaForm({ ...editMateriaForm, descripcion: e.target.value })}
                                        />
                                        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem' }}>
                                          <button
                                            type="button"
                                            onClick={() => handleSaveInlineEditMateria(mat.id_mat)}
                                            className="btn btn-primary btn-sm"
                                          >
                                            Guardar
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => setInlineEditMateriaId(null)}
                                            className="btn btn-secondary btn-sm"
                                          >
                                            Cancelar
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div>
                                        <button
                                          type="button"
                                          className="adm-program-title-button"
                                          onClick={() => setExpandedMateriaId(isExpanded ? null : mat.id_mat)}
                                        >
                                          {mat.nombre_mat}
                                        </button>
                                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                                          {mat.descripcion ? (mat.descripcion.length > 80 ? `${mat.descripcion.slice(0, 80)}…` : mat.descripcion) : 'Sin descripción'}
                                        </div>
                                      </div>
                                    )}
                                  </td>
                                  <td>
                                    <span className={`badge ${tipoLabel === 'Maestría' ? 'badge-green-inst' : 'badge-blue'}`}>
                                      {tipoLabel}
                                    </span>
                                  </td>
                                  <td>
                                    {relatedPrograms.length === 0 ? (
                                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Sin programa vinculado</span>
                                    ) : (
                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                                        {relatedPrograms.map((p) => (
                                          <span
                                            key={p.id}
                                            style={{
                                              fontSize: '0.72rem',
                                              padding: '2px 6px',
                                              borderRadius: '4px',
                                              background: 'var(--adm-bg)',
                                              border: '1px solid var(--adm-border)',
                                              color: 'var(--adm-text)'
                                            }}
                                          >
                                            {p.name}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </td>
                                  <td>
                                    {assignedDocentes.length === 0 ? (
                                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>No asignado</span>
                                    ) : (
                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                                        {assignedDocentes.map((docName, idx) => (
                                          <span
                                            key={idx}
                                            style={{
                                              fontSize: '0.72rem',
                                              padding: '2px 6px',
                                              borderRadius: '4px',
                                              background: 'var(--adm-brand-light)',
                                              color: 'var(--adm-brand)',
                                              fontWeight: 600
                                            }}
                                          >
                                            {docName}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </td>
                                  <td>
                                    <button
                                      type="button"
                                      onClick={() => handleToggleCatalogMateriaStatus(mat.id_mat, isActivo)}
                                      className={`badge ${isActivo ? 'badge-green' : 'badge-red'}`}
                                      style={{ cursor: 'pointer', border: 'none' }}
                                      title="Clic para alternar estado"
                                    >
                                      {isActivo ? '✓ Activa' : '✕ Inactiva'}
                                    </button>
                                  </td>
                                  <td>
                                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                                      <button
                                        type="button"
                                        onClick={() => handleStartInlineEditMateria(mat)}
                                        className="btn btn-secondary btn-sm"
                                        title="Editar materia inline"
                                      >
                                        <Edit2 size={14} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setExpandedMateriaId(isExpanded ? null : mat.id_mat)}
                                        className="btn btn-secondary btn-sm"
                                        title={isExpanded ? 'Ocultar detalle' : 'Ver detalle'}
                                      >
                                        <Eye size={14} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>

                                {isExpanded && (
                                  <tr className="adm-program-detail-row">
                                    <td colSpan={7}>
                                      <div className="adm-program-detail-grid">
                                        <div>
                                          <strong>Descripción Completa</strong>
                                          <p>{mat.descripcion || 'Sin descripción disponible'}</p>
                                        </div>
                                        <div>
                                          <strong>Tipo en Plan de Estudios</strong>
                                          <p>{tipoLabel}</p>
                                        </div>
                                        <div>
                                          <strong>Programas y Mallas Vinculadas</strong>
                                          <p>{relatedPrograms.map((p) => p.name).join(', ') || 'Sin programas vinculados actualmente'}</p>
                                        </div>
                                        <div>
                                          <strong>Plantel Docente Asignado</strong>
                                          <p>{assignedDocentes.join(', ') || 'Sin docentes asignados a ediciones vinculadas'}</p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })}

                          {filteredCatalogMaterias.length === 0 && (
                            <tr>
                              <td colSpan={7} className="adm-empty-row">
                                No se encontraron materias con los filtros seleccionados.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {/* SUB-VIEW 2: ESTRUCTURA POR MALLA (MODULOS / MALLA) */}
                {materiasSubView === 'malla' && (
                  <>
                {/* Selector de programa */}
                <div className="glass-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.75rem', background: '#ffffff', border: '1.5px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <label style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <GraduationCap size={16} color="var(--color-green-inst)" />
                      <span>Programa Académico Seleccionado:</span>
                    </label>

                    <select
                      value={selectedProgramForCurriculum}
                      onChange={(e) => setSelectedProgramForCurriculum(e.target.value)}
                      className="form-select"
                      style={{ maxWidth: '480px', fontWeight: 700 }}
                    >
                      {programCatalog.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.title} ({p.id})
                        </option>
                      ))}
                    </select>

                    <label htmlFor="curriculum-malla" style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
                      Malla curricular:
                    </label>
                    <select
                      id="curriculum-malla"
                      value={selectedMallaForCurriculum}
                      onChange={(e) => setSelectedMallaForCurriculum(e.target.value)}
                      className="form-select"
                      style={{ maxWidth: '360px', fontWeight: 700 }}
                      disabled={isLoadingMallas || curriculumMallas.length === 0}
                    >
                      {curriculumMallas.length === 0 && <option value="">Sin mallas disponibles</option>}
                      {curriculumMallas.map((malla) => (
                        <option key={malla.id_malla} value={malla.id_malla}>
                          {malla.nombre_malla} (#{malla.id_malla})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {moduloModalOpen && (
                  <section className="glass-card" aria-labelledby="module-editor-title" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.25rem', background: '#ffffff' }}>
                    <h4 id="module-editor-title" style={{ marginTop: 0 }}>Nuevo módulo</h4>
                    <form onSubmit={handleCreateModulo}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="new-module-name">Nombre del módulo</label>
                        <input
                          id="new-module-name"
                          type="text"
                          required
                          maxLength={150}
                          value={moduloForm.nombre_mod}
                          onChange={(e) => setModuloForm({ ...moduloForm, nombre_mod: e.target.value })}
                          className="form-input"
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                        <button type="button" onClick={() => setModuloModalOpen(false)} className="btn btn-secondary">Cancelar</button>
                        <button type="submit" className="btn btn-primary" disabled={!selectedMallaForCurriculum}>Guardar módulo</button>
                      </div>
                    </form>
                  </section>
                )}

                {materiaModalOpen && (
                  <section className="glass-card" aria-labelledby="subject-editor-title" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.25rem', background: '#ffffff' }}>
                    <h4 id="subject-editor-title" style={{ marginTop: 0 }}>
                      {pendingMateriaAssignment ? 'Reintentar asignación de materia' : 'Nueva materia para la malla'}
                    </h4>
                    {pendingMateriaAssignment && (
                      <p role="status">La materia #{pendingMateriaAssignment.materia.id_mat} ya fue creada. Al guardar se reintentará la asignación a su destino original.</p>
                    )}
                    <form onSubmit={handleSaveMateria}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="new-subject-name">Nombre de la materia</label>
                        <input
                          id="new-subject-name"
                          type="text"
                          required
                          maxLength={150}
                          value={materiaForm.nombre_mat}
                          onChange={(e) => setMateriaForm({ ...materiaForm, nombre_mat: e.target.value })}
                          className="form-input"
                          disabled={Boolean(pendingMateriaAssignment)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="new-subject-description">Descripción</label>
                        <textarea
                          id="new-subject-description"
                          required
                          value={materiaForm.descripcion}
                          onChange={(e) => setMateriaForm({ ...materiaForm, descripcion: e.target.value })}
                          className="form-textarea"
                          disabled={Boolean(pendingMateriaAssignment)}
                        />
                      </div>
                      <p>Tipo académico: {programCatalog.find((p) => String(p.id) === String(selectedProgramForCurriculum))?.tipo_programa === 'Diplomado' ? 'Diplomado' : 'Maestría'} (determinado por el programa seleccionado)</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                        <div className="form-group">
                          <label className="form-label" htmlFor="new-subject-credits">Créditos</label>
                          <input id="new-subject-credits" type="number" min="1" required value={materiaForm.creditos} onChange={(e) => setMateriaForm({ ...materiaForm, creditos: e.target.value })} className="form-input" />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="new-subject-hours">Carga horaria</label>
                          <input id="new-subject-hours" type="number" min="1" required value={materiaForm.carga_horaria} onChange={(e) => setMateriaForm({ ...materiaForm, carga_horaria: e.target.value })} className="form-input" />
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                        <button type="button" onClick={() => {
                          if (pendingMateriaAssignment && !window.confirm(`La materia #${pendingMateriaAssignment.materia.id_mat} quedará creada sin asignación. ¿Cerrar igualmente?`)) return;
                          setMateriaModalOpen(false);
                          setPendingMateriaAssignment(null);
                        }} className="btn btn-secondary">Cancelar</button>
                        <button type="submit" className="btn btn-primary">{pendingMateriaAssignment ? 'Reintentar asignación' : 'Crear y asignar materia'}</button>
                      </div>
                    </form>
                  </section>
                )}

                {/* Listado de módulos y materias */}
                {curriculumError && (
                  <div role="alert" style={{ marginBottom: '1rem', padding: '0.85rem 1rem', background: 'var(--adm-danger-bg)', border: '1px solid var(--adm-border)', borderRadius: 'var(--adm-radius)', color: 'var(--adm-danger)' }}>
                    {curriculumError}
                  </div>
                )}
                {selectedMallaForCurriculum && !isLoadingMallas && (
                  <div className="adm-table-toolbar adm-program-toolbar">
                    <div className="adm-table-search">
                      <Search size={15} className="adm-table-search-icon" />
                      <input type="search" aria-label="Buscar materias" placeholder="Buscar materias por nombre o código..." value={curriculumSearch} onChange={(event) => setCurriculumSearch(event.target.value)} />
                    </div>
                    <select className="adm-filter-select" aria-label="Filtrar materias por estado" value={subjectStatusFilter} onChange={(event) => setSubjectStatusFilter(event.target.value)}>
                      <option value="todos">Todas las materias</option><option value="activos">Activas</option><option value="inactivos">Inactivas</option>
                    </select>
                  </div>
                )}
                {isLoadingMallas || isLoadingModules ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-green-inst)' }}>
                    Cargando mallas y estructura curricular...
                  </div>
                ) : !selectedMallaForCurriculum ? (
                  <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', background: '#ffffff' }}>
                    <BookMarked size={36} color="var(--color-text-subtle)" style={{ margin: '0 auto 1rem auto' }} />
                    <p style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>No hay mallas disponibles para este programa.</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      Crea o selecciona una malla desde el asistente de Programas antes de añadir módulos.
                    </p>
                  </div>
                ) : programCatalog.find((p) => String(p.id) === String(selectedProgramForCurriculum))?.tipo_programa === 'Diplomado' ? (
                  filteredProgramMallaSubjects.length === 0 ? (
                    <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', background: '#ffffff' }}>
                      <BookMarked size={36} color="var(--color-text-subtle)" style={{ margin: '0 auto 1rem auto' }} />
                      <p style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>No hay materias asignadas a esta malla de Diplomado.</p>
                      <button onClick={() => handleOpenCreateMateria('')} className="btn btn-primary btn-sm">Agregar primera materia</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      {filteredProgramMallaSubjects.map((item) => (
                        <div key={item.id_mat} className="glass-card" style={{ background: '#ffffff', border: '1px solid var(--color-border)', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                          <div>
                            <strong>{item.materia?.nombre_mat || `Materia ${item.id_mat}`}</strong>
                            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                              {item.pivot?.creditos ?? '—'} créditos · {item.pivot?.carga_horaria ?? '—'} horas
                            </div>
                            {item.materia?.descripcion && <p style={{ margin: '0.35rem 0 0' }}>{item.materia.descripcion}</p>}
                          </div>
                          <button onClick={() => handleToggleMateriaStatus(item.id_mat, item.materia?.activo !== false)} className="btn btn-secondary btn-sm" title={item.materia?.activo === false ? 'Reactivar materia' : 'Desactivar materia'}>
                            {item.materia?.activo === false ? <RefreshCw size={14} /> : <Archive size={14} />}
                          </button>
                        </div>
                      ))}
                    </div>
                  )
                ) : filteredProgramModules.length === 0 ? (
                  <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', background: '#ffffff' }}>
                    <BookMarked size={36} color="var(--color-text-subtle)" style={{ margin: '0 auto 1rem auto' }} />
                    <p style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>No hay módulos registrados en esta malla.</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                      Crea el primer módulo para estructurar las materias de esta Maestría.
                    </p>
                    <button onClick={() => setModuloModalOpen(true)} className="btn btn-primary btn-sm">
                      + Crear Primer Módulo
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                    {filteredProgramModules.map((mod, mIdx) => (
                      <div key={mod.id_mod} className="glass-card" style={{ background: '#ffffff', border: '1.5px solid var(--color-border)', padding: '1.5rem' }}>
                        {/* Modulo Header */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderBottom: '1.5px solid var(--color-border)',
                          paddingBottom: '0.85rem',
                          marginBottom: '1.25rem',
                          flexWrap: 'wrap',
                          gap: '0.75rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <span className="badge badge-green-inst">MÓDULO</span>
                            <h4 style={{ fontSize: '1.15rem', color: 'var(--color-green-inst)', margin: 0, fontWeight: 800 }}>
                              {mod.nombre_mod}
                            </h4>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', fontFamily: 'var(--font-family-mono)' }}>
                              ({mod.id_mod})
                            </span>
                          </div>

                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleOpenCreateMateria(mod.id_mod)}
                              className="btn btn-primary btn-sm"
                              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}
                            >
                              <Plus size={14} />
                              <span>Agregar Materia</span>
                            </button>

                            <button
                              onClick={() => handleDeleteModulo(mod.id_mod)}
                              className="btn btn-secondary btn-sm"
                              style={{ color: 'var(--color-status-danger)', padding: '0.4rem 0.7rem' }}
                              title="Eliminar módulo vacío; los módulos con materias asociadas se conservan"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Materias List */}
                        {(!mod.materias || mod.materias.length === 0) ? (
                          <div style={{ padding: '1rem', background: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--color-text-subtle)', fontSize: '0.85rem' }}>
                            No hay materias en este módulo. Haz clic en <strong>+ Agregar Materia</strong> para añadir asignaturas.
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                            {mod.materias.map((mat) => (
                              <div
                                key={mat.id_mat}
                                style={{
                                  background: 'var(--color-bg-primary)',
                                  border: '1px solid var(--color-border)',
                                  borderRadius: 'var(--radius-md)',
                                  padding: '1rem 1.25rem',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  flexWrap: 'wrap',
                                  gap: '1rem'
                                }}
                              >
                                <div style={{ flex: 1, minWidth: '280px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                    <span style={{
                                      fontFamily: 'var(--font-family-mono)',
                                      fontWeight: 800,
                                      fontSize: '0.78rem',
                                      color: 'var(--color-green-inst)',
                                      background: 'var(--color-green-inst-subtle)',
                                      padding: '0.15rem 0.5rem',
                                      borderRadius: 'var(--radius-sm)'
                                    }}>
                                      {mat.id_mat}
                                    </span>
                                    <strong style={{ fontSize: '0.95rem', color: 'var(--color-text-main)' }}>
                                      {mat.materia?.nombre_mat || `Materia ${mat.id_mat}`}
                                    </strong>
                                  </div>

                                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                                    <span><strong>Créditos:</strong> {mat.pivot?.creditos ?? '—'} ({mat.pivot?.carga_horaria ?? '—'} hrs)</span>
                                    {mat.materia?.descripcion && <span>{mat.materia.descripcion}</span>}
                                  </div>
                                </div>

                                <button
                                  onClick={() => handleToggleMateriaStatus(mat.id_mat, mat.materia?.activo !== false)}
                                  className="btn btn-secondary btn-sm"
                                  style={{ color: mat.materia?.activo === false ? 'var(--color-green-inst)' : 'var(--color-status-danger)', padding: '0.35rem 0.6rem' }}
                                  title={mat.materia?.activo === false ? 'Reactivar materia' : 'Desactivar materia'}
                                >
                                  {mat.materia?.activo === false ? <RefreshCw size={14} /> : <Archive size={14} />}
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                  </>
                )}
              </div>
            )}

            {/* 3. SECCIÓN USUARIOS */}
            {activeTab === 'usuarios' && (
              <UsuariosPanel />
            )}

            {/* SECCIÓN DEFENSAS DE TESIS & GRADO */}
            {activeTab === 'defensas' && (
              <DefensasPanel />
            )}

            {/* SECCIÓN INFORMACIÓN INSTITUCIONAL DE LA CARRERA & IETA */}
            {activeTab === 'carrera' && (
              <CarreraPanel />
            )}

            {/* 5. SECCIÓN DOCENTES (GESTIÓN INTEGRAL) */}
            {activeTab === 'docentes' && (
              <div className="animate-fade-in">
                <AdminSectionHeader
                  section="Administración · Equipo académico"
                  title="Administración de Docentes"
                  description="Plantel docente institucional, información académica y asignación a programas de posgrado."
                  actions={<button
                    onClick={handleOpenCreateDocente}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <Plus size={16} />
                    <span>Registrar Docente</span>
                  </button>}
                />

                <div className="adm-table-notice">
                  <Info size={14} aria-hidden="true" />
                  Los docentes activos se muestran primero. Puedes editar sus datos, consultar historial académico y gestionar asignaciones a ediciones de programas.
                </div>

                <div className="adm-table-toolbar adm-program-toolbar">
                  <div className="adm-table-search">
                    <Search size={15} className="adm-table-search-icon" />
                    <input type="search" aria-label="Buscar docentes" placeholder="Buscar por nombre o identificador..." value={docenteSearch} onChange={(event) => setDocenteSearch(event.target.value)} />
                  </div>

                  <select
                    aria-label="Filtrar docentes por programa"
                    className="adm-filter-select"
                    value={docenteProgramFilter}
                    onChange={(event) => setDocenteProgramFilter(event.target.value)}
                  >
                    <option value="todos">Todos los programas</option>
                    {programCatalog.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>

                  <select className="adm-filter-select" aria-label="Filtrar docentes por estado" value={docenteStatusFilter} onChange={(event) => setDocenteStatusFilter(event.target.value)}>
                    <option value="todos">Todos los estados</option><option value="activos">Activos</option><option value="inactivos">Inactivos</option>
                  </select>
                  <span className="adm-result-count">{filteredDocentes.length} docentes</span>
                </div>

                {docenteModalOpen && (
                  <section className="glass-card" aria-labelledby="teacher-editor-title" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.25rem', background: '#ffffff', border: '1.5px solid var(--color-border)' }}>
                    <h4 id="teacher-editor-title" style={{ marginTop: 0 }}>
                      {editingDocente ? 'Editar Docente' : 'Registrar Nuevo Docente'}
                    </h4>
                    <form onSubmit={handleSaveDocente}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                        <div className="form-group">
                          <label className="form-label" htmlFor="teacher-first-name">Nombres *</label>
                          <input id="teacher-first-name" type="text" required maxLength={150} value={docenteForm.nombre_doc} onChange={(e) => setDocenteForm({ ...docenteForm, nombre_doc: e.target.value })} className="form-input" />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="teacher-last-name">Apellidos *</label>
                          <input id="teacher-last-name" type="text" required maxLength={150} value={docenteForm.apellido_doc} onChange={(e) => setDocenteForm({ ...docenteForm, apellido_doc: e.target.value })} className="form-input" />
                        </div>
                      </div>
                      <div className="form-group" style={{ marginTop: '0.75rem' }}>
                        <label className="form-label" htmlFor="teacher-photo">Fotografía (URL o ruta existente)</label>
                        <input id="teacher-photo" type="text" value={docenteForm.foto} onChange={(e) => setDocenteForm({ ...docenteForm, foto: e.target.value })} className="form-input" placeholder="https://..." />
                        <small style={{ color: 'var(--adm-text-2)' }}>El sistema almacena la referencia URL o ruta de la imagen en la base de datos.</small>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                        <button type="button" onClick={() => setDocenteModalOpen(false)} className="btn btn-secondary">Cancelar</button>
                        <button type="submit" className="btn btn-primary">{editingDocente ? 'Actualizar Docente' : 'Guardar Docente'}</button>
                      </div>
                    </form>
                  </section>
                )}

                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Fotografía</th>
                        <th>Docente</th>
                        <th>Programas / Ediciones asignadas</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDocentes.map((doc) => {
                        const isDocExpanded = expandedDocenteId === doc.id;
                        const isManagingAssignment = managingDocenteAssignment === doc.id;
                        const assignedEdiciones = Array.isArray(doc.ediciones) ? doc.ediciones : [];
                        const assignedEdicionIds = new Set(assignedEdiciones.map((ed) => String(ed.id_edicion)));
                        const availableEdicionesToAssign = allEdiciones.filter((ed) => !assignedEdicionIds.has(String(ed.id_edicion)));

                        return (
                          <React.Fragment key={doc.id}>
                            <tr>
                              <td>
                                <img
                                  src={doc.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                                  alt={doc.nombre_completo}
                                  style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '2px solid var(--color-border)'
                                  }}
                                  onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                                  }}
                                />
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="adm-program-title-button"
                                  onClick={() => setExpandedDocenteId(isDocExpanded ? null : doc.id)}
                                >
                                  {doc.nombre_completo}
                                </button>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>ID: {doc.id}</div>
                              </td>
                              <td>
                                {assignedEdiciones.length === 0 ? (
                                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Sin asignaciones activas</span>
                                ) : (
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                                    {assignedEdiciones.map((ed) => (
                                      <span
                                        key={ed.id_edicion}
                                        style={{
                                          fontSize: '0.72rem',
                                          padding: '2px 6px',
                                          borderRadius: '4px',
                                          background: 'var(--adm-brand-light)',
                                          border: '1px solid var(--adm-border)',
                                          color: 'var(--adm-brand)',
                                          fontWeight: 600
                                        }}
                                      >
                                        {ed.nombre_edicion || `Edición #${ed.id_edicion}`} · {ed.programa?.nombre_programa || ed.programa?.title || 'Programa'}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </td>
                              <td>
                                <button
                                  type="button"
                                  onClick={() => handleToggleDocenteStatus(doc)}
                                  className={`badge ${doc.activo === false ? 'badge-red' : 'badge-green'}`}
                                  style={{ cursor: 'pointer', border: 'none' }}
                                  title="Clic para alternar estado"
                                >
                                  {doc.activo === false ? '✕ Inactivo' : '✓ Activo'}
                                </button>
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                  <button
                                    onClick={() => setManagingDocenteAssignment(isManagingAssignment ? null : doc.id)}
                                    className={`btn btn-sm ${isManagingAssignment ? 'btn-primary' : 'btn-secondary'}`}
                                    title="Gestionar asignación a ediciones"
                                  >
                                    <BookOpen size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleOpenEditDocente(doc)}
                                    className="btn btn-secondary btn-sm"
                                    style={{ padding: '0.35rem 0.6rem', color: 'var(--color-blue-steel)' }}
                                    title="Editar docente"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button
                                    onClick={() => setExpandedDocenteId(isDocExpanded ? null : doc.id)}
                                    className="btn btn-secondary btn-sm"
                                    title={isDocExpanded ? 'Ocultar detalle' : 'Ver detalle'}
                                  >
                                    <Eye size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteDocente(doc.id, doc.nombre_completo)}
                                    className="btn btn-secondary btn-sm"
                                    style={{ padding: '0.35rem 0.6rem', color: 'var(--color-status-danger)' }}
                                    title="Eliminar docente; solo está permitido sin ediciones asociadas"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>

                            {/* Subpanel inline: GESTIÓN DE ASIGNACIONES */}
                            {isManagingAssignment && (
                              <tr className="adm-program-detail-row">
                                <td colSpan={5} style={{ background: '#f8fafc', padding: '1.25rem 1.5rem', borderTop: '2px solid var(--adm-brand)' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    <strong style={{ color: 'var(--adm-text)', fontSize: '0.9rem' }}>
                                      Asignaciones a Ediciones: {doc.nombre_completo}
                                    </strong>
                                    <button
                                      type="button"
                                      onClick={() => setManagingDocenteAssignment(null)}
                                      className="btn btn-secondary btn-sm"
                                    >
                                      Cerrar panel
                                    </button>
                                  </div>

                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                                    {/* Ediciones actualmente asignadas */}
                                    <div style={{ background: '#ffffff', border: '1px solid var(--adm-border)', borderRadius: '6px', padding: '1rem' }}>
                                      <h5 style={{ margin: '0 0 0.75rem 0', fontSize: '0.82rem', color: 'var(--adm-text-2)', textTransform: 'uppercase' }}>
                                        Ediciones Asignadas ({assignedEdiciones.length})
                                      </h5>
                                      {assignedEdiciones.length === 0 ? (
                                        <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--adm-text-2)' }}>
                                          Este docente no está asignado a ninguna edición actualmente.
                                        </p>
                                      ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                          {assignedEdiciones.map((ed) => (
                                            <div
                                              key={ed.id_edicion}
                                              style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '0.5rem 0.75rem',
                                                background: 'var(--adm-bg)',
                                                borderRadius: '4px',
                                                fontSize: '0.82rem'
                                              }}
                                            >
                                              <div>
                                                <strong>{ed.nombre_edicion || `Edición #${ed.id_edicion}`}</strong>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--adm-text-2)' }}>
                                                  {ed.programa?.nombre_programa || ed.programa?.title}
                                                </div>
                                              </div>
                                              <button
                                                type="button"
                                                onClick={() => handleRemoveDocenteFromEdicion(doc.id, ed.id_edicion)}
                                                className="btn btn-secondary btn-sm"
                                                style={{ color: 'var(--adm-danger)', fontSize: '0.75rem', padding: '2px 8px' }}
                                                title="Retirar de esta edición"
                                              >
                                                Retirar
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>

                                    {/* Formulario para asignar a nueva edición */}
                                    <div style={{ background: '#ffffff', border: '1px solid var(--adm-border)', borderRadius: '6px', padding: '1rem' }}>
                                      <h5 style={{ margin: '0 0 0.75rem 0', fontSize: '0.82rem', color: 'var(--adm-text-2)', textTransform: 'uppercase' }}>
                                        Asignar a Nueva Edición
                                      </h5>
                                      {availableEdicionesToAssign.length === 0 ? (
                                        <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--adm-text-2)' }}>
                                          Todas las ediciones existentes ya tienen asignado a este docente.
                                        </p>
                                      ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                          <select
                                            className="form-select"
                                            value={selectedEdicionToAssign}
                                            onChange={(e) => setSelectedEdicionToAssign(e.target.value)}
                                            style={{ fontSize: '0.85rem' }}
                                          >
                                            <option value="">Selecciona una edición disponible...</option>
                                            {availableEdicionesToAssign.map((ed) => (
                                              <option key={ed.id_edicion} value={ed.id_edicion}>
                                                {ed.nombre_edicion || `Edición #${ed.id_edicion}`} — {ed.programa?.nombre_programa || ed.programa?.title}
                                              </option>
                                            ))}
                                          </select>

                                          <button
                                            type="button"
                                            onClick={() => handleAssignDocenteToEdicion(doc.id, selectedEdicionToAssign)}
                                            className="btn btn-primary btn-sm"
                                            disabled={!selectedEdicionToAssign}
                                            style={{ alignSelf: 'flex-start' }}
                                          >
                                            Asignar a Edición
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}

                            {/* Detalle expandible del Docente */}
                            {isDocExpanded && (
                              <tr className="adm-program-detail-row">
                                <td colSpan={5}>
                                  <div className="adm-program-detail-grid">
                                    <div>
                                      <strong>Nombre Completo</strong>
                                      <p>{doc.nombre_completo}</p>
                                    </div>
                                    <div>
                                      <strong>Identificador Docente</strong>
                                      <p>DOC-{doc.id}</p>
                                    </div>
                                    <div>
                                      <strong>Estado Académico</strong>
                                      <p>{doc.activo !== false ? 'Activo en planta docente' : 'Inactivo / Licencia'}</p>
                                    </div>
                                    <div>
                                      <strong>Ediciones y Programas Asignados</strong>
                                      <p>
                                        {assignedEdiciones.length > 0
                                          ? assignedEdiciones.map((ed) => `${ed.nombre_edicion || `Edición #${ed.id_edicion}`} (${ed.programa?.nombre_programa || ed.programa?.title})`).join('; ')
                                          : 'Sin ediciones asignadas actualmente.'}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}

                      {filteredDocentes.length === 0 && (
                        <tr>
                          <td colSpan={5} className="adm-empty-row">
                            No se encontraron docentes con los filtros especificados.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 6. SECCIÓN MÉTRICAS */}
            {activeTab === 'metricas' && (
              <div className="animate-fade-in">
                <h3 style={{ fontSize: '1.35rem', color: 'var(--color-text-main)', fontWeight: 800, marginBottom: '1.5rem' }}>
                  Resumen Ejecutivo & Métricas de Admisión
                </h3>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1.25rem',
                  marginBottom: '2rem'
                }}>
                  <div className="glass-card" style={{ padding: '1.5rem', background: '#ffffff' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>TOTAL POSTULANTES</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-green-inst)' }}>{totalApplicants}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Expedientes en plataforma</div>
                  </div>

                  <div className="glass-card" style={{ padding: '1.5rem', background: '#ffffff' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>HABILITADOS / ADMITIDOS</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-green-inst)' }}>{admittedCount}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Con matriculación activa</div>
                  </div>

                  <div className="glass-card" style={{ padding: '1.5rem', background: '#ffffff' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>OBSERVADOS / EN REVISIÓN</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-status-warning)' }}>{observedCount + pendingCount}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Requieren subsanación</div>
                  </div>

                  <div className="glass-card" style={{ padding: '1.5rem', background: '#ffffff' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>PROGRAMAS ACTIVOS</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-blue-steel)' }}>{programCatalog.filter(p => p.status === 'Activo').length}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Convocatoria 2026</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>

        {/* MODAL: PROGRAM CRUD (CREAR / EDITAR) */}
        {programModalOpen && (
          <div className="modal-overlay" onClick={() => setProgramModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
              <div className="modal-header">
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
                  {editingProgram ? 'Editar Programa Académico' : 'Crear Nuevo Programa de Postgrado'}
                </h3>
                <button className="modal-close-btn" onClick={() => setProgramModalOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveProgram} className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nombre del Programa</label>
                  <input
                    type="text"
                    required
                    value={programForm.title}
                    onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })}
                    className="form-input"
                    placeholder="Ej. Maestría en Bioestadística y Epidemiología"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Tipo de Programa</label>
                    <select
                      value={programForm.tipo_programa}
                      onChange={(e) => setProgramForm({ ...programForm, tipo_programa: e.target.value })}
                      className="form-select"
                    >
                      <option value="Autofinanciada">Autofinanciada</option>
                      <option value="Terminal">Terminal (con Tesis de Grado)</option>
                      <option value="Convenio">Convenio Institucional</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Créditos Totales</label>
                    <input
                      type="number"
                      min="30"
                      max="200"
                      required
                      value={programForm.credits}
                      onChange={(e) => setProgramForm({ ...programForm, credits: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Mención / Especialidad</label>
                    <input
                      type="text"
                      value={programForm.mencion}
                      onChange={(e) => setProgramForm({ ...programForm, mencion: e.target.value })}
                      className="form-input"
                      placeholder="Ej. Inferencia Bayesiana"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Cupo Máximo</label>
                    <input
                      type="number"
                      min="5"
                      max="100"
                      required
                      value={programForm.cupo_total}
                      onChange={(e) => setProgramForm({ ...programForm, cupo_total: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Resolución de Aprobación SUB</label>
                    <input
                      type="text"
                      value={programForm.resolution}
                      onChange={(e) => setProgramForm({ ...programForm, resolution: e.target.value })}
                      className="form-input"
                      placeholder="Ej. CU-RES-2026-045"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Resolución HCU (Honorable Consejo Universitario)</label>
                    <input
                      type="text"
                      value={programForm.resolucion_hcu}
                      onChange={(e) => setProgramForm({ ...programForm, resolucion_hcu: e.target.value })}
                      className="form-input"
                      placeholder="Ej. Resolución HCU N° 284/2024 - Aprobación Plena UMSA"
                    />
                  </div>
                </div>

                {/* ENLACES OFICIALES: DRIVE, PDF, GOOGLE FORMS */}
                <div style={{ background: 'var(--color-bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-green-inst)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                    Documentación Digital y Postulación Oficial
                  </div>

                  <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <ExternalLink size={14} color="var(--color-green-inst)" />
                      <span>Enlace Convocatoria Oficial (Google Drive)</span>
                    </label>
                    <input
                      type="url"
                      value={programForm.enlace_convocatoria_drive}
                      onChange={(e) => setProgramForm({ ...programForm, enlace_convocatoria_drive: e.target.value })}
                      className="form-input"
                      placeholder="https://drive.google.com/..."
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <FileDown size={14} color="var(--color-status-danger)" />
                      <span>Enlace Folleto / Descripción Académica (PDF)</span>
                    </label>
                    <input
                      type="url"
                      value={programForm.enlace_pdf_programa}
                      onChange={(e) => setProgramForm({ ...programForm, enlace_pdf_programa: e.target.value })}
                      className="form-input"
                      placeholder="https://drive.google.com/... o enlace directo al PDF"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <FileText size={14} color="var(--color-blue-steel)" />
                      <span>Formulario Oficial de Inscripción (Google Forms)</span>
                    </label>
                    <input
                      type="url"
                      value={programForm.enlace_formulario_inscripcion}
                      onChange={(e) => setProgramForm({ ...programForm, enlace_formulario_inscripcion: e.target.value })}
                      className="form-input"
                      placeholder="https://docs.google.com/forms/..."
                    />
                  </div>
                </div>

                {/* MODALIDAD DE PAGO Y DESCUENTOS */}
                <div style={{ background: 'var(--color-bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-green-inst)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                    Inversión, Descuentos y Facilidades de Pago
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Descuento Contado (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={programForm.descuento_contado_porcentaje}
                        onChange={(e) => setProgramForm({ ...programForm, descuento_contado_porcentaje: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">N° de Cuotas</label>
                      <input
                        type="number"
                        min="1"
                        max="36"
                        value={programForm.numero_cuotas}
                        onChange={(e) => setProgramForm({ ...programForm, numero_cuotas: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Monto Cuota (Bs.)</label>
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={programForm.monto_cuota}
                        onChange={(e) => setProgramForm({ ...programForm, monto_cuota: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Descripción Académica General</label>
                  <textarea
                    rows={2}
                    value={programForm.description}
                    onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
                    className="form-textarea"
                    placeholder="Detalles sobre el enfoque y fundamentación del programa..."
                  />
                </div>

                {/* CAMPOS ACADÉMICOS PARA MODAL DE DETALLE */}
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-green-inst)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                    Contenido Académico & Requisitos (Base de Datos)
                  </div>

                  <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                    <label className="form-label">Perfil del Postulante / Aspirante</label>
                    <textarea
                      rows={2}
                      value={programForm.perfil_aspirante}
                      onChange={(e) => setProgramForm({ ...programForm, perfil_aspirante: e.target.value })}
                      className="form-textarea"
                      placeholder="Ej. Licenciados en Estadística, Informática, Matemáticas, Economía..."
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                    <label className="form-label">Perfil de Egreso Profesional</label>
                    <textarea
                      rows={2}
                      value={programForm.perfil_egreso}
                      onChange={(e) => setProgramForm({ ...programForm, perfil_egreso: e.target.value })}
                      className="form-textarea"
                      placeholder="Ej. Especialista capacitado para liderar investigaciones estadísticas y modelar fenómenos complejos..."
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                    <label className="form-label">Requisitos de Admisión Documental (Separados por línea)</label>
                    <textarea
                      rows={3}
                      value={programForm.requisitos_admision}
                      onChange={(e) => setProgramForm({ ...programForm, requisitos_admision: e.target.value })}
                      className="form-textarea"
                      placeholder="• Fotocopia legalizada del Título en Provisión Nacional&#10;• Carta de postulación y hoja de vida documentada&#10;• Certificado de nacimiento original"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Modalidades de Titulación y Graduación (Separadas por línea)</label>
                    <textarea
                      rows={2}
                      value={programForm.modalidad_titulacion}
                      onChange={(e) => setProgramForm({ ...programForm, modalidad_titulacion: e.target.value })}
                      className="form-textarea"
                      placeholder="• Tesis de Grado Magistral con defensa ante tribunal evaluador&#10;• Proyecto de Grado / Trabajo Dirigido de Investigación Aplicada"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setProgramModalOpen(false)}
                    className="btn btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Save size={16} />
                    <span>Guardar en Base de Datos</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: CONVOCATORIA PASADA / HISTÓRICA */}
        {convocatoriaModalOpen && (
          <div className="modal-overlay" onClick={() => setConvocatoriaModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
              <div className="modal-header">
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
                  Registrar Convocatoria Histórica
                </h3>
                <button className="modal-close-btn" onClick={() => setConvocatoriaModalOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveConvocatoria} className="modal-body">
                {/* Auto-completar desde programa del catálogo */}
                <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid var(--color-border)' }}>
                  <label className="form-label" style={{ fontWeight: 800, color: 'var(--color-green-inst)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <GraduationCap size={15} />
                    <span>Autocompletar datos desde Programa / Edición:</span>
                  </label>
                  <select
                    onChange={(e) => {
                      if (e.target.value) handleSelectProgramForConvocatoria(e.target.value);
                    }}
                    defaultValue=""
                    className="form-select"
                    style={{ fontSize: '0.85rem', fontWeight: 600 }}
                  >
                    <option value="">-- Seleccionar programa para autocompletar campos --</option>
                    {programCatalog.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Gestión / Año</label>
                    <input
                      type="text"
                      required
                      value={convocatoriaForm.gestion}
                      onChange={(e) => setConvocatoriaForm({ ...convocatoriaForm, gestion: e.target.value })}
                      className="form-input"
                      placeholder="Ej. Gestión 2025"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nivel Académico</label>
                    <select
                      value={convocatoriaForm.nivel}
                      onChange={(e) => setConvocatoriaForm({ ...convocatoriaForm, nivel: e.target.value })}
                      className="form-select"
                    >
                      <option value="Maestría">Maestría</option>
                      <option value="Diplomado">Diplomado</option>
                      <option value="Especialidad">Especialidad</option>
                      <option value="Doctorado">Doctorado</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Nombre del Programa</label>
                  <input
                    type="text"
                    required
                    value={convocatoriaForm.programa}
                    onChange={(e) => setConvocatoriaForm({ ...convocatoriaForm, programa: e.target.value })}
                    className="form-input"
                    placeholder="Ej. Maestría en Ciencia de Datos y Bioestadística"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Título de la Convocatoria</label>
                  <input
                    type="text"
                    required
                    value={convocatoriaForm.titulo}
                    onChange={(e) => setConvocatoriaForm({ ...convocatoriaForm, titulo: e.target.value })}
                    className="form-input"
                    placeholder="Ej. Convocatoria Pública a Postulantes N° 01/2025"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Resolución HCU</label>
                  <input
                    type="text"
                    value={convocatoriaForm.resolucion_hcu}
                    onChange={(e) => setConvocatoriaForm({ ...convocatoriaForm, resolucion_hcu: e.target.value })}
                    className="form-input"
                    placeholder="Ej. Resolución HCU N° 182/2023 - Aprobada"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Enlace Convocatoria (Google Drive)</label>
                    <input
                      type="url"
                      value={convocatoriaForm.enlace_drive}
                      onChange={(e) => setConvocatoriaForm({ ...convocatoriaForm, enlace_drive: e.target.value })}
                      className="form-input"
                      placeholder="https://drive.google.com/..."
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Enlace Descarga PDF</label>
                    <input
                      type="url"
                      value={convocatoriaForm.enlace_pdf}
                      onChange={(e) => setConvocatoriaForm({ ...convocatoriaForm, enlace_pdf: e.target.value })}
                      className="form-input"
                      placeholder="https://drive.google.com/... o PDF"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Descripción / Resumen de Convocatoria</label>
                  <textarea
                    rows={2}
                    value={convocatoriaForm.descripcion}
                    onChange={(e) => setConvocatoriaForm({ ...convocatoriaForm, descripcion: e.target.value })}
                    className="form-textarea"
                    placeholder="Modalidad, requisitos o menciones habilitadas..."
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button type="button" onClick={() => setConvocatoriaModalOpen(false)} className="btn btn-secondary">
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Save size={16} />
                    <span>Guardar Convocatoria Histórica</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: CREAR USUARIO */}
        {userModalOpen && (
          <div className="modal-overlay" onClick={() => setUserModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
              <div className="modal-header">
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
                  Crear Nuevo Usuario
                </h3>
                <button className="modal-close-btn" onClick={() => setUserModalOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="modal-body">
                <div className="form-group">
                  <label className="form-label">Correo Electrónico Institucional</label>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="form-input"
                    placeholder="usuario@umsa.bo"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tipo de Usuario</label>
                  <select
                    value={newUser.tipo}
                    onChange={(e) => {
                      const tipo = e.target.value;
                      const rol = tipo === 'Administrador' ? 'ROL-001' : (tipo === 'Docente' ? 'ROL-003' : 'ROL-004');
                      setNewUser({ ...newUser, tipo, rol });
                    }}
                    className="form-select"
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="Docente">Docente</option>
                    <option value="Estudiante">Estudiante</option>
                    <option value="Postulante">Postulante</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Contraseña Inicial</label>
                  <input
                    type="password"
                    required
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="form-input"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button type="button" onClick={() => setUserModalOpen(false)} className="btn btn-secondary">
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Crear Usuario
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

    </>
  );
};
