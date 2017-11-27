const {
  assert,
  document,
  getDOM,
  requireFile,
  masters
} = require('baldr-test');

const {QuickStart} = requireFile('app', 'quick-start.js');

let initiateQuickStart = function() {
  return new QuickStart(getDOM(), masters);
};

let quickStart;

describe('Class “QuickStart()”', () => {

  beforeEach(() => {
    quickStart = initiateQuickStart();
  });

  describe('Properties', () => {

    it('Property “this.document”', () => {
      assert.equal(quickStart.document.nodeName, '#document');
    });

    it('Property “this.elemNavigationMenu”', () => {
      assert.equal(quickStart.elemNavigationMenu.nodeName, 'NAV');
    });

  });

  describe('Methods', () => {

    it('Method “collectEntries()”', () => {
      let entries = quickStart.collectEntries();
      assert.equal(entries[0].title, 'Audio');
      assert.equal(entries[1].title, 'Camera');
    });

    it('Method “renderButton()”', () => {
      let button = quickStart.renderButton('lol', 'lol');
      assert.equal(button.nodeName, 'BUTTON');
      assert.equal(button.title, 'lol');
      assert.equal(button.classList.item(0), 'fa');
      assert.equal(button.classList.item(1), 'fa-lol');
    });

    it('Method “renderNavigationMenu()”', () => {
      quickStart.renderNavigationMenu();
      let buttons = quickStart.document.querySelectorAll('#nav-quick-start button');
      assert.equal(buttons[0].title, 'Audio');
    });

    it('Method “set()”', () => {
      quickStart.set();
      let buttons = quickStart.document.querySelectorAll('#nav-quick-start button');
      assert.equal(buttons[0].title, 'Audio');
    });

  });

});
