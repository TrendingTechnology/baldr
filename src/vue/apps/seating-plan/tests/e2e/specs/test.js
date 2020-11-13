// https://docs.cypress.io/api/introduction/api.html

/* globals describe it cy */

describe('My First Test', () => {
  it('Visits the app root url', () => {
    cy.visit('/')
    cy.contains('h1', 'Sitzpläne Musiksaal E 17')
  })
})
