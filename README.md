# Portal Académico de Posgrado — Carrera de Estadística UMSA

Portal público y administrativo para difundir y gestionar programas de posgrado, convocatorias, defensas de tesis, noticias, docentes, personal administrativo y cuentas de usuario de la Carrera de Estadística y el IETA.

## Tecnología y arquitectura

- API: PHP 8.5 y Laravel 13 con autenticación por tokens Laravel Sanctum.
- Frontend: React 19 y Vite, compilado como SPA y servido por Nginx.
- Base de datos: PostgreSQL 16.
- Despliegue: Docker Compose; Dokploy y Traefik para producción.
- Persistencia: volumen Docker `db_data` para PostgreSQL y directorio persistente `files/storage` para archivos cargados.

## Requisitos

- Git.
- Docker Engine y Docker Compose v2 (Docker Desktop en Windows).
- Acceso al repositorio y a las variables de entorno del entorno correspondiente.

## Ejecución local

Clona la rama de preparación y crea el archivo local de entorno:

```bash
git clone --branch preparacion-produccion-dokploy https://github.com/RebecaQO/postgrado_estadistica.git
cd postgrado_estadistica
cp .env.example .env
```

En PowerShell, usa `Copy-Item .env.example .env` en lugar de `cp`.

Edita `.env` antes de levantar los servicios:

- Genera un `APP_KEY` distinto por entorno. Puedes generarlo con Docker:

  ```bash
  docker run --rm serversideup/php:8.5-cli php -r "echo 'base64:'.base64_encode(random_bytes(32)).PHP_EOL;"
  ```

- Sustituye `DB_PASSWORD` por una contraseña larga y única.
- Para local, configura `APP_URL=http://localhost:8080`, `FRONTEND_URL=http://localhost:3000`, `VITE_API_URL=http://localhost:8080`, `CORS_ALLOWED_ORIGINS=http://localhost:3000` y `SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000`.
- Conserva `STORAGE_PATH=./files/storage` para que las cargas locales queden dentro del proyecto.

Inicia y revisa los contenedores:

```bash
docker compose -f compose.yaml -f compose.local.yaml up -d --build
docker compose -f compose.yaml -f compose.local.yaml ps
```

Abre el portal en `http://localhost:3000`, la API en `http://localhost:8080/api` y la salud de Laravel en `http://localhost:8080/up`. La base de datos no publica un puerto al equipo anfitrión.

Las migraciones se ejecutan al iniciar el contenedor de Laravel. Para crear la primera cuenta administradora, después de que la API esté saludable, ejecuta el comando interactivo:

```bash
docker compose -f compose.yaml -f compose.local.yaml exec app php artisan portal:crear-admin
```

El comando solicita usuario, correo y contraseña sin mostrar esta última, requiere al menos 12 caracteres y solo crea una cuenta si todavía no existe un administrador activo. `DatabaseSeeder` no crea cuentas de prueba. No ejecutes `db:seed` en producción.

## Variables de entorno

`.env.example` contiene únicamente nombres y valores ilustrativos. No contiene claves ni contraseñas válidas. Mantén `.env` fuera de Git y configura valores únicos en cada entorno.

| Variable | Uso |
|---|---|
| `APP_KEY` | Clave de cifrado Laravel única y permanente por entorno. No la rotes durante una actualización normal. |
| `APP_URL` | Origen público HTTPS de la API. |
| `FRONTEND_URL` | Origen público HTTPS del frontend y origen CORS predeterminado. |
| `CORS_ALLOWED_ORIGINS` | Lista separada por comas de orígenes web permitidos, incluyendo esquema y sin rutas. |
| `SANCTUM_STATEFUL_DOMAINS` | Host del frontend, sin esquema; incluye el puerto en local. |
| `VITE_API_URL` | URL pública de la API; queda integrada en el frontend durante la compilación. |
| `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` | Base y credenciales PostgreSQL. Usa valores propios y seguros. |
| `TZ`, `APP_TIMEZONE` | Zona horaria; usa `America/La_Paz`. |
| `STORAGE_PATH` | Ruta persistente del host montada en el almacenamiento público de Laravel. |

El backend usa tokens Bearer y CORS no habilita credenciales cross-site. Laravel está configurado para confiar en Traefik como proxy, ya que el servicio de API no publica puertos al host en producción.

## Despliegue en Dokploy

La rama `preparacion-produccion-dokploy` es candidata a revisión. Según el estándar de despliegue de la Carrera, la versión de producción debe desplegarse desde el fork aprobado en la organización `sociest`; Dokploy no debe apuntar al repositorio personal.

En Dokploy, crea una aplicación Compose desde el repositorio oficial aprobado, usando la raíz como directorio. Configura las variables del cuadro anterior con URLs HTTPS reales y secretos del entorno de producción. No reutilices el `APP_KEY` ni la contraseña de PostgreSQL de otro entorno. Configura `STORAGE_PATH=../files/storage` para el bind mount persistente recomendado por el servidor.

