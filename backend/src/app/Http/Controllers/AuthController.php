<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required']
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => 'そのemailは使用できません'], Response::HTTP_UNPROCESSABLE_ENTITY);
        } else {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password)
            ]);
            return response()->json([
                'message' => 'User registration completed',
                'LoginPageUrl' => '/pages/login'
            ], 200);
        }
    }

    public function login(Request $request) {
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = User::whereEmail($request->email)->first();
            $user->tokens()->delete();
            $token = $user->createToken("login:user{$user->id}")->plainTextToken;

            return response()->json([
                'token' => $token,
                'accountPageUrl' => '/pages/account'
            ], Response::HTTP_OK);
        }
        return response()->json('emailまたはパスワードが間違っています', 500);
    }

    public function userInformation(Request $request)
    {
        $user = Auth::user();
        $userProductsWithoutImages = Product::where('user_id', $user->id)->get();

        $userProducts = $userProductsWithoutImages->map(function ($product) {
            return [
                'user_name' => $product->user->name,
                'id' => $product->id,
                'user_id' => $product->user_id,
                'title' => $product->title,
                'type' => $product->type,
                // 'detail' => $product->detail,
                'photo' => asset('images/' . $product->photo),
                'updated_at' => $product->updated_at
            ];
        });

        return response()->json([
            'user' => $user,
            'userProducts' => $userProducts
        ], 200);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(true);
    }

    public function destroy(Request $request)
    {
        $user = Auth::user();
        $user->delete();
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(true);
    }

    public function edit(Request $request)
    {
        $rules = [
            'name' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required']
        ];

        if ($request->has('email') && $request->email != Auth::user()->email) {
            $rules['email'][] = 'unique:users,email';
        }
        
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => 'そのemailは使用できません'], Response::HTTP_UNPROCESSABLE_ENTITY);
        } else {
            $user = Auth::user();
            $user->name = $request->name;
            $user->email = $request->email;
            $user->password = Hash::make($request->password);
            $user->save();
        }

        return response()->json([
            'message' => 'ユーザー情報が編集されました',
            'LoginPageUrl' => '/pages/account'
        ], 200);
    }
}
