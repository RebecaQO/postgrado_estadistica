# Actualización, respaldos y datos de usuario

Usa esta guía desde la raíz del proyecto. En producción, ejecuta las acciones desde Dokploy o la consola del servidor oficial aprobado. El `.env`, los respaldos, las cuentas y `files/storage` son propios de cada entorno; no los copies al repositorio.

## Datos que deben conservarse

- PostgreSQL guarda las cuentas de `usuarios`, hashes de contraseñas, roles y datos académicos en el volumen Docker `db_data`.
- Las cargas públicas están en `files/storage` o en la ruta configurada mediante `STORAGE_PATH`.
- Conserva la misma `APP_KEY` entre actualizaciones.
- `.env` y respaldos pueden contener secretos o datos personales. Guárdalos cifrados y fuera de Git.

## Crear un respaldo local en Windows

En PowerShell, desde la raíz:

```powershell
New-Item -ItemType Directory -Force respaldos | Out-Null
docker compose -f compose.yaml -f compose.local.yaml exec -T db sh -c 'pg_dump -Fc -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /tmp/portal-backup.dump'
if ($LASTEXITCODE -ne 0) { throw "Falló pg_dump." }
$backup = ".\respaldos\portal_$(Get-Date -Format 'yyyyMMdd_HHmmss').dump"
docker compose -f compose.yaml -f compose.local.yaml cp db:/tmp/portal-backup.dump $backup
if ($LASTEXITCODE -ne 0) { throw "No se pudo copiar el respaldo." }
Get-Item $backup | Select-Object FullName,Length
```

Guarda también los archivos cargados y el `.env` en un destino seguro:

```powershell
$filesBackup = ".\respaldos\storage_$(Get-Date -Format 'yyyyMMdd_HHmmss').zip"
Compress-Archive -Path .\files\storage -DestinationPath $filesBackup
```

Comprueba que los archivos existan y tengan un tamaño razonable. Para producción, conserva copias fuera del servidor y usa el sistema de respaldos de Dokploy para `db_data`.

## Actualizar

1. Guarda copias recientes de PostgreSQL y `files/storage`.
2. Actualiza el código en la rama aprobada o despliega la nueva revisión desde el fork oficial.
3. Reconstruye frontend y API:

   ```powershell
   docker compose -f compose.yaml -f compose.local.yaml up -d --build --remove-orphans
   docker compose -f compose.yaml -f compose.local.yaml ps
   docker compose -f compose.yaml -f compose.local.yaml logs --tail 100 app frontend db
   ```

   En Dokploy, usa su despliegue Compose y no combines `compose.local.yaml` con producción.

4. Comprueba la API en `/up`, el frontend y los logs. Laravel ejecuta las migraciones configuradas al iniciar `app`.

## Restaurar un respaldo

La restauración sustituye objetos de la base elegida cuando se usa `--clean`. Detén el uso del portal y verifica dos veces el entorno y archivo antes de continuar. En PowerShell, desde la raíz:

```powershell
$backup = ".\respaldos\portal_YYYYMMDD_HHMMSS.dump"
docker compose -f compose.yaml -f compose.local.yaml stop app
docker compose -f compose.yaml -f compose.local.yaml cp $backup db:/tmp/portal-restore.dump
docker compose -f compose.yaml -f compose.local.yaml exec -T db sh -c 'pg_restore --clean --if-exists --no-owner -U "$POSTGRES_USER" -d "$POSTGRES_DB" /tmp/portal-restore.dump'
if ($LASTEXITCODE -ne 0) { throw "Falló la restauración; deja la API detenida y revisa los registros." }
docker compose -f compose.yaml -f compose.local.yaml start app
```

Restaura también el ZIP de `files/storage` en su ruta persistente. Prueba la restauración primero en una base aislada; no practiques sobre producción.

## Evitar la pérdida de datos

- `docker compose down` detiene los servicios y conserva `db_data`.
- **No uses `docker compose down -v`** en un entorno con datos: elimina el volumen de PostgreSQL.
- No borres `db_data` ni el directorio `STORAGE_PATH` durante una reconstrucción.
- `DatabaseSeeder` no crea cuentas demo. Crea la primera cuenta administradora tras las migraciones con `php artisan portal:crear-admin`; el comando solicita la contraseña sin mostrarla.
