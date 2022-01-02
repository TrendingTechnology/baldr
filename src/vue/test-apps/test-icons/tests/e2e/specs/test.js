describe('Visit all test pages', () => {
  it('/icons', () => {
    cy.visit('/icons')
  })

  it('/styles', () => {
    cy.visit('/styles')
  })

  it('/link', () => {
    cy.visit('/link')
  })

  it('/vanish', () => {
    cy.visit('/vanish')
  })
})
