<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Asset extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'product_id',
        'workspace_id',
        'title',
        'type',
        'status',
        'tags',
        'custom_fields',
    ];

    protected $casts = [
        'tags' => 'array',
        'custom_fields' => 'array',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function channels()
    {
        return $this->belongsToMany(Channel::class, 'channel_assets');
    }
}
