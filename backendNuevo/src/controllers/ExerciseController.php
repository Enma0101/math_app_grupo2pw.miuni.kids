<?php


namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Illuminate\Database\Capsule\Manager as DB;

class ExerciseController
{
  
   public function saveBatchExercises(Request $request, Response $response)
{
    try {
        $data = $request->getParsedBody();
        
        $userId = $data['user_id'] ?? null;
        $levelId = $data['level_id'] ?? null;
        $operationType = $data['operation_type'] ?? null;
        $exercises = $data['exercises'] ?? null;

        if (!$userId || !$levelId || !$operationType || !is_array($exercises)) {
            return $this->jsonResponse($response, false, 'Faltan datos requeridos', 400);
        }

        $batchData = [];
        foreach ($exercises as $ex) {
            $batchData[] = [
                'user_id' => $userId,
                'level_id' => $levelId,
                'operation_type' => $operationType,
                'number1' => $ex['number1'],
                'number2' => $ex['number2'],
                'correct_result' => $ex['correct_result'],
                'is_correct' => 0,
              
            ];
        }

        DB::table('user_exercises')->insert($batchData);

        return $this->jsonResponse($response, true, 'Ejercicios guardados exitosamente', 200, [
            'count' => count($exercises)
        ]);

    } catch (\Exception $e) {
        error_log("Error guardando ejercicios: " . $e->getMessage());
        return $this->jsonResponse($response, false, 'Error al guardar ejercicios: ' . $e->getMessage(), 500);
    }
}

public function getUserExercises(Request $request, Response $response, array $args)
{
    try {
        $userId = $args['userId'] ?? null;
        $params = $request->getQueryParams();
        $levelId = $params['level_id'] ?? null;
        $operationType = $params['operation_type'] ?? null;

        if (!$userId || !$levelId || !$operationType) {
            return $this->jsonResponse($response, false, 'Faltan parámetros requeridos', 400);
        }

        $exercises = DB::table('user_exercises')
            ->where('user_id', $userId)
            ->where('level_id', $levelId)
            ->where('operation_type', $operationType) 
            ->orderBy('id_exercise', 'ASC')
            ->get()
            ->toArray();

        return $this->jsonResponse($response, true, null, 200, $exercises);

    } catch (\Exception $e) {
        error_log("Error obteniendo ejercicios: " . $e->getMessage());
        return $this->jsonResponse($response, false, 'Error al obtener ejercicios: ' . $e->getMessage(), 500);
    }
}

public function deleteLevelExercises(Request $request, Response $response)
{
    try {
        $data = $request->getParsedBody();

        $userId = $data['user_id'] ?? null;
        $levelId = $data['level_id'] ?? null;
        $operationType = $data['operation_type'] ?? null;

        if (!$userId || !$levelId || !$operationType) {
            return $this->jsonResponse($response, false, 'Faltan datos requeridos', 400);
        }

        $deleted = DB::table('user_exercises')
            ->where('user_id', $userId)
            ->where('level_id', $levelId)
            ->where('operation_type', $operationType) 
            ->delete();

        return $this->jsonResponse($response, true, 'Ejercicios eliminados exitosamente', 200, [
            'deleted' => $deleted
        ]);

    } catch (\Exception $e) {
        error_log("Error eliminando ejercicios: " . $e->getMessage());
        return $this->jsonResponse($response, false, 'Error al eliminar ejercicios: ' . $e->getMessage(), 500);
    }
}

    public function updateExercise(Request $request, Response $response, array $args)
    {
        try {
            $exerciseId = $args['exerciseId'] ?? null;
            $data = $request->getParsedBody();

            $userAnswer = $data['user_answer'] ?? null;
            $isCorrect = isset($data['is_correct']) ? (int)$data['is_correct'] : 0;
            $solvedAt = $data['solved_at'] ?? date('Y-m-d H:i:s');

            $updated = DB::table('user_exercises')
                ->where('id_exercise', $exerciseId)
                ->update([
                    'user_answer' => $userAnswer,
                    'is_correct' => $isCorrect,
                    'solved_at' => $solvedAt
                  
                ]);

            if ($updated === 0) {
                return $this->jsonResponse($response, false, 'Ejercicio no encontrado', 404);
            }

            return $this->jsonResponse($response, true, 'Ejercicio actualizado exitosamente', 200, [
                'exerciseId' => $exerciseId
            ]);

        } catch (\Exception $e) {
            error_log("Error actualizando ejercicio: " . $e->getMessage());
            return $this->jsonResponse($response, false, 'Error al actualizar ejercicio: ' . $e->getMessage(), 500);
        }
    }


    

    
    private function jsonResponse(Response $response, bool $ok, ?string $message = null, int $status = 200, $data = null)
    {
        $payload = ['ok' => $ok];
        
        if ($message) {
            $payload['message'] = $message;
        }
        
        if ($data !== null) {
            $payload['data'] = $data;
        }

        $response->getBody()->write(json_encode($payload));
        return $response->withStatus($status)->withHeader('Content-Type', 'application/json');
    }
}