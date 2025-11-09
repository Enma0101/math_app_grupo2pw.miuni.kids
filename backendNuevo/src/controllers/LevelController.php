<?php
namespace App\Controllers;

use App\Helpers\JsonResponder as JR;
use App\Models\LevelConfig;
use Psr\Http\Message\ResponseInterface as Response;

class LevelController {
  // GET /levels
  public function index($req, Response $res) {
    return JR::success($res, LevelConfig::orderBy('id_level')->get());
  }
}
