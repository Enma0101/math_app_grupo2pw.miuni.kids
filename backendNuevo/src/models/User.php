<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id_user
 * @property string $username
 * @property string $password_hash
 * @property string $full_name
 * @property int $age
 * @property string $gender   // 'mujer'|'hombre'
 * @property \Carbon\CarbonImmutable $date_birthday
 * @property \Carbon\CarbonImmutable|null $date_registered
 */
class User extends Model
{
    protected $table = 'users';
    protected $primaryKey = 'id_user';
    public $timestamps = false;

    protected $fillable = [
        'username',
        'password_hash',
        'full_name',
        'age',
        'gender',
        'date_birthday',
        'date_registered'
    ];

    protected $casts = [
        'age' => 'integer',
        'date_birthday' => 'immutable_date',
        'date_registered' => 'immutable_datetime',
    ];

    public function progress()
    {
        return $this->hasOne(UserProgress::class, 'user_id');
    }
    public function exercises()
    {
        return $this->hasMany(UserExercise::class, 'user_id');
    }
}
