<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Channel extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'workspace_id',
        'name',
    ];

    public function assets()
    {
        return $this->belongsToMany(Asset::class, 'channel_assets');
    }
}
