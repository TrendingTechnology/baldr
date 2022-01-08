/* globals it */

import assert from 'assert'

import { getEletronMenuDef, getWebappMenuDef } from '../dist/main'

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
