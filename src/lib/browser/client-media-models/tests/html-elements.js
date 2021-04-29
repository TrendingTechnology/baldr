const assert = require('assert')

const { createMediaElement } = require('../dist/node/html-elements.js')

describe('createMediaElement', function () {
  it('audio', function () {
    const audio = createMediaElement('audio', 'http://example.com/audio.mp3')
    assert.strictEqual(audio.src, 'http://example.com/audio.mp3')
  })

  it('video', function () {
    const video = createMediaElement('video', 'http://example.com/video.mp4', 'http://example.com/image.jpg')
    assert.strictEqual(video.src, 'http://example.com/video.mp4')
    assert.strictEqual(video.poster, 'http://example.com/image.jpg')
  })

  it('image', function () {
    const image = createMediaElement('audio', 'http://example.com/image.jpg')
    assert.strictEqual(image.src, 'http://example.com/image.jpg')
  })

})
