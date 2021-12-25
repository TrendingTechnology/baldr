/* globals describe it  */
const assert = require('assert')

const api = require('../dist/node/main.js')

describe('Package “@bldr/api-wrapper”', function () {
  this.timeout(20000)
  it('Function “updateMediaServer()”', async function () {
    const result = await api.updateMediaServer()
    assert.strictEqual(typeof result.begin, 'number')
    assert.strictEqual(typeof result.count.assets, 'number')
  })

  it('Function “getMediaStatistics()”', async function () {
    const result = await api.getMediaStatistics()
    assert.strictEqual(typeof result.count.assets, 'number')
    assert.strictEqual(typeof result.count.presentations, 'number')

    assert.strictEqual(typeof result.updateTasks[0].begin, 'number')
    assert.strictEqual(typeof result.updateTasks[0].end, 'number')
    assert.strictEqual(typeof result.updateTasks[0].lastCommitId, 'string')
  })

  it('Function “getPresentationByRef()”', async function () {
    // Musik/05/20_Mensch-Zeit/10_Mozart/10_Biographie-Kindheit/Praesentation.baldr.yml
    const presentation = await api.getPresentationByRef('Biographie-Kindheit')
    assert.strictEqual(presentation.meta.ref, 'Biographie-Kindheit')
  })

  it('Function “readMediaAsString()”', async function () {
    const presentation = await api.readMediaAsString(
      'Musik/05/20_Mensch-Zeit/10_Mozart/10_Biographie-Kindheit/Praesentation.baldr.yml'
    )
    assert.ok(presentation.includes('ref: Biographie-Kindheit'))
  })

  it('Function “getDynamicSelectPresentations()”', async function () {
    const results = await api.getDynamicSelectPresentations('Mozart')
    const result = results[0]
    assert.strictEqual(typeof result.ref, 'string')
    assert.strictEqual(typeof result.name, 'string')
  })

  it('Function “getAssetByUri()”', async function () {
    const asset = await api.getAssetByUri('ref:PR_Mussorgski_Modest')
    assert.strictEqual(asset.ref, 'PR_Mussorgski_Modest')
  })

  it('Function “getTitleTree()”', async function () {
    const tree = await api.getTitleTree()
    assert.strictEqual(tree.Musik.folder.title, 'Fach Musik')
  })
})