Requisitos de red y dominio:

- En el host debe existir la red externa `dokploy-network`.
- Asigna el dominio del frontend al servicio `frontend`, puerto interno `80`.
- Asigna el dominio de API al servicio `app`, puerto interno `8080`.
- `compose.yaml` no publica puertos al host. `compose.local.yaml` solo se usa en desarrollo y contiene los mapeos `3000:80` y `8080:8080`.
- PostgreSQL solo está en la red interna `backend-network`; no le asignes dominio ni puerto público.
- TLS termina en Traefik. Usa HTTPS en `APP_URL`, `FRONTEND_URL`, `VITE_API_URL` y `CORS_ALLOWED_ORIGINS`.

Compose reconstruye frontend y API. El arranque de API ejecuta `php artisan migrate --force` mediante la configuración del contenedor. Revisa los logs y confirma los health checks antes de dar el despliegue por listo. Haz y verifica una copia de la base de datos y de `files/storage` antes de actualizar. No uses `docker compose down -v`: elimina el volumen de PostgreSQL.

Los archivos subidos se escriben en `/var/www/html/storage/app/public`; el bind mount de `STORAGE_PATH` debe conservarse entre despliegues. El volumen `db_data` conserva PostgreSQL.

## Correo electrónico

La aplicación no envía correos actualmente; Laravel usa el mailer `log`. Antes de habilitar recuperación de contraseña o notificaciones por correo, configura un SMTP externo en Dokploy usando variables secretas (`MAIL_MAILER`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_ENCRYPTION` y `MAIL_FROM_ADDRESS`) y valida su funcionamiento.

## Actualizar y respaldar

Antes de actualizar, crea una copia de PostgreSQL y otra de `files/storage`. Después, en el entorno local:

El procedimiento detallado para respaldo, actualización y restauración en Windows está en [README_ACTUALIZACION_DOCKER.md](README_ACTUALIZACION_DOCKER.md).

```bash
docker compose -f compose.yaml -f compose.local.yaml up -d --build --remove-orphans
docker compose -f compose.yaml -f compose.local.yaml ps
docker compose -f compose.yaml -f compose.local.yaml logs --tail 100 app frontend db
```

En Dokploy, despliega desde el fork oficial aprobado. No uses `down -v` ni elimines manualmente `db_data` o el directorio persistente de archivos. Guarda los respaldos fuera del servidor que ejecuta la aplicación y fuera de Git.

En PowerShell, puedes respaldar la base local en formato PostgreSQL y copiarla fuera del contenedor:

```powershell
New-Item -ItemType Directory -Force respaldos | Out-Null
docker compose -f compose.yaml -f compose.local.yaml exec -T db sh -c 'pg_dump -Fc -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /tmp/portal-backup.dump'
if ($LASTEXITCODE -ne 0) { throw "Falló pg_dump; no continúes con la actualización." }
$backup = ".\respaldos\portal_$(Get-Date -Format 'yyyyMMdd_HHmmss').dump"
docker compose -f compose.yaml -f compose.local.yaml cp db:/tmp/portal-backup.dump $backup
if ($LASTEXITCODE -ne 0) { throw "No se pudo copiar el respaldo." }
Get-Item $backup | Select-Object FullName,Length
```

Ese respaldo incluye las cuentas de la tabla `usuarios`, sus hashes de contraseña, roles y el resto de los datos. Conserva también `files/storage` y el `.env` en almacenamiento seguro. Los archivos `.sql`, `.dump`, `.backup`, `.zip` y `respaldos/` están excluidos de Git.

Para restaurar, detén la API, copia el archivo al contenedor y restaura solo sobre una base de destino vacía o preparada para reemplazo. `--clean` elimina objetos existentes de la base seleccionada:

```powershell
docker compose -f compose.yaml -f compose.local.yaml stop app
docker compose -f compose.yaml -f compose.local.yaml cp .\respaldos\portal_YYYYMMDD_HHMMSS.dump db:/tmp/portal-restore.dump
docker compose -f compose.yaml -f compose.local.yaml exec -T db sh -c 'pg_restore --clean --if-exists --no-owner -U "$POSTGRES_USER" -d "$POSTGRES_DB" /tmp/portal-restore.dump'
if ($LASTEXITCODE -ne 0) { throw "Falló la restauración; deja la API detenida y revisa los registros." }
docker compose -f compose.yaml -f compose.local.yaml start app
```

No practiques la restauración sobre producción: primero valida el archivo en una base de pruebas.

## Comprobaciones antes del fork/despliegue

Desde la raíz del proyecto, revisa dependencias y cambios antes de crear una solicitud de integración:

```bash
cd frontend
npm ci
npm audit --omit=dev
npm run build
cd ../backend
composer install --no-interaction --prefer-dist
composer audit --no-dev
```

El seeder está vacío intencionalmente. No hay usuarios ni contraseñas predeterminados. Crea la cuenta inicial con `portal:crear-admin` después de las migraciones y entrega credenciales al responsable por un canal seguro.
