<?php
use App\Controllers\AuthController;
use App\Controllers\UserController;
use App\Controllers\LevelController;
use App\Controllers\ExerciseController;
use App\Controllers\ProgressController;
use App\Controllers\StreakController;
use Slim\Routing\RouteCollectorProxy;
use App\Middlewares\AuthMiddleware;


$app->get('/', fn($req,$res)=>\App\Helpers\JsonResponder::success($res, ['hello'=>'math_app']));

$app->post('/auth/register', [AuthController::class, 'register']);
$app->post('/auth/login',    [AuthController::class, 'login']);

$app->group('/users', function(RouteCollectorProxy $g){
  $g->get('/{id}',   [UserController::class, 'show']);
  $g->put('/{id}',   [UserController::class, 'update']);
  $g->delete('/{id}',[UserController::class, 'destroy']);
})->add(new AuthMiddleware());

$app->group('/levels', function(RouteCollectorProxy $g){
    $g->get('/{levelId}/stars', [LevelController::class, 'getStarsForLevel']);
})->add(new AuthMiddleware());

$app->group('/exercises', function(RouteCollectorProxy $g){
  $g->post('/save-batch',    [ExerciseController::class, 'saveBatchExercises']);
  $g->get('/user/{userId}',  [ExerciseController::class, 'getUserExercises']);
  $g->put('/{exerciseId}',   [ExerciseController::class, 'updateExercise']);
  $g->delete('/delete-level',[ExerciseController::class, 'deleteLevelExercises']);
})->add(new AuthMiddleware());

$app->group('/progress', function(RouteCollectorProxy $g){
    $g->get('/{userId}', [ProgressController::class, 'show']);
    $g->get('/stars/{userId}', [ProgressController::class, 'getStars']);
    $g->post('/update/stars', [ProgressController::class, 'updateStars']);
   // Streaks
    $g->get('/streak/{userId}', [StreakController::class, 'getStreak']);
    $g->post('/streak/update', [StreakController::class, 'updateStreak']);
    $g->post('/streak/reset', [StreakController::class, 'resetStreak']); // ✅ NUEVA


})->add(new AuthMiddleware());