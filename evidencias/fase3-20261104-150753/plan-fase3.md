# PLAN DE TRABAJO — FASE 3

## Endpoints Rotos e Inexistentes de Fase 1
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

## Prioridad de Trabajo
1. Endpoints usados por el login (auth, user) — Verificado OK (token admin + user operativos)
2. Endpoints usados por Programas/Ediciones (núcleo):
   - GET /api/programas/activos (Roto por envoltorio data y mapeo de campos id/title/type/area)
   - GET /api/programas/{id}/malla vs /api/programas/{id}/mallas
3. Endpoints usados por Mallas/Materias/Módulos
4. Endpoints usados por Docentes:
   - GET /api/docentes (Roto por envoltorio data)
   - POST /api/docentes (Corregido middleware casing que producía 500)
5. Endpoints usados por Convocatorias Pasadas:
   - GET /api/convocatorias-pasadas (Inexistente en backend)

Nota: Rutas inexistentes de módulos que se implementan en Fase 4 (/api/usuarios, /api/defensas-tesis, /api/institucion) quedan catalogadas para sus respectivos submódulos 4.1, 4.2 y 4.3.

## Fichas de Contratos Extraídas
## GET /api/programas/activos

- Estado: roto
- Auth: Bearer token temporal (rol admin)
- HTTP real: 200
- Existe en route:list: sí
- Consumidor frontend: HeroSection, FeaturedPrograms, AdmissionWizard, AdmissionView, ProgramsView
- Campos/forma que lee: array de programas; lee id, title, type, area, modality, duration, enlaces
- Estructura de respuesta (sin valores personales): {success:bool, data:list}; data[] (3 filas), campos: id_programa, nombre_programa, descripcion, tipo_programa, area_conocimiento, mencion, perfil_aspirante, perfil_egreso, enlace_pdf_programa, activo, maestria, diplomado, ediciones
- Match: Devuelve {success,data:[...]}; React espera array y campos id/title/type/area frente a id_programa/nombre_programa/tipo_programa/area_conocimiento.
- Evidencia: get-api-programas-activos.json

## GET /api/programas/1
## GET /api/docentes

- Estado: roto
- Auth: Bearer token temporal (rol admin)
- HTTP real: 200
- Existe en route:list: sí
- Consumidor frontend: InstitutionView, ProgramEditorFixed, ProgramDetailModal, ProgramDetailView
- Campos/forma que lee: array directo de docentes; lee nombres y foto
- Estructura de respuesta (sin valores personales): {success:bool, data:list}; data[] (2 filas), campos: id_doc, nombre_doc, apellido_doc, foto, activo
- Match: Laravel envuelve la lista en un objeto; el frontend espera una lista directa.
- Evidencia: get-api-docentes.json

## GET /api/ediciones
## GET /api/programas/1/malla

- Estado: inexistente
- Auth: Bearer token temporal (rol admin)
- HTTP real: 404
- Existe en route:list: no
- Consumidor frontend: ProgramDetailModal, ProgramDetailView via programaService.getMalla
- Campos/forma que lee: programa normalizado con curriculum, perfil_egreso y perfil_aspirante
- Estructura de respuesta (sin valores personales): {message:str, exception:str, file:str, line:int, trace:list}
- Match: La ruta no está en route:list y responde 404.
- Evidencia: get-frontend-singular-malla.json

## GET /api/ediciones/1
## GET /api/convocatorias-pasadas

- Estado: inexistente
- Auth: Bearer token temporal (rol admin)
- HTTP real: 404
- Existe en route:list: no
- Consumidor frontend: RegulationsView, AdminPortal via convocatoriaService
- Campos/forma que lee: array directo: gestion, nivel, titulo, programa, resolucion_hcu
- Estructura de respuesta (sin valores personales): {message:str, exception:str, file:str, line:int, trace:list}
- Match: La ruta no está en route:list y responde 404.
- Evidencia: get-frontend-convocatorias-pasadas.json

## GET /api/institucion/info
