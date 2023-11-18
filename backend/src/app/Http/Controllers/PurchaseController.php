<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Favorite;
use App\Models\Address;
use App\Models\Purchase;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\MyValidationRequest;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PurchaseController extends Controller
{
    public function checkoutPage()
    {
        $userId = Auth::user()->id;

        $favoriteProducts = Favorite::where('user_id', $userId)
            ->pluck('product_id')
            ->toArray();
        $productsAll = Product::whereIn('id', $favoriteProducts)->get();
        $products = $productsAll->whereNotIn('id', Purchase::pluck('product_id')->toArray())
            ->values();
        
        return response()->json([
            'products' => $products
        ], 200);
    }

    public function purchase(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            MyValidationRequest::createPurchaseRules(),
            MyValidationRequest::createPurchaseMessages()
        );

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        } else {
            $userId = Auth::user()->id;

            $favoriteProducts = Favorite::where('user_id', $userId)
                ->pluck('product_id')
                ->toArray();
            $productsAll = Product::whereIn('id', $favoriteProducts)->get();
            $products = $productsAll->whereNotIn('id', Purchase::pluck('product_id')->toArray())
                ->values();
            
            $address = Address::create([
                'postal_code' => $request->input('postal_code'),
                'prefecture' => $request->input('prefecture'),
                'municipality' => $request->input('municipality'),
                'block_number' => $request->input('block_number'),
                'building_and_room' => $request->input('building_and_room')
            ]);

            try {
                DB::beginTransaction();

                foreach ($products as $product) {
                    Purchase::create([
                        'buyer_user_id' => $userId,
                        'seller_user_id' => $product->user_id,
                        'product_id' => $product->id,
                        'address_id' => $address->id
                    ]);
                }

                DB::commit();

                return response()->json(['message' => '購入が成功しました'], 200);
            } catch (Exception $e) {
                DB::rollback();
                return response()->json(['message' => '購入中にエラーが発生しました'], 500);
            }
        }
    }

    public function purchaseHistory()
    {
        $userId = Auth::user()->id;
        $userPurchasedHistories = Purchase::where('buyer_user_id', $userId)->get();

        $userPurchasedHistoriesInfo = $userPurchasedHistories->map(function ($userPurchasedHistory) {
            return [
                'buyer_user_name' => $userPurchasedHistory->buyer->name,
                'seller_user_name' => $userPurchasedHistory->seller->name,
                'seller_user_email' => $userPurchasedHistory->seller->email,
                'product' => $userPurchasedHistory->product,
                'address' => $userPurchasedHistory->address,
                'created_at' => $userPurchasedHistory->created_at
            ];
        });

        return response()->json([
            'userPurchasedHistories' => $userPurchasedHistoriesInfo
        ], 200);
    }

    public function sellHistory()
    {
        $userId = Auth::user()->id;
        $userSelledHistories = Purchase::where('seller_user_id', $userId)->get();

        $userSelledHistoriesInfo = $userSelledHistories->map(function ($userSelledHistory) {
            return [
                'buyer_user_name' => $userSelledHistory->buyer->name,
                'buyer_user_email' => $userSelledHistory->buyer->email,
                'seller_user_name' => $userSelledHistory->seller->name,
                'product' => $userSelledHistory->product,
                'address' => $userSelledHistory->address,
                'created_at' => $userSelledHistory->created_at
            ];
        });

        return response()->json([
            'userSelledHistories' => $userSelledHistoriesInfo
        ], 200);
    }
}
