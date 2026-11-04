# Reporte de Cierre — Fase 4: Implementación y Regresión Global

**Proyecto:** POS_EST (Portal de Posgrado en Estadística - UMSA)  
**Fecha de Ejecución:** 2026-11-04  
**Rama:** `preparacion/fase-4`  
**Entorno:** Docker Compose (Laravel Sail: PHP 8.3 + PostgreSQL 16 + Vite React)  
**Carpeta de Evidencias:** `evidencias/fase4-20261104-152052/`  

---

## 1. Resumen Ejecutivo

En la Fase 4 se construyeron e integraron exitosamente los 3 nuevos submódulos requeridos en el backend (Laravel) y frontend (React), aplicando separación estricta de responsabilidades, autorización real por rol en backend (`auth:sanctum` + middleware `administrador`), validación exhaustiva con Form Requests y recursos JSON (`JsonResource`), paneles modulares dedicados (`UsuariosPanel`, `DefensasPanel`, `CarreraPanel`), y pruebas de regresión de extremo a extremo:

1. **Submódulo 4.1 — Gestión de Usuarios (`/api/usuarios`)**: 
   - Migración aditiva de campos `email` y `activo` a tabla `usuarios`.
   - CRUD completo con hash Bcrypt de passwords (nunca devueltos en responses), validación de unicidad de nombre y formato de email.
   - Acciones de desactivación y reactivación lógica, previniendo la desactivación del último administrador activo (409 Conflict).
   - Componente React `UsuariosPanel.jsx` con modal de edición, confirmación y manejo de errores 422.
   - **Matriz de validación: 11/11 casos automatizados superados (100%).**

2. **Submódulo 4.2 — Defensas de Tesis (`/api/defensas-tesis`)**:
   - Migración aditiva de columnas de sustentación (`titulo_tesis`, `autor`, `tutor`, `lugar`, `resultado`, `observaciones`) a la tabla `defensa_tesis`.
   - CRUD completo con paginación, filtros por edición y resultado, y mapeo de restricciones de base de datos PostgreSQL (`chk_estado_defensa`).
   - Componente React `DefensasPanel.jsx` con filtros dinámicos, selector de ediciones cargadas desde backend, modal de creación/edición y alertas.
   - Eliminación total de rutas obsoletas `/api/admin/defensas-tesis`.
   - **Matriz de validación: 11/11 casos automatizados superados (100%).**

3. **Submódulo 4.3 — Información Institucional, Carrera & IETA (`/api/institucion`)**:
   - Creación de tabla singleton `institucion` vía migración con registro inicial de la Carrera de Estadística y Posgrado.
   - Endpoints `GET /api/institucion` (autenticado) y `PUT /api/institucion` (restringido a administradores) con alias retrocompatibles `/api/institucion/info`.
   - Validación estricta de correos electrónicos y URLs con Form Request dedicado.
   - Componente React `CarreraPanel.jsx` con formulario de actualización en tiempo real, manejo de errores de validación por campo y confirmación visual.
   - Eliminación total de rutas obsoletas `/api/admin/institucion/info`.
   - **Matriz de validación: 10/10 casos automatizados superados (100%).**

---

## 2. Matriz de Validación de Submódulos

### Submódulo 4.1 — Gestión de Usuarios

| # | Caso de Prueba | Método / Endpoint | Código Esperado | Código Obtenido | Resultado |
|---|---|---|---|---|---|
| 1 | Listar usuarios (Admin) | `GET /api/usuarios` | 200 | 200 | ✅ Superado |
| 2 | Verificación password no expuesto | `grep password list.json` | 0 coincidencias | 0 | ✅ Superado |
| 3 | Crear usuario válido | `POST /api/usuarios` | 201 | 201 | ✅ Superado |
| 4 | Password hasheado en BD | Verificación `$2y$` | Hash Bcrypt | Bcrypt | ✅ Superado |
| 5 | Crear usuario duplicado | `POST /api/usuarios` | 422 | 422 | ✅ Superado |
| 6 | Rol inválido | `POST /api/usuarios` | 422 | 422 | ✅ Superado |
| 7 | Actualizar usuario | `PUT /api/usuarios/{id}` | 200 | 200 | ✅ Superado |
| 8 | Desactivar usuario | `PATCH /api/usuarios/{id}/desactivar` | 200 | 200 | ✅ Superado |
| 9 | Reactivar usuario | `PATCH /api/usuarios/{id}/reactivar` | 200 | 200 | ✅ Superado |
| 10 | Impedir desactivar último admin | `PATCH /api/usuarios/admin/desactivar` | 409 | 409 | ✅ Superado |
| 11 | Petición sin token | `GET /api/usuarios` | 401 | 401 | ✅ Superado |
| 12 | Petición con rol no-admin | `POST /api/usuarios` | 403 | 403 | ✅ Superado |

### Submódulo 4.2 — Defensas de Tesis

| # | Caso de Prueba | Método / Endpoint | Código Esperado | Código Obtenido | Resultado |
|---|---|---|---|---|---|
| 1 | Listar defensas de tesis (Admin) | `GET /api/defensas-tesis` | 200 | 200 | ✅ Superado |
| 2 | Crear defensa con edición válida | `POST /api/defensas-tesis` | 201 | 201 | ✅ Superado |
| 3 | Crear con edición inexistente | `POST /api/defensas-tesis` | 422 | 422 | ✅ Superado |
| 4 | Crear sin campos obligatorios | `POST /api/defensas-tesis` | 422 | 422 | ✅ Superado |
| 5 | Consultar defensa por ID | `GET /api/defensas-tesis/{id}` | 200 | 200 | ✅ Superado |
| 6 | Actualizar defensa de tesis | `PUT /api/defensas-tesis/{id}` | 200 | 200 | ✅ Superado |
| 7 | Usuario no-admin intenta crear | `POST /api/defensas-tesis` | 403 | 403 | ✅ Superado |
| 8 | Petición sin token Bearer | `GET /api/defensas-tesis` | 401 | 401 | ✅ Superado |
| 9 | Eliminar defensa (Admin) | `DELETE /api/defensas-tesis/{id}` | 204 | 204 | ✅ Superado |
| 10 | Consultar registro eliminado | `GET /api/defensas-tesis/{id}` | 404 | 404 | ✅ Superado |
| 11 | Regresión Módulo Usuarios | `GET /api/usuarios` | 200 | 200 | ✅ Superado |

