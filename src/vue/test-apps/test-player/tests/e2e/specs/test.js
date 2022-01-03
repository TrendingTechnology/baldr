describe('Test @bldr/player', () => {
  describe('Classes', function () {
    it('/classes/playable', function () {
      cy.visit('/classes/playable')
      cy.contains('Playable')
    })

    it('/classes/player', function () {
      cy.visit('/classes/player')
      cy.contains('Player')
    })
  })

  describe('Components', () => {
    it('/components/media-player', function () {
      cy.visit('/components/media-player')
      cy.contains('MediaPlayer')
    })

    it('/components/play-button', function () {
      cy.visit('/components/play-button')
      cy.contains('PlayButton')
    })

    it('/components/progress-bar', function () {
      cy.visit('/components/progress-bar')
      cy.contains('ProgressBar')
    })

    it('/components/wave-form', function () {
      cy.visit('/components/wave-form')
      cy.contains('WaveForm')
    })
  })
})
