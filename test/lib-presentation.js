const assert = require('assert');
const path = require('path');
const rewire = require('rewire')('../lib/presentation.js');
const {Presentation} = require('../lib/presentation.js');

describe('Class “Presentation()”', () => {

  beforeEach(function() {
    this.prs = new Presentation('example.baldr');
  });

  describe('Properties', function() {

    it('this.slides', function() {
      assert.equal(this.prs.slides[1].master, 'quote');
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
        path.resolve(path.dirname('example.baldr'))
      );
    });

    it('this.currentSlide', function() {
      assert.equal(
        this.prs.currentSlide.master, 'quote'
      );
    });

    it('this.HTML', function() {
      assert.equal(this.prs.HTML, '');
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

  it('Method “render()”', function() {
    this.prs.render();
    let html = this.prs.HTML;
    assert.ok(html.includes('Johann Wolfgang von Goethe'));
  });

  it('Method “output()”', function() {
    let html = this.prs.render().output();
    assert.ok(html.includes('Johann Wolfgang von Goethe'));
  });

  it('Method chaining', function() {
    let html = this.prs.next().render().output();
    assert.ok(html.includes('Ludwig van Beethoven'));
  });
});
