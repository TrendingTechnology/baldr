/* globals before */

const { update } = require('./_helper.js')

before(async function () {
  this.timeout(20000)
  // See mocha.opts file
  await update()
})
