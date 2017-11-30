const {
  assert,
  document,
  getDOM,
  fs,
  path,
  testFileMinimal
} = require('baldr-test');

const {ShowRunner} = require('baldr-application');
const mousetrap = require('mousetrap');

/***********************************************************************
 *
 **********************************************************************/

describe('Class “ShowRunner()” #unittest', () => {
  let show;

  beforeEach(() => {
    show = new ShowRunner([testFileMinimal], getDOM(), mousetrap);
  });

  describe('Properties', () => {

    it('Property “this.config.sessionFile', () => {
      assert.ok(fs.existsSync(show.config.sessionFile));
    });

    it('Property “this.config.raw', () => {
      assert.equal(typeof show.config.raw, 'object');
    });

    it('Property “this.slides[1].master.name', () => {
      assert.equal(show.slides[1].master.name, 'quote');
    });

    it('Property “this.slidesSwitcher.count', () => {
      assert.equal(show.slidesSwitcher.count, 3);
    });

    it('Property “this.slidesSwitcher.no', () => {
      assert.equal(show.slidesSwitcher.no, 1);
    });

    it('Property “this.config.sessionDir', () => {
      assert.equal(
        show.config.sessionDir,
        path.resolve(path.dirname(testFileMinimal))
      );
    });

    it('Property “this.newSlide.master.name”', () => {
      assert.equal(
        show.newSlide.master.name, 'quote'
      );
    });

    it.skip('Property “this.cover”', () => {
      assert.equal(presentation.cover.id, 'cover');
      assert.equal(presentation.cover.nodeName, 'DIV');
    });

    it.skip('Property “this.media”', () => {
      assert.equal(typeof presentation.media.audio.length, 'number');
      assert.equal(typeof presentation.media.image.length, 'number');
      assert.equal(typeof presentation.media.video.length, 'number');
      assert.equal(presentation.media.audio[0].basename, 'beethoven.mp3');
    });

    it.skip('Property “this.quickies”', () => {
      assert.equal(typeof presentation.quickies, 'object');
    });

  });

  describe.skip('Methods', () => {

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

    it('Method “setCover()”', () => {
      presentation.setCover('red', 99);
      let cover = presentation.document.getElementById('cover');
      assert.equal(cover.style.backgroundColor, 'red');
      assert.equal(cover.style.zIndex, 99);
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
