# Fix /api/programas/{id}/malla

## Panel Consumidor
- `frontend/src/components/programs/ProgramDetailModal.jsx`
- `frontend/src/components/programs/ProgramDetailView.jsx` via `programaService.getMalla`

## Antes
- Backend disponía únicamente de `/api/programas/{id}/mallas` (en plural).
- Petición a `/api/programas/{id}/malla` devolvía HTTP 404.

## Después
- Backend (`routes/api.php`): Registrada ruta alias `GET /api/programas/{id}/malla` hacia `MallaCurricularController@listarMallasPorPrograma`.
- Frontend (`src/services/programaService.js`): Unificación de rutas de administración y mallas.

## Matriz de Validación
| # | Caso | Esperado | Obtenido | Estado |
|---|---|---|---|---|
| 1 | Listar admin | 200 con listado mallas | 200 OK | ✅ |
| 2 | Sin token | 401 | 401 OK | ✅ |
| 3 | Detalle existente | 200 | 200 OK | ✅ |
| 4 | Detalle inexistente (999999) | 404 | 404 OK | ✅ |
| 5 | Panel frontend | Malla cargada en modal | Componentes leen mallas | ✅ |
| 6 | Regresión Mallas | Mallas intactas | 200 OK | ✅ |
| 7 | Regresión Docentes | Docentes intactos | 200 OK | ✅ |

## Commits
- Backend: `52e4688` (fase-3: fix backend /api/programas/{id}/malla — ruta singular compatible con frontend)
- Frontend: `9b07115` (fase-3: fix frontend programaService — rutas reales de programas, mallas y modulos)
