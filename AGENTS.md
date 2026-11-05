ROL: Senior Frontend Engineer con foco en integración API, validación de persistencia y UX administrativa.
TAREA: Implementar tres mejoras concretas en el portal de administración de POS_EST sin alterar el sistema de diseño existente ni la estructura visual ya definida.

CONTEXTO

Proyecto: ~/proyectos/POS_EST/
Frontend: React + Vite + apiJson unificado
Backend: Laravel + Sanctum + PostgreSQL (Sail)
Sistema visual: ya definido en los archivos CSS existentes (variables.css, structural-system.css, components design system, admin portal layout). No se toca.
URLs: http://localhost:5173 (front), http://localhost/api/* (back)
Token: sessionStorage.getItem('posgrado_umsa_token')
Cliente HTTP: src/utils/api.js, función apiJson()

PRECONDICIÓN

cd ~/proyectos/POS_EST/backend && ./vendor/bin/sail ps
# Requerido: laravel.test + pgsql + frontend healthy
cd ~/proyectos/POS_EST && git status
# Requerido: limpio
git checkout -b feat/admin-inline-flows

ALCANCE EXACTO (los tres requerimientos)

REQUERIMIENTO 1 — Eliminar pantallas y modales flotantes en el portal admin

Todos los flujos del portal administrativo deben ocurrir en la MISMA página:

- Listar cursos: ya ocurre en la página. Mantener.
- Crear curso: en lugar de abrir un modal centrado o navegar a otra ruta, mostrar un panel de formulario inline debajo o al lado de la tabla, en la misma vista, expandible y colapsable.
- Editar curso: mismo patrón. Al pulsar editar en una fila, expandir el formulario inline debajo de la fila o al lado derecho, sin modal.
- Ver detalle: expandir una fila mostrando detalles en el mismo lugar, no en pantalla nueva.
- Confirmaciones de acción destructiva: sí se permite un modal pequeño de confirmación. Ese es el único modal permitido, porque interrumpe intencionalmente.
- Mensajes de éxito o error: usar el sistema de toast ya existente, no modal.

Implementación técnica:

En cada panel (Programas, Edición, Materias, Docentes, Usuarios, Defensas, Carrera/IETA):

- Reemplazar cualquier uso de modal centrado tipo `<Modal>`, `modal-overlay`, `modal-content` para formularios por un contenedor inline.
- El contenedor inline usa un patrón de acordeón o panel expandible:

  <div className="adm-inline-editor">
    <div className="adm-inline-editor-header" onClick={toggle}>
      <h3>Nuevo curso</h3>
      <ChevronIcon rotating={isOpen} />
    </div>
    {isOpen && (
      <div className="adm-inline-editor-body">
        <form>...</form>
      </div>
    )}
  </div>

- Se añade este bloque CSS a la hoja de estilos del admin (respetando tokens existentes, sin colores nuevos):

  .adm-inline-editor {
    background: var(--adm-surface);
    border: 1px solid var(--adm-border);
    border-radius: var(--adm-radius);
    margin-bottom: 16px;
    overflow: hidden;
    transition: box-shadow var(--adm-transition);
  }
  .adm-inline-editor-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
    cursor: pointer;
    user-select: none;
    background: var(--adm-bg);
    border-bottom: 1px solid transparent;
    transition: background var(--adm-transition);
  }
  .adm-inline-editor-header:hover {
    background: var(--adm-brand-light);
  }
  .adm-inline-editor.open .adm-inline-editor-header {
    border-bottom-color: var(--adm-border);
    background: var(--adm-brand-light);
  }
  .adm-inline-editor-title {
    font-size: 14px;
    font-weight: 700;
    color: var(--adm-text);
    margin: 0;
  }
  .adm-inline-editor-body {
    padding: 20px 18px;
    animation: fadeIn 0.2s ease-out;
  }
  .adm-inline-editor-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--adm-border);
  }

- Reemplazar el botón "Nuevo curso" que abría modal por:

  <button className="adm-btn adm-btn-primary" onClick={() => setEditorOpen(true)}>
    Nuevo curso
  </button>
  {editorOpen && <InlineEditor modo="crear" onSave={guardar} onCancel={() => setEditorOpen(false)} />}

- Reemplazar el editar de la fila por: al pulsar editar, se abre el InlineEditor encima de la tabla o se expande debajo de la fila con los datos precargados.
- Reemplazar el ver detalle por un panel expandible inline, no por modal.

Regla de cierre para Requerimiento 1: en el portal admin no debe quedar ningún modal centrado de formulario. Solo se permite modal pequeño de confirmación de operación destructiva (eliminar, desactivar).

REQUERIMIENTO 2 — Validar creación de cursos en BD y llamadas a la API

Objetivo: confirmar con evidencia que un curso creado desde el frontend se guarda en PostgreSQL, se puede consultar por API y persiste tras recargar.

Implementación:

2.1 Verificar el endpoint de creación

Antes de tocar el frontend, confirmar que el backend acepta la creación:

- Abrir http://localhost/api/documentation o revisar backend/routes/api.php.
- Identificar el endpoint de cursos (o programas, según nomenclatura del proyecto). Ejemplo: POST /api/programas.
- Verificar en el controlador que:
  - Acepta los campos que el formulario envía.
  - Aplica validación (FormRequest con reglas).
  - Devuelve 201 con el recurso creado.
  - Devuelve 422 con errores claros si la validación falla.

2.2 Probar el endpoint con curl antes de tocar el frontend

Obtener token:

