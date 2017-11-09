const {
  allMasters,
  assert,
  document,
  fs,
  getDOM,
  path,
  presentation
} = require('baldr-test');

const {loadMaster, Masters, MasterOfMasters} = require('baldr-masters');
const masters = new Masters(document, presentation);

describe('Function “loadMaster()”', function() {
  it('simple', function() {
    let master = loadMaster('quote', document, presentation);
    assert.equal(master.masterName, 'quote');
  });

  it('propObj', function() {
    let master = loadMaster('quote', document, presentation, {lol: 'troll'});
    assert.equal(master.lol, 'troll');
  });

  it('propObj multiple', function() {
    let master = loadMaster('quote', document, presentation, {lol: 'troll', abc: 'xyz'});
    assert.equal(master.abc, 'xyz');
  });
});

describe('Class “MasterOfMasters”', function() {
  beforeEach(function() {
    this.MoM = new MasterOfMasters({
      document: document,
      data: this.data,
      masterPath: path.resolve(__dirname, '..', 'masters', 'quote'),
      nameName: 'quote'
    });
  });

  it('Instantiation', function() {
    assert.equal(typeof MasterOfMasters, 'function');
    assert.equal(typeof this.MoM, 'object');
  });

  describe('Properties', function() {
    it('Property “document”', function() {
      assert.equal(typeof this.MoM.document, 'object');
    });

    it('Property “elemSlide”', function() {
      assert.equal(this.MoM.elemSlide.id, 'slide-content');
      assert.equal(this.MoM.elemSlide.nodeName, 'DIV');
      assert.equal(this.MoM.elemSlide.nodeType, 1);
    });

    it('Property “elemModal”', function() {
      assert.equal(this.MoM.elemModal.id, 'modal-content');
      assert.equal(this.MoM.elemModal.nodeName, 'DIV');
      assert.equal(this.MoM.elemModal.nodeType, 1);
    });
  });

  describe('Methods', function() {
    it('Method “hasCSS()”', function() {
      assert.equal(typeof this.MoM.hasCSS, 'function');
      assert.equal(this.MoM.hasCSS(), true);
    });

    it('Method “setCSS()”', function() {
      this.MoM.setCSS();
      assert.equal(
        typeof this.MoM.document.querySelector('link#current-master'),
        'object'
      );
    });

    it('Method “set()”', function() {
      this.MoM.set();
      assert.equal(
        this.MoM.elemSlide.innerHTML,
        'No slide loaded.'
      );
    });
  });

});

describe('Class “MasterOfMasters” extended on a example master class (quote)', function() {

  beforeEach(function() {
    let Master = require('../masters/quote').MasterQuote;
    this.data = {text: 'text', author: 'author'};
    this.master = new Master({
      document: document,
      data: this.data,
      masterPath: path.resolve(__dirname, '..', 'masters', 'quote'),
      masterName: 'quote'
    });
  });

  describe('Properties', function() {
    it('Property “this.masterPath”', function() {
      assert.equal(
        this.master.masterPath,
        path.resolve(__dirname, '..', 'masters', 'quote')
      );
    });

    it('this.masterName', function() {
      assert.equal(
        this.master.masterName,
        'quote'
      );
    });
  });
});

describe('Class “Masters()”', () => {

  describe('Properties', () => {

    it('this.path', () => {
      assert.equal(
        masters.path,
        path.resolve(__dirname, '..', 'masters')
      );
    });

    it('this.all', () => {
      assert.deepEqual(masters.all, allMasters);
    });

    it('[master].hasCSS()', () => {
      for (let master of allMasters) {
        assert.equal(typeof masters[master].hasCSS, 'function');
      }
    });

    it('[master].setCSS()', () => {
      for (let master of allMasters) {
        assert.equal(typeof masters[master].setCSS, 'function');
      }
    });

    it('[master].hookSetHTMLSlide()', () => {
      for (let master of allMasters) {
        assert.equal(typeof masters[master].hookSetHTMLSlide, 'function');
      }
    });

    it('[master].hookSetHTMLModal()', () => {
      for (let master of allMasters) {
        assert.equal(typeof masters[master].hookSetHTMLModal, 'function');
      }
    });

    it('[master].set()', () => {
      for (let master of allMasters) {
        assert.equal(typeof masters[master].set, 'function');
      }
    });

    it('[master].masterName', () => {
      for (let master of allMasters) {
        assert.equal(masters[master].masterName, master);
      }
    });

  });

  it('Method “getModules()”', () => {
    assert.deepEqual(masters.getModules(), allMasters);
  });

});
