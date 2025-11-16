<?php
namespace App\Middlewares;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Nyholm\Psr7\Response as NyholmResponse;

class CorsMiddleware {
    
    private string $origin;

    public function __construct(string $origin = '*') {
        $this->origin = $origin;
    }

    public function __invoke(Request $req, $handler): Response {

   
        if ($req->getMethod() === 'OPTIONS') {
            $res = new NyholmResponse();
            return $this->applyCorsHeaders($res);
        }

        $res = $handler->handle($req);
        return $this->applyCorsHeaders($res);
    }

    private function applyCorsHeaders(Response $res): Response {
        return $res
            ->withHeader('Access-Control-Allow-Origin', $this->origin)
            ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
            ->withHeader('Access-Control-Allow-Credentials', 'true');
    }
}
