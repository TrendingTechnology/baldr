/* globals describe it */

const assert = require('assert')

const { resolveSingleByUuid } = require('./_helper.js')

describe('Package “@bldr/media-resolver”: File “resolve.js”', function () {
  describe('Samples', function () {
    describe('Property htmlElement', function () {
      it('No htmlElement on document asset', async function () {
        // ref:Arbeiterlied-Weber_QL_Tonart_Schuelerband
        const asset = await resolveSingleByUuid(
          '274796f6-1a41-40ad-afa4-2f39ad24563a'
        )
        assert.strictEqual(asset.htmlElement, undefined)
      })

      it('htmlElement on audio asset', async function () {
        // ref:Schuetz-Freue_HB_Freue-dich
        const asset = await resolveSingleByUuid(
          '02dcf8df-8f34-4b0d-b121-32b0f54cfd74'
        )
        assert.strictEqual(
          asset.htmlElement.constructor.name,
          'HTMLAudioElement'
        )
      })
    })

  })
})
