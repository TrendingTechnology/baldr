const path = require('path');

const {
  addCSSFile,
  getConfig
} = require('baldr-library');

let requireLib = function(fileName) {
  return require(path.join(__dirname, fileName + '.js'));
};

const {getMasters} = requireLib('masters');
const {getSlides, Slide} = requireLib('slides');
const {SlidesSwitcher} = requireLib('slides-switcher');
const {getThemes} = requireLib('themes');

class ShowRunner {
  constructor(argv, document) {
    this.document = document;
    this.config = getConfig(argv);
    this.masters = getMasters();
    this.masters.execAll('init', this.document, this.config);
    this.slides = getSlides(
      this.config.slides,
      this.config,
      document,
      this.masters
    );
    this.themes = getThemes(document);
    this.slidesSwitcher = new SlidesSwitcher(
      this.slides,
      this.document,
      this.masters
    );

    this.oldSlide = {};
    this.addMastersCSS();
    this.setFirstSlide();
  }

  addMastersCSS() {
    for (let master of this.masters.all) {
      if (this.masters[master].css) {
        addCSSFile(
          document,
          path.join(this.masters[master].path, 'styles.css'),
          'baldr-master'
        );
      }
    }
  }

  setMain(slide) {
    let master = this.masters[this.newSlide.master];
    let elements = {
      slide: this.document.getElementById('slide-content'),
      modal: this.document.getElementById('modal-content')
    };

    let dataset = this.document.body.dataset;
    dataset.master = slide.master;
    dataset.centerVertically = master.config.centerVertically;
    dataset.theme = master.config.theme;

    elements.slide.innerHTML = master.mainHTML(
      slide,
      this.config,
      this.document
    );
    elements.modal.innerHTML = master.modalHTML();

    master.postSet(slide, this.config, this.document);
  }

  setSlide(slide) {
    if (this.oldSlide.hasOwnProperty('master')) {
      this.masters[this.oldSlide.master]
      .cleanUp(this.document, this.oldSlide, slide);
    }
    this.newSlide = slide;
    this.setMain(slide);
    this.newSlide.steps.visit();
  }

  /**
   * Show a master slide without custom data.
   *
   * The displayed master slide is not part of the acutal presentation.
   * Not every master slide can be shown with this function. It muss be
   * possible to render the master slide without custom data.
   * No number is assigned to the master slide.
   * @param {string} name Name of the master slide
   */
  setInstantSlide(masterName) {
    let rawSlide = {};
    rawSlide[masterName] = true;
    let slide = new Slide(rawSlide, this.document, this.config, this.masters);
    this.setSlide(slide);
  }

  setFirstSlide() {
    this.newSlide = this.slidesSwitcher.getByNo(1);
    this.setSlide(this.newSlide);
  }

  stepPrev() {
    this.newSlide.steps.prev();
  }

  stepNext() {
    this.newSlide.steps.next();
  }

  slidePrev() {
    this.oldSlide = this.newSlide;
    this.newSlide = this.slidesSwitcher.prev();
    this.setSlide(this.newSlide);
  }

  slideNext() {
    this.oldSlide = this.newSlide;
    this.newSlide = this.slidesSwitcher.next();
    this.setSlide(this.newSlide);
  }

}

exports.getMasters = getMasters;
exports.getSlides = getSlides;
exports.SlidesSwitcher = SlidesSwitcher;
exports.getThemes = getThemes;

exports.ShowRunner = ShowRunner;
