<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssetController extends Controller
{
    public function index(Request $request)
    {
        $assets = Asset::with('product')
            ->where('workspace_id', $request->user()->workspace_id)
            ->latest()
            ->get();

        return Inertia::render('Assets/Index', [
            'assets' => $assets
        ]);
    }

    public function store(Request $request, Product $product)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:IMAGE,VIDEO',
        ]);

        $product->assets()->create([
            'workspace_id' => $request->user()->workspace_id,
            'title' => $validated['title'],
            'type' => $validated['type'],
            'status' => 'DRAFT',
        ]);

        return back();
    }

    public function destroy(Asset $asset)
    {
        $asset->delete();

        return back();
    }

    public function show(Request $request, Asset $asset)
    {
        $asset->load(['product', 'channels']);

        $availableChannels = \App\Models\Channel::where('workspace_id', $request->user()->workspace_id)->get();

        return Inertia::render('Assets/Show', [
            'asset' => $asset,
            'availableChannels' => $availableChannels
        ]);
    }

    public function syncChannels(Request $request, Asset $asset)
    {
        $validated = $request->validate([
            'channel_ids' => 'array',
            'channel_ids.*' => 'exists:channels,id'
        ]);

        $asset->channels()->sync($validated['channel_ids'] ?? []);

        return back();
    }
}
