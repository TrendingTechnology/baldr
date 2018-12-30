const {
  assert,
  path,
  cloneConfig,
  makeDOM
} = require('baldr-test')

const person = require('../index.js')

let config = cloneConfig()
config.sessionDir = path.resolve(__dirname, '..')

let normalizeData = function (data) {
  return person.normalizeData(data, config)
}

let mainHTML = function (data) {
  let masterData = person.normalizeData(data, config)
  return person.mainHTML({ masterData: masterData }, config)
}

describe('Master slide “person” #unittest', () => {
  it('function “normalizeData()”: all Values', () => {
    const data = normalizeData({
      name: 'Ludwig van Beethoven',
      image: 'beethoven.jpg',
      birth: 1770,
      death: 1827
    })

    assert.equal(data.name, 'Ludwig van Beethoven')
    assert.ok(data.imagePath.includes('beethoven.jpg'))
    assert.ok(data.imagePath.includes(path.sep))
    assert.equal(data.birth, '* 1770')
    assert.equal(data.death, '† 1827')
    assert.equal(data.birthAndDeath, true)
  })

  it('function “normalizeData(): minimal values”', () => {
    const data = normalizeData({
      name: 'Ludwig van Beethoven',
      image: 'beethoven.jpg'
    })

    assert.equal(data.name, 'Ludwig van Beethoven')
    assert.equal(data.birth, '')
    assert.equal(data.death, '')
    assert.equal(data.birthAndDeath, false)
  })

  it('function “mainHTML()”', () => {
    let html = mainHTML({
      name: 'Ludwig van Beethoven',
      image: 'beethoven.jpg'
    })

    let doc = makeDOM(html)
    assert.equal(
      doc.querySelector('.info-box .person').textContent,
      'Ludwig van Beethoven'
    )

    assert.equal(
      doc.querySelector('img').getAttribute('src'),
      path.resolve(__dirname, '..', 'beethoven.jpg')
    )
  })
})
