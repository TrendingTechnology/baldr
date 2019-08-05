const { utils } = require('@bldr/core')

/***********************************************************************
 *
 **********************************************************************/

describe('“utils” #unittest', () => {
  it('utils.log', function () {
    utils.log('String: %s: Number %d', 'lol', 123)
  })
})