curl -s -X POST http://localhost/api/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"admin@umsa.bo","password":"ADMIN_PASS"}' \
  -o /tmp/login.json

TOKEN=$(grep -oE '"token":"[^"]+"' /tmp/login.json | cut -d'"' -f4)

Crear un curso de prueba:

curl -s -X POST http://localhost/api/programas \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"nombre":"Curso prueba integracion","tipo":"maestria","activo":true}' \
  -w "\nHTTP %{http_code}\n"

Esperado: 201 y body con el id del nuevo registro.

Verificar en la base de datos que existe:

./vendor/bin/sail exec -T pgsql psql -U portal -d portal -c \
  "SELECT id_programa, nombre, activo, created_at FROM programa_postgrado ORDER BY id_programa DESC LIMIT 3;"

Esperado: el curso creado aparece en la lista.

Verificar por API que se puede leer:

curl -s -H "Authorization: Bearer $TOKEN" -H "Accept: application/json" \
  http://localhost/api/programas -o /tmp/listado.json

grep -c "Curso prueba integracion" /tmp/listado.json

Esperado: 1 o más coincidencias.

Si alguno de estos pasos falla, se detiene la implementación y se reporta como bloqueo. No se avanza al frontend hasta que el backend confirme creación real y persistencia.

2.3 Validación desde el frontend

Una vez confirmado el backend:

- En el formulario inline de crear curso, al pulsar guardar:
  - Llamar a apiJson con método POST.
  - Manejar 201: mostrar toast de éxito, cerrar editor inline, recargar la tabla con el nuevo registro.
  - Manejar 422: mostrar errores de validación debajo de cada campo afectado, no cerrar el editor.
  - Manejar 401: redirigir a login.
  - Manejar 403: mostrar toast "Sin permisos".
  - Manejar 409: mostrar toast "Ya existe un registro con esos datos".
  - Manejar 500: mostrar toast de error genérico, mantener editor abierto.

- Tras un 201, recargar la página (F5) y verificar que el curso sigue apareciendo. Esto prueba persistencia real.

2.4 Evidencia obligatoria del Requerimiento 2

Guardar en evidencias/admin-inline-<fecha>/integracion/:

- create-http-201.json (respuesta del backend al crear)
- db-check.txt (salida del SELECT en PostgreSQL)
- listado-api.json (respuesta del listado tras crear)
- frontend-create.png (formulario antes de guardar)
- frontend-after-save.png (tabla con el nuevo curso)
- frontend-reload.png (tabla tras F5, curso persistente)

REQUERIMIENTO 3 — Prioridad visual a cursos habilitados (3 primeros destacados)

Objetivo: los cursos con activo = true aparecen primero en la tabla y los 3 primeros se destacan visualmente con un estilo distintivo que respete el sistema de diseño.

Implementación:

3.1 Orden en el backend (preferido)

El listado de cursos debe venir ordenado desde el backend para que la prioridad sea consistente en cualquier consumidor.

Opción preferida: modificar el controlador del listado (index) para ordenar:

$query->orderByDesc('activo')->orderByDesc('created_at');

Esto pone primero los activos, y dentro de ellos los más recientes. Si ya hay un orden definido por el equipo, respetarlo y solo añadir el primer criterio (activo).

Verificar:

curl -s -H "Authorization: Bearer $TOKEN" -H "Accept: application/json" \
  http://localhost/api/programas | grep -E '"activo":(true|false)' | head -10

Esperado: primeros registros con activo: true.

3.2 Orden en el frontend (defensa en profundidad)

Independientemente del backend, al cargar la lista en el panel, ordenar el array antes de renderizar:

const ordenados = [...cursos].sort((a, b) => {
  if (a.activo !== b.activo) return b.activo - a.activo;
  return new Date(b.created_at) - new Date(a.created_at);
});

Esto garantiza el orden incluso si el backend no lo aplica.

3.3 Destacar los 3 primeros cursos habilitados

En la tabla, los 3 primeros registros con activo = true reciben una clase adicional que los hace visualmente prioritarios:

{ordenados.map((curso, idx) => {
  const esDestacado = curso.activo && idx < 3;
  return (
    <tr key={curso.id} className={esDestacado ? 'adm-row-featured' : ''}>
      ...
    </tr>
  );
})}

Añadir esta clase al CSS existente, respetando tokens:

.adm-row-featured td {
  background: linear-gradient(90deg, var(--adm-brand-light) 0%, transparent 60%);
  border-left: 3px solid var(--adm-brand);
  font-weight: 600;
}

.adm-row-featured:hover td {
  background: linear-gradient(90deg, var(--adm-brand-light) 0%, var(--adm-bg) 60%);
}

Adicionalmente, añadir un badge "Destacado" en la primera celda del curso:

{esDestacado && <span className="adm-badge adm-badge-featured">Destacado</span>}

.adm-badge-featured {
  background: var(--adm-brand);
  color: white;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  margin-left: 8px;
  font-weight: 700;
}

3.4 Mensaje de prioridad a cursos habilitados

Añadir en la parte superior de la tabla, dentro del toolbar, un aviso informativo sutil que explique el orden:

<div className="adm-table-notice">
  <InfoIcon size={14} />
  Los cursos habilitados se muestran primero. Los 3 primeros aparecen destacados.
</div>

.adm-table-notice {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: var(--adm-brand-light);
  border: 1px solid var(--adm-border);
  border-radius: var(--adm-radius);
  font-size: 12.5px;
  color: var(--adm-text-2);
  margin-bottom: 12px;
}

