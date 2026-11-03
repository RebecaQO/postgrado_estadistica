# FASE 1 — Auditoría de Contratos
FECHA: 2026-11-03 09:35 local.

## Entorno
- Sail: laravel.test activo; PostgreSQL healthy; frontend activo.
- GET /api/programas anónimo: 401 (control inicial).
- Frontend http://localhost:5173: 200.
- Login de cuenta temporal de auditoría: HTTP 200; GET /api/auth/me: HTTP 200.
- Token guardado únicamente en /tmp, no incluido en evidencias ni Git.

## Snapshot de rutas
- Total de rutas API: 55.
- Rutas /api/admin o Neon declaradas en Laravel: 0.

## Inventario frontend
- apiJson: 0 coincidencias; la función no existe.
- apiClient: 43 líneas de uso.
- apiFetch: 0 llamadas; wrapper definido pero no usado.
- fetch nativo: 2 llamadas, ambas internas a wrappers HTTP; no hay fetch directo desde módulos.
- axios: 0.
- /api/admin/: 31 coincidencias.
- neon: 0.
- Literales /api únicos: 30.

## Endpoints auditados
- GET probados con token admin: 36.
- HTTP 200: 23.
- Inexistentes (HTTP 404 y ausentes del snapshot): 13.
- Rotos por discrepancia de estructura/campos: 2.
- Rutas con métodos de escritura no ejecutados (POST/PUT/PATCH/DELETE): 32.
- Se guardó el cuerpo JSON exacto por GET en archivos locales get-*.json. Esos archivos pueden contener datos personales y no se deben publicar.

## Discrepancias críticas para Fase 3
- GET /api/programas/activos devuelve {success,data:[...]} y campos id_programa/nombre_programa/tipo_programa/area_conocimiento; varios consumidores esperan un array directo con id/title/type/area y otros campos normalizados.
- GET /api/docentes devuelve {success,data:[...]}; los consumidores React esperan una lista directa.
- GET /api/programas/{id}/malla es llamado por el frontend, pero Laravel no declara esa ruta (404).
- GET /api/convocatorias-pasadas y GET /api/institucion/info no existen; también faltan las rutas GET /api/admin/... para programas, docentes, materias, mallas, usuarios y roles.
- GET /api/usuarios y GET /api/defensas-tesis no existen; quedan pendientes de Fase 4.

## Bloqueos para Fase 2
- El cliente objetivo apiJson no existe. Hay un apiClient usado por varios servicios y un apiFetch no usado; ambos implementan fetch. Consolidar transporte en una sola función manteniendo los contratos existentes.
- Laravel valida el login con el campo nombre. El servicio frontend envía nombre y email, pero el controlador consulta por nombre.

## Código de negocio modificado
- No se modificó código en esta fase.
- A solicitud del usuario se creó una cuenta admin temporal solo en la base local para realizar las pruebas autenticadas. El reporte no incluye su nombre ni secreto; se eliminará al terminar Fase 2.

## Artefactos
- routes-snapshot.json/.txt, fe-*.txt, endpoints-frente-consumidos.txt, http-status.txt, contratos.md, tabla-estado.md.
- get-*.json contiene respuestas exactas locales; excluidas de publicación por privacidad.

## Próximo paso
- Fase 2: lista. Correcciones de contratos de datos se reservan para Fase 3.
