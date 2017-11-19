const {
  allMasters,
  assert,
  document,
  fs,
  getDOM,
  path,
  presentation,
  masters,
  returnDOM
} = require('baldr-test');

const {loadMaster, MasterOfMasters, LoadMasters} = require('baldr-masters');
let _masters = new LoadMasters(document, presentation);

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
    let {Master} = require('../masters/quote')(document, masters, presentation);

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

    it('Property “this.masterName”', function() {
      assert.equal(
        this.master.masterName,
        'quote'
      );
    });

    it('Property “this.centerVertically”', function() {
      assert.equal(this.master.centerVertically, true);
    });

    it('Property “this.alreadySet”', function() {
      this.master.set();
      assert.equal(this.master.alreadySet, true);
    });

    it('Property “this.theme”', function() {
      assert.equal(this.master.theme, 'default');
    });
  });

  it('[master].hasCSS()', function() {
    assert.equal(typeof this.master.hasCSS, 'function');
  });

  it('[master].setCSS()', function() {
    assert.equal(typeof this.master.setCSS, 'function');
  });

  it('[master].hookSetHTMLSlide()', function() {
    assert.equal(typeof this.master.hookSetHTMLSlide, 'function');
  });

  it('[master].hookSetHTMLModal()', function() {
    assert.equal(typeof this.master.hookSetHTMLModal, 'function');
  });

  it('[master].set()', function() {
    assert.equal(typeof this.master.set, 'function');
    this.master.set();
    assert.equal(this.master.document.body.dataset.master, 'quote');
  });

  it('[master].set() <body data-master="masterName">', function() {
    this.master.set();
    assert.equal(this.master.document.body.dataset.master, 'quote');
  });

  it('[master].set() <body data-center-vertically="true">', function() {
    this.master.set();
    assert.equal(this.master.document.body.dataset.centerVertically, 'true');
  });

  it('[master].set() <body data-theme="default">', function() {
    this.master.set();
    assert.equal(this.master.document.body.dataset.theme, 'default');
  });

});

describe('Class “LoadMasters()”', () => {

  describe('Properties', () => {

    it('this.path', () => {
      assert.equal(
        _masters.path,
        path.resolve(__dirname, '..', 'masters')
      );
    });

    it('this.all', () => {
      assert.deepEqual(_masters.all, allMasters);
    });

  });

  it('Method “getAll()”', () => {
    assert.deepEqual(_masters.getAll(), allMasters);
  });

});
