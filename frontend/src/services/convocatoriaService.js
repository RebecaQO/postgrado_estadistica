import { apiClient } from './apiClient';

export const convocatoriaService = {
  /**
   * Obtiene el listado de convocatorias históricas pasadas
   */
  getConvocatoriasPasadas: () => apiClient('/api/convocatorias-pasadas'),

  create: (payload) => apiClient('/api/admin/convocatorias-pasadas', { method: 'POST', body: payload }),
  sincronizarEdiciones: () => apiClient('/api/admin/convocatorias-pasadas/sincronizar-ediciones', { method: 'POST' }),
  delete: (id) => apiClient(`/api/admin/convocatorias-pasadas/${id}`, { method: 'DELETE' }),
};

export default convocatoriaService;
