# Contratos de API — Fase 1

Captura: 2026-11-03 09:34:11 local.

Las respuestas exactas están en get-*.json. El login está sanitizado; su token solo se guardó temporalmente en /tmp. Los JSON crudos son locales y no deben publicarse porque pueden contener datos personales.

## GET /api/auth/me

- Estado: verificado
- Auth: Bearer token temporal (rol admin)
- HTTP real: 200
- Existe en route:list: sí
- Consumidor frontend: authService.getMe -> AuthContext
- Campos/forma que lee: objeto de usuario autenticado
- Estructura de respuesta (sin valores personales): {success:bool, message:str, user:dict}
- Match: HTTP 200 y estructura JSON capturados.
- Evidencia: get-api-auth-me.json

## GET /api/convocatorias

- Estado: verificado
- Auth: Bearer token temporal (rol admin)
- HTTP real: 200
- Existe en route:list: sí
- Consumidor frontend: sin consumidor frontend GET directo identificado
- Campos/forma que lee: no aplica; endpoint backend de referencia
- Estructura de respuesta (sin valores personales): {success:bool, data:list}; data[] (3 filas), campos: id_edicion, fecha_inicio, fecha_fin, duracion, horario, descripcion, modalidad_titulacion, requisitos, convocatoria, formulario, estado, id_malla, id_programa, nombre_edicion, programa
- Match: HTTP 200 y estructura JSON capturados.
- Evidencia: get-api-convocatorias.json

## GET /api/diplomados

- Estado: verificado
- Auth: Bearer token temporal (rol admin)
- HTTP real: 200
- Existe en route:list: sí
- Consumidor frontend: sin consumidor frontend GET directo identificado
- Campos/forma que lee: no aplica; endpoint backend de referencia
- Estructura de respuesta (sin valores personales): {success:bool, data:list}; data[] (1 filas), campos: id_programa, programa
- Match: HTTP 200 y estructura JSON capturados.
- Evidencia: get-api-diplomados.json

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

- Estado: verificado
- Auth: Bearer token temporal (rol admin)
- HTTP real: 200
- Existe en route:list: sí
- Consumidor frontend: sin consumidor frontend GET directo identificado
- Campos/forma que lee: no aplica; endpoint backend de referencia
- Estructura de respuesta (sin valores personales): {success:bool, data:list}; data[] (4 filas), campos: id_edicion, fecha_inicio, fecha_fin, duracion, horario, descripcion, modalidad_titulacion, requisitos, convocatoria, formulario, estado, id_malla, id_programa, nombre_edicion, programa, malla, docentes
- Match: HTTP 200 y estructura JSON capturados.
- Evidencia: get-api-ediciones.json

## GET /api/maestrias

- Estado: verificado
- Auth: Bearer token temporal (rol admin)
- HTTP real: 200
- Existe en route:list: sí
- Consumidor frontend: sin consumidor frontend GET directo identificado
- Campos/forma que lee: no aplica; endpoint backend de referencia
- Estructura de respuesta (sin valores personales): {success:bool, data:list}; data[] (2 filas), campos: id_programa, tipo, programa
- Match: HTTP 200 y estructura JSON capturados.
- Evidencia: get-api-maestrias.json

## GET /api/mallas

- Estado: verificado
- Auth: Bearer token temporal (rol admin)
- HTTP real: 200
- Existe en route:list: sí
- Consumidor frontend: sin consumidor frontend GET directo identificado
- Campos/forma que lee: no aplica; endpoint backend de referencia
- Estructura de respuesta (sin valores personales): {success:bool, data:list}; data[] (6 filas), campos: id_malla, nombre_malla, id_programa, activo, programa
- Match: HTTP 200 y estructura JSON capturados.
- Evidencia: get-api-mallas.json

## GET /api/materias

- Estado: verificado
- Auth: Bearer token temporal (rol admin)
- HTTP real: 200
- Existe en route:list: sí
- Consumidor frontend: sin consumidor frontend GET directo identificado
- Campos/forma que lee: no aplica; endpoint backend de referencia
- Estructura de respuesta (sin valores personales): {success:bool, data:list}; data[] (21 filas), campos: id_mat, nombre_mat, descripcion, activo, materia_maestria, modulo_diplomado
- Match: HTTP 200 y estructura JSON capturados.
- Evidencia: get-api-materias.json

