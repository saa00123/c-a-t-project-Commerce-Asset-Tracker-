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
            ->latest()
            ->get();

        return Inertia::render('Channels/Index', [
            'channels' => $channels
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        Channel::create([
            'workspace_id' => $request->user()->workspace_id,
            'name' => $validated['name'],
        ]);

        return redirect()->route('channels.index');
    }

    public function destroy(Channel $channel)
    {
        $channel->delete();

        return redirect()->route('channels.index');
    }
}
