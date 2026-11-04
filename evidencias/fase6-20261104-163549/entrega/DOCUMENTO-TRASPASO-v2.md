# Documento de Traspaso Técnico v2 — POS_EST

**Proyecto:** Portal del Posgrado en Informática y Estadística — Universidad Mayor de San Andrés (UMSA)  
**Versión:** 0.9.0-rc  
**Fecha de Entrega:** 2026-11-04  
**Rama:** `release/candidate`  
**Tag de Release:** `v0.9.0-rc`

---

## 1. Resumen de Ejecución y Estado del Proyecto

El proyecto POS_EST ha completado exitosamente las **Fases 1 a 6** del ciclo de estabilización, refactorización y entrega:

| Fase | Descripción | Estado | Evidencias |
|---|---|:---:|---|
| **Fase 1** | Auditoría integral de endpoints, contratos JSON y rutas frontend | ✅ Completada | `evidencias/fase1-*/` |
| **Fase 2** | Unificación del cliente API (`apiJson`), auth Sanctum y manejo de errores | ✅ Completada | `evidencias/fase2-*/` |
| **Fase 3** | Reconexión y armonización de contratos rotos (Programas, Docentes, Malla, Convocatorias) | ✅ Completada | `evidencias/fase3-*/` |
| **Fase 4** | Implementación de 3 nuevos submódulos: Usuarios, Defensas de Tesis e Institución (Carrera/IETA) | ✅ Completada | `evidencias/fase4-*/` |
| **Fase 5** | Auditoría y validación exhaustiva del Portal Público | ✅ Completada | `evidencias/fase5-*/` |
| **Fase 6** | Limpieza de código legado, tests integrales E2E (20/20), auditoría de seguridad y empaquetado | ✅ Completada | `evidencias/fase6-*/` |

---

## 2. Arquitectura y Stack Tecnológico

### 2.1 Backend
- **Framework:** Laravel 11/12 sobre PHP 8.3.
- **Autenticación:** Laravel Sanctum (Tokens Bearer y protección de estado).
- **Autorización:** Middleware personalizado `App\Http\Middleware\Administrador` para control de rol RBAC.
- **Base de Datos:** PostgreSQL 16 con esquemas relacionales e integridad referencial estricta.
- **Entorno de Contenedores:** Laravel Sail (Docker Compose multi-servicio).

### 2.2 Frontend
- **Framework:** React 18 con Vite como bundler y entorno de ejecución.
- **Cliente HTTP Central:** `src/utils/api.js` (`apiJson()`), con auto-unwrap de envelopes `{ success: true, data: ... }`, inyección automática de Bearer token y manejo uniforme de errores HTTP (401, 403, 404, 409, 422, 500).
- **Estilos:** Tailwind CSS y Lucide Icons.

---

## 3. Módulos Funcionales Validados

| # | Módulo | Rutas API Principales | Capacidades Clave |
|---|---|---|---|
| **1** | **Programas** | `/api/programas`, `/api/programas/activos`, `/api/programas/{id}` | CRUD completo, activación/desactivación, filtro por grado académico (Maestrías/Diplomados). |
| **2** | **Ediciones** | `/api/ediciones`, `/api/programas/{id}/ediciones` | Gestión de versiones de programas, vinculación a mallas curriculares activas. |
| **3** | **Convocatorias** | `/api/convocatorias`, `/api/convocatorias-pasadas` | Publicación de convocatorias vigentes e histórico de convocatorias concluidas. |
| **4** | **Mallas Curriculares** | `/api/mallas`, `/api/programas/{id}/malla` | Versionado curricular, vinculación a materias y módulos. |
| **5** | **Materias y Módulos** | `/api/materias`, `/api/modulos` | CRUD de asignaturas, créditos académicos, asignación a mallas. |
| **6** | **Docentes** | `/api/docentes`, `/api/ediciones/{id}/docentes` | Registro docente, asignación a ediciones de programas, control de duplicados (409) y docentes inactivos (422). |
| **7** | **Usuarios (RBAC)** | `/api/usuarios`, `/api/usuarios/{id}/desactivar` | Gestión de administradores y usuarios del sistema. Bloqueo 403 a no-admins. |
| **8** | **Defensas de Tesis** | `/api/defensas-tesis` | Registro de fechas, tribunales, resultados y estados de defensas de grado. |
| **9** | **Carrera / IETA** | `/api/institucion`, `/api/institucion/info` | Modelo singleton para datos institucionales, autoridades, misión y visión. |
| **10** | **Portal Público** | Rutas públicas `/`, `/programas`, etc. | Acceso sin token, navegación resiliente con fallbacks ante recursos vacíos. |

