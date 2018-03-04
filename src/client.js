import { parse, format } from 'url'
import superagentBase    from 'superagent-baseuri'
import EventSource       from 'eventsource'

const debug = require('debug')('lightning-charge-client')

const enc = encodeURIComponent

const defaultUrl = 'http://localhost:9112'

class LightningChargeClient {
  constructor(url=defaultUrl, token) {
    this.url = (token == null ? url : format({ ...parse(url), auth: 'api-token:'+token }))
               .replace(/\/+$/, '')
    this.req = superagentBase(this.url)
  }

  invoice(props) {
    debug('invoice(%o)', props)
    return this.req.post('/invoice')
      .type('json').send(props)
      .then(res => res.body)
  }

  fetch(invoice_id) {
    debug('fetch(%s)', invoice_id)
    return this.req.get('/invoice/'+enc(invoice_id))
      .then(res => res.body)
  }

  fetchAll() {
    debug('fetchAll()')
    return this.req.get('/invoices')
      .then(res => res.body)
  }

  wait(invoice_id, timeout=100) {
    debug('wait(%s)', invoice_id)
    return this.req.get(`/invoice/${enc(invoice_id)}/wait?timeout=${+timeout}`)
      .then(res  => res.body)
      .catch(err => err.status === 402 ? null  // 402 Payment Required: timeout reached without payment, invoice is still payable
                  : err.status === 410 ? false // 410 Gone: invoice expired and can no longer be paid
                  : Promise.reject(err))
  }

  stream() {
    const es = new EventSource(this.url + '/payment-stream')
    es.on('message', msg => es.emit('payment', JSON.parse(msg.data)))
    return es
  }

  registerHook(invoice_id, url) {
    debug('registerHook(%s, %s)', invoice_id, url)
    return this.req.post('/invoice/'+enc(invoice_id)+'/webhook')
      .type('json').send({ url })
      .then(res => true)
  }
}

module.exports = (url, token) => new LightningChargeClient(url, token)
