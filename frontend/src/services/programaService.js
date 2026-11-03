import { apiClient } from './apiClient';

export const programaService = {
  /**
   * Obtiene todos los programas de postgrado
   */
  getAll: () => apiClient('/api/programas'),

  /**
   * Obtiene los programas vigentes/activos
   */
  getActivos: () => apiClient('/api/programas/activos'),

  /**
   * Obtiene detalle de un programa por su ID
   */
  getById: (id) => apiClient(`/api/programas/${id}`),

  /**
   * Obtiene la malla curricular y módulos de un programa
   */
  getMalla: (id) => apiClient(`/api/programas/${id}/malla`),

  // Operaciones de administración
  adminGetAll: () => apiClient('/api/admin/programas'),
  create: (payload) => apiClient('/api/admin/programas', { method: 'POST', body: payload }),
  update: (id, payload) => apiClient(`/api/admin/programas/${id}`, { method: 'PUT', body: payload }),
  delete: (id) => apiClient(`/api/admin/programas/${id}`, { method: 'DELETE' }),
  updateStatus: (id, estado) => apiClient(`/api/admin/programas/${id}/estado`, { method: 'PATCH', body: { estado } }),
  concluir: (id) => apiClient(`/api/admin/programas/${id}/concluir`, { method: 'POST' }),

  // Módulos y materias
  getModulos: (id) => apiClient(`/api/admin/programas/${id}/modulos`),
  getMaterias: () => apiClient('/api/admin/materias'),
  createModulo: (payload) => apiClient('/api/admin/modulos', { method: 'POST', body: payload }),
  deleteModulo: (idMod) => apiClient(`/api/admin/modulos/${idMod}`, { method: 'DELETE' }),
  createMateria: (payload) => apiClient('/api/admin/materias', { method: 'POST', body: payload }),
  deleteMateria: (idMat) => apiClient(`/api/admin/materias/${idMat}`, { method: 'DELETE' }),

  // Asistente Académico / Editor Fijo (5 Pasos)
  getMallas: (idPrograma) => apiClient(`/api/admin/mallas${idPrograma ? `?id_programa=${idPrograma}` : ''}`),
  getWizardData: (idPrograma) => apiClient(`/api/admin/programas/${idPrograma}/wizard-data`),
  saveWizardProgram: (payload) => apiClient('/api/admin/programas/wizard-save', { method: 'POST', body: payload }),
};

export default programaService;
