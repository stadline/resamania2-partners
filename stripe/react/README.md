# Description

This demo directory is an example of how Stripe can be integrated into a React application using the objects available in the Resamania API.
You need to be already integrated with the **Resamania API**.

You'll need to retrieve two entities:
- A `payableObject`: The object containing the online payment request: Created by performing a `POST /{clientToken}/payable_objects`.
  This payableObject contains a `token` which corresponds to Stripe's `clientSecret`.
- A `checkout`: The representaiton of the checkout to which the payment will be attached, which contains the Stripe configuration.
  This Checkout contains a `paymentProviderConfiguration` which contains 2 useful properties:
    - `publicKey`: Stripe's public key (`publishableKey`)
    - `accountId`: The Stripe account (`stripeAccount`)


## Getting Started

This project uses the official Stripe libraries
```bash
npm install @stripe/react-stripe-js @stripe/stripe-js
```

The `payableObject` and `checkout` representations are hard-coded in the `public/mock` directory, so you'll need to retrieve these objects as required.

## How it works

The `App.jsx` file loads Stripe with the public keys and dedicated account retrieved from `Checkout`.

The `Payment.jsx` file retrieves the `payableObject` and displays the `Checkout.jsx` component, which will display the payment form.