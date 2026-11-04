# Smoke Test Global — 9 Módulos POS_EST (Fase 4)

**Fecha:** 2026-11-04 19:55:10 UTC
**Ambiente:** Docker Compose Sail (PHP 8.3 + PostgreSQL 16 + Vite React)

| # | Módulo | Endpoint | Método | HTTP Code | Status | Registros |
|---|---|---|---|---|---|---|
| 1 | 1. Programas Postgrado | `/api/programas` | GET | **200** | ✅ OK | 5 |
| 2 | 2. Ediciones de Programa | `/api/ediciones` | GET | **200** | ✅ OK | 4 |
| 3 | 3. Mallas Curriculares | `/api/programas/1/malla` | GET | **200** | ✅ OK | 2 |
| 4 | 4. Materias / Módulos | `/api/materias` | GET | **200** | ✅ OK | 21 |
| 5 | 5. Planta Docente | `/api/docentes` | GET | **200** | ✅ OK | 2 |
| 6 | 6. Convocatorias Pasadas | `/api/convocatorias-pasadas` | GET | **200** | ✅ OK | 4 |
| 7 | 7. Gestión de Usuarios | `/api/usuarios` | GET | **200** | ✅ OK | 3 |
| 8 | 8. Defensas de Tesis | `/api/defensas-tesis` | GET | **200** | ✅ OK | 2 |
| 9 | 9. Información Carrera & IETA | `/api/institucion` | GET | **200** | ✅ OK | 1 (objeto) |

### Conclusión
Los 9 módulos responden HTTP 200 OK bajo autenticación Sanctum con datos reales y estructuras verificadas.
