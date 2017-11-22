/**
 * @file Load the slides object form the YAML file format and process it.
 * @module lib/presentation
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const {SlidesNormalize} = require('../lib/slides-normalize.js');
const {Quickies} = require('../lib/quickies.js');
const {Media} = require('baldr-media');

/**
 *
 */

class Presentation {

  /**
   * @param {string} baldrFile The path of the *.baldr presentation file
   * structured in the YAML format.
   * @param {object} document The HTML DOM Document Object.
   */
  constructor(baldrFile, document) {

    /**
     * he path of the *.baldr presentation file
     * structured in the YAML format.
     * @type {string}
     */
    this.baldrFile = baldrFile;

    /**
     * Raw object representation of the main *.baldr presentation file
     * structured in YAML
     * @type {object}
     */
    this.raw = this.parseYamlFile(this.baldrFile);

    /**
     * The presentation files’ parent working directory. Assuming you are
     * loading a file with the path “/home/jf/example.baldr”, your parent
     * working directory (pwd) is than “/home/jf”
     * @type {string}
     */
    this.pwd = path.resolve(path.dirname(this.baldrFile));

    /**
     * All slides index by the slide number.
     * <pre><code>
     * {
     *   "1": {
     *     "no": 1,
     *     "master": "quote",
     *     "data": {
     *       "text": "Der Tag der Gunst ist wie der Tag der Ernte,\nman muss geschäftig sein sobald sie reift.\n",
     *       "author": "Johann Wolfgang von Goethe",
     *       "date": 1801
     *     }
     *   },
     *   "2": {
     *     "no": 2,
     *     "master": "question",
     *     "data": [
     *       {
     *         "question": "Wann starb Ludwig van Beethoven?",
     *         "answer": 1827
     *       }
     *     ]
     *   },
     *   "3": {
     *     "no": 3,
     *     "master": "person",
     *     "data": {
     *       "name": "Ludwig van Beethoven",
     *       "image": "beethoven.jpg"
     *     }
     *   }
     * }
     * </code><pre>
     * @type {object}
     */
    this.slides = new SlidesNormalize(this.raw.slides).normalized;

    /**
     * The count of all slides.
     * @type {int}
     */
    this.count = Object.keys(this.slides).length;

    /**
     * The current slide number.
     * @type {int}
     */
    this.no = 1;

    /**
     * The current slide object.
     * @type {object}
     */
    this.currentSlide = this.slides[this.no];

    /**
     * @type {object}
     */
    this.document = document;

    /**
     * @type {object}
     */
    this.elemNavigationButtons = {
      prev: this.document.getElementById('nav-slide-prev'),
      next: this.document.getElementById('nav-slide-next')
    };

    /**
     * A HTML div element, which covers the complete slide area to
     * a void flickering, when new CSS styles are loaded.
     *
     * @type {object}
     */
    this.cover = this.document.getElementById('cover');

    /**
     * All media files located in the same parent folder as the
     * main *.baldr presentation file.
     *
     * @type {object}
     */
    let media = new Media(this.pwd);
    this.media = media.getMedia();

    /**
     * All media files located in the same parent folder as the
     * main *.baldr presentation file.
     *
     * @type {object}
     */
    this.quickies = new Quickies(this.document);
    this.quickies.set();
  }

  /**
   * Load the contents of a *.baldr YAML file and convert its content
   * into a object.
   *
   * @param {string} baldrFile The path of the *.baldr presentation file
   * structured in the YAML format.
   * @return {object} Raw object representation of the presentation
   * session.
   */
  parseYamlFile(baldrFile) {
    return yaml.safeLoad(fs.readFileSync(baldrFile, 'utf8'));
  }

  /**
   * @private
   */
  setNavigationButtonsVisibility_(state) {
    for (let prop in this.elemNavigationButtons) {
      this.elemNavigationButtons[prop].style.visibility = state;
    }
  }

  /**
   * @private
   */
  displayNavigationButtons_() {
    if (this.count > 1) {
      this.setNavigationButtonsVisibility_('visible');
    }
    else {
      this.setNavigationButtonsVisibility_('hidden');
    }
  }

  /**
   * Set the current slide to the previous slide.
   */
  prev() {
    if (this.no === 1) {
      this.no = this.count;
    }
    else {
      this.no = this.no - 1;
    }
    this.currentSlide = this.slides[this.no];
    return this;
  }

  /**
   * Set the current slide to the next slide.
   */
  next() {
    if (this.no === this.count) {
      this.no = 1;
    }
    else {
      this.no = this.no + 1;
    }
    this.currentSlide = this.slides[this.no];
    return this;
  }

  /**
   *
   */
  prevStep() {
    this.currentSlide.prevStep();
    return this;
  }

  /**
   *
   */
  nextStep() {
    this.currentSlide.nextStep();
    return this;
  }

  /**
   * Set the background color of the “cover” DIV element.
   *
   * @param {string} color A CSS color information.
   * @param {number} zIndex A CSS color information.
   */
  setCover(color, zIndex) {
    this.cover.style.backgroundColor = color;
    this.cover.style.zIndex = zIndex;
  }

  /**
   * Set the current slide
   */
  set() {
    this.setCover('black', 1);
    setTimeout(() => {
      this.setCover('transparent', -1);
    }, 50);

    this.currentSlide.set();
    this.displayNavigationButtons_();
    return this;
  }

}

exports.Presentation = Presentation;
