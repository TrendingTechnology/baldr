const {
  assert,
  requireFile
} = require('@bldr/test-helper')

const { JSDOM } = require('jsdom')
const player = requireFile('@bldr/foundation-master', 'player.js')

describe('lib/player.js #unittest', () => {
  it('Method “renderPlayer()”: audio', () => {
    const html = player.renderPlayer('test', 'test.mp3')
    const dom = new JSDOM(html)
    const root = dom.window.document.getElementById('test')
    assert.equal(root.id, 'test')
    const audio = root.querySelector('audio')
    assert.equal(audio.nodeName, 'AUDIO')
  })

  it('Method “renderPlayer()”: video', () => {
    const html = player.renderPlayer('test', 'test.mp4', true)
    const dom = new JSDOM(html)
    const root = dom.window.document.getElementById('test')
    assert.equal(root.id, 'test')
    const video = root.querySelector('video')
    assert.equal(video.nodeName, 'VIDEO')
  })
})