## GET /api/modulos

- Estado: verificado
- Auth: Bearer token temporal (rol admin)
- HTTP real: 200
- Existe en route:list: sí
- Consumidor frontend: sin consumidor frontend GET directo identificado
- Campos/forma que lee: no aplica; endpoint backend de referencia
- Estructura de respuesta (sin valores personales): {success:bool, data:list}; data[] (12 filas), campos: id_mod, nombre_mod, id_malla, activo, malla, materias
- Match: HTTP 200 y estructura JSON capturados.
- Evidencia: get-api-modulos.json

## GET /api/programas

- Estado: verificado
- Auth: Bearer token temporal (rol admin)
- HTTP real: 200
- Existe en route:list: sí
- Consumidor frontend: sin consumidor frontend GET directo identificado
- Campos/forma que lee: no aplica; endpoint backend de referencia
- Estructura de respuesta (sin valores personales): {success:bool, data:list}; data[] (5 filas), campos: id_programa, nombre_programa, descripcion, tipo_programa, area_conocimiento, mencion, perfil_aspirante, perfil_egreso, enlace_pdf_programa, activo, maestria, diplomado, mallas, ediciones
- Match: HTTP 200 y estructura JSON capturados.
- Evidencia: get-api-programas.json

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

- Estado: verificado
- Auth: Bearer token temporal (rol admin)
- HTTP real: 200
- Existe en route:list: sí
- Consumidor frontend: sin consumidor frontend GET directo identificado
- Campos/forma que lee: no aplica; endpoint backend de referencia
- Estructura de respuesta (sin valores personales): {success:bool, data:dict}
- Match: HTTP 200 y estructura JSON capturados.
- Evidencia: get-programa-detail.json

## GET /api/programas/1/ediciones

- Estado: verificado
- Auth: Bearer token temporal (rol admin)
- HTTP real: 200
- Existe en route:list: sí
- Consumidor frontend: checklist de traspaso
- Campos/forma que lee: lista de ediciones
- Estructura de respuesta (sin valores personales): {success:bool, data:list}; data[] (1 filas), campos: id_edicion, fecha_inicio, fecha_fin, duracion, horario, descripcion, modalidad_titulacion, requisitos, convocatoria, formulario, estado, id_malla, id_programa, nombre_edicion, malla, docentes
- Match: HTTP 200 y estructura JSON capturados.
- Evidencia: get-programa-ediciones.json

## GET /api/programas/1/mallas

- Estado: verificado
- Auth: Bearer token temporal (rol admin)
- HTTP real: 200
- Existe en route:list: sí
- Consumidor frontend: checklist de traspaso
- Campos/forma que lee: lista de mallas
- Estructura de respuesta (sin valores personales): {success:bool, data:list}; data[] (2 filas), campos: id_malla, nombre_malla, id_programa, activo
- Match: HTTP 200 y estructura JSON capturados.
- Evidencia: get-programa-mallas.json

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

- Estado: verificado
- Auth: Bearer token temporal (rol admin)
- HTTP real: 200
- Existe en route:list: sí
- Consumidor frontend: sin consumidor frontend GET directo identificado
- Campos/forma que lee: no aplica; endpoint backend de referencia
- Estructura de respuesta (sin valores personales): {success:bool, data:dict}
- Match: HTTP 200 y estructura JSON capturados.
- Evidencia: get-edicion-detail.json

## GET /api/ediciones/1/docentes

- Estado: verificado
- Auth: Bearer token temporal (rol admin)
- HTTP real: 200
- Existe en route:list: sí
- Consumidor frontend: checklist de traspaso
- Campos/forma que lee: lista de docentes asignados
- Estructura de respuesta (sin valores personales): {success:bool, data:list}; data[] (1 filas), campos: id_doc, nombre_doc, apellido_doc, foto, activo, pivot
- Match: HTTP 200 y estructura JSON capturados.
- Evidencia: get-edicion-docentes.json

## GET /api/docentes/3

- Estado: verificado
- Auth: Bearer token temporal (rol admin)
- HTTP real: 200
- Existe en route:list: sí
- Consumidor frontend: sin consumidor frontend GET directo identificado
- Campos/forma que lee: no aplica; endpoint backend de referencia
- Estructura de respuesta (sin valores personales): {success:bool, data:dict}
- Match: HTTP 200 y estructura JSON capturados.
- Evidencia: get-docente-detail.json

## GET /api/maestrias/1

- Estado: verificado
- Auth: Bearer token temporal (rol admin)
- HTTP real: 200
- Existe en route:list: sí
- Consumidor frontend: sin consumidor frontend GET directo identificado
- Campos/forma que lee: no aplica; endpoint backend de referencia
- Estructura de respuesta (sin valores personales): {success:bool, data:dict}
- Match: HTTP 200 y estructura JSON capturados.
- Evidencia: get-maestria-detail.json

## GET /api/mallas/1

- Estado: verificado
- Auth: Bearer token temporal (rol admin)
- HTTP real: 200
- Existe en route:list: sí
- Consumidor frontend: sin consumidor frontend GET directo identificado
- Campos/forma que lee: no aplica; endpoint backend de referencia
- Estructura de respuesta (sin valores personales): {success:bool, data:dict}
- Match: HTTP 200 y estructura JSON capturados.
- Evidencia: get-malla-detail.json

## GET /api/mallas/1/modulos

- Estado: verificado
- Auth: Bearer token temporal (rol admin)
- HTTP real: 200
- Existe en route:list: sí
- Consumidor frontend: sin consumidor frontend GET directo identificado
- Campos/forma que lee: no aplica; endpoint backend de referencia
- Estructura de respuesta (sin valores personales): {success:bool, data:list}; data[] (1 filas), campos: id_mod, nombre_mod, id_malla, activo, materias
- Match: HTTP 200 y estructura JSON capturados.
- Evidencia: get-malla-modulos.json

## GET /api/materias/1

- Estado: verificado
- Auth: Bearer token temporal (rol admin)
- HTTP real: 200
- Existe en route:list: sí
- Consumidor frontend: sin consumidor frontend GET directo identificado
- Campos/forma que lee: no aplica; endpoint backend de referencia
- Estructura de respuesta (sin valores personales): {success:bool, data:dict}
- Match: HTTP 200 y estructura JSON capturados.
- Evidencia: get-materia-detail.json

## GET /api/modulos/1

- Estado: verificado
- Auth: Bearer token temporal (rol admin)
- HTTP real: 200
- Existe en route:list: sí
- Consumidor frontend: sin consumidor frontend GET directo identificado
- Campos/forma que lee: no aplica; endpoint backend de referencia
- Estructura de respuesta (sin valores personales): {success:bool, data:dict}
- Match: HTTP 200 y estructura JSON capturados.
- Evidencia: get-modulo-detail.json

## GET /api/diplomados/3

- Estado: verificado
- Auth: Bearer token temporal (rol admin)
- HTTP real: 200
- Existe en route:list: sí
- Consumidor frontend: sin consumidor frontend GET directo identificado
- Campos/forma que lee: no aplica; endpoint backend de referencia
- Estructura de respuesta (sin valores personales): {success:bool, data:dict}
- Match: HTTP 200 y estructura JSON capturados.
- Evidencia: get-diplomado-detail.json

## GET /api/usuarios

- Estado: inexistente
- Auth: Bearer token temporal (rol admin)
- HTTP real: 404
- Existe en route:list: no
- Consumidor frontend: checklist de traspaso; sin consumidor actual detectado
- Campos/forma que lee: endpoint inexistente esperado
- Estructura de respuesta (sin valores personales): {message:str, exception:str, file:str, line:int, trace:list}
- Match: La ruta no está en route:list y responde 404.
- Evidencia: get-missing-usuarios.json

## GET /api/defensas-tesis

- Estado: inexistente
- Auth: Bearer token temporal (rol admin)
- HTTP real: 404
- Existe en route:list: no
- Consumidor frontend: AdminPortal via defensaService
- Campos/forma que lee: array directo de defensas
- Estructura de respuesta (sin valores personales): {message:str, exception:str, file:str, line:int, trace:list}
- Match: La ruta no está en route:list y responde 404.
- Evidencia: get-missing-defensas.json

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

