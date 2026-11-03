import { apiUrl, getAuthHeaders, handleApiResponse } from '../utils/api';

/**
 * Cliente HTTP base para realizar peticiones a la API del backend Laravel.
 * Soporta JSON automático, headers, JWT Bearer Token y manejo unificado de errores.
 */
export async function apiClient(endpoint, options = {}) {
  const { method = 'GET', body, headers = {}, ...customOptions } = options;

  const isFormData = body instanceof FormData;

  const config = {
    method,
    headers: getAuthHeaders(isFormData, headers),
    ...customOptions,
  };

  if (body) {
    if (isFormData) {
      config.body = body;
    } else if (typeof body === 'object') {
      config.body = JSON.stringify(body);
    } else {
      config.body = body;
    }
  }

  const response = await fetch(apiUrl(endpoint), config);
  return handleApiResponse(response);
}

export default apiClient;
