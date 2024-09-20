import {useEffect, useState} from 'react';

import {Elements} from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm'

function Payment(props) {
    const { stripePromise } = props;
    const [ clientSecret, setClientSecret ] = useState('');

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        // Retrieving our clientSecret from our payableObject
        fetch("/mock/payableObject.json")
            .then((res) => res.json())
            .then(({ token : clientSecret}) => setClientSecret(clientSecret));
    }, []);

    return (
        <>
            <h1>Payment</h1>
            {clientSecret && stripePromise && (
                <Elements stripe={stripePromise} options={{ clientSecret, }}>
                    <CheckoutForm />
                </Elements>
            )}
        </>
    );
}

export default Payment;