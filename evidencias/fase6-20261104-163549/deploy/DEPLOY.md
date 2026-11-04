# Guía de Despliegue y Arranque — POS_EST

**Versión:** 0.9.0-rc  
**Entorno Objetivo:** Docker Desktop con WSL2 (Ubuntu) / Servidor Linux con Docker Compose

---

## 1. Requisitos Previos

- **Sistema Operativo:** Linux (Ubuntu 22.04+) o Windows 11 con WSL2 (Ubuntu).
- **Docker:** Docker Desktop v4.28+ o Docker Engine v24+ con plugin Docker Compose v2+.
- **Git:** v2.34+
- **Puertos Libres Requeridos:**
  - `80` (Backend API HTTP / Nginx Sail)
  - `5173` (Frontend Vite Dev Server)
  - `5432` (PostgreSQL Database)

---

## 2. Clonado y Configuración del Entorno

### 2.1 Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO> POS_EST
cd POS_EST
```

### 2.2 Configuración de Variables de Entorno (Backend)
```bash
cp backend/.env.example backend/.env
```

Asegurar las siguientes configuraciones esenciales en `backend/.env`:
```ini
APP_NAME="Portal Posgrado Estadistica"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost

FRONTEND_URL=http://localhost:5173
SANCTUM_STATEFUL_DOMAINS=localhost:5173

DB_CONNECTION=pgsql
DB_HOST=pgsql
DB_PORT=5432
DB_DATABASE=portal
DB_USERNAME=portal
DB_PASSWORD=secret
```

### 2.3 Configuración de Variables de Entorno (Frontend)
En `frontend/`, crear o verificar `.env`:
```ini
VITE_API_URL=http://localhost/api
```

---

## 3. Despliegue con Docker Compose (Laravel Sail)

### 3.1 Levantar los Contenedores
Desde el directorio `backend/`:
```bash
cd backend
./vendor/bin/sail up -d
```
> *Nota:* La primera ejecución descargará las imágenes de PHP 8.3, PostgreSQL 16 y Node.js.

### 3.2 Verificar Estado de Salud
```bash
./vendor/bin/sail ps
```
Asegurarse de que los 3 contenedores muestren estado `Up`:
- `backend-laravel.test-1` (Puerto 80)
- `backend-pgsql-1` (Puerto 5432, `healthy`)
- `backend-frontend-1` (Puerto 5173)

### 3.3 Inicialización de la Aplicación
Ejecutar dentro del contenedor backend:
```bash
# Generar clave de aplicación (si no está generada)
./vendor/bin/sail artisan key:generate

# Ejecutar migraciones de la base de datos
./vendor/bin/sail artisan migrate --force

# (Opcional) Poblar base de datos inicial
./vendor/bin/sail artisan db:seed --force
```

---

## 4. Verificación de Funcionamiento

1. **Frontend:** Abrir en el navegador [http://localhost:5173](http://localhost:5173)
2. **Backend Health:** Abrir [http://localhost/api/programas/activos](http://localhost/api/programas/activos) (debe devolver JSON `{"success":true,"data":[...]}`)
3. **Panel Administrativo:** Ingresar con el usuario administrador en el portal:
   - **Usuario:** `admin`
   - **Contraseña:** `Admin1234!`

---

## 5. Mantenimiento y Comandos Útiles

```bash
# Ver logs en tiempo real
./vendor/bin/sail logs -f

# Acceder a la consola de Laravel (Tinker)
./vendor/bin/sail artisan tinker

# Reiniciar servicios
./vendor/bin/sail restart

# Detener los contenedores preservando datos
./vendor/bin/sail down

# Respaldo rápido de PostgreSQL
./vendor/bin/sail exec pgsql pg_dump -U portal portal > respaldo_$(date +%Y%m%d).sql
```
