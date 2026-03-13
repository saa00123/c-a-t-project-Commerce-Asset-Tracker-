<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasUuids;

    protected $fillable = ['asset_id', 'user_id', 'content', 'action_type'];

    public function asset() {
        return $this->belongsTo(Asset::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
