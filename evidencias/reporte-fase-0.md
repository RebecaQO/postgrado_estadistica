# FASE 0.R — Recuperación y cierre
FECHA: 2026-11-02 20:01

## Paso 1: GitHub
- `nslookup github.com`: FALLA; el DNS local (127.0.0.1) agotó tiempo.
- `nslookup github.com 8.8.8.8`: FALLA por timeout.
- `nslookup github.com 1.1.1.1`: FALLA por timeout.
- `curl https://github.com` y `https://api.github.com`: FALLA, no resuelve host.
- Proxy Git: no configurado. No se cambió DNS, proxy ni hosts.
- GitHub accesible: NO; pushes quedan pendientes.

## Paso 2: ZIP backend
- ZIP verificado: `backend_20261102_195211.zip` (0.20 MB).
- Entradas: 176; migraciones: 5. `composer.json`, `routes/api.php`, `routes/web.php`, `config/database.php` y `database/migrations` presentes.
- `app/Http/Kernel.php` no está en el ZIP ni en el backend actual; el proyecto usa `bootstrap/app.php` (estructura Laravel 13). Ese criterio del prompt no aplica a esta estructura. El ZIP contiene el proyecto presente, no se regeneró.

## Paso 3: frontend/.git
- Opción elegida: A (pragmática).
- `.git` del frontend verificado dentro del ZIP (HEAD, config, objects y refs).
- Metadatos movidos a `C:\respaldos-portal\frontend-git-preservado-20261102_200029`; también permanecen dentro del ZIP.
- `frontend/.git` ya no está en el árbol; los archivos de trabajo del frontend se conservaron e incorporaron al snapshot del monorepo.

## Paso 4: .env.example
- `backend/.env.example` usa `DB_CONNECTION=pgsql`, `DB_HOST=pgsql`, y credenciales vacías de plantilla.
- Secretos reales: NO.
- Original respaldado en `C:\respaldos-portal\backend.env.example.orig`.

## Paso 5: commits y push
- `.env` reales, `vendor/` y `node_modules/`: excluidos del commit inicial.
- Commit inicial en `main`: `c9b04a2` — `estado inicial: backend Laravel y frontend React pre-unificacion`.
- Push `main`: PENDIENTE (sin DNS).
- Remote configurado como `https://github.com/RebecaQO/postgrado_estadistica.git`.

## Paso 6: ramas
- `backup-pre-unificacion` local: SÍ; remoto: PENDIENTE.
- `preparacion/fase-0` local y activa: SÍ; remoto: PENDIENTE.
- Commit artefactos Fase 0: `484268f` — `fase-0: inventario, evidencias, env PostgreSQL y compose borrador`.\n- Commit final del reporte: creado a continuación en esta misma rama.

## Paso 7: riesgos abiertos
- El repo anterior `WebPostgrado` tiene `.env` y `.env.production` trackeados con cambios locales. Visibilidad pública/privada y contenido no se verificaron; revisar fuera de esta fase y rotar cualquier credencial que hubiera sido expuesta.

## Estado final
- Fase 0 cerrada localmente: SÍ.
- Fase 0 cerrada en GitHub: NO; publicación pendiente por DNS.
- Bloqueos restantes: conectividad GitHub para verificar remoto y publicar ramas.

## Código de negocio modificado
NINGUNO. Solo documentación, configuración de plantilla `.env.example` e inventario.

## Próximo paso
Restablecer DNS/red, comprobar el estado del remoto y publicar `main`, `backup-pre-unificacion` y `preparacion/fase-0`. Docker/Fase 0.B permanece pendiente.

