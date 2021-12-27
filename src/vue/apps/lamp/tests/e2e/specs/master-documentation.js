describe('Master documentation /#/documentation/master/:masterName', () => {
  function visitDocumentation (masterName) {
    cy.visit('/#/documentation/master/' + masterName)
  }

  it('audio', () => {
    visitDocumentation('audio')
  })

  it('camera', () => {
    visitDocumentation('camera')
  })

  it('cloze', () => {
    visitDocumentation('cloze')
  })

  it('counter', () => {
    visitDocumentation('counter')
  })

  it('document', () => {
    visitDocumentation('document')
  })

  it('editor', () => {
    visitDocumentation('editor')
  })

  it('generic', () => {
    visitDocumentation('generic')
  })

  it('group', () => {
    visitDocumentation('group')
  })

  it('image', () => {
    visitDocumentation('image')
  })

  it('instrument', () => {
    visitDocumentation('instrument')
  })

  it('interactiveGraphic', () => {
    visitDocumentation('interactiveGraphic')
  })

  it('note', () => {
    visitDocumentation('note')
  })

  it('person', () => {
    visitDocumentation('person')
  })

  it('question', () => {
    visitDocumentation('question')
  })

  it('quote', () => {
    visitDocumentation('quote')
  })

  it('sampleList', () => {
    visitDocumentation('sampleList')
  })

  it('scoreSample', () => {
    visitDocumentation('scoreSample')
  })

  it('section', () => {
    visitDocumentation('section')
  })

  it('song', () => {
    visitDocumentation('song')
  })

  it('task', () => {
    visitDocumentation('task')
  })

  it('video', () => {
    visitDocumentation('video')
  })

  it('wikipedia', () => {
    visitDocumentation('wikipedia')
  })

  it('youtube', () => {
    visitDocumentation('youtube')
  })
})

describe('Master example presentations /#/presentation/EP_master_:masterName/preview', () => {
  function visitExample (masterName) {
    cy.visit('/#/presentation/EP_master_' + masterName + '/preview')
    cy.contains('h1', masterName)
  }

  it('audio', () => {
    visitExample('audio')
  })

  it('camera', () => {
    visitExample('camera')
  })

  it('cloze', () => {
    visitExample('cloze')
  })

  it('counter', () => {
    visitExample('counter')
  })

  it('document', () => {
    visitExample('document')
  })

  it('editor', () => {
    visitExample('editor')
  })

  it('generic', () => {
    visitExample('generic')
  })

  it('group', () => {
    visitExample('group')
  })

  it('image', () => {
    visitExample('image')
  })

  it('instrument', () => {
    visitExample('instrument')
  })

  it('interactiveGraphic', () => {
    visitExample('interactiveGraphic')
  })

  it('note', () => {
    visitExample('note')
  })

  it('person', () => {
    visitExample('person')
  })

  it('question', () => {
    visitExample('question')
  })

  it('quote', () => {
    visitExample('quote')
  })

  it('sampleList', () => {
    visitExample('sampleList')
  })

  it('scoreSample', () => {
    visitExample('scoreSample')
  })

  it('section', () => {
    visitExample('section')
  })

  it('song', () => {
    visitExample('song')
  })

  it('task', () => {
    visitExample('task')
  })

  it('video', () => {
    visitExample('video')
  })

  it('wikipedia', () => {
    visitExample('wikipedia')
  })

  it('youtube', () => {
    visitExample('youtube')
  })
})
