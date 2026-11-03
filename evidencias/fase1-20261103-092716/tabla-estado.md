# Estado de endpoints — Fase 1

| Módulo | Método | Endpoint | En snapshot | HTTP | Match | Estado |
|---|---|---|---:|---:|---|---|
| admin | GET | /api/admin/docentes | no | 404 | no | inexistente |
| admin | GET | /api/admin/mallas | no | 404 | no | inexistente |
| admin | GET | /api/admin/materias | no | 404 | no | inexistente |
| admin | GET | /api/admin/programas | no | 404 | no | inexistente |
| admin | GET | /api/admin/programas/1/modulos | no | 404 | no | inexistente |
| admin | GET | /api/admin/programas/1/wizard-data | no | 404 | no | inexistente |
| admin | GET | /api/admin/roles | no | 404 | no | inexistente |
| admin | GET | /api/admin/usuarios | no | 404 | no | inexistente |
| convocatorias-pasadas | GET | /api/convocatorias-pasadas | no | 404 | no | inexistente |
| defensas-tesis | GET | /api/defensas-tesis | no | 404 | no | inexistente |
| docentes | GET | /api/docentes | sí | 200 | no | roto |
| institucion | GET | /api/institucion/info | no | 404 | no | inexistente |
| programas | GET | /api/programas/1/malla | no | 404 | no | inexistente |
| programas | GET | /api/programas/activos | sí | 200 | no | roto |
| usuarios | GET | /api/usuarios | no | 404 | no | inexistente |
| auth | GET | /api/auth/me | sí | 200 | sí/NA | verificado |
| convocatorias | GET | /api/convocatorias | sí | 200 | sí/NA | verificado |
| diplomados | GET | /api/diplomados | sí | 200 | sí/NA | verificado |
| diplomados | GET | /api/diplomados/3 | sí | 200 | sí/NA | verificado |
| docentes | GET | /api/docentes/3 | sí | 200 | sí/NA | verificado |
| ediciones | GET | /api/ediciones | sí | 200 | sí/NA | verificado |
| ediciones | GET | /api/ediciones/1 | sí | 200 | sí/NA | verificado |
| ediciones | GET | /api/ediciones/1/docentes | sí | 200 | sí/NA | verificado |
| maestrias | GET | /api/maestrias | sí | 200 | sí/NA | verificado |
| maestrias | GET | /api/maestrias/1 | sí | 200 | sí/NA | verificado |
| mallas | GET | /api/mallas | sí | 200 | sí/NA | verificado |
| mallas | GET | /api/mallas/1 | sí | 200 | sí/NA | verificado |
| mallas | GET | /api/mallas/1/modulos | sí | 200 | sí/NA | verificado |
| materias | GET | /api/materias | sí | 200 | sí/NA | verificado |
| materias | GET | /api/materias/1 | sí | 200 | sí/NA | verificado |
| modulos | GET | /api/modulos | sí | 200 | sí/NA | verificado |
| modulos | GET | /api/modulos/1 | sí | 200 | sí/NA | verificado |
| programas | GET | /api/programas | sí | 200 | sí/NA | verificado |
| programas | GET | /api/programas/1 | sí | 200 | sí/NA | verificado |
| programas | GET | /api/programas/1/ediciones | sí | 200 | sí/NA | verificado |
| programas | GET | /api/programas/1/mallas | sí | 200 | sí/NA | verificado |
