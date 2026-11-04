import { apiJson } from '../utils/api';

export const institucionService = {
  /**
   * Obtiene la información institucional de la carrera
   */
  getInfo: () => apiJson('/api/institucion'),

  /**
   * Actualiza la información institucional
   */
  updateInfo: (payload) => apiJson('/api/institucion', {
    method: 'PUT',
    body: payload,
  }),
};

export default institucionService;
