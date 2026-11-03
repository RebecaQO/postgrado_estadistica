import React, { useState, useEffect } from 'react';
import { regulationsData } from '../../data/regulationsData';
import { downloadDocument } from '../../utils/downloader';
import { 
  FileText, 
  Download, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  FolderArchive,
  ExternalLink,
  History,
  FolderDown,
  Calendar,
  Layers,
  Award,
  GraduationCap,
  Filter,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react';
import { convocatoriaService } from '../../services/convocatoriaService';

export const RegulationsView = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGestion, setSelectedGestion] = useState('todos');
  const [selectedNivel, setSelectedNivel] = useState('todos'); // 'todos' | 'maestria' | 'diplomado'
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Fetch past convocatorias from backend
  useEffect(() => {
    const fetchConvocatoriasPasadas = async () => {
      try {
        setLoading(true);
        const data = await convocatoriaService.getConvocatoriasPasadas();
        setConvocatorias(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error cargando convocatorias pasadas:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConvocatoriasPasadas();
  }, []);

  const gestiones = Array.from(new Set(convocatorias.map(c => c.gestion).filter(Boolean))).sort().reverse();

  const filteredConvocatorias = convocatorias.filter((conv) => {
    if (selectedGestion !== 'todos' && conv.gestion !== selectedGestion) return false;
    if (selectedNivel !== 'todos') {
      const isM = (conv.nivel || '').toLowerCase().includes('maestr') || (conv.titulo || '').toLowerCase().includes('maestr');
      if (selectedNivel === 'maestria' && !isM) return false;
      if (selectedNivel === 'diplomado' && isM) return false;
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        conv.titulo.toLowerCase().includes(q) ||
        conv.programa.toLowerCase().includes(q) ||
        conv.resolucion_hcu.toLowerCase().includes(q) ||
        conv.gestion.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const hasActiveFilters = selectedGestion !== 'todos' || selectedNivel !== 'todos' || searchTerm.trim() !== '';

  const handleResetFilters = () => {
    setSelectedGestion('todos');
    setSelectedNivel('todos');
    setSearchTerm('');
  };

  const handleDownloadNormativa = (doc) => {
    const fileContent = `================================================================================
UNIVERSIDAD MAYOR DE SAN ANDRÉS
FACULTAD DE CIENCIAS PURAS Y NATURALES
CARRERA DE ESTADÍSTICA — UNIDAD DE POSGRADO E INVESTIGACIÓN
================================================================================

DOCUMENTO OFICIAL: ${doc.title}
CÓDIGO INSTITUCIONAL: ${doc.code}
CATEGORÍA: ${doc.category}
RESOLUCIÓN AVAL: CEUB / HCU UMSA

--------------------------------------------------------------------------------
RESUMEN DEL DOCUMENTO:
${doc.description}

ESTRUCTURA NORMATIVA GENERAL:
1. Disposiciones Generales y Ámbito de Aplicación.
2. Admisión, Permanencia y Evaluación Continua de Posgraduantes.
3. Tribunal Examinador, Tutorías y Normativa de Tesis de Grado.
4. Homologación de Créditos y Obtención del Grado de Magíster / Diplomado.

Para consultar el texto íntegro escaneado con sellos de Rectorado, acuda a la Secretaría de Posgrado (Campus Cota Cota Calle 27) o escriba a: evapost@fcpn.edu.bo
================================================================================
`;
    downloadDocument(doc.title, fileContent, `${doc.code}_${doc.title.slice(0, 25).replace(/\s+/g, '_')}.txt`);
  };

  return (
    <div className="section-spacing animate-fade-in" style={{ background: '#f8fafc' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
            fontWeight: 800,
            color: '#0f172a',
            fontFamily: 'var(--font-family-heading)',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            margin: '0 0 0.75rem 0'
          }}>
            Convocatorias Anteriores y Resoluciones HCU
          </h1>
          <div style={{
            width: '48px',
            height: '4px',
            backgroundColor: 'var(--color-green-inst)',
            borderRadius: '2px',
            marginBottom: '1rem'
          }} />
          <p style={{
            fontSize: '0.95rem',
            color: '#64748b',
            lineHeight: 1.6,
            margin: 0,
            maxWidth: '850px'
          }}>
            Repositorio histórico oficial de convocatorias pasadas con enlaces de visualización en Google Drive, descargas en PDF y resoluciones del Honorable Consejo Universitario (HCU).
          </p>
        </div>

        {/* ── CONVOCATORIAS ANTERIORES ── */}
        <div className="animate-fade-in">

            {/* Contador de Resultados y botón limpiar */}
            <div style={{
              fontSize: '0.95rem',
              color: '#0f172a',
              fontWeight: 700,
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <div>
                Resultados <span style={{ color: 'var(--color-green-inst)', fontWeight: 800 }}>{filteredConvocatorias.length}</span> convocatorias anteriores
              </div>

              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #d1d5db',
                    color: '#475569',
                    borderRadius: '4px',
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#dc2626';
                    e.currentTarget.style.color = '#dc2626';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.color = '#475569';
                  }}
                >
                  <RotateCcw size={13} />
                  <span>Limpiar todos los filtros</span>
                </button>
              )}
            </div>

            {/* Layout Lateral: Sidebar de Filtros + Grilla de Convocatorias */}
            <div className="convocatorias-grid-wrapper" style={{
              display: 'grid',
              gridTemplateColumns: '270px 1fr',
              gap: '1.75rem',
              alignItems: 'start'
            }}>

              {/* ══════════ SIDEBAR DE FILTROS LATERAL ══════════ */}
              <aside style={{
                background: '#ffffff',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
                position: 'sticky',
                top: '85px'
              }}>
                {/* Header del Sidebar (plegable en móvil) */}
                <div 
                  className="convocatorias-sidebar-header"
                  onClick={() => setMobileFiltersOpen((prev) => !prev)}
                  style={{
                    padding: '1.1rem 1.4rem',
                    borderBottom: mobileFiltersOpen ? '1px solid #f1f5f9' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Filter size={18} color="var(--color-green-inst)" />
                    <h2 style={{
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      margin: 0,
                      fontFamily: 'var(--font-family-heading)'
                    }}>
                      Filtros
                    </h2>
                    {hasActiveFilters && (
                      <span style={{
                        background: 'var(--color-green-inst)',
                        color: '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '999px',
                        marginLeft: '0.2rem'
                      }}>
                        Activos
                      </span>
                    )}
                  </div>

                  {/* Indicador colapsable en móviles */}
                  <div className="convocatorias-sidebar-toggle-btn" style={{
                    display: 'none',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: 'var(--color-green-inst)'
                  }}>
                    <span>{mobileFiltersOpen ? 'Ocultar' : 'Mostrar'}</span>
                    {mobileFiltersOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {/* Contenido colapsable de filtros */}
                <div className={`convocatorias-sidebar-content ${mobileFiltersOpen ? 'is-open' : ''}`}>
                  
                  {/* Búsqueda por palabras clave */}
                  <div style={{
                    padding: '1.2rem 1.4rem',
                    borderBottom: '1px solid #f1f5f9'
                  }}>
                    <label style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      marginBottom: '0.5rem'
                    }}>
                      Por palabras clave
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        placeholder="Buscar convocatoria..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.62rem 2.2rem 0.62rem 0.75rem',
                          fontSize: '0.82rem',
                          border: '1px solid #cbd5e1',
                          borderRadius: '4px',
                          outline: 'none',
                          color: '#1e293b',
                          background: '#ffffff',
                          transition: 'border-color 0.2s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--color-green-inst)'}
                        onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                      />
                      <Search
                        size={16}
                        style={{
                          position: 'absolute',
                          right: '0.75rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'var(--color-green-inst)',
                          pointerEvents: 'none'
                        }}
                      />
                    </div>
                  </div>

                  {/* Filtro por Nivel Académico */}
                  <div style={{
                    padding: '1.2rem 1.4rem',
                    borderBottom: '1px solid #f1f5f9'
                  }}>
                    <div style={{
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      marginBottom: '0.65rem'
                    }}>
                      Nivel Académico
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {[
                        { id: 'todos', label: 'Todos los niveles' },
                        { id: 'maestria', label: 'Maestrías', color: '#1e5f35' },
                        { id: 'diplomado', label: 'Diplomados', color: '#1e3a5f' }
                      ].map((item) => (
                        <label
                          key={item.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.55rem',
                            fontSize: '0.82rem',
                            color: selectedNivel === item.id ? '#0f172a' : '#475569',
                            fontWeight: selectedNivel === item.id ? 700 : 500,
                            cursor: 'pointer',
                            userSelect: 'none'
                          }}
                        >
                          <input
                            type="radio"
                            name="filtro-nivel"
                            checked={selectedNivel === item.id}
                            onChange={() => setSelectedNivel(item.id)}
                            style={{ accentColor: item.color || '#1e5f35', width: '15px', height: '15px' }}
                          />
                          {item.color && (
                            <span style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: item.color,
                              display: 'inline-block'
                            }} />
                          )}
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Filtro por Gestión (Años) */}
                  <div style={{
                    padding: '1.2rem 1.4rem'
                  }}>
                    <div style={{
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      marginBottom: '0.65rem'
                    }}>
                      Gestión Académica
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.55rem',
                          fontSize: '0.82rem',
                          color: selectedGestion === 'todos' ? '#0f172a' : '#475569',
                          fontWeight: selectedGestion === 'todos' ? 700 : 500,
                          cursor: 'pointer',
                          userSelect: 'none'
                        }}
                      >
                        <input
                          type="radio"
                          name="filtro-gestion"
                          checked={selectedGestion === 'todos'}
                          onChange={() => setSelectedGestion('todos')}
                          style={{ accentColor: 'var(--color-green-inst)', width: '15px', height: '15px' }}
                        />
                        <span>Todas las gestiones</span>
                      </label>

                      {gestiones.map((ges) => (
                        <label
                          key={ges}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.55rem',
                            fontSize: '0.82rem',
                            color: selectedGestion === ges ? '#0f172a' : '#475569',
                            fontWeight: selectedGestion === ges ? 700 : 500,
                            cursor: 'pointer',
                            userSelect: 'none'
                          }}
                        >
                          <input
                            type="radio"
                            name="filtro-gestion"
                            checked={selectedGestion === ges}
                            onChange={() => setSelectedGestion(ges)}
                            style={{ accentColor: 'var(--color-green-inst)', width: '15px', height: '15px' }}
                          />
                          <span>Gestión {ges}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                </div>
              </aside>

              {/* ══════════ COLUMNA DERECHA: GRILLA DE CONVOCATORIAS ══════════ */}
              <div>
                {loading ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '4rem 2rem',
                    background: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    color: 'var(--color-green-inst)',
                    fontWeight: 700
                  }}>
                    Cargando convocatorias anteriores desde la base de datos...
                  </div>
                ) : filteredConvocatorias.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '4rem 2rem',
                    background: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <Filter size={42} color="var(--color-green-inst)" style={{ marginBottom: '1rem' }} />
                    <h3 style={{ color: '#0f172a', fontWeight: 800, marginBottom: '0.5rem' }}>
                      No se encontraron convocatorias pasadas
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                      Prueba modificando la búsqueda o restableciendo los selectores de gestión o nivel.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      style={{
                        background: 'var(--color-green-inst)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.65rem 1.4rem',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(38, 115, 66, 0.25)',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-green-inst-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-green-inst)'}
                    >
                      Restablecer todos los filtros
                    </button>
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '1.75rem'
                  }}>
                    {filteredConvocatorias.map((conv) => {
                      const isMaster = (conv.nivel || '').toLowerCase().includes('maestr') || (conv.titulo || '').toLowerCase().includes('maestr');
                      const themeColor = isMaster ? '#1e5f35' : '#1e3a5f';
                      const categoryLabel = isMaster ? 'PROGRAMA DE MAESTRÍA' : 'DIPLOMADO';

                      return (
                        <div
                          key={conv.id}
                          style={{
                            background: '#ffffff',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            borderTop: `4px solid ${themeColor}`,
                            boxShadow: '0 4px 18px -4px rgba(0, 0, 0, 0.08)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            overflow: 'hidden',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-3px)';
                            e.currentTarget.style.boxShadow = '0 12px 28px -6px rgba(0, 0, 0, 0.14)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 18px -4px rgba(0, 0, 0, 0.08)';
                          }}
                        >
                          <div style={{ padding: '1.5rem 1.6rem 1.25rem' }}>
                            
                            {/* ── Encabezado de la tarjeta: Categoría y Gestión ── */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '0.5rem',
                              marginBottom: '0.85rem',
                              flexWrap: 'wrap'
                            }}>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                background: themeColor,
                                color: '#ffffff',
                                fontSize: '0.68rem',
                                fontWeight: 800,
                                letterSpacing: '0.05em',
                                padding: '0.25rem 0.7rem',
                                borderRadius: '99px',
                                textTransform: 'uppercase',
                                boxShadow: isMaster ? '0 2px 6px rgba(30,95,53,0.22)' : '0 2px 6px rgba(30,58,95,0.22)'
                              }}>
                                {isMaster ? <GraduationCap size={12} /> : <Award size={12} />}
                                <span>{categoryLabel}</span>
                              </span>

                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                color: '#475569',
                                background: '#f1f5f9',
                                padding: '0.25rem 0.65rem',
                                borderRadius: '6px'
                              }}>
                                <Calendar size={13} color="#64748b" />
                                {conv.gestion}
                              </span>
                            </div>

                            {/* Código y Resolución HCU */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '0.5rem',
                              marginBottom: '0.65rem',
                              fontSize: '0.75rem',
                              color: '#64748b'
                            }}>
                              <span style={{ fontFamily: 'var(--font-family-mono)', fontWeight: 700, color: '#94a3b8' }}>
                                {conv.id}
                              </span>
                              {conv.resolucion_hcu && (
                                <span style={{
                                  fontWeight: 600,
                                  color: '#334155',
                                  background: '#f8fafc',
                                  border: '1px solid #e2e8f0',
                                  padding: '0.15rem 0.5rem',
                                  borderRadius: '4px',
                                  fontSize: '0.72rem'
                                }}>
                                  {conv.resolucion_hcu}
                                </span>
                              )}
                            </div>

                            {/* Título de la Convocatoria */}
                            <h3 style={{
                              fontSize: '1.18rem',
                              fontWeight: 800,
                              color: '#0f172a',
                              lineHeight: 1.35,
                              marginBottom: '0.65rem',
                              fontFamily: 'var(--font-family-heading)'
                            }}>
                              {conv.titulo}
                            </h3>

                            {/* Descripción */}
                            {conv.descripcion && (
                              <p style={{
                                fontSize: '0.85rem',
                                color: '#475569',
                                lineHeight: 1.6,
                                marginBottom: '0.9rem',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}>
                                {conv.descripcion}
                              </p>
                            )}

                            {/* Programa Asociado */}
                            {conv.programa && (
                              <div style={{
                                background: '#f8fafc',
                                padding: '0.65rem 0.85rem',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                color: '#334155',
                                border: '1px solid #e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem'
                              }}>
                                <strong style={{ color: themeColor }}>Programa:</strong> 
                                <span style={{ color: '#475569' }}>{conv.programa}</span>
                              </div>
                            )}
                          </div>

                          {/* Drive and PDF buttons */}
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '0.75rem',
                            padding: '1rem 1.6rem 1.25rem',
                            borderTop: '1px solid #f1f5f9',
                            background: '#fafbfc'
                          }}>
                            <a
                              href={conv.enlace_drive}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.45rem',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                color: themeColor,
                                background: '#ffffff',
                                border: `1.5px solid ${themeColor}`,
                                borderRadius: '6px',
                                padding: '0.6rem 0.8rem',
                                textDecoration: 'none',
                                transition: 'all 0.15s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = isMaster ? '#eaf5ec' : '#edf4f9';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#ffffff';
                              }}
                            >
                              <FolderDown size={15} />
                              <span>Ver en Drive</span>
                            </a>

                            <a
                              href={conv.enlace_pdf}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.45rem',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                color: '#ffffff',
                                background: themeColor,
                                border: `1.5px solid ${themeColor}`,
                                borderRadius: '6px',
                                padding: '0.6rem 0.8rem',
                                textDecoration: 'none',
                                boxShadow: `0 3px 10px ${isMaster ? 'rgba(30,95,53,0.25)' : 'rgba(30,58,95,0.25)'}`,
                                transition: 'opacity 0.15s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.opacity = '0.9';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.opacity = '1';
                              }}
                            >
                              <Download size={15} />
                              <span>Descargar PDF</span>
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .convocatorias-grid-wrapper {
            grid-template-columns: 1fr !important;
          }

          .convocatorias-sidebar-toggle-btn {
            display: flex !important;
          }

          .convocatorias-sidebar-header {
            cursor: pointer;
            padding: 1.15rem 1.25rem !important;
            border-radius: 6px;
            background: #ffffff;
            transition: background 0.15s ease;
          }

          .convocatorias-sidebar-header:hover {
            background: #f8fafc;
          }

          .convocatorias-sidebar-content {
            display: none;
          }

          .convocatorias-sidebar-content.is-open {
            display: block;
            border-top: 1px solid #f1f5f9;
            animation: fadeInFilters 0.2s ease-out;
          }

          @keyframes fadeInFilters {
            from {
              opacity: 0;
              transform: translateY(-4px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        }
      `}</style>
    </div>
  );
};
