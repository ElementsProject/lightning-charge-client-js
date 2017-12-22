# lightning-kite-client-js

JavaScript client for the Lightning Kite REST API.

## Install

```bash
$ npm install github:ElementsProject/lightning-kite-client-js
```

## Use

```js
const LightningKiteClient = require('lightning-kite-client')
    , kite = new LightingKiteClient('http://localhost:8009')

// Create invoice
kite.invoice({ msatoshi: 50, metadata: { customer_id: 123, product_id: 456 } })
  .then(invoice => {
    console.log('invoice with rhash=%s, BOLT11 payment request: %s'
              , invoice.rhash, invoice.payreq)
    // see https://github.com/ElementsProject/lightning-kite#rest-api for the full list
    // of invoice properties.

    // wait for invoice to be paid
    return kite.wait(invoice.id, /* timeout */ 600)
  })
  .then(paid => {
    if (paid) console.log('paid invoice:', paid)
    else console.log('payment timed-out after 600 seconds')
  })

// Fetch invoice
kite.fetch('m51vlVWuIKGumTLbJ1RPb')
  .then(invoice => console.log('loaded invoice:', invoice))

// Create invoice denominated in USD
kite.invoice({ currency: 'USD', amount: 0.15, metadata: { customer_id: 123 } })
```

TODO: document missing methods

## Test

```bash
$ KITE_URL=http://localhost:8009 npm test
```

## License
MIT
