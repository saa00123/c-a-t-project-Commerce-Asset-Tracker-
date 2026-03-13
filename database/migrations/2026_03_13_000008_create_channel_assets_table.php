<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('channel_assets', function (Blueprint $table) {
            $table->foreignUuid('asset_id')->constrained('assets')->cascadeOnDelete();
            $table->foreignId('channel_id')->constrained('channels')->cascadeOnDelete();
            $table->string('status');
            $table->text('optimized_path')->nullable();
            $table->timestamp('last_published_at')->nullable();
            $table->timestamps();

            // 복합 키(Composite Key) 설정
            $table->primary(['asset_id', 'channel_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('channel_assets');
    }
};
