/**
 * @file Load the slides object form the YAML file format and process it.
 * @module lib/presentation
 */

const fs = require('fs');
const path = require('path');
const misc = require('../lib/misc.js');
const {Slides} = require('../lib/slides.js');
const {Masters} = require('baldr-masters');

/**
 *
 */
class Presentation {

  /**
   * @param {string} yamlFile Path of the yaml file.
   * @param {object} document The HTML DOM Document Object.
   */
  constructor(yamlFile, document) {

    /**
     * The presentation files’ parent working directory. Assuming you are
     * loading a file with the path “/home/jf/example.baldr”, your parent
     * working directory (pwd) is than “/home/jf”
     * @type {string}
     */
    this.pwd = path.resolve(path.dirname(yamlFile));

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
    this.slides = new Slides(yamlFile, document, this).parse();

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
     * Object of all master slides
     * @type {object}
     */
    this.masters = new Masters(document);

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
   * Get the absolute path of a file used in the presentation.
   *
   * @return {string} Absolute path
   */
  absolutePath(filePath) {
    if (path.isAbsolute(filePath)) {
      return filePath;
    }
    else {
      return path.resolve(this.pwd, filePath);
    }
  }

  /**
   * @param {string} inputPath The path of a file
   * @param {misc} extensions An array of extensions without “.”
   *   (e. g.: ['jpg', 'gif']), a single extension as string or empty
   *   to bypass the filter mechanism and return always true.
   * @return {boolean} True if the input file has the given extension
   */
  filterFileByExtension(inputPath, extensions) {
    if (!extensions) {
      return true;
    }
    if (typeof extensions === 'string') extensions = [extensions];
    let filterExtensions = extensions.map((value) => {
      return '.' + value.toLowerCase();
    });
    let inputExtension = path.extname(inputPath).toLowerCase();
    for (let filterExtension of filterExtensions) {
      if (inputExtension === filterExtension) return true;
    }
    return false;
  }

  /**
   * @param {string} inputPath Relative or absolute path of a folder or a file.
   * @param {misc} extensions An array of extensions without “.”
   *   (e. g.: ['jpg', 'gif']), a single extension as string or empty
   *   to bypass the filter mechanism and return always true.
   * @return {array} A array of absolute file paths or an empty array.
   */
  filterFiles(inputPath, extensions) {
    let absPath = this.absolutePath(inputPath);

    if (!fs.existsSync(absPath)) {
      return [];
    }
    let stat = fs.statSync(absPath);
    if (!stat.isDirectory() && this.filterFileByExtension(absPath, extensions)) {
      return [absPath];
    }
    else if (stat.isDirectory()) {
      return fs.readdirSync(absPath)
        .filter((filename) => {
          return this.filterFileByExtension(filename, extensions);
        })
        .map((filename) => {
          return path.join(absPath, filename);
        })
        .sort();
    }
    else {
      return [];
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
   */
  setCoverBackground(color) {
    this.cover.style.backgroundColor = color;
  }

  /**
   * Set the current slide
   */
  set() {
    this.setCoverBackground('black');
    setTimeout(() => {
      this.setCoverBackground('transparent');
    }, 50);

    this.currentSlide.set();
    this.displayNavigationButtons_();
    return this;
  }

}

exports.Presentation = Presentation;
