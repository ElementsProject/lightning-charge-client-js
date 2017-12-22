import superagentBase from 'superagent-baseuri'

const debug = require('debug')('lightning-kite-client')

const enc = encodeURIComponent

class LightningKiteClient {
  constructor(url, token) {
    this.req = superagentBase(url)
    token && this.req.use(r => r.auth('api-token', token))
  }

  invoice(props) {
    debug('invoice(%j)', props)
    return this.req.post('/invoice')
      .type('json').send(props)
      .then(res => res.status === 201 ? res.body : Promise.reject(res))
  }

  fetch(invoice_id) {
    debug('fetch(%s)', invoice_id)
    return this.req.get('/invoice/'+enc(invoice_id))
      .then(res => res.status === 200 ? res.body : Promise.reject(res))
  }

  wait(invoice_id, timeout=100) {
    debug('wait(%s)', invoice_id)
    return this.req.get(`/invoice/${enc(invoice_id)}/wait?timeout=${+timeout}`)
      .then(res  => res.body)
      .catch(err => err.status === 402 ? null  // 402 Payment Required: time-out reached without payment
                  : err.status === 410 ? false // 410 Gone: invoice expired and can no longer be paid
                  : Promise.reject(err))
  }

  registerHook(invoice_id, url) {
    debug('registerHook(%s, %s)', invoice_id, url)
    return this.req.post('/invoice/'+enc(invoice_id)+'/webhook')
      .type('json').send({ url })
      .then(res => res.status === 201 ? true : Promise.reject(res))
  }
}

module.exports = (url, token) => new LightningKiteClient(url, token)
