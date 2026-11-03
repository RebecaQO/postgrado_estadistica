# ESPECIFICACIÓN INTEGRAL DE DESARROLLO: PLATAFORMA DE POSGRADO EN ESTADÍSTICA (UMSA)

Documento maestro para la arquitectura de software, experiencia de usuario (UX), diseño de interfaz (UI) y flujos operativos adaptados a la Carrera de Estadística de la Universidad Mayor de San Andrés (Facultad de Ciencias Puras y Naturales - FCPN), Campus Universitario de Cota Cota / Monoblock Central, La Paz, Bolivia.

---

## 1. CONFIGURACIÓN DEL SISTEMA DE DISEÑO (DESIGN TOKENS & ESTILOS)

```css
:root {
  /* Fondos Institucionales */
  --color-bg-primary: #0a1424;        /* Azul medianoche institucional */
  --color-bg-secondary: #0d1b30;      /* Elevación para tarjetas y menús */
  --color-bg-gradient-end: #0f223f;   /* Remate de gradiente */

  /* Acentos y Acciones (Call to Action) */
  --color-accent-orange: #f2681c;      /* Acento principal de acción */
  --color-accent-orange-hover: #d85712;
  --color-accent-orange-subtle: rgba(242, 104, 28, 0.15);

  /* Jerarquía de Texto */
  --color-text-main: #ffffff;
  --color-text-muted: #94a3b8;
  --color-text-subtle: #64748b;

  /* Glassmorphism y Bordes Translúcidos */
  --color-glass-bg: rgba(255, 255, 255, 0.05);
  --color-glass-bg-hover: rgba(255, 255, 255, 0.09);
  --color-glass-border: rgba(255, 255, 255, 0.12);
  --color-glass-border-focus: rgba(242, 104, 28, 0.5);

  /* Semántica y Estados Operativos */
  --color-status-success: #10b981;    /* Admitido / Pagado / Habilitado */
  --color-status-warning: #f59e0b;    /* En Revisión / Observado */
  --color-status-danger: #ef4444;     /* No Admitido / Vencido */
  --color-status-info: #3b82f6;       /* Convocatoria Abierta */
}

## 2. ARQUITECTURA DE PÁGINAS, PESTAÑAS Y FLUJOS FUNCIONALES
                    [ PLATAFORMA POSGRADO ESTADÍSTICA UMSA ]
                                       |
    +------------------+---------------+----------------+------------------+
    |                  |                                |                  |
[ BARRA SUPERIOR ]  [ NAVEGACIÓN PRINCIPAL ]      [ ACCESO / LOGIN ]   [ FOOTER GLOBAL ]
- Convocatoria CEUB - Inicio                       - Estudiantes        - Datos UMSA
- Contacto Directo  - Nuestra Institución          - Docentes           - Redes Sociales
                    - Programas (Maestrías/Dipl.)  - Administrativos    - Transparencia
                    - Admisión & Matrícula
                    - Procesos y Normativa
                    - Noticias y Tesis
                    - Ubicación y Campus
MÓDULO 1: HEADER INSTITUCIONAL Y NAVEGACIÓN
1. Top Bar (Franja Superior Institucional)
Texto informativo: "Convocatorias Académicas Gestión 2026 - Acreditación Nacional CEUB - FCPN UMSA".

Accesos rápidos: Teléfono de Secretaría de Posgrado, Enlace directo al Campus Virtual Moodle y Mesa de Ayuda por WhatsApp.

2. Barra de Navegación Principal (Glass Sticky Navbar)
Logotipo Dual:

Escudo oficial de la UMSA vectorizado (lado izquierdo).

Texto corporativo: Carrera de Estadística | Unidad de Posgrado e Investigación.

Menú de Enlaces Interactivos:

Cada enlace cuenta con un indicador de posición activa (border-bottom: 2px solid var(--color-accent-orange)).

Menús desplegables optimizados para mouse hover y tap en móviles con transiciones de desenfoque.

Botón de Acción Principal (CTA):

Botón en --color-accent-orange: [ Portal Académico / Iniciar Sesión ] que dispara el modal interactivo de autenticación.

MÓDULO 2: PESTAÑA "INICIO" (HERO & HUB INFORMATIVO)
+-------------------------------------------------------------------------+
| [HERO SECTION]                                                          |
|  Título: "Maestrías y Posgrados en Estadística y Ciencia de Datos"      |
|  Subtítulo: Investigación rigurosa, modelamiento y toma de decisiones   |
|  [Buscador / Filtro Rápido de Programas]   [Botón: Postular Ahora]     |
+-------------------------------------------------------------------------+
| [MÉTRICAS Y LOGROS DE LA CARRERA (KPI Counters)]                         |
|  +40 Años de Trayectoria | 100% Docentes con Ph.D./M.Sc. | Conexión CEUB|
+-------------------------------------------------------------------------+
| [PROGRAMAS VIGENTES CON CONVOCATORIA ABIERTA (Cards con Glassmorphism)]  |
+-------------------------------------------------------------------------+
| [LÍNEAS DE INVESTIGACIÓN Y LABORATORIOS COMPUTACIONALES (R / Python)]   |
+-------------------------------------------------------------------------+
| [CALENDARIO DE ADMISIONES Y EVENTOS CIENTÍFICOS]                        |
+-------------------------------------------------------------------------+
Elementos Clave de la Sección:
Filtro de Exploración Rápida:

Selectores interactivos: [Nivel: Maestrías / Diplomados] + [Enfoque: Data Science, Bioestadística, Actuarial, Minería de Datos] + [Modalidad: Virtual / Semipresencial].

Tarjetas de Programas Destacados:

Ejemplo 1: Maestría en Estadística Aplicada y Ciencia de Datos (2 años, 4 semestres).

Ejemplo 2: Maestría en Bioestadística y Modelamiento Epidemiológico.

Ejemplo 3: Diplomado en Machine Learning y Modelos Estadísticos Avanzados.

Cada tarjeta incluye: Título, Código de Convocatoria, Duración en Créditos Académicos, Estado de Postulación y Botón [Ver Malla & Requisitos].

Sección de Laboratorios y Software:

Módulos informativos que destacan el entrenamiento en entornos de computación de alto rendimiento: R, Python, SAS, Stata, Julia y entornos de simulación estocástica.

MÓDULO 3: PESTAÑA "NUESTRA INSTITUCIÓN"
1. Sección: Área y Misión Académica
Enfoque Institucional: Formación de investigadores y profesionales de cuarto nivel con capacidad de modelar incertidumbre, formular inferencias válidas y liderar la toma de decisiones basada en datos para el desarrollo científico, social y productivo de Bolivia.

Acreditación: Reconocimiento bajo el Sistema de la Universidad Boliviana (CEUB) y convenios internacionales.

2. Sección: Reseña Histórica del Posgrado de Estadística UMSA
Línea de tiempo interactiva (Timeline) desde la fundación de la Carrera de Estadística en la Facultad de Ciencias Puras y Naturales hasta la consolidación de sus programas de maestría académica y profesionalizante.

3. Sección: Plantel Docente e Investigadores (Claustro)
Directorio Interactivo:

Tarjetas individuales con avatar, nombre, máximo grado académico alcanzado (Ph.D. / M.Sc.), universidad de procedencia y especialidad (ej. Inferencia Bayesiana, Series Temporales, Muestreo Complejo, Bioestadística).

Enlaces a perfiles públicos: ResearchGate, Google Scholar, ORCID y LinkedIn.

Botón para consultar las materias que dicta en la gestión actual.

MÓDULO 4: PESTAÑA "PROGRAMAS ACADÉMICOS"
Visualización dividida en dos sub-pestañas principales:

[ TODAS LAS OFERTAS ]   |   [ MAESTRÍAS (4 Semestres) ]   |   [ DIPLOMADOS (6 Meses) ]
Ficha Técnica Detallada por Programa (Ej. Maestría en Ciencia de Datos y Estadística):
Cabecera del Programa: Título oficial, resolución de Consejo Universitario, grado que otorga (Magíster Scientiarum), modalidad (Virtual/Híbrida con clases síncronas de fin de semana).

Pestaña 1 - Malla Curricular Modular:

Semestre I: Fundamentos Matemáticos para Estadística, Inferencia Estadística Avanzada, Programación Estadística con R/Python.

Semestre II: Modelos Lineales Generalizados, Aprendizaje Estadístico y Machine Learning, Muestreo Complejo.

Semestre III: Análisis Multivariante, Series Temporales y Pronósticos, Taller de Tesis I.

Semestre IV: Minería de Datos Masivos (Big Data), Estadística Bayesiana Computacional, Taller de Tesis II y Defensa de Grado.

Pestaña 2 - Perfil del Postulante y de Egreso:

Dirigido a: Licenciados en Estadística, Matemáticas, Informática, Economía, Ingenierías y áreas afines.

Competencias adquiridas: Formulación de modelos estocásticos, diseño de experimentos, arquitectura de pipelines de datos y producción científica.

Pestaña 3 - Modalidades de Titulación:

Tesis de Grado Académico.

Trabajo Dirigido / Proyecto de Grado de Posgrado.

Artículo Científico publicado en revista indexada (según reglamento FCPN).

Pestaña 4 - Inversión y Formas de Pago:

Desglose del costo de matrícula y colegiatura total en Bolivianos (BOB).

Simulador de Pagos:

Opción A: Pago al contado (con porcentaje de descuento institucional).

Opción B: Plan de pagos (Cuota inicial de matrícula + 10 a 18 cuotas mensuales programadas).

Métodos de depósito: Depósito en cuenta bancaria autorizada (Banco Unión / Sistema de Recaudación UMSA) y pagos por CPT / Código QR interoperable.

MÓDULO 5: PESTAÑA "ADMISIÓN Y MATRÍCULA"
1. Sub-sección: Proceso y Requisitos de Postulación
Requisitos Formales:

Fotocopia legalizada del Título en Provisión Nacional (Nivel Licenciatura).

Diploma Académico.

Cédula de Identidad vigente (con indicación de expedición en Bolivia o Pasaporte).

Certificado de Nacimiento computarizado.

Hoja de Vida documentada (formato estándar).

Carta de solicitud de admisión y carta de compromiso de cumplimiento reglamentario.

Boleta o comprobante de pago del derecho de postulación/inscripción.

2. Sub-sección: Formulario Digital de Postulación (Wizard Interactivo)
[Paso 1: Datos Personales] 
  -> Nombre, Apellidos, C.I. + Extensión, Teléfono, Correo, Ciudad.
[Paso 2: Formación Académica] 
  -> Universidad de Origen, Carrera, Año de Titulación, Número de Registro.
[Paso 3: Carga de Documentación] 
  -> Subida de PDFs individuales (Máx 5MB por archivo) con validación inmediata.
[Paso 4: Modalidad de Pago Seleccionada] 
  -> Contado / Plan en Cuotas / Solicitud de Beca Funcionario-Docente.
[Paso 5: Resumen y Emisión de Ticket] 
  -> Generación de Código Único de Postulante (ej. `UMSA-EST-2026-0842`) con comprobante descargable.
3. Sub-sección: Consulta de Resultados de Admisión
Buscador Directo: Campo de texto para ingresar C.I. o Código Único.

Panel de Estado Dinámico:

Estado: "En Revisión Documental": El comité académico está evaluando los requisitos y méritos.

Estado: "Observado": Muestra lista de observaciones (ej. "Falta legalización de Diploma Académico") con botón habilitado para volver a subir el archivo corregido.

Estado: "Habilitado / Admitido": Muestra la Carta de Aceptación oficial en PDF con firma digital y el botón para proceder a la generación de matrícula y credenciales del campus.

MÓDULO 6: PESTAÑA "PROCESOS, DOCUMENTACIÓN Y REGLAMENTOS"
Repositorio de Documentos Descargables (PDF):

Reglamento General de Estudios de Posgrado del CEUB.

Reglamento Interno de Posgrado de la FCPN - UMSA.

Guía y plantilla oficial en LaTeX/Word para la elaboración de Tesis de Maestría.

Calendario de trámites para obtención del Título de Magíster / Diplomado.

Procedimiento de convalidación para estudiantes con títulos extranjeros (Apostilla de La Haya y homologación ante el Vicerrectorado UMSA).

MÓDULO 7: PESTAÑA "NOTICIAS Y DEFENSAS DE TESIS"
Feed Dinámico:

Convocatorias a defensas públicas de tesis de maestría (con fecha, hora, tribunal evaluador y enlace a transmisión por Zoom/YouTube Live).

Seminarios, workshops y conferencias organizadas por el Instituto de Investigaciones Estadísticas.

Publicaciones de artículos y papers de estudiantes y docentes en revistas internacionales.

MÓDULO 8: PESTAÑA "UBICACIÓN Y CONTACTO"
Mapa Interactivo: Ubicación del Campus Universitario de Cota Cota (Calle 27 de Cota Cota, Edificio de la FCPN / Carrera de Estadística) y Oficina de Enlace en el Monoblock Central (Av. Villazón, La Paz).

Datos de Contacto Directo:

Teléfonos fijos de secretaría de posgrado.

Línea de WhatsApp para atención de postulantes.

Correo electrónico institucional oficial (posgrado.estadistica@umsa.bo o equivalente).

Horarios de atención administrativa: Lunes a Viernes (08:30 a 16:30).

MÓDULO 9: MODAL / PORTAL DE LOGIN MULTIRROL
Un único botón en la barra superior despliega el acceso unificado con 3 pestañas:

+-------------------------------------------------------------+
|               ACCESO A LA PLATAFORMA DE POSGRADO            |
|   [ ESTUDIANTE ]      |    [ DOCENTE ]    |   [ ADMIN ]     |
+-------------------------------------------------------------+
|  Correo Institucional / C.I.:                               |
|  [ usuario@fcpn.edu.bo                                    ] |
|  Contraseña:                                                |
|  [ •••••••••••••••••                                      ] |
|                                                             |
|  [ Recordar sesión ]                 [ ¿Olvidó su clave? ]  |
|                                                             |
|  [ BOTÓN CTA: INGRESAR AL PANEL CORRESPONDIENTE ]           |
+-------------------------------------------------------------+
Funcionalidades por Rol:
Rol Estudiante:

Visualizar asignaturas inscritas y calificaciones de módulos concluidos.

Estado de cuenta de pagos (cuotas canceladas, cuotas pendientes, generación de CPT).

Carga de avances de tesis y asignación de tutor.

Rol Docente:

Registro de calificaciones por módulo y actas de notas.

Gestión de asistencia en sesiones síncronas.

Repositorio de material didáctico y guías de laboratorio.

Rol Administrador (Backoffice del Posgrado):

Dashboard de Métricas: Número de postulantes por programa, porcentaje de admisión, control de recaudación por cuotas y matrículas.

Gestión de Postulaciones: Tabla interactiva para revisar documentos PDF de cada aspirante, cambiar estados (Aprobar, Observar, Rechazar) y enviar avisos automatizados.

Configuración Académica: Habilitación/cierre de nuevas convocatorias, edición de cupos y asignación de docentes titulares a cada módulo.

MÓDULO 10: PIE DE PÁGINA (FOOTER COMPLETO)
+----------------------------------------------------------------------------------------------------+
| UNIVERSIDAD MAYOR DE SAN ANDRÉS                 ENLACES ACADÉMICOS             CONTACTO            |
| Facultad de Ciencias Puras y Naturales          - Estatuto CEUB                Campus Cota Cota    |
| Carrera de Estadística - Unidad de Posgrado     - Campus Virtual Moodle        Calle 27, La Paz    |
| La Paz - Bolivia                                - Repositorio Tesis UMSA       Tel: +591 (2) 279...|
|                                                 - Biblioteca Central           posgrado@umsa.bo    |
+----------------------------------------------------------------------------------------------------+
| CONECTIVIDAD: [Facebook] [YouTube] [LinkedIn] [WhatsApp] | BOLETÍN: [ Ingrese su correo ] [Suscribir]|
+----------------------------------------------------------------------------------------------------+
| © 2026 Posgrado en Estadística - UMSA | Todos los derechos reservados | Portal de Transparencia    |
+----------------------------------------------------------------------------------------------------+
3. ESPECIFICACIÓN DE ESTADOS Y COMPONENTES EN REACT
Para asegurar que el prototipo sea completamente funcional sin backend inicial, la arquitectura de componentes debe manejar datos estructurados simulados (mock data):

programsData.js: Arreglo de objetos con programas, mallas por semestre, docentes asignados y costos detallados.

facultyData.js: Directorio completo de docentes con publicaciones y biografías.

applicantsStore.js: Estado reactivo (vía Context API o useState) que permita registrar un postulante desde el formulario del Paso 1 al 5 y verlo reflejado inmediatamente en la tabla del panel de Administrador y en la Consulta de Resultados por C.I.

authStore.js: Manejo de sesión simulada para alternar entre las vistas de Estudiante, Docente y Administrador con interfaz diferenciada.