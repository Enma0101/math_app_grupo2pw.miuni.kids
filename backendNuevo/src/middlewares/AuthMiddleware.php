<?php
namespace App\Middlewares;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Nyholm\Psr7\Response;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthMiddleware
{
    public function __invoke(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        try {
            $authHeader = $request->getHeaderLine('Authorization');

            if (empty($authHeader)) {
                return $this->error("Token no proporcionado", 401);
            }

            $token = str_replace('Bearer ', '', $authHeader);

            // Decodificar JWT
            $decoded = JWT::decode($token, new Key($_ENV['JWT_SECRET'], 'HS256'));

            // Pasar el usuario al request
            $request = $request->withAttribute('user', $decoded);

            return $handler->handle($request);

        } catch (\Exception $e) {
            return $this->error("Token inválido: " . $e->getMessage(), 401);
        }
    }

    private function error($message, $status)
    {
        $response = new Response();
        $response->getBody()->write(json_encode([
            'ok' => false,
            'message' => $message
        ], JSON_UNESCAPED_UNICODE));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
            ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->withStatus($status);
    }
}
