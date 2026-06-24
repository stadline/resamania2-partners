<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PaymentController extends Controller
{
    /**
     * Initiate a payment: create a payable object then redirect the user to the PSP page.
     *
     * Sending validUrl and cancelUrl triggers the redirect-based flow:
     * the API returns a `redirectUrl` pointing to the PSP payment page.
     * Do NOT send them if you want the widget flow (see React example).
     *
     * Route: GET|POST /payment/initiate
     */
    public function initiate(Request $request): RedirectResponse
    {
        $response = Http::resamania()->post('payable_objects', [
            // TODO: resolve these values from your database for the current user and cart
            'contactId'      => $request->user()->resamaniaContactId,
            'amount'         => 2500,          // in cents — 25.00 EUR
            'currency'       => 'EUR',
            'clubCode'       => config('resamania.club_code'),
            'clubId'         => config('resamania.club_id'),
            'checkout'       => config('resamania.checkout_id'),
            'payableObjects' => [
                'sales'     => [$request->input('saleId')],
                'invoices'  => [],
                'incidents' => [],
            ],
            'validUrl'  => route('payment.callback'),
            'cancelUrl' => route('payment.cancel'),
        ]);

        abort_unless($response->successful(), 502, 'Could not create payment: '.$response->body());

        // Store the numeric ID so the callback can call /check without relying on URL params.
        // The `id` field is a JSON-LD IRI (e.g. "/demoapi/payable_objects/12345");
        // basename() extracts the numeric part.
        session(['resamania_payable_object_id' => basename($response->json('id'))]);

        return redirect($response->json('redirectUrl'));
    }

    /**
     * Handle the PSP return after payment (both success and failure land here).
     * Always verify the state server-side — never trust URL parameters alone.
     *
     * Route: GET /payment/callback
     */
    public function callback(): mixed
    {
        $payableObjectId = session('resamania_payable_object_id');

        abort_if($payableObjectId === null, 400, 'Session expired or missing payable object ID.');

        $response = Http::resamania()->put("payable_objects/{$payableObjectId}/check");

        abort_unless($response->successful(), 502, 'Could not verify payment state: '.$response->body());

        session()->forget('resamania_payable_object_id');

        return match ($response->json('state')) {
            'validated' => redirect()->route('order.confirmation'),
            'refused'   => redirect()->route('checkout')->withErrors(['payment' => 'Payment refused.']),
            default     => redirect()->route('checkout')->withErrors(['payment' => 'Unexpected payment state.']),
        };
    }

    /**
     * Handle payment cancellation (user clicked "back" or "cancel" on PSP page).
     *
     * Route: GET /payment/cancel
     */
    public function cancel(): RedirectResponse
    {
        session()->forget('resamania_payable_object_id');

        return redirect()->route('checkout')->with('info', 'Payment cancelled.');
    }
}
