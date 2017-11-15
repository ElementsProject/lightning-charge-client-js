# lightning-strike-client-js

JavaScript client for the Lightning Strike REST API.

## Install

```bash
$ npm install github:ElementsProject/lightning-strike-client-js
```

## Use

```js
const LightningStrikeClient = require('lightning-strike-client')
    , strike = new LightingStrikeClient('http://localhost:8009')

// Create invoice
strike.invoice(/*msatoshi*/ 50, /*metadata*/ { customer_id: 123, product_id: 456 })
  .then(invoice => {
    console.log('invoice with rhash=%s, BOLT11 payment request: %s'
              , invoice.rhash, invoice.payreq)
    // see https://github.com/ElementsProject/lightning-strike#rest-api for the full list
    // of invoice properties.

    // wait for invoice to be paid
    return strike.wait(invoice.id, /* timeout */ 600)
  })
  .then(paid => {
    if (paid) console.log('paid invoice:', paid)
    else console.log('payment timed-out after 600 seconds')
  })

// Fetch invoice
strike.fetch('m51vlVWuIKGumTLbJ1RPb')
  .then(invoice => console.log('loaded invoice:', invoice))
```

TODO: document missing methods

## Test

```bash
$ STRIKE_URL=http://localhost:8009 npm test
```

## License
MIT
