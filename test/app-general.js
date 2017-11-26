const {
  assert,
  document,
  getDOM,
  requireFile
} = require('baldr-test');

const {General} = requireFile('app', 'general.js');

let initiateGeneral = function() {
  return new General(getDOM());
};

let general;

describe('Class “General()”', () => {

  beforeEach(() => {
    general = initiateGeneral();
  });

  describe('Properties', () => {

    it('Property “this.document”', () => {
      assert.equal(general.document.nodeName, '#document');
    });

    it('Property “this.defaultGeneral”', () => {
      assert.equal(general.defaultGeneral[0].title, 'Camera');
    });

    it('Property “this.elemNavigationMenu”', () => {
      assert.equal(general.elemNavigationMenu.nodeName, 'NAV');
    });

  });

  describe('Methods', () => {

    it('Method “renderButton()”', () => {
      let button = general.renderButton('lol', 'lol');
      assert.equal(button.nodeName, 'BUTTON');
      assert.equal(button.title, 'lol');
      assert.equal(button.classList.item(0), 'fa');
      assert.equal(button.classList.item(1), 'fa-lol');
    });

    it('Method “renderNavigationMenu()”', () => {
      general.renderNavigationMenu();
      let buttons = general.document.querySelectorAll('#nav-general button');
      assert.equal(buttons[0].title, 'Camera');
    });

    it('Method “set()”', () => {
      general.set();
      let buttons = general.document.querySelectorAll('#nav-general button');
      assert.equal(buttons[0].title, 'Camera');
    });

  });

});
