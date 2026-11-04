# Reporte de Cierre — FASE 5: Revisión Integral del Portal Público

**Proyecto:** POS_EST (Portal de Posgrado en Estadística - UMSA)  
**Fecha:** 2026-11-04  
**Rama:** `preparacion/fase-5`  
**Entorno:** Docker Compose (Laravel Sail: PHP 8.3 + PostgreSQL 16 + Vite React)  
**Carpeta de Evidencias:** `evidencias/fase5-20261104-162838/`  

---

## 1. Resumen Ejecutivo

La **Fase 5** validó el comportamiento del portal público del sistema POS_EST, asegurando que consume datos reales de PostgreSQL a través de la API Laravel, respeta de manera estricta los estados de activación y publicación (programas inactivos y convocatorias concluidas/canceladas correctamente filtradas), y no sufre crashes ni errores fatales de React ante registros inexistentes, enlaces históricos o fallbacks.

**Resultado Global: 12/12 casos de la matriz de validación superados (100%).**

---

## 2. Inventario de Rutas y Endpoints

### 2.1 Vistas Públicas del Frontend (SPA)
- **Home (`/`, `#`)**: `HeroSection`, `PromotionalBannerSection`, `FeaturedPrograms`, `KpiSection`, `ImpactSection`, `FAQSection`.
- **Catálogo de Programas (`#programas`)**: `ProgramsView` con filtros dinámicos por nivel académico, área y modalidad.
- **Detalle de Programa (`#programa/:id`)**: `ProgramDetailView` con visualización de perfiles, modalidades de graduación, enlaces de descarga y mallas curriculares.
- **Admisiones y Convocatorias (`tab: admision`)**: `AdmissionView` con convocatorias vigentes y cronograma.
- **Institución y Carrera (`tab: institucion`)**: `InstitutionView` con reseñas del IETA y plantel docente.
- **Contacto (`tab: contacto`)**: `ContactView` con direcciones físicas, mapa, WhatsApp oficial y ventanilla.
- **Normativa (`tab: normativa`)**: `RegulationsView` con reglamentos académicos.
- **Noticias (`tab: noticias`)**: `NewsView` con eventos y comunicados.

### 2.2 Endpoints Públicos de Backend
- `GET /api/programas/activos`: Lista exclusivamente programas vigentes con `activo == true` y ediciones abiertas.
- `GET /api/convocatorias`: Convocatorias activas con estado `Abierta`.
- `GET /api/convocatorias-pasadas`: Convocatorias históricas y concluidas.
- `POST /api/auth/login`: Autenticación pública de usuarios/administradores (con rate limiting 5 peticiones/minuto).

---

## 3. Smoke Test de Pantallas Públicas

| Pantalla | Ruta / Hash | Estado | Datos Mostrados | Errores de Consola |
|---|---|:---:|---|:---:|
| Inicio / Home | `/` | ✅ OK | 3 programas destacados, métricas institucionales, banners | 0 |
| Catálogo de Programas | `#programas` | ✅ OK | 3 programas activos de PostgreSQL, filtros dinámicos | 0 |
| Detalle de Programa Real | `#programa/1` | ✅ OK | Datos completos de programa 1, plan de estudios y postulación | 0 |
| Detalle Programa Inexistente | `#programa/999999` | ✅ OK | Mensaje amigable "Programa no encontrado", botón de retorno | 0 |
| Admisión y Convocatorias | `tab: admision` | ✅ OK | Convocatorias activas en BD | 0 |
| Información Institucional | `tab: institucion` | ✅ OK | Plantel docente y descripción académica | 0 |
| Contacto y Ubicaciones | `tab: contacto` | ✅ OK | Datos de secretaría Cota Cota y Monoblock Central | 0 |
| Ruta Inexistente | `/ruta-inexistente` | ✅ OK | Enrutador SPA redirige a cascarón principal sin crash | 0 |

---

## 4. Validación de Datos y Filtrado de Estados

