const assert = require('assert')

const { categoriesManagement } = require('../dist/node/main.js')

describe('Package “@bldr/media-categories”', function () {

  it('categoriesManagement.process()', function () {
    const result = categoriesManagement.process({
      ref: 'test',
      uuid: '34972b71-60ea-47f2-ab4b-2484feece59b',
      title: 'Test',
      filePath: '/home/10_Presentation/NB/score.jpg',
      extension: 'jpg'
    })
    assert.strictEqual(result.ref, 'Presentation_NB_test')
    assert.strictEqual(result.uuid.length, 36)
    assert.ok(result.filePath == null)
    assert.ok(result.extension == null)
  })
})
