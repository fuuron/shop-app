<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Favorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
    public function addFavorite(Request $request)
    {
        $productId = $request->input('product_id');
    
        $favorite = new Favorite();
        $favorite->user_id = Auth::user()->id;
        $favorite->product_id = $productId;
        $favorite->save();

        return response()->json(['message' => 'お気に入りが登録されました'], 200);
    }

    public function removeFavorite($id)
    {
        $userId = Auth::user()->id;

        $favorite = Favorite::where('user_id', $userId)->where('product_id', $id);

        $favorite->delete();
        
        return response()->json(['message' => 'お気に入りが削除されました'], 200);
    }
}
