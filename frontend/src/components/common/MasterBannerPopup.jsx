import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageCircle, 
  ChevronLeft, 
  ChevronRight,
  GraduationCap
} from 'lucide-react';

import bannerCiencia from '../../assets/images/banner/banner_ciencia.jpeg';
import cienciaBanner from '../../assets/images/banner/banner_maestria_datos.png';

export const MasterBannerPopup = ({ onNavigateToProgram }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const banners = [
    {
      img: cienciaBanner,
      alt: 'Maestría en Ciencia y Análisis de Datos - Versión Informativa'
    },
    {
      img: bannerCiencia,
      alt: 'Maestría en Ciencia y Análisis de Datos - Afiche Convocatoria Oficial UMSA'
    }
  ];

  useEffect(() => {
    // Verificar si ya fue cerrado en esta sesión
    const dismissed = sessionStorage.getItem('master_banner_dismissed_session');
    if (!dismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('master_banner_dismissed_session', 'true');
  };

  const handleGoToProgram = () => {
    handleClose();
    if (onNavigateToProgram) {
      onNavigateToProgram('PG-EST-002');
    } else {
      window.location.hash = 'programa/PG-EST-002';
    }
  };

  const nextSlide = (e) => {
    e?.stopPropagation();
    setActiveSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = (e) => {
    e?.stopPropagation();
    setActiveSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const whatsappUrl = `https://wa.me/59176543210?text=${encodeURIComponent(
    'Hola, deseo información y requisitos sobre la Maestría en Ciencia y Análisis de Datos (II Versión).'
  )}`;

  return (
    <>
      {/* ── 1. MODAL EMERGENTE AL INICIAR ── */}
      {isOpen && (
        <div
          className="master-popup-overlay"
          onClick={handleClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(7, 23, 43, 0.82)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            animation: 'fadeIn 0.22s ease'
          }}
        >
          <div
            className="master-popup-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '540px',
              backgroundColor: '#0F243A',
              borderRadius: '16px',
              border: '2px solid rgba(0, 255, 102, 0.4)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.65), 0 0 35px rgba(0, 255, 102, 0.15)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              animation: 'scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Botón flotante para cerrar (X) */}
            <button
              onClick={handleClose}
              aria-label="Cerrar publicidad"
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                zIndex: 20,
                background: 'rgba(0, 0, 0, 0.65)',
                backdropFilter: 'blur(4px)',
                border: '1.5px solid rgba(255, 255, 255, 0.3)',
                color: '#FFFFFF',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#006400';
                e.currentTarget.style.borderColor = '#32CD32';
                e.currentTarget.style.transform = 'scale(1.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.65)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <X size={20} />
            </button>

            {/* ── EL BANNER (Al hacer clic redirige directo al programa) ── */}
            <div
              onClick={handleGoToProgram}
              title="Haz clic en el banner para ver la maestría en detalle"
              style={{
                position: 'relative',
                cursor: 'pointer',
                width: '100%',
                maxHeight: '70vh',
                backgroundColor: '#0F243A',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img
                src={banners[activeSlide].img}
                alt={banners[activeSlide].alt}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '70vh',
                  objectFit: 'contain',
                  display: 'block',
                  transition: 'transform 0.25s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.015)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />

              {/* Controles para cambiar entre afiches si hay más de 1 */}
              {banners.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    aria-label="Banner anterior"
                    style={{
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(0, 0, 0, 0.6)',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '50%',
                      width: '34px',
                      height: '34px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#FFFFFF',
                      zIndex: 10,
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 100, 0, 0.85)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)'}
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    onClick={nextSlide}
                    aria-label="Siguiente banner"
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(0, 0, 0, 0.6)',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '50%',
                      width: '34px',
                      height: '34px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#FFFFFF',
                      zIndex: 10,
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 100, 0, 0.85)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)'}
                  >
                    <ChevronRight size={20} />
                  </button>

                  {/* Indicadores de puntos minimalistas */}
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '6px',
                    zIndex: 10,
                    background: 'rgba(0, 0, 0, 0.5)',
                    padding: '4px 8px',
                    borderRadius: '99px'
                  }}>
                    {banners.map((_, idx) => (
                      <div
                        key={idx}
                        onClick={(e) => { e.stopPropagation(); setActiveSlide(idx); }}
                        style={{
                          width: activeSlide === idx ? '18px' : '7px',
                          height: '7px',
                          borderRadius: '99px',
                          background: activeSlide === idx ? '#25D366' : 'rgba(255, 255, 255, 0.5)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* ── BOTÓN ÚNICO: CONSULTAR A WHATSAPP (PEQUEÑO Y SIN FOSFORESCENTE) ── */}
            <div style={{
              padding: '0.6rem 1rem 0.75rem',
              background: '#07172B',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: '#25D366',
                  color: '#FFFFFF',
                  borderRadius: '6px',
                  padding: '0.42rem 1.05rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  textDecoration: 'none',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.28)',
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
                <MessageCircle size={16} color="#FFFFFF" strokeWidth={2.2} />
                <span>Consultar por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── BOTÓN FLOTANTE DISCRETO PARA REABRIR PUBLICIDAD ── */}
      <button
        onClick={() => setIsOpen(true)}
        title="Ver afiche de la Maestría"
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          zIndex: 85,
          background: '#006400',
          color: '#FFFFFF',
          border: '1.5px solid #32CD32',
          borderRadius: '99px',
          padding: '0.55rem 0.95rem',
          boxShadow: '0 4px 14px rgba(0, 50, 0, 0.35)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.8rem',
          fontWeight: 700,
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#004D00';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 50, 0, 0.45)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#006400';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 50, 0, 0.35)';
        }}
      >
        <GraduationCap size={15} color="#32CD32" />
        <span>Convocatoria Maestría</span>
      </button>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
};