Este aviso no es un modal, no es una alerta intrusiva. Es una nota inline informativa.

CRITERIOS DE ACEPTACIÓN (obligatorios)

Requerimiento 1:
- [ ] 0 modales centrados de formulario en el portal admin
- [ ] Solo queda modal de confirmación para operaciones destructivas
- [ ] Crear curso ocurre en editor inline en la misma página
- [ ] Editar curso ocurre inline
- [ ] Ver detalle ocurre inline o expandiendo la fila
- [ ] No hay navegación a otra ruta para crear o editar
- [ ] Toast para éxito/error se mantiene
- [ ] Captura de pantalla de cada panel mostrando el flujo inline

Requerimiento 2:
- [ ] curl POST devuelve 201
- [ ] SELECT en PostgreSQL muestra el curso creado
- [ ] curl GET devuelve el curso en el listado
- [ ] Frontend muestra toast de éxito
- [ ] Frontend refresca la tabla con el nuevo curso
- [ ] Tras F5 el curso persiste
- [ ] Errores 422 se muestran campo por campo
- [ ] Errores 401, 403, 409, 500 manejados con mensajes claros
- [ ] Evidencia de los 6 archivos listados en 2.4

Requerimiento 3:
- [ ] Backend ordena por activo DESC, created_at DESC (o similar)
- [ ] Frontend ordena por activo y created_at como defensa
- [ ] Los 3 primeros activos se destacan visualmente con borde izquierdo y fondo suave
- [ ] Badge "Destacado" visible en filas destacadas
- [ ] Nota informativa en el toolbar explica el orden
- [ ] Los inactivos siguen visibles pero después de los activos
- [ ] No se rompe la paginación ni la búsqueda

PROHIBICIONES

1. No cambiar el sistema de diseño ni los archivos CSS base. Solo añadir clases nuevas al CSS del admin.
2. No usar colores fuera de los tokens existentes (--adm-*, --color-*).
3. No usar modales centrados para formularios en admin.
4. No usar etiquetas decorativas ruidosas ni separadores con símbolos.
5. No cambiar endpoints ni payloads.
6. No tocar el portal público.
7. No instalar librerías nuevas.
8. No dejar console.log de debug en producción.
9. No romper los módulos existentes. Smoke test obligatorio.
10. No declarar el requerimiento 2 como cumplido sin la evidencia de BD y de persistencia.

ORDEN DE EJECUCIÓN

Fase A — Validar backend primero (Requerimiento 2, parte backend)
  1. Verificar endpoint de cursos.
  2. curl POST → 201.
  3. SELECT en PostgreSQL → curso existe.
  4. curl GET → curso aparece.
  5. Solo si los tres pasos pasan, continuar.

Fase B — Implementar Requerimiento 1 (eliminar pantallas flotantes)
  Panel por panel, del más simple al más complejo:
  Docentes, Mallas, Materias, Programas, Ediciones, Usuarios, Defensas, Carrera/IETA.
  Cada panel: reemplazar modal por inline editor, validar visualmente, commit atómico.

Fase C — Implementar Requerimiento 3 (prioridad de habilitados)
  1. Orden backend.
  2. Orden frontend (defensa).
  3. Destacar 3 primeros.
  4. Badge y nota informativa.
  5. Commit atómico.

Fase D — Validación cruzada
  1. Crear curso desde el formulario inline del frontend.
  2. Verificar en BD con SELECT.
  3. Verificar por API con curl GET.
  4. Recargar página → curso persiste.
  5. Verificar que los 3 primeros activos están destacados.
  6. Smoke test de los demás paneles.

REPORTE FINAL

Crear evidencias/admin-inline-<fecha>/reporte.md con:

RESUMEN POR REQUERIMIENTO

R1 — Eliminación de pantallas flotantes
- Paneles intervenidos: N
- Modales de formulario eliminados: N
- Inline editors creados: N
- Capturas por panel: enlazadas

R2 — Validación de creación en BD y API
- Endpoint probado: POST /api/programas (o el real)
- HTTP 201: sí/no
- SELECT PostgreSQL: sí/no
- curl GET muestra el curso: sí/no
- Frontend toast de éxito: sí/no
- Persistencia tras F5: sí/no
- Evidencias: archivos enlazados

R3 — Prioridad de habilitados
- Backend ordena: sí/no
- Frontend ordena: sí/no
- 3 primeros destacados: sí/no
- Badge Destacado: sí/no
- Nota informativa: sí/no
- Captura: enlazada

REGRESIONES
- Módulos que dejaron de funcionar: lista o ninguna
- Endpoints modificados sin querer: lista o ninguno

BLOQUEOS
- Lista o ninguno

ARCHIVOS MODIFICADOS
- Lista completa con propósito

COMMITS
- Hash y mensaje por cada uno

PRÓXIMO PASO
- Merge a main cuando el equipo apruebe
- Pasar a validación integral de Fase 6

REGLAS PARA EL AGENTE

1. Antes de tocar el frontend, valida el backend con curl y BD.
2. No declares una creación exitosa sin haber hecho el SELECT en PostgreSQL.
3. No declares persistencia sin haber recargado la página.
4. Un panel a la vez. Commit por panel.
5. Si un panel falla al pasar a inline y no puedes resolverlo sin alterar el diseño, revierte ese panel y reporta el bloqueo, pero continúa con los demás.
6. Si el endpoint de cursos requiere autenticación admin y no la tienes, detente y pide credenciales.
7. No inventes campos nuevos en el formulario. Usa los que ya existen en el modelo y en el controlador.
ROL: Senior Product Designer + Frontend Engineer especializado en diseño de sistemas administrativos responsivos, accesibilidad y usabilidad multi-dispositivo. Referentes: Linear, Stripe Dashboard, Vercel, Notion, GitHub, Figma, Framer, Raycast.

