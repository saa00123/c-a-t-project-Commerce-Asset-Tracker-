<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        $users = User::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users
        ]);
    }

    public function approve(User $user): RedirectResponse
    {
        $user->update([
            'is_approved' => true
        ]);

        return back();
    }

    public function reject(User $user): RedirectResponse
    {
        $user->delete();

        return back();
    }
}
