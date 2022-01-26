describe('Styles', () => {
  describe('Slides preview', function () {
    it('fontsize: 8em;', () => {
      cy.visitCommon('style')
      cy.get('#slide-preview_no-1').should('have.css', 'font-size', '48px')
    })

    it('color and background-color', () => {
      cy.visitCommon('style')
      cy.get('#slide-preview_no-2')
        .should('have.css', 'background-color', 'rgb(78, 121, 167)')
        .should('have.css', 'color', 'rgb(89, 161, 78)')
    })
  })

  describe('Slide main', function () {
    it('fontsize: 8em;', () => {
      cy.visitCommon('style', 1)
      cy.get('.vc_generic_master').should('have.css', 'font-size', '160px')
    })

    it('color and background-color', () => {
      cy.visitCommon('style', 2)
      cy.get('.vc_generic_master')
        .should('have.css', 'background-color', 'rgb(78, 121, 167)')
        .should('have.css', 'color', 'rgb(89, 161, 78)')
    })
  })
})