TAREA: Diseñar e implementar el sistema UI/UX responsive del frontend de POS_EST para que sea usable, legible y eficiente en computador, tablet, celular y otros dispositivos (pantallas plegables, pantallas grandes, orientación horizontal y vertical). Sin rehacer la identidad visual existente. Sin cambiar flujos funcionales. Solo definir reglas de comportamiento adaptativo, componentes y patrones de interacción consistentes.

CONTEXTO DEL PROYECTO

Proyecto: ~/proyectos/POS_EST/
Frontend: React + Vite + apiJson unificado
Backend: Laravel + Sanctum + PostgreSQL (Sail)
Sistema visual existente: variables.css, structural-system.css, components design system, admin portal layout (no se reemplaza, se extiende)
Paleta institucional: verde UMSA, azul acero, neutrales slate (mantener)
Tokens existentes: --adm-*, --color-*, --shadow-*, --radius-*, --space-*
Fuente: Plus Jakarta Sans (mantener)

PRECONDICIÓN

cd ~/proyectos/POS_EST && git status      # limpio
git checkout -b design/responsive-system
cd backend && ./vendor/bin/sail ps         # servicios healthy
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5173  # 200

FILOSOFÍA DE DISEÑO RESPONSIVE

1. Mobile-first real, no mobile-only. Cada componente se piensa primero en 360px y se expande con mejoras progresivas.
2. Adaptación por contenido, no por dispositivo. El layout se adapta al espacio disponible, no a una marca de teléfono.
3. Densidad progresiva. Celular: mucha densidad vertical, poca horizontal. Tablet: equilibrado. Desktop: densidad media con más información simultánea.
4. Touch-first en dispositivos táctiles. Áreas de toque mínimas de 44x44px en pantallas táctiles. En desktop, áreas de 32px son aceptables.
5. Legibilidad sobre estética. En pantallas pequeñas, el contenido manda. Nada de elementos decorativos que ocupen espacio útil.
6. Consistencia entre dispositivos. La misma acción debe existir en todos los dispositivos, aunque cambie la forma (menú lateral se convierte en drawer, tabla se convierte en cards).
7. Accesibilidad WCAG 2.1 AA en todos los breakpoints. Foco visible, contraste, navegación por teclado, aria-labels.
8. Performance percibida. Skeletons en lugar de spinners. Transiciones cortas (150-250ms). Sin animaciones que bloqueen.
9. Preferencia del usuario. Respetar `prefers-reduced-motion`, `prefers-color-scheme`, `prefers-contrast`.
10. Sin patrones frágiles. Nada de hover-only, nada de doble click, nada de scroll horizontal accidental en el body.

REFERENCIAS DE MARCAS (aplicables a POS_EST)

- Linear: navegación por teclado (Cmd+K), densidad compacta opcional, listas virtualizadas, micro-interacciones sutiles.
- Stripe Dashboard: tablas responsivas que se convierten en tarjetas en mobile, formularios inline sin modal, feedback inmediato.
- Vercel: sidebar colapsable en desktop, drawer en mobile, breadcrumb sticky, tabs horizontales scrollables.
- Notion: bloques apilables, drag-drop opcional, contenido legible con jerarquía clara, sidebar persistente.
- GitHub: tabla de datos con scroll horizontal contenido, filtros por columna, badges de estado, avatares compactos.
- Figma: panel de propiedades lateral en desktop, bottom-sheet en mobile, toolbars compactas con iconos.

Cada patrón de marca se aplica como referencia visual y de interacción, sin copiar la identidad visual. Los colores, tipografía y estilos de POS_EST se mantienen.

BREAKPOINTS DEFINIDOS

Definir una escala clara y aplicarla consistentemente. Todos los componentes usan estos breakpoints:

  xs: 360px  (móvil pequeño)
  sm: 480px  (móvil grande)
  md: 768px  (tablet vertical)
  lg: 1024px (tablet horizontal, laptop pequeña)
  xl: 1280px (desktop)
  2xl: 1536px (desktop grande, monitor 4K)

Reglas:
- Los media queries en CSS usan siempre min-width (mobile-first).
- Los componentes en JS usan un hook `useBreakpoint()` que devuelve uno de estos valores.
- Nunca usar valores mágicos fuera de la escala.

ADAPTACIÓN POR DISPOSITIVO

Computador (xl y 2xl, >= 1280px)
- Layout: sidebar fijo visible + topbar + contenido.
- Tablas: todas las columnas visibles, paginación, búsqueda inline, filtros por columna.
- Formularios: 2 o 3 columnas, labels arriba, validación inline.
- Modales: centrados con backdrop, máximo 720px de ancho.
- Acciones: toolbar superior sticky, botón principal a la derecha.
- Navegación: sidebar con secciones agrupadas, iconos + texto.
- Keyboard: Cmd+K para búsqueda global, Tab completo, Esc cierra.
- Densidad: media. Filas de tabla con padding 11px.

Laptop pequeña (lg, 1024 a 1279px)
- Igual que desktop pero:
  - Sidebar puede colapsar a iconos si el usuario lo pide.
  - Tablas: reducir columnas secundarias a tooltip.
  - Formularios: máximo 2 columnas.
- Sin pérdida de funcionalidad.

