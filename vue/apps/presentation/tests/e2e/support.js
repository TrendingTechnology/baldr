Cypress.Commands.add('visitCommon', (commonName, slideNo) => {
  let url = `/presentation/EP_common_${commonName}`
  if (slideNo != null) {
    url += `/slide/${slideNo}`
  }
  cy.visit(url)
})
