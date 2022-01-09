/* globals describe it */

import assert from 'assert'

import WebSocket from 'ws'

import { getConfig } from '@bldr/config'

const config = getConfig()

describe('@bldr/websocket', function () {
  it('connect', function (done) {
    this.timeout(10000)
    const ws = new WebSocket(config.websocket.localUri)
    ws.on('error', function (err) {
      console.log(err)
      assert.fail()
    })
    ws.on('open', function (lol) {
      console.log()
      assert.strictEqual(this._url, 'ws://localhost/websocket/')
      ws.close()
      done()
    })
  })
})
