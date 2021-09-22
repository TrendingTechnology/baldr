/* globals describe it */
const assert = require('assert')
const path = require('path')

const { locationIndicator } = require('../dist/node/location-indicator')
const config = require('@bldr/config')

function getPath (relPath) {
  return path.join(config.mediaServer.basePath, relPath)
}

describe('Package “@bldr/media-manager”', function () {
  describe('Class “LocationIndicator”', function () {
    describe('Method getPresParentDir()', function () {
      it('defined', function () {
        assert.strictEqual(
          locationIndicator.getPresParentDir(
            getPath(
              'Musik/10/10_Kontext/40_Jazz/10_Entstehung/HB/Percy-Randolph_Shine.m4a'
            )
          ),
          getPath('Musik/10/10_Kontext/40_Jazz/10_Entstehung')
        )
      })

      it('undefined', function () {
        assert.strictEqual(
          locationIndicator.getPresParentDir(getPath('xxxxxxxxxxxxxxxxxxxxx')),
          undefined
        )
      })
    })

    it('Method isInArchive()', function () {
      assert.strictEqual(
        locationIndicator.isInArchive(
          path.join(
            config.mediaServer.archivePaths[0],
            'Musik/10/10_Kontext/40_Jazz/10_Entstehung/HB/Percy-Randolph_Shine.m4a'
          )
        ),
        true
      )
    })
  })
})
