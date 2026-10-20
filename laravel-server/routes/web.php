<?php
use App\Http\Controllers\VariableScopeController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/variable-scope', [VariableScopeController::class, 'index']);
Route::get('/course', [VariableScopeController::class, 'read']);
Route::get('/greet-me/{name}', [VariableScopeController::class, 'greet']);