Tablet vertical (md, 768 a 1023px)
- Layout: sidebar se convierte en drawer lateral, oculto por defecto. Se abre con botón hamburguesa.
- Topbar: 56px, con logo, breadcrumb, avatar, botón hamburguesa.
- Tablas: scroll horizontal contenido dentro del contenedor, sin romper el layout. Opción: convertirse en cards por fila.
- Formularios: 1 columna, labels arriba.
- Modales: full-width con margen lateral 16px, altura máxima 90vh.
- Acciones: botones full-width dentro de formularios, botón primario arriba del listado.
- Touch: áreas de toque 44x44px en todos los botones.
- Orientación horizontal: layout vuelve a desktop si width >= 1024.

Tablet horizontal (lg, 1024+ en landscape)
- Igual que laptop pequeña.

Celular (xs y sm, 360 a 767px)
- Layout: sin sidebar visible. Navegación por drawer inferior (bottom-nav) o hamburguesa en topbar.
- Topbar: 52px, logo compacto, menú, avatar.
- Tablas: se convierten en lista de cards apiladas. Cada card muestra los campos clave. Detalles adicionales se expanden al toque.
  - Patrón recomendado: card por fila con título, subtítulo, badge de estado y acciones compactas.
  - Si la tabla tiene muchas columnas, mostrar solo las 3 principales en la card.
- Formularios: 1 columna, campos grandes, teclado numérico cuando aplica (input type correcto).
- Modales: pantalla completa (full-screen modal) con header sticky y footer sticky de acciones.
- Botones: full-width cuando son acciones principales.
- Densidad: alta. Padding de 12-14px. Espaciado vertical generoso entre bloques.
- Acciones destructivas: confirmación explícita con texto claro (no solo iconos).
- Touch: áreas mínimas 44x44px, separación 8px entre elementos táctiles.
- Navegación: bottom-nav con máximo 5 items, o drawer lateral deslizable.
- Orientación vertical recomendada para formularios largos.

Pantallas plegables (foldables) y otras
- Detectar con `window.matchMedia('(screen-spanning: single-fold-vertical)')` cuando el navegador lo soporte.
- Aplicar layout de 2 columnas si la pantalla está desplegada.
- Fallback: tratar como tablet si no hay soporte.
- Sin necesidad de detección dedicada si el diseño es responsive real.

Pantallas grandes (2xl, >= 1536px)
- Contenido centrado con max-width de 1400px para no estirar tablas.
- Sidebar puede quedar fijo y expandido.
- Aprovechar espacio para mostrar más columnas o KPIs.

COMPONENTES RESPONSIVE OBLIGATORIOS

Cada uno debe adaptarse según breakpoint. Crear o ajustar como componentes reutilizables.

1. ResponsiveTable
   - >= lg: tabla clásica con scroll horizontal contenido.
   - md: tabla con columnas reducidas, resto accesible por expandir fila.
   - < md: lista de cards. Cada card muestra: título, subtítulo, badge, acciones. Al tocar, se expande mostrando detalles completos.
   - Contrato: recibe `columns`, `rows`, `mobileCardRender(row)`, `mobileCardTitleKey`, `onRowTap`.

2. ResponsiveForm
   - >= lg: 2-3 columnas.
   - md: 1-2 columnas.
   - < md: 1 columna, full-width inputs, botones full-width.
   - Contrato: `fields` con `span: 1 | 2 | 3`, que se reduce en breakpoints menores.

3. ResponsiveModal / ResponsiveSheet
   - >= md: modal centrado, máximo 720px, backdrop con blur suave.
   - < md: bottom-sheet deslizable desde abajo, full-width, altura máxima 92vh, header sticky, footer sticky con acciones.
   - Contrato: usa un solo componente que cambia de presentación por breakpoint.

4. ResponsiveToolbar
   - >= lg: búsqueda + filtros + acciones en una línea.
   - md: búsqueda en línea, filtros en dropdown, acciones agrupadas.
   - < md: búsqueda full-width arriba, filtros como chips horizontales scrollables, acciones como botones compactos debajo.

5. ResponsiveSidebar
   - >= lg: fija visible, colapsable a iconos.
   - md: drawer lateral, abre con hamburguesa, backdrop oscuro, cierra al tocar fuera.
   - < md: drawer lateral full-height, mismo patrón.
   - Alternativa mobile recomendada: bottom-nav con 4-5 items principales y menú "más" para el resto.

6. ResponsivePageHeader
   - >= lg: título grande a la izquierda, acciones a la derecha, breadcrumb arriba.
   - md: título mediano, acciones debajo del título en una fila.
   - < md: título compacto, breadcrumb colapsable a un icono, acciones como icon-buttons o menú desplegable.

7. ResponsivePagination
   - >= md: números de página + anterior/siguiente + selector de tamaño.
   - < md: solo anterior/siguiente + indicador "1 de N". Sin números (ocupan demasiado).

8. ResponsiveKpiCards
   - >= lg: 4 columnas.
   - md: 2 columnas.
   - < md: 1 columna o 2 columnas compactas, sin subtítulos largos.

9. ResponsiveTabs
   - >= md: tabs horizontales fijos.
   - < md: tabs horizontales scrollables con indicador visual de scroll, o select nativo si son más de 5.

10. Toast
    - Desktop: esquina superior derecha, stack vertical.
    - Mobile: full-width en la parte superior, con swipe para cerrar.

11. EmptyState / ErrorState / LoadingSkeleton
    - Ajustar padding y tamaño de iconos por breakpoint. Mobile: iconos más pequeños, texto centrado, botón full-width.

