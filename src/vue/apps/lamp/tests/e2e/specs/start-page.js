// https://docs.cypress.io/api/introduction/api.html

describe('Start page', () => {
  it('App name', () => {
    cy.visit('/')
    cy.contains('.logo', 'Baldr')
    cy.contains('.subtitle', 'Präsentations-Software für den Schuleinsatz')
  })

  it('Documentation', () => {
    cy.visit('/#/documentation')
    cy.contains('h1', 'Dokumentation')
    cy.contains('h2', 'Master-Folien')
  })
})
