# lightning-charge-client-js

JavaScript client for the Lightning Charge REST API.

## Install

```bash
$ npm install lightning-charge-client
```

## Use

```js
const LightningChargeClient = require('lightning-charge-client')
    , charge = new LightingChargeClient('http://localhost:8009')

// Create invoice
const invoice = await charge.invoice({ msatoshi: 50, metadata: { customer_id: 123, product_id: 456 } })
console.log('invoice with rhash=%s, BOLT11 payment request: %s'
          , invoice.rhash, invoice.payreq)

// Long poll payment updates
const paid = await charge.wait(invoice.id, /* timeout */ 600)
if (paid) console.log('invoice paid, updated invoice:', paid)
else if (paid === false) console.log('invoice unpaid and expired, give up')
else if (paid === null) console.log('long-poll timed-out after 600 seconds without payment, poll again')

// Fetch invoice
console.log('invoice:', await charge.fetch('m51vlVWuIKGumTLbJ1RPb'))

// Create invoice denominated in USD
const invoice = await charge.invoice({ currency: 'USD', amount: 0.15 })
```

See [Lightning Charge's documentation](https://github.com/ElementsProject/lightning-charge)
for more information and a full list of invoice fields.

(TODO: document missing methods)

## Test

```bash
$ CHARGE_URL=http://api-token:ACCESS-TOKEN@localhost:8009 npm test
```

## License
MIT
