import { apiJson } from '../utils/api';

export const adminService = {
  getUsuarios: () => apiJson('/api/usuarios'),
  createUsuario: (payload) => apiJson('/api/usuarios', { method: 'POST', body: payload }),
  updateUsuarioEstado: (id, estado) => apiJson(
    `/api/usuarios/${id}/${estado === 'Activo' ? 'reactivar' : 'desactivar'}`,
    { method: 'PATCH' }
  ),
  deleteUsuario: (id) => apiJson(`/api/usuarios/${id}`, { method: 'DELETE' }),
  getRoles: () => Promise.resolve(['admin', 'usuario']),
};

export default adminService;
