<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Comment;
use App\Models\Favorite;
use App\Models\Purchase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str; 
use Illuminate\Support\Facades\File;

class ProductController extends Controller
{
    public function post(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:20',
            'type' => 'required|string',
            'detail' => 'required|string|max:100',
            'photo' => 'required|image'
        ], [
            'title.max' => 'タイトルは20文字以内にしてください',
            'detail.max' => '説明は100文字以内にしてください',
            'photo' => '写真をアップロードしてください'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], Response::HTTP_UNPROCESSABLE_ENTITY);
        } else {
            if ($request->hasFile('photo')) {
                $image = $request->file('photo');
                $randomString = Str::random(10);
                $imageName = time() . '_' . $randomString . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('images'), $imageName);
            }
            Product::create([
                'user_id' => auth()->id(),
                'title' => $request->input('title'),
                'type' => $request->input('type'),
                'detail' => $request->input('detail'),
                'photo' => $imageName
            ]);
            return response()->json([
                'message' => '商品が正常に保存されました',
                'productsPageUrl' => '/pages/products'
            ], 200);
        }
    }

    public function products()
    {
        $products = Product::whereNotIn('id', function ($query) {
            $query->select('product_id')->from('purchases');
        })->get();
        
        $userId = Auth::user()->id;
        $favoriteProducts = Favorite::where('user_id', $userId)->get();

        $productsWithImageUrls = $products->map(function ($product) {
            return [
                'id' => $product->id,
                'user_id' => $product->user_id,
                'user_name' => $product->user->name,
                'title' => $product->title,
                'type' => $product->type,
                // 'detail' => $product->detail,
                'photo' => asset('images/' . $product->photo),
                'updated_at' => $product->updated_at
            ];
        });

        $favoriteCounts = [];
        foreach ($products as $product) {
            $productId = $product->id;
            $favoriteCount = Favorite::where('product_id', $productId)->count();
            $favoriteCounts[$productId] = $favoriteCount;
        }
        
        return response()->json([
            'products' => $productsWithImageUrls,
            'favorites' => $favoriteProducts,
            'favoriteCounts' => $favoriteCounts,
            'authUserId' => $userId
        ], 200);
    }

    public function userFavorite()
    {
        $userId = Auth::user()->id;
        
        $favoriteProducts = Favorite::where('user_id', $userId)
            ->pluck('product_id')
            ->toArray();
        $productsAll = Product::whereIn('id', $favoriteProducts)->get();
        $products = $productsAll->whereNotIn('id', Purchase::pluck('product_id')->toArray())
            ->values();

        $favoriteProducts = Favorite::where('user_id', $userId)->get();

        $productsWithImageUrls = $products->map(function ($product) {
            return [
                'user_name' => $product->user->name,
                'id' => $product->id,
                'title' => $product->title,
                'type' => $product->type,
                // 'detail' => $product->detail,
                'photo' => asset('images/' . $product->photo),
                'updated_at' => $product->updated_at
            ];
        });

        $favoriteCounts = [];
        foreach ($products as $product) {
            $productId = $product->id;
            $favoriteCount = Favorite::where('product_id', $productId)->count();
            $favoriteCounts[$productId] = $favoriteCount;
        }
        
        return response()->json([
            'products' => $productsWithImageUrls,
            'favorites' => $favoriteProducts,
            'favoriteCounts' => $favoriteCounts
        ], 200);
    }

    public function showDetail($id)
    {
        $user_id = Auth::user()->id;

        $product = Product::find($id);
        $product->user_name = $product->user->name;
        $product->photo = asset('images/' . $product->photo);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $productPurchased = 'false';
        if ($product) {
            $isPurchased = Purchase::where('product_id', $product->id)->exists();
            $productPurchased = $isPurchased ? 'true' : 'false';
        }

        $comments = Comment::where('product_id', $id)->get();
        foreach ($comments as $comment) {
            $comment->user_name = $comment->user->name;
        }

        return response()->json([
            'product' => $product,
            'user_id' => $user_id,
            'comments' => $comments,
            'productPurchased' => $productPurchased
        ], 200);
    }

    public function productDestroy($id)
    {
        $product = Product::find($id);
        if ($product->user_id !== Auth::user()->id) {
            return response()->json(['message' => 'Unauthorized'], 401);
        } else {
            $imagePath = public_path('images/' . $product->photo);
            if (File::exists($imagePath)) {
                File::delete($imagePath);
            }
            $product->delete();
            return response()->json(['message' => 'Product deleted'], 200);
        }
    }
}
