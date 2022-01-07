/* globals before */

const { updateMediaServer } = require('../dist/node/main.js')

before(async function () {
  this.timeout(20000)
  // See mocha.opts file
  await updateMediaServer()
})
