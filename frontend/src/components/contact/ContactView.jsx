import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  Building, 
  CheckCircle2,
  Navigation,
  ExternalLink,
  Bus,
  ShieldCheck,
  Award
} from 'lucide-react';

import monoblockImg from '../../assets/images/sedes/monoblock.jpg';
import cotacotaImg from '../../assets/images/sedes/cotacota.jpg';
import { institucionService } from '../../services/institucionService';

export const ContactView = () => {
  const [info, setInfo] = useState({
    direccion: 'Calle 27 de Cota Cota s/n, Campus Universitario UMSA, Edif. Estadística (2do Piso)',
    telefono: '+591 (2) 279-2999',
    whatsapp: '+591 76543210',
    email_principal: 'estapost@fcpn.edu.bo',
    horario_atencion: 'Lunes a Viernes 08:30 a 16:30 (Continuo)',
    director_nombre: 'Dirección de la Carrera de Estadística y Posgrado',
    ieta_descripcion: 'Instituto de Estadística Teórica y Aplicada (Investigación & Proyectos)',
    club_cientifico_descripcion: 'Club Científico de Estudiantes e Investigadores de Estadística'
  });

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const data = await institucionService.getInfo();
        if (data && data.email_principal) {
          setInfo(prev => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error('Error cargando info institucional en ContactView:', err);
      }
    };
    fetchInfo();
  }, []);

  return (
    <div className="section-spacing animate-fade-in" style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '5rem' }}>
      <div className="container" style={{ maxWidth: '1240px' }}>
        
        {/* ── Encabezado Principal ── */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: '#0B192C',
            color: '#ffffff',
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            padding: '0.3rem 0.75rem',
            borderRadius: '4px',
            marginBottom: '0.85rem'
          }}>
            <MapPin size={13} color="#4ade80" />
            <span>SEDES & CANALES DE CONTACTO</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
            fontWeight: 800,
            color: '#0f172a',
            fontFamily: 'var(--font-family-heading)',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            margin: '0 0 0.75rem 0'
          }}>
            Ubicación de Sedes y Canales de Contacto
          </h1>

          <div style={{
            width: '48px',
            height: '4px',
            backgroundColor: 'var(--color-green-inst)',
            borderRadius: '2px',
            marginBottom: '0.85rem'
          }} />

          <p style={{
            fontSize: '1rem',
            color: '#475569',
            maxWidth: '750px',
            lineHeight: 1.6,
            margin: 0
          }}>
            La Unidad de Posgrado de la Carrera de Estadística dispone de dos sedes habilitadas en la ciudad de La Paz: nuestra sede académica principal en el Campus de Cota Cota y la oficina de enlace en el Monoblock Central.
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════
            SEDE 01: CAMPUS UNIVERSITARIO COTA COTA
        ══════════════════════════════════════════════════════ */}
        <section style={{
          background: '#ffffff',
          borderRadius: '6px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px -4px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
          marginBottom: '3rem'
        }}>
          {/* Header de la Sede 1 */}
          <div style={{
            padding: '1.25rem 1.75rem',
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#1e5f35',
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: 800,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '0.22rem 0.65rem',
                borderRadius: '4px',
                marginBottom: '0.4rem'
              }}>
                <Building size={12} />
                <span>Sede 01 • Campus Académico & Posgrado</span>
              </div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#0f172a',
                margin: 0,
                fontFamily: 'var(--font-family-heading)'
              }}>
                Campus Universitario Cota Cota (Sede Principal)
              </h2>
            </div>

            <span style={{
              fontSize: '0.85rem',
              color: '#1e5f35',
              fontWeight: 700,
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              padding: '0.4rem 0.85rem',
              borderRadius: '4px'
            }}>
              Facultad de Ciencias Puras y Naturales
            </span>
          </div>

          {/* Arriba: Imagen al lado del Mapa (2 Columnas) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.25rem',
            padding: '1.5rem'
          }}>
            {/* Columna Izquierda: Imagen de la Sede */}
            <div style={{
              position: 'relative',
              height: '350px',
              borderRadius: '6px',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.06)'
            }}>
              <img 
                src={cotacotaImg} 
                alt="Campus Cota Cota - Edificio Ciencias Puras UMSA"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.1) 60%, transparent 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '1.25rem'
              }}>
                <span style={{
                  color: '#4ade80',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '0.2rem'
                }}>
                  Fachada Principal
                </span>
                <strong style={{ color: '#ffffff', fontSize: '1.1rem' }}>
                  Edificio de Ciencias Puras — Calle 27
                </strong>
                <span style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
                  Aulas de Posgrado, Laboratorios de Cómputo y Dirección
                </span>
              </div>
            </div>

            {/* Columna Derecha: Mapa Interactivo de Google Maps */}
            <div style={{
              height: '350px',
              borderRadius: '6px',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.06)'
            }}>
              <iframe
                title="Mapa Campus Cota Cota UMSA"
                src="https://maps.google.com/maps?q=Campus+Universitario+Cota+Cota+UMSA+La+Paz&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Inferior: Descripción Completa y Estructurada de la Sede */}
          <div style={{
            padding: '1.5rem',
            background: '#f8fafc',
            borderTop: '1px solid #e2e8f0'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              marginBottom: '1.25rem'
            }}>
              {/* Bloque 1: Ubicación Exacta */}
              <div style={{
                background: '#ffffff',
                padding: '1.25rem',
                borderRadius: '6px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#1e5f35', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <MapPin size={17} />
                  <span>Ubicación Exacta</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#334155', lineHeight: 1.55 }}>
                  <strong>Calle 27 de Cota Cota s/n</strong>, Campus Universitario UMSA, Zona Sur, La Paz. Edificio de la Carrera de Estadística (2do Piso) y Edificio de Ciencias Puras.
                </p>
              </div>

              {/* Bloque 2: Cómo Llegar & Transporte */}
              <div style={{
                background: '#ffffff',
                padding: '1.25rem',
                borderRadius: '6px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#0284c7', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <Bus size={17} />
                  <span>Transporte & Acceso</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#334155', lineHeight: 1.55 }}>
                  Minibuses hacia Cota Cota (Líneas 231, 284, 801), Trurifrutas y Pumakatari (Ruta Chasquipampa). Ingreso peatonal y vehicular directo por la portería de la Calle 27.
                </p>
              </div>

              {/* Bloque 3: Servicios y Trámites */}
              <div style={{
                background: '#ffffff',
                padding: '1.25rem',
                borderRadius: '6px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#1e5f35', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <CheckCircle2 size={17} />
                  <span>Atención en esta Sede</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#334155', lineHeight: 1.55 }}>
                  Aulas de docencia de posgrado, salas de computación especializada, laboratorios del Instituto de Estadística Teórica y Aplicada (IETA), tutorías y defensa de tesis.
                </p>
              </div>
            </div>

            {/* Barra de acción inferior */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              paddingTop: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.85rem' }}>
                <Clock size={15} color="#1e5f35" />
                <span><strong>Horario de Atención:</strong> {info.horario_atencion}</span>
              </div>

              <a
                href="https://maps.google.com/?q=Campus+Universitario+Cota+Cota+UMSA+La+Paz"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#1e5f35',
                  color: '#ffffff',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  padding: '0.6rem 1.25rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 3px 10px rgba(30, 95, 53, 0.25)',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#164627'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#1e5f35'}
              >
                <span>Abrir en Google Maps</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            SEDE 02: MONOBLOCK CENTRAL UMSA
        ══════════════════════════════════════════════════════ */}
        <section style={{
          background: '#ffffff',
          borderRadius: '6px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px -4px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
          marginBottom: '3.5rem'
        }}>
          {/* Header de la Sede 2 */}
          <div style={{
            padding: '1.25rem 1.75rem',
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#1e3a5f',
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: 800,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '0.22rem 0.65rem',
                borderRadius: '4px',
                marginBottom: '0.4rem'
              }}>
                <Building size={12} />
                <span>Sede 02 • Oficina de Enlace & Trámites</span>
              </div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#0f172a',
                margin: 0,
                fontFamily: 'var(--font-family-heading)'
              }}>
                Monoblock Central UMSA (Centro Paceño)
              </h2>
            </div>

            <span style={{
              fontSize: '0.85rem',
              color: '#1e3a5f',
              fontWeight: 700,
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              padding: '0.4rem 0.85rem',
              borderRadius: '4px'
            }}>
              Ventanilla de Enlace FCPN
            </span>
          </div>

          {/* Arriba: Imagen al lado del Mapa (2 Columnas) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.25rem',
            padding: '1.5rem'
          }}>
            {/* Columna Izquierda: Imagen de la Sede */}
            <div style={{
              position: 'relative',
              height: '350px',
              borderRadius: '6px',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.06)'
            }}>
              <img 
                src={monoblockImg} 
                alt="Monoblock Central UMSA - Edificio Antiguo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.1) 60%, transparent 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '1.25rem'
              }}>
                <span style={{
                  color: '#38bdf8',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '0.2rem'
                }}>
                  Edificio Histórico
                </span>
                <strong style={{ color: '#ffffff', fontSize: '1.1rem' }}>
                  Edificio Viejo Monoblock Central
                </strong>
                <span style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
                  Ventanilla de Posgrado FCPN — Plaza del Bicentenario
                </span>
              </div>
            </div>

            {/* Columna Derecha: Mapa Interactivo de Google Maps */}
            <div style={{
              height: '350px',
              borderRadius: '6px',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.06)'
            }}>
              <iframe
                title="Mapa Monoblock Central UMSA"
                src="https://maps.google.com/maps?q=Monoblock+Central+UMSA+La+Paz&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Inferior: Descripción Completa y Estructurada de la Sede */}
          <div style={{
            padding: '1.5rem',
            background: '#f8fafc',
            borderTop: '1px solid #e2e8f0'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              marginBottom: '1.25rem'
            }}>
              {/* Bloque 1: Ubicación Exacta */}
              <div style={{
                background: '#ffffff',
                padding: '1.25rem',
                borderRadius: '6px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#1e3a5f', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <MapPin size={17} />
                  <span>Ubicación Exacta</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#334155', lineHeight: 1.55 }}>
                  <strong>Av. Villazón Nº 1995</strong>, Plaza del Bicentenario, Zona Central, La Paz. Edificio Viejo Monoblock, Ventanilla de Enlace de Posgrado FCPN.
                </p>
              </div>

              {/* Bloque 2: Cómo Llegar & Conexiones */}
              <div style={{
                background: '#ffffff',
                padding: '1.25rem',
                borderRadius: '6px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#0284c7', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <Navigation size={17} />
                  <span>Accesos & Teleférico</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#334155', lineHeight: 1.55 }}>
                  A 3 minutos de la Estación Cancha Zapata del <strong>Teleférico Celeste</strong>. Acceso por principales arterias viales: Av. 16 de Julio (El Prado), Av. Arce y Av. 6 de Agosto.
                </p>
              </div>

              {/* Bloque 3: Trámites Administrativos */}
              <div style={{
                background: '#ffffff',
                padding: '1.25rem',
                borderRadius: '6px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#1e3a5f', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <ShieldCheck size={17} />
                  <span>Trámites Documentales</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#334155', lineHeight: 1.55 }}>
                  Recepción de expedientes físicos de postulación, títulos legalizados, legalizaciones universitarias, sellado de formularios CPT y derivación a la unidad central.
                </p>
              </div>
            </div>

            {/* Barra de acción inferior */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              paddingTop: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.85rem' }}>
                <Clock size={15} color="#1e3a5f" />
                <span><strong>Horario de Atención:</strong> {info.horario_atencion}</span>
              </div>

              <a
                href="https://maps.google.com/?q=Monoblock+Central+UMSA+La+Paz"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#1e3a5f',
                  color: '#ffffff',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  padding: '0.6rem 1.25rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 3px 10px rgba(30, 58, 95, 0.25)',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#152943'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#1e3a5f'}
              >
                <span>Abrir en Google Maps</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            SECCIÓN INFERIOR: CANALES DE CONTACTO (SIN FORMULARIO)
        ══════════════════════════════════════════════════════ */}
        <section style={{
          background: '#ffffff',
          borderRadius: '6px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px -4px rgba(0, 0, 0, 0.06)',
          padding: '2.5rem 2rem'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 2.5rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#0B192C',
              color: '#ffffff',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '0.25rem 0.65rem',
              borderRadius: '4px',
              marginBottom: '0.65rem'
            }}>
              <Phone size={13} color="#38bdf8" />
              <span>COMUNICACIÓN DIRECTA</span>
            </div>
            <h2 style={{
              fontSize: '1.85rem',
              fontWeight: 800,
              color: '#0f172a',
              margin: '0 0 0.5rem 0',
              fontFamily: 'var(--font-family-heading)'
            }}>
              Canales Oficiales de Contacto
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>
              Ponte en contacto directo con la secretaría académica y el equipo de posgrado para resolver cualquier consulta sobre postulaciones, requisitos y programas activos.
            </p>
          </div>

          {/* Grilla de 4 Tarjetas de Contacto */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {/* Tarjeta 1: Teléfonos Fijos */}
            <div style={{
              background: '#f8fafc',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              borderTop: '4px solid #1e3a5f',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '6px',
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1e3a5f',
                  marginBottom: '1rem'
                }}>
                  <Phone size={20} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Central Telefónica
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0 0.5rem' }}>
                  {info.telefono}
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
                  Secretaría de Posgrado en Campus Cota Cota para consultas generales.
                </p>
              </div>

              <a
                href={`tel:${info.telefono.replace(/\s+/g, '')}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#1e3a5f',
                  textDecoration: 'none',
                  marginTop: '1.25rem'
                }}
              >
                <span>Llamar ahora</span>
                <ExternalLink size={13} />
              </a>
            </div>

            {/* Tarjeta 2: WhatsApp Directo */}
            <div style={{
              background: '#f8fafc',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              borderTop: '4px solid #25D366',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '6px',
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#25D366',
                  marginBottom: '1rem'
                }}>
                  <MessageCircle size={20} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  WhatsApp Directo
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0 0.5rem' }}>
                  {info.whatsapp}
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
                  Asesoría rápida sobre convocatorias, pagos de matrícula y requisitos.
                </p>
              </div>

              <a
                href={`https://wa.me/${(info.whatsapp || '').replace(/\D/g, '')}?text=${encodeURIComponent('Hola, deseo más información sobre los programas de posgrado.')}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  background: '#25D366',
                  color: '#ffffff',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  padding: '0.55rem 1rem',
                  marginTop: '1.25rem',
                  boxShadow: '0 2px 8px rgba(37, 211, 102, 0.25)',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#20ba5a'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#25D366'}
              >
                <span>Enviar WhatsApp</span>
                <ExternalLink size={13} />
              </a>
            </div>

            {/* Tarjeta 3: Correo Oficial */}
            <div style={{
              background: '#f8fafc',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              borderTop: '4px solid #6366f1',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '6px',
                  background: '#eef2ff',
                  border: '1px solid #c7d2fe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6366f1',
                  marginBottom: '1rem'
                }}>
                  <Mail size={20} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Correo Institucional
                </span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0 0.5rem', wordBreak: 'break-all' }}>
                  {info.email_principal}
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
                  Canal oficial para envío de expedientes digitales y correspondencia.
                </p>
              </div>

              <a
                href={`mailto:${info.email_principal}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#6366f1',
                  textDecoration: 'none',
                  marginTop: '1.25rem'
                }}
              >
                <span>Escribir correo</span>
                <ExternalLink size={13} />
              </a>
            </div>

            {/* Tarjeta 4: Horario de Atención */}
            <div style={{
              background: '#f8fafc',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              borderTop: '4px solid #f59e0b',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '6px',
                  background: '#fffbeb',
                  border: '1px solid #fde68a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f59e0b',
                  marginBottom: '1rem'
                }}>
                  <Clock size={20} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Horario de Atención
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0 0.5rem' }}>
                  08:30 a 16:30
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
                  {info.horario_atencion}. Días hábiles laborables en ambas sedes.
                </p>
              </div>

              <div style={{
                marginTop: '1.25rem',
                fontSize: '0.8rem',
                color: '#16a34a',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}>
                <CheckCircle2 size={14} />
                <span>Horario Continuo</span>
              </div>
            </div>
          </div>

          {/* Unidades Institucionales Adscritas */}
          <div style={{
            background: '#0B192C',
            borderRadius: '6px',
            padding: '1.5rem',
            color: '#ffffff',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <Building size={20} color="#4ade80" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                  {info.director_nombre}
                </strong>
                <span style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.4, display: 'block' }}>
                  Supervisión y gestión académica de programas de maestría y especialización.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <Award size={20} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                  Instituto de Estadística Teórica y Aplicada (IETA)
                </strong>
                <span style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.4, display: 'block' }}>
                  {info.ieta_descripcion}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <CheckCircle2 size={20} color="#facc15" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                  Club Científico de Estadística
                </strong>
                <span style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.4, display: 'block' }}>
                  {info.club_cientifico_descripcion}
                </span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
