<?php
namespace App\Controllers;

use App\Helpers\JsonResponder as JR;
use App\Models\User;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class UserController
{
    // GET /users/{id}
    public function show(Request $req, Response $res, array $args)
    {
        $u = User::find($args['id']);
        if (!$u)
            return JR::error($res, 'Usuario no encontrado', 404);
        // Evitar exponer password_hash por si el $hidden no aplicara
        $safe = [
            'id_user' => $u->id_user,
            'username' => $u->username,
            'full_name' => $u->full_name,
            'age' => $u->age,
            'gender' => $u->gender,
            'date_birthday' => $u->date_birthday,
            'date_registered' => $u->date_registered,
        ];
        return JR::success($res, $safe);
    }

    // PUT /users/{id}
    public function update(Request $req, Response $res, array $args)
    {
        $u = User::find($args['id']);
        if (!$u)
            return JR::error($res, 'Usuario no encontrado', 404);

        $b = $req->getParsedBody();
        // Validaciones opcionales: gender y age si vienen
        if (isset($b['gender']) && !in_array($b['gender'], ['mujer', 'hombre'], true)) {
            return JR::error($res, 'gender inválido', 422);
        }
        if (isset($b['age']) && (filter_var($b['age'], FILTER_VALIDATE_INT) === false || (int) $b['age'] < 0)) {
            return JR::error($res, 'age debe ser un entero >= 0', 422);
        }
        if (isset($b['date_birthday'])) {
            $dt = \DateTime::createFromFormat('Y-m-d', $b['date_birthday']);
            $errs = \DateTime::getLastErrors();
            if (!$dt || $errs['warning_count'] > 0 || $errs['error_count'] > 0) {
                return JR::error($res, 'date_birthday debe tener formato YYYY-MM-DD', 422);
            }
        }
        // Permitimos actualizar nombre, edad, birthday, gender (no username)
        $u->full_name = $b['full_name'] ?? $u->full_name;
        $u->age = isset($b['age']) ? (int) $b['age'] : $u->age;
        $u->gender = $b['gender'] ?? $u->gender;
        $u->date_birthday = $b['date_birthday'] ?? $u->date_birthday;

        if (isset($b['password']) && $b['password'] !== '') {
            $u->password_hash = password_hash($b['password'], PASSWORD_BCRYPT);
        }
        $u->save();
        $safe = [
            'id_user' => $u->id_user,
            'username' => $u->username,
            'full_name' => $u->full_name,
            'age' => $u->age,
            'gender' => $u->gender,
            'date_birthday' => $u->date_birthday,
            'date_registered' => $u->date_registered,
        ];
        return JR::success($res, $safe);
    }

    // DELETE /users/{id} (opcional / admin)
    public function destroy(Request $req, Response $res, array $args)
    {
        $u = User::find($args['id']);
        if (!$u)
            return JR::error($res, 'Usuario no encontrado', 404);
        $u->delete();
        return JR::success($res, ['deleted' => true]);
    }
}
