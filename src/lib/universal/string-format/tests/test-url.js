/* globals describe it */

const assert = require('assert')

const url = require('../dist/node/url.js')

describe('url.ts', function () {
  it('Function “formatImslpUrl()”', function () {
    assert.strictEqual(
      url.formatImslpUrl('La_clemenza_di_Tito_(Wagenseil,_Georg_Christoph)'),
      'https://imslp.org/wiki/La_clemenza_di_Tito_(Wagenseil,_Georg_Christoph)'
    )
  })

  it('Function “formatMusicbrainzRecordingUrl()”', function () {
    assert.strictEqual(
      url.formatMusicbrainzRecordingUrl('6b06df6e-ec4b-429f-9afb-2f68140a1775'),
      'https://musicbrainz.org/recording/6b06df6e-ec4b-429f-9afb-2f68140a1775'
    )
  })

  it('Function “formatMusicbrainzWorkUrl()”', function () {
    assert.strictEqual(
      url.formatMusicbrainzWorkUrl('b9401a70-9149-49fb-a3ab-a200d9cafb61'),
      'https://musicbrainz.org/work/b9401a70-9149-49fb-a3ab-a200d9cafb61'
    )
  })

  it('Function “formatWikicommonsUrl()”', function () {
    assert.strictEqual(
      url.formatWikicommonsUrl('Cheetah_(Acinonyx_jubatus)_cub.jpg'),
      'https://commons.wikimedia.org/wiki/File:Cheetah_(Acinonyx_jubatus)_cub.jpg'
    )
  })

  it('Function “formatWikidataUrl()”', function () {
    assert.strictEqual(
      url.formatWikidataUrl('Q42'),
      'https://www.wikidata.org/wiki/Q42'
    )
  })

  it('Function “formatWikipediaUrl()”', function () {
    assert.strictEqual(
      url.formatWikipediaUrl('en:A_article'),
      'https://en.wikipedia.org/wiki/A_article'
    )
  })

  it('Function “formatYoutubeUrl()”', function () {
    assert.strictEqual(
      url.formatYoutubeUrl('CQYypFMTQcE'),
      'https://youtu.be/CQYypFMTQcE'
    )
  })
})
