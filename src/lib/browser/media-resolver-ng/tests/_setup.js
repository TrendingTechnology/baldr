/* globals before */

const { makeHttpRequestInstance } = require('@bldr/http-request')
const config = require('@bldr/config')

const httpRequest = makeHttpRequestInstance(config, 'local', '/api/media')

async function update () {
  await httpRequest.request('mgmt/update')
}

before(async function () {
  this.timeout(20000)
  // See mocha.opts file
  await update()
})
