<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Supervisor',
            'email' => 'supervisor@admin.com',
            'password' => Hash::make('supervisor'),
            'role' => 'admin',
            'is_approved' => true,
        ]);

        for ($i = 1; $i <= 3; $i++) {
            User::create([
                'name' => "Test User {$i}",
                'email' => "test{$i}@cat.com",
                'password' => Hash::make('password'),
                'role' => 'user',
                'is_approved' => true,
            ]);
        }

        User::create([
            'name' => 'Pending User',
            'email' => 'wait@cat.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'is_approved' => false,
        ]);
    }
}
