<?php
namespace App\Helpers;

use Psr\Http\Message\ResponseInterface as Response;

class JsonResponder {
  public static function success(Response $res, $data = null, int $code = 200) {
    $res->getBody()->write(json_encode([
      'ok' => true,
      'data' => $data
    ], JSON_UNESCAPED_UNICODE));
    return $res->withHeader('Content-Type', 'application/json')->withStatus($code);
  }

  public static function error(Response $res, string $message, int $code = 400, $errors = null) {
    $res->getBody()->write(json_encode([
      'ok' => false,
      'message' => $message,
      'errors' => $errors
    ], JSON_UNESCAPED_UNICODE));
    return $res->withHeader('Content-Type', 'application/json')->withStatus($code);
  }
}
