/* globals describe it beforeEach */

const assert = require('assert')

const { Resolver } = require('../dist/node/main.js')
const resolver = new Resolver()

// ---
// meta:
//   ref: EP_master_scoreSample
//   title: Master slide “scoreSample” test presentation

// slides:

// - title: Short form
//   score_sample: uuid:fd782f52-7182-41e1-9f62-45585eb48454

// - title: Long form
//   score_sample:
//     score: uuid:a160a10e-944a-4a62-bc42-97595ad15d18

// - title: With audio
//   score_sample:
//     score: uuid:fd782f52-7182-41e1-9f62-45585eb48454
//     audio: uuid:88ad5df3-d7f9-4e9e-9522-e205f51eedb3

// - title: With heading
//   score_sample:
//     heading: Heading
//     score: uuid:fd782f52-7182-41e1-9f62-45585eb48454
//     audio: uuid:88ad5df3-d7f9-4e9e-9522-e205f51eedb3

// - title: Multi part score file
//   score_sample:
//     score: uuid:a3fdc611-57e6-452b-9058-248836504048
//     audio: uuid:88ad5df3-d7f9-4e9e-9522-e205f51eedb3

// - title: 'Multi part score file (selection #7-9,10-11)'
//   score_sample: uuid:d84dd063-c4e7-40b7-93f4-533f1961cdd3#7-9,10-11

// - title: 'Multi part score file (selection #1)'
//   score_sample: uuid:a3fdc611-57e6-452b-9058-248836504048#1

// - title: 'Multi part score file (selection #10-)'
//   score_sample: uuid:d84dd063-c4e7-40b7-93f4-533f1961cdd3#10-

// - title: 'Multi part score file (selection #2-3)'
//   score_sample: uuid:a3fdc611-57e6-452b-9058-248836504048#2-3

// - title: 'Multi part score file (selection #1,3,5,7)'
//   score_sample: uuid:d84dd063-c4e7-40b7-93f4-533f1961cdd3#1,3,5,7

// - title: 'Multi part score file (selection #-4)'
//   score_sample: 'uuid:a3fdc611-57e6-452b-9058-248836504048#-4'

// - title: 'Multi part score file with uuid (selection #-4)'
//   score_sample: uuid:9084790f-ae0b-49ae-b140-dcbd9356579c#-4

describe('File “multipart.ts”', function () {
  describe('Class “MultipartSelection”', function () {
    let multipart
    beforeEach(async function () {
      multipart = await resolver.resolveMultipartSelection(
        'uuid:d84dd063-c4e7-40b7-93f4-533f1961cdd3#7-9,10-11'
      )
    })

    it('Property “ref”', async function () {
      assert.strictEqual(
        multipart.ref,
        'ref:Borodin-Steppenskizzen_PT_Partitur#7-9,10-11'
      )
    })
  })
})
