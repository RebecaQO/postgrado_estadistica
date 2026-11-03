<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Iniciar sesión</title>
</head>
<body>
    <main>
        <h1>Iniciar sesión</h1>

        <form action="{{ route('login.store') }}" method="POST">
            @csrf

            <div>
                <label for="nombre">Usuario</label>
                <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    value="{{ old('nombre') }}"
                    autocomplete="username"
                    required
                    autofocus
                >
                @error('nombre')
                    <p role="alert">{{ $message }}</p>
                @enderror
            </div>

            <div>
                <label for="password">Contraseña</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autocomplete="current-password"
                    required
                >
                @error('password')
                    <p role="alert">{{ $message }}</p>
                @enderror
            </div>

            <button type="submit">Entrar</button>
        </form>
    </main>
</body>
</html>
