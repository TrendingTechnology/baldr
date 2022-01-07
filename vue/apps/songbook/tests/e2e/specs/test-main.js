describe('Startpage', () => {
  it('/', () => {
    cy.visit('/')
    cy.contains('Liederbuch')
  })
})
