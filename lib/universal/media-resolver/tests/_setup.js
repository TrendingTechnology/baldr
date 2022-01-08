/* globals before */

import { updateMediaServer } from '../dist/main'

before(async function () {
  this.timeout(20000)
  // See mocha.opts file
  await updateMediaServer()
})
