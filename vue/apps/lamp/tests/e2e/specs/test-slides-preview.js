describe('Slides preview', () => {
  it('Mannenberg preview', () => {
    cy.visit('/presentation/Ibrahim-Mannenberg/preview')
    cy.contains(
      'Alle Fächer/Fach Musik/12. Jahrgangsstufe/Musik nach 1950/Einflüsse anderer Kulturen'
    )
    cy.contains('Ethnische Einflüsse im Jazz')
    cy.contains('Abdullah Ibrahim: Mannenberg (1974)')
  })
})
