import { apiClient } from './apiClient';

export const adminService = {
  getUsuarios: () => apiClient('/api/admin/usuarios'),
  createUsuario: (payload) => apiClient('/api/admin/usuarios', { method: 'POST', body: payload }),
  updateUsuarioEstado: (id, estado) => apiClient(`/api/admin/usuarios/${id}/estado`, { method: 'PATCH', body: { estado } }),
  deleteUsuario: (id) => apiClient(`/api/admin/usuarios/${id}`, { method: 'DELETE' }),
  getRoles: () => apiClient('/api/admin/roles'),
};

export default adminService;
