describe('Titles', () => {
  it('/titles', () => {
    cy.visit('/#/titles')
    cy.contains('Alle Themen')
    cy.contains('Wolfgang Amadeus Mozart (1756 - 1791) - Ein Wunderkind auf Reisen')
  })

  it('/titles/Musik/05/20_Mensch-Zeit', () => {
    cy.visit('/#/titles/Musik/05/20_Mensch-Zeit')
    cy.contains('Lernbereich 2: Musik - Mensch - Zeit')
    cy.contains('Wolfgang Amadeus Mozart (1756 - 1791) - Ein Wunderkind auf Reisen')
  })
})
