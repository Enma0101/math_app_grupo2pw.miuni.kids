<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserProgress extends Model
{
    protected $table = 'user_progress';
    protected $primaryKey = 'id_progress';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'total_stars',
        'current_streak',
        'last_update'
    ];
}
