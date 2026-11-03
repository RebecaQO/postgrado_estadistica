# Análisis estático de routes/api.php (sin ejecutar Laravel)

| Endpoint esperado | En `api.php` |
|---|---|
| POST /api/login | ❌ (la ruta declarada es `/api/auth/login`) |
| POST /api/logout | ❌ (la ruta declarada es `/api/auth/logout`) |
| GET /api/user | ❌ (la ruta declarada es `/api/auth/me`) |
| GET|POST|PUT /api/programas | ✅ |
| GET /api/programas/{id}/ediciones | ✅ |
| GET /api/programas/{id}/mallas | ✅ |
| GET|POST|DELETE /api/ediciones/{id}/docentes | ✅ |
| PATCH /api/mallas/{id}/desactivar|reactivar | ✅ |
| POST /api/mallas/{id}/materias | ✅ |
| POST /api/modulos y POST /api/modulos/{id}/materias | ✅ |
| PATCH /api/modulos/{id}/desactivar|reactivar | ✅ |
| POST /api/materias y PATCH /api/materias/{id}/desactivar|reactivar | ✅ |
| GET|POST|PUT|DELETE /api/docentes y PATCH /api/docentes/{id}/desactivar|reactivar | ✅ |
| GET /api/usuarios | ❌ (esperado) |
| api/admin/defensas-tesis | ❌ (esperado) |
| api/admin/institucion/info | ❌ (esperado) |

