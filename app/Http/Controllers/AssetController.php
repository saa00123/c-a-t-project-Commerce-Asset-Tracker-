<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\Product;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

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

        ActivityLog::create([
            'workspace_id' => $request->user()->workspace_id,
            'user_id' => $request->user()->id,
            'action' => 'CHANNELS_SYNCED',
            'subject_type' => Asset::class,
            'subject_id' => $asset->id,
            'description' => "Updated target channels for asset: {$asset->title}",
        ]);

        return back()->with('success', 'Channels synced successfully.');
    }

    public function updateStatus(Request $request, Asset $asset)
    {
        $validated = $request->validate([
            'status' => 'required|in:DRAFT,IN_PROGRESS,REVIEW,APPROVED,DEPLOYED'
        ]);

        $oldStatus = $asset->status;

        $asset->update([
            'status' => $validated['status']
        ]);

        ActivityLog::create([
            'workspace_id' => $request->user()->workspace_id,
            'user_id' => $request->user()->id,
            'action' => 'STATUS_UPDATED',
            'subject_type' => Asset::class,
            'subject_id' => $asset->id,
            'description' => "Changed asset status from {$oldStatus} to {$asset->status} for '{$asset->title}'",
        ]);

        return back()->with('success', 'Asset status updated successfully.');
    }

    public function destroy(Request $request, Asset $asset)
    {
        $assetTitle = $asset->title;

        if ($asset->file_path) {
            Storage::disk('s3')->delete($asset->file_path);
        }

        $asset->delete();

        ActivityLog::create([
            'workspace_id' => $request->user()->workspace_id,
            'user_id' => $request->user()->id,
            'action' => 'DELETED',
            'subject_type' => Asset::class,
            'subject_id' => $asset->id,
            'description' => "Deleted asset: {$assetTitle}",
        ]);

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

        ActivityLog::create([
            'workspace_id' => $request->user()->workspace_id,
            'user_id' => $request->user()->id,
            'action' => 'CUSTOM_FIELDS_UPDATED',
            'subject_type' => Asset::class,
            'subject_id' => $asset->id,
            'description' => "Updated custom fields for asset: {$asset->title}",
        ]);

        return back()->with('success', 'Custom fields updated successfully.');
    }

    public function uploadFile(Request $request, Asset $asset)
    {
        $request->validate([
            'file' => 'required|file|max:51200',
        ]);

        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $mimeType = $file->getMimeType();
        $type = str_starts_with($mimeType, 'video/') ? 'VIDEO' : 'IMAGE';

        $path = $file->storeAs(
            "workspaces/{$asset->workspace_id}/products/{$asset->product_id}",
            time() . '_' . $originalName,
            's3'
        );

        if (!$path) {
            return back()->withErrors(['file' => 'Failed to upload file to S3.']);
        }

        $bucket = config('filesystems.disks.s3.bucket');
        $region = config('filesystems.disks.s3.region');
        $fileUrl = "https://{$bucket}.s3.{$region}.amazonaws.com/{$path}";

        $asset->update([
            'type' => $type,
            'file_path' => $path,
            'file_url' => $fileUrl,
        ]);

        ActivityLog::create([
            'workspace_id' => $request->user()->workspace_id,
            'user_id' => $request->user()->id,
            'action' => 'FILE_UPLOADED',
            'subject_type' => Asset::class,
            'subject_id' => $asset->id,
            'description' => "Uploaded file for asset: {$asset->title}",
        ]);

        return back()->with('success', 'File uploaded and attached successfully!');
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'title' => 'required|string|max:255',
            'type' => 'required|in:IMAGE,VIDEO',
        ]);

        $asset = Asset::create([
            'workspace_id' => $request->user()->workspace_id,
            'product_id' => $request->product_id,
            'title' => $request->title,
            'type' => $request->type,
            'status' => 'DRAFT',
        ]);

        ActivityLog::create([
            'workspace_id' => $request->user()->workspace_id,
            'user_id' => $request->user()->id,
            'action' => 'CREATED',
            'subject_type' => Asset::class,
            'subject_id' => $asset->id,
            'description' => "Created new asset: {$asset->title}",
        ]);

        return redirect()->route('assets.show', $asset->id)->with('success', 'Asset created. Please upload the file.');
    }

    public function removeFile(Request $request, Asset $asset)
    {
        if ($asset->file_path) {
            Storage::disk('s3')->delete($asset->file_path);
        }

        $asset->update([
            'file_path' => null,
            'file_url' => null,
        ]);

        ActivityLog::create([
            'workspace_id' => $request->user()->workspace_id,
            'user_id' => $request->user()->id,
            'action' => 'FILE_REMOVED',
            'subject_type' => Asset::class,
            'subject_id' => $asset->id,
            'description' => "Removed S3 file from asset: {$asset->title}",
        ]);

        return back()->with('success', 'File removed successfully from S3.');
    }

    public function download(Request $request, Asset $asset)
    {
        if (!$asset->file_path) {
            return back()->with('error', 'File not found.');
        }

        ActivityLog::create([
            'workspace_id' => $request->user()->workspace_id,
            'user_id' => $request->user()->id,
            'action' => 'FILE_DOWNLOADED',
            'subject_type' => Asset::class,
            'subject_id' => $asset->id,
            'description' => "Downloaded file from asset: {$asset->title}",
        ]);

        $fileName = basename($asset->file_path);
        $disk = Storage::disk('s3');

        if ($disk instanceof \Illuminate\Filesystem\FilesystemAdapter) {
            $temporaryUrl = $disk->temporaryUrl(
                $asset->file_path,
                now()->addMinutes(5),
                [
                    'ResponseContentDisposition' => 'attachment; filename="' . $fileName . '"'
                ]
            );

            return redirect()->away($temporaryUrl);
        }

        return back()->with('error', 'Download not supported by current storage driver.');
    }
}
