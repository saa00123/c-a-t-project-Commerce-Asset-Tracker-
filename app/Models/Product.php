<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'workspace_id',
        'sku',
        'name',
    ];

    public function assets()
    {
        return $this->hasMany(Asset::class);
    }
}
