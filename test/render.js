const {
  assert,
  document
} = require('./lib/helper.js');

const rewire = require('rewire')('../render.js');
rewire.__set__('document', document);
let toggleModal = rewire.__get__('toggleModal');

describe('“render.js”', function() {
  it('“toggleModal()”', function() {
    let modal = document.getElementById('modal');

    assert.equal(toggleModal(), 'block');
    assert.equal(modal.style.display, 'block');

    assert.equal(toggleModal(), 'none');
    assert.equal(modal.style.display, 'none');

    assert.equal(toggleModal(), 'block');
    assert.equal(modal.style.display, 'block');

  });
});
