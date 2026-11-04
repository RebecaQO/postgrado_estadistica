import { apiJson } from '../utils/api';

export const defensaService = {
  /**
   * Obtiene la lista de defensas de grado y sustentación de tesis
   */
  getDefensasTesis: () => apiJson('/api/defensas-tesis'),

  save: (payload) => {
    if (payload.id) {
      return apiJson(`/api/defensas-tesis/${payload.id}`, { method: 'PUT', body: payload });
    }
    return apiJson('/api/defensas-tesis', { method: 'POST', body: payload });
  },
  delete: (id) => apiJson(`/api/defensas-tesis/${id}`, { method: 'DELETE' }),
};

export default defensaService;
