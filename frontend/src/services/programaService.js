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
  adminGetAll: () => apiJson('/api/programas'),
  create: (payload) => apiJson('/api/programas', { method: 'POST', body: payload }),
  update: (id, payload) => apiJson(`/api/programas/${id}`, { method: 'PUT', body: payload }),
  delete: (id) => apiJson(`/api/programas/${id}`, { method: 'DELETE' }),
  updateStatus: (id, estado) => apiJson(
    estado === 'Activo' ? `/api/programas/${id}/reactivar` : `/api/programas/${id}/desactivar`,
    { method: 'PATCH' }
  ),
  reactivar: (id) => apiJson(`/api/programas/${id}/reactivar`, { method: 'PATCH' }),
  concluir: (id) => apiJson(`/api/programas/${id}/desactivar`, { method: 'PATCH' }),

  // Módulos y materias
  getModulos: (id) => apiJson(`/api/mallas/${id}/modulos`),
  getMaterias: () => apiJson('/api/materias'),
  createModulo: (payload) => apiJson('/api/modulos', { method: 'POST', body: payload }),
  deleteModulo: (idMod) => apiJson(`/api/modulos/${idMod}`, { method: 'DELETE' }),
  createMateria: (payload) => apiJson('/api/materias', { method: 'POST', body: payload }),
  deleteMateria: (idMat) => apiJson(`/api/materias/${idMat}`, { method: 'DELETE' }),

  // Asistente Académico / Editor Fijo (5 Pasos)
  getMallas: (idPrograma) => apiJson(idPrograma ? `/api/programas/${idPrograma}/mallas` : '/api/mallas'),
  getWizardData: (idPrograma) => apiJson(`/api/programas/${idPrograma}`),
  saveWizardProgram: (payload) => apiJson('/api/registros-academicos', { method: 'POST', body: payload }),
};

export default programaService;
