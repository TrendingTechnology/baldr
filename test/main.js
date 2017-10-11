var assert = require('assert');
const fs = require('fs');


describe('build', () => {

  it('exists “dist/baldr-sbook-linux-x64/resources/app.asar”', () => {
    assert.ok(fs.existsSync('dist/baldr-sbook-linux-x64/resources/app.asar'));
  });

});
