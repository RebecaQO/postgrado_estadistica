import { apiJson } from '../utils/api';

export const docenteService = {
  /**
   * Obtiene la lista pública de docentes activos
   */
  getPublicDocentes: () => apiJson('/api/docentes'),

  /**
   * Obtiene la lista administrativa de docentes
   */
  getAdminDocentes: () => apiJson('/api/docentes'),

  /**
   * Sube una foto de docente
   */
  uploadFoto: async (file) => {
    const formData = new FormData();
    formData.append('foto', file);
    return apiJson('/api/docentes/upload-foto', {
      method: 'POST',
      body: formData,
    });
  },

  create: (payload) => apiJson('/api/docentes', { method: 'POST', body: payload }),
  update: (id, payload) => apiJson(`/api/docentes/${id}`, { method: 'PUT', body: payload }),
  delete: (id) => apiJson(`/api/docentes/${id}`, { method: 'DELETE' }),
};

export default docenteService;
