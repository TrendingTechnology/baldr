/* globals describe it */
const assert = require('assert')

const { categoriesManagement, stripCategories } = require('../dist/node/main.js')

describe('Package “@bldr/media-categories”', function () {
  it('categoriesManagement.process()', function () {
    const result = categoriesManagement.process({
      ref: 'test',
      title: 'Test',
      extension: 'jpg'
    }, '/home/10_Presentation/NB/score.jpg')
    assert.strictEqual(result.ref, 'Presentation_NB_test')
    assert.strictEqual(result.uuid.length, 36)
    assert.ok(result.filePath == null)
    assert.ok(result.extension == null)
  })

  it('Function “convertCategoriesToJson()”', function () {
    const result = stripCategories()

    assert.strictEqual(result.cloze.props.title.title, 'Titel des Lückentextes')
    // absent
    assert.strictEqual(result.general.props.extension, undefined)

    // for (const key in result) {
    //   if (Object.hasOwnProperty.call(result, key)) {
    //     const element = result[key]
    //     console.log(element)
    //   }
    // }
  })
})
