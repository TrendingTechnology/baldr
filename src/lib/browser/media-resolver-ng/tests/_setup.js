/* globals before */

const { makeHttpRequestInstance } = require('@bldr/http-request')
const { getConfig } = require('@bldr/config-ng')

const config = getConfig()

const httpRequest = makeHttpRequestInstance(config, 'local', '/api/media')

async function update () {
  await httpRequest.request('mgmt/update')
}

before(async function () {
  this.timeout(20000)
  // See mocha.opts file
  await update()
})
