<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\PurchaseController;
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

Route::group(['middleware' => ['auth_check']], function () {
    Route::get('/userInformation', [AuthController::class, 'userInformation']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::delete('/destroy', [AuthController::class, 'destroy']);
    Route::put('/edit', [AuthController::class, 'edit']);

    Route::post('/post', [ProductController::class, 'post']);
    Route::get('/products', [ProductController::class, 'products']);
    Route::get('/userFavorite', [ProductController::class, 'userFavorite']);
    Route::get('/showDetail/{id}', [ProductController::class, 'showDetail']);
    Route::delete('/product/{id}', [ProductController::class, 'productDestroy']);

    Route::post('/commentPost/{id}', [CommentController::class, 'commentPost']);

    Route::post('/favorite/add', [FavoriteController::class, 'addFavorite']);
    Route::post('/favorite/remove/{id}', [FavoriteController::class, 'removeFavorite']);

    Route::get('/checkoutPage', [PurchaseController::class, 'checkoutPage']);
    Route::post('/purchase', [PurchaseController::class, 'purchase']);
    Route::get('/purchaseHistory', [PurchaseController::class, 'purchaseHistory']);
    Route::get('/sellHistory', [PurchaseController::class, 'sellHistory']);
    
    Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
        return $request->user();
    });
});

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });
