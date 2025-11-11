<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id_progress
 * @property int $user_id
 * @property int $level
 * @property int $total_stars
 * @property int $current_streak
 * @property \Carbon\CarbonImmutable|null $last_update
 */
class UserProgress extends Model {
  protected $table = 'user_progress';
  protected $primaryKey = 'id_progress';
  public $timestamps = false;

  protected $fillable = ['user_id','level','total_stars','current_streak','last_update'];

  protected $casts = [
    'user_id'        => 'integer',
    'level'          => 'integer',
    'total_stars'    => 'integer',
    'current_streak' => 'integer',
    'last_update'    => 'immutable_datetime',
  ];

  public function user(){ return $this->belongsTo(User::class, 'user_id'); }
}
