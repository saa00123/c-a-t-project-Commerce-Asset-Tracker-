<?php

namespace App\Http\Controllers;

use App\Models\Channel;
use App\Models\ActivityLog;
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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $channel = Channel::create([
            'workspace_id' => $request->user()->workspace_id,
            'name' => $validated['name'],
        ]);

        ActivityLog::create([
            'workspace_id' => $request->user()->workspace_id,
            'user_id' => $request->user()->id,
            'action' => 'CREATED',
            'subject_type' => Channel::class,
            'subject_id' => $channel->id,
            'description' => "Created new channel: {$channel->name}",
        ]);

        return back()->with('success', 'Channel created successfully.');
    }

    public function update(Request $request, Channel $channel)
    {
        if ($channel->workspace_id !== $request->user()->workspace_id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $oldName = $channel->name;
        $channel->update($validated);

        ActivityLog::create([
            'workspace_id' => $request->user()->workspace_id,
            'user_id' => $request->user()->id,
            'action' => 'UPDATED',
            'subject_type' => Channel::class,
            'subject_id' => $channel->id,
            'description' => "Updated channel name from '{$oldName}' to '{$channel->name}'",
        ]);

        return back()->with('success', 'Channel updated successfully.');
    }

    public function destroy(Request $request, Channel $channel)
    {
        if ($channel->workspace_id !== $request->user()->workspace_id) {
            abort(403);
        }

        $channelName = $channel->name;
        $channel->delete();

        ActivityLog::create([
            'workspace_id' => $request->user()->workspace_id,
            'user_id' => $request->user()->id,
            'action' => 'DELETED',
            'subject_type' => Channel::class,
            'subject_id' => $channel->id,
            'description' => "Deleted channel: {$channelName}",
        ]);

        return back()->with('success', 'Channel deleted successfully.');
    }
}
