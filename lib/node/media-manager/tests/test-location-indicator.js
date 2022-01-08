/* globals describe it */
import assert from 'assert'
import path from 'path'

import { getConfig } from '@bldr/config'

import { locationIndicator } from '../dist/location-indicator'

const config = getConfig()

const testRelPath =
  'Musik/10/10_Kontext/40_Jazz/10_Entstehung/HB/Percy-Randolph_Shine.m4a'

function getAbsPath (relPath) {
  return path.join(config.mediaServer.basePath, relPath)
}

describe('location-indicator.ts', function () {
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
