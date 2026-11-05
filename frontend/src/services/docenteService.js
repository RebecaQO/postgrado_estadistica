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

  create: (payload) => apiJson('/api/docentes', { method: 'POST', body: payload }),
  update: (id, payload) => apiJson(`/api/docentes/${id}`, { method: 'PUT', body: payload }),
  delete: (id) => apiJson(`/api/docentes/${id}`, { method: 'DELETE' }),
  updateStatus: (id, activo) => apiJson(
    `/api/docentes/${id}/${activo ? 'reactivar' : 'desactivar'}`,
    { method: 'PATCH' }
  ),
  assignToEdicion: (idEdicion, idDoc) => apiJson(`/api/ediciones/${idEdicion}/docentes`, { method: 'POST', body: { id_doc: idDoc } }),
  removeFromEdicion: (idEdicion, idDoc) => apiJson(`/api/ediciones/${idEdicion}/docentes/${idDoc}`, { method: 'DELETE' }),
};

export default docenteService;
