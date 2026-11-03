# FASE 0.B — Reporte de cierre
FECHA: 2026-11-03 08:37

## Paso 1: Docker y permisos
- Docker sin sudo: OK; usuario `rebal` pertenece al grupo `docker`.
- `docker run --rm hello-world`: OK.

## Paso 2: Backend
- `backend/artisan`, `routes/api.php`, `composer.json`: presentes.
- El backend WSL coincidía con la copia de OneDrive; no fue necesario reemplazarlo.
- Tamaño tras dependencias: 81 MB (vendor: 79 MB).

## Paso 3: Raíz
- No hay `composer.json`, `composer.lock`, `vendor/` ni `.env` en la raíz.
- `compose.yaml`, `.gitignore`, `README.md`, backend, frontend, evidencias y `respaldos/` están presentes.

## Pasos 4–5: Composer y Sail
- Composer 2.11.1; PHP 8.5.4.
- Dependencias instaladas y `laravel/sail` 1.69.0 presente en `vendor/bin/sail`.

## Paso 6: Entorno
- `DB_CONNECTION=pgsql`, `DB_HOST=pgsql`, DB `portal`.
- APP_KEY generado.
- `.env` local está ignorado por Git.

## Pasos 7–8: Servicios Docker
- Compose raíz incluye `backend/compose.yaml`; compose de Sail validado.
- PostgreSQL 17: healthy.
- `laravel.test`: Up en `http://localhost` (puerto 80).
- `frontend`: Up; Vite listo en `http://localhost:5173`.
- La imagen runtime Sail PHP 8.5 se construyó correctamente.

## Paso 9: Migraciones
- Backup restaurado primero en PostgreSQL 17.
- 5 migraciones `Ran`; 0 pendientes.
- `artisan migrate --force`: `Nothing to migrate`.

## Paso 10: Frontend
- Servicio `node:20-alpine` añadido a compose.
- Puerto fijado a 5173. Vite devuelve HTTP 200.

## Paso 11: Verificación HTTP
- `GET /api/programas`: HTTP 401, esperado porque requiere autenticación.
- `GET http://localhost:5173`: HTTP 200.
- Login no probado: no se proporcionaron credenciales. Las rutas actuales son `/api/auth/login` y `/api/auth/me`.

## Paso 12: Artefactos
- `evidencias/routes-snapshot.txt`: 60 líneas.
- `respaldos/backup_wsl_20261103.dump`: 59 KB, formato PostgreSQL custom, generado por PostgreSQL 17.11.
- Snapshot y dump copiados a `C:\respaldos-portal\`.
- El backup original `C:\Users\rebal\Downloads\posgradobdcondatos.backup` y su copia de seguridad se conservaron.
- Los dumps contienen datos y están excluidos de Git; `respaldos/README.md` documenta su ubicación.

## Paso 13: Git
- Rama: `preparacion/fase-0`.
- Commit de artefactos: `80c6cab` — `fase-0.B: entorno Docker, PostgreSQL 17 y evidencias`.
- Reporte se registra en un commit separado.
- No se incorporaron cambios locales preexistentes fuera de los artefactos Fase 0.B.
- Push: pendiente de comprobar conectividad y el estado remoto; no se usa force.

## Incidencias
- El dump fue generado con PostgreSQL 17.11; PostgreSQL 16 no podía leer el formato 1.16. Se usó PostgreSQL 17.
- El primer build de Sail quedó bloqueado por salida de progreso; se relanzó con log y concluyó.
- El mapeo 5173 inicial chocaba con el puerto Vite del servicio Laravel; se quitó y se fijó Vite en 5173.
- En el checkout WSL faltaban `frontend/package.json` e `index.html`; se restauraron desde el commit base. npm actualizó `package-lock.json`.
- Composer señaló una advertencia PSR-4 existente en `app/Http/MiddleWare/Administrador.php` y una auditoría de seguridad con un aviso; no se modificó código de negocio ni se actualizaron paquetes para corregirlos.

## Código de negocio modificado
NINGUNO.

## Estado final
- Fase 0.B local: COMPLETA.
- Fase 0.B remota: push pendiente de conectividad/estado de GitHub.
- Fase 1 — Auditoría de contratos: LISTO para iniciar.
