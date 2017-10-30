'use strict';

const path = require('path');
const {MasterOfMasters} = require(path.join(__dirname, '..', '..', 'lib', 'masters'));

class Master extends MasterOfMasters {
  constructor(document, data) {
    super(document, data);
  }

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

  renderQuotationMark(begin=true) {
    let mark = '»';
    let id = 'begin';
    if (!begin) {
      mark = '«';
      id = 'end';
    }
    return `<span id="quotation-${id}" class="quotation-mark">${mark}</span>`;
  }

  render(data) {
    let attribution = renderAttribution(data.author, data.date);
    let begin = renderQuotationMark();
    let end = renderQuotationMark(false);
    return `
  <section id="baldr-master-quote">

    <p class="text">${begin} ${data.text} ${end}</p>

    ${attribution}

  </section>
  `;

  }

}

var renderAttribution = function(author='', date='') {
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

var renderQuotationMark = function(begin=true) {
  let mark = '»';
  let id = 'begin';
  if (!begin) {
    mark = '«';
    id = 'end';
  }
  return `<span id="quotation-${id}" class="quotation-mark">${mark}</span>`;
};

exports.render = function(data) {
  let attribution = renderAttribution(data.author, data.date);
  let begin = renderQuotationMark();
  let end = renderQuotationMark(false);
  return `
<section id="baldr-master-quote">

  <p class="text">${begin} ${data.text} ${end}</p>

  ${attribution}

</section>
`;

};

exports.Master = Master;