12. DrawerInlineEditor (de la fase anterior)
    - >= md: sidebar lateral deslizante de 480px.
    - < md: bottom-sheet full-height.

PATRONES DE INTERACCIÓN

Navegación
- Desktop: sidebar persistente, breadcrumb visible.
- Tablet: drawer + breadcrumb compacto.
- Mobile: bottom-nav o drawer + breadcrumb colapsable en header.

Búsqueda y filtros
- Desktop: input de búsqueda visible + filtros en dropdowns.
- Tablet: input visible, filtros colapsados.
- Mobile: input colapsable (icono de lupa), filtros como bottom-sheet.

Acciones principales
- Desktop: botón arriba a la derecha.
- Tablet: botón arriba a la derecha, tamaño estándar.
- Mobile: botón flotante o botón full-width arriba del listado.

Edición inline
- Desktop: panel lateral derecho fijo (480px) sin overlay.
- Tablet: panel lateral con overlay suave.
- Mobile: bottom-sheet full-height.

Confirmación de acción destructiva
- Desktop: modal centrado pequeño.
- Tablet: modal centrado.
- Mobile: bottom-sheet o modal full-screen con texto claro.

Listados largos
- Desktop: paginación + scroll.
- Tablet: paginación + scroll.
- Mobile: scroll infinito o "cargar más", nunca paginación con números.

Formularios largos
- Todos: dividir en secciones con títulos. En mobile, cada sección se puede colapsar.

Feedback de acción
- Todos: toast (success, error, warning, info). Posición adaptativa por breakpoint.

ACCESIBILIDAD MULTI-DISPOSITIVO

- Tamaños mínimos de toque: 44x44px en cualquier pantalla táctil detectada (`(pointer: coarse)`).
- Foco visible: outline de 2px, offset 2px, color primario, en todos los interactivos.
- Navegación por teclado: Tab funcional en desktop y tablet con teclado externo. Cmd+K abre búsqueda global en desktop.
- Zoom: no bloquear zoom en viewport meta.
- Contraste: AA en todos los breakpoints.
- Lectura: tamaños de fuente mínimos 14px en mobile (nunca 12px como texto principal).
- Prefers-reduced-motion: deshabilitar animaciones no esenciales.
- Prefers-color-scheme: no obligatorio en esta fase, pero preparar tokens con variantes claro/oscuro.

ORIENTACIÓN Y PANTALLAS ESPECIALES

Orientación horizontal en mobile
- Layout vuelve a tablet si width >= 768.
- Topbar reducida, sidebar oculta, más ancho de contenido.

Plegables (foldables)
- Detectar `screen-spanning` si está soportado.
- En desplegado: layout 2 columnas similar a tablet horizontal.

Notches y safe areas
- Usar `env(safe-area-inset-*)` en headers y footers fijos para respetar el notch del dispositivo.

Teclado en pantalla
- En formularios, evitar que el teclado tape el campo activo. Scroll automático al foco.
- En iOS, `font-size >= 16px` en inputs para evitar zoom automático.

ESCALA TIPOGRÁFICA RESPONSIVE

Aplicar `clamp()` en todos los tamaños de texto principales:

  h1: clamp(1.75rem, 4vw, 3rem)
  h2: clamp(1.5rem, 3vw, 2.25rem)
  h3: clamp(1.25rem, 2.5vw, 1.75rem)
  h4: clamp(1.1rem, 1.8vw, 1.4rem)
  body: clamp(0.95rem, 1vw, 1rem)
  small: clamp(0.8rem, 0.9vw, 0.875rem)

En mobile: evitar textos menores a 14px en contenido principal. 12px solo para metadatos.

ESPACIADO RESPONSIVE

  Padding de página:
    < md: 16px
    md:    20px
    lg:    24px
    xl:    28px
    2xl:   32px

  Gap entre secciones:
    < md: 16px
    md:    20px
    lg:    24px
    xl:    28px

  Padding interno de cards:
    < md: 14px
    md:    16px
    lg:    20px

Usar variables CSS con clamp() para evitar media queries repetitivas:

  :root {
    --pad-page: clamp(16px, 3vw, 32px);
    --pad-card: clamp(14px, 2vw, 20px);
    --gap-section: clamp(16px, 2.5vw, 28px);
  }

IMPLEMENTACIÓN

Fase A — Auditoría responsive del estado actual

Para cada pantalla del portal admin y del portal público:
- Capturar screenshot en 360, 480, 768, 1024, 1280, 1536 (usar DevTools responsive).
- Documentar problemas: overflow horizontal, textos cortados, botones superpuestos, tablas rotas.
- Guardar en evidencias/responsive-<fecha>/auditoria/<pantalla>/.

Resultado: tabla de problemas por pantalla y por breakpoint.

Fase B — Definir tokens responsive

- Añadir a variables.css las variables con clamp() de padding, gap, tipografía.
- Añadir el hook `useBreakpoint()` en `frontend/src/hooks/useBreakpoint.js`.
- Añadir helper `useIsTouch()` que detecta `(pointer: coarse)`.
- Verificar que los media queries existentes usan min-width (o refactorizar).

Fase C — Crear componentes responsive

En `frontend/src/components/ui/` (respetando tokens y estilos existentes):

