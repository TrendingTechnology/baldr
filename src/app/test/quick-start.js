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

/***********************************************************************
 *
 **********************************************************************/

describe('Class “QuickStart()” #unittest', () => {

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

    it('Method “collectEntries_()”', () => {
      let entries = quickStart.collectEntries_();
      assert.equal(entries[0].title, 'Audio');
      assert.equal(entries[0].masterName, 'audio');
      assert.equal(entries[0].cssID, 'quick-start-entry_audio_1');
      assert.equal(entries[0].data, true);

      assert.equal(entries[1].title, 'Camera');
      assert.equal(entries[1].masterName, 'camera');
      assert.equal(entries[1].cssID, 'quick-start-entry_camera_2');
      assert.equal(entries[1].data, true);
    });

    it('Method “renderButton_()”', () => {
      let entry = {
        title: 'lol',
        fontawesome: 'lol'
      };
      let button = quickStart.renderButton_(entry);
      assert.equal(button.nodeName, 'BUTTON');
      assert.equal(button.title, 'lol');
      assert.equal(button.classList.item(0), 'fa');
      assert.equal(button.classList.item(1), 'fa-lol');
    });

    it('Method “renderNavigationMenu_()”', () => {
      quickStart.renderNavigationMenu_();
      let buttons = quickStart.document.querySelectorAll('#nav-quick-start button');
      assert.equal(buttons[0].title, 'Audio (ctrl+alt+a)');
    });

    it('Method “set()”', () => {
      quickStart.set();
      let buttons = quickStart.document.querySelectorAll('#nav-quick-start button');
      assert.equal(buttons[0].title, 'Audio (ctrl+alt+a)');
    });

  });

});
