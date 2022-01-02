describe('audio', () => {
  it('Contains text', () => {
    cy.visit('/audio')
    cy.contains('Audio')
  })
})

describe('video', () => {
  it('Contains text', () => {
    cy.visit('/video')
    cy.contains('Video')
  })
})
