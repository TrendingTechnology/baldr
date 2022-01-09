/* globals describe it */

import assert from 'assert'

import exportSass from '../dist/main'

describe('Package “@bldr/export-sass”', function () {
  it('Function “exportSass()”', async function () {
    const sassVariables = exportSass()
    assert.strictEqual(sassVariables.$green, '#59a14e')
    assert.strictEqual(sassVariables.$black, '#141110')
    assert.strictEqual(sassVariables['$font-family'], 'Alegreya')
    assert.strictEqual(sassVariables['$font-family-mono'], 'Anonymous Pro')
  })
})
