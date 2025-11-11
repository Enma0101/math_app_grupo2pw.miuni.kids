<?php
namespace App\Middlewares;

use App\Helpers\JsonResponder as JR;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class AuthMiddleware {
    public function __invoke(Request $req, $handler): Response {
        $auth = $req->getHeaderLine('Authorization');
        if (!preg_match('/^Bearer\s+(.*)$/i', $auth, $m)) {
            $res = new \Nyholm\Psr7\Response();
            return JR::error($res, 'Token faltante', 401);
        }
        $token = $m[1];
        $secret = $_ENV['JWT_SECRET'] ?? null;
        if (!$secret) {
            $res = new \Nyholm\Psr7\Response();
            return JR::error($res, 'JWT_SECRET no configurado', 500);
        }
        try {
            $decoded = \Firebase\JWT\JWT::decode($token, new \Firebase\JWT\Key($secret, 'HS256'));
        } catch (\Throwable $e) {
            $res = new \Nyholm\Psr7\Response();
            return JR::error($res, 'Token inválido: '.$e->getMessage(), 401);
        }
        // Propagar user_id autenticado
        $req = $req->withAttribute('auth_user_id', $decoded->sub ?? null);
        return $handler->handle($req);
    }
}
