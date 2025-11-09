<?php
namespace App\Controllers;

use App\Helpers\JsonResponder as JR;
use App\Models\User;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class AuthController {
  // POST /auth/register
  public function register(Request $req, Response $res) {
    $b = $req->getParsedBody();

    // Validaciones mínimas
    if (empty($b['username']) || empty($b['password']) || empty($b['full_name'])
        || !isset($b['age']) || empty($b['gender']) || empty($b['date_birthday'])) {
      return JR::error($res, 'Campos requeridos faltantes', 422);
    }
    if (!in_array($b['gender'], ['mujer','hombre'], true)) {
      return JR::error($res, 'gender inválido', 422);
    }

    // Crear usuario
    try {
      $user = User::create([
        'username'       => $b['username'],
        'password_hash'  => password_hash($b['password'], PASSWORD_BCRYPT),
        'full_name'      => $b['full_name'],
        'age'            => (int)$b['age'],
        'gender'         => $b['gender'],
        'date_birthday'  => $b['date_birthday']
      ]);
      return JR::success($res, ['id_user'=>$user->id_user], 201);
    } catch (\Throwable $e) {
      return JR::error($res, 'No se pudo registrar: '.$e->getMessage(), 400);
    }
  }

  // POST /auth/login
  public function login(Request $req, Response $res) {
    $b = $req->getParsedBody();
    if (empty($b['username']) || empty($b['password'])) {
      return JR::error($res, 'Credenciales incompletas', 422);
    }
    $user = User::where('username', $b['username'])->first();
    if (!$user || !password_verify($b['password'], $user->password_hash)) {
      return JR::error($res, 'Usuario o contraseña inválidos', 401);
    }
    // Aquí podrías emitir un JWT. Por ahora devolvemos datos mínimos.
    return JR::success($res, [
      'id_user'  => $user->id_user,
      'username' => $user->username,
      'full_name'=> $user->full_name
    ]);
  }
}