- ResponsiveTable.jsx + .css
- ResponsiveForm.jsx + .css
- ResponsiveModal.jsx (que renderiza Modal en >= md y BottomSheet en < md)
- ResponsiveToolbar.jsx
- ResponsiveSidebar.jsx
- ResponsivePageHeader.jsx
- ResponsivePagination.jsx
- ResponsiveKpiCards.jsx
- ResponsiveTabs.jsx
- Toast.jsx (adaptativo, ya existe probablemente)
- EmptyState.jsx, ErrorState.jsx, LoadingSkeleton.jsx (adaptativos, ya existen)

Cada componente documenta su comportamiento por breakpoint en un comentario al inicio.

Fase D — Migrar paneles uno por uno

Orden: Docentes, Mallas, Materias, Programas, Ediciones, Usuarios, Defensas, Carrera/IETA.

Por panel:
- Sustituir table por ResponsiveTable.
- Sustituir toolbar por ResponsiveToolbar.
- Sustituir modal de formulario por ResponsiveModal o DrawerInlineEditor.
- Verificar en 6 breakpoints: 360, 480, 768, 1024, 1280, 1536.
- Commit por panel.

Fase E — Portal público

Aplicar el mismo criterio con variantes visuales (más aire, tipografía grande, navegación superior).

Fase F — Validación cruzada

Smoke test en cada dispositivo real si es posible:
- Celular Android / iPhone.
- Tablet iPad / Android.
- Desktop 1366x768, 1920x1080, 2560x1440.
- Pantalla plegable si hay acceso.
- Navegación por teclado.
- Zoom 200% sin romper layout.
- prefers-reduced-motion activado.

CRITERIOS DE ACEPTACIÓN

Por pantalla y por breakpoint (360, 480, 768, 1024, 1280, 1536):
- [ ] Sin overflow horizontal en el body
- [ ] Textos legibles (mínimo 14px en contenido)
- [ ] Botones con área mínima 44x44px en táctil
- [ ] Tablas legibles o convertidas en cards
- [ ] Formularios usables con teclado en pantalla
- [ ] Navegación accesible
- [ ] Foco visible en todos los interactivos
- [ ] Toast visible y adaptado
- [ ] Sin scroll horizontal dentro del body, solo dentro de contenedores específicos
- [ ] Sin textos cortados
- [ ] Sin botones superpuestos
- [ ] Sin imágenes deformadas

Globales:
- [ ] Todos los componentes usan tokens
- [ ] Todos los media queries usan min-width
- [ ] Todos los formularios respetan `font-size >= 16px` en mobile
- [ ] Toda pantalla pasa axe DevTools sin issues críticos
- [ ] prefers-reduced-motion respetado
- [ ] useBreakpoint() y useIsTouch() implementados y reutilizados
- [ ] 0 modales de formulario de pantalla completa en desktop
- [ ] 0 elementos ocultos por breakpoint sin alternativa de acceso

PROHIBICIONES

1. No cambiar identidad visual (colores, tipografía, logos).
2. No introducir librerías de UI nuevas.
3. No usar hover-only para acciones críticas.
4. No ocultar funcionalidad en mobile sin alternativa accesible.
5. No usar scroll horizontal en el body.
6. No bloquear zoom.
7. No usar `!important` fuera de casos justificados.
8. No crear breakpoints ad-hoc fuera de la escala definida.
9. No usar tamaños de texto menores a 12px en ningún caso.
10. No dejar código de debug (console.log, alert).

REFERENCIAS VISUALES APLICADAS POR MÓDULO

Los patrones de marca se aplican así:

Sidebar
- Referencia Linear y Vercel: secciones agrupadas, colapsable, estado activo claro.
- En tablet: drawer con backdrop.
- En mobile: bottom-nav o drawer.

Tablas
- Referencia Stripe y GitHub: header sticky, badge de estado, acciones al final de la fila.
- En mobile: cards apiladas con título, subtítulo, badge y acciones.

Formularios
- Referencia Stripe y Notion: labels arriba, validación inline, campos con foco visible.
- En mobile: 1 columna, inputs grandes, teclado numérico cuando aplica.

Modales y drawers
- Referencia Linear: modal centrado en desktop, bottom-sheet en mobile.
- Sin bloquear el flujo principal.

Tabs
- Referencia GitHub y Figma: tabs horizontales con scroll en mobile, no se rompen.

KPIs
- Referencia Stripe: números grandes, label pequeño, tendencia opcional.
- En mobile: cards compactas 2 columnas o 1 columna.

Búsqueda global
- Referencia Linear (Cmd+K): atajo de teclado en desktop, icono lupa en mobile.

Notificaciones
- Referencia Vercel: toast arriba a la derecha en desktop, full-width en mobile.

REPORTE FINAL

Crear evidencias/responsive-<fecha>/reporte.md:

RESUMEN
- Componentes responsive creados: N
- Paneles migrados: N
- Pantallas públicas migradas: N
- Breakpoints verificados: 6

POR PANTALLA
Tabla con: pantalla, estado en cada breakpoint (OK / problema), evidencia.

PROBLEMAS ENCONTRADOS Y RESUELTOS
Lista con: problema, causa, solución, archivos afectados.

PROBLEMAS PENDIENTES
Lista con: problema, causa, propuesta.

ACCESIBILIDAD
- axe DevTools: 0 críticos
- Teclado: OK
- Contraste: AA
- reduced-motion: OK

REFERENCIAS DE MARCA APLICADAS
- Linear: en qué pantallas se aplicó qué patrón
- Stripe: idem
- Vercel: idem
- Notion: idem
- GitHub: idem
- Figma: idem

REGRESIONES
- Lista o ninguna

BLOQUEOS
- Lista o ninguno

