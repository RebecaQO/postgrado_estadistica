# Contratos Finales Post-Fix — Fase 3

## GET /api/programas/activos
- Estructura real: `[ { id, id_programa, title, nombre_programa, type, tipo_programa, area, area_conocimiento, description, descripcion, activo, maestria, diplomado, ediciones: [...] } ]`
- Estructura esperada por frontend: `[ { id, title, type, area, description, ... } ]`
- Match: ✅
- Fix aplicado: Accessors con alias en `app/Models/ProgramaPostgrado.php` + unwrap automático `payload.data` en `src/utils/api.js`.
- Commits: `95ed1b1` (backend), `e151da3` (frontend).

## GET /api/docentes
- Estructura real: `[ { id, id_doc, nombre, nombre_doc, apellido, apellido_doc, nombre_completo, foto, activo } ]`
- Estructura esperada por frontend: `[ { id, nombre, apellido, nombre_completo, foto, activo } ]`
- Match: ✅
- Fix aplicado: Accessors en `app/Models/Docente.php`, corrección de casing en `app/Http/Middleware`, y alineación de rutas en `docenteService.js`.
- Commits: `c0c5a27` (backend casing), `3e69b46` (backend accessors), `8d502b1` (frontend service).

## GET /api/programas/{id}/malla
- Estructura real: `[ { id_malla, nombre_malla, id_programa, activo } ]`
- Estructura esperada por frontend: Lista de mallas del programa.
- Match: ✅
- Fix aplicado: Registrado alias de ruta singular `GET /api/programas/{id}/malla` hacia `MallaCurricularController@listarMallasPorPrograma`.
- Commits: `52e4688` (backend ruta), `9b07115` (frontend service).

## GET /api/convocatorias-pasadas
- Estructura real: `[ { id, id_edicion, gestion, nivel, titulo, programa, resolucion_hcu, enlace_pdf, estado } ]`
- Estructura esperada por frontend: Array de convocatorias históricas para `RegulationsView`.
- Match: ✅
- Fix aplicado: Implementado `EdicionProgramaController@listarConvocatoriasPasadas` y ruta pública `GET /api/convocatorias-pasadas`.
- Commits: `03d12b8` (backend), `895af37` (frontend).
