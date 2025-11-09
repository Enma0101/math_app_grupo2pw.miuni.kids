<?php
namespace App\Controllers;

use App\Helpers\JsonResponder as JR;
use App\Models\User;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class UserController {
  // GET /users/{id}
  public function show(Request $req, Response $res, array $args) {
    $u = User::find($args['id']);
    if (!$u) return JR::error($res, 'Usuario no encontrado', 404);
    return JR::success($res, $u);
  }

  // PUT /users/{id}
  public function update(Request $req, Response $res, array $args) {
    $u = User::find($args['id']);
    if (!$u) return JR::error($res, 'Usuario no encontrado', 404);

    $b = $req->getParsedBody();
    // Permitimos actualizar nombre, edad, birthday, gender (no username)
    $u->full_name     = $b['full_name']    ?? $u->full_name;
    $u->age           = isset($b['age']) ? (int)$b['age'] : $u->age;
    $u->gender        = $b['gender']       ?? $u->gender;
    $u->date_birthday = $b['date_birthday']?? $u->date_birthday;

    if (isset($b['password']) && $b['password'] !== '') {
      $u->password_hash = password_hash($b['password'], PASSWORD_BCRYPT);
    }
    $u->save();
    return JR::success($res, $u);
  }

  // DELETE /users/{id} (opcional / admin)
  public function destroy(Request $req, Response $res, array $args) {
    $u = User::find($args['id']);
    if (!$u) return JR::error($res, 'Usuario no encontrado', 404);
    $u->delete();
    return JR::success($res, ['deleted'=>true]);
  }
}
