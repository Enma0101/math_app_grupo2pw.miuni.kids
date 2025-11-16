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

public function getStarsForLevel($req, Response $res, array $args)
{
    $levelId = (int)$args['levelId'];

    $level = LevelConfig::select('Stars_for_exercises')
        ->where('id_level', $levelId)
        ->first();

    if (!$level) {
        return JR::error($res, "Nivel no encontrado", 404);
    }

    return JR::success($res, [
        'level_id' => $levelId,
        'stars' => $level->Stars_for_exercises
    ]);
}

}

