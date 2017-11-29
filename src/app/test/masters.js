const {
  allMasters,
  assert,
  path,
  rewire
} = require('baldr-test');

const {getMasters} = require('baldr-application');
let masters = new getMasters();


describe.skip('Class “MasterOfMasters” #unittest', function() {
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

describe.skip('Class “MasterOfMasters” extended on a example master class (quote) #unittest', function() {

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

    it('Property “this.alreadySet”', function() {
      this.master.set();
      assert.equal(this.master.alreadySet, true);
    });

  });

  it('[master].hasCSS()', function() {
    assert.equal(typeof this.master.hasCSS, 'function');
  });

  it('[master].setCSS()', function() {
    assert.equal(typeof this.master.setCSS, 'function');
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

describe('Class “Master()” #unittest', () => {
  let person;

    beforeEach(() => {
      let mastersJs = rewire(path.join(__dirname, '..', 'masters.js'));
      let Master = mastersJs.__get__('Master');
      person = new Master(
        path.resolve(__dirname, '..', '..', '..', 'masters', 'person', 'index.js'),
        'person'
      );
    });

  describe('Properties', () => {

    it('this.config', () => {
      assert.equal(person.config.theme, 'default');
      assert.equal(person.config.centerVertically, false);
      assert.equal(person.config.stepSupport, false);
    });

    it('this.css', () => {
      assert.equal(person.css, true);
    });

    it('this.documentation', () => {
      assert.equal(typeof person.documentation.examples, 'object');
    });

    it('this.name', () => {
      assert.equal(person.name, 'person');
    });

    it('this.path', () => {
      assert.ok(person.path.includes('/person'));
    });

  });

  describe('Methods', () => {

    it('Method “cleanUp()”', () => {
      assert.equal(typeof person.cleanUp, 'function');
    });

    it('Method “init()”', () => {
      assert.equal(typeof person.init, 'function');
    });

    it('Method “initSteps()”', () => {
      assert.equal(typeof person.initSteps, 'function');
    });

    it('Method “initStepsEveryVisit()”', () => {
      assert.equal(typeof person.initStepsEveryVisit, 'function');
    });

    it('Method “mainHTML()”', () => {
      assert.equal(typeof person.mainHTML, 'function');
    });

    it('Method “modalHTML()”', () => {
      assert.equal(typeof person.modalHTML, 'function');
    });

    it('Method “normalizeData()”', () => {
      assert.equal(typeof person.normalizeData, 'function');
    });

    it('Method “postSet()”', () => {
      assert.equal(typeof person.postSet, 'function');
    });

    it('Method “quickStartEntries()”', () => {
      assert.equal(typeof person.quickStartEntries, 'function');
    });

    it('Method “setStepByNo()”', () => {
      assert.equal(typeof person.setStepByNo, 'function');
    });

  });

});

describe('Class “Masters()” #unittest', () => {

  describe('Properties', () => {

    it('this.path', () => {
      assert.equal(
        masters.path,
        path.resolve(__dirname, '..', '..', '..', 'masters')
      );
    });

    it('this.all', () => {
      assert.deepEqual(masters.all, allMasters);
    });

  });

  it('Method “getAll()”', () => {
    assert.deepEqual(masters.getAll(), allMasters);
  });

});

describe('Function getMasters()” #unittest', function() {

  it('simple', function() {
    let {getMasters} = require('baldr-application');
    let masters = getMasters();
    assert.equal(typeof masters.all, 'object');
  });

});
