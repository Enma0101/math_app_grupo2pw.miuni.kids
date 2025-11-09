<?php
namespace App\Controllers;

use App\Helpers\JsonResponder as JR;
use App\Helpers\Validator as V;
use App\Models\UserExercise;
use App\Models\LevelConfig;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class ExerciseController
{
    // GET /exercises/{type}/{levelId}
    // Genera 8 ejercicios (dos números de 4 dígitos). Sumas o Restas.
    public function generate(Request $req, Response $res, array $args)
    {
        $type = $args['type'];       // 'Sumas'|'Restas'
        $levelId = (int) $args['levelId'];

        if (!in_array($type, ['Sumas', 'Restas'], true)) {
            return JR::error($res, 'operation_type inválido', 422);
        }
        $level = LevelConfig::find($levelId);
        if (!$level)
            return JR::error($res, 'level_id inválido', 422);

        $items = [];
        for ($i = 0; $i < 8; $i++) {
            $a = rand(1000, 9999);
            $b = rand(1000, 9999);
            $correct = ($type === 'Sumas') ? ($a + $b) : ($a - $b);
            $items[] = [
                'level_id' => $levelId,
                'operation_type' => $type,
                'number1' => $a,
                'number2' => $b,
                'correct_result' => $correct
            ];
        }
        return JR::success($res, $items);
    }

    // POST /exercises/answer
    // Guarda la respuesta del usuario y marca correcto/incorrecto.
    public function saveAnswer(Request $req, Response $res)
    {
        $b = $req->getParsedBody();

        // Validaciones mínimas y de rango 4 dígitos
        foreach (['user_id', 'level_id', 'operation_type', 'number1', 'number2', 'correct_result', 'user_answer'] as $k) {
            if (!isset($b[$k]))
                return JR::error($res, "Campo requerido: $k", 422);
        }
        if (!in_array($b['operation_type'], ['Sumas', 'Restas'], true)) {
            return JR::error($res, 'operation_type inválido', 422);
        }
        if (!V::intBetween($b['number1'], 1000, 9999) || !V::intBetween($b['number2'], 1000, 9999)) {
            return JR::error($res, 'number1/number2 deben ser de 4 dígitos (1000-9999)', 422);
        }

        $isCorrect = ((int) $b['user_answer'] === (int) $b['correct_result']);

        $record = UserExercise::create([
            'user_id' => (int) $b['user_id'],
            'level_id' => (int) $b['level_id'],
            'operation_type' => $b['operation_type'],
            'number1' => (int) $b['number1'],
            'number2' => (int) $b['number2'],
            'correct_result' => (int) $b['correct_result'],
            'user_answer' => (int) $b['user_answer'],
            'is_correct' => $isCorrect,
            'solved_at' => date('Y-m-d H:i:s'),
            'is_blocked' => (bool) ($b['is_blocked'] ?? false)
        ]);

        return JR::success($res, [
            'saved' => true,
            'exercise' => $record
        ], 201);
    }
}
