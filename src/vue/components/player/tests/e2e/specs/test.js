// https://docs.cypress.io/api/introduction/api.html

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
