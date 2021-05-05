/* globals describe it */

const assert = require('assert')

const { WrappedSampleSpecList } = require('../dist/node/wrapped-sample')

const test = {
  meta: {
    ref: 'EP_common_audioOverlay'
  },
  slides: [
    {
      title: 'Without titles',
      score_sample: {
        heading: 'Hook-Line',
        score: 'ref:Final-Countdown_NB_The-Final-Countdown'
      },
      audio_overlay: [
        'ref:Final-Countdown_HB_The-Final-Countdown#blaeser-intro',
        'ref:Final-Countdown_HB_Mere-Rang-Mein-Rangne#blaeser-intro'
      ]
    },

    {
      title: 'Object: only uri, long form, show titles',
      score_sample: {
        heading: 'Der Gnome',
        score: 'uuid:949c3b21-b0c5-4730-bf04-15a4d5dff7fd'
      },
      audio_overlay: {
        show_titles: true,
        samples: [
          {
            uri: 'uuid:337010d0-732b-400f-a516-6f0bec91ed7b'
          },
          {
            uri: 'uuid:2dbdb1c0-0882-40fa-b0a6-7552effa2d32'
          }
        ]
      }
    },
    {
      title: 'Only one sample',
      score_sample: {
        heading: 'Das große Tor von Kiew',
        score: 'uuid:910699a5-d682-4053-8c96-64961596d242'
      },
      audio_overlay: [
        {
          uri: 'uuid:c64047d2-983d-4009-a35f-02c95534cb53'
        }
      ]
    },
    {
      title: 'Over image. Input string',
      image: {
        src: 'uuid:910699a5-d682-4053-8c96-64961596d242'
      },
      audio_overlay: 'uuid:c64047d2-983d-4009-a35f-02c95534cb53'
    },
    {
      title: 'URI and title in one string',
      task: 'URI and title in one string',
      audio_overlay: [
        'ref:Beatles-Strawberry_HB_Demoversion',
        'ref:Beatles-Strawberry_HB_Studioversion-von-1966 ersten Studioversion vom 24. November 1966',
        'ref:Beatles-Strawberry_HB_Plattenfassung fertige Produktion'
      ]
    }
  ]
}

function createSampleSpecs(input) {
  const list = new WrappedSampleSpecList(input)
  return list.specs
}

function createSampleSpecsGetFirst(input) {
  const specs = createSampleSpecs(input)
  return specs[0]
}

describe('Class “WrappedSampleList()”', function () {
  it('Single URI as a string', function () {
    const spec = createSampleSpecsGetFirst('ref:test')
    assert.strictEqual(spec.uri, 'ref:test')
  })

  it('Single URI as an array', function () {
    const spec = createSampleSpecsGetFirst(['ref:test'])
    assert.strictEqual(spec.uri, 'ref:test')
  })

  it('Single URI as a string with a custom title prefixed', function () {
    const spec = createSampleSpecsGetFirst('A title ref:test')
    assert.strictEqual(spec.uri, 'ref:test')
    assert.strictEqual(spec.customTitle, 'A title')
  })

  it('Single URI as a string with a custom title suffixed', function () {
    const spec = createSampleSpecsGetFirst('ref:test A title')
    assert.strictEqual(spec.uri, 'ref:test')
    assert.strictEqual(spec.customTitle, 'A title')
  })

  it('Single URI as a string with a custom title in the middle of the string', function () {
    const spec = createSampleSpecsGetFirst('prefix ref:test suffix')
    assert.strictEqual(spec.uri, 'ref:test')
    assert.strictEqual(spec.customTitle, 'prefix suffix')
  })

  it('Single uuid URI as a string with a custom title in the middle of the string', function () {
    const spec = createSampleSpecsGetFirst('prefix uuid:c64047d2-983d-4009-a35f-02c95534cb53 suffix')
    assert.strictEqual(spec.uri, 'uuid:c64047d2-983d-4009-a35f-02c95534cb53')
    assert.strictEqual(spec.customTitle, 'prefix suffix')
  })

  it('SimpleSampleSpec', function () {
    const spec = createSampleSpecsGetFirst({
      uri: 'ref:Final-Countdown_HB_The-Final-Countdown#blaeser-intro',
      title: 'Original'
    })
    assert.strictEqual(spec.uri, 'ref:Final-Countdown_HB_The-Final-Countdown#blaeser-intro')
    assert.strictEqual(spec.customTitle, 'Original')
  })

  it('SimpleSampleSpec[]', function () {
    const input = [
      {
        uri: 'ref:Final-Countdown_HB_The-Final-Countdown#blaeser-intro',
        title: 'Original'
      },
      {
        uri: 'ref:Final-Countdown_HB_Mere-Rang-Mein-Rangne#blaeser-intro',
        title: 'Bollywood'
      }
    ]
    const specs = createSampleSpecs(input)
    assert.strictEqual(specs[0].uri, 'ref:Final-Countdown_HB_The-Final-Countdown#blaeser-intro')
    assert.strictEqual(specs[0].customTitle, 'Original')
    assert.strictEqual(specs[1].uri, 'ref:Final-Countdown_HB_Mere-Rang-Mein-Rangne#blaeser-intro')
    assert.strictEqual(specs[1].customTitle, 'Bollywood')
  })
})
