# Portal de Postgrado — Estadistica UMSA

Aplicacion local con backend Laravel/Sail, PostgreSQL 17 y frontend React/Vite. El entorno ejecutable actual esta en WSL2, en `~/proyectos/POS_EST`.

## Requisitos

- Windows 11 con WSL2 y una distribucion Ubuntu.
- Docker Desktop iniciado, con integracion WSL habilitada para Ubuntu.
- El repositorio WSL en `~/proyectos/POS_EST`.

## Iniciar el sistema

Abre Ubuntu/WSL y ejecuta desde la raiz del repositorio:

```bash
cd ~/proyectos/POS_EST
docker compose -p backend up -d --build
docker compose -p backend ps
```

El nombre `backend` mantiene el mismo proyecto Compose que Sail y evita crear una segunda base de datos o competir por los puertos. En los siguientes arranques puedes omitir `--build`:

```bash
docker compose -p backend up -d
```

## Direcciones locales

- Frontend: [http://localhost:5173](http://localhost:5173)
- API Laravel: [http://localhost/api](http://localhost/api)
- PostgreSQL: `localhost:5432` (uso local desde herramientas compatibles).

Que una ruta protegida de la API devuelva `401` sin iniciar sesion es normal.

## Servicios y comandos utiles

Desde la raiz `~/proyectos/POS_EST`:

```bash
docker compose -p backend ps
docker compose -p backend logs -f
docker compose -p backend logs -f laravel.test
docker compose -p backend logs -f frontend
docker compose -p backend logs -f pgsql
```

Los comandos de Laravel y Composer se ejecutan desde `backend/`:

```bash
cd ~/proyectos/POS_EST/backend
./vendor/bin/sail artisan route:list --path=api
./vendor/bin/sail artisan migrate --force
./vendor/bin/sail composer install
```

## Primera instalacion

La configuracion local vive en `backend/.env` y no se versiona. Si aun no existe:

```bash
cd ~/proyectos/POS_EST
cp backend/.env.example backend/.env
docker compose -p backend up -d --build
cd backend
./vendor/bin/sail artisan key:generate
./vendor/bin/sail artisan migrate --force
```

Genera `APP_KEY` una sola vez por instalacion y conserva el archivo `.env` en los siguientes arranques. Si vas a cargar un respaldo PostgreSQL, hazlo en la base vacia antes de ejecutar las migraciones. No restaures un respaldo sobre una base que ya contiene datos.

## Detener el sistema

```bash
cd ~/proyectos/POS_EST
docker compose -p backend down
```

Esto detiene y elimina los contenedores, pero conserva el volumen de PostgreSQL. No uses `docker compose down -v` salvo que quieras borrar permanentemente la base de datos local.

## Solucion de problemas

- Si Docker no responde, inicia Docker Desktop y comprueba la integracion WSL de Ubuntu.
- Si un puerto esta ocupado, revisa los procesos que usan `80`, `5432` o `5173` antes de reiniciar.
- Usa siempre `docker compose -p backend`; omitir `-p backend` puede crear otro proyecto Compose.
- Si el frontend no aparece, revisa `docker compose -p backend logs -f frontend`.
- Si la API devuelve `500`, revisa `docker compose -p backend logs -f laravel.test` y el estado de PostgreSQL.

## Componentes

- `backend/`: Laravel, Sanctum y Laravel Sail.
- `frontend/`: React y Vite.
- PostgreSQL 17: servicio `pgsql`.
- `evidencias/`: reportes y capturas de las fases del proyecto.
- `respaldos/`: respaldos locales excluidos de Git por contener datos de aplicacion.
