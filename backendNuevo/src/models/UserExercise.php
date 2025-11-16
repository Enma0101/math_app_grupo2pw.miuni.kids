<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id_exercise
 * @property int $user_id
 * @property int $level_id
 * @property string $operation_type  // 'Sumas'|'Restas'
 * @property int $number1
 * @property int $number2
 * @property int $correct_result
 * @property int|null $user_answer
 * @property bool $is_correct
 * @property \Carbon\CarbonImmutable|null $solved_at
 */
class UserExercise extends Model {
  protected $table = 'user_exercises';
  protected $primaryKey = 'id_exercise';
  public $timestamps = false;

  protected $fillable = [
    'user_id','level_id','operation_type','number1','number2',
    'correct_result','user_answer','is_correct','solved_at',
  ];

  protected $casts = [
    'user_id'        => 'integer',
    'level_id'       => 'integer',
    'number1'        => 'integer',
    'number2'        => 'integer',
    'correct_result' => 'integer',
    'user_answer'    => 'integer',
    'is_correct'     => 'boolean',
    'solved_at'      => 'immutable_datetime',
  ];
}
