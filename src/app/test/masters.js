const {
  allMasters,
  assert,
  path,
  rewire,
  requireFile,
  getDOM
} = require('baldr-test');

const {getMasters} = requireFile('app', 'masters.js');
let masters = new getMasters(getDOM());

/***********************************************************************
 *
 **********************************************************************/

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

    describe('this.config', () => {

      it('this.config.centerVertically', () => {
        assert.equal(person.config.centerVertically, false);
      });

      it('this.config.margin', () => {
        assert.equal(person.config.margin, false);
      });

      it('this.config.stepSupport', () => {
        assert.equal(person.config.stepSupport, false);
      });

      it('this.config.theme', () => {
        assert.equal(person.config.theme, 'default');
      });

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

/***********************************************************************
 *
 **********************************************************************/

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

  describe('Methods', () => {
    it('Method “addCSS_()”', function() {
      const masters = getMasters(getDOM());
      const firstRunCount = masters
        .document
        .querySelectorAll('link.baldr-master').length;

      masters.addCSS_();
      const SecondRunCount = masters
        .document
        .querySelectorAll('link.baldr-master').length;

      assert.equal(SecondRunCount, firstRunCount * 2);
    });

    it('Method “getAll_()”', () => {
      assert.deepEqual(masters.getAll_(), allMasters);
    });
  });

});

/***********************************************************************
 *
 **********************************************************************/

describe('Function getMasters()” #unittest', function() {

  it('simple', function() {
    const {getMasters} = requireFile('app', 'masters.js');
    let masters = getMasters(getDOM());
    assert.equal(typeof masters.all, 'object');
  });

});
