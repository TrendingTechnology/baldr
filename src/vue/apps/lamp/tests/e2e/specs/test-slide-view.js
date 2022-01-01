describe('Increase and decrease font size', () => {
  it('Shortcut to increase font size', () => {
    cy.visit('/#/presentation/EP_master_generic/slide/1')
    cy.contains('Lorem')
    cy.get('.vc_slide_view').should('have.css', 'font-size', '20px')
    cy.get('body').type('{ctrl}2')
    cy.get('.vc_slide_view').should('have.css', 'font-size', '21px')
  })

  it('Shortcut to dncrease font size', () => {
    cy.visit('/#/presentation/EP_master_generic/slide/1')
    cy.contains('Lorem')
    cy.get('body').type('{ctrl}3')
    cy.get('.vc_slide_view').should('have.css', 'font-size', '19px')
  })

  it('Shortcut to reset font size', () => {
    cy.visit('/#/presentation/EP_master_generic/slide/1')
    cy.contains('Lorem')
    cy.get('body').type('{ctrl}2')
    cy.get('.vc_slide_view').should('have.css', 'font-size', '21px')
    cy.get('body').type('{ctrl}1')
    cy.get('.vc_slide_view').should('have.css', 'font-size', '20px')
  })
})

describe('Master icon', function () {
  it.only('Shortcut to reset font size', () => {
    cy.visit('/#/presentation/EP_common_allMasters/slide/1')
    cy.get('.vc_master_icon .baldr-icon')
      // .should('have.class', '.baldr-icon_music')
      .should('satisfy', $el => {
        console.log($el)
        const classList = Array.from($el[0].classList)
        return classList.includes('.baldr-icon_music')
      })
  })
})
