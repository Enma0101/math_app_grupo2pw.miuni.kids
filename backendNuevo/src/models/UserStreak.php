<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserStreak extends Model
{
    protected $table = 'user_streaks';
    
   
    protected $primaryKey = 'id_streak';
    
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'operation_type',
        'total_streak',
        'facil_count',
        'medio_count',
        'dificil_count',
        'last_update'
    ];

  
    public static function boot()
    {
        parent::boot();

        static::saving(function ($model) {
            $model->last_update = date('Y-m-d H:i:s');
        });
    }
}