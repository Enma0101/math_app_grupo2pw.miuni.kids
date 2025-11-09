<?php
namespace App\Controllers;

use App\Helpers\JsonResponder as JR;
use App\Models\UserProgress;
use App\Models\LevelConfig;
use App\Models\UserExercise;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class ProgressController {
  // GET /progress/{userId}
  public function show(Request $req, Response $res, array $args) {
    $userId = (int)$args['userId'];
    $p = UserProgress::where('user_id', $userId)->first();
    return JR::success($res, $p ?? (object)[]);
  }

  // POST /progress/update
  // Suma estrellas según respuestas correctas recientes (o payload explícito)
  public function updateTotals(Request $req, Response $res) {
    $b = $req->getParsedBody();
    if (!isset($b['user_id'])) return JR::error($res, 'user_id requerido', 422);

    $userId = (int)$b['user_id'];
    $progress = UserProgress::firstOrCreate(['user_id'=>$userId]);

    // Si te envían 'correct_last' y 'level_id', calculamos estrellas:
    $addedStars = 0;
    if (isset($b['correct_last'], $b['level_id'])) {
      $level = LevelConfig::find((int)$b['level_id']);
      if ($level) $addedStars = ((int)$b['correct_last']) * (int)$level->Stars_for_exercises;
    }

    // Alternativa: podrías contar correctos del último “bloque de 8” usando UserExercise.

    $progress->total_stars    += $addedStars;
    $progress->current_streak += (int)($b['streak_delta'] ?? 0);
    if (isset($b['level'])) $progress->level = (int)$b['level'];
    $progress->last_update = date('Y-m-d H:i:s');
    $progress->save();

    return JR::success($res, $progress);
  }

  // POST /progress/reset
  public function reset(Request $req, Response $res) {
    $b = $req->getParsedBody();
    if (!isset($b['user_id'])) return JR::error($res, 'user_id requerido', 422);

    $p = UserProgress::where('user_id', (int)$b['user_id'])->first();
    if (!$p) return JR::success($res, ['reset'=>true]); // ya estaba en vacío

    $p->level = 1;
    $p->total_stars = 0;
    $p->current_streak = 0;
    $p->last_update = date('Y-m-d H:i:s');
    $p->save();

    return JR::success($res, ['reset'=>true, 'progress'=>$p]);
  }
}
