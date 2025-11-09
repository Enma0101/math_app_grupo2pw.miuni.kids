<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id_level
 * @property string $level_name   // 'facil'|'medio'|'dificil'
 * @property int $Stars_for_exercises
 */
class LevelConfig extends Model {
  protected $table = 'levels_config';
  protected $primaryKey = 'id_level';
  public $timestamps = false;

  protected $fillable = ['level_name','Stars_for_exercises'];

  protected $casts = [
    'Stars_for_exercises' => 'integer'
  ];
}
