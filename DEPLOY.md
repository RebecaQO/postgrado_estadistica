# Guía de despliegue en Dokploy

## Fuente oficial

La rama `preparacion-produccion-dokploy` es candidata para revisión. El estándar de la Carrera indica que la versión desplegada debe residir en el fork aprobado de `github.com/sociest`. Configura Dokploy únicamente con ese fork después de su aprobación; este repositorio personal no debe ser la fuente de producción.

Usa la raíz del repositorio como directorio Compose. `compose.yaml` es la configuración de producción. No combines `compose.local.yaml` con Dokploy.

## Variables requeridas

Inyecta desde Dokploy un `.env` raíz (o las variables equivalentes del proyecto Compose). No subas valores reales al repositorio.

- `APP_KEY`: clave Laravel `base64:` distinta por entorno y persistente entre actualizaciones.
- `APP_URL`: origen HTTPS del API.
- `FRONTEND_URL`: origen HTTPS del portal.
- `CORS_ALLOWED_ORIGINS`: orígenes HTTPS permitidos, separados por comas.
- `SANCTUM_STATEFUL_DOMAINS`: host del frontend, sin protocolo.
- `VITE_API_URL`: origen HTTPS del API; se incorpora en la imagen frontend durante su construcción.
- `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`: credenciales PostgreSQL seguras y exclusivas.
- `TZ` y `APP_TIMEZONE`: `America/La_Paz`.
- `STORAGE_PATH`: `../files/storage` para los archivos persistentes del host Dokploy.

`APP_ENV=production` y `APP_DEBUG=false` son impuestos por `compose.yaml`. La plantilla `.env.example` no trae una clave ni contraseña de acceso. Genera `APP_KEY` con:

```bash
docker run --rm serversideup/php:8.5-cli php -r "echo 'base64:'.base64_encode(random_bytes(32)).PHP_EOL;"
```

No cambies la `APP_KEY` durante actualizaciones ordinarias; hacerlo invalida información cifrada. Mantén las credenciales solo en el almacén de secretos de Dokploy.

## Red, dominios y persistencia

- Crea o confirma la red externa `dokploy-network`.
- `app` expone internamente `8080`; `frontend` expone `80`. Traefik administra HTTPS y el proxy inverso.
- La API y PostgreSQL también comparten `backend-network`, que es interna.
- No hay `ports:` en `compose.yaml`; PostgreSQL tampoco tiene puerto o dominio público.
- El volumen nombrado `db_data` conserva PostgreSQL entre reconstrucciones.
- `STORAGE_PATH` se monta en `/var/www/html/storage/app/public`. Comprueba que el directorio persistente exista y que el contenedor pueda escribir en él.

Configura los dominios `frontend` y `app` desde Dokploy usando sus puertos internos. Alinea `FRONTEND_URL`, `CORS_ALLOWED_ORIGINS`, `SANCTUM_STATEFUL_DOMAINS` y `VITE_API_URL` con esos dominios.

## Migraciones, primer administrador y revisiones

El contenedor de API ejecuta migraciones Laravel al iniciar. Haz copia de PostgreSQL y de los archivos persistentes antes de desplegar. Revisa los logs de `app`, `frontend` y `db` y el health check `/up` después de cada despliegue.

No hay usuarios predeterminados y el seeder no crea cuentas demo. Después de que las migraciones estén listas, crea la primera cuenta desde la consola Dokploy con `php artisan portal:crear-admin`. El comando solicita las credenciales de manera interactiva y se detiene si ya existe un administrador activo.

El proyecto no envía correo actualmente. Antes de habilitar notificaciones o restablecimiento de contraseña, coordina un SMTP externo y configura sus credenciales como secretos de Dokploy.

No uses `docker compose down -v` en un entorno con datos: elimina `db_data`. Los respaldos con información personal y el `.env` no deben subirse a Git.

## Prueba local

Para probar localmente con puertos de desarrollo, copia `.env.example` a `.env`, configura una `APP_KEY` y un `DB_PASSWORD` propios, actualiza las URLs a `localhost` y ejecuta desde la raíz:

```bash
docker compose -f compose.yaml -f compose.local.yaml up -d --build
docker compose -f compose.yaml -f compose.local.yaml ps
```
