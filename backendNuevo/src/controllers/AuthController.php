<?php
namespace App\Controllers;

use App\Helpers\JsonResponder as JR;
use App\Models\User;
use Firebase\JWT\JWT;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class AuthController
{
    // POST /auth/register
    public function register(Request $req, Response $res)
    {
        $b = $req->getParsedBody();

        // Validaciones mínimas
        if (
            empty($b['username']) || empty($b['password']) || empty($b['full_name'])
            || !isset($b['age']) || empty($b['gender']) || empty($b['date_birthday'])
        ) {
            return JR::error($res, 'Campos requeridos faltantes', 422);
        }
        if (!in_array($b['gender'], ['mujer', 'hombre'], true)) {
            return JR::error($res, 'gender inválido', 422);
        }
        // Validar edad como entero no negativo
        if (filter_var($b['age'], FILTER_VALIDATE_INT) === false || (int)$b['age'] < 0) {
            return JR::error($res, 'age debe ser un entero >= 0', 422);
        }
        // Validar formato de fecha YYYY-MM-DD
        $dt = \DateTime::createFromFormat('Y-m-d', $b['date_birthday']);
        $dateErrors = \DateTime::getLastErrors();
        if (!$dt || $dateErrors['warning_count'] > 0 || $dateErrors['error_count'] > 0) {
            return JR::error($res, 'date_birthday debe tener formato YYYY-MM-DD', 422);
        }

        // Unicidad de username
        if (\App\Models\User::where('username', $b['username'])->exists()) {
            return JR::error($res, 'El nombre de usuario ya está en uso', 409);
        }

        // Crear usuario
        try {
            $user = User::create([
                'username' => $b['username'],
                'password_hash' => password_hash($b['password'], PASSWORD_BCRYPT),
                'full_name' => $b['full_name'],
                'age' => (int) $b['age'],
                'gender' => $b['gender'],
                'date_birthday' => $b['date_birthday']
            ]);
            return JR::success($res, ['id_user' => $user->id_user], 201);
        } catch (\Throwable $e) {
            // Error amigable para duplicados
            if ($e instanceof \Illuminate\Database\QueryException && isset($e->errorInfo[1]) && (int)$e->errorInfo[1] === 1062) {
                return JR::error($res, 'El nombre de usuario ya está en uso', 409);
            }
            return JR::error($res, 'No se pudo registrar: ' . $e->getMessage(), 400);
        }
    }

    // POST /auth/login
    public function login(Request $req, Response $res)
    {
        $b = $req->getParsedBody();
        if (empty($b['username']) || empty($b['password'])) {
            return JR::error($res, 'Credenciales incompletas', 422);
        }
        $user = User::where('username', $b['username'])->first();
        if (!$user || !password_verify($b['password'], $user->password_hash)) {
            return JR::error($res, 'Usuario o contraseña inválidos', 401);
        }
        // Emitir JWT
        $secret = $_ENV['JWT_SECRET'] ?? null;
        if (!$secret) {
            return JR::error($res, 'JWT_SECRET no configurado en el servidor', 500);
        }
        $now = time();
        $exp = $now + (int)($_ENV['JWT_TTL'] ?? (60 * 60 * 24 * 7)); // 7 días por defecto
        $payload = [
            'iat' => $now,
            'exp' => $exp,
            'sub' => $user->id_user,
            'username' => $user->username
        ];
    $token = JWT::encode($payload, $secret, 'HS256');

        return JR::success($res, [
            'token' => $token,
            'user' => [
                'id_user' => $user->id_user,
                'username' => $user->username,
                'full_name' => $user->full_name
            ]
        ]);
    }
}
