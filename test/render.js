var assert = require('assert');
var index = require('../render.js');

describe('function “loadYaml()”', () => {
  it('presentation.yml', () => {
    var yml = index.loadYaml('presentation.yml');
    assert.equal(yml[0].quote.author, 'Johann Wolfgang von Goethe');
    assert.equal(yml[1].question[0].answer, 1827);
  });
});

describe('Class “Presentation()”', () => {
  beforeEach(function() {
    this.p = new index.Presentation('presentation.yml');
  });

  it('Properties', function() {
    assert.equal(this.p.slidesCount, 3);
    assert.equal(this.p.currentSlideObject.quote.author, 'Johann Wolfgang von Goethe');
    assert.equal(this.p.currentSlideNumber, 1);
    assert.equal(this.p.slides[0].quote.author, 'Johann Wolfgang von Goethe');
    assert.equal(this.p.slides[1].question[0].answer, 1827);
  });


  it('Methode “previousSlide()”', function() {
    this.p.previousSlide();
    assert.equal(this.p.currentSlideNumber, 3);
    assert.equal(this.p.currentSlideObject.person.image, 'beethoven.jpg');

    this.p.previousSlide();
    assert.equal(this.p.currentSlideNumber, 2);
    assert.equal(this.p.currentSlideObject.question[0].answer, 1827);

    this.p.previousSlide();
    assert.equal(this.p.currentSlideNumber, 1);
    assert.equal(this.p.currentSlideObject.quote.author, 'Johann Wolfgang von Goethe');

    this.p.previousSlide();
    assert.equal(this.p.currentSlideNumber, 3);
    assert.equal(this.p.currentSlideObject.person.image, 'beethoven.jpg');
  });

  it('Methode “nextSlide()”', function() {
    this.p.nextSlide();
    assert.equal(this.p.currentSlideNumber, 2);
    assert.equal(this.p.currentSlideObject.question[0].answer, 1827);

    this.p.nextSlide();
    assert.equal(this.p.currentSlideNumber, 3);
    assert.equal(this.p.currentSlideObject.person.image, 'beethoven.jpg');

    this.p.nextSlide();
    assert.equal(this.p.currentSlideNumber, 1);
    assert.equal(this.p.currentSlideObject.quote.author, 'Johann Wolfgang von Goethe');

    this.p.nextSlide();
    assert.equal(this.p.currentSlideNumber, 2);
  });
});
