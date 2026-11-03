import { apiClient } from './apiClient';

export const docenteService = {
  /**
   * Obtiene la lista pública de docentes activos
   */
  getPublicDocentes: () => apiClient('/api/docentes'),

  /**
   * Obtiene la lista administrativa de docentes
   */
  getAdminDocentes: () => apiClient('/api/admin/docentes'),

  /**
   * Sube una foto de docente
   */
  uploadFoto: async (file) => {
    const formData = new FormData();
    formData.append('foto', file);
    return apiClient('/api/admin/docentes/upload-foto', {
      method: 'POST',
      body: formData,
    });
  },

  create: (payload) => apiClient('/api/admin/docentes', { method: 'POST', body: payload }),
  update: (id, payload) => apiClient(`/api/admin/docentes/${id}`, { method: 'PUT', body: payload }),
  delete: (id) => apiClient(`/api/admin/docentes/${id}`, { method: 'DELETE' }),
};

export default docenteService;
