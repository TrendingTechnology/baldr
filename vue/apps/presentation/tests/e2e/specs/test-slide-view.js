describe('Increase and decrease font size', () => {
  it('Shortcut to increase font size', () => {
    cy.visit('/presentation/EP_master_generic/slide/1')
    cy.contains('Lorem')
    cy.get('.vc_slide_view').should('have.css', 'font-size', '20px')
    cy.get('body').type('+')
    cy.get('.vc_slide_view').should('have.css', 'font-size', '21px')
  })

  it('Shortcut to decrease font size', () => {
    cy.visit('/presentation/EP_master_generic/slide/1')
    cy.contains('Lorem')
    cy.get('body').type('-')
    cy.get('.vc_slide_view').should('have.css', 'font-size', '19px')
  })

  it('Shortcut to reset font size', () => {
    cy.visit('/presentation/EP_master_generic/slide/1')
    cy.contains('Lorem')
    cy.get('body').type('+')
    cy.get('.vc_slide_view').should('have.css', 'font-size', '21px')
    cy.get('body').type('{ctrl}1')
    cy.get('.vc_slide_view').should('have.css', 'font-size', '20px')
  })
})

describe('Master icon', function () {
  it('Shortcut to reset font size', () => {
    cy.visit('/presentation/EP_common_allMasters/slide/1')
    cy.get('.vc_master_icon > .baldr-icon')
  })
})
