import { apiJson } from '../utils/api';

export const institucionService = {
  /**
   * Obtiene la información institucional de la carrera
   */
  getInfo: () => apiJson('/api/institucion/info'),

  /**
   * Actualiza la información institucional
   */
  updateInfo: (payload) => apiJson('/api/admin/institucion/info', {
    method: 'PUT',
    body: payload,
  }),
};

export default institucionService;
