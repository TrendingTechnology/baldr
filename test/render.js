const assert = require('assert');
const index = require('../render.js');

describe('Class “Presentation()”', () => {
  beforeEach(function() {
    this.p = new index.Presentation('presentation.yml');
  });

  it.skip('Properties', function() {
    assert.equal(this.p.count, 3);
    assert.equal(this.p.current.data.author, 'Johann Wolfgang von Goethe');
    assert.equal(this.p.current.no, 1);
    assert.equal(this.p.slides[0].quote.author, 'Johann Wolfgang von Goethe');
    assert.equal(this.p.slides[1].question[0].answer, 1827);
  });


  it.skip('Methode “previousSlide()”', function() {
    this.p.previousSlide();
    assert.equal(this.p.current.no, 3);
    assert.equal(this.p.current.master, 'person');
    assert.equal(this.p.current.data.image, 'beethoven.jpg');

    this.p.previousSlide();
    assert.equal(this.p.current.no, 2);
    assert.equal(this.p.current.master, 'question');
    assert.equal(this.p.current.data[0].answer, 1827);

    this.p.previousSlide();
    assert.equal(this.p.current.no, 1);
    assert.equal(this.p.current.master, 'quote');
    assert.equal(this.p.current.data.author, 'Johann Wolfgang von Goethe');

    this.p.previousSlide();
    assert.equal(this.p.current.no, 3);
    assert.equal(this.p.current.master, 'person');
    assert.equal(this.p.current.data.image, 'beethoven.jpg');
  });

  it.skip('Methode “nextSlide()”', function() {
    this.p.nextSlide();
    assert.equal(this.p.current.no, 2);
    assert.equal(this.p.current.master, 'question');
    assert.equal(this.p.current.data[0].answer, 1827);

    this.p.nextSlide();
    assert.equal(this.p.current.no, 3);
    assert.equal(this.p.current.master, 'person');
    assert.equal(this.p.current.data.image, 'beethoven.jpg');

    this.p.nextSlide();
    assert.equal(this.p.current.no, 1);
    assert.equal(this.p.current.master, 'quote');
    assert.equal(this.p.current.data.author, 'Johann Wolfgang von Goethe');

    this.p.nextSlide();
    assert.equal(this.p.current.no, 2);
  });
});
