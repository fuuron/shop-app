<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function commentPost(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'text' => 'max:30'
        ], [
            'text' => 'コメントは30文字以内にしてください',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], Response::HTTP_UNPROCESSABLE_ENTITY);
        } else {
            Comment::create([
                'user_id' => Auth::user()->id,
                'product_id' => $id,
                'text' => $request->input('text')
            ]);
            return response()->json([
                'message' => '商品が正常に保存されました',
                'showDetailPageUrl' => '/pages/product/' . $id
            ], 200);
        }
    }
}
