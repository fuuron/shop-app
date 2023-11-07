<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\MyValidationRequest;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function commentPost(Request $request, $id)
    {
        $validator = Validator::make(
            $request->all(),
            MyValidationRequest::createCommentRules(),
            MyValidationRequest::createCommentMessages()
        );

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
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