---

## 4. Matriz de Validación End-to-End (20/20 Casos)

Todos los 20 casos críticos de la suite E2E se ejecutan y validan de forma automatizada mediante `run_matriz_e2e_20.sh`:

1. ✅ **Login Admin:** Retorna 200 + Bearer token válido.
2. ✅ **Login Usuario Regular:** Retorna 200 + Bearer token de usuario no-admin.
3. ✅ **Logout:** Invalida el token en base de datos; peticiones subsecuentes retornan 401.
4. ✅ **Listar Programas:** Retorna colección JSON paginada.
5. ✅ **Crear Programa:** Retorna 201 Created y persiste en PostgreSQL.
6. ✅ **Editar Programa:** Retorna 200 OK y refleja cambios en la lectura.
7. ✅ **Crear Edición con Malla Activa:** Retorna 201 Created.
8. ✅ **Crear Edición con Malla Inexistente:** Retorna 422 Unprocessable Entity.
9. ✅ **Mallas:** Ciclo de desactivación y reactivación exitoso (200 OK).
10. ✅ **Materias:** Ciclo de desactivación y reactivación exitoso (200 OK).
11. ✅ **Docentes:** Creación y asignación a edición (201 Created).
12. ✅ **Docentes Inactivos:** Intento de asignación bloqueado con 422.
13. ✅ **Docentes Duplicados:** Asignación duplicada prevenida con 409 Conflict.
14. ✅ **Usuarios (Admin):** Creación de cuenta con rol de sistema (201 Created).
15. ✅ **Usuarios (No-Admin):** Intento de creación bloqueado con 403 Forbidden.
16. ✅ **Defensas de Tesis:** Alta (201) y eliminación (204) comprobadas en PostgreSQL.
17. ✅ **Carrera / IETA:** Lectura (200) y actualización (200) de datos institucionales.
18. ✅ **Portal Público:** Carga de vista raíz y catálogo activo sin token (200 OK).
19. ✅ **Filtro de Catálogo:** Programas inactivos rigurosamente excluidos del portal público.
20. ✅ **Seguridad General:** Intento de acceso a endpoints protegidos sin token retorna 401.

---

## 5. Deuda Técnica Identificada y Recomendaciones Futuras

1. **Pruebas Unitarias de Backend (`artisan test`):**
   - La suite preexistente `LoginFlowTest` ejecuta migraciones directas sobre la base de datos compartida `testing`, provocando colisiones de tabla existente. Se recomienda configurar una base de datos SQLite en memoria (`:memory:`) en `phpunit.xml`.
2. **Rate Limiting Global:**
   - Actualmente `throttle:5,1` está configurado en `api/auth/login`. Se recomienda añadir limitadores por minuto a los endpoints de creación masiva.
3. **Paginación en Vistas Públicas:**
   - Si el catálogo de programas supera los 50 registros activos, se sugiere incorporar paginación infinita en el frontend.

---

## 6. Procedimiento de Entrega

- **Tag Git:** `v0.9.0-rc`
- **Rama:** `release/candidate`
- **Respaldo de Base de Datos:** `respaldos/backup-release-20261104_163549.dump`
