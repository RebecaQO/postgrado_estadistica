<?php

namespace App\Console\Commands;

use App\Models\Usuario;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;

class CreateAdminUser extends Command
{
    protected $signature = 'portal:crear-admin';

    protected $description = 'Crea de forma interactiva la primera cuenta administradora';

    public function handle(): int
    {
        if (Usuario::query()->where('rol', 'admin')->where('activo', true)->exists()) {
            $this->error('Ya existe un administrador activo. Usa la gestión de usuarios del portal.');

            return self::FAILURE;
        }

        $nombre = trim((string) $this->ask('Nombre de usuario'));
        $email = trim((string) $this->ask('Correo electrónico'));
        $password = (string) $this->secret('Contraseña (mínimo 12 caracteres)');
        $confirmation = (string) $this->secret('Confirma la contraseña');

        $validator = Validator::make(
            compact('nombre', 'email', 'password'),
            [
                'nombre' => ['required', 'string', 'max:100', 'unique:usuarios,nombre'],
                'email' => ['required', 'email', 'max:255', 'unique:usuarios,email'],
                'password' => ['required', 'string', 'min:12'],
            ]
        );

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $message) {
                $this->error($message);
            }

            return self::FAILURE;
        }

        if ($password !== $confirmation) {
            $this->error('Las contraseñas no coinciden. No se creó la cuenta.');

            return self::FAILURE;
        }

        if (! $this->confirm("Crear la cuenta administradora para {$email}?", false)) {
            $this->info('Operación cancelada.');

            return self::SUCCESS;
        }

        Usuario::create([
            'nombre' => $nombre,
            'email' => $email,
            'password' => $password,
            'rol' => 'admin',
            'activo' => true,
        ]);

        $this->info('Cuenta administradora creada. Guarda las credenciales en un gestor seguro.');

        return self::SUCCESS;
    }
}
