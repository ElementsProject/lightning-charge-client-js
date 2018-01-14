# lightning-charge-client-js

JavaScript client for the Lightning Charge REST API.

## Install

```bash
$ npm install lightning-charge-client
```

## Use

```js
// Initialize the client
import ChargeClient from 'lightning-charge-client'
const charge = new ChargeClient('http://localhost:9112', '[API-TOKEN]')

// new is optional
const charge = require('lightning-charge-client')('http://localhost:9112', '[API-TOKEN]')

// Create invoice
const inv = await charge.invoice({ msatoshi: 50, metadata: { customer_id: 123, product_id: 456 } })

console.log(`invoice ${ inv.id } created with rhash=${ inv.rhash }, payreq=${ inv.payreq }`)

// Create invoice denominated in USD
const inv = await charge.invoice({ currency: 'USD', amount: 0.15 })

// Fetch invoice
const invoice = await charge.fetch('m51vlVWuIKGumTLbJ1RPb')

// Fetch all invoices
const invoices = await charge.fetchAll()

// Long poll payment updates for a specific invoice
do {
  const paid = await charge.wait(inv.id, /* timeout: */ 600 /* seconds */)

  if (paid) console.log(`invoice ${ paid.id } of ${ paid.msatoshi } paid, updated invoice:`, paid)
  else if (paid === false) console.log('invoice expired and can no longer be paid')
  else if (paid === null) console.log('timeout reached without payment, invoice is still payable')
} while (paid === null)

// Stream all incoming payments
const stream = charge.stream()
stream.on('payment', inv => console.log(`invoice ${ inv.id } of ${ inv.msatoshi } paid`))

```

See [Lightning Charge's documentation](https://github.com/ElementsProject/lightning-charge)
for more information and a full list of invoice fields.

## Test

```bash
$ CHARGE_URL=http://api-token:ACCESS-TOKEN@localhost:8009 npm test
```

## License
MIT