ARCHIVOS MODIFICADOS
- Lista completa

COMMITS
- Hash y mensaje por panel

PRÓXIMO PASO
- Merge cuando el equipo apruebe
- Integrar con Fase 6 de validación

ORDEN DE EJECUCIÓN

1. Fase A — Auditoría responsive de todas las pantallas.
2. Fase B — Tokens responsive y hooks.
3. Fase C — Componentes responsive.
4. Fase D — Migración de paneles admin, uno por uno.
5. Fase E — Portal público.
6. Fase F — Validación cruzada en breakpoints y dispositivos.
7. Reporte final.

REGLA FINAL

No se declara terminado un panel si no pasa la matriz en los 6 breakpoints. No se declara terminada la fase si algún dispositivo real no se ha probado o justificado. La accesibilidad y la usabilidad táctil son criterios de aceptación, no opcionales
# CONTINUACIÓN DEL DIAGNÓSTICO Y CORRECCIÓN INTEGRAL DE POS_EST

Actúa como desarrollador senior Full Stack, especialista en arquitectura de software, React, PHP/Laravel, APIs REST, PostgreSQL, UX/UI y aseguramiento de calidad.

## Objetivo

Corregir los problemas identificados en la auditoría anterior del proyecto POS_EST, priorizando la integración real entre frontend, backend y base de datos.

No reconstruyas el proyecto desde cero. Conserva su arquitectura, tecnologías, funcionalidades, relaciones y convenciones actuales.

## Reglas obligatorias

1. Inspecciona nuevamente el estado de Git antes de modificar archivos.
2. No elimines ni sobrescribas cambios existentes.
3. No inventes endpoints, campos, tablas ni relaciones.
4. No realices migraciones destructivas.
5. No elimines registros históricos.
6. No simules operaciones CRUD exitosas.
7. No cambies permisos ni roles sin justificarlo.
8. No ejecutes escrituras de prueba en la base de datos de producción.
9. No inicies servicios sin autorización.
10. Si una corrección requiere una decisión sobre el modelo de datos, detente y presenta las alternativas.

## Fase 1. Corrección de integración

Aborda individualmente los problemas identificados:

- Relación entre Programa, Malla y Módulo.
- Identificadores enviados desde el frontend.
- Tipos y valores de Materias.
- Métodos HTTP para activar, desactivar y reactivar Materias.
- Campos del formulario de Docentes.
- Carga y almacenamiento de fotografías.
- Persistencia de cambios en el asistente de Programas.
- Incorporación de nuevos Docentes desde el asistente.
- Validación del estado activo de los usuarios durante el inicio de sesión.
- Correspondencia entre roles del frontend y validaciones del backend.

Para cada problema:
- Identifica la causa raíz.
- Comprueba el contrato de la API.
- Revisa el controlador, servicio, modelo y componente relacionado.
- Corrige ambos extremos de la integración.
- Mantén compatibilidad con las relaciones existentes.

## Fase 2. Administración y UX/UI

Revisa los módulos de:

- Programas.
- Maestrías y Diplomados.
- Mallas curriculares.
- Módulos.
- Materias.
- Docentes.
- Usuarios.
- Roles y permisos.

Busca una experiencia administrativa uniforme:

- Tablas interactivas.
- Búsqueda y filtros.
- Formularios integrados.
- Edición de registros.
- Estados activos e inactivos.
- Validaciones claras.
- Mensajes de error y confirmación.
- Diseño adaptable a dispositivos.
- Evitar ventanas modales como flujo principal cuando sea posible.

No sacrifiques funcionalidades existentes para mejorar la apariencia.

## Fase 3. Integridad de datos

Verifica las relaciones, claves primarias, claves foráneas, restricciones UNIQUE y validaciones.

Presta especial atención a:
- Registros duplicados.
- Referencias huérfanas.
- Materias sin asignación.
- Docentes asociados a ediciones.
- Usuarios y roles.
- Diferencias entre migraciones y esquema real.

No modifiques el esquema hasta presentar un análisis de impacto y obtener autorización.

## Fase 4. Pruebas

Primero ejecuta las comprobaciones que no escriban datos:

- Compilación.
- Análisis estático.
- Pruebas unitarias existentes.
- Validación de rutas y contratos API.
- Revisión de permisos.
- Inspección de errores de consola.

Para probar persistencia real, utiliza exclusivamente una base de datos de pruebas aislada y autorizada.

Comprueba:
- Crear.
- Consultar.
- Editar.
- Desactivar.
- Reactivar.
- Persistencia después de recargar.
- Relaciones entre registros.
- Prevención de duplicados.

Si no existe una base de pruebas aislada, detente y solicita autorización antes de realizar escrituras.

## Fase 5. Informe final

Presenta una tabla con:

| Módulo | Problema | Causa raíz | Archivos modificados | Corrección | Prueba | Resultado |
|---|---|---|---|---|---|---|

Clasifica cada problema como:
- Corregido y probado.
- Corregido, pendiente de prueba.
- Pendiente de autorización.
- No corregido.

No declares que el CRUD funciona si no comprobaste la persistencia real.

## Forma de trabajo

Trabaja módulo por módulo y en pequeñas modificaciones.

Comienza por los problemas de integración de Programa, Malla, Módulo y Materia. Después continúa con Docentes, Usuarios y autenticación.

Antes de cada cambio importante, explica qué vas a modificar y qué dependencias puede afectar.

Si encuentras contradicciones en el modelo de datos, detente y solicita una decisión. No improvises una solución..