- Estado: inexistente
- Auth: Bearer token temporal (rol admin)
- HTTP real: 404
- Existe en route:list: no
- Consumidor frontend: ContactView, Footer, TopBar, AdminPortal via institucionService
- Campos/forma que lee: objeto: direccion, telefono, email_principal, horario_atencion y descripciones
- Estructura de respuesta (sin valores personales): {message:str, exception:str, file:str, line:int, trace:list}
- Match: La ruta no está en route:list y responde 404.
- Evidencia: get-frontend-institucion-info.json

## GET /api/admin/programas

- Estado: inexistente
- Auth: Bearer token temporal (rol admin)
- HTTP real: 404
- Existe en route:list: no
- Consumidor frontend: AdminPortal via programaService.adminGetAll
- Campos/forma que lee: objeto con items[]; cada item requiere id
- Estructura de respuesta (sin valores personales): {message:str, exception:str, file:str, line:int, trace:list}
- Match: La ruta no está en route:list y responde 404.
- Evidencia: get-legacy-admin-programas.json

## GET /api/admin/programas/1/modulos

- Estado: inexistente
- Auth: Bearer token temporal (rol admin)
- HTTP real: 404
- Existe en route:list: no
- Consumidor frontend: programaService.getModulos
- Campos/forma que lee: lista de modulos
- Estructura de respuesta (sin valores personales): {message:str, exception:str, file:str, line:int, trace:list}
- Match: La ruta no está en route:list y responde 404.
- Evidencia: get-legacy-admin-programa-modulos.json

## GET /api/admin/programas/1/wizard-data

- Estado: inexistente
- Auth: Bearer token temporal (rol admin)
- HTTP real: 404
- Existe en route:list: no
- Consumidor frontend: programaService.getWizardData
- Campos/forma que lee: datos del editor asistido
- Estructura de respuesta (sin valores personales): {message:str, exception:str, file:str, line:int, trace:list}
- Match: La ruta no está en route:list y responde 404.
- Evidencia: get-legacy-admin-wizard-data.json

## GET /api/admin/materias

- Estado: inexistente
- Auth: Bearer token temporal (rol admin)
- HTTP real: 404
- Existe en route:list: no
- Consumidor frontend: programaService.getMaterias
- Campos/forma que lee: lista de materias
- Estructura de respuesta (sin valores personales): {message:str, exception:str, file:str, line:int, trace:list}
- Match: La ruta no está en route:list y responde 404.
- Evidencia: get-legacy-admin-materias.json

## GET /api/admin/mallas

- Estado: inexistente
- Auth: Bearer token temporal (rol admin)
- HTTP real: 404
- Existe en route:list: no
- Consumidor frontend: programaService.getMallas
- Campos/forma que lee: lista de mallas
- Estructura de respuesta (sin valores personales): {message:str, exception:str, file:str, line:int, trace:list}
- Match: La ruta no está en route:list y responde 404.
- Evidencia: get-legacy-admin-mallas.json

## GET /api/admin/docentes

- Estado: inexistente
- Auth: Bearer token temporal (rol admin)
- HTTP real: 404
- Existe en route:list: no
- Consumidor frontend: AdminPortal via docenteService.getAdminDocentes
- Campos/forma que lee: array directo de docentes
- Estructura de respuesta (sin valores personales): {message:str, exception:str, file:str, line:int, trace:list}
- Match: La ruta no está en route:list y responde 404.
- Evidencia: get-legacy-admin-docentes.json

## GET /api/admin/usuarios

- Estado: inexistente
- Auth: Bearer token temporal (rol admin)
- HTTP real: 404
- Existe en route:list: no
- Consumidor frontend: AdminPortal via adminService.getUsuarios
- Campos/forma que lee: array directo de usuarios
- Estructura de respuesta (sin valores personales): {message:str, exception:str, file:str, line:int, trace:list}
- Match: La ruta no está en route:list y responde 404.
- Evidencia: get-legacy-admin-usuarios.json

## GET /api/admin/roles

- Estado: inexistente
- Auth: Bearer token temporal (rol admin)
- HTTP real: 404
- Existe en route:list: no
- Consumidor frontend: AdminPortal via adminService.getRoles
- Campos/forma que lee: array directo de roles
- Estructura de respuesta (sin valores personales): {message:str, exception:str, file:str, line:int, trace:list}
- Match: La ruta no está en route:list y responde 404.
- Evidencia: get-legacy-admin-roles.json
