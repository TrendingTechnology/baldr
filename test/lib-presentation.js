const {
  assert,
  document,
  getDOM,
  fs,
  path,
  testFileMinimal
} = require('baldr-test');

const {Presentation} = require('../lib/presentation.js');

let initiatePresentation = function() {
  return new Presentation(testFileMinimal, document);
};

let presentation;

describe('Class “Presentation()”', () => {

  beforeEach(() => {
    presentation = initiatePresentation();
  });

  describe('Properties', () => {

    it('Property “this.baldrFile”', () => {
      assert.ok(fs.existsSync(presentation.baldrFile));
    });

    it('Property “this.raw”', () => {
      assert.equal(typeof presentation.raw, 'object');
    });

    it('Property “this.slides”', () => {
      assert.equal(presentation.slides[1].masterName, 'quote');
    });

    it('Property “this.count”', () => {
      assert.equal(presentation.count, 3);
    });

    it('Property “this.no”', () => {
      assert.equal(presentation.no, 1);
    });

    it('Property “this.pwd”', () => {
      assert.equal(
        presentation.pwd,
        path.resolve(path.dirname(testFileMinimal))
      );
    });

    it('Property “this.currentSlide”', () => {
      assert.equal(
        presentation.currentSlide.masterName, 'quote'
      );
    });

    it('Property “this.cover”', () => {
      assert.equal(presentation.cover.id, 'cover');
      assert.equal(presentation.cover.nodeName, 'DIV');
    });

    it('Property “this.media”', () => {
      assert.equal(typeof presentation.media.audio.length, 'number');
      assert.equal(typeof presentation.media.image.length, 'number');
      assert.equal(typeof presentation.media.video.length, 'number');
      assert.equal(presentation.media.audio[0].basename, 'beethoven.mp3');
    });

  });

  describe('Methods', () => {

    it('Method “parseYamlFile()”', () => {
      let presentation = initiatePresentation();
      let yml = presentation.parseYamlFile(testFileMinimal);
      assert.equal(yml.slides[0].quote.author, 'Johann Wolfgang von Goethe');
      assert.equal(yml.slides[1].question, 'When did Ludwig van Beethoven die?');
    });

    it('Method “prev()”',() => {
      presentation.prev();
      assert.equal(presentation.no, 3);
      presentation.prev();
      assert.equal(presentation.no, 2);
      presentation.prev();
      assert.equal(presentation.no, 1);
      presentation.prev();
      assert.equal(presentation.no, 3);
    });

    it('Method “next()”', () => {
      presentation.next();
      assert.equal(presentation.no, 2);
      presentation.next();
      assert.equal(presentation.no, 3);
      presentation.next();
      assert.equal(presentation.no, 1);
      presentation.next();
      assert.equal(presentation.no, 2);
    });

    it('Method “setCoverBackground()”', () => {
      presentation.setCoverBackground('red');
      let cover = presentation.document.getElementById('cover');
      assert.equal(cover.style.backgroundColor, 'red');
    });

    it('Method “set()”', () => {
      presentation.set();
      assert.equal(presentation.cover.style.backgroundColor, 'black');
      assert.ok(presentation.currentSlide.elemSlide.textContent.includes('Johann Wolfgang von Goethe'));
    });

    it('Method chaining', () => {
      presentation.next().set();
      assert.ok(presentation.currentSlide.elemSlide.textContent.includes('Ludwig van Beethoven'));
    });

  });

});
