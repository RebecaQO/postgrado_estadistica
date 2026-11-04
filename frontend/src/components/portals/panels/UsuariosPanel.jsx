import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, AlertCircle } from 'lucide-react';
import { apiJson } from '../../../utils/api';

export default function UsuariosPanel() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'usuario',
    activo: true,
  });

  const cargar = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiJson('/api/usuarios');
      setUsuarios(Array.isArray(data) ? data : (data?.data || []));
    } catch (err) {
      if (err.status === 403) {
        setError('Sin permisos para ver o administrar usuarios.');
      } else {
        setError(err.message || 'Error al cargar usuarios.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const abrirCrear = () => {
    setEditing(null);
    setForm({
      nombre: '',
      email: '',
      password: '',
      rol: 'usuario',
      activo: true,
    });
    setFieldErrors({});
    setModalOpen(true);
  };

  const abrirEditar = (usr) => {
    setEditing(usr);
    setForm({
      nombre: usr.nombre || '',
      email: usr.email || '',
      password: '',
      rol: usr.rol || 'usuario',
      activo: usr.activo ?? true,
    });
    setFieldErrors({});
    setModalOpen(true);
  };

  const guardar = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setError(null);

    try {
      const payload = { ...form };
      if (editing && !payload.password) {
        delete payload.password;
      }

      if (editing) {
        const updated = await apiJson(`/api/usuarios/${editing.id}`, {
          method: 'PUT',
          body: payload,
        });
        setUsuarios((prev) =>
          prev.map((u) => (u.id === editing.id ? (updated.data || updated) : u))
        );
      } else {
        const created = await apiJson('/api/usuarios', {
          method: 'POST',
          body: payload,
        });
        setUsuarios((prev) => [...prev, (created.data || created)]);
      }

      setModalOpen(false);
    } catch (err) {
      if (err.status === 422 && err.errors) {
        setFieldErrors(err.errors);
      } else if (err.status === 403) {
        setError('Sin permisos para realizar esta operación.');
      } else {
        setError(err.message || 'Error al guardar el usuario.');
      }
    }
  };

  const alternarEstado = async (usr) => {
    try {
      setError(null);
      const accion = usr.activo ? 'desactivar' : 'reactivar';
      const updated = await apiJson(`/api/usuarios/${usr.id}/${accion}`, {
        method: 'PATCH',
      });
      const dataUpdated = updated?.data || updated;
      setUsuarios((prev) =>
        prev.map((u) => (u.id === usr.id ? { ...u, activo: dataUpdated.activo } : u))
      );
    } catch (err) {
      if (err.status === 409) {
        setError(err.message || 'No se puede desactivar el último administrador.');
      } else {
        setError(err.message || 'Error al cambiar estado del usuario.');
      }
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;
    try {
      setError(null);
      await apiJson(`/api/usuarios/${id}`, { method: 'DELETE' });
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      if (err.status === 409) {
        setError(err.message || 'No se puede eliminar el usuario.');
      } else {
        setError(err.message || 'Error al eliminar usuario.');
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.35rem', color: 'var(--color-text-main)', fontWeight: 800, margin: 0 }}>
            Gestión de Usuarios y Accesos
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
            Administra los usuarios autorizados para operar el portal de postgrado.
          </p>
        </div>

        <button
          onClick={abrirCrear}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={16} />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      {error && (
        <div style={{
          padding: '0.85rem 1.25rem',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid #ef4444',
          borderRadius: '6px',
          color: '#ef4444',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          Cargando usuarios...
        </div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                    No se encontraron usuarios registrados.
                  </td>
                </tr>
              ) : (
                usuarios.map((usr) => (
                  <tr key={usr.id}>
                    <td style={{ fontFamily: 'var(--font-family-mono)', fontWeight: 700 }}>
                      {usr.id}
                    </td>
                    <td><strong>{usr.nombre}</strong></td>
                    <td>{usr.email || '—'}</td>
                    <td>
                      <span className={`badge ${usr.rol === 'admin' ? 'badge-green-inst' : 'badge-blue'}`}>
                        {usr.rol}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => alternarEstado(usr)}
                        className={`badge ${usr.activo ? 'badge-green' : 'badge-red'}`}
                        style={{ cursor: 'pointer', border: 'none' }}
                        title="Alternar estado"
                      >
                        {usr.activo ? '✓ Activo' : '✕ Inactivo'}
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => abrirEditar(usr)}
                          className="btn btn-secondary btn-sm"
                          title="Editar usuario"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => eliminar(usr.id)}
                          className="btn btn-secondary btn-sm"
                          style={{ color: 'var(--color-status-danger)' }}
                          title="Eliminar usuario"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="modal-backdrop" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--color-bg-card, #ffffff)', padding: '2rem', borderRadius: '8px',
            width: '100%', maxWidth: '480px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
          }}>
            <h4 style={{ margin: '0 0 1.25rem 0', color: 'var(--color-text-main)' }}>
              {editing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
            </h4>

            <form onSubmit={guardar}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Nombre de Usuario *
                </label>
                <input
                  type="text"
                  className="input-text"
                  style={{ width: '100%' }}
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  required
                />
                {fieldErrors.nombre && (
                  <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>
                    {fieldErrors.nombre[0]}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  className="input-text"
                  style={{ width: '100%' }}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
                {fieldErrors.email && (
                  <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>
                    {fieldErrors.email[0]}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Contraseña {editing ? '(Dejar vacía para conservar)' : '* (Mín. 8 caracteres)'}
                </label>
                <input
                  type="password"
                  className="input-text"
                  style={{ width: '100%' }}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required={!editing}
                  minLength={8}
                />
                {fieldErrors.password && (
                  <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>
                    {fieldErrors.password[0]}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Rol en el Sistema *
                </label>
                <select
                  className="input-text"
                  style={{ width: '100%' }}
                  value={form.rol}
                  onChange={(e) => setForm({ ...form, rol: e.target.value })}
                >
                  <option value="usuario">Usuario (Lectura / Operativo)</option>
                  <option value="admin">Administrador (Total)</option>
                </select>
                {fieldErrors.rol && (
                  <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>
                    {fieldErrors.rol[0]}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editing ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
