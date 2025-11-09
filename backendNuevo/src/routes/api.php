<?php
use App\Controllers\AuthController;
use App\Controllers\UserController;
use App\Controllers\LevelController;
use App\Controllers\ExerciseController;
use App\Controllers\ProgressController;
use Slim\Routing\RouteCollectorProxy;

// Preflight
$app->options('/{routes:.+}', fn($r,$h)=>$h->handle($r));

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
});

// LEVELS (lectura y admin opcional)
$app->get('/levels',           [LevelController::class, 'index']);
// $app->post('/levels',       [LevelController::class, 'store']);   // si habilitas admin
// $app->put('/levels/{id}',   [LevelController::class, 'update']);
// $app->delete('/levels/{id}',[LevelController::class, 'destroy']);

// EXERCISES
$app->get('/exercises/{type}/{levelId}', [ExerciseController::class, 'generate']); // 8 ejercicios
$app->post('/exercises/answer',          [ExerciseController::class, 'saveAnswer']);

// PROGRESS
$app->get('/progress/{userId}',  [ProgressController::class, 'show']);
$app->post('/progress/update',   [ProgressController::class, 'updateTotals']);
$app->post('/progress/reset',    [ProgressController::class, 'reset']);
