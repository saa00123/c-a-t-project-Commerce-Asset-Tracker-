<?php

namespace App\Observers;

use App\Models\Asset;
use App\Models\ActivityLog;

class AssetObserver
{
    public function created(Asset $asset): void
    {
        $this->logActivity('created', $asset, "Created new asset: {$asset->title}");
    }

    public function updated(Asset $asset): void
    {
        if ($asset->isDirty('status')) {
            $oldStatus = $asset->getOriginal('status');
            $newStatus = $asset->status;
            $this->logActivity('updated', $asset, "Changed status of {$asset->title} from {$oldStatus} to {$newStatus}");
        }
    }

    public function deleted(Asset $asset): void
    {
        $this->logActivity('deleted', $asset, "Deleted asset: {$asset->title}");
    }

    private function logActivity(string $action, Asset $asset, string $description): void
    {
        if (auth()->check()) {
            ActivityLog::create([
                'workspace_id' => $asset->workspace_id,
                'user_id' => auth()->id(),
                'action' => $action,
                'subject_type' => Asset::class,
                'subject_id' => $asset->id,
                'description' => $description,
            ]);
        }
    }
}
