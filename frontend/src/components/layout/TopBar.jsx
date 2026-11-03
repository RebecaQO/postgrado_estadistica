import React, { useState, useEffect } from 'react';
import { Phone, ExternalLink, MessageCircle, ShieldCheck, BookOpen } from 'lucide-react';
import { institucionService } from '../../services/institucionService';

export const TopBar = () => {
  const [info, setInfo] = useState({
    telefono: '+591 (2) 279-2999',
    whatsapp: '+591 76543210',
    email_principal: 'estapost@fcpn.edu.bo',
    campus_virtual_url: 'https://maestria.estadistica.fcpn.edu.bo'
  });

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const data = await institucionService.getInfo();
        if (data && data.email_principal) {
          setInfo(prev => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error('Error cargando info institucional en TopBar:', err);
      }
    };
    fetchInfo();
  }, []);

  const cleanWhatsapp = (info.whatsapp || '59176543210').replace(/\D/g, '');

  return (
    <div style={{
      background: '#004000',  /* Verde oscuro institucional profundo */
      color: '#ffffff',
      fontSize: '0.8rem',
      padding: '0.5rem 0',
      position: 'relative',
      zIndex: 50,
      borderBottom: '2px solid var(--color-green-lime)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        {/* Left institutional badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            color: '#b7f5b7',
            fontWeight: 800,
            fontSize: '0.75rem',
            background: 'rgba(0, 200, 0, 0.2)',
            padding: '0.2rem 0.6rem',
            borderRadius: 'var(--radius-full)',
            whiteSpace: 'nowrap'
          }}>
            <ShieldCheck size={14} color="#4ade80" /> CONVOCATORIAS 2026
          </span>
          <span className="topbar-desktop-only" style={{ color: 'rgba(255,255,255,0.4)' }}>|</span>
          <span className="topbar-desktop-only" style={{ color: '#f1f5f9', fontWeight: 500 }}>
            Acreditación Nacional CEUB • Facultad de Ciencias Puras y Naturales (FCPN - UMSA)
          </span>
        </div>

        {/* Right fast links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <a
            href={`tel:${(info.telefono || '').replace(/\s+/g, '')}`}
            className="topbar-desktop-only"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ffffff' }}
            title="Secretaría de Posgrado"
          >
            <Phone size={13} style={{ color: '#4ade80' }} />
            <span>{info.telefono}</span>
          </a>

          <a
            href={`mailto:${info.email_principal}`}
            className="topbar-desktop-only"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ffffff' }}
            title="Correo de Posgrado"
          >
            <span style={{ color: '#4ade80' }}>✉</span>
            <span>{info.email_principal}</span>
          </a>

          <a
            href={info.campus_virtual_url}
            target="_blank"
            rel="noreferrer"
            className="topbar-desktop-only"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: '#38bdf8',
              fontWeight: 600
            }}
          >
            <BookOpen size={13} />
            <span>Campus Virtual</span>
            <ExternalLink size={11} style={{ opacity: 0.8 }} />
          </a>

          <a
            href={`https://wa.me/${cleanWhatsapp}?text=Hola,%20deseo%20información%20sobre%20los%20programas%20de%20Posgrado%20en%20Estadística%20UMSA`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: '#4ade80',
              fontWeight: 700,
              fontSize: '0.78rem',
              background: 'rgba(74, 222, 128, 0.12)',
              padding: '0.2rem 0.55rem',
              borderRadius: 'var(--radius-full)'
            }}
          >
            <MessageCircle size={14} />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .topbar-desktop-only {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
