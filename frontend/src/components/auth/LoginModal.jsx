import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  ShieldCheck, 
  KeyRound, 
  Mail, 
  ArrowRight, 
  CheckCircle2,
  Lock
} from 'lucide-react';

export const LoginModal = ({ onLoginSuccess }) => {
  const { loginModalOpen, setLoginModalOpen, loginAs, authError } = useAuth();

  const [emailInput, setEmailInput] = useState('admin@umsa.bo');
  const [passwordInput, setPasswordInput] = useState('Admin123!');
  const [loading, setLoading] = useState(false);

  if (!loginModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await loginAs({ email: emailInput, password: passwordInput });
      if (user && onLoginSuccess) {
        onLoginSuccess('admin');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setLoginModalOpen(false)}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ 
          maxWidth: '480px', 
          width: '94%',
          background: '#ffffff', 
          border: '1px solid #e2e8f0', 
          boxShadow: 'var(--shadow-xl)',
          borderRadius: 'var(--radius-xl)',
          padding: 0,
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a5f 0%, #267342 100%)',
          padding: '1.75rem 1.75rem',
          color: '#ffffff',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.18)',
              backdropFilter: 'blur(8px)',
              border: '1.5px solid rgba(255, 255, 255, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <ShieldCheck size={24} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                Acceso Administrativo
              </h3>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)', marginTop: '0.15rem' }}>
                Dirección de Posgrado · Carrera de Estadística UMSA
              </div>
            </div>
          </div>

          <button 
            className="modal-close-btn"
            onClick={() => setLoginModalOpen(false)}
            style={{ color: '#ffffff', background: 'rgba(255,255,255,0.15)', borderRadius: '50%', border: 'none', padding: '0.4rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '1.75rem' }}>
          {/* Admin notice */}
          <div style={{
            background: 'var(--color-green-inst-subtle)',
            border: '1px solid var(--color-green-inst-border)',
            borderRadius: 'var(--radius-md)',
            padding: '0.9rem 1.1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <KeyRound size={20} color="var(--color-green-inst)" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.82rem', color: 'var(--color-green-inst)', fontWeight: 600, lineHeight: 1.4 }}>
              Panel de gestión exclusiva para administradores de programas, convocatorias, información de carrera y defensas de grado.
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                <span>Correo Institucional</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>admin@umsa.bo</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={17} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="admin@umsa.bo"
                  className="form-control"
                  style={{ paddingLeft: '2.6rem', height: '48px', fontSize: '0.95rem' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                <span>Contraseña</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>Admin123!</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={17} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="form-control"
                  style={{ paddingLeft: '2.6rem', height: '48px', fontSize: '0.95rem' }}
                />
              </div>
            </div>

            {authError && (
              <div style={{
                padding: '0.75rem 1rem',
                background: 'var(--color-status-danger-bg)',
                border: '1px solid var(--color-status-danger-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-status-danger)',
                fontSize: '0.825rem',
                fontWeight: 700
              }}>
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-block"
              style={{
                height: '48px',
                fontSize: '0.95rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                marginTop: '0.5rem',
                boxShadow: '0 4px 14px rgba(38, 115, 66, 0.35)'
              }}
            >
              <span>{loading ? 'Verificando credenciales...' : 'Ingresar al Portal Administrativo'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
