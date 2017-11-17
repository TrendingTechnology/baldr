const {
  assert,
  document,
  returnDOM
} = require('baldr-test');

const {Quickies} = require('../lib/quickies.js');

let initiateQuickies = function() {
  return new Quickies(returnDOM());
};

let quickies;

describe('Class “Quickies()”', () => {

  beforeEach(() => {
    quickies = initiateQuickies();
  });

  describe('Properties', () => {

    it('Property “this.document”', () => {
      assert.equal(quickies.document.nodeName, '#document');
    });

    it('Property “this.defaultQuickies”', () => {
      assert.equal(quickies.defaultQuickies[0].title, 'Camera');
    });

    it('Property “this.elemNavigationMenu”', () => {
      assert.equal(quickies.elemNavigationMenu.nodeName, 'NAV');
    });

  });

  describe('Methods', () => {

    it('Method “renderButton()”', () => {
      let button = quickies.renderButton('lol', 'lol');
      assert.equal(button.nodeName, 'BUTTON');
      assert.equal(button.title, 'lol');
      assert.equal(button.classList.item(0), 'fa');
      assert.equal(button.classList.item(1), 'fa-lol');
    });

    it('Method “renderNavigationMenu()”', () => {
      quickies.renderNavigationMenu();
      let buttons = quickies.document.querySelectorAll('#nav-quickies button');
      assert.equal(buttons[0].title, 'Camera');
    });

    it('Method “set()”', () => {
      quickies.set();
      let buttons = quickies.document.querySelectorAll('#nav-quickies button');
      assert.equal(buttons[0].title, 'Camera');
    });

  });

});
