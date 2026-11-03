import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  BookOpen,
  GraduationCap,
  Award,
  CheckCircle2,
  Clock,
  FileText,
  Calendar,
  Download,
  Share2,
  MessageCircle,
  Users,
  Compass,
  Laptop,
  Check,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CalendarDays,
  Sparkles,
  BarChart3,
  Brain,
  Database,
  Code2,
  Lightbulb,
  FileCheck2,
  CheckSquare,
  Square
} from 'lucide-react';
import { programaService } from '../../services/programaService';
import { facultyData } from '../../data/facultyData';
import { programsData } from '../../data/programsData';

// Banners oficiales para cada maestría y diplomado
import cardCienciaDatos from '../../assets/images/banner/card_maestria_ciencia_datos.png';
import cardTerminalEstadistica from '../../assets/images/banner/card_maestria_terminal_estadistica.png';
import cardDataMining from '../../assets/images/banner/card_diplomado_data_mining.png';

// Posts y Afiches oficiales individuales para cada programa
import postCienciaDatos from '../../assets/images/banner/post_maestria_ciencia_datos.png';
import postTerminalEstadistica from '../../assets/images/banner/post_maestria_terminal_estadistica.png';
import postDataMining from '../../assets/images/banner/post_diplomado_data_mining.jpg';

const getProgramBannerUrl = (prog) => {
  const id = (prog?.id || '').toLowerCase();
  const code = (prog?.code || '').toLowerCase();
  const title = (prog?.title || '').toLowerCase();

  if (id === 'pg-est-002' || id === 'msc-ciencia-datos' || code.includes('m01') || title.includes('ciencia') || title.includes('datos')) {
    return cardCienciaDatos;
  }
  if (id === 'pg-est-001' || id === 'msc-terminal-estadistica' || title.includes('terminal') || title.includes('estadística') || title.includes('estadistica') || title.includes('bioestadística') || title.includes('bioestadistica')) {
    return cardTerminalEstadistica;
  }
  if (id === 'pg-est-003' || id.includes('dip') || title.includes('mining') || title.includes('diplomado') || title.includes('métodos') || title.includes('metodos') || title.includes('machine learning') || title.includes('actuarial')) {
    return cardDataMining;
  }
  return cardCienciaDatos;
};

const getProgramPostUrl = (prog) => {
  const id = (prog?.id || '').toLowerCase();
  const code = (prog?.code || '').toLowerCase();
  const title = (prog?.title || '').toLowerCase();

  if (id === 'pg-est-002' || id === 'msc-ciencia-datos' || code.includes('m01') || title.includes('ciencia') || title.includes('datos')) {
    return postCienciaDatos;
  }
  if (id === 'pg-est-001' || id === 'msc-terminal-estadistica' || title.includes('terminal') || title.includes('estadística') || title.includes('estadistica') || title.includes('bioestadística') || title.includes('bioestadistica')) {
    return postTerminalEstadistica;
  }
  if (id === 'pg-est-003' || id.includes('dip') || title.includes('mining') || title.includes('diplomado') || title.includes('métodos') || title.includes('metodos') || title.includes('machine learning') || title.includes('actuarial')) {
    return postDataMining;
  }
  return postCienciaDatos;
};

