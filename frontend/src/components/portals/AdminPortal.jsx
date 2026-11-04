import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import UsuariosPanel from './panels/UsuariosPanel';
import DefensasPanel from './panels/DefensasPanel';
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
  Upload, 
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
  Bell
} from 'lucide-react';
import { ProgramEditorFixed } from './ProgramEditorFixed';
import '../../styles/admin-portal.css';

export const AdminPortal = ({ onExitAdmin }) => {
  const { currentUser } = useAuth();

  // Sidebar Tab state: 'programas' | 'modulos' | 'convocatorias' | 'defensas' | 'carrera' | 'usuarios' | 'docentes' | 'metricas'
  const [activeTab, setActiveTab] = useState('programas');

  // Sidebar responsivo & buscador global
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

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
  const [programModules, setProgramModules] = useState([]);
  const [isLoadingModules, setIsLoadingModules] = useState(false);

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
    id_mat: '',
    nombre_mat: '',
    creditos: 8,
    carga_horaria: 128,
    tipo: 'Teórico-Práctica',
    software_requerido: 'R, Python',
    descripcion: '',
    id_docente: ''
  });

  // User Form
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', tipo: 'Estudiante', rol: 'ROL-004', password: '' });

  // Docente Form & Local Upload State
  const [docenteModalOpen, setDocenteModalOpen] = useState(false);
  const [editingDocente, setEditingDocente] = useState(null);
  const [isUploadingDocFoto, setIsUploadingDocFoto] = useState(false);
  const [docenteForm, setDocenteForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    titulo: 'PhD en Estadística',
    especialidad: '',
    categoria: 'Titular',
    foto_url: '',
    bio: '',
    scholar: '',
    researchgate: '',
    linkedin: '',
    orcid: ''
  });

  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const showNotification = (msg, type = 'success') => {
    setFeedbackMessage({ text: msg, type });
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [progData, userData, roleData, docData, convData, infoData, defensasData] = await Promise.all([
        programaService.adminGetAll(),
        adminService.getUsuarios(),
        adminService.getRoles(),
        docenteService.getAdminDocentes(),
        convocatoriaService.getConvocatoriasPasadas(),
        institucionService.getInfo(),
        defensaService.getDefensasTesis(),
      ]);

      const items = Array.isArray(progData?.items) ? progData.items : [];
      setProgramCatalog(items);
      if (items.length > 0 && !selectedProgramForCurriculum) {
        setSelectedProgramForCurriculum(items[0].id);
      }

      setUsuarios(Array.isArray(userData) ? userData : []);
      setRoles(Array.isArray(roleData) ? roleData : []);
      setDocentes(Array.isArray(docData) ? docData : []);
      setConvocatoriasPasadas(Array.isArray(convData) ? convData : []);
      if (infoData && !infoData.error) setCarreraInfo(infoData);
      setDefensasTesis(Array.isArray(defensasData) ? defensasData : []);
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

  // Fetch modules whenever selectedProgramForCurriculum changes
  const fetchCurriculumModules = async (progId) => {
    if (!progId) return;
    setIsLoadingModules(true);
    try {
      const data = await programaService.getModulos(progId);
      setProgramModules(Array.isArray(data?.modulos) ? data.modulos : []);
    } catch (err) {
      console.error('Error cargando módulos:', err);
    } finally {
      setIsLoadingModules(false);
    }
  };

  useEffect(() => {
    if (selectedProgramForCurriculum) {
      fetchCurriculumModules(selectedProgramForCurriculum);
    }
  }, [selectedProgramForCurriculum]);

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
      fetchAllData();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleToggleProgramStatus = async (programId, currentStatus) => {
    const nextStatus = currentStatus === 'Activo' ? 'Inactivo' : 'Activo';
    try {
      await programaService.updateStatus(programId, nextStatus);
      showNotification(`Estado de ${programId} cambiado a ${nextStatus}`);
      fetchAllData();
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
    if (!selectedProgramForCurriculum || !moduloForm.nombre_mod) return;
    try {
      await programaService.createModulo({
        id_programa: selectedProgramForCurriculum,
        nombre_mod: moduloForm.nombre_mod
      });
      showNotification(`Módulo "${moduloForm.nombre_mod}" creado con éxito`);
      setModuloModalOpen(false);
      setModuloForm({ nombre_mod: '' });
      fetchCurriculumModules(selectedProgramForCurriculum);
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleDeleteModulo = async (idMod) => {
    if (!window.confirm('¿Eliminar este módulo y todas sus asignaturas asociadas?')) return;
    try {
      await programaService.deleteModulo(idMod);
      showNotification('Módulo eliminado');
      fetchCurriculumModules(selectedProgramForCurriculum);
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // MATERIA CRUD
  const handleOpenCreateMateria = (idMod) => {
    setTargetModuloId(idMod);
    setMateriaForm({
      id_mat: `MAT-${Math.floor(100 + Math.random() * 900)}`,
      nombre_mat: '',
      creditos: 8,
      carga_horaria: 128,
      tipo: 'Teórico-Práctica',
      software_requerido: 'R, Python',
      descripcion: '',
      id_docente: docentes.length > 0 ? docentes[0].id : ''
    });
    setMateriaModalOpen(true);
  };

  const handleSaveMateria = async (e) => {
    e.preventDefault();
    try {
      await programaService.createMateria({ ...materiaForm, id_mod: targetModuloId });
      showNotification(`Materia "${materiaForm.nombre_mat}" guardada exitosamente`);
      setMateriaModalOpen(false);
      fetchCurriculumModules(selectedProgramForCurriculum);
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleDeleteMateria = async (idMat) => {
    if (!window.confirm('¿Eliminar esta asignatura?')) return;
    try {
      await programaService.deleteMateria(idMat);
      showNotification('Materia eliminada');
      fetchCurriculumModules(selectedProgramForCurriculum);
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

  // DOCENTE HANDLERS (FULL CRUD & LOCAL UPLOAD)
  const handleOpenCreateDocente = () => {
    setEditingDocente(null);
    setDocenteForm({
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      titulo: 'PhD en Estadística',
      especialidad: '',
      categoria: 'Titular',
      foto_url: '',
      bio: '',
      scholar: '',
      researchgate: '',
      linkedin: '',
      orcid: ''
    });
    setDocenteModalOpen(true);
  };

  const handleOpenEditDocente = (doc) => {
    setEditingDocente(doc);
    setDocenteForm({
      nombre: doc.nombre || '',
      apellido: doc.apellido || '',
      email: doc.email || '',
      telefono: doc.telefono || '',
      titulo: doc.titulo || 'PhD en Estadística',
      especialidad: doc.especialidad || '',
      categoria: doc.categoria || 'Titular',
      foto_url: doc.foto_url || '',
      bio: doc.bio || '',
      scholar: doc.scholar || '',
      researchgate: doc.researchgate || '',
      linkedin: doc.linkedin || '',
      orcid: doc.orcid || ''
    });
    setDocenteModalOpen(true);
  };

  const handleDocenteFotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingDocFoto(true);
    try {
      const data = await docenteService.uploadFoto(file);
      setDocenteForm(prev => ({ ...prev, foto_url: data.url }));
      showNotification('Fotografía subida y resguardada localmente en el servidor');
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setIsUploadingDocFoto(false);
    }
  };

  const handleSaveDocente = async (e) => {
    e.preventDefault();
    try {
      if (editingDocente) {
        await docenteService.update(editingDocente.id, docenteForm);
      } else {
        await docenteService.create(docenteForm);
      }
      showNotification(editingDocente ? 'Docente actualizado correctamente' : 'Docente registrado con éxito');
      setDocenteModalOpen(false);
      fetchAllData();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleDeleteDocente = async (docId, docNombre) => {
    if (!window.confirm(`¿Está seguro de eliminar al docente ${docNombre}? Esta acción removerá sus asignaciones docentes.`)) return;
    try {
      await docenteService.delete(docId);
      showNotification('Docente eliminado de la base de datos');
      fetchAllData();
    } catch (err) {
      showNotification(err.message, 'error');
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
            placeholder="Buscar programas, docentes, convocatorias... (Ctrl+K)"
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
          <div className="adm-sidebar-section-label">Módulos del Sistema</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', padding: '0 6px' }}>
            <button
              onClick={() => { setActiveTab('programas'); setIsMobileSidebarOpen(false); }}
              className={`adm-nav-item ${activeTab === 'programas' ? 'active' : ''}`}
              title="Programas & Ofertas"
            >
              <span className="adm-nav-icon"><GraduationCap size={18} /></span>
              <span className="adm-nav-label">Programas & Ofertas</span>
              <span className="adm-badge">{programCatalog.length}</span>
            </button>

            <button
              onClick={() => { setActiveTab('convocatorias'); setIsMobileSidebarOpen(false); }}
              className={`adm-nav-item ${activeTab === 'convocatorias' ? 'active' : ''}`}
              title="Convocatorias Pasadas"
            >
              <span className="adm-nav-icon"><Archive size={18} /></span>
              <span className="adm-nav-label">Convocatorias Pasadas</span>
              <span className="adm-badge">{convocatoriasPasadas.length}</span>
            </button>

            <button
              onClick={() => { setActiveTab('modulos'); setIsMobileSidebarOpen(false); }}
              className={`adm-nav-item ${activeTab === 'modulos' ? 'active' : ''}`}
              title="Módulos & Materias"
            >
              <span className="adm-nav-icon"><BookMarked size={18} /></span>
              <span className="adm-nav-label">Módulos & Materias</span>
            </button>

            <button
              onClick={() => { setActiveTab('usuarios'); setIsMobileSidebarOpen(false); }}
              className={`adm-nav-item ${activeTab === 'usuarios' ? 'active' : ''}`}
              title="Gestión de Usuarios"
            >
              <span className="adm-nav-icon"><Users size={18} /></span>
              <span className="adm-nav-label">Gestión de Usuarios</span>
              <span className="adm-badge">{usuarios.length}</span>
            </button>

            <button
              onClick={() => { setActiveTab('defensas'); setIsMobileSidebarOpen(false); }}
              className={`adm-nav-item ${activeTab === 'defensas' ? 'active' : ''}`}
              title="Defensas de Tesis"
            >
              <span className="adm-nav-icon"><Award size={18} /></span>
              <span className="adm-nav-label">Defensas de Tesis</span>
              <span className="adm-badge">{defensasTesis.length}</span>
            </button>

            <button
              onClick={() => { setActiveTab('carrera'); setIsMobileSidebarOpen(false); }}
              className={`adm-nav-item ${activeTab === 'carrera' ? 'active' : ''}`}
              title="Info Carrera & IETA"
            >
              <span className="adm-nav-icon"><Landmark size={18} /></span>
              <span className="adm-nav-label">Info Carrera & IETA</span>
            </button>

            <button
              onClick={() => { setActiveTab('docentes'); setIsMobileSidebarOpen(false); }}
              className={`adm-nav-item ${activeTab === 'docentes' ? 'active' : ''}`}
              title="Planta Docente"
            >
              <span className="adm-nav-icon"><BookOpen size={18} /></span>
              <span className="adm-nav-label">Planta Docente</span>
              <span className="adm-badge">{docentes.length}</span>
            </button>

            <button
              onClick={() => { setActiveTab('metricas'); setIsMobileSidebarOpen(false); }}
              className={`adm-nav-item ${activeTab === 'metricas' ? 'active' : ''}`}
              title="Métricas & Reportes"
            >
              <span className="adm-nav-icon"><Activity size={18} /></span>
              <span className="adm-nav-label">Métricas & Reportes</span>
            </button>
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
            {/* 1. SECCIÓN PROGRAMAS */}
            {activeTab === 'programas' && (
              <div className="animate-fade-in">
                {fixedEditorOpen ? (
                  <ProgramEditorFixed
                    initialProgramId={selectedProgramForEditor}
                    onSaved={() => {
                      setFixedEditorOpen(false);
                      setSelectedProgramForEditor(null);
                      fetchAllData();
                      showNotification('¡Programa guardado y sincronizado correctamente con la base de datos!');
                    }}
                    onCancel={() => {
                      setFixedEditorOpen(false);
                      setSelectedProgramForEditor(null);
                    }}
                  />
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.35rem', color: 'var(--color-text-main)', fontWeight: 800, margin: 0 }}>
                          Catálogo de Programas de Postgrado
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
                          Crea, edita y gestiona las convocatorias de maestrías y diplomados.
                        </p>
                      </div>

                      <button
                        onClick={handleOpenCreateProgram}
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                      >
                        <Plus size={16} />
                        <span>Nuevo Programa</span>
                      </button>
                    </div>

                    <div className="data-table-container">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Código / ID</th>
                            <th>Nombre del Programa</th>
                            <th>Tipo / Nivel</th>
                            <th>Créditos</th>
                            <th>Cupos</th>
                            <th>Estado</th>
                            <th>Acciones CRUD</th>
                          </tr>
                        </thead>
                        <tbody>
                          {programCatalog.map((prog) => {
                            const isActivo = prog.status === 'Activo';
                            return (
                              <tr key={prog.id}>
                                <td style={{ fontWeight: 700, fontFamily: 'var(--font-family-mono)', color: 'var(--color-text-main)' }}>
                                  {prog.id}
                                </td>
                                <td>
                                  <div style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>{prog.title}</div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                                    {prog.mencion ? `Mención: ${prog.mencion} · ` : ''}{prog.resolution}
                                  </div>
                                </td>
                                <td>
                                  <span className={`badge ${prog.type === 'Maestría' ? 'badge-green-inst' : 'badge-blue'}`}>
                                    {prog.type} ({prog.typeFilter || 'Autofinanciada'})
                                  </span>
                                </td>
                                <td>{prog.credits} créditos</td>
                                <td>
                                  <strong>{prog.cupo_usados || 0}</strong> / {prog.cupo_total || 25}
                                </td>
                                <td>
                                  <button
                                    onClick={() => handleToggleProgramStatus(prog.id, prog.status)}
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
                                      onClick={() => handleConcluirPrograma(prog.id, prog.title)}
                                      className="btn btn-secondary btn-sm"
                                      style={{ padding: '0.35rem 0.6rem', color: 'var(--color-green-inst)' }}
                                      title="Concluir edición y mandar al repositorio de Convocatorias Pasadas"
                                    >
                                      <Archive size={14} />
                                    </button>
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
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
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

            {/* 2. SECCIÓN MÓDULOS & MATERIAS (NUEVA ADMINISTRACIÓN CURRICULAR) */}
            {activeTab === 'modulos' && (
              <div className="animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', color: 'var(--color-text-main)', fontWeight: 800, margin: 0 }}>
                      Administración de Módulos & Malla Curricular
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
                      Crea módulos y asigna materias con sus créditos, software y docentes en la base de datos PostgreSQL.
                    </p>
                  </div>

                  <button
                    onClick={() => setModuloModalOpen(true)}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <FolderPlus size={16} />
                    <span>+ Crear Módulo</span>
                  </button>
                </div>

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
                  </div>
                </div>

                {/* Listado de módulos y materias */}
                {isLoadingModules ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-green-inst)' }}>
                    Cargando estructura curricular desde PostgreSQL...
                  </div>
                ) : programModules.length === 0 ? (
                  <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', background: '#ffffff' }}>
                    <BookMarked size={36} color="var(--color-text-subtle)" style={{ margin: '0 auto 1rem auto' }} />
                    <p style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>No hay módulos registrados para este programa.</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                      Comienza creando el primer módulo (ej. "Módulo I: Fundamentos Estadísticos") para estructurar las materias.
                    </p>
                    <button onClick={() => setModuloModalOpen(true)} className="btn btn-primary btn-sm">
                      + Crear Primer Módulo
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                    {programModules.map((mod, mIdx) => (
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
                              title="Eliminar este módulo"
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
                                      {mat.nombre_mat}
                                    </strong>
                                  </div>

                                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                                    <span><strong>Créditos:</strong> {mat.creditos} ({mat.carga_horaria} hrs)</span>
                                    <span><strong>Tipo:</strong> {mat.tipo}</span>
                                    {mat.software_requerido && <span><strong>Software:</strong> {mat.software_requerido}</span>}
                                    {mat.nombre_docente && <span><strong>Docente:</strong> {mat.nombre_docente}</span>}
                                  </div>
                                </div>

                                <button
                                  onClick={() => handleDeleteMateria(mat.id_mat)}
                                  className="btn btn-secondary btn-sm"
                                  style={{ color: 'var(--color-status-danger)', padding: '0.35rem 0.6rem' }}
                                  title="Eliminar materia"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
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
              <div className="animate-fade-in">
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.35rem', color: 'var(--color-text-main)', fontWeight: 800, margin: 0 }}>
                    Información Institucional, Carrera & IETA
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
                    Configuración de direcciones, campus virtual, IETA, Club Científico y canales oficiales en la base de datos PostgreSQL.
                  </p>
                </div>

                <form onSubmit={handleSaveCarreraInfo} className="glass-card" style={{ background: '#ffffff', border: '1.5px solid var(--color-border)', padding: '2rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <MapPin size={16} color="var(--color-green-inst)" />
                        <span>Dirección de la Carrera & Campus</span>
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={carreraInfo.direccion}
                        onChange={(e) => setCarreraInfo({ ...carreraInfo, direccion: e.target.value })}
                        className="form-textarea"
                        placeholder="Ej. Campus Universitario Cota Cota, Calle 27, Edificio FCPN - Carrera de Estadística..."
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Mail size={16} color="var(--color-green-inst)" />
                        <span>Correo Electrónico Oficial de Posgrado</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={carreraInfo.email_principal}
                        onChange={(e) => setCarreraInfo({ ...carreraInfo, email_principal: e.target.value })}
                        className="form-input"
                        placeholder="estapost@fcpn.edu.bo"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Globe size={16} color="var(--color-blue-steel)" />
                        <span>Campus Virtual de Posgrado (URL)</span>
                      </label>
                      <input
                        type="url"
                        required
                        value={carreraInfo.campus_virtual_url}
                        onChange={(e) => setCarreraInfo({ ...carreraInfo, campus_virtual_url: e.target.value })}
                        className="form-input"
                        placeholder="https://maestria.estadistica.fcpn.edu.bo"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <PhoneCall size={16} color="var(--color-green-inst)" />
                        <span>Teléfono / Central Telefónica</span>
                      </label>
                      <input
                        type="text"
                        value={carreraInfo.telefono}
                        onChange={(e) => setCarreraInfo({ ...carreraInfo, telefono: e.target.value })}
                        className="form-input"
                        placeholder="+591 (2) 279-2999"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Clock size={16} color="var(--color-green-inst)" />
                        <span>Horario de Atención Secretaría</span>
                      </label>
                      <input
                        type="text"
                        value={carreraInfo.horario_atencion}
                        onChange={(e) => setCarreraInfo({ ...carreraInfo, horario_atencion: e.target.value })}
                        className="form-input"
                        placeholder="Lunes a Viernes 08:30 - 18:30"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Award size={16} color="var(--color-green-inst)" />
                        <span>Dirección / Autoridad de Posgrado</span>
                      </label>
                      <input
                        type="text"
                        value={carreraInfo.director_nombre}
                        onChange={(e) => setCarreraInfo({ ...carreraInfo, director_nombre: e.target.value })}
                        className="form-input"
                        placeholder="Dirección de la Carrera de Estadística y Posgrado"
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="form-label">
                      <strong>IETA — Instituto de Estadística Teórica y Aplicada</strong> (Descripción Institucional)
                    </label>
                    <textarea
                      rows={3}
                      value={carreraInfo.ieta_descripcion}
                      onChange={(e) => setCarreraInfo({ ...carreraInfo, ieta_descripcion: e.target.value })}
                      className="form-textarea"
                      placeholder="Reseña, objetivos y líneas de investigación del IETA..."
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '2rem' }}>
                    <label className="form-label">
                      <strong>Club Científico de Estadística</strong> (Semilleros & Comunidad)
                    </label>
                    <textarea
                      rows={3}
                      value={carreraInfo.club_cientifico_descripcion}
                      onChange={(e) => setCarreraInfo({ ...carreraInfo, club_cientifico_descripcion: e.target.value })}
                      className="form-textarea"
                      placeholder="Actividades, hackathons y semilleros de investigación..."
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button
                      type="submit"
                      disabled={isSavingCarreraInfo}
                      className="btn btn-primary"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem', fontSize: '0.95rem' }}
                    >
                      <Save size={18} />
                      <span>{isSavingCarreraInfo ? 'Guardando en BD...' : 'Guardar Información Institucional'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 5. SECCIÓN DOCENTES (PLANTEL DOCENTE CON FOTO Y REDES) */}
            {activeTab === 'docentes' && (
              <div className="animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', color: 'var(--color-text-main)', fontWeight: 800, margin: 0 }}>
                      Planta Docente e Investigadores
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
                      Gestión de catedráticos, fotografía con resguardo en servidor, biografía y perfiles académicos.
                    </p>
                  </div>

                  <button
                    onClick={handleOpenCreateDocente}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <Plus size={16} />
                    <span>Registrar Docente</span>
                  </button>
                </div>

                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Fotografía</th>
                        <th>Docente / Investigador</th>
                        <th>Grado & Especialidad</th>
                        <th>Contacto</th>
                        <th>Perfiles Académicos</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {docentes.map((doc) => (
                        <tr key={doc.id}>
                          <td>
                            <img
                              src={doc.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                              alt={doc.nombre_completo}
                              style={{
                                width: '46px',
                                height: '46px',
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
                            <strong style={{ color: 'var(--color-text-main)' }}>{doc.nombre_completo}</strong>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>ID: {doc.id} · {doc.categoria || 'Docente Titular'}</div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{doc.titulo}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{doc.especialidad || 'Estadística Aplicada'}</div>
                          </td>
                          <td>
                            <div style={{ fontSize: '0.85rem' }}>{doc.email}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{doc.telefono || 'Sin teléfono'}</div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                              {doc.scholar && (
                                <a href={doc.scholar} target="_blank" rel="noopener noreferrer" className="badge badge-blue" style={{ textDecoration: 'none', fontSize: '0.68rem' }}>
                                  Scholar
                                </a>
                              )}
                              {doc.researchgate && (
                                <a href={doc.researchgate} target="_blank" rel="noopener noreferrer" className="badge badge-green" style={{ textDecoration: 'none', fontSize: '0.68rem' }}>
                                  RG
                                </a>
                              )}
                              {doc.linkedin && (
                                <a href={doc.linkedin} target="_blank" rel="noopener noreferrer" className="badge badge-blue" style={{ textDecoration: 'none', fontSize: '0.68rem' }}>
                                  LinkedIn
                                </a>
                              )}
                              {doc.orcid && (
                                <a href={doc.orcid} target="_blank" rel="noopener noreferrer" className="badge badge-amber" style={{ textDecoration: 'none', fontSize: '0.68rem' }}>
                                  ORCID
                                </a>
                              )}
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              <button
                                onClick={() => handleOpenEditDocente(doc)}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '0.35rem 0.6rem', color: 'var(--color-blue-steel)' }}
                                title="Editar docente"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteDocente(doc.id, doc.nombre_completo)}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '0.35rem 0.6rem', color: 'var(--color-status-danger)' }}
                                title="Eliminar docente"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
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

        {/* ===== MODALES (fuera del adm-shell, dentro del fragment) ===== */}

        {/* MODAL: CREAR MÓDULO */}
        {moduloModalOpen && (
          <div className="modal-overlay" onClick={() => setModuloModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
              <div className="modal-header">
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
                  Crear Nuevo Módulo Académico
                </h3>
                <button className="modal-close-btn" onClick={() => setModuloModalOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateModulo} className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nombre del Módulo</label>
                  <input
                    type="text"
                    required
                    value={moduloForm.nombre_mod}
                    onChange={(e) => setModuloForm({ ...moduloForm, nombre_mod: e.target.value })}
                    className="form-input"
                    placeholder="Ej. Módulo I: Fundamentos Estadísticos"
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button type="button" onClick={() => setModuloModalOpen(false)} className="btn btn-secondary">
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Guardar Módulo
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: AGREGAR MATERIA */}
        {materiaModalOpen && (
          <div className="modal-overlay" onClick={() => setMateriaModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
              <div className="modal-header">
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
                  Agregar Asignatura / Materia
                </h3>
                <button className="modal-close-btn" onClick={() => setMateriaModalOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveMateria} className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nombre de la Materia</label>
                  <input
                    type="text"
                    required
                    value={materiaForm.nombre_mat}
                    onChange={(e) => setMateriaForm({ ...materiaForm, nombre_mat: e.target.value })}
                    className="form-input"
                    placeholder="Ej. Inferencia Estadística y Modelamiento Bayesiano"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Créditos</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      required
                      value={materiaForm.creditos}
                      onChange={(e) => setMateriaForm({ ...materiaForm, creditos: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Carga Horaria (hrs)</label>
                    <input
                      type="number"
                      min="10"
                      max="200"
                      required
                      value={materiaForm.carga_horaria}
                      onChange={(e) => setMateriaForm({ ...materiaForm, carga_horaria: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Tipo de Materia</label>
                    <select
                      value={materiaForm.tipo}
                      onChange={(e) => setMateriaForm({ ...materiaForm, tipo: e.target.value })}
                      className="form-select"
                    >
                      <option value="Teórico-Práctica">Teórico-Práctica</option>
                      <option value="Laboratorio">Laboratorio Computacional</option>
                      <option value="Teórica">Teórica</option>
                      <option value="Práctica">Práctica</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Software Requerido</label>
                    <input
                      type="text"
                      value={materiaForm.software_requerido}
                      onChange={(e) => setMateriaForm({ ...materiaForm, software_requerido: e.target.value })}
                      className="form-input"
                      placeholder="Ej. R, Python, SPSS, SAS"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Docente Responsable</label>
                  <select
                    value={materiaForm.id_docente}
                    onChange={(e) => setMateriaForm({ ...materiaForm, id_docente: e.target.value })}
                    className="form-select"
                  >
                    <option value="">-- Sin docente asignado --</option>
                    {docentes.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.nombre_completo} ({d.titulo})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button type="button" onClick={() => setMateriaModalOpen(false)} className="btn btn-secondary">
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Guardar Asignatura
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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

        {/* MODAL: REGISTRAR / EDITAR DOCENTE */}
        {docenteModalOpen && (
          <div className="modal-overlay" onClick={() => setDocenteModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px', maxHeight: '90vh', overflowY: 'auto' }}>
              <div className="modal-header">
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
                  {editingDocente ? `Editar Docente: ${editingDocente.nombre_completo}` : 'Registrar Nuevo Docente'}
                </h3>
                <button className="modal-close-btn" onClick={() => setDocenteModalOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveDocente} className="modal-body">
                {/* SUBIDA DE FOTOGRAFÍA CON RESGUARDO LOCAL */}
                <div style={{
                  background: 'var(--color-bg-primary)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem',
                  border: '1.5px dashed var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem'
                }}>
                  <div style={{ position: 'relative' }}>
                    <img
                      src={docenteForm.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                      alt="Foto docente"
                      style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid var(--color-green-inst)',
                        background: '#e2e8f0'
                      }}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <label className="form-label" style={{ marginBottom: '0.3rem', fontWeight: 700 }}>
                      Fotografía del Docente (Resguardo en Servidor)
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Upload size={14} />
                        <span>{isUploadingDocFoto ? 'Subiendo imagen...' : 'Subir Imagen Local'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleDocenteFotoUpload}
                          disabled={isUploadingDocFoto}
                          style={{ display: 'none' }}
                        />
                      </label>
                      {docenteForm.foto_url && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-green-inst)', fontWeight: 600 }}>
                          ✓ Imagen guardada
                        </span>
                      )}
                    </div>
                    <input
                      type="url"
                      value={docenteForm.foto_url}
                      onChange={(e) => setDocenteForm({ ...docenteForm, foto_url: e.target.value })}
                      className="form-input"
                      placeholder="O ingrese enlace directo de imagen..."
                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Nombres</label>
                    <input
                      type="text"
                      required
                      value={docenteForm.nombre}
                      onChange={(e) => setDocenteForm({ ...docenteForm, nombre: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Apellidos</label>
                    <input
                      type="text"
                      required
                      value={docenteForm.apellido}
                      onChange={(e) => setDocenteForm({ ...docenteForm, apellido: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      required
                      value={docenteForm.email}
                      onChange={(e) => setDocenteForm({ ...docenteForm, email: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Teléfono</label>
                    <input
                      type="text"
                      value={docenteForm.telefono}
                      onChange={(e) => setDocenteForm({ ...docenteForm, telefono: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Título Académico</label>
                    <input
                      type="text"
                      required
                      value={docenteForm.titulo}
                      onChange={(e) => setDocenteForm({ ...docenteForm, titulo: e.target.value })}
                      className="form-input"
                      placeholder="Ej. PhD en Estadística"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Categoría Docente</label>
                    <select
                      value={docenteForm.categoria}
                      onChange={(e) => setDocenteForm({ ...docenteForm, categoria: e.target.value })}
                      className="form-select"
                    >
                      <option value="Titular">Titular</option>
                      <option value="Invitado Internacional">Invitado Internacional</option>
                      <option value="Investigador Titular">Investigador Titular</option>
                      <option value="Emérito">Emérito</option>
                      <option value="Interino">Interino</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Especialidad / Líneas de Investigación</label>
                  <input
                    type="text"
                    value={docenteForm.especialidad}
                    onChange={(e) => setDocenteForm({ ...docenteForm, especialidad: e.target.value })}
                    className="form-input"
                    placeholder="Ej. Modelamiento Espacial, Bioestadística, Machine Learning"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Biografía / Perfil Académico Resumido</label>
                  <textarea
                    rows={2}
                    value={docenteForm.bio}
                    onChange={(e) => setDocenteForm({ ...docenteForm, bio: e.target.value })}
                    className="form-textarea"
                    placeholder="Breve reseña sobre experiencia académica, publicaciones y proyectos..."
                  />
                </div>

                {/* REDES Y PERFILES ACADÉMICOS */}
                <div style={{ background: 'var(--color-bg-primary)', padding: '0.9rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-green-inst)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>
                    Perfiles Académicos & Redes de Investigación
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>Google Scholar</label>
                      <input
                        type="url"
                        value={docenteForm.scholar}
                        onChange={(e) => setDocenteForm({ ...docenteForm, scholar: e.target.value })}
                        className="form-input"
                        placeholder="https://scholar.google.com/..."
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>ResearchGate</label>
                      <input
                        type="url"
                        value={docenteForm.researchgate}
                        onChange={(e) => setDocenteForm({ ...docenteForm, researchgate: e.target.value })}
                        className="form-input"
                        placeholder="https://researchgate.net/profile/..."
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>LinkedIn</label>
                      <input
                        type="url"
                        value={docenteForm.linkedin}
                        onChange={(e) => setDocenteForm({ ...docenteForm, linkedin: e.target.value })}
                        className="form-input"
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>ORCID</label>
                      <input
                        type="url"
                        value={docenteForm.orcid}
                        onChange={(e) => setDocenteForm({ ...docenteForm, orcid: e.target.value })}
                        className="form-input"
                        placeholder="https://orcid.org/0000-..."
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button type="button" onClick={() => setDocenteModalOpen(false)} className="btn btn-secondary">
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Save size={16} />
                    <span>{editingDocente ? 'Actualizar Docente' : 'Guardar Docente'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}


    </>
  );
};
