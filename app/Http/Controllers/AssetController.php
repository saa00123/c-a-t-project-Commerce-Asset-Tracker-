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
        $query = Asset::with('product')
            ->where('workspace_id', $request->user()->workspace_id)
            ->latest();

        if ($request->has('search') && $request->search !== null) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                    ->orWhereHas('product', function ($q2) use ($request) {
                        $q2->where('name', 'like', '%' . $request->search . '%');
                    });
            });
        }

        if ($request->has('type') && $request->type !== null) {
            $query->where('type', $request->type);
        }

        if ($request->has('status') && $request->status !== null) {
            $query->where('status', $request->status);
        }

        $assets = $query->paginate(10)->withQueryString();

        return Inertia::render('Assets/Index', [
            'assets' => $assets,
            'filters' => $request->only(['search', 'type', 'status'])
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

        return back()->with('success', 'Asset created successfully.');
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

        return back()->with('success', 'Channels synced successfully.');
    }

    public function updateStatus(Request $request, Asset $asset)
    {
        $validated = $request->validate([
            'status' => 'required|in:DRAFT,IN_PROGRESS,REVIEW,APPROVED,DEPLOYED'
        ]);

        $asset->update([
            'status' => $validated['status']
        ]);

        return back()->with('success', 'Asset status updated successfully.');
    }

    public function destroy(Asset $asset)
    {
        $asset->delete();

        return back()->with('success', 'Asset deleted successfully.');
    }

    public function updateCustomFields(Request $request, Asset $asset)
    {
        $validated = $request->validate([
            'custom_fields' => 'nullable|array',
            'custom_fields.*.key' => 'required|string|max:255',
            'custom_fields.*.value' => 'required|string|max:255',
        ]);

        $formattedFields = [];

        if (!empty($validated['custom_fields'])) {
            foreach ($validated['custom_fields'] as $field) {
                if (!empty($field['key'])) {
                    $formattedFields[$field['key']] = $field['value'];
                }
            }
        }

        $asset->update([
            'custom_fields' => $formattedFields
        ]);

        return back()->with('success', 'Custom fields updated successfully.');
    }
}
