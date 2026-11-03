# Portal Web de Postgrado — Estadística UMSA

## Estructura
- `backend/` — Laravel + Sanctum.
- `frontend/` — React + Vite.
- PostgreSQL 17 — compatible con el dump generado por PostgreSQL 17.11.

## Arranque local
Desde la raíz: `docker compose up -d`.

Equivalente Sail: `cd backend && ./vendor/bin/sail up -d`.
La API queda en `http://localhost`; Vite en `http://localhost:5173`.

La configuración local usa `backend/.env`; copia `backend/.env.example` para una instalación nueva. Los dumps de `respaldos/` se excluyen de Git porque contienen datos de aplicación.
