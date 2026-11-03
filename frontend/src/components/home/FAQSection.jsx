import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Plus, Minus, BookOpen, Users, Calendar, Award, Laptop, HelpCircle, Clock, FileText, Briefcase } from 'lucide-react';

const faqs = [
  {
    icon: Calendar,
    category: 'Duración',
    question: '¿Cuánto dura la Maestría en Ciencia y Análisis de Datos?',
    answer: 'La tercera versión tiene actividades académicas programadas desde abril de 2027 hasta enero de 2029 aproximadamente 20 meses, equivalentes a un año y ocho meses. A este periodo se añade el tiempo previsto por la normativa para la tesis de maestría.',
  },
  {
    icon: Users,
    category: 'Postulación',
    question: '¿Quiénes pueden postular a la maestría?',
    answer: 'La preinscripción solicita título académico y título profesional. El programa tiene orientación multidisciplinaria; la información consultada no establece una lista cerrada de carreras admitidas. La aceptación se comunica después de revisar la postulación.',
  },
  {
    icon: Laptop,
    category: 'Modalidad',
    question: '¿Cuál es la modalidad de estudio?',
    answer: 'La modalidad publicada es semipresencial. Algunas materias serán 100% virtual y otras combinadas hibridas.',
  },
  {
    icon: FileText,
    category: 'Requisitos',
    question: '¿Qué documentos se necesitan para postular?',
    answer: 'Se solicitan copias escaneadas del título académico, título profesional, hoja de vida resumida y cédula de identidad por ambos lados. Después de la admisión se indican los documentos que deben presentarse físicamente.',
  },
  {
    icon: BookOpen,
    category: 'Contenido',
    question: '¿Qué conocimientos se desarrollan durante la maestría?',
    answer: 'Se estudian programación estadística, bases de datos, análisis multivariante, Big Data, minería de datos, modelos lineales y no lineales, y aprendizaje automático y profundo.',
  },
  {
    icon: Clock,
    category: 'Horarios',
    question: '¿Cuáles son los horarios de clases?',
    answer: 'Las clases son los lunes y miércoles, de 19:00 a 22:00, y los sábados, de 08:00 a 13:00.',
  },
  {
    icon: Award,
    category: 'Titulación',
    question: '¿Qué título y certificaciones intermedias se obtienen?',
    answer: 'El título es Magister Scientiarum en Ciencia y Análisis de Datos. La tercera versión contempla dos diplomas intermedios: Ciencia de Datos y Big Data, y Ciencia de Datos y Data Mining.',
  },
  {
    icon: Briefcase,
    category: 'Campo Laboral',
    question: '¿En qué ámbitos se pueden aplicar los conocimientos adquiridos?',
    answer: 'En investigación y análisis de datos, así como en asesoramiento a instituciones públicas y privadas. La formación aborda aplicaciones en negocios, economía, salud y tecnología.',
  },
];

const categoryColors = {
  'Duración':      { bg: '#edf4f9', text: '#4f7e9f', dot: '#4f7e9f' },
  'Postulación':   { bg: '#f5f0fa', text: '#7c5cbf', dot: '#7c5cbf' },
  'Modalidad':     { bg: '#fdf7e7', text: '#9e7512', dot: '#9e7512' },
  'Requisitos':    { bg: '#eaf5ec', text: '#267342', dot: '#267342' },
  'Contenido':     { bg: '#f0f4ff', text: '#4060bf', dot: '#4060bf' },
  'Horarios':      { bg: '#fff0ee', text: '#b3392f', dot: '#b3392f' },
  'Titulación':    { bg: '#eaf5ec', text: '#267342', dot: '#267342' },
  'Campo Laboral': { bg: '#edf4f9', text: '#4f7e9f', dot: '#4f7e9f' },
};

