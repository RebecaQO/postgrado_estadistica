/**
 * Cliente HTTP centralizado para Laravel.
 * La URL base se configura con VITE_API_URL.
 */
export const TOKEN_STORAGE_KEY = 'posgrado_umsa_token';
export const AUTH_REQUIRED_EVENT = 'posgrado:unauthorized';

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
).replace(/\/$/, '');

const getToken = () => {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage.getItem(TOKEN_STORAGE_KEY);
};

export const setAuthToken = (token) => {
  if (typeof window === 'undefined') return;
  if (token) window.sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
  else window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
};

export const removeAuthToken = () => {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
};

export const apiUrl = (endpoint) => {
  if (!endpoint) return API_BASE_URL || '/';
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) return endpoint;
  const clean = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${clean}`;
};

const getAuthHeaders = (isFormData = false, customHeaders = {}) => {
  const headers = {
    Accept: 'application/json',
    ...customHeaders,
  };

  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const token = getToken();
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const handleApiResponse = async (response) => {
  if (response.status === 204) return null;

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const validationError = payload?.errors
      ? Object.values(payload.errors).flat()[0]
      : null;
    const message =
      validationError ||
      payload?.message ||
      payload?.error ||
      `Error del servidor (${response.status})`;

    const error = new Error(message);
    error.status = response.status;
    error.errors = payload?.errors || null;
    error.data = payload;
    throw error;
  }

  // Desempaqueta `data` si la API envuelve en { success, data: [...] | {...} }
  if (payload && typeof payload === 'object' && 'data' in payload && payload.data !== undefined) {
    return payload.data;
  }

  return payload;
};

/**
 * Ejecuta una solicitud HTTP y devuelve JSON parseado.
 * No reintenta errores; propaga status, message, errors y payload.
 */
export const apiJson = async (endpoint, options = {}) => {
  const { method = 'GET', body, headers = {}, ...customOptions } = options;
  const isFormData =
    typeof FormData !== 'undefined' && body instanceof FormData;
  const config = {
    ...customOptions,
    method,
    headers: getAuthHeaders(isFormData, headers),
  };

  if (body !== undefined && body !== null) {
    if (isFormData || typeof body === 'string') {
      config.body = body;
    } else {
      config.body = JSON.stringify(body);
    }
  }

  const response = await fetch(apiUrl(endpoint), config);
  const path = String(endpoint).split('?')[0];
  const isLoginOrLogout =
    path.endsWith('/api/auth/login') || path.endsWith('/api/auth/logout');

  if (
    response.status === 401 &&
    !isLoginOrLogout &&
    typeof window !== 'undefined'
  ) {
    window.dispatchEvent(new CustomEvent(AUTH_REQUIRED_EVENT));
  }

  return handleApiResponse(response);
};

export default apiJson;
