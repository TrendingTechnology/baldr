/**
 * @file Master slide “quote”
 * @module baldr-master-quote
 */

'use strict';

exports.config = {
  centerVertically: true
};

/**
 *
 */
let renderAttribution = function(author='', date='') {
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
};

/**
 *
 */
let renderQuotationMark = function(begin=true) {
  let mark = '»';
  let id = 'begin';
  if (!begin) {
    mark = '«';
    id = 'end';
  }
  return `<span id="quotation-${id}" class="quotation-mark">${mark}</span>`;
};

/**
 *
 */
exports.mainHTML = function() {
  let attribution = this.renderAttribution(this.data.author, this.data.date);
  let begin = this.renderQuotationMark();
  let end = this.renderQuotationMark(false);
  return `
<section id="baldr-master-quote">

  <p class="text">${begin} ${this.data.text} ${end}</p>

  ${attribution}

</section>
`;
};
