import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Mail,
  Phone,
  Globe,
  Clock,
  User,
  BookOpen,
  Users,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { apiJson } from '../../../utils/api';

export default function CarreraPanel() {
  const [form, setForm] = useState({
    nombre_carrera: '',
    direccion: '',
    email: '',
    telefono: '',
    whatsapp: '',
    horarios_atencion: '',
    director: '',
    campus_virtual_url: '',
    descripcion_ieta: '',
    descripcion_club: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const cargar = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiJson('/api/institucion');
      const info = data.data || data;
      setForm({
        nombre_carrera: info.nombre_carrera || '',
        direccion: info.direccion || '',
        email: info.email || info.email_principal || '',
        telefono: info.telefono || '',
        whatsapp: info.whatsapp || '',
        horarios_atencion: info.horarios_atencion || info.horario_atencion || '',
        director: info.director || info.director_nombre || '',
        campus_virtual_url: info.campus_virtual_url || '',
        descripcion_ieta: info.descripcion_ieta || info.ieta_descripcion || '',
        descripcion_club: info.descripcion_club || info.club_cientifico_descripcion || '',
      });
    } catch (err) {
      if (err.status === 403) {
        setError('Sin permisos para ver la información institucional.');
      } else {
        setError(err.message || 'Error al cargar la información institucional.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    setFieldErrors({});

    try {
      const updated = await apiJson('/api/institucion', {
        method: 'PUT',
        body: form,
      });
      const info = updated.data || updated;
      setForm({
        nombre_carrera: info.nombre_carrera || '',
        direccion: info.direccion || '',
        email: info.email || info.email_principal || '',
        telefono: info.telefono || '',
        whatsapp: info.whatsapp || '',
        horarios_atencion: info.horarios_atencion || info.horario_atencion || '',
        director: info.director || info.director_nombre || '',
        campus_virtual_url: info.campus_virtual_url || '',
        descripcion_ieta: info.descripcion_ieta || info.ieta_descripcion || '',
        descripcion_club: info.descripcion_club || info.club_cientifico_descripcion || '',
      });
      setSuccess('Información institucional actualizada exitosamente.');
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      if (err.status === 422 && err.errors) {
        setFieldErrors(err.errors);
      } else if (err.status === 403) {
        setError('Sin permisos de administrador para actualizar la información.');
      } else {
        setError(err.message || 'Error al guardar la información institucional.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem auto' }} />
        <p>Cargando información institucional...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.35rem', color: 'var(--color-text-main)', fontWeight: 800, margin: 0 }}>
          Información Institucional, Carrera & IETA
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
          Configuración oficial de direcciones, canales de contacto, IETA, Club Científico y campus virtual en PostgreSQL.
        </p>
      </div>

      {error && (
        <div style={{
          padding: '0.85rem 1.25rem', background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid #ef4444', borderRadius: '6px', color: '#ef4444',
          marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div style={{
          padding: '0.85rem 1.25rem', background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid #10b981', borderRadius: '6px', color: '#10b981',
          marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          <CheckCircle2 size={18} />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="glass-card" style={{ background: '#ffffff', border: '1.5px solid var(--color-border)', padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          
          {/* Nombre Carrera */}
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
              <BookOpen size={16} color="var(--color-green-inst)" />
              <span>Nombre Oficial de la Carrera / Institución</span>
            </label>
            <input
              type="text"
              required
              value={form.nombre_carrera}
              onChange={(e) => handleChange('nombre_carrera', e.target.value)}
              className="form-input"
              placeholder="Carrera de Estadística - Universidad Mayor de San Andrés"
            />
            {fieldErrors.nombre_carrera && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>
                {fieldErrors.nombre_carrera[0]}
              </p>
            )}
          </div>

          {/* Dirección */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
              <MapPin size={16} color="var(--color-green-inst)" />
              <span>Dirección de la Carrera & Campus</span>
            </label>
            <textarea
              rows={2}
              required
              value={form.direccion}
              onChange={(e) => handleChange('direccion', e.target.value)}
              className="form-textarea"
              placeholder="Campus Universitario Cota Cota, Calle 27, Edificio FCPN..."
            />
            {fieldErrors.direccion && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>
                {fieldErrors.direccion[0]}
              </p>
            )}
          </div>

          {/* Correo Electrónico */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
              <Mail size={16} color="var(--color-green-inst)" />
              <span>Correo Electrónico Oficial de Posgrado</span>
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="form-input"
              placeholder="estapost@fcpn.edu.bo"
            />
            {fieldErrors.email && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>
                {fieldErrors.email[0]}
              </p>
            )}
          </div>

          {/* Teléfono Fijo */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
              <Phone size={16} color="var(--color-green-inst)" />
              <span>Teléfono de Secretaría / Oficina</span>
            </label>
            <input
              type="text"
              value={form.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              className="form-input"
              placeholder="+591 (2) 279-2999"
            />
            {fieldErrors.telefono && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>
                {fieldErrors.telefono[0]}
              </p>
            )}
          </div>

          {/* WhatsApp */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
              <Phone size={16} color="var(--color-green-inst)" />
              <span>Línea Móvil / WhatsApp de Consultas</span>
            </label>
            <input
              type="text"
              value={form.whatsapp}
              onChange={(e) => handleChange('whatsapp', e.target.value)}
              className="form-input"
              placeholder="+591 76543210"
            />
            {fieldErrors.whatsapp && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>
                {fieldErrors.whatsapp[0]}
              </p>
            )}
          </div>

          {/* Horario de Atención */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
              <Clock size={16} color="var(--color-green-inst)" />
              <span>Horarios de Atención en Ventanilla</span>
            </label>
            <input
              type="text"
              value={form.horarios_atencion}
              onChange={(e) => handleChange('horarios_atencion', e.target.value)}
              className="form-input"
              placeholder="Lunes a Viernes 08:30 - 18:30"
            />
            {fieldErrors.horarios_atencion && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>
                {fieldErrors.horarios_atencion[0]}
              </p>
            )}
          </div>

          {/* Director de Carrera */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
              <User size={16} color="var(--color-green-inst)" />
              <span>Dirección / Autoridad de la Carrera</span>
            </label>
            <input
              type="text"
              value={form.director}
              onChange={(e) => handleChange('director', e.target.value)}
              className="form-input"
              placeholder="Dirección de la Carrera de Estadística y Posgrado"
            />
            {fieldErrors.director && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>
                {fieldErrors.director[0]}
              </p>
            )}
          </div>

          {/* Campus Virtual URL */}
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
              <Globe size={16} color="var(--color-green-inst)" />
              <span>Enlace Directo al Campus Virtual / Moodle de Posgrado</span>
            </label>
            <input
              type="url"
              value={form.campus_virtual_url}
              onChange={(e) => handleChange('campus_virtual_url', e.target.value)}
              className="form-input"
              placeholder="https://maestria.estadistica.fcpn.edu.bo"
            />
            {fieldErrors.campus_virtual_url && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>
                {fieldErrors.campus_virtual_url[0]}
              </p>
            )}
          </div>

          {/* IETA */}
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
              <BookOpen size={16} color="var(--color-green-inst)" />
              <span>Instituto de Estadística Teórica y Aplicada (IETA)</span>
            </label>
            <textarea
              rows={3}
              value={form.descripcion_ieta}
              onChange={(e) => handleChange('descripcion_ieta', e.target.value)}
              className="form-textarea"
              placeholder="Misión, líneas de investigación, consultoría estadística y desarrollo nacional del IETA..."
            />
            {fieldErrors.descripcion_ieta && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>
                {fieldErrors.descripcion_ieta[0]}
              </p>
            )}
          </div>

          {/* Club Científico */}
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
              <Users size={16} color="var(--color-green-inst)" />
              <span>Sociedad Científica & Club de Ciencia de Datos</span>
            </label>
            <textarea
              rows={3}
              value={form.descripcion_club}
              onChange={(e) => handleChange('descripcion_club', e.target.value)}
              className="form-textarea"
              placeholder="Actividades estudiantiles, datathons, semilleros y hackathons del club científico..."
            />
            {fieldErrors.descripcion_club && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>
                {fieldErrors.descripcion_club[0]}
              </p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={cargar}
            disabled={saving}
          >
            Descartar Cambios
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Save size={16} />
            <span>{saving ? 'Guardando...' : 'Guardar Información'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
