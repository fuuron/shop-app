<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Product;
use App\Models\Purchase;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\MyValidationRequest;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), MyValidationRequest::createRegisterRules());

        if ($validator->fails()) {
            return response()->json(['errors' => 'そのemailは使用できません'], 422);
        } else {
            User::create([
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
            ], 200);
        }
        return response()->json('emailまたはパスワードが間違っています', 500);
    }

    public function userInformation(Request $request)
    {
        $user = Auth::user();
        // $user = $request->user();
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
        
        $purchaseHistories = Purchase::where(function ($query) use ($user) {
            $query->where('seller_user_id', $user->id)
                  ->orWhere('buyer_user_id', $user->id);
        })->get();

        if ($purchaseHistories->isNotEmpty()) {
            DB::beginTransaction();

            try {
                foreach ($purchaseHistories as $purchaseHistory) {
                    $purchaseHistory->delete();
                    $product = $purchaseHistory->product;
                    $product->delete();
                }
                $user->delete();

                DB::commit();

                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                return response()->json(true);

            } catch (\Exception $e) {
                DB::rollback();
                return response()->json([
                    'error' => 'エラーが発生しました'
                ], 500);
            }
        } else {
            $user->delete();
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return response()->json(true);
        }
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
            return response()->json(['errors' => 'そのemailは使用できません'], 422);
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
