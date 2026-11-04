# Matriz de Pruebas End-to-End (20/20 Casos Obligatorios)

**Fecha:** 2026-11-04 22:09:36 UTC
**Entorno:** Docker Compose Sail (PHP 8.3 + PostgreSQL 16 + Vite React)

| # | Módulo | Caso de Prueba | Método / Endpoint | Esperado | Obtenido | Estado |
|---|---|---|---|---|---|:---:|
| 1 | Auth | Login admin | POST /api/auth/login | 200 + token | 200 | ✅ OK |
| 2 | Auth | Login usuario normal | POST /api/auth/login | 200 + token | 200 | ✅ OK |
| 3 | Auth | Logout | POST /api/auth/logout | 200 + token revocado (401) | 200 (revocado: 401) | ✅ OK |
| 4 | Programas | Listar programas | GET /api/programas | 200 + datos | 200 | ✅ OK |
| 5 | Programas | Crear programa | POST /api/programas | 201 + ID creado | 201 (ID: 14) | ✅ OK |
| 6 | Programas | Editar programa | PUT /api/programas/{id} | 200 + persiste | 200 | ✅ OK |
| 7 | Ediciones | Crear con malla activa | POST /api/ediciones | 201 | 201 | ✅ OK |
| 8 | Ediciones | Crear con malla inexistente/inactiva | POST /api/ediciones | 422 (bloqueado) | 422 | ✅ OK |
| 9 | Mallas | Desactivar y reactivar | PATCH /api/mallas/{id}/desactivar y /reactivar | 200 | 200 / 200 | ✅ OK |
| 10 | Materias | Desactivar y reactivar | PATCH /api/materias/{id}/desactivar y /reactivar | 200 | 200 / 200 | ✅ OK |
| 11 | Docentes | CRUD y asignar a edición | POST /api/docentes + asignar | 201 + 200/201 | 201 / 201 | ✅ OK |
| 12 | Docentes | Asignar docente inactivo | POST /api/ediciones/{id}/docentes | 422 | 422 | ✅ OK |
| 13 | Docentes | Asignar duplicado | POST /api/ediciones/{id}/docentes | 409/422 | 409 | ✅ OK |
| 14 | Usuarios | CRUD admin crear usuario | POST /api/usuarios | 201 | 201 | ✅ OK |
| 15 | Usuarios | No-admin intenta crear usuario | POST /api/usuarios | 403 Forbidden | 403 | ✅ OK |
| 16 | Defensas | CRUD defensas de tesis | POST + DELETE /api/defensas-tesis | 201 + 204 | 201 | ✅ OK |
| 17 | Carrera/IETA | GET y PUT institucional | GET + PUT /api/institucion | 200 + 200 | 200 / 200 | ✅ OK |
| 18 | Portal público | Home y catálogo activo | GET / y /api/programas/activos | 200 OK | 200 / 200 | ✅ OK |
| 19 | Portal público | Programas inactivos excluidos | GET /api/programas/activos | Excluidos | False | ✅ OK |
| 20 | Seguridad | Acceso admin sin token | GET /api/usuarios | 401 Unauthorized | 401 | ✅ OK |
