import superagentBase from 'superagent-baseuri'

const debug = require('debug')('lightning-strike-client')

const enc = encodeURIComponent

class LightningStrikeClient {
  constructor(url) {
    this.req = superagentBase(url)
  }

  invoice(msatoshi, metadata) {
    debug('invoice(%s, %j)', msatoshi, metadata)
    return this.req.post('/invoice')
      .type('json').send({ msatoshi, metadata })
      .then(res => res.status === 201 ? res.body : Promise.reject(res))
  }

  fetch(invoice_id) {
    debug('fetch(%s)', invoice_id)
    return this.req.get('/invoice/'+enc(invoice_id))
      .then(res => res.status === 200 ? res.body : Promise.reject(res))
  }

  wait(invoice_id, timeout) {
    debug('wait(%s)', invoice_id)
    return this.req.get(`/invoice/${enc(invoice_id)}/wait?timeout=${timeout}`)
      .then(res => res.status === 200 ? res.body : res.status === 402 ? false : Promise.reject(res))
  }

  registerHook(invoice_id, url) {
    debug('registerHook(%s, %s)', invoice_id, url)
    return this.req.post('/invoice/'+enc(invoice_id)+'/webhook')
      .type('json').send({ url })
      .then(res => res.status === 201 ? true : Promise.reject(res))
  }
}

module.exports = LightningStrikeClient
