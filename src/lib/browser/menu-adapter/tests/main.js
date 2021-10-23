/* globals it */

const assert = require('assert')

const { getEletronMenuDef, getWebappMenuDef } = require('../dist/node/main.js')

it('getEletronMenuDef', function () {
  const menu = getEletronMenuDef({}, {})
  assert.strictEqual(
    menu[0].submenu[0].submenu[0].label,
    'Präsentation (Editor)'
  )
})

it('getWebappMenuDef', function () {
  const menu = getWebappMenuDef(
    {},
    { openEditor: () => {}, openMedia: () => {} }
  )
  assert.strictEqual(
    menu[0].submenu[0].submenu[0].label,
    'Präsentation (Editor)'
  )
})
