<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = ['workspace_id', 'sku', 'name', 'custom_attributes'];

    protected $casts = [
        'custom_attributes' => 'array',
    ];

    public function workspace() {
        return $this->belongsTo(Workspace::class);
    }

    public function assets() {
        return $this->hasMany(Asset::class);
    }
}
