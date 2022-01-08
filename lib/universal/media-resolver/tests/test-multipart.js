/* globals describe it beforeEach */

import assert from 'assert'

import { Resolver } from '../dist/main'

const resolver = new Resolver()

describe('File “multipart.ts”', function () {
  describe('Class “MultipartSelection”', function () {
    const urlBase =
      'http://localhost/media/' +
      'Musik/09/20_Kontext/20_Romantik/10_Programmmusik/' +
      '30_Borodin-Steppenskizzen/PT/Partitur'
    let multipart
    beforeEach(async function () {
      const uri = 'uuid:d84dd063-c4e7-40b7-93f4-533f1961cdd3#7-9,10-11'
      await resolver.resolveAsset(uri)
      multipart = resolver.getMultipartSelection(uri)
    })

    it('Accessor “ref”', async function () {
      assert.strictEqual(
        multipart.ref,
        'ref:Borodin-Steppenskizzen_PT_Partitur#7-9,10-11'
      )
    })

    it('Accessor “multiPartCount”', async function () {
      assert.strictEqual(multipart.multiPartCount, 5)
    })

    it('Accessor “httpUrl”', async function () {
      assert.strictEqual(multipart.httpUrl, urlBase + '_no007.png')
    })

    describe('Method “getMultiPartHttpUrlByNo()“', function () {
      it('no = 1', function () {
        assert.strictEqual(
          multipart.getMultiPartHttpUrlByNo(1),
          urlBase + '_no007.png'
        )
      })

      it('no = 2', function () {
        assert.strictEqual(
          multipart.getMultiPartHttpUrlByNo(2),
          urlBase + '_no008.png'
        )
      })

      it('no = 5', function () {
        assert.strictEqual(
          multipart.getMultiPartHttpUrlByNo(5),
          urlBase + '_no011.png'
        )
      })
    })
  })
})
