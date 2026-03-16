<?php

use App\Models\Product;
use App\Models\Channel;
use App\Models\Asset;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => \Illuminate\Foundation\Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function (Request $request) {
    $workspaceId = $request->user()->workspace_id;

    $stats = [
        'products' => Product::where('workspace_id', $workspaceId)->count(),
        'channels' => Channel::where('workspace_id', $workspaceId)->count(),
        'assets' => Asset::where('workspace_id', $workspaceId)->count(),
    ];

    $statusCounts = Asset::where('workspace_id', $workspaceId)
        ->selectRaw('status, count(*) as count')
        ->groupBy('status')
        ->pluck('count', 'status')
        ->toArray();

    $workflowStats = [
        'DRAFT' => $statusCounts['DRAFT'] ?? 0,
        'IN_PROGRESS' => $statusCounts['IN_PROGRESS'] ?? 0,
        'REVIEW' => $statusCounts['REVIEW'] ?? 0,
        'APPROVED' => $statusCounts['APPROVED'] ?? 0,
        'DEPLOYED' => $statusCounts['DEPLOYED'] ?? 0,
    ];

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
        'workflowStats' => $workflowStats,
        'recentActivities' => $recentActivities,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [App\Http\Controllers\ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [App\Http\Controllers\ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [App\Http\Controllers\ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/products', [App\Http\Controllers\ProductController::class, 'index'])->name('products.index');
    Route::get('/products/create', [App\Http\Controllers\ProductController::class, 'create'])->name('products.create');
    Route::post('/products', [App\Http\Controllers\ProductController::class, 'store'])->name('products.store');
    Route::get('/products/{product}', [App\Http\Controllers\ProductController::class, 'show'])->name('products.show');
    Route::delete('/products/{product}', [App\Http\Controllers\ProductController::class, 'destroy'])->name('products.destroy');

    Route::get('/assets', [App\Http\Controllers\AssetController::class, 'index'])->name('assets.index');
    Route::post('/assets', [App\Http\Controllers\AssetController::class, 'store'])->name('assets.store');
    Route::post('/assets/{asset}/upload', [App\Http\Controllers\AssetController::class, 'uploadFile'])->name('assets.upload');
    Route::get('/assets/{asset}', [App\Http\Controllers\AssetController::class, 'show'])->name('assets.show');
    Route::post('/assets/{asset}/channels', [App\Http\Controllers\AssetController::class, 'syncChannels'])->name('assets.channels.sync');
    Route::patch('/assets/{asset}/status', [App\Http\Controllers\AssetController::class, 'updateStatus'])->name('assets.status.update');
    Route::patch('/assets/{asset}/custom-fields', [App\Http\Controllers\AssetController::class, 'updateCustomFields'])->name('assets.custom_fields.update');
    Route::delete('/assets/{asset}', [App\Http\Controllers\AssetController::class, 'destroy'])->name('assets.destroy');
    Route::delete('/assets/{asset}/file', [App\Http\Controllers\AssetController::class, 'removeFile'])->name('assets.remove_file');

    Route::get('/channels', [App\Http\Controllers\ChannelController::class, 'index'])->name('channels.index');
    Route::post('/channels', [App\Http\Controllers\ChannelController::class, 'store'])->name('channels.store');
    Route::delete('/channels/{channel}', [App\Http\Controllers\ChannelController::class, 'destroy'])->name('channels.destroy');
});

require __DIR__.'/auth.php';
