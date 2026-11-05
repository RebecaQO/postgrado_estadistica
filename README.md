# Portal Académico de Posgrado — Carrera de Estadística UMSA

Sistema integral web para la gestión, difusión y administración de programas de posgrado (Maestrías y Diplomados), convocatorias, defensas de grado, planta docente y usuarios de la Carrera de Estadística e Instituto de Estadística Teórica y Aplicada (IETA) de la Universidad Mayor de San Andrés (UMSA).

---

## 🏗️ Arquitectura del Sistema

- **Backend:** Laravel 11.x + Laravel Sanctum (Autenticación API) + Laravel Sail.
- **Base de Datos:** PostgreSQL 17.x con persistencia en volumen Docker.
- **Frontend:** React 18 + Vite + Tailwind CSS + Lucide Icons + `apiJson` unificado.
- **Entorno de Ejecución:** WSL2 (Ubuntu) con Docker Desktop.

---

## 🚀 Inicio Rápido de los Servicios

Desde el entorno WSL2 en la raíz del proyecto (`~/proyectos/POS_EST`):

### 1. Iniciar Contenedores (Sail / Docker Compose)
```bash
cd ~/proyectos/POS_EST
docker compose -p backend up -d
```
> **Nota:** El identificador `-p backend` mantiene la coherencia con Laravel Sail y evita colisiones de puertos o duplicación de volúmenes de base de datos.

### 2. Verificar Estado de los Contenedores
```bash
docker compose -p backend ps
```
Los tres servicios deben figurar en estado `Up`:
- `backend-laravel.test-1`: API Backend en el puerto `80`.
- `backend-pgsql-1`: Motor PostgreSQL 17 en el puerto `5432`.
- `backend-frontend-1`: Servidor Vite Frontend en el puerto `5173`.

### 3. Direcciones de Acceso Local
- 🌐 **Portal Web (Frontend):** [http://localhost:5173](http://localhost:5173)
- 🔌 **API REST (Backend):** [http://localhost/api](http://localhost/api)
- 🗄️ **PostgreSQL:** `localhost:5432` (`database: posgrado_umsa`, `user: portal`)

---

## 🔑 Credenciales de Acceso

El sistema cuenta con autenticación dual y flexible (soporta inicio de sesión mediante **nombre de usuario** o **correo electrónico**):

| Rol | Usuario | Correo Electrónico | Contraseña | Permisos |
|---|---|---|---|---|
| **Administrador** | `admin` | `admin@umsa.bo` | `Admin1234!` | Acceso completo al Portal Administrativo y módulos |
| **Usuario Regular**| `usuario` | `usuario@umsa.bo` | `Usuario1234!` | Acceso a consultas y perfil |

---

## 📌 Módulos del Sistema

### 1. Portal Administrativo (`/admin` / Modal Login)
- **Gestión de Programas de Posgrado:**
  - Creación y edición integral de **Maestrías** (estructura modular con materias, créditos y carga horaria) y **Diplomados** (materias directas asignadas al plan de estudios).
  - Activación y desactivación en tiempo real (`PATCH /api/programas/{id}/desactivar` y `reactivar`).
  - Registro de ediciones con fecha de inicio, duración, requisitos, modalidad de titulación, enlace de convocatoria y formulario de preinscripción.
- **Defensas de Tesis y Grado:**
  - Registro, programación, tribunales evaluadores y estados de defensas académicas.
- **Gestión de Usuarios y Roles:**
  - Control de usuarios administrativos, cambio de contraseñas y asignación de roles.
- **Carrera / IETA:**
  - Información institucional, autoridades, misión, visión y datos de contacto oficiales.

### 2. Portal Público y Catálogo
- **Navegación Dinámica por Hash:**
  - `/#programa/:id` — Ficha y vista detallada oficial del programa académico (información de grado, malla modular, materias, créditos CEUB, perfil del postulante y perfil de egreso).
  - `/#programas` — Catálogo general con filtros por grado académico, área de conocimiento y modalidad.
  - `/#institucion` — Identidad institucional de la Carrera de Estadística y el IETA.
  - `/#convocatorias` — Convocatorias vigentes para postulaciones abiertas.
  - `/#admision` — Pasos, cronograma y requisitos de admisión.
  - `/#contacto` — Canales de atención presenciales y enlace directo a WhatsApp.

---

## 🛠️ Comandos de Mantenimiento

### Ejecución de Comandos Artisan y Migraciones
Los comandos de backend se ejecutan a través del wrapper de Sail dentro de `backend/`:
```bash
cd ~/proyectos/POS_EST/backend
./vendor/bin/sail artisan route:list --path=api
./vendor/bin/sail artisan migrate --force
```

### Compilar Frontend para Producción
```bash
cd ~/proyectos/POS_EST
docker compose -p backend exec frontend npm run build
```

### Detener los Servicios
```bash
cd ~/proyectos/POS_EST
docker compose -p backend down
```

---

## 💻 Guía para Uso de Git

### Error de "dubious ownership" en Windows PowerShell
Si intentas usar `git` desde PowerShell en Windows sobre la ruta de red `\\wsl.localhost\Ubuntu\...`, Git de Windows puede mostrar el error:
```
fatal: detected dubious ownership in repository at '//wsl.localhost/Ubuntu/home/rebal/proyectos/POS_EST'
```

Para solucionarlo en tu entorno de Windows, abre PowerShell y ejecuta una sola vez:
```powershell
git config --global --add safe.directory "%(prefix)///wsl.localhost/Ubuntu/home/rebal/proyectos/POS_EST"
```
*(O de manera general: `git config --global --add safe.directory *`)*.

### Opción Recomendada: Ejecutar Git dentro de WSL2
La forma más rápida, segura y limpia es ejecutar Git directamente desde la terminal de Ubuntu / WSL2:

```bash
cd ~/proyectos/POS_EST

# 1. Comprobar estado
git status

# 2. Agregar cambios
git add .

# 3. Crear commit
git commit -m "descripcion de los cambios"

# 4. Enviar a GitHub
git push origin main
```

---

## 📂 Estructura del Repositorio

```
POS_EST/
├── backend/                  # API Laravel 11 + Sanctum + PostgreSQL (Sail)
│   ├── app/Http/Controllers/ # Controladores API (Programas, Defensas, Auth, etc.)
│   ├── app/Models/           # Modelos Eloquent con relaciones
│   └── routes/api.php        # Definición de rutas públicas y protegidas
├── frontend/                 # Aplicación React + Vite
│   ├── src/components/       # Componentes (Portales, Programas, Admin, etc.)
│   ├── src/services/         # Clientes de API unificados (programaService, etc.)
│   └── src/App.jsx           # Enrutamiento dinámico por hash y estado general
├── evidencias/               # Reportes técnicos de validación y auditoría de fases
├── docker-compose.yml        # Orquestación de contenedores locales
└── README.md                 # Documentación técnica del proyecto
```
