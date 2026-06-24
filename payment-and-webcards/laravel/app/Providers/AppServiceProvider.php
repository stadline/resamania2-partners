<?php

namespace App\Providers;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Register a named HTTP client for the Resamania API.
        // Usage: Http::resamania()->post('payable_objects', [...])
        Http::macro('resamania', function () {
            return Http::baseUrl(config('resamania.api_url') . '/' . config('resamania.client_token') . '/')
                ->withHeaders([
                    'Accept'               => 'application/json, text/plain, */*',
                    'Content-Type'         => 'application/ld+json',
                    'Authorization'        => 'Bearer ' . config('resamania.bearer_token'),
                    'x-gravitee-api-key'   => config('resamania.api_key'),
                    'x-user-club-id'       => config('resamania.club_id'),
                    'x-user-network-node-id' => config('resamania.network_node_id'),
                ]);
        });
    }
}
