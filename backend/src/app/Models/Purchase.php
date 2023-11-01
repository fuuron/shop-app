<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    use HasFactory;

    protected $fillable = [
        'buyer_user_id',
        'seller_user_id',
        'product_id',
        'address_id',
    ];

    public function buyer() {
        return $this->belongsTo(User::class, 'buyer_user_id');
    }

    public function seller() {
        return $this->belongsTo(User::class, 'seller_user_id');
    }

    public function product() {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function address() {
        return $this->belongsTo(Address::class, 'address_id');
    }
}
