import { apiJson } from '../utils/api';

export const convocatoriaService = {
  /**
   * Obtiene el listado de convocatorias históricas pasadas
   */
  getConvocatoriasPasadas: () => apiJson('/api/convocatorias-pasadas'),

  create: (payload) => apiJson('/api/admin/convocatorias-pasadas', { method: 'POST', body: payload }),
  sincronizarEdiciones: () => apiJson('/api/admin/convocatorias-pasadas/sincronizar-ediciones', { method: 'POST' }),
  delete: (id) => apiJson(`/api/admin/convocatorias-pasadas/${id}`, { method: 'DELETE' }),
};

export default convocatoriaService;
