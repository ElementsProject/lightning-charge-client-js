import LightningChargeClient from '../src/client'

const { ok, equal: eq, deepEqual: deepEq } = require('assert')

describe('lightning-charge-client', () => {
  const charge = new LightningChargeClient(process.env.CHARGE_URL, process.env.CHARGE_TOKEN)

  it('can create invoices', async () => {
    const invoice = await charge.invoice({ msatoshi: 50 })
    ok(invoice.id && invoice.rhash && invoice.payreq)
    eq(invoice.msatoshi, '50')
    return true
  })

  it('can create invoices with metadata', async () => {
    const invoice = await charge.invoice({ msatoshi: 50, metadata: { order: 123, customer: 456, products: [ 789, 987 ] } })
    eq(invoice.metadata.order, 123)
    deepEq(invoice.metadata.products, [ 789, 987 ])
  })

  it('can fetch invoices', async () => {
    const saved  = await charge.invoice({ msatoshi: 50, metadata: 'order 123' })
        , loaded = await charge.fetch(saved.id)
    eq(saved.id, loaded.id)
    eq(saved.rhash, loaded.rhash)
    eq(loaded.metadata, 'order 123')
    eq(loaded.msatoshi, '50')
  })

  it('can register webhooks', async () => {
    const invoice = await charge.invoice({ msatoshi: 50 })
    ok(await charge.registerHook(invoice.id, 'http://example.com/'))
  })

  it('can list invoices', async () => {
    const invoices = await charge.fetchAll()
    ok(invoices.length)
    ok(invoices[0].id && invoices[1].rhash && invoices[2].payreq)
  })

  it('can get node info', async () => {
    const info = await charge.info()
    ok(info.id && info.version && info.blockheight)
  })

  xit('long-polls payment updates for specific invoices')
  xit('streams payment updates for all invoices')
})
