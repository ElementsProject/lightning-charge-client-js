'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _url = require('url');

var _superagentBaseuri = require('superagent-baseuri');

var _superagentBaseuri2 = _interopRequireDefault(_superagentBaseuri);

var _eventsource = require('eventsource');

var _eventsource2 = _interopRequireDefault(_eventsource);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = require('debug')('lightning-charge-client');

var enc = encodeURIComponent;

var defaultUrl = 'http://localhost:9112';

var LightningChargeClient = function () {
  function LightningChargeClient() {
    var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultUrl;
    var token = arguments[1];

    _classCallCheck(this, LightningChargeClient);

    this.url = (token == null ? url : (0, _url.format)(_extends({}, (0, _url.parse)(url), { auth: 'api-token:' + token }))).replace(/\/+$/, '');
    this.req = (0, _superagentBaseuri2.default)(this.url);
  }

  _createClass(LightningChargeClient, [{
    key: 'invoice',
    value: function invoice(props) {
      debug('invoice(%o)', props);
      return this.req.post('/invoice').type('json').send(props).then(function (res) {
        return res.body;
      });
    }
  }, {
    key: 'fetch',
    value: function fetch(invoice_id) {
      debug('fetch(%s)', invoice_id);
      return this.req.get('/invoice/' + enc(invoice_id)).then(function (res) {
        return res.body;
      });
    }
  }, {
    key: 'fetchAll',
    value: function fetchAll() {
      debug('fetchAll()');
      return this.req.get('/invoices').then(function (res) {
        return res.body;
      });
    }
  }, {
    key: 'wait',
    value: function wait(invoice_id) {
      var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;

      debug('wait(%s)', invoice_id);
      return this.req.get('/invoice/' + enc(invoice_id) + '/wait?timeout=' + +timeout).then(function (res) {
        return res.body;
      }).catch(function (err) {
        return err.status === 402 ? null // 402 Payment Required: timeout reached without payment, invoice is still payable
        : err.status === 410 ? false // 410 Gone: invoice expired and can no longer be paid
        : Promise.reject(err);
      });
    }
  }, {
    key: 'stream',
    value: function stream() {
      var es = new _eventsource2.default(this.url + '/payment-stream');
      es.on('message', function (msg) {
        return es.emit('payment', JSON.parse(msg.data));
      });
      return es;
    }
  }, {
    key: 'registerHook',
    value: function registerHook(invoice_id, url) {
      debug('registerHook(%s, %s)', invoice_id, url);
      return this.req.post('/invoice/' + enc(invoice_id) + '/webhook').type('json').send({ url: url }).then(function (res) {
        return true;
      });
    }
  }, {
    key: 'info',
    value: function info() {
      debug('info()');
      return this.req.get('/info').then(function (res) {
        return res.body;
      });
    }
  }]);

  return LightningChargeClient;
}();

module.exports = function (url, token) {
  return new LightningChargeClient(url, token);
};