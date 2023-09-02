<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LoginController;
use App\Models\User;

// use App\Http\Controllers\AuthController;

// use App\Http\Controllers\Auth\RegisterController;　実験

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::get('/create', [RegisterController::class, 'create']);　実験
// Route::get('/check-login-status', [AuthController::class, 'checkLoginStatus']);

Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [LoginController::class, 'login']);



Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
