<?php
use App\Controllers\AuthController;
use App\Controllers\UserController;
use App\Controllers\LevelController;
use App\Controllers\ExerciseController;
use App\Controllers\ProgressController;
use Slim\Routing\RouteCollectorProxy;
use App\Middlewares\AuthMiddleware;

// Preflight CORS: responder vacío sin reenrutar (evita 500 y Method Not Allowed)
$app->options('/{routes:.+}', function($request, $response){
  return $response
    ->withHeader('Access-Control-Allow-Origin', $_ENV['CORS_ORIGIN'] ?? '*')
    ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
    ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
});

// Salud
$app->get('/', fn($req,$res)=>\App\Helpers\JsonResponder::success($res, ['hello'=>'math_app']));

// AUTH
$app->post('/auth/register', [AuthController::class, 'register']);
$app->post('/auth/login',    [AuthController::class, 'login']);

// USERS (CRUD mínimo)
$app->group('/users', function(RouteCollectorProxy $g){
  $g->get('/{id}',   [UserController::class, 'show']);
  $g->put('/{id}',   [UserController::class, 'update']);   // actualizar perfil
  $g->delete('/{id}',[UserController::class, 'destroy']);  // opcional (admin)
})->add(new AuthMiddleware());

// LEVELS (lectura y admin opcional)
$app->get('/levels',           [LevelController::class, 'index']);
// $app->post('/levels',       [LevelController::class, 'store']);   // si habilitas admin
// $app->put('/levels/{id}',   [LevelController::class, 'update']);
// $app->delete('/levels/{id}',[LevelController::class, 'destroy']);

// EXERCISES
$app->get('/exercises/{type}/{levelId}', [ExerciseController::class, 'generate']); // 8 ejercicios
$app->post('/exercises/answer',          [ExerciseController::class, 'saveAnswer'])->add(new AuthMiddleware());
$app->post('/exercises/select',          [ExerciseController::class, 'storeSelection'])->add(new AuthMiddleware()); // registra solo la selección de nivel/operación
$app->post('/exercises/attempt',         [ExerciseController::class, 'storeAttempt'])->add(new AuthMiddleware()); // almacena un intento (correcto/incorrecto) sin validación

// PROGRESS
$app->get('/progress/{userId}',  [ProgressController::class, 'show'])->add(new AuthMiddleware());
$app->post('/progress/update',   [ProgressController::class, 'updateTotals'])->add(new AuthMiddleware());
$app->post('/progress/reset',    [ProgressController::class, 'reset'])->add(new AuthMiddleware());
