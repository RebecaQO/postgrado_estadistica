import { apiJson } from '../utils/api';

export const defensaService = {
  /**
   * Obtiene la lista de defensas de grado y sustentación de tesis
   */
  getDefensasTesis: () => apiJson('/api/defensas-tesis'),

  save: (payload) => apiJson('/api/admin/defensas-tesis', { method: 'POST', body: payload }),
  delete: (id) => apiJson(`/api/admin/defensas-tesis/${id}`, { method: 'DELETE' }),
};

export default defensaService;
