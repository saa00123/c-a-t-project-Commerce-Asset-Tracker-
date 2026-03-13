<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Workspace extends Model
{
    use HasUuids;

    protected $fillable = ['name', 'plan_tier'];

    public function users() {
        return $this->hasMany(User::class);
    }

    public function products() {
        return $this->hasMany(Product::class);
    }

    public function assets() {
        return $this->hasMany(Asset::class);
    }
}
