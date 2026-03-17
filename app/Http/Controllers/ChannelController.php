<?php

namespace App\Http\Controllers;

use App\Models\Channel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChannelController extends Controller
{
    public function index(Request $request)
    {
        $channels = Channel::where('workspace_id', $request->user()->workspace_id)
            ->withCount('assets')
            ->latest()
            ->get();

        return Inertia::render('Channels/Index', [
            'channels' => $channels
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        Channel::create([
            'workspace_id' => $request->user()->workspace_id,
            'name' => $request->name,
        ]);

        return back()->with('success', 'Channel created successfully.');
    }

    public function update(Request $request, Channel $channel)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $channel->update([
            'name' => $request->name,
        ]);

        return back()->with('success', 'Channel updated successfully.');
    }

    public function destroy(Channel $channel)
    {
        $channel->assets()->detach();
        $channel->delete();

        return back()->with('success', 'Channel deleted successfully.');
    }
}
