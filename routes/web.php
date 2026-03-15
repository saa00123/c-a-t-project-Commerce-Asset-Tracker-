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

Route::get('/dashboard', function (Illuminate\Http\Request $request) {
    $workspaceId = $request->user()->workspace_id;

    $stats = [
        'products' => Product::where('workspace_id', $workspaceId)->count(),
        'channels' => Channel::where('workspace_id', $workspaceId)->count(),
        'assets' => Asset::where('workspace_id', $workspaceId)->count(),
    ];

    return Inertia::render('Dashboard', [
        'stats' => $stats
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
    Route::get('/assets/{asset}', [App\Http\Controllers\AssetController::class, 'show'])->name('assets.show');
    Route::post('/assets/{asset}/channels', [AssetController::class, 'syncChannels'])->name('assets.channels.sync');
});

require __DIR__.'/auth.php';
