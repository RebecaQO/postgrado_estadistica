# Auditoría previa de api.js — Fase 2

## Estado antes de cambios

- URL base configurable: sí, VITE_API_URL; fallback http://127.0.0.1:8000.
- Accept: application/json: sí.
- Authorization Bearer: sí, vía getAuthToken().
- Content-Type para JSON y compatibilidad con FormData: sí en apiClient.
- Parseo seguro: sí; JSON inválido se convierte en objeto vacío.
- 204: devuelve null.
- Errores HTTP: lanza Error con status, errors y data; message prioriza validación Laravel.
- 401: no reintenta. El error se propaga; no hay reintento en ninguno de los clientes.
- 403/404/409/422/500: conserva status, message, errors y payload, sin tratamiento específico por código.
- Resultado exitoso: JSON parseado, no Response.
- Duplicación: apiFetch en utils/api.js y apiClient en services/apiClient.js hacen fetch; 43 usos encontrados de apiClient.
- apiFetch no tiene llamadas externas en el código.
- Token: getAuthToken/setAuthToken/removeAuthToken centralizados en utils/api.js; authService usa los setters, no hay lectura directa fuera de ese módulo.
- Base no configurable desde Vite env en entorno: Compose define VITE_API_URL=http://localhost.

## Plan mínimo

Consolidar la implementación en apiJson dentro de utils/api.js; migrar servicios a apiJson; mover escritura/borrado del token a AuthContext; conservar forma de JSON, errores, FormData, opciones de fetch y URL base. No adaptar módulos ni rutas en esta fase.

## Resultado después de la migración

- apiJson centraliza URL, headers, token Bearer, serialización JSON/FormData, fetch y parseo.
- Los servicios y AuthContext usan apiJson; services/apiClient.js fue eliminado.
- La capa no reintenta. Un 401 protegido emite posgrado:unauthorized; AuthContext quita token, limpia el usuario y abre login. Login/Logout 401 no emiten ese evento.
- 403 no cierra sesión; 4xx/5xx lanzan Error con status, message, errors y data. 204 devuelve null.
- Un único fetch nativo permanece dentro de apiJson; no hay apiClient, apiFetch ni axios en src.
- El backend produjo HTTP 500 al probar una solicitud inválida a POST /api/docentes, donde se esperaba 422. El log de Laravel reporta “Cannot modify header information - headers already sent” en la respuesta. No se modificó backend en esta fase.
- La validación visual en navegador queda pendiente: el control de ventana de Windows agotó el tiempo tras reintentos/reset. Los módulos no se certifican visualmente.