const FAQItem = ({ faq, isOpen, onToggle, index }) => {
  const panelRef = useRef(null);
  const Icon = faq.icon;
  const catStyle = categoryColors[faq.category] || { bg: '#eaf5ec', text: '#267342', dot: '#267342' };

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '6px',
        overflow: 'hidden',
        border: `1px solid ${isOpen ? catStyle.dot + '50' : '#e2e8f0'}`,
        boxShadow: isOpen
          ? `0 8px 24px -4px ${catStyle.dot}18`
          : '0 2px 6px -2px rgba(0,0,0,0.04)',
        transition: 'all 0.22s ease',
      }}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          width: '100%',
          background: isOpen ? `linear-gradient(135deg, ${catStyle.bg} 0%, #ffffff 100%)` : 'transparent',
          border: 'none',
          padding: '1.15rem 1.35rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.9rem',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'background 0.2s ease',
        }}
      >
        {/* Icon square */}
        <span style={{
          flexShrink: 0,
          width: '36px',
          height: '36px',
          borderRadius: '4px',
          background: catStyle.bg,
          border: `1px solid ${catStyle.dot}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '2px',
          transition: 'transform 0.2s ease',
          transform: isOpen ? 'scale(1.05)' : 'scale(1)',
        }}>
          <Icon size={17} color={catStyle.text} strokeWidth={2.2} />
        </span>

        <div style={{ flex: 1 }}>
          {/* Category tag */}
          <span style={{
            display: 'inline-block',
            fontSize: '0.64rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: catStyle.text,
            marginBottom: '0.25rem',
          }}>
            {faq.category}
          </span>
          {/* Question */}
          <p style={{
            margin: 0,
            fontSize: '0.95rem',
            fontWeight: 700,
            color: isOpen ? catStyle.text : '#33373d',
            lineHeight: 1.4,
            transition: 'color 0.22s ease',
          }}>
            {faq.question}
          </p>
        </div>

        {/* Toggle icon */}
        <span style={{
          flexShrink: 0,
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: isOpen ? catStyle.dot : '#f1f4f2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '4px',
          transition: 'all 0.22s ease',
        }}>
          {isOpen
            ? <Minus size={14} color="#ffffff" strokeWidth={2.5} />
            : <Plus size={14} color="#5f656d" strokeWidth={2.5} />
          }
        </span>
      </button>

      {/* Answer panel with CSS grid animation */}
      <div
        ref={panelRef}
        style={{
          display: 'grid',
          gridTemplateRows: isOpen ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
          overflow: 'hidden',
        }}
      >
        <div style={{ minHeight: 0 }}>
          <p style={{
            margin: 0,
            padding: '0 1.35rem 1.25rem 4.35rem',
            fontSize: '0.9rem',
            color: '#5f656d',
            lineHeight: 1.75,
            borderTop: '1px solid #f0f4f1',
            paddingTop: '1rem',
          }}>
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export const FAQSection = () => {
  const [openIdx, setOpenIdx] = useState(0);

  const toggle = (idx) => setOpenIdx(openIdx === idx ? null : idx);

  // Split into two columns
  const half = Math.ceil(faqs.length / 2);
  const col1 = faqs.slice(0, half);
  const col2 = faqs.slice(half);

  return (
    <section
      style={{
        padding: 'clamp(3rem, 6vw, 5rem) 0',
        background: 'linear-gradient(180deg, #f9f9f6 0%, #f3f7f4 60%, #edf4f9 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decoration */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        top: '-80px',
        right: '-80px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(38,115,66,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div aria-hidden="true" style={{
        position: 'absolute',
        bottom: '-60px',
        left: '-60px',
        width: '320px',
        height: '320px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(79,126,159,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container">
        {/* Section header */}
        <div className="section-header" data-reveal>
          <div className="section-tag">
            <HelpCircle size={13} />
            <span>Centro de Ayuda</span>
          </div>
          <h2 className="section-title">
            Preguntas <span className="highlight">frecuentes</span>
          </h2>
          <p className="section-subtitle">
            Todo lo que necesitas saber sobre la Maestría en Ciencia y Análisis de Datos y nuestros programas de posgrado.
          </p>
        </div>

        {/* Two-column FAQ grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
          gap: '0.75rem',
          alignItems: 'start',
        }}>
          {/* Column 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {col1.map((faq, i) => (
              <FAQItem
                key={i}
                faq={faq}
                index={i}
                isOpen={openIdx === i}
                onToggle={() => toggle(i)}
              />
            ))}
          </div>
          {/* Column 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {col2.map((faq, i) => {
              const globalIdx = half + i;
              return (
                <FAQItem
                  key={globalIdx}
                  faq={faq}
                  index={globalIdx}
                  isOpen={openIdx === globalIdx}
                  onToggle={() => toggle(globalIdx)}
                />
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{
          textAlign: 'center',
          marginTop: 'clamp(2rem, 4vw, 3rem)',
          padding: '1.8rem 2rem',
          background: 'linear-gradient(135deg, #0e2d19 0%, #164828 60%, #1a3a58 100%)',
          borderRadius: '18px',
          maxWidth: '580px',
          margin: 'clamp(2rem, 4vw, 3rem) auto 0',
          boxShadow: '0 12px 36px -8px rgba(14,45,25,0.35)',
        }}>
          <p style={{ color: 'rgba(220,235,228,0.9)', marginBottom: '1.1rem', fontSize: '0.96rem', margin: '0 0 1.1rem' }}>
            ¿Tienes más preguntas? Escríbenos por WhatsApp y te respondemos de inmediato.
          </p>
          <a
            href="https://wa.me/59176543210?text=Hola%2C%20tengo%20una%20consulta%20sobre%20los%20programas%20de%20Posgrado%20en%20Estadística%20UMSA"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: '#25D366',
              color: '#ffffff',
              border: 'none',
              borderRadius: '99px',
              padding: '0.7rem 1.6rem',
              fontSize: '0.92rem',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(37,211,102,0.3)',
              transition: 'transform 0.18s ease, box-shadow 0.18s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,211,102,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,211,102,0.3)';
            }}
          >
            <MessageCircle size={18} strokeWidth={2.2} />
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};


