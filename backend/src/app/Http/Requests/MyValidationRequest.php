<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MyValidationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            //
        ];
    }

    public static function createRegisterRules()
    {
        return [
            'name' => ['required'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required']
        ];
    }

    public static function createProductRules()
    {
        return [
            'title' => 'required|string|max:20',
            'type' => 'required|string',
            'detail' => 'required|string|max:100',
            'photo' => 'required|image'
        ];
    }

    public static function createProductMessages()
    {
        return [
            'title.max' => 'タイトルは20文字以内にしてください',
            'detail.max' => '説明は100文字以内にしてください',
            'photo' => '写真をアップロードしてください'
        ];
    }

    public static function createCommentRules()
    {
        return [
            'text' => 'max:50'
        ];
    }

    public static function createCommentMessages()
    {
        return [
            'text' => 'コメントは50文字以内にしてください',
        ];
    }

    public static function createPurchaseRules()
    {
        return [
            'postal_code' => 'required|numeric|max:9999999',
            'prefecture' => 'required|string',
            'municipality' => 'required|string|max:30',
            'block_number' => 'required|max:10',
            'building_and_room' => 'required|max:30'
        ];
    }

    public static function createPurchaseMessages()
    {
        return [
            'postal_code.numeric' => '郵便番号は数字で入力してください',
            'postal_code.max' => '郵便番号は数字のみで7桁まで入力してください',
            'municipality.max' => '30文字以内で入力してください',
            'block_number.max' => '正しい番地を入力してください',
            'building_and_room.max' => '30文字以内で入力してください'
        ];
    }
}
