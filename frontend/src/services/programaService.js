import { apiJson } from '../utils/api';

export const programaService = {
  /**
   * Obtiene todos los programas de postgrado
   */
  getAll: () => apiJson('/api/programas'),

  /**
   * Obtiene los programas vigentes/activos
   */
  getActivos: () => apiJson('/api/programas/activos'),

  /**
   * Obtiene detalle de un programa por su ID
   */
  getById: (id) => apiJson(`/api/programas/${id}`),

  /**
   * Obtiene la malla curricular y módulos de un programa
   */
  getMalla: (id) => apiJson(`/api/programas/${id}/malla`),

  // Operaciones de administración
  adminGetAll: () => apiJson('/api/admin/programas'),
  create: (payload) => apiJson('/api/admin/programas', { method: 'POST', body: payload }),
  update: (id, payload) => apiJson(`/api/admin/programas/${id}`, { method: 'PUT', body: payload }),
  delete: (id) => apiJson(`/api/admin/programas/${id}`, { method: 'DELETE' }),
  updateStatus: (id, estado) => apiJson(`/api/admin/programas/${id}/estado`, { method: 'PATCH', body: { estado } }),
  concluir: (id) => apiJson(`/api/admin/programas/${id}/concluir`, { method: 'POST' }),

  // Módulos y materias
  getModulos: (id) => apiJson(`/api/admin/programas/${id}/modulos`),
  getMaterias: () => apiJson('/api/admin/materias'),
  createModulo: (payload) => apiJson('/api/admin/modulos', { method: 'POST', body: payload }),
  deleteModulo: (idMod) => apiJson(`/api/admin/modulos/${idMod}`, { method: 'DELETE' }),
  createMateria: (payload) => apiJson('/api/admin/materias', { method: 'POST', body: payload }),
  deleteMateria: (idMat) => apiJson(`/api/admin/materias/${idMat}`, { method: 'DELETE' }),

  // Asistente Académico / Editor Fijo (5 Pasos)
  getMallas: (idPrograma) => apiJson(`/api/admin/mallas${idPrograma ? `?id_programa=${idPrograma}` : ''}`),
  getWizardData: (idPrograma) => apiJson(`/api/admin/programas/${idPrograma}/wizard-data`),
  saveWizardProgram: (payload) => apiJson('/api/admin/programas/wizard-save', { method: 'POST', body: payload }),
};

export default programaService;
