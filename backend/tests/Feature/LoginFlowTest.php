<?php

namespace Tests\Feature;

use App\Models\Usuario;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class LoginFlowTest extends TestCase
{
    public function test_root_redirects_to_login(): void
    {
        $this->get('/')
            ->assertRedirectToRoute('login');
    }

    public function test_login_page_renders(): void
    {
        $this->get('/login')
            ->assertOk()
            ->assertSee('Iniciar sesión');
    }

    public function test_guest_is_redirected_to_login_from_inicio(): void
    {
        $this->get('/inicio')
            ->assertRedirectToRoute('login');
    }

    public function test_valid_credentials_authenticate_user_and_show_inicio(): void
    {
        $usuario = $this->crearUsuario();

        $this->post('/login', [
            'nombre' => 'admin',
            'password' => '12345',
        ])->assertRedirectToRoute('inicio');

        $this->assertAuthenticatedAs($usuario);

        $this->get('/inicio')
            ->assertOk()
            ->assertSeeText('Bienvenido, admin')
            ->assertSeeText('Rol: admin')
            ->assertDontSee('password');
    }

    public function test_invalid_credentials_return_error_and_do_not_authenticate(): void
    {
        $this->crearUsuario();

        $this->post('/login', [
            'nombre' => 'admin',
            'password' => 'incorrecta',
        ])->assertSessionHasErrors('nombre');

        $this->assertGuest();
    }

    public function test_logout_ends_authenticated_session(): void
    {
        $usuario = $this->crearUsuario();

        $this->actingAs($usuario)
            ->post('/logout')
            ->assertRedirectToRoute('login');

        $this->assertGuest();
    }

    private function crearUsuario(): Usuario
    {
        Schema::dropIfExists('usuarios');
        Schema::create('usuarios', function (Blueprint $table): void {
            $table->id('id_usuario');
            $table->string('nombre')->unique();
            $table->string('password');
            $table->string('rol');
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });

        return Usuario::create([
            'nombre' => 'admin',
            'password' => '12345',
            'rol' => 'admin',
            'activo' => true,
        ]);
    }
}
