const {
  assert,
  requireFile
} = require('@bldr/test-helper')

const { JSDOM } = require('jsdom')
const player = requireFile('lib', 'player.js')

describe('lib/player.js #unittest', () => {
  it('Method “renderPlayer()”: audio', () => {
    let html = player.renderPlayer('test', 'test.mp3')
    let dom = new JSDOM(html)
    let root = dom.window.document.getElementById('test')
    assert.equal(root.id, 'test')
    let audio = root.querySelector('audio')
    assert.equal(audio.nodeName, 'AUDIO')
  })

  it('Method “renderPlayer()”: video', () => {
    let html = player.renderPlayer('test', 'test.mp4', true)
    let dom = new JSDOM(html)
    let root = dom.window.document.getElementById('test')
    assert.equal(root.id, 'test')
    let video = root.querySelector('video')
    assert.equal(video.nodeName, 'VIDEO')
  })
})
