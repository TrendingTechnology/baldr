describe('Real world presentations', () => {
  it('Mannenberg preview', () => {
    cy.visit('/#/presentation/Ibrahim-Mannenberg/preview')
  })

  it('Mannenberg Slide 1', () => {
    cy.visit('/#/presentation/Ibrahim-Mannenberg/slide/1')
  })

  it('Mannenberg Speaker view Slide 1', () => {
    cy.visit('/#/speaker-view/Ibrahim-Mannenberg/slide/1')
  })
})
