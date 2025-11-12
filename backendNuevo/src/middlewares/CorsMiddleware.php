<?php
namespace App\Middlewares;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class CorsMiddleware {
  private string $origin;
  public function __construct(string $origin = '*'){ $this->origin = $origin; }
  public function __invoke(Request $req, $handler): Response {
    $res = $handler->handle($req);
    return $res
      ->withHeader('Access-Control-Allow-Origin', $this->origin)
      ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
      ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  }
}
