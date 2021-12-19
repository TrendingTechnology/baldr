/* globals describe it */

const assert = require('assert')

const { createHtmlElement } = require('../dist/node/html-elements.js')

describe('Package “@bldr/media-resolver”: File “html-element.ts”', function () {
  describe('Function “createHtmlElement()”', function () {
    it('audio', function () {
      const audio = createHtmlElement('audio', 'http://example.com/audio.mp3')
      assert.strictEqual(audio.src, 'http://example.com/audio.mp3')
    })

    it('video', function () {
      const video = createHtmlElement(
        'video',
        'http://example.com/video.mp4',
        'http://example.com/image.jpg'
      )
      assert.strictEqual(video.src, 'http://example.com/video.mp4')
      assert.strictEqual(video.poster, 'http://example.com/image.jpg')
    })

    it('image', function () {
      const image = createHtmlElement('audio', 'http://example.com/image.jpg')
      assert.strictEqual(image.src, 'http://example.com/image.jpg')
    })
  })
})
