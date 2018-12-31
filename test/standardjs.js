const standard = require('mocha-standard')

describe('standardjs', function () {
  this.timeout(4000)
  it('Conforms to standard', standard.files(['packages/**/*.js', 'test/*.js']))
})