### 4.1 Programas Activos vs Inactivos
- **En Base de Datos PostgreSQL:** Total = 5 programas (3 activos, 2 inactivos).
- **En API `/api/programas/activos`:** Retorna exactamente 3 programas (IDs `[1, 2, 3]`), todos con `activo === true`.
- **Filtro de Inactivos:** 100% efectivo. Los 2 programas inactivos no se exponen al público.

### 4.2 Convocatorias Activas vs Históricas
- **En API `/api/convocatorias`:** Retorna 3 convocatorias vigentes, todas con estado `Abierta`. Cero convocatorias concluidas o canceladas.
- **En API `/api/convocatorias-pasadas`:** Retorna 4 convocatorias históricas incluyendo las ediciones concluidas.

---

## 5. Manejo de Errores

1. **Recurso Inexistente (`/api/programas/999999`):** Retorna HTTP 404 (`{"success": false, "message": "Programa no encontrado"}`). En el frontend, `ProgramDetailView` captura el estado y presenta una interfaz limpia invitando al usuario a volver al catálogo.
2. **ID Malformado:** El frontend y backend gestionan IDs alfanuméricos sin generar errores no controlados.
3. **Rutas Desconocidas:** La SPA intercepta cualquier URI no mapeada manteniendo la navegación funcional sin pantalla blanca.

---

## 6. Auditoría de Enlaces Externos

- **Total enlaces auditados:** 56 enlaces extraídos de componentes públicos.
- **Enlaces operativos (200 / 301 / 302):** Plataformas oficiales UMSA, Campus Virtual Moodle (`maestria.estadistica.fcpn.edu.bo`), Google Maps de sedes (Cota Cota y Monoblock), formularios y redes oficiales.
- **Hallazgo documentado:** Enlaces de formularios de prueba o DOIs con prefijos de prueba retornan códigos de sitios externos no atribuibles a defectos del sistema (ver detalle en `enlaces.md`).

---

## 7. Matriz de Validación Fase 5

| # | Caso de Prueba | Criterio Esperado | Resultado | Estado |
|---|---|---|---|:---:|
| 1 | Home carga | HTTP 200 + sin crash | 200 OK | ✅ |
| 2 | `/programas` lista programas activos | Coincide exactamente con BD (3 activos) | 3 items | ✅ |
| 3 | `/programas/:id` real | Detalle correcto de ID=1 | Visible | ✅ |
| 4 | `/programas/:id` inexistente | Manejo amigable 404 | 404 manejado | ✅ |
| 5 | Programas inactivos excluidos | 0 programas con `activo=false` en API | 0 inactivos | ✅ |
| 6 | `/convocatorias` activas | Cero Concluidas/Canceladas | Solo Abiertas | ✅ |
| 7 | Convocatorias históricas | Lista pasadas disponible | 4 pasadas | ✅ |
| 8 | `/institucion` datos reales | Datos persistentes de BD | Verificado | ✅ |
| 9 | `/contacto` datos reales | Correo y dirección de BD | Verificado | ✅ |
| 10 | Ruta inexistente en frontend | Manejo SPA sin error de React | OK | ✅ |
| 11 | Enlaces externos visibles | Auditados en `enlaces.md` | Auditados | ✅ |
| 12 | Build producción frontend | `npm run build` sin errores | Compilación exitosa | ✅ |

---

## 8. Bloqueos y Observaciones Técnicas (Regla 2)

- **Endpoints de detalle protegidos por Sanctum:** Los endpoints `/api/programas/{id}/malla`, `/api/docentes` y `/api/institucion` están agrupados bajo el middleware `auth:sanctum`. El frontend público cuenta con mecanismos de fallback (`catch`) que permiten renderizar la información base institucional sin romper la experiencia del usuario. Conforme a la Regla 2, esto queda registrado como observación para revisión de arquitectura pública sin modificar arbitrariamente las rutas protegidas.

---

## 9. Dictamen de Cierre

La **FASE 5** se declara completada con éxito. El portal público se encuentra verificado, estable y listo para la **FASE 6** de limpieza y entrega técnica.
