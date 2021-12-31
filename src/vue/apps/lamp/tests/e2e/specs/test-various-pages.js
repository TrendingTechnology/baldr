describe('Various pages', () => {
  it('/', () => {
    cy.visit('/')
    cy.contains('.logo', 'Baldr')
    cy.contains('.subtitle', 'Präsentations-Software für den Schuleinsatz')
  })

  it('/documentation', () => {
    cy.visit('/#/documentation')
    cy.contains('h1', 'Dokumentation')
    cy.contains('h2', 'Master-Folien')
  })

  it('/tex-markdown-converter', () => {
    cy.visit('/#/tex-markdown-converter')
    cy.contains('TeX-Markdown-Konvertierung')
  })

  it('/media-categories', () => {
    cy.visit('/#/media-categories')
    cy.contains('Zwei-Buchstaben-Abkürzungen')
    cy.contains('Metadaten-Kategorien')
  })
})
