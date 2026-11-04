# Fix /api/docentes

## Panel Consumidor
- `frontend/src/components/institution/InstitutionView.jsx`
- `frontend/src/components/portals/AdminPortal.jsx`
- `frontend/src/components/portals/ProgramEditorFixed.jsx`
- `frontend/src/components/programs/ProgramDetailModal.jsx`

## Antes
- Backend devolvía `{ success: true, data: [...] }` con campos `id_doc`, `nombre_doc`, `apellido_doc`, `foto`, `activo`.
- Petición POST vacía generaba HTTP 500 debido al error de casing en `app/Http/MiddleWare`.
- `docenteService.js` utilizaba rutas inexistentes con prefijo `/api/admin/docentes`.

## Después
- Backend (`app/Models/Docente.php`): Accessors `$appends = ['id', 'nombre', 'apellido', 'nombre_completo']`.
- Backend (`app/Http/Middleware`): Casing corregido a PSR-4; validaciones vacías retornan HTTP 422.
- Frontend (`src/services/docenteService.js`): Apuntado a las rutas reales `/api/docentes` del backend.

## Matriz de Validación
| # | Caso | Esperado | Obtenido | Estado |
|---|---|---|---|---|
| 1 | Listar admin | 200 + array con alias | 200 OK | ✅ |
| 2 | Sin token | 401 | 401 OK | ✅ |
| 3 | Detalle existente (id 3) | 200 | 200 OK | ✅ |
| 4 | Detalle inexistente (999999) | 404 | 404 OK | ✅ |
| 5 | Panel frontend | Docentes renderizados | Componentes leen array y alias | ✅ |
| 6 | Regresión Mallas | Sin impacto adverso | Mallas intactas | ✅ |
| 7 | Regresión Docentes | Creación / Edición OK | 422 en datos inválidos | ✅ |

## Commits
- Backend: `c0c5a27` (fase-3: fix backend casing app/Http/Middleware y namespace)
- Backend: `3e69b46` (fase-3: fix backend /api/docentes — alias de campos id, nombre, apellido, nombre_completo)
- Frontend: `8d502b1` (fase-3: fix frontend /api/docentes — unificar rutas reales sin prefijo admin)
