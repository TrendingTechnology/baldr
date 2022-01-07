/* globals describe it */

const { parsePresentation } = require('./_helper.js')

async function aparseAndResolve (masterName) {
  const presentation = parsePresentation('masters/' + masterName)
  return await presentation.resolve()
}

describe('Parse all master example presentations', function () {
  it('audio', async function () {
    await aparseAndResolve('audio')
  })

  it('camera', async function () {
    await aparseAndResolve('camera')
  })

  it('cloze', async function () {
    await aparseAndResolve('cloze')
  })

  it('counter', async function () {
    await aparseAndResolve('counter')
  })

  it('document', async function () {
    await aparseAndResolve('document')
  })

  it('editor', async function () {
    await aparseAndResolve('editor')
  })

  it('generic', async function () {
    await aparseAndResolve('generic')
  })

  it('group', async function () {
    await aparseAndResolve('group')
  })

  it('image', async function () {
    await aparseAndResolve('image')
  })

  it('instrument', async function () {
    await aparseAndResolve('instrument')
  })

  it('interactiveGraphic', async function () {
    await aparseAndResolve('interactiveGraphic')
  })

  it('note', async function () {
    await aparseAndResolve('note')
  })

  it('person', async function () {
    await aparseAndResolve('person')
  })

  it('question', async function () {
    await aparseAndResolve('question')
  })

  it('quote', async function () {
    await aparseAndResolve('quote')
  })

  it('sampleList', async function () {
    await aparseAndResolve('sampleList')
  })

  it('scoreSample', async function () {
    await aparseAndResolve('scoreSample')
  })

  it('section', async function () {
    await aparseAndResolve('section')
  })

  it('song', async function () {
    await aparseAndResolve('song')
  })

  it('task', async function () {
    await aparseAndResolve('task')
  })

  it('video', async function () {
    await aparseAndResolve('video')
  })

  it('wikipedia', async function () {
    await aparseAndResolve('wikipedia')
  })

  it('youtube', async function () {
    await aparseAndResolve('youtube')
  })
})
