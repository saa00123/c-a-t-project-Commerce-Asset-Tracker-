<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ChannelController;
use App\Http\Controllers\AssetController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Channel;
use App\Models\Asset;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

use App\Models\ActivityLog;

Route::get('/dashboard', function (Illuminate\Http\Request $request) {
    $workspaceId = $request->user()->workspace_id;

    $stats = [
        'products' => Product::where('workspace_id', $workspaceId)->count(),
        'channels' => Channel::where('workspace_id', $workspaceId)->count(),
        'assets' => Asset::where('workspace_id', $workspaceId)->count(),
    ];

    // ActivityLog
    $recentActivities = ActivityLog::with('user')
        ->where('workspace_id', $workspaceId)
        ->latest()
        ->take(5)
        ->get()
        ->map(function ($log) {
            return [
                'id' => $log->id,
                'user_name' => $log->user->name,
                'description' => $log->description,
                'created_at' => $log->created_at->diffForHumans(),
            ];
        });

    return Inertia::render('Dashboard', [
        'stats' => $stats,
        'recentActivities' => $recentActivities,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Products
    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

    // Channels
    Route::get('/channels', [ChannelController::class, 'index'])->name('channels.index');
    Route::post('/channels', [ChannelController::class, 'store'])->name('channels.store');
    Route::delete('/channels/{channel}', [ChannelController::class, 'destroy'])->name('channels.destroy');

    // Assets
    Route::get('/assets', [AssetController::class, 'index'])->name('assets.index');
    Route::post('/products/{product}/assets', [AssetController::class, 'store'])->name('assets.store');
    Route::delete('/assets/{asset}', [AssetController::class, 'destroy'])->name('assets.destroy');
    Route::get('/assets/{asset}', [AssetController::class, 'show'])->name('assets.show');
    Route::post('/assets/{asset}/channels', [AssetController::class, 'syncChannels'])->name('assets.channels.sync');
    Route::patch('/assets/{asset}/status', [AssetController::class, 'updateStatus'])->name('assets.status.update');
    Route::patch('/assets/{asset}/custom-fields', [AssetController::class, 'updateCustomFields'])->name('assets.custom_fields.update');
});

require __DIR__.'/auth.php';
