/**
 * @file Load the slides object form the YAML file format and process it.
 * @module lib/slide-switcher
 */

/**
 *
 */

class SlideSwitcher {

  /**
   * @param {string} baldrFile The path of the *.baldr presentation file
   * structured in the YAML format.
   * @param {object} document The HTML DOM Document Object.
   */
  constructor(document, slides) {

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
    this.slides = slides;

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
   * Set the current slide to the previous slide.
   */
  prev() {
    if (this.no === 1) {
      this.no = this.count;
    }
    else {
      this.no = this.no - 1;
    }
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

exports.SlideSwitcher = SlideSwitcher;
