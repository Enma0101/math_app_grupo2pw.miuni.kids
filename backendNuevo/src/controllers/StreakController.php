<?php
namespace App\Controllers;

use App\Helpers\JsonResponder as JR;
use App\Models\UserStreak;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class StreakController {

    // GET /progress/streak/{userId}
    public function getStreak(Request $req, Response $res, array $args) {
        try {
            $userId = (int)$args['userId'];
            $params = $req->getQueryParams();
            $operationType = $params['operation_type'] ?? null;

            error_log("🔍 Buscando streak para user_id: {$userId}, operation_type: " . ($operationType ?? 'todos'));

            if ($operationType) {
                $streak = UserStreak::where('user_id', $userId)
                    ->where('operation_type', $operationType)
                    ->first();

                if (!$streak) {
                    return JR::success($res, [
                        'user_id' => $userId,
                        'operation_type' => $operationType,
                        'total_streak' => 0,
                        'facil_count' => 0,
                        'medio_count' => 0,
                        'dificil_count' => 0
                    ]);
                }

                return JR::success($res, $streak);
            } else {
                $streaks = UserStreak::where('user_id', $userId)->get();
                return JR::success($res, $streaks);
            }
        } catch (\Exception $e) {
            error_log("💥 Exception en getStreak: " . $e->getMessage());
            return JR::error($res, "Error al obtener racha: " . $e->getMessage(), 500);
        }
    }

    // POST /progress/streak/update
    public function updateStreak(Request $req, Response $res) {
        try {
            $b = $req->getParsedBody();
            
            error_log('📥 Body recibido en updateStreak: ' . json_encode($b));
            
            if (!isset($b['user_id'], $b['operation_type'], $b['difficulty'])) {
                return JR::error($res, 'user_id, operation_type y difficulty son requeridos', 422);
            }

            $userId = (int)$b['user_id'];
            $operation = $b['operation_type'];
            $difficulty = strtolower($b['difficulty']);

            error_log("👤 Actualizando streak - user_id: {$userId}, operation: {$operation}, difficulty: {$difficulty}");

            $streak = UserStreak::where('user_id', $userId)
                ->where('operation_type', $operation)
                ->first();

            if (!$streak) {
                error_log("➕ Creando nuevo registro de streak");
                $streak = new UserStreak();
                $streak->user_id = $userId;
                $streak->operation_type = $operation;
                $streak->total_streak = 0;
                $streak->facil_count = 0;
                $streak->medio_count = 0;
                $streak->dificil_count = 0;
            }

            switch($difficulty) {
                case 'facil':
                case 'fácil':
                    $streak->facil_count += 1;
                    break;
                case 'medio':
                    $streak->medio_count += 1;
                    break;
                case 'dificil':
                case 'difícil':
                    $streak->dificil_count += 1;
                    break;
                default:
                    return JR::error($res, "Dificultad inválida: {$difficulty}", 422);
            }

            $streak->total_streak = $streak->facil_count + $streak->medio_count + $streak->dificil_count;
            $streak->last_update = date('Y-m-d H:i:s');
            
            if ($streak->save()) {
                error_log("✅ Streak actualizado: total={$streak->total_streak}");
                return JR::success($res, $streak);
            } else {
                return JR::error($res, "No se pudo guardar el streak", 500);
            }
        } catch (\Exception $e) {
            error_log("💥 Exception en updateStreak: " . $e->getMessage());
            return JR::error($res, "Error interno: " . $e->getMessage(), 500);
        }
    }

    // POST /progress/streak/reset
    // Resetear racha específica por nivel (dificultad)
    public function resetStreak(Request $req, Response $res) {
        try {
            $b = $req->getParsedBody();
            
            error_log('📥 Body recibido en resetStreak: ' . json_encode($b));
            
            if (!isset($b['user_id']) || !isset($b['operation_type']) || !isset($b['difficulty'])) {
                return JR::error($res, 'user_id, operation_type y difficulty son requeridos', 422);
            }

            $userId = (int)$b['user_id'];
            $operationType = $b['operation_type'];
            $difficulty = strtolower($b['difficulty']);

            error_log("🔄 Reseteando streak - user_id: {$userId}, operation: {$operationType}, difficulty: {$difficulty}");

            $streak = UserStreak::where('user_id', $userId)
                ->where('operation_type', $operationType)
                ->first();

            if ($streak) {
                // Resetear solo el contador específico
                switch($difficulty) {
                    case 'facil':
                    case 'fácil':
                        $oldValue = $streak->facil_count;
                        $streak->facil_count = 0;
                        error_log("🔄 Reseteando facil_count: {$oldValue} → 0");
                        break;
                    case 'medio':
                        $oldValue = $streak->medio_count;
                        $streak->medio_count = 0;
                        error_log("🔄 Reseteando medio_count: {$oldValue} → 0");
                        break;
                    case 'dificil':
                    case 'difícil':
                        $oldValue = $streak->dificil_count;
                        $streak->dificil_count = 0;
                        error_log("🔄 Reseteando dificil_count: {$oldValue} → 0");
                        break;
                    default:
                        return JR::error($res, "Dificultad inválida: {$difficulty}", 422);
                }
                
                // Recalcular total
                $streak->total_streak = $streak->facil_count + $streak->medio_count + $streak->dificil_count;
                $streak->last_update = date('Y-m-d H:i:s');
                $streak->save();
                
                error_log("✅ Streak reseteado exitosamente. Nuevo total: {$streak->total_streak}");
                
                return JR::success($res, [
                    'reset' => true,
                    'user_id' => $userId,
                    'operation_type' => $operationType,
                    'difficulty' => $difficulty,
                    'new_total_streak' => $streak->total_streak
                ]);
            } else {
                error_log("⚠️ No existe registro de streak para resetear");
                return JR::success($res, [
                    'reset' => false,
                    'message' => 'No existe racha para resetear',
                    'user_id' => $userId,
                    'operation_type' => $operationType
                ]);
            }
        } catch (\Exception $e) {
            error_log("💥 Exception en resetStreak: " . $e->getMessage());
            return JR::error($res, "Error al resetear streak: " . $e->getMessage(), 500);
        }
    }
}