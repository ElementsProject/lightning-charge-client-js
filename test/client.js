import LightningStrikeClient from '../src/client'

const { ok, equal: eq, deepEqual: deepEq } = require('assert')

describe('lightning-strike-client', () => {
  const strike = new LightningStrikeClient(process.env.STRIKE_URL)

  it('can create invoices', async () => {
    const invoice = await strike.invoice({ msatoshi: 50 })
    ok(invoice.id && invoice.rhash && invoice.payreq)
    eq(invoice.msatoshi, '50')
    return true
  })

  it('can create invoices with metadata', async () => {
    const invoice = await strike.invoice({ msatoshi: 50, metadata: { order: 123, customer: 456, products: [ 789, 987 ] } })
    eq(invoice.metadata.order, 123)
    deepEq(invoice.metadata.products, [ 789, 987 ])
  })

  it('can fetch invoices', async () => {
    const saved  = await strike.invoice({ msatoshi: 50, metadata: 'order 123' })
        , loaded = await strike.fetch(saved.id)
    eq(saved.id, loaded.id)
    eq(saved.rhash, loaded.rhash)
    eq(loaded.metadata, 'order 123')
    eq(loaded.msatoshi, '50')
  })

  it('can register webhooks', async () => {
    const invoice = await strike.invoice({ msatoshi: 50 })
    ok(await strike.registerHook(invoice.id, 'http://example.com/'))
  })

  xit('can list invoices')
  xit('long-polls payment updates for specific invoices')
  xit('streams payment updates for all invoices')
})
