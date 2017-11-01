const {
  allMasters,
  assert,
  document,
  fs,
  getDOM,
  path,
  presentation
} = require('./lib/helper.js');

const {instantiateMaster, Masters, MasterOfMasters} = require('../lib/masters.js');
const masters = new Masters(document, presentation);


describe('Function “instantiateMaster()”', function() {
  it('simple', function() {
    let master = instantiateMaster('quote', document, presentation);
    assert.equal(master.masterName, 'quote');
  });

  it('propObj', function() {
    let master = instantiateMaster('quote', document, presentation, {lol: 'troll'});
    assert.equal(master.lol, 'troll');
  });

  it('propObj multiple', function() {
    let master = instantiateMaster('quote', document, presentation, {lol: 'troll', abc: 'xyz'});
    assert.equal(master.abc, 'xyz');
  });
});

describe('Class “MasterOfMasters”', function() {
  beforeEach(function() {
    this.mom = new MasterOfMasters({
      document: document,
      data: this.data,
      masterPath: path.resolve(__dirname, '..', 'masters', 'quote'),
      nameName: 'quote'
    });
  });

  it('Instantiation', function() {
    assert.equal(typeof MasterOfMasters, 'function');
    assert.equal(typeof this.mom, 'object');
  });

  describe('Properties', function() {
    it('Property “document”', function() {
      assert.equal(typeof this.mom.document, 'object');
    });

    it('Property “elemSlide”', function() {
      assert.equal(this.mom.elemSlide.id, 'slide');
      assert.equal(this.mom.elemSlide.nodeName, 'MAIN');
      assert.equal(this.mom.elemSlide.nodeType, 1);
    });
  });

  describe('Methods', function() {
    it('Method “hasCSS()”', function() {
      assert.equal(typeof this.mom.hasCSS, 'function');
      assert.equal(this.mom.hasCSS(), true);
    });

    it('Method “setCSS()”', function() {
      this.mom.setCSS();
      assert.equal(
        typeof this.mom.document.querySelector('link#current-master'),
        'object'
      );
    });

    it('Method “set()”', function() {
      this.mom.set();
      assert.equal(
        this.mom.elemSlide.innerHTML,
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

    it('[master].render()', () => {
      for (let master of allMasters) {
        assert.equal(typeof masters[master].render, 'function');
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
