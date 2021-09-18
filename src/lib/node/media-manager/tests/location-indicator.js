/* globals describe it */
const assert = require('assert')

const { locationIndicator } = require('../dist/node/location-indicator')

describe('Package “@bldr/media-manager”', function () {
  describe('Class “LocationIndicator”', function () {
    it('getPresParentDir', function () {
      assert.strictEqual(
        locationIndicator.getPresParentDir(
          '/home/jf/schule-media/musik/10/10_Kontext/40_Jazz/10_Entstehung/HB/Percy-Randolph_Shine.m4a'
        ),
        '/home/jf/schule-media/musik/10/10_Kontext/40_Jazz/10_Entstehung'
      )
    })
  })
})