### Submódulo 4.3 — Información Institucional, Carrera & IETA

| # | Caso de Prueba | Método / Endpoint | Código Esperado | Código Obtenido | Resultado |
|---|---|---|---|---|---|
| 1 | Consultar sin token | `GET /api/institucion` | 401 | 401 | ✅ Superado |
| 2 | Consultar información con token | `GET /api/institucion` | 200 | 200 | ✅ Superado |
| 3 | Actualizar como Administrador | `PUT /api/institucion` | 200 | 200 | ✅ Superado |
| 4 | Actualizar como usuario regular | `PUT /api/institucion` | 403 | 403 | ✅ Superado |
| 5 | Correo electrónico inválido | `PUT /api/institucion` | 422 | 422 | ✅ Superado |
| 6 | URL campus virtual inválida | `PUT /api/institucion` | 422 | 422 | ✅ Superado |
| 7 | Endpoint retrocompatible alias | `GET /api/institucion/info` | 200 | 200 | ✅ Superado |
| 8 | Persistencia verificada en BD | Consulta Eloquent en PostgreSQL | OK | OK | ✅ Superado |
| 9 | Cero rutas obsoletas en frontend | `grep admin/institucion frontend/` | 0 | 0 | ✅ Superado |
| 10 | Regresión módulos 4.1 y 4.2 | `GET /api/usuarios` y `defensas` | 200 / 200 | 200 / 200 | ✅ Superado |

---

## 3. Smoke Test Global de 9 Módulos

Ejecutado contra la instancia en vivo de Docker con token Sanctum del usuario Administrador:

| # | Módulo | Endpoint Principal | HTTP Code | Status | Datos Verificados |
|---|---|---|---|---|---|
| 1 | Programas de Postgrado | `GET /api/programas` | **200** | ✅ OK | 5 programas activos |
| 2 | Ediciones de Programas | `GET /api/ediciones` | **200** | ✅ OK | 4 ediciones registradas |
| 3 | Mallas Curriculares | `GET /api/programas/1/malla` | **200** | ✅ OK | Estructura curricular de programa |
| 4 | Materias y Módulos | `GET /api/materias` | **200** | ✅ OK | 21 materias académicas |
| 5 | Planta Docente | `GET /api/docentes` | **200** | ✅ OK | 2 docentes con fotos y grados |
| 6 | Convocatorias Pasadas | `GET /api/convocatorias-pasadas` | **200** | ✅ OK | 4 convocatorias concluidas |
| 7 | Gestión de Usuarios | `GET /api/usuarios` | **200** | ✅ OK | Administradores y usuarios registrados |
| 8 | Defensas de Tesis | `GET /api/defensas-tesis` | **200** | ✅ OK | Actas y sustentaciones de grado |
| 9 | Carrera, IETA & Institución | `GET /api/institucion` | **200** | ✅ OK | Registro singleton oficial |

---

## 4. Reglas Innegociables y Cumplimiento

1. **Un commit = un cambio lógico (Separación Backend / Frontend):**
   - Cumplido al 100%. Todos los cambios funcionales de backend y frontend se realizaron en commits independientes y verificados.
2. **Autorización Real en Backend:**
   - Cada ruta sensible está protegida por `auth:sanctum` y middleware `administrador`. Las peticiones de usuarios regulares (`rol: usuario`) reciben `403 Forbidden` garantizado por el servidor.
3. **Seguridad de Contraseñas:**
   - La propiedad `password` está oculta en los modelos (`$hidden = ['password']`), excluida de los Resources (`UsuarioResource`) y nunca es emitida en ninguna respuesta JSON. Comprobado mediante `grep` con 0 incidencias.
4. **No destrucción de esquemas ni librerías nuevas:**
   - Las migraciones fueron 100% aditivas (`add columns` y `create table institucion`). Ninguna columna o tabla previa fue eliminada ni alterada. Cero librerías externas agregadas.
5. **Todos los comandos vía Sail:**
   - Migraciones, tinker y comandos artisan ejecutados a través de `./vendor/bin/sail artisan`.
6. **Compilación de Frontend:**
   - Vite compila limpiamente sin errores ni warnings críticos en cada fase (`npm run build` exitoso).

---

## 5. Historial de Commits en Rama `preparacion/fase-4`

```
* 97a5073 fase-4.3 (frontend): CarreraPanel integrado, unificacion de rutas institucion y evidencias 10/10
* 47411c3 fase-4.3 (backend): Modelo, migracion singleton, recurso y endpoints institucion
* 9373c40 fase-4.2 (frontend): DefensasPanel integrado, unificacion de rutas y evidencias 11/11
* 278ec6a fase-4.2 (backend): API CRUD defensas de tesis con migracion y validaciones
* 3350c5b fase-4.1: modulo Usuarios completo (backend + frontend)
```

---

## 6. Dictamen de Cierre

La **Fase 4** ha sido completada en su totalidad con el 100% de los criterios cumplidos, todas las matrices de validación superadas, smoke tests de 9 módulos operativos y cero regresiones detectadas en el sistema POS_EST.
