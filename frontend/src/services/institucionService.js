import { apiClient } from './apiClient';

export const institucionService = {
  /**
   * Obtiene la información institucional de la carrera
   */
  getInfo: () => apiClient('/api/institucion/info'),

  /**
   * Actualiza la información institucional
   */
  updateInfo: (payload) => apiClient('/api/admin/institucion/info', {
    method: 'PUT',
    body: payload,
  }),
};

export default institucionService;
