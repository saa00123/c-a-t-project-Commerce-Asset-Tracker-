<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Workspace;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $workspace = Workspace::create([
            'name' => 'C.A.T. Default Workspace',
            'plan_tier' => 'Pro',
        ]);

        User::create([
            'name' => 'Admin',
            'email' => 'admin@cat.com',
            'password' => Hash::make('password'),
            'workspace_id' => $workspace->id,
            'role' => 'Admin',
        ]);

        Product::create([
            'workspace_id' => $workspace->id,
            'sku' => 'SKU-1001',
            'name' => 'Summer Basic T-Shirt',
        ]);

        Product::create([
            'workspace_id' => $workspace->id,
            'sku' => 'SKU-1002',
            'name' => 'Classic Denim Pants',
        ]);
    }
}
