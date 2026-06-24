<?php

use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/payment/initiate',  [PaymentController::class, 'initiate'])->name('payment.initiate');
    Route::get('/payment/callback',   [PaymentController::class, 'callback'])->name('payment.callback');
    Route::get('/payment/cancel',     [PaymentController::class, 'cancel'])->name('payment.cancel');
});
