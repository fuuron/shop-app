<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function index()
    {
        // コメントの一覧を表示する処理
    }

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

    public function show($id)
    {
        // 特定のコメントを表示する処理
    }

    public function update(Request $request, $id)
    {
        // コメントを更新する処理
    }

    public function destroy($id)
    {
        // コメントを削除する処理
    }
}
