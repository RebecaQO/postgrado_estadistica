import { apiClient } from './apiClient';

export const defensaService = {
  /**
   * Obtiene la lista de defensas de grado y sustentación de tesis
   */
  getDefensasTesis: () => apiClient('/api/defensas-tesis'),

  save: (payload) => apiClient('/api/admin/defensas-tesis', { method: 'POST', body: payload }),
  delete: (id) => apiClient(`/api/admin/defensas-tesis/${id}`, { method: 'DELETE' }),
};

export default defensaService;
