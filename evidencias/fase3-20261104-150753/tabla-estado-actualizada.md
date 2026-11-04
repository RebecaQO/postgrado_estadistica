# Tabla de Estado Actualizada — Cierre Fase 3

| Endpoint | Método | Fase 1 | Fase 3 | Evidencia |
|---|---|---|---|---|
| `/api/programas/activos` | GET | roto | OK (200) | `evidencias/fase3-*/fix-_api_programas_activos.md` |
| `/api/docentes` | GET | roto | OK (200) | `evidencias/fase3-*/fix-_api_docentes.md` |
| `/api/programas/{id}/malla` | GET | inexistente (404) | OK (200) | `evidencias/fase3-*/fix-_api_programas_1_malla.md` |
| `/api/convocatorias-pasadas` | GET | inexistente (404) | OK (200) | `evidencias/fase3-*/fix-_api_convocatorias-pasadas.md` |
| `/api/programas` | GET | verificado | OK (200) | `evidencias/fase3-*/smoke-programas.md` |
| `/api/ediciones` | GET | verificado | OK (200) | `evidencias/fase3-*/smoke-ediciones.md` |
| `/api/mallas` | GET | verificado | OK (200) | `evidencias/fase3-*/smoke-mallas.md` |
| `/api/modulos` | GET | verificado | OK (200) | `evidencias/fase3-*/smoke-materias_modulos.md` |
| `/api/materias` | GET | verificado | OK (200) | `evidencias/fase3-*/smoke-materias_modulos.md` |
| `/api/auth/me` | GET | verificado | OK (200) | Login y tokens activos |
| `/api/usuarios` | GET | inexistente | Pendiente Fase 4.1 | Submódulo 4.1 |
| `/api/defensas-tesis` | GET | inexistente | Pendiente Fase 4.2 | Submódulo 4.2 |
| `/api/institucion/info` | GET | inexistente | Pendiente Fase 4.3 | Submódulo 4.3 (`/api/institucion`) |