// Helper to produce a direct download URL (handles Google Drive links directly)
const getDirectDownloadLink = (url) => {
  if (!url) return null;
  const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`;
  }
  return url;
};

export const ProgramDetailView = ({ programId, program: initialProgram, onBack, onNavigateToAdmission }) => {
  const [programData, setProgramData] = useState(initialProgram || null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('perfil');
  const [activeSemesterTab, setActiveSemesterTab] = useState(0);

  // Interactive Document Checklist State for "Requisitos"
  const [checkedDocs, setCheckedDocs] = useState({
    doc1: false,
    doc2: false,
    doc3: false,
    doc4: false,
    doc5: false,
    doc6: false
  });

  const toggleCheckDoc = (key) => {
    setCheckedDocs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const totalChecked = Object.values(checkedDocs).filter(Boolean).length;
  const totalDocs = Object.keys(checkedDocs).length;
  const progressPercent = Math.round((totalChecked / totalDocs) * 100);

  // Load program by ID or initialProgram
  useEffect(() => {
    const targetId = programId || initialProgram?.id || initialProgram?.code;
    if (!targetId) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchFullData = async () => {
      try {
        setLoading(true);
        const data = await programaService.getMalla(targetId);
        if (isMounted && data) {
          setProgramData(data);
        }
      } catch (err) {
        console.warn('Error cargando datos del programa:', err);
        const fallback = programsData.find(
          (p) => p.id === targetId || p.code === targetId || p.title === targetId
        );
        if (isMounted && fallback) {
          setProgramData((prev) => prev || fallback);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFullData();
    return () => {
      isMounted = false;
    };
  }, [programId, initialProgram?.id]);

  const prog = programData || initialProgram;

  const handleBackNavigation = () => {
    if (onBack) {
      onBack();
    } else {
      window.location.hash = 'programas';
    }
  };

  if (loading && !prog) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F5F5' }}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="spinner" style={{ margin: '0 auto 1.25rem' }} />
          <h3 style={{ color: '#373A40', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Cargando programa académico...</h3>
          <p style={{ color: '#646973', fontSize: '0.9rem' }}>Consultando base de datos oficial de posgrado UMSA</p>
        </div>
      </div>
    );
  }

  if (!prog) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 1rem', minHeight: '60vh' }}>
        <h2 style={{ color: '#373A40', marginBottom: '1rem', fontWeight: 800 }}>Programa no encontrado</h2>
        <p style={{ color: '#646973', marginBottom: '2rem' }}>
          El programa solicitado no existe o no se encuentra activo actualmente.
        </p>
        <button onClick={handleBackNavigation} className="btn btn-secondary">
          <ArrowLeft size={16} />
          <span>Volver al Catálogo de Programas</span>
        </button>
      </div>
    );
  }

  const isMaster = (prog.type || '').toLowerCase().includes('maestr') ||
    prog.typeFilter === 'maestria' ||
    prog.typeFilter === 'terminal' ||
    prog.typeFilter === 'autofinanciada' ||
    (prog.title || '').toLowerCase().includes('maestr');

  const curriculum = prog.curriculum || [];
  const targetAudienceText = prog.perfil_aspirante || prog.targetAudience || 
    'Profesionales con grado de Licenciatura en Estadística, Informática, Sistemas, Matemáticas, Economía, Ingeniería y carreras afines interesadas en la modelación cuantitativa, analítica avanzada y computación científica.';

  const graduateProfileText = prog.perfil_egreso || prog.graduateProfile || 
    'El egresado poseerá sólidas competencias teóricas y metodológicas aplicadas para formular modelos estocásticos, procesar grandes volúmenes de datos, liderar equipos analíticos y formular soluciones innovadoras en organizaciones públicas, privadas o centros de investigación.';

  const titulationText = prog.modalidad_titulacion || 
    (prog.titulationOptions && prog.titulationOptions.map(t => `${t.name}: ${t.desc}`).join('\n\n')) ||
    '1. Tesis de Grado de Maestría con sustentación pública ante tribunal evaluador.\n2. Publicación de artículo científico indexado (Scopus / SciELO / Web of Science).\n3. Trabajo Dirigido de Posgrado con impacto institucional medible.';

  // Links directos de descarga
  const rawConvocatoriaUrl = prog.enlace_convocatoria_drive || prog.enlace_pdf_programa || 'https://drive.google.com/file/d/1FIBzOG85Nbnv3e-qpM-oTp6ovy1WEqo7/view?usp=drive_link';
  const directDownloadConvocatoria = getDirectDownloadLink(rawConvocatoriaUrl) || rawConvocatoriaUrl;

  const rawMallaUrl = prog.enlace_pdf_programa || prog.enlace_convocatoria_drive || 'https://drive.google.com/file/d/1FIBzOG85Nbnv3e-qpM-oTp6ovy1WEqo7/view?usp=drive_link';
  const directDownloadMalla = getDirectDownloadLink(rawMallaUrl) || rawMallaUrl;

  const whatsappMessage = encodeURIComponent(
    `Hola, solicito información y orientación sobre el programa: ${prog.title} (Código: ${prog.code || prog.id || ''})`
  );

  const tabConfigs = [
    {
      id: 'perfil',
      label: 'Perfil Académico',
      icon: Compass,
      color: '#2563EB',
      gradient: 'linear-gradient(135deg, #1D4ED8 0%, #3B82F6 100%)',
      subtleBg: '#EFF6FF',
      borderColor: '#BFDBFE',
      textColor: '#1D4ED8'
    },
    {
      id: 'materias',
      label: 'Materias y Malla',
      icon: BookOpen,
      color: '#059669',
      gradient: 'linear-gradient(135deg, #047857 0%, #10B981 100%)',
      subtleBg: '#ECFDF5',
      borderColor: '#A7F3D0',
      textColor: '#047857'
    },
    {
      id: 'docentes',
      label: 'Docentes',
      icon: Users,
      color: '#7C3AED',
      gradient: 'linear-gradient(135deg, #6D28D9 0%, #8B5CF6 100%)',
      subtleBg: '#F5F3FF',
      borderColor: '#DDD6FE',
      textColor: '#6D28D9'
    },
    {
      id: 'requisitos',
      label: 'Requisitos',
      icon: FileText,
      color: '#D97706',
      gradient: 'linear-gradient(135deg, #B45309 0%, #F59E0B 100%)',
      subtleBg: '#FFFBEB',
      borderColor: '#FDE68A',
      textColor: '#B45309'
    },
    {
      id: 'fechas',
      label: 'Fechas y Horarios',
      icon: CalendarDays,
      color: '#DC2626',
      gradient: 'linear-gradient(135deg, #B91C1C 0%, #EF4444 100%)',
      subtleBg: '#FEF2F2',
      borderColor: '#FECACA',
      textColor: '#B91C1C'
    }
  ];

  const heroBannerUrl = getProgramBannerUrl(prog);
  const programPostUrl = getProgramPostUrl(prog);

  return (
    <div className="program-detail-root animate-fade-in" style={{ backgroundColor: '#F0F2F5', minHeight: '100vh', color: '#373A40', paddingBottom: '5rem' }}>
      
      {/* ── 1. Top Bar Navigation ── */}
      <nav style={{
        background: 'rgba(15,20,30,0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '0.7rem 0',
        position: 'sticky',
        top: '78px',
        zIndex: 40,
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <button
              onClick={handleBackNavigation}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#86EFAC',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.65rem',
                borderRadius: '6px',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(134,239,172,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <ArrowLeft size={16} />
              <span>Volver al Catálogo</span>
            </button>
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>/</span>
            <span style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>{prog.type || (isMaster ? 'Maestría' : 'Diplomado')}</span>
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>/</span>
            <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700, maxWidth: '380px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {prog.title}
            </span>
          </div>
        </div>
      </nav>

      {/* ── 2. HERO: Banner full-width a pantalla completa con botones superpuestos ── */}
      <section style={{
        position: 'relative',
        width: '100%',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        backgroundColor: '#0F172A',
        lineHeight: 0
      }}>
        {/* Imagen del Banner a todo lo ancho de la pantalla */}
        <img
          src={heroBannerUrl}
          alt={prog.title || 'Banner del Programa'}
          style={{
            width: '100%',
            height: 'auto',
            minHeight: '240px',
            maxHeight: '520px',
            display: 'block',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />

        {/* Overlay degradado inferior para máximo contraste y legibilidad */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(15,23,42,0.15) 0%, rgba(15,23,42,0.3) 50%, rgba(15,23,42,0.85) 100%)',
          pointerEvents: 'none',
        }} />

        {/* Botones de acción SUPERPUESTOS directamente sobre el Banner */}
        <div className="hero-buttons-overlay" style={{
          position: 'absolute',
          bottom: '1.25rem',
          right: '1.5rem',
          display: 'flex',
          gap: '0.85rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'flex-end',
          zIndex: 10,
        }}>
          {/* BOTÓN DESCARGA DIRECTA DE CONVOCATORIA (Verde Esmeralda Corporativo) */}
          <a
            href={directDownloadConvocatoria}
            target="_blank"
            rel="noopener noreferrer"
            download
            style={{
              background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.92rem',
              padding: '0.8rem 1.6rem',
              borderRadius: '10px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              border: '1.5px solid rgba(255, 255, 255, 0.35)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45), 0 2px 8px rgba(5, 150, 105, 0.4)',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.55), 0 4px 14px rgba(16, 185, 129, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.45), 0 2px 8px rgba(5, 150, 105, 0.4)';
            }}
          >
            <Download size={18} strokeWidth={2.4} />
            <span>Descargar Convocatoria Oficial (PDF)</span>
          </a>

          {/* BOTÓN CONSULTAR POR WHATSAPP (Verde WhatsApp Vibrante) */}
          <a
            href={`https://wa.me/59176543210?text=${whatsappMessage}`}
            target="_blank"
            rel="noreferrer"
            style={{
              background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.92rem',
              padding: '0.8rem 1.6rem',
              borderRadius: '10px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.55rem',
              border: '1.5px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45), 0 2px 8px rgba(37, 211, 102, 0.4)',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.55), 0 4px 14px rgba(37, 211, 102, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.45), 0 2px 8px rgba(37, 211, 102, 0.4)';
            }}
          >
            <MessageCircle size={18} color="#FFFFFF" strokeWidth={2.4} />
            <span>Consultar por WhatsApp</span>
          </a>
        </div>
      </section>

      {/* ── 3. Quick Info Strip: Pegado directamente sin espacios, variedad de colores en métricas ── */}
      <section style={{ position: 'relative', zIndex: 20, margin: 0, padding: 0 }}>
        <div style={{
          background: '#0B132B',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          margin: 0,
          padding: 0,
        }} className="quick-info-strip">

          {[
            {
              label: 'MODALIDAD',
              value: prog.modality || 'Híbrida Turno Noche',
              sub: 'Clases virtuales síncronas grabadas',
              accent: '#34D399',
              bg: 'rgba(52, 211, 153, 0.08)',
              border: 'rgba(52, 211, 153, 0.2)'
            },
            {
              label: 'DURACIÓN Y CRÉDITOS',
              value: prog.duration || (isMaster ? '24 meses' : '6 Meses'),
              sub: prog.credits ? `${prog.credits} Créditos CEUB` : 'Acreditado SNC CEUB',
              accent: '#60A5FA',
              bg: 'rgba(96, 165, 250, 0.08)',
              border: 'rgba(96, 165, 250, 0.2)'
            },
            {
              label: 'SEDE Y CAMPUS',
              value: 'Campus Universitario Cota Cota',
              sub: 'Edificio FCPN, La Paz, Bolivia',
              accent: '#C084FC',
              bg: 'rgba(192, 132, 252, 0.08)',
              border: 'rgba(192, 132, 252, 0.2)'
            },
            {
              label: 'GRADO ACADÉMICO',
              value: prog.degree || (isMaster ? 'M.Sc. en Ciencia de Datos' : 'Diploma de Posgrado'),
              sub: 'Homologación CEUB / UMSA',
              accent: '#FB923C',
              bg: 'rgba(251, 146, 60, 0.08)',
              border: 'rgba(251, 146, 60, 0.2)'
            },
          ].map((item, i) => (
            <div key={i} style={{
              padding: '1.15rem 1.4rem',
              borderRight: i < 3 ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
              background: item.bg,
              transition: 'background 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
              <div style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                color: item.accent,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: item.accent }} />
                <span>{item.label}</span>
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.3 }}>
                {item.value}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.55)', marginTop: '0.2rem' }}>
                {item.sub}
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* ── 4. Navegación de Pestañas — conectada directamente sin huecos vacíos ── */}
      <div style={{ background: '#F8FAFC', padding: 0 }}>
        <div className="container" style={{ paddingTop: '1.25rem' }}>

        {/* DESKTOP: TAB BUTTONS BAR - Todos visibles en pantalla */}
        <div className="program-nav-tabs-desktop" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '0.5rem',
          paddingBottom: '0.75rem',
          marginBottom: '2rem',
          borderBottom: '2px solid #DCE1E6'
        }}>
          {tabConfigs.map((tab) => {
            const isActive = activeTab === tab.id;
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.75rem 0.5rem',
                  borderRadius: '8px',
                  border: isActive ? `1.5px solid ${tab.color}` : `1.5px solid ${tab.borderColor}`,
                  background: isActive ? tab.gradient : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#373A40',
                  boxShadow: isActive ? '0 4px 14px rgba(0,100,0,0.22)' : '0 1px 3px rgba(55,58,64,0.04)',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                  justifyContent: 'center',
                  width: '100%',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = tab.subtleBg;
                    e.currentTarget.style.borderColor = tab.color;
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = '#FFFFFF';
                    e.currentTarget.style.borderColor = tab.borderColor;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                <div style={{
                  width: '22px', height: '22px', borderRadius: '5px', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  background: isActive ? 'rgba(255,255,255,0.22)' : tab.subtleBg,
                  color: isActive ? '#FFFFFF' : tab.color
                }}>
                  <IconComponent size={14} />
                </div>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* MÓVIL: Barra Desplegable 100% Responsiva */}
        <div className="program-nav-tabs-mobile" style={{ marginBottom: '1.75rem' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <label htmlFor="tab-dropdown-select" style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#006400',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.35rem'
            }}>
              Sección del Programa
            </label>
            <div style={{ position: 'relative' }}>
              <select
                id="tab-dropdown-select"
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.85rem 2.5rem 0.85rem 1rem',
                  borderRadius: '10px',
                  border: '2px solid #006400',
                  background: '#FFFFFF',
                  color: '#006400',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  boxShadow: '0 4px 12px rgba(0, 100, 0, 0.1)',
                  cursor: 'pointer'
                }}
              >
                {tabConfigs.map((t) => (
                  <option key={t.id} value={t.id} style={{ color: '#373A40', fontWeight: 600 }}>
                    {t.label}
                  </option>
                ))}
              </select>
              <div style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: '#006400',
                display: 'flex',
                alignItems: 'center'
              }}>
                <ChevronDown size={20} strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </div>

        {/* ── LAYOUT PRINCIPAL: 2 columnas — contenido tabs (izq) + post lateral (der) ── */}
        <div className="tab-layout-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 280px',
          gap: '1.75rem',
          alignItems: 'start',
        }}>

          {/* ── Columna izquierda: contenido de pestañas ── */}
          <div>

        {/* ── TAB 1: PERFIL ACADÉMICO ── */}
        {activeTab === 'perfil' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Visual Header Banner Corporativo */}
            <div style={{
              background: 'linear-gradient(135deg, #2A5A84 0%, #4682B4 100%)',
              color: '#FFFFFF',
              borderRadius: '12px',
              padding: '1.75rem 2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.25rem',
              boxShadow: '0 6px 20px rgba(70, 130, 180, 0.25)'
            }}>
              <div style={{ maxWidth: '640px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.18)', padding: '0.25rem 0.65rem', borderRadius: '99px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.6rem' }}>
                  <Sparkles size={14} />
                  <span>Excelencia Académica de Posgrado</span>
                </div>
                <h3 style={{ margin: '0 0 0.35rem 0', fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF' }}>
                  Perfil Académico & Oportunidades Profesionales
                </h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#E6EBF5', lineHeight: 1.5 }}>
                  Formación rigurosa orientada a resolver problemas cuantitativos complejos en sectores estratégicos.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.14)', backdropFilter: 'blur(8px)', padding: '0.65rem 1rem', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.25)' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>100%</div>
                  <div style={{ fontSize: '0.72rem', color: '#E6EBF5' }}>Acreditado CEUB</div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.14)', backdropFilter: 'blur(8px)', padding: '0.65rem 1rem', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.25)' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>4to Nivel</div>
                  <div style={{ fontSize: '0.72rem', color: '#E6EBF5' }}>Grado Científico</div>
                </div>
              </div>
            </div>

            {/* Perfil del Aspirante & Áreas */}
            <div style={cleanPanelStyle}>
              <div style={sectionHeaderStyle('#E6EBF5', '#4682B4')}>
                <div style={iconBadgeStyle('#E6EBF5', '#4682B4')}>
                  <Compass size={22} />
                </div>
                <div>
                  <h3 style={sectionTitleStyle}>¿A quiénes va dirigido? (Perfil del Aspirante)</h3>
                  <p style={sectionSubtitleStyle}>Requisitos de formación previa y perfil de ingreso idóneo</p>
                </div>
              </div>

              <div style={{
                background: '#EBE6DA',
                borderRadius: '8px',
                padding: '1.25rem 1.5rem',
                border: '1px solid #DCE1E6',
                fontSize: '0.98rem',
                color: '#373A40',
                lineHeight: 1.75,
                whiteSpace: 'pre-line'
              }}>
                {targetAudienceText}
              </div>

              {/* Tarjetas Visuales con Iconos de Áreas Profesionales */}
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#006400', textTransform: 'uppercase', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Lightbulb size={16} color="#006400" />
                  <span>Áreas Disciplinares y Profesionales Idóneas:</span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '0.85rem'
                }}>
                  {[
                    { title: 'Estadística & Biometría', desc: 'Modelación, muestreo e inferencia', icon: BarChart3, color: '#006400', bg: '#DCF5DC' },
                    { title: 'Informática & Sistemas', desc: 'Arquitectura de datos y computación', icon: Code2, color: '#4682B4', bg: '#E6EBF5' },
                    { title: 'Matemáticas & Física', desc: 'Fundamentación probabilística', icon: Brain, color: '#006400', bg: '#DCF5DC' },
                    { title: 'Economía & Finanzas', desc: 'Econometría y series de tiempo', icon: Database, color: '#4682B4', bg: '#E6EBF5' }
                  ].map((area, idx) => {
                    const AreaIcon = area.icon;
                    return (
                      <div key={idx} style={{
                        background: '#FFFFFF',
                        border: '1.5px solid #DCE1E6',
                        borderRadius: '8px',
                        padding: '1rem',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        transition: 'all 0.15s ease'
                      }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: area.bg, color: area.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <AreaIcon size={18} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#373A40' }}>{area.title}</div>
                          <div style={{ fontSize: '0.78rem', color: '#646973', marginTop: '0.15rem' }}>{area.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Perfil del Graduado */}
            <div style={cleanPanelStyle}>
              <div style={sectionHeaderStyle('#DCF5DC', '#006400')}>
                <div style={iconBadgeStyle('#DCF5DC', '#006400')}>
                  <GraduationCap size={22} />
                </div>
                <div>
                  <h3 style={sectionTitleStyle}>Perfil del Graduado & Competencias</h3>
                  <p style={sectionSubtitleStyle}>Capacidades científicas, analíticas y de liderazgo que desarrollará el egresado</p>
                </div>
              </div>

              <div style={{
                background: '#EBE6DA',
                borderRadius: '8px',
                padding: '1.25rem 1.5rem',
                border: '1px solid #DCE1E6',
                fontSize: '0.98rem',
                color: '#373A40',
                lineHeight: 1.75,
                whiteSpace: 'pre-line',
                marginBottom: '1.5rem'
              }}>
                {graduateProfileText}
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1rem'
              }}>
                <div style={{ background: '#FFFFFF', border: '1.5px solid #DCE1E6', borderRadius: '8px', padding: '1.25rem', boxShadow: '0 2px 6px rgba(55,58,64,0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#006400' }} />
                    <div style={{ fontWeight: 800, color: '#373A40', fontSize: '0.95rem' }}>
                      Modelación & Analítica Avanzada
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#646973', lineHeight: 1.55 }}>
                    Capacidad para estructurar e interpretar modelos estocásticos, algoritmos predictivos y aprendizaje automático sobre datos complejos.
                  </p>
                </div>

                <div style={{ background: '#FFFFFF', border: '1.5px solid #DCE1E6', borderRadius: '8px', padding: '1.25rem', boxShadow: '0 2px 6px rgba(55,58,64,0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4682B4' }} />
                    <div style={{ fontWeight: 800, color: '#373A40', fontSize: '0.95rem' }}>
                      Toma de Decisiones Estratégicas
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#646973', lineHeight: 1.55 }}>
                    Liderazgo de proyectos analíticos en instituciones financieras, entidades públicas, organismos internacionales e industria tecnológica.
                  </p>
                </div>

                <div style={{ background: '#FFFFFF', border: '1.5px solid #DCE1E6', borderRadius: '8px', padding: '1.25rem', boxShadow: '0 2px 6px rgba(55,58,64,0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#32CD32' }} />
                    <div style={{ fontWeight: 800, color: '#373A40', fontSize: '0.95rem' }}>
                      Investigación Reproducible
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#646973', lineHeight: 1.55 }}>
                    Generación de nuevo conocimiento mediante publicaciones indexadas y proyectos reproducibles con R, Python y entornos modernos.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ── TAB 2: MATERIAS & MALLA CURRICULAR (#006400 Institucional) ── */}
        {activeTab === 'materias' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            
            {/* Header del bloque con botón de Descarga Directa */}
            <div style={{
              background: 'linear-gradient(135deg, #004D00 0%, #006400 100%)',
              color: '#FFFFFF',
              borderRadius: '12px',
              padding: '1.5rem 2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              boxShadow: '0 6px 20px rgba(0, 100, 0, 0.3)'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF' }}>
                  Plan de Estudios y Estructura Modular
                </h3>
                <div style={{ fontSize: '0.875rem', color: '#DCF5DC', marginTop: '0.25rem' }}>
                  Homologado por el CEUB | Total: <strong>{prog.credits || '72'} créditos</strong> | Modalidad: <strong>{prog.modality || 'Híbrida'}</strong>
                </div>
              </div>

              {/* BOTÓN DESCARGA DIRECTA DE MALLA EN PDF */}
              <a
                href={directDownloadMalla}
                target="_blank"
                rel="noopener noreferrer"
                download
                style={{
                  background: '#FFFFFF',
                  color: '#006400',
                  borderRadius: '6px',
                  padding: '0.7rem 1.35rem',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none',
                  border: '1.5px solid #32CD32',
                  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.12)',
                  cursor: 'pointer'
                }}
              >
                <Download size={17} />
                <span>Descargar Malla Curricular (PDF)</span>
              </a>
            </div>

            {/* Render de asignaturas */}
            {curriculum.length === 0 ? (
              <div style={{
                background: '#FFFFFF',
                border: '1.5px dashed #C8CDD2',
                borderRadius: '10px',
                padding: '3rem 2rem',
                textAlign: 'center',
                color: '#646973'
              }}>
                <BookOpen size={40} style={{ color: '#006400', marginBottom: '0.75rem' }} />
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#373A40', fontWeight: 800 }}>Plan de Estudios Modular</h4>
                <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.9rem', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
                  El plan de estudios detallado se encuentra registrado en el documento oficial de convocatoria descargable.
                </p>
                <a
                  href={directDownloadConvocatoria}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', borderColor: '#006400', color: '#006400' }}
                >
                  <Download size={14} />
                  <span>Descargar Convocatoria con Malla (PDF)</span>
                </a>
              </div>
            ) : (
              <div>
                {/* Selector de Semestre / Módulo si hay varios */}
                {curriculum.length > 1 && (
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    overflowX: 'auto',
                    paddingBottom: '0.65rem',
                    marginBottom: '1.25rem',
                    borderBottom: '1px solid #DCE1E6'
                  }}>
                    {curriculum.map((sem, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => setActiveSemesterTab(sIdx)}
                        style={{
                          background: activeSemesterTab === sIdx ? '#006400' : '#FFFFFF',
                          color: activeSemesterTab === sIdx ? '#FFFFFF' : '#373A40',
                          border: activeSemesterTab === sIdx ? '1.5px solid #006400' : '1.5px solid #DCE1E6',
                          borderRadius: '6px',
                          padding: '0.6rem 1.15rem',
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          boxShadow: activeSemesterTab === sIdx ? '0 2px 8px rgba(0, 100, 0, 0.3)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {sem.semester}
                        <span style={{
                          marginLeft: '0.45rem',
                          fontSize: '0.75rem',
                          opacity: activeSemesterTab === sIdx ? 0.95 : 0.7,
                          background: activeSemesterTab === sIdx ? 'rgba(255,255,255,0.25)' : '#E6EBF5',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '99px'
                        }}>
                          {sem.modules?.length || 0}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Mostrar materias del semestre activo */}
                {curriculum[activeSemesterTab] && (
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1rem',
                      padding: '0.25rem 0'
                    }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#373A40' }}>
                        {curriculum[activeSemesterTab].semester}
                      </div>
                      <span style={{ fontSize: '0.825rem', color: '#006400', fontWeight: 700, background: '#DCF5DC', padding: '0.25rem 0.65rem', borderRadius: '6px' }}>
                        {curriculum[activeSemesterTab].modules.length} materias programadas
                      </span>
                    </div>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                      {curriculum[activeSemesterTab].modules.map((mod, mIdx) => (
                        <div
                          key={mIdx}
                          style={{
                            background: '#FFFFFF',
                            border: '1.5px solid #DCE1E6',
                            borderRadius: '8px',
                            padding: '1.25rem 1.5rem',
                            boxShadow: '0 2px 6px rgba(55, 58, 64, 0.03)'
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            flexWrap: 'wrap',
                            gap: '0.75rem',
                            marginBottom: '0.5rem'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                              <span style={{
                                fontFamily: 'monospace',
                                fontWeight: 800,
                                fontSize: '0.825rem',
                                color: '#006400',
                                background: '#DCF5DC',
                                padding: '0.25rem 0.65rem',
                                borderRadius: '4px',
                                border: '1px solid #98DF98'
                              }}>
                                {mod.code}
                              </span>
                              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#373A40' }}>
                                {mod.name}
                              </h4>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                              <span style={{
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                color: '#373A40',
                                background: '#E6EBF5',
                                padding: '0.25rem 0.6rem',
                                borderRadius: '4px'
                              }}>
                                {mod.credits} Créditos ({mod.hours} hrs)
                              </span>
                              <span style={{
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                color: '#006400',
                                background: '#DCF5DC',
                                padding: '0.25rem 0.6rem',
                                borderRadius: '4px',
                                border: '1px solid #98DF98'
                              }}>
                                {mod.type || 'Teórico-Práctica'}
                              </span>
                            </div>
                          </div>

                          {mod.desc && (
                            <p style={{ fontSize: '0.9rem', color: '#646973', margin: '0.5rem 0', lineHeight: 1.6 }}>
                              {mod.desc}
                            </p>
                          )}

                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.5rem',
                            fontSize: '0.825rem',
                            color: '#646973',
                            flexWrap: 'wrap',
                            borderTop: '1px dashed #DCE1E6',
                            paddingTop: '0.65rem',
                            marginTop: '0.5rem'
                          }}>
                            {mod.software && (
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#006400', fontWeight: 600 }}>
                                <Laptop size={14} color="#006400" />
                                <span><strong>Herramientas:</strong> {mod.software}</span>
                              </div>
                            )}
                            {mod.prerequisites && mod.prerequisites !== 'Ninguno' && (
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#B8860B' }}>
                                <span><strong>Prerrequisito:</strong> {mod.prerequisites}</span>
                              </div>
                            )}
                            {mod.docentes && (
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#4682B4' }}>
                                <Users size={14} color="#4682B4" />
                                <span><strong>Docente:</strong> {mod.docentes}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: EQUIPO DOCENTE (#4682B4 Azul Acero & #6495ED) ── */}
        {activeTab === 'docentes' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            
            <div style={cleanPanelStyle}>
              <div style={sectionHeaderStyle('#E6EBF5', '#4682B4')}>
                <div style={iconBadgeStyle('#E6EBF5', '#4682B4')}>
                  <Users size={22} />
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h3 style={sectionTitleStyle}>Planta Docente & Investigadores</h3>
                    <p style={sectionSubtitleStyle}>Profesores con títulos de Doctorado (Ph.D.) y Maestría de universidades de prestigio</p>
                  </div>
                  <span style={{ fontSize: '0.82rem', color: '#006400', fontWeight: 700, background: '#DCF5DC', border: '1px solid #98DF98', padding: '0.35rem 0.75rem', borderRadius: '6px' }}>
                    Catedráticos Acreditados CEUB
                  </span>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.25rem'
              }}>
                {facultyData.map((doc, idx) => {
                  const DOC_COLORS = [
                    { theme: '#2563EB', lightBg: '#EFF6FF', border: '#BFDBFE', darkText: '#1D4ED8' },
                    { theme: '#059669', lightBg: '#ECFDF5', border: '#A7F3D0', darkText: '#047857' },
                    { theme: '#7C3AED', lightBg: '#F5F3FF', border: '#DDD6FE', darkText: '#6D28D9' },
                    { theme: '#D97706', lightBg: '#FFFBEB', border: '#FDE68A', darkText: '#B45309' },
                    { theme: '#0891B2', lightBg: '#ECFEFF', border: '#A5F3FC', darkText: '#0E7490' },
                    { theme: '#DC2626', lightBg: '#FEF2F2', border: '#FECACA', darkText: '#B91C1C' }
                  ];
                  const col = DOC_COLORS[idx % DOC_COLORS.length];

                  return (
                    <div
                      key={doc.id}
                      style={{
                        background: '#FFFFFF',
                        border: `1.5px solid ${col.border}`,
                        borderTop: `4px solid ${col.theme}`,
                        borderRadius: '10px',
                        padding: '1.4rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
                        transition: 'all 0.18s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 8px 22px rgba(0, 0, 0, 0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.04)';
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.85rem' }}>
                          <img
                            src={doc.avatar}
                            alt={doc.name}
                            style={{
                              width: '58px',
                              height: '58px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: `2.5px solid ${col.theme}`,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                          />
                          <div>
                            <h4 style={{ margin: '0 0 0.15rem 0', fontSize: '1rem', fontWeight: 900, color: '#1E293B' }}>
                              {doc.name}
                            </h4>
                            <div style={{
                              display: 'inline-block',
                              fontSize: '0.74rem',
                              color: col.darkText,
                              background: col.lightBg,
                              border: `1px solid ${col.border}`,
                              fontWeight: 800,
                              padding: '0.15rem 0.5rem',
                              borderRadius: '4px',
                              marginTop: '0.15rem'
                            }}>
                              {doc.degree}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '0.2rem' }}>
                              {doc.university}
                            </div>
                          </div>
                        </div>

                        <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.55, margin: '0 0 0.85rem 0' }}>
                          {doc.bio}
                        </p>
                      </div>

                      <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '0.75rem' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: col.theme, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>
                          Especialidad / Línea:
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#1E293B', fontWeight: 600 }}>
                          {doc.specialty}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ── TAB 4: REQUISITOS DE ADMISIÓN (Verde Corporativo & Checklist Interactivo) ── */}
        {activeTab === 'requisitos' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            
            {/* Banner de Descarga Directa de Requisitos */}
            <div style={{
              background: 'linear-gradient(135deg, #004D00 0%, #006400 100%)',
              color: '#FFFFFF',
              borderRadius: '12px',
              padding: '1.75rem 2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.25rem',
              boxShadow: '0 6px 20px rgba(0, 100, 0, 0.3)'
            }}>
              <div>
                <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF' }}>
                  Documento Oficial de Convocatoria & Requisitos
                </h3>
                <p style={{ margin: 0, fontSize: '0.92rem', color: '#DCF5DC', maxWidth: '600px' }}>
                  Descarga directa en formato PDF con las bases, perfil de postulación, cronograma y etapas de selección.
                </p>
              </div>

              {/* BOTÓN DESCARGA DIRECTA */}
              <a
                href={directDownloadConvocatoria}
                target="_blank"
                rel="noopener noreferrer"
                download
                style={{
                  background: '#FFFFFF',
                  color: '#006400',
                  borderRadius: '6px',
                  padding: '0.8rem 1.6rem',
                  fontSize: '0.925rem',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none',
                  border: '1.5px solid #32CD32',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
                  cursor: 'pointer'
                }}
              >
                <Download size={18} />
                <span>Descargar PDF de Requisitos</span>
              </a>
            </div>

            {/* Checklist Interactivo y Fácil de Usar para Postulantes */}
            <div style={cleanPanelStyle}>
              <div style={sectionHeaderStyle('#DCF5DC', '#006400')}>
                <div style={iconBadgeStyle('#DCF5DC', '#006400')}>
                  <FileCheck2 size={22} />
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h3 style={sectionTitleStyle}>Verificador Interactivo de Documentación</h3>
                    <p style={sectionSubtitleStyle}>Marca los documentos que tienes listos para calcular tu avance de postulación</p>
                  </div>
                  
                  <div style={{
                    background: progressPercent === 100 ? '#DCF5DC' : '#FFF5DC',
                    border: `1.5px solid ${progressPercent === 100 ? '#98DF98' : '#E6D2A8'}`,
                    padding: '0.4rem 0.85rem',
                    borderRadius: '6px',
                    fontSize: '0.825rem',
                    fontWeight: 800,
                    color: progressPercent === 100 ? '#006400' : '#B8860B'
                  }}>
                    {totalChecked} de {totalDocs} documentos listos ({progressPercent}%)
                  </div>
                </div>
              </div>

              {/* Barra de progreso interactiva (#006400 / #32CD32) */}
              <div style={{ width: '100%', height: '8px', background: '#DCE1E6', borderRadius: '99px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                <div style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  background: progressPercent === 100 ? 'linear-gradient(90deg, #32CD32, #006400)' : 'linear-gradient(90deg, #4682B4, #006400)',
                  transition: 'width 0.3s ease'
                }} />
              </div>

              {/* Lista interactiva de checkboxes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { id: 'doc1', title: 'Fotocopia legalizada del Título en Provisión Nacional (Grado Licenciatura)' },
                  { id: 'doc2', title: 'Fotocopia legalizada del Diploma Académico de Licenciatura' },
                  { id: 'doc3', title: 'Certificado de Nacimiento original y Cédula de Identidad vigente' },
                  { id: 'doc4', title: 'Currículum Vitae documentado y foliado según reglamento' },
                  { id: 'doc5', title: 'Carta de motivación y solicitud de postulación dirigida al Coordinador' },
                  { id: 'doc6', title: 'Formulario oficial de preinscripción digital completado' }
                ].map((item) => {
                  const isChecked = checkedDocs[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleCheckDoc(item.id)}
                      style={{
                        background: isChecked ? '#DCF5DC' : '#FFFFFF',
                        border: isChecked ? '1.5px solid #006400' : '1.5px solid #DCE1E6',
                        borderRadius: '6px',
                        padding: '0.9rem 1.15rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.85rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ color: isChecked ? '#006400' : '#C8CDD2', display: 'flex', alignItems: 'center' }}>
                        {isChecked ? <CheckSquare size={20} /> : <Square size={20} />}
                      </div>
                      <span style={{
                        fontSize: '0.925rem',
                        color: isChecked ? '#006400' : '#373A40',
                        fontWeight: isChecked ? 700 : 500
                      }}>
                        {item.title}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Steps / Pasos de Postulación */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem',
                borderTop: '1px solid #DCE1E6',
                paddingTop: '1.5rem',
                marginTop: '1.5rem'
              }}>
                <div style={{ background: '#FFFFFF', border: '1.5px solid #DCE1E6', borderRadius: '6px', padding: '1rem' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#4682B4', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                    Paso 1
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#373A40', marginBottom: '0.2rem' }}>
                    Preinscripción Digital
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#646973' }}>
                    Completar el formulario en línea y cargar comprobante digital
                  </div>
                </div>

                <div style={{ background: '#FFFFFF', border: '1.5px solid #DCE1E6', borderRadius: '6px', padding: '1rem' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#006400', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                    Paso 2
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#373A40', marginBottom: '0.2rem' }}>
                    Entrega de Carpeta
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#646973' }}>
                    Presentación de títulos legalizados y foliados en Posgrado
                  </div>
                </div>

                <div style={{ background: '#FFFFFF', border: '1.5px solid #DCE1E6', borderRadius: '6px', padding: '1rem' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#4682B4', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                    Paso 3
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#373A40', marginBottom: '0.2rem' }}>
                    Evaluación de Méritos
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#646973' }}>
                    Revisión por la Comisión Académica Evaluadora
                  </div>
                </div>

                <div style={{ background: '#FFFFFF', border: '1.5px solid #DCE1E6', borderRadius: '6px', padding: '1rem' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#006400', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                    Paso 4
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#373A40', marginBottom: '0.2rem' }}>
                    Admisión y Matrícula
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#646973' }}>
                    Generación de código CPT y habilitación de campus virtual
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}


        {/* ── TAB 6: FECHAS & HORARIOS (Azul Acero #4682B4 & #E6EBF5) ── */}
        {activeTab === 'fechas' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <div style={cleanPanelStyle}>
              <div style={sectionHeaderStyle('#E6EBF5', '#4682B4')}>
                <div style={iconBadgeStyle('#E6EBF5', '#4682B4')}>
                  <CalendarDays size={22} />
                </div>
                <div>
                  <h3 style={sectionTitleStyle}>Cronograma Académico & Horarios de Clases</h3>
                  <p style={sectionSubtitleStyle}>Calendario de convocatoria, etapas del proceso y turnos de docencia</p>
                </div>
              </div>

              {/* Grid de fechas con iconos */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.25rem',
                marginBottom: '2rem'
              }}>
                <div style={dateCardStyle}>
                  <div style={dateBadgeStyle('#DCF5DC', '#006400')}>Paso 1</div>
                  <div style={dateTitleStyle}>Publicación de Bases</div>
                  <div style={dateValueStyle}>Gestión 2026</div>
                  <div style={dateDescStyle}>Apertura de inscripciones y descarga de guías académicas</div>
                </div>

                <div style={dateCardStyle}>
                  <div style={dateBadgeStyle('#FFF5DC', '#B8860B')}>Paso 2</div>
                  <div style={dateTitleStyle}>Recepción de Carpetas</div>
                  <div style={dateValueStyle}>Ventanilla de Posgrado</div>
                  <div style={dateDescStyle}>Entrega de expedientes y títulos legalizados</div>
                </div>

                <div style={dateCardStyle}>
                  <div style={dateBadgeStyle('#E6EBF5', '#4682B4')}>Paso 3</div>
                  <div style={dateTitleStyle}>Evaluación de Méritos</div>
                  <div style={dateValueStyle}>Comité de Posgrado</div>
                  <div style={dateDescStyle}>Calificación curricular y publicación de listas de admitidos</div>
                </div>

                <div style={dateCardStyle}>
                  <div style={dateBadgeStyle('#DCF5DC', '#006400')}>Paso 4</div>
                  <div style={dateTitleStyle}>Inicio de Clases</div>
                  <div style={dateValueStyle}>Semestre I 2026</div>
                  <div style={dateDescStyle}>Sesiones síncronas programadas e inducción a la plataforma</div>
                </div>
              </div>

              {/* Horarios y Turnos */}
              <div style={{ background: '#EBE6DA', padding: '1.5rem', borderRadius: '8px', border: '1px solid #DCE1E6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                  <Clock size={18} color="#006400" />
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#373A40' }}>
                    Horario de Clases y Turnos
                  </h4>
                </div>
                <div style={{ fontSize: '0.92rem', color: '#646973', lineHeight: 1.85 }}>
                  <div style={{ marginBottom: '0.5rem' }}><strong>Días de Clases:</strong> Lunes a Jueves, Turno Noche de 19:00 a 22:00 h</div>
                  <div style={{ marginBottom: '0.5rem' }}><strong>Modalidad:</strong> Clases virtuales síncronas mediante plataforma Zoom y Meet de la UMSA, con grabación disponible 24/7</div>
                  <div><strong>Talleres Prácticos:</strong> Laboratorios de computación estadística en Campus Cota Cota, programados en fines de semana o de forma virtual</div>
                </div>
              </div>
            </div>
          </div>
        )}

          </div>{/* /columna-izquierda */}

          {/* ── Columna derecha: Panel Lateral con Post Oficial del Programa ── */}
          <div className="post-sidebar" style={{
            position: 'sticky',
            top: '90px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>

            {/* Post / Afiche del programa */}
            <div style={{
              borderRadius: '14px',
              overflow: 'hidden',
              boxShadow: '0 8px 30px rgba(0,0,0,0.13)',
              border: '2px solid #DCE1E6',
              background: '#FFFFFF',
            }}>
              <img
                src={programPostUrl}
                alt={`Afiche oficial: ${prog.title}`}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  objectFit: 'contain',
                }}
              />
            </div>

            {/* Info rápida del programa */}
            <div style={{
              background: '#FFFFFF',
              border: '1.5px solid #DCE1E6',
              borderRadius: '12px',
              padding: '1.1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#006400', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #DCE1E6', paddingBottom: '0.5rem', marginBottom: '0.2rem' }}>
                Datos del Programa
              </div>
              {[
                { label: 'Tipo', value: prog.type || (isMaster ? 'Maestría' : 'Diplomado'), color: '#2563EB' },
                { label: 'Modalidad', value: prog.modality || 'Híbrida – Turno Noche', color: '#059669' },
                { label: 'Duración', value: prog.duration || (isMaster ? '24 meses' : '6 meses'), color: '#7C3AED' },
                { label: 'Créditos', value: prog.credits ? `${prog.credits} CEUB` : 'Acreditado SNC', color: '#D97706' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', gap: '0.5rem' }}>
                  <span style={{ color: '#646973', fontWeight: 600 }}>{item.label}</span>
                  <span style={{ fontWeight: 800, color: item.color, textAlign: 'right', maxWidth: '60%' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>{/* /post-sidebar */}

        </div>{/* /tab-layout-grid */}

        {/* ── BANNER INFERIOR DE AYUDA Y CONTACTO CON WHATSAPP FOSFORESCENTE ── */}
        <section style={{
          marginTop: '3.5rem',
          background: 'linear-gradient(135deg, #003800 0%, #006400 50%, #1B3F63 100%)',
          color: '#FFFFFF',
          borderRadius: '12px',
          padding: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          boxShadow: '0 8px 30px rgba(0, 100, 0, 0.3)'
        }}>
          <div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF' }}>
              ¿Tienes consultas sobre este programa?
            </h3>
            <p style={{ margin: 0, fontSize: '0.95rem', color: '#E6EBF5', maxWidth: '600px', lineHeight: 1.6 }}>
              La Coordinación de Posgrado de la Carrera de Estadística te brinda atención personalizada sobre requisitos, convalidaciones y proceso de postulación.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
            <a
              href={`https://wa.me/59176543210?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              style={{
                background: '#25D366',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.92rem',
                padding: '0.8rem 1.45rem',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                cursor: 'pointer',
                transition: 'background 0.18s ease, transform 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#20BA5A';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#25D366';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <MessageCircle size={19} color="#FFFFFF" strokeWidth={2.2} />
              <span>Contactar por WhatsApp</span>
            </a>

            <button
              onClick={handleBackNavigation}
              style={{
                background: 'rgba(255, 255, 255, 0.14)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                fontWeight: 700,
                fontSize: '0.925rem',
                padding: '0.85rem 1.35rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.24)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)'}
            >
              <ArrowLeft size={16} />
              <span>Volver a Programas</span>
            </button>
          </div>
        </section>

        </div>{/* /container */}
      </div>{/* /tabs background div */}

      {/* Responsive adjustments */}
      <style>{`
        @media (max-width: 768px) {
          .quick-info-strip {
            grid-template-columns: 1fr 1fr !important;
          }
          .hero-buttons-overlay {
            position: absolute !important;
            bottom: 0.75rem !important;
            left: 0.75rem !important;
            right: 0.75rem !important;
            justify-content: center !important;
            gap: 0.5rem !important;
          }
          .hero-buttons-overlay > a {
            flex: 1 1 160px !important;
            padding: 0.65rem 0.9rem !important;
            font-size: 0.8rem !important;
            justify-content: center !important;
          }
        }
        @media (max-width: 520px) {
          .quick-info-strip {
            grid-template-columns: 1fr !important;
          }
          .hero-buttons-overlay {
            position: absolute !important;
            bottom: 0.5rem !important;
            left: 0.5rem !important;
            right: 0.5rem !important;
            flex-direction: column !important;
            gap: 0.4rem !important;
          }
          .hero-buttons-overlay > a {
            width: 100% !important;
            padding: 0.6rem 0.8rem !important;
            font-size: 0.78rem !important;
          }
        }
        /* Tabs responsive: desktop muestra los 5 botones en pantalla, móvil muestra barra desplegable */
        .program-nav-tabs-desktop {
          display: grid !important;
          grid-template-columns: repeat(5, 1fr) !important;
          gap: 0.5rem !important;
        }
        .program-nav-tabs-mobile {
          display: none !important;
        }
        /* Layout 2 columnas: contenido + sidebar post */
        .tab-layout-grid {
          grid-template-columns: 1fr 320px;
        }
        .post-sidebar {
          display: flex;
        }
        @media (max-width: 1200px) {
          .tab-layout-grid {
            grid-template-columns: 1fr 300px !important;
          }
        }
        @media (max-width: 1024px) {
          .tab-layout-grid {
            grid-template-columns: 1fr 260px !important;
          }
        }
        @media (max-width: 820px) {
          .program-nav-tabs-desktop {
            display: none !important;
          }
          .program-nav-tabs-mobile {
            display: block !important;
          }
          .tab-layout-grid {
            grid-template-columns: 1fr !important;
          }
          .post-sidebar {
            position: static !important;
            flex-direction: row !important;
            align-items: flex-start !important;
            gap: 1rem !important;
          }
          .post-sidebar > div:first-child {
            flex: 1 1 auto !important;
            max-width: 320px !important;
          }
          .post-sidebar > div:last-child {
            flex: 1 1 auto !important;
          }
        }
        @media (max-width: 580px) {
          .post-sidebar {
            flex-direction: column !important;
          }
          .post-sidebar > div:first-child {
            max-width: 100% !important;
          }
        }
        /* Animate fade in */
        .animate-fade-in {
          animation: fadeInUp 0.35s ease forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

// ── Shared UI Styles con la Paleta Corporativa UMSA ──
const cleanPanelStyle = {
  background: '#FFFFFF',
  borderRadius: '10px',
  border: '1px solid #DCE1E6',
  padding: '1.75rem 2rem',
  boxShadow: '0 2px 10px rgba(55, 58, 64, 0.03)'
};

const sectionHeaderStyle = (bg, color) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.85rem',
  marginBottom: '1.5rem',
  paddingBottom: '1rem',
  borderBottom: '1px solid #DCE1E6'
});

const iconBadgeStyle = (bg, color) => ({
  width: '42px',
  height: '42px',
  borderRadius: '8px',
  background: bg,
  color: color,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
});

const sectionTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: 800,
  color: '#373A40',
  margin: '0 0 0.2rem 0',
  letterSpacing: '-0.01em'
};

const sectionSubtitleStyle = {
  fontSize: '0.825rem',
  color: '#646973',
  margin: 0
};

const dateCardStyle = {
  background: '#FFFFFF',
  border: '1.5px solid #DCE1E6',
  borderRadius: '8px',
  padding: '1.15rem'
};

const dateBadgeStyle = (bg, color) => ({
  display: 'inline-block',
  background: bg,
  color: color,
  fontSize: '0.72rem',
  fontWeight: 800,
  padding: '0.2rem 0.55rem',
  borderRadius: '4px',
  marginBottom: '0.4rem',
  border: `1px solid ${color}40`
});

const dateTitleStyle = {
  fontSize: '0.92rem',
  fontWeight: 800,
  color: '#373A40',
  marginBottom: '0.2rem'
};

const dateValueStyle = {
  fontSize: '0.825rem',
  fontWeight: 700,
  color: '#006400',
  marginBottom: '0.35rem'
};

const dateDescStyle = {
  fontSize: '0.78rem',
  color: '#646973',
  lineHeight: 1.45
};
