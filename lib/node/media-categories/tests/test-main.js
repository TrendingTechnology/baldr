/* globals describe it */

import assert from 'assert'

import {
  categoriesManagement,
  stripCategories,
  validateUuid
} from '../dist/main'

describe('Package “@bldr/media-categories”', function () {
  it('categoriesManagement.process()', async function () {
    const result = await categoriesManagement.process(
      {
        ref: 'test',
        title: 'Test',
        extension: 'jpg'
      },
      '/home/10_Presentation/NB/score.jpg'
    )
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
  })

  it('Function validateUuid()', function () {
    assert.strictEqual(
      validateUuid('ac06fad3-8ab0-4317-baa4-d1a4f429da3f'),
      true
    )
  })

  describe('Function “searchUnknownProps()”', function () {
    it('all known', function () {
      const result = categoriesManagement.searchUnknownProps({
        ref: 'test'
      })
      assert.deepStrictEqual(result, [])
    })

    it('unknown', function () {
      const result = categoriesManagement.searchUnknownProps({
        ref: 'test',
        xxx: 'Unknown'
      })
      assert.deepStrictEqual(result, ['xxx'])
    })

    it('reference_subtitle unknown', function () {
      const result = categoriesManagement.searchUnknownProps({
        ref: 'test',
        reference_subtitle: 'Unknown'
      })
      assert.deepStrictEqual(result, ['referenceSubtitle'])
    })

    it('reference_subtitle known', function () {
      const result = categoriesManagement.searchUnknownProps({
        ref: 'test',
        reference_subtitle: 'Unknown',
        categories: 'reference'
      })
      assert.deepStrictEqual(result, [])
    })
  })
})
