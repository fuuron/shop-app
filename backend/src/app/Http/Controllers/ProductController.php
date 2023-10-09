<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Response;

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
                $imageName = time() . '.' . $image->getClientOriginalExtension();
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
            ], Response::HTTP_OK);
        }
    }

    public function products()
    {
        $products = Product::all();

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
        
        return response()->json($productsWithImageUrls);
    }
}
