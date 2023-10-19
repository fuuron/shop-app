<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\FavoriteController;
use App\Models\User;

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

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::post('/destroy', [AuthController::class, 'destroy']);
Route::post('/edit', [AuthController::class, 'edit']);

Route::post('/post', [ProductController::class, 'post']);
Route::get('/products', [ProductController::class, 'products']);
Route::get('/showDetail/{id}', [ProductController::class, 'showDetail']);
Route::post('/productDestroy/{id}', [ProductController::class, 'productDestroy']);

Route::post('/commentPost/{id}', [CommentController::class, 'commentPost']);

Route::post('/favorite/add', [FavoriteController::class, 'addFavorite']);
Route::post('/favorite/remove/{id}', [FavoriteController::class, 'removeFavorite']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
