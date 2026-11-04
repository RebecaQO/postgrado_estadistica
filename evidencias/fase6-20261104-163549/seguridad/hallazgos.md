# Reporte de Auditoría de Seguridad — POS_EST

**Fecha:** 2026-11-04  
**Rama:** `release/candidate`  
**Entorno:** Laravel 11/12 + Sanctum + PostgreSQL (Sail) + React Vite

---

## 1. Resumen Ejecutivo

| Área Evaluada | Estado | Hallazgos | Nivel de Riesgo |
|---|:---:|---|:---:|
| **Control de Versiones y Secretos** | ✅ Conforme | 0 archivos `.env`, `.env.local` o credenciales trackeados en git | Nulo |
| **Dependencias en Repositorio** | ✅ Conforme | 0 carpetas `vendor/` o `node_modules/` en control de versiones | Nulo |
| **Exposición de Contraseñas** | ✅ Conforme | 0 campos `password` expuestos en `App\Http\Resources` ni en respuestas JSON | Nulo |
| **Autenticación y Autorización** | ✅ Conforme | Todas las operaciones de escritura (POST/PUT/PATCH/DELETE) y el módulo `/api/usuarios` protegidos por `Administrador` middleware | Nulo |
| **Rate Limiting (Fuerza Bruta)** | ✅ Conforme | Endpoint `/api/auth/login` protegido con `throttle:5,1` | Nulo |
| **CORS y Headers** | ✅ Conforme | Configurado para origin `http://localhost:5173` con credenciales | Nulo |

---

## 2. Detalle de Verificaciones

### 2.1 Archivos Sensibles e Ignorados (.gitignore)
- Se auditó el repositorio completo mediante `git ls-files`.
- Ningún archivo `.env` o clave de entorno está versionado en el historial activo.
- Archivo de evidencia: [`env-tracked.txt`](./env-tracked.txt).
- Las dependencias de PHP (`backend/vendor`) y JavaScript (`frontend/node_modules`) están debidamente ignoradas en `.gitignore`.
- Archivo de evidencia: [`deps-tracked.txt`](./deps-tracked.txt) y [`gitignore-audit.txt`](./gitignore-audit.txt).

### 2.2 Exposición de Contraseñas (Password Leakage)
- Búsqueda exhaustiva en todos los controladores y recursos (`app/Http/Resources/*`).
- El modelo `Usuario` oculta el campo `password` vía `$hidden = ['password']`.
- En las respuestas de login (`/api/auth/login`), creación (`POST /api/usuarios`) y consulta (`GET /api/usuarios`), el campo de contraseña nunca es devuelto al cliente.
- Archivo de evidencia: [`password-leak.txt`](./password-leak.txt).

### 2.3 Autorización y Control de Acceso (RBAC)
- Total de rutas de API auditadas: **74 rutas**.
- Rutas públicas (sin autenticación requerida):
  - `POST /api/auth/login` (con rate limiter `5,1`)
  - `GET /api/convocatorias`
  - `GET /api/convocatorias-pasadas`
  - `GET /api/programas/activos`
- Rutas autenticadas (`auth:sanctum`):
  - Rutas de lectura de mallas, programas, módulos, materias, defensas, institución.
- Rutas restringidas a Administrador (`auth:sanctum` + `App\Http\Middleware\Administrador`):
  - Creación, edición, eliminación y cambio de estado en todos los módulos (`/api/programas`, `/api/ediciones`, `/api/mallas`, `/api/materias`, `/api/docentes`, `/api/defensas-tesis`, `/api/institucion`).
  - Totalidad del módulo de gestión de usuarios (`/api/usuarios/*`).
  - Si un usuario no-admin intenta invocar estos endpoints, Laravel retorna **403 Forbidden** de forma inmediata.
- Archivo de evidencia: [`routes-audit.json`](./routes-audit.json).

### 2.4 Mitigación de Ataques de Fuerza Bruta
- La ruta `POST /api/auth/login` implementa `throttle:5,1`, permitiendo un máximo de 5 intentos por minuto por IP, protegiendo al sistema contra ataques de diccionario o fuerza bruta.
- Archivo de evidencia: [`rate-limiting.txt`](./rate-limiting.txt).

---

## 3. Conclusión
El sistema cumple con los estándares de seguridad requeridos para el pase a staging / release candidate. No existen vulnerabilidades críticas ni fugas de credenciales en el código base.
