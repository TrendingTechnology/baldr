/**
 * @file Master slide “quote”
 * @module baldr-master-quote
 */

'use strict';

const {MasterOfMasters} = require('baldr-masters');

/**
 * Master class for the master slide “quote”
 *
 * @implements {MasterOfMasters}
 */
class MasterQuote extends MasterOfMasters {

  constructor(propObj) {
    super(propObj);
    this.centerVertically = true;
  }

  /**
   *
   */
  renderAttribution(author='', date='') {
    let comma = '';

    if (author) {
      author = `<span class="author">${author}</span>`;
    }

    if (date) {
      date = `<span class="date">${date}</span>`;
    }

    if (author && date) {
      comma = ', ';
    }
    let attribution = author + comma + date;

    if (attribution) {
      return `<p class="attribution">${attribution}</p>`;
    }
    else {
      return '';
    }
  }

  /**
   *
   */
  renderQuotationMark(begin=true) {
    let mark = '»';
    let id = 'begin';
    if (!begin) {
      mark = '«';
      id = 'end';
    }
    return `<span id="quotation-${id}" class="quotation-mark">${mark}</span>`;
  }

  /**
   *
   */
  hookSetHTMLSlide() {
    let attribution = this.renderAttribution(this.data.author, this.data.date);
    let begin = this.renderQuotationMark();
    let end = this.renderQuotationMark(false);
    return `
  <section id="baldr-master-quote">

    <p class="text">${begin} ${this.data.text} ${end}</p>

    ${attribution}

  </section>
  `;

  }

}

/**
 * Export the implemented hooks of this master.
 *
 * @param {object} document The HTML Document Object (DOM) of the
 *   current render process.
 * @param {object} masters All required and loaded masters. Using
 *   `masters.masterName` you have access to all exported methods of
 *   a specific master.
 * @param {object} presentation Object representing the current
 *   presentation session.
 *
 * @return {object} A object, each property represents a hook.
 */
module.exports = function(document, masters, presentation) {
  let _export = {};
  _export.Master = MasterQuote;
  return _export;
};
