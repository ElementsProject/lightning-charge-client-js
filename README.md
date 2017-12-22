# lightning-kite-client-js

JavaScript client for the Lightning Kite REST API.

## Install

```bash
$ npm install lightning-kite-client
```

## Use

```js
const LightningKiteClient = require('lightning-kite-client')
    , kite = new LightingKiteClient('http://localhost:8009')

// Create invoice
const invoice = await kite.invoice({ msatoshi: 50, metadata: { customer_id: 123, product_id: 456 } })
console.log('invoice with rhash=%s, BOLT11 payment request: %s'
          , invoice.rhash, invoice.payreq)

// Long poll payment updates
const paid = await kite.wait(invoice.id, /* timeout */ 600)
if (paid) console.log('invoice paid, updated invoice:', paid)
else if (paid === false) console.log('invoice unpaid and expired, give up')
else if (paid === null) console.log('long-poll timed-out after 600 seconds without payment, poll again')

// Fetch invoice
console.log('invoice:', await kite.fetch('m51vlVWuIKGumTLbJ1RPb'))

// Create invoice denominated in USD
const invoice = await kite.invoice({ currency: 'USD', amount: 0.15 })
```

See [Lightning Kite's documentation](https://github.com/ElementsProject/lightning-kite)
for more information and a full list of invoice fields.

(TODO: document missing methods)

## Test

```bash
$ KITE_URL=http://api-token:ACCESS-TOKEN@localhost:8009 npm test
```

## License
MIT
