const {
  assert,
  document,
  getDOM,
  path,
  presentation,
  state
} = require('baldr-test');

const rewire = require('rewire')('../lib/presentation.js');
const {Presentation} = require('../lib/presentation.js');

const minimal = path.join('test', 'files', 'minimal.baldr');

describe('Class “Presentation()”', () => {

  beforeEach(function() {
    this.prs = new Presentation(minimal, document);
  });

  describe('Properties', function() {

    it('this.slides', function() {
      assert.equal(this.prs.slides[1].masterName, 'quote');
    });

    it('this.count', function() {
      assert.equal(this.prs.count, 3);
    });

    it('this.no', function() {
      assert.equal(this.prs.no, 1);
    });

    it('this.pwd', function() {
      assert.equal(
        this.prs.pwd,
        path.resolve(path.dirname(minimal))
      );
    });

    it('this.currentSlide', function() {
      assert.equal(
        this.prs.currentSlide.masterName, 'quote'
      );
    });

    it('this.cover', function() {
      assert.equal(this.prs.cover.id, 'cover');
      assert.equal(this.prs.cover.nodeName, 'DIV');
    });

  });

  it('Method “prev()”', function() {
    this.prs.prev();
    assert.equal(this.prs.no, 3);
    this.prs.prev();
    assert.equal(this.prs.no, 2);
    this.prs.prev();
    assert.equal(this.prs.no, 1);
    this.prs.prev();
    assert.equal(this.prs.no, 3);
  });

  it('Method “next()”', function() {
    this.prs.next();
    assert.equal(this.prs.no, 2);
    this.prs.next();
    assert.equal(this.prs.no, 3);
    this.prs.next();
    assert.equal(this.prs.no, 1);
    this.prs.next();
    assert.equal(this.prs.no, 2);
  });

  it('Method “setCoverBackground()”', function() {
    this.prs.setCoverBackground('red');
    let cover = this.prs.document.getElementById('cover');
    assert.equal(cover.style.backgroundColor, 'red');
  });

  it('Method “set()”', function() {
    this.prs.set();
    assert.equal(this.prs.cover.style.backgroundColor, 'black');
    assert.ok(this.prs.currentSlide.elemSlide.textContent.includes('Johann Wolfgang von Goethe'));
  });

  it('Method chaining', function() {
    this.prs.next().set();
    assert.ok(this.prs.currentSlide.elemSlide.textContent.includes('Ludwig van Beethoven'));
  });
});
