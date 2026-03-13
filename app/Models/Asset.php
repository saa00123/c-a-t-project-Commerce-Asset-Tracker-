<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Asset extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = ['product_id', 'workspace_id', 'title', 'type', 'status', 'tags'];

    protected $casts = [
        'tags' => 'array',
    ];

    public function product() {
        return $this->belongsTo(Product::class);
    }

    public function workspace() {
        return $this->belongsTo(Workspace::class);
    }

    public function versions() {
        return $this->hasMany(AssetVersion::class);
    }

    public function comments() {
        return $this->hasMany(Comment::class);
    }
}
