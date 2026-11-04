# Endpoints Públicos de la API (Sin autenticación requerida)

Total endpoints públicos: 4

| Método | URI | Acción | Middleware |
|---|---|---|---|
| POST | `api/auth/login` | App\Http\Controllers\AutenticacionController@loginApi | api, Illuminate\Routing\Middleware\ThrottleRequests:5,1 |
| GET|HEAD | `api/convocatorias` | App\Http\Controllers\EdicionProgramaController@listarConvocatorias | api |
| GET|HEAD | `api/convocatorias-pasadas` | App\Http\Controllers\EdicionProgramaController@listarConvocatoriasPasadas | api |
| GET|HEAD | `api/programas/activos` | App\Http\Controllers\ProgramaPostgradoController@listarProgramasActivos | api |
