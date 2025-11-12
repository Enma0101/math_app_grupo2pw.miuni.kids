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
            if ($type === 'Restas' && $a < $b) {
                // Asegurar restas no negativas: mayor - menor
                [$a, $b] = [$b, $a];
            }
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
        foreach (['user_id', 'level_id', 'operation_type', 'number1', 'number2', 'user_answer'] as $k) {
            if (!isset($b[$k]))
                return JR::error($res, "Campo requerido: $k", 422);
        }
        if (!in_array($b['operation_type'], ['Sumas', 'Restas'], true)) {
            return JR::error($res, 'operation_type inválido', 422);
        }
        if (!V::intBetween($b['number1'], 1000, 9999) || !V::intBetween($b['number2'], 1000, 9999)) {
            return JR::error($res, 'number1/number2 deben ser de 4 dígitos (1000-9999)', 422);
        }
        // Recalcular el resultado correcto en el servidor
        $n1 = (int)$b['number1'];
        $n2 = (int)$b['number2'];
        $op = $b['operation_type'];
        if ($op === 'Restas' && $n1 < $n2) {
            // Validar que no haya restas negativas (según requisito)
            return JR::error($res, 'Para Restas, number1 debe ser >= number2', 422);
        }
        $correct = ($op === 'Sumas') ? ($n1 + $n2) : ($n1 - $n2);
        $isCorrect = ((int) $b['user_answer'] === (int) $correct);

        $record = UserExercise::create([
            'user_id' => (int) $b['user_id'],
            'level_id' => (int) $b['level_id'],
            'operation_type' => $b['operation_type'],
            'number1' => $n1,
            'number2' => $n2,
            'correct_result' => (int) $correct,
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

    // POST /exercises/select
    // Registra SOLO la selección de nivel y tipo de operación.
    // Requisito: el backend almacena sin validar (confía en el front).
    public function storeSelection(Request $req, Response $res)
    {
        $b = $req->getParsedBody() ?: [];

        // Sin validaciones rígidas: tomar lo que venga del front
        // Campos mínimos esperados: user_id, level_id, operation_type
        $record = UserExercise::create([
            'user_id' => isset($b['user_id']) ? (int)$b['user_id'] : null,
            'level_id' => isset($b['level_id']) ? (int)$b['level_id'] : null,
            'operation_type' => $b['operation_type'] ?? null,
            // Placeholders para columnas NOT NULL del esquema
            'number1' => 0,
            'number2' => 0,
            'correct_result' => 0,
            'user_answer' => null,
            'is_correct' => false,
            'solved_at' => null,
            'is_blocked' => false,
        ]);

        return JR::success($res, [
            'saved' => true,
            'selection' => $record
        ], 201);
    }

    // POST /exercises/attempt
    // Almacena un intento (correcto/incorrecto) tal cual lo envía el frontend, sin validaciones.
    public function storeAttempt(Request $req, Response $res)
    {
        $b = $req->getParsedBody() ?: [];

        $record = UserExercise::create([
            'user_id'        => isset($b['user_id']) ? (int)$b['user_id'] : null,
            'level_id'       => isset($b['level_id']) ? (int)$b['level_id'] : null,
            'operation_type' => $b['operation_type'] ?? null,
            'number1'        => isset($b['number1']) ? (int)$b['number1'] : 0,
            'number2'        => isset($b['number2']) ? (int)$b['number2'] : 0,
            'correct_result' => isset($b['correct_result']) ? (int)$b['correct_result'] : 0,
            'user_answer'    => isset($b['user_answer']) && $b['user_answer'] !== '' ? (int)$b['user_answer'] : null,
            'is_correct'     => (bool)($b['is_correct'] ?? false),
            'is_blocked'     => isset($b['is_blocked']) ? (bool)$b['is_blocked'] : false,
            'solved_at'      => $b['solved_at'] ?? date('Y-m-d H:i:s'),
        ]);

        return JR::success($res, [
            'saved' => true,
            'attempt' => $record
        ], 201);
    }
}
