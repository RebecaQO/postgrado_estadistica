import { apiJson } from '../utils/api';

export const docenteService = {
  /**
   * Obtiene la lista pública de docentes activos
   */
  getPublicDocentes: () => apiJson('/api/docentes'),

  /**
   * Obtiene la lista administrativa de docentes
   */
  getAdminDocentes: () => apiJson('/api/admin/docentes'),

  /**
   * Sube una foto de docente
   */
  uploadFoto: async (file) => {
    const formData = new FormData();
    formData.append('foto', file);
    return apiJson('/api/admin/docentes/upload-foto', {
      method: 'POST',
      body: formData,
    });
  },

  create: (payload) => apiJson('/api/admin/docentes', { method: 'POST', body: payload }),
  update: (id, payload) => apiJson(`/api/admin/docentes/${id}`, { method: 'PUT', body: payload }),
  delete: (id) => apiJson(`/api/admin/docentes/${id}`, { method: 'DELETE' }),
};

export default docenteService;
