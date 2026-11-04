# FASE 2 — Unificación del cliente HTTP
FECHA: 2026-11-03 10:01 local

## Precondición Fase 1
- Fase 1 cerrada: SÍ.
- Reporte: evidencias/fase1-20261103-092716/reporte-fase1.md
- Commit de documentación: 2fe0b09.

## api.js antes
- URL base configurable por VITE_API_URL.
- Helpers de cabeceras, token y parseo de respuesta existían.
- apiClient y apiFetch duplicaban fetch; 43 referencias a apiClient.
- Los errores ya preservaban status, message, errors y data; 401 no se reintentaba.

## apiJson después
- Base URL VITE_API_URL: SÍ.
- Accept/Auth: SÍ; Authorization Bearer se adjunta con token.
- Content-Type JSON y FormData: SÍ.
- Parseo seguro y 204: SÍ; 204 devuelve null.
- 401: un intento; error se propaga y AuthContext cierra la sesión local y abre login. Login/logout no activan el evento de expiración.
- 403: conserva el error y no cierra sesión.
- 404/409/422/500: Error con status, message, errors y data.
- Devuelve JSON parseado y no Response crudo.

## Token
- Lectura de sessionStorage: solo en frontend/src/utils/api.js.
- Escritura/borrado: helpers de api.js invocados desde AuthContext.
- authService no accede a sessionStorage.

## Fetch/Axios
- Antes: dos implementaciones fetch (apiClient y apiFetch), 43 referencias apiClient, 0 axios.
- Después: un fetch dentro de apiJson; cero usos de apiClient, apiFetch o axios en frontend/src.
- Servicios migrados: auth, programas, docentes, administración, convocatorias, defensas e institución.

## Rutas legadas
- Las llamadas GET /api/admin/... ausentes permanecen documentadas y se propagan como errores para que los consumidores las manejen.
- No se inventaron rutas ni se cambió lógica de negocio. Fase 4 queda para módulos inexistentes.
- Los contratos de /api/programas/activos y /api/docentes detectados en Fase 1 quedan para Fase 3.

## Verificaciones
- Vite build: OK (2119 módulos). Sigue la advertencia existente de chunk JS mayor a 500 KB.
- apiJson real: GET /api/programas 200 con token; GET anónimo 401 en una sola solicitud; GET /api/defensas-tesis 404.
- Login/me/logout vía apiJson: 200/200/200; token local limpiado y token remoto revocado.
- Errores controlados: 403/404/409/422/500 conservan status/message/errors; 204 retorna null.
- POST /api/docentes con cuerpo vacío: HTTP 500 en vez de 422. El log indica error de cabeceras de Laravel; no se tocó backend.
- Validación manual en navegador: NO realizada. La herramienta Windows falló al activar Chrome y agotó tiempo incluso tras reset. Por ello no certifico módulos ni consola visualmente.
- Regresión visual en módulos con APIs rotas de Fase 1: pendiente de la revisión en navegador.

## Cuenta temporal
- Creada por solicitud para ejecutar GET autenticados.
- Tokens de auditoría revocados.
- Cuenta temporal eliminada al terminar; contraseña/token no versionados.

## Commits
- 3ec897d fase-2: centralizar autenticacion en apiJson
- 861bde1 fase-2: migrar programas a apiJson
- 82759a8 fase-2: migrar docentes a apiJson
- a3f6833 fase-2: migrar servicios restantes a apiJson
- c32cae1 fase-2: cerrar sesion al recibir 401 protegido

## Bloqueos
- Revisar en navegador Login/logout, 401 y módulos tras reabrir un navegador accesible.
- Resolver el 500 de Laravel en la respuesta a validación 422 en una fase autorizada para backend.
- Obtener una cuenta no-admin de prueba para comprobar 403 real.

## Código de negocio
- Solo capa HTTP y AuthContext. No se modificaron controladores, modelos, migraciones ni endpoints.

## Próximo paso
- Fase 3 no se declara lista hasta completar la verificación visual pendiente y acordar el bloqueo de validación 422.
