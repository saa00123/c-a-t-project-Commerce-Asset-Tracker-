<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class AssetVersion extends Model
{
    use HasUuids;

    protected $fillable = ['asset_id', 'uploaded_by', 'version_number', 'file_path', 'file_size', 'is_current'];

    public function asset() {
        return $this->belongsTo(Asset::class);
    }

    public function uploader() {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
