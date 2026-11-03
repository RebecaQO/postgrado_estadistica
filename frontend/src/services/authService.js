import { apiClient } from './apiClient';
import { setAuthToken, removeAuthToken } from '../utils/api';

export const authService = {
  /**
   * Inicia sesión con credenciales (acepta nombre de usuario o email, y password)
   * Esperado por Laravel: POST /api/auth/login { "nombre": "admin", "password": "..." }
   * Respuesta: { "token": "...", "user": { "id": 1, "nombre": "...", "role": "admin"|"usuario" } }
   */
  login: async (identifier, password) => {
    const payload = {
      nombre: identifier,
      email: identifier,
      password: password,
    };

    const data = await apiClient('/api/auth/login', {
      method: 'POST',
      body: payload,
    });

    if (data?.token) {
      setAuthToken(data.token);
    }

    return data;
  },

  /**
   * Obtiene los datos del usuario autenticado actual
   * GET /api/auth/me (Bearer Token)
   */
  getMe: async () => {
    return apiClient('/api/auth/me');
  },

  /**
   * Cierra la sesión en el backend y limpia el token en sessionStorage
   * POST /api/auth/logout (Bearer Token)
   */
  logout: async () => {
    try {
      await apiClient('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.warn('Cierre de sesión local:', err.message);
    } finally {
      removeAuthToken();
    }
  },
};

export default authService;
