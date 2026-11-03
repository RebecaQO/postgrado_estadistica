import { apiJson } from '../utils/api';

export const adminService = {
  getUsuarios: () => apiJson('/api/admin/usuarios'),
  createUsuario: (payload) => apiJson('/api/admin/usuarios', { method: 'POST', body: payload }),
  updateUsuarioEstado: (id, estado) => apiJson(`/api/admin/usuarios/${id}/estado`, { method: 'PATCH', body: { estado } }),
  deleteUsuario: (id) => apiJson(`/api/admin/usuarios/${id}`, { method: 'DELETE' }),
  getRoles: () => apiJson('/api/admin/roles'),
};

export default adminService;
