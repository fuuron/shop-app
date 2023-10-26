<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('purchases', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('buyer_user_id');
            $table->unsignedBigInteger('seller_user_id');
            $table->unsignedBigInteger('address_id');
            $table->timestamps();
            $table
                ->foreign('buyer_user_id')
                ->references('id')
                ->on('users');
            $table
                ->foreign('seller_user_id')
                ->references('id')
                ->on('users');
            $table
                ->foreign('address_id')
                ->references('id')
                ->on('addresses');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('purchases');
    }
};
