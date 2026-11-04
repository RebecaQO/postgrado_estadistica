# Catálogo de Variables de Entorno — POS_EST

Este documento detalla todas las variables de entorno requeridas y opcionales para la ejecución del backend y frontend de POS_EST.

---

## 1. Backend (`backend/.env`)

| Variable | Tipo | Requerida | Valor por Defecto (Sail) | Descripción |
|---|:---:|:---:|---|---|
| `APP_NAME` | String | No | `"Portal Posgrado Estadistica"` | Nombre de la aplicación en logs y correos |
| `APP_ENV` | String | Sí | `local` | Entorno de ejecución (`local`, `production`) |
| `APP_KEY` | String (Base64) | Sí | *(Generada con `key:generate`)* | Clave de encriptación para sesiones y tokens Sanctum |
| `APP_DEBUG` | Boolean | Sí | `true` (en local) / `false` (en prod) | Activa traza de errores detallada |
| `APP_URL` | URL | Sí | `http://localhost` | URL pública base del backend API |
| `FRONTEND_URL` | URL | Sí | `http://localhost:5173` | Origen del frontend permitido por CORS |
| `SANCTUM_STATEFUL_DOMAINS` | String | Sí | `localhost:5173` | Dominios autorizados para sesiones stateful |
| `DB_CONNECTION` | String | Sí | `pgsql` | Driver de base de datos relacional |
| `DB_HOST` | String | Sí | `pgsql` | Host del servicio de PostgreSQL en Docker |
| `DB_PORT` | Integer | Sí | `5432` | Puerto del motor PostgreSQL |
| `DB_DATABASE` | String | Sí | `portal` | Nombre de la base de datos de producción/desarrollo |
| `DB_USERNAME` | String | Sí | `portal` | Usuario propietario de la base de datos |
| `DB_PASSWORD` | String | Sí | `secret` | Contraseña del usuario de base de datos |
| `SESSION_DRIVER` | String | No | `database` / `file` | Manejador de sesiones de Laravel |
| `QUEUE_CONNECTION` | String | No | `sync` | Driver de colas de procesamiento asíncrono |

---

## 2. Frontend (`frontend/.env`)

| Variable | Tipo | Requerida | Valor por Defecto | Descripción |
|---|:---:|:---:|---|---|
| `VITE_API_URL` | URL | Sí | `http://localhost/api` | Prefijo unificado consumido por `apiJson` |

---

## 3. Consideraciones de Seguridad en Producción
- En entornos de producción, `APP_DEBUG` **debe ser obligatoriamente `false`**.
- La variable `APP_KEY` nunca debe compartirse ni comprometerse en Git.
- `FRONTEND_URL` y `SANCTUM_STATEFUL_DOMAINS` deben configurarse con el dominio DNS final con HTTPS (`https://posgrado.fcpn.umsa.bo`).
