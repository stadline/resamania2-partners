import { useState } from 'react'
import { WidgetIframe } from '@resamania/payment-react'

// WARNING: in production, the payable_object creation must be done server-side.
// Exposing your bearer token in a browser app is only acceptable for local testing.
const API_URL      = import.meta.env.VITE_RESAMANIA_API_URL
const CLIENT_TOKEN = import.meta.env.VITE_RESAMANIA_CLIENT_TOKEN
const BEARER_TOKEN = import.meta.env.VITE_RESAMANIA_BEARER_TOKEN
const GATEWAY_API_KEY = import.meta.env.VITE_RESAMANIA_GATEWAY_API_KEY

const clubId = '/demoapi/clubs/1356'
const networkNodeId = '/demoapi/network_nodes/1438'
const contactId = '/demoapi/contacts/2974514'
const saleId = '/demoapi/sales/3563398'
const checkoutId = '/demoapi/checkouts/1319'

async function createPayableObject() {
  const res = await fetch(`${API_URL}/${CLIENT_TOKEN}/payable_objects`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/ld+json',
      Authorization: `Bearer ${BEARER_TOKEN}`,
      'x-gravitee-api-key': `${GATEWAY_API_KEY}`,
      'x-user-club-id': `${clubId}`,
      'x-user-network-node-id': `${networkNodeId}`,
    },
    body: JSON.stringify({
      // TODO: replace the values below with your actual Resamania entity IRIs
      contactId:      contactId,
      amount:         2500,          // in cents (25.00 EUR)
      currency:       'EUR',
      clubCode:       'DM',
      clubId:         clubId,
      checkout:       checkoutId,
      payableObjects: { sales: [saleId], invoices: [], incidents: [] },
      useWebWallet:   true,          // required — triggers widgetUrl generation in the response
      // These URLs are used as fallback by redirect-based PSPs.
      // With WidgetIframe the result is returned via onActionSuccess / onActionFailure.
      // Those URLs has to be commented if you want to insert the widget in an iframe, otherwise the widget will redirect to those URLs instead of returning the result to the parent page.
      // validUrl:  window.location.href,
      // cancelUrl: window.location.href,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`API ${res.status}: ${body}`)
  }

  const data = await res.json()
  console.log('[payableObject response]', data)
  return data
}

export default function App() {
  const [widgetUrl, setWidgetUrl] = useState(null)
  const [result, setResult]       = useState(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)

  const handlePay = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const payableObject = await createPayableObject()
      // widgetUrl is returned directly in the response (requires Accept: application/json).
      // It already contains the autologintoken as a query parameter.
      setWidgetUrl(payableObject.widgetUrl)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSuccess = (payload, { provider }) => {
    setWidgetUrl(null)
    setResult({ ok: true, provider, payload })
  }

  const handleFailure = (payload, { provider }) => {
    setWidgetUrl(null)
    setResult({ ok: false, provider, payload })
  }

  if (widgetUrl) {
    return (
      <WidgetIframe
        src={widgetUrl}
        style={{ width: '100%', height: '100vh', border: 'none' }}
        onActionSuccess={handleSuccess}
        onActionFailure={handleFailure}
      />
    )
  }

  return (
    <main style={{ maxWidth: 480, margin: '80px auto', fontFamily: 'sans-serif', padding: '0 16px' }}>
      <h1>Payment demo</h1>

      {result?.ok === true  && <p style={{ color: 'green' }}>✓ Payment accepted via {result.provider}</p>}
      {result?.ok === false && <p style={{ color: 'red'   }}>✗ Payment failed via {result.provider}</p>}
      {error                && <p style={{ color: 'red'   }}>Error: {error}</p>}

      <p>Total: <strong>25.00 EUR</strong></p>
      <button onClick={handlePay} disabled={loading} style={{ padding: '10px 24px', fontSize: 16 }}>
        {loading ? 'Loading…' : 'Pay now'}
      </button>
    </main>
  )
}
