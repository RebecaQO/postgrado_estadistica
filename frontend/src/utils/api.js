/**
 * Configuración centralizada de API para conectar el Frontend con el Backend Laravel.
 * 
 * Base URL por defecto: http://127.0.0.1:8000 (puerto estándar de php artisan serve)
 * Manejo de token JWT en sessionStorage ('posgrado_umsa_token')
 * Formato y validaciones estandarizadas de Laravel (Accept: application/json, errores 422, etc.)
 */

export const TOKEN_STORAGE_KEY = 'posgrado_umsa_token';

// A. Resolución de la URL Base:
export const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  'http://127.0.0.1:8000'
).replace(/\/$/, '');

/**
 * Obtiene el token JWT almacenado en sessionStorage
 */
export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(TOKEN_STORAGE_KEY);
};

/**
 * Guarda el token JWT en sessionStorage
 */
export const setAuthToken = (token) => {
  if (typeof window === 'undefined') return;
  if (token) {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  }
};

/**
 * Elimina el token JWT de sessionStorage
 */
export const removeAuthToken = () => {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
};

/**
 * Resuelve cualquier endpoint relativo al backend Laravel.
 * @param {string} endpoint - Ej: '/api/programas'
 * @returns {string} URL completa
 */
export const apiUrl = (endpoint) => {
  if (!endpoint) return API_BASE_URL || '/';
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) return endpoint;
  const clean = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${clean}`;
};

/**
 * B. Manejo de Autenticación y Cabeceras:
 * - Accept: application/json
 * - Content-Type: application/json (excepto si se envía FormData para subida de fotos/archivos)
 * - Authorization: Bearer <token> si hay sesión activa
 */
export const getAuthHeaders = (hasFormData = false, customHeaders = {}) => {
  const headers = {
    Accept: 'application/json',
    ...customHeaders,
  };

  if (!hasFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const token = getAuthToken();
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * C. Manejo de Respuestas y Errores (Convención Laravel):
 * Parsea el formato estándar de respuestas y errores de validación (422) de Laravel
 */
export const handleApiResponse = async (response) => {
  if (response.status === 204) {
    return null;
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Parsea el primer error de validación de Laravel (ej: errors: { nombre: ["El campo nombre es obligatorio"] })
    const validationError = payload.errors
      ? Object.values(payload.errors).flat()[0]
      : null;

    const errorMsg =
      validationError ||
      payload.message ||
      payload.error ||
      `Error del servidor (${response.status})`;

    const error = new Error(errorMsg);
    error.status = response.status;
    error.errors = payload.errors || null;
    error.data = payload;
    throw error;
  }

  return payload;
};

/**
 * Wrapper de fetch configurado con la URL base del backend Laravel
 */
export const apiFetch = async (endpoint, options = {}) => {
  const isFormData = options.body instanceof FormData;
  const headers = getAuthHeaders(isFormData, options.headers);

  const response = await fetch(apiUrl(endpoint), {
    ...options,
    headers,
  });

  return handleApiResponse(response);
};

export default apiUrl;
