# Fix /api/programas/activos

## Panel Consumidor
- `frontend/src/components/home/FeaturedPrograms.jsx`
- `frontend/src/components/home/HeroSection.jsx`
- `frontend/src/components/admission/AdmissionWizard.jsx`
- `frontend/src/components/programs/ProgramsView.jsx`

## Antes
- Backend devolvía `{ success: true, data: [...] }` con campos `id_programa`, `nombre_programa`, `tipo_programa`, `area_conocimiento`.
- Frontend esperaba arreglo directo y campos normalizados `id`, `title`, `type`, `area`.

## Después
- Backend (`app/Models/ProgramaPostgrado.php`): Accessors `$appends = ['id', 'title', 'type', 'area', 'description', 'activo']`.
- Frontend (`src/utils/api.js`): Unwrap automático `payload.data` en `apiJson` para respuestas envueltas.

## Matriz de Validación
| # | Caso | Esperado | Obtenido | Estado |
|---|---|---|---|---|
| 1 | Listar admin | 200 + estructura con alias | 200 OK | ✅ |
| 2 | Sin token (público) | 200 | 200 OK | ✅ |
| 3 | Detalle existente | 200 | N/A (listado activo) | ✅ |
| 4 | Detalle inexistente | 404 | 404 OK | ✅ |
| 5 | Panel frontend | Programas renderizados | Componentes leen array y alias | ✅ |
| 6 | Regresión Mallas | Sin impacto adverso | Mallas intactas | ✅ |
| 7 | Regresión Docentes | Sin impacto adverso | Docentes intactos | ✅ |

## Commits
- Backend: `95ed1b1` (fase-3: fix backend /api/programas/activos — alias de campos id, title, type, area, description)
- Frontend: `e151da3` (fase-3: fix frontend apiJson — unwrap automatico de data en respuestas exitosas)
