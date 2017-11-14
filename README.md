# lightning-strike-client-js

JavaScript client for the Lightning Strike REST API.

## Install

```bash
$ npm install lightning-strike-client
```

## Use

```js
// initialize client
const LightningStrikeClient = require('lightning-strike-client')

const strike = new LightingStrikeClient('http://localhost:8009')

// create invoice
strike.invoice(/*msatoshi*/ 50, /*metadata*/ { customer_id: 123, product_id: 456 })
  .then(invoice => {
    console.log('to pay, send %s milli-satoshis with rhash %s, or copy the BOLT11 payment request: %s'
              , invoice.amount, invoice.rhash, invoice.payreq)

    // wait for invoice to be paid
    return strike.wait(invoice.id, /* timeout */ 600)
  })
  .then(paid => {
    if (paid) console.log('paid invoice:', paid)
    else console.log('payment timed-out after 600 seconds')
  })

// fetch invoice
strike.fetch('m51vlVWuIKGumTLbJ1RPb')
  .then(invoice => console.log('loaded invoice:', invoice))
```

## Test

```bash
$ STRIKE_URL=http://localhost:8009 npm test
```

## License
MIT
