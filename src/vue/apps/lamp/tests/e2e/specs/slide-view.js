describe('Increase and decrease font size', () => {
  it('Increase', () => {
    cy.visit('/#/presentation/EP_master_generic/slide/1')
    cy.contains('Lorem')
    cy.get('.vc_slide_view').should('have.css', 'font-size', '20px')
    cy.get('body').type('{ctrl}2')
    cy.get('.vc_slide_view').should('have.css', 'font-size', '21px')
  })

  it('Decrease', () => {
    cy.visit('/#/presentation/EP_master_generic/slide/1')
    cy.contains('Lorem')
    cy.get('body').type('{ctrl}3')
    cy.get('.vc_slide_view').should('have.css', 'font-size', '19px')
  })

  it('Reset', () => {
    cy.visit('/#/presentation/EP_master_generic/slide/1')
    cy.contains('Lorem')
    cy.get('body').type('{ctrl}2')
    cy.get('.vc_slide_view').should('have.css', 'font-size', '21px')
    cy.get('body').type('{ctrl}1')
    cy.get('.vc_slide_view').should('have.css', 'font-size', '20px')
  })
})
