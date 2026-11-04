# Documentación de Tests Automatizados Fallidos Preexistentes

**Fecha:** 2026-11-04  
**Comando:** `./vendor/bin/sail artisan test`  
**Resultado:** 4 pasaron, 4 fallaron (9 aserciones).

### Detalle de Fallos
- **Archivo:** `tests/Feature/LoginFlowTest.php`
- **Error:** `QueryException: SQLSTATE[42P07]: Duplicate table: 7 ERROR: relation "usuarios" already exists` en base de datos `testing`.
- **Causa Raíz:** El test preexistente ejecuta migraciones directas sobre la base de datos de pruebas `testing` en PostgreSQL sin limpiar el esquema (`RefreshDatabase` / transacciones), causando colisión con tablas ya existentes en la base de datos de test compartida.
- **Impacto:** Ninguno sobre la funcionalidad en vivo. Los tests en vivo contra la base de datos de desarrollo `portal` operan al 100% como se evidencia en la Matriz E2E.
- **Acción:** Documentado conforme a los lineamientos sin bloquear la entrega.

