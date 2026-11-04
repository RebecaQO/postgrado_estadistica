# FASE 3 — Reconexión de contratos
FECHA: 2026-11-04 15:20 local

== PRECONDICIONES ==
- Fase 1 OK: SÍ
- Fase 2 OK: SÍ
- Sail healthy: SÍ (laravel.test, pgsql, frontend)

== ROTOS DE FASE 1 ==
- Total identificados: 4 endpoints centrales (programas activos, docentes, malla singular, convocatorias pasadas)
- Reconectados: 4 (100% de los rotos de contratos existentes)
- Bloqueados: 0

== FIXES REALIZADOS ==
1. `/api/programas/activos`:
   - Discrepancia: Envoltorio `{ success, data }` y campos `id_programa`/`nombre_programa` vs `id`/`title`.
   - Lado: Backend (accessors) + Frontend (unwrap `apiJson`).
   - Archivos: `backend/app/Models/ProgramaPostgrado.php`, `frontend/src/utils/api.js`.
   - Commits: `95ed1b1`, `e151da3`.
   - Matriz: 7/7 ✅

2. `/api/docentes`:
   - Discrepancia: Error 500 en validación vacía (casing `MiddleWare` en Linux), campos `id_doc` vs `id`, rutas legadas `/api/admin/docentes`.
   - Lado: Backend (casing + accessors) + Frontend (`docenteService.js`).
   - Archivos: `backend/app/Http/Middleware/Administrador.php`, `backend/app/Models/Docente.php`, `frontend/src/services/docenteService.js`.
   - Commits: `c0c5a27`, `3e69b46`, `8d502b1`.
   - Matriz: 7/7 ✅ (422 verificado en validación vacía).

3. `/api/programas/{id}/malla`:
   - Discrepancia: Backend exponía únicamente `/api/programas/{id}/mallas` (plural); frontend llamaba `/malla` (singular).
   - Lado: Backend (ruta alias) + Frontend (`programaService.js`).
   - Archivos: `backend/routes/api.php`, `frontend/src/services/programaService.js`.
   - Commits: `52e4688`, `9b07115`.
   - Matriz: 7/7 ✅

4. `/api/convocatorias-pasadas`:
   - Discrepancia: Ruta inexistente en backend (404); `convocatoriaService.js` apuntaba a `/api/admin/convocatorias-pasadas`.
   - Lado: Backend (método `listarConvocatoriasPasadas` en `EdicionProgramaController` + ruta) + Frontend (`convocatoriaService.js`).
   - Archivos: `backend/app/Http/Controllers/EdicionProgramaController.php`, `backend/routes/api.php`, `frontend/src/services/convocatoriaService.js`.
   - Commits: `03d12b8`, `895af37`.
   - Matriz: 7/7 ✅

== SMOKE TEST ==
- Programas: OK (GET /api/programas: 200, GET /api/programas/activos: 200)
- Ediciones: OK (GET /api/ediciones: 200)
- Mallas: OK (GET /api/mallas: 200, GET /api/programas/1/malla: 200)
- Materias/Módulos: OK (GET /api/modulos: 200, GET /api/materias: 200)
- Docentes: OK (GET /api/docentes: 200)
- Convocatorias: OK (GET /api/convocatorias-pasadas: 200)

== REGRESIONES ==
- Ninguna. Build de Vite exitoso en 5.00s (2119 módulos). Rutas backend existentes intactas.

== CÓDIGO MODIFICADO ==
- Modelos: `ProgramaPostgrado.php`, `Docente.php` (solo accessors `$appends`).
- Controladores: `EdicionProgramaController.php` (método de mapeo de convocatorias históricas).
- Rutas: `api.php` (alias `/programas/{id}/malla` y `/convocatorias-pasadas`).
- Frontend: `src/utils/api.js` (unwrap de data), `src/services/programaService.js`, `src/services/docenteService.js`, `src/services/convocatoriaService.js`.

== PRÓXIMO PASO ==
Fase 4: LISTO SÍ
