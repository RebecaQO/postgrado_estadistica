import { apiJson } from '../utils/api';

export const convocatoriaService = {
  /**
   * Obtiene el listado de convocatorias históricas pasadas
   */
  getConvocatoriasPasadas: () => apiJson('/api/convocatorias-pasadas'),

  create: (payload) => apiJson('/api/ediciones', { method: 'POST', body: payload }),
  sincronizarEdiciones: () => apiJson('/api/convocatorias-pasadas'),
  delete: (id) => apiJson(`/api/ediciones/${id}`, { method: 'DELETE' }),
};

export default convocatoriaService;
