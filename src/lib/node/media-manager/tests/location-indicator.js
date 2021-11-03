/* globals describe it */
const assert = require('assert')
const path = require('path')

const { locationIndicator } = require('../dist/node/location-indicator')
const { getConfig } = require('@bldr/config-ng')
const config = getConfig()

const testRelPath =
  'Musik/10/10_Kontext/40_Jazz/10_Entstehung/HB/Percy-Randolph_Shine.m4a'

function getAbsPath (relPath) {
  return path.join(config.mediaServer.basePath, relPath)
}

describe('Package “@bldr/media-manager”: location-indicator', function () {
  describe('Class “LocationIndicator”', function () {
    it('Method isInArchive()', function () {
      assert.strictEqual(
        locationIndicator.isInArchive(
          path.join(config.mediaServer.archivePaths[0], testRelPath)
        ),
        true
      )
    })

    describe('Method getPresParentDir()', function () {
      it('defined', function () {
        assert.strictEqual(
          locationIndicator.getPresParentDir(getAbsPath(testRelPath)),
          getAbsPath('Musik/10/10_Kontext/40_Jazz/10_Entstehung')
        )
      })

      it('undefined', function () {
        assert.strictEqual(
          locationIndicator.getPresParentDir(
            getAbsPath('xxxxxxxxxxxxxxxxxxxxx')
          ),
          undefined
        )
      })
    })

    it('Method getTwoDigitPrefixedParentDir()', function () {
      assert.strictEqual(
        locationIndicator.getTwoDigitPrefixedParentDir(getAbsPath(testRelPath)),
        getAbsPath('Musik/10/10_Kontext/40_Jazz/10_Entstehung')
      )
    })

    it('Method getRelPath()', function () {
      assert.strictEqual(
        locationIndicator.getRelPath(getAbsPath(testRelPath)),
        testRelPath
      )
    })

    it('Method getBasePath()', function () {
      assert.strictEqual(
        locationIndicator.getBasePath(getAbsPath(testRelPath)),
        config.mediaServer.basePath
      )
    })

    it('Method getRefOfSegments()', function () {
      assert.deepStrictEqual(
        locationIndicator.getRefOfSegments(getAbsPath(testRelPath)),
        ['Musik', '10', 'Kontext', 'Jazz', 'Entstehung', 'HB']
      )
    })
  })
})
