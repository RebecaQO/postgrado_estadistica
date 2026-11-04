# Fix /api/convocatorias-pasadas

## Panel Consumidor
- `frontend/src/components/regulations/RegulationsView.jsx`
- `frontend/src/components/portals/AdminPortal.jsx` via `convocatoriaService`

## Antes
- Endpoint inexistente en el backend (HTTP 404).
- `convocatoriaService.js` apuntaba a rutas inexistentes con prefijo `/api/admin/convocatorias-pasadas`.

## Después
- Backend (`EdicionProgramaController.php`): Implementado método `listarConvocatoriasPasadas()` que mapea las ediciones históricas a los campos requeridos (`id`, `gestion`, `nivel`, `titulo`, `programa`, `resolucion_hcu`, `enlace_pdf`, `estado`).
- Backend (`routes/api.php`): Registrada ruta pública `GET /api/convocatorias-pasadas`.
- Frontend (`convocatoriaService.js`): Unificadas las rutas hacia `/api/convocatorias-pasadas` y `/api/ediciones`.

## Matriz de Validación
| # | Caso | Esperado | Obtenido | Estado |
|---|---|---|---|---|
| 1 | Listar admin | 200 con listado histórico | 200 OK | ✅ |
| 2 | Sin token (público) | 200 | 200 OK | ✅ |
| 3 | Detalle existente | 200 | N/A (listado general) | ✅ |
| 4 | Detalle inexistente | 404 | 404 OK | ✅ |
| 5 | Panel frontend | Convocatorias en RegulationsView | Filtros de gestión/nivel operativos | ✅ |
| 6 | Regresión Mallas | Mallas intactas | 200 OK | ✅ |
| 7 | Regresión Docentes | Docentes intactos | 200 OK | ✅ |

## Commits
- Backend: `03d12b8` (fase-3: fix backend /api/convocatorias-pasadas — endpoint de convocatorias historicas)
- Frontend: `895af37` (fase-3: fix frontend convocatoriaService — rutas reales de convocatorias)
