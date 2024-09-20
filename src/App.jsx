import './App.css';
import Payment from './Payment'

import {useEffect, useState} from 'react';

import {loadStripe} from '@stripe/stripe-js';

function App() {
  const [ stripePromise, setStripePromise ] = useState(null);

  useEffect(() => {
    // Retrieving the publishable key and account ID from our checkout
    fetch("/mock/checkout.json").then(async (r) => {
      const { paymentProviderConfiguration : { publicKey : publishableKey, accountId: stripeAccount } } = await r.json();
      setStripePromise(loadStripe(publishableKey, { stripeAccount }));
    });
  }, []);

  return (
      <main>
        <Payment stripePromise={stripePromise} />
      </main>
  );
}

export default App;