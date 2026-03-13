<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Channel extends Model
{
    protected $fillable = ['name', 'specs'];

    protected $casts = [
        'specs' => 'array',
    ];
}
