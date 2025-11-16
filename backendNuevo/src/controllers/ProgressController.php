<?php
namespace App\Controllers;

use App\Helpers\JsonResponder as JR;
use App\Models\UserProgress;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class ProgressController {

    // ------------------------------
    // GET /progress/{userId}
    // Obtener todo el progreso del usuario
    // ------------------------------
    public function show(Request $req, Response $res, array $args) {
        $userId = (int)$args['userId'];

        $progress = UserProgress::where('user_id', $userId)->first();

        // Si no existe, devolver progreso vacío
        if (!$progress) {
            return JR::success($res, [
                'user_id'        => $userId,
                'total_stars'    => 0,
                'current_streak' => 0,
            ]);
        }

        return JR::success($res, $progress);
    }



    // ------------------------------
    // GET /progress/stars/{userId}
    // Obtener SOLO total_stars
    // ------------------------------
    public function getStars(Request $req, Response $res, array $args) {
        $userId = (int)$args['userId'];

        $progress = UserProgress::where('user_id', $userId)->first();

        return JR::success($res, [
            'user_id'     => $userId,
            'total_stars' => $progress ? $progress->total_stars : 0
        ]);
    }


    // ------------------------------
    // GET /progress/streak/{userId}
    // Obtener SOLO current_streak
    // ------------------------------
    public function getStreak(Request $req, Response $res, array $args) {
        $userId = (int)$args['userId'];

        $progress = UserProgress::where('user_id', $userId)->first();

        return JR::success($res, [
            'user_id'        => $userId,
            'current_streak' => $progress ? $progress->current_streak : 0
        ]);
    }



    // ------------------------------
    // POST /progress/update/stars
    // Actualizar total_stars
    // ------------------------------
    public function updateStars(Request $req, Response $res) {
        $b = $req->getParsedBody();

        if (!isset($b['user_id']) || !isset($b['total_stars']))
            return JR::error($res, "user_id y total_stars requeridos", 422);

        $userId = (int)$b['user_id'];

        $progress = UserProgress::firstOrCreate(
            ['user_id' => $userId],
            ['total_stars' => 0, 'current_streak' => 0]
        );

        $progress->total_stars = (int)$b['total_stars'];
        $progress->last_update = date('Y-m-d H:i:s');
        $progress->save();

        return JR::success($res, $progress);
    }



    // ------------------------------
    // POST /progress/update/streak
    // Actualizar current_streak
    // ------------------------------
    public function updateStreak(Request $req, Response $res) {
        $b = $req->getParsedBody();

        if (!isset($b['user_id']) || !isset($b['current_streak']))
            return JR::error($res, "user_id y current_streak requeridos", 422);

        $userId = (int)$b['user_id'];

        $progress = UserProgress::firstOrCreate(
            ['user_id' => $userId],
            ['total_stars' => 0, 'current_streak' => 0]
        );

        $progress->current_streak = (int)$b['current_streak'];
        $progress->last_update = date('Y-m-d H:i:s');
        $progress->save();

        return JR::success($res, $progress);
    }



    // ------------------------------
    // POST /progress/reset
    // Resetear progreso del usuario
    // ------------------------------
    public function reset(Request $req, Response $res) {
        $b = $req->getParsedBody();

        if (!isset($b['user_id']))
            return JR::error($res, "user_id requerido", 422);

        $userId = (int)$b['user_id'];

        $progress = UserProgress::where('user_id', $userId)->first();

        if ($progress) {
            $progress->total_stars    = 0;
            $progress->current_streak = 0;
            $progress->last_update    = date('Y-m-d H:i:s');
            $progress->save();
        }

        return JR::success($res, [
            'reset' => true,
            'user_id' => $userId
        ]);
    }
}
