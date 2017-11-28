/**
 * @file Master slide “question”
 *
 * Types:
 *  - single
 *    - without answer
 *    - with answer
 *  - multiple
 *    - without answer
 *    - with answer
 *
 * @module baldr-master-question
 */

'use strict';

/**
 *
 */
let normalizeDataQAPair = function(pair) {
  if (typeof pair === 'string') {
    return {question: pair, answer: false};
  }
  else if (typeof pair === 'object') {
    if (typeof pair.question === 'string' && !pair.answer) {
      return {question: pair.question, answer: false};
    }
    else if (typeof pair.question === 'string' && typeof pair.answer === 'string') {
      return {question: pair.question, answer: pair.answer};
    }
    else {
      throw new Error('Master slide “question”: Invalid data input');
    }
  }
  else {
    throw new Error('Master slide “question”: Invalid data input');
  }
};

/**
 *
 */
let templatQAPair = function(question, answer) {
  let out = '';
  if (question) {
    out += `<p class="question">${question}</p>`;
  }
  if (answer) {
    out += `<p class="answer">${answer}</p>`;
  }
  return out;
};

/**
 *
 */
let template = function(data) {
  if (data.length > 1) {
    let li = '';
    for (let pair of data) {
      li +=
        '<li>' +
        templatQAPair(pair.question, pair.answer) +
        '</li>';
    }
    return `<ol>${li}</ol>`;
  }
  else {
    return templatQAPair(data[0].question, data[0].answer);
  }
};

/***********************************************************************
 * Hooks
 **********************************************************************/

/**
 * @see {@link module:baldr-master_INTERFACE.normalizeData}
 */
exports.normalizeData = function(rawSlideData, config) {
  if (typeof rawSlideData === 'object' && Array.isArray(rawSlideData)) {
    let out = [];
    for (let pair of rawSlideData) {
      out.push(normalizeDataQAPair(pair));
    }
    return out;
  } else {
    return [normalizeDataQAPair(rawSlideData)];
  }
};

/**
 * @see {@link module:baldr-master_INTERFACE.config}
 */
exports.config = {
  centerVertically: true,
  stepSupport: true
};

/**
 * @see {@link module:baldr-master_INTERFACE.setStepByNo}
 */
exports.setStepByNo = function(no, count, stepData, document) {
  for (let i = 1; i <= count; i++) {
    if (!stepData[i].style.visibility) {
      stepData[i].style.visibility = 'visible';
    }

    let visibility = stepData[i].style.visibility;
    if (visibility === 'visible' && no < i) {
      stepData[i].style.visibility = 'hidden';
    }
    else if (visibility === 'hidden' && no >= i) {
      stepData[i].style.visibility = 'visible';
    }
  }
};

/**
 * @see {@link module:baldr-master_INTERFACE.mainHTML}
 */
exports.mainHTML = function(slide, config, document) {
  return '<div id="question-content">' +
    template(slide.normalizedData) +
    '</div>';
};

/**
 * The stepData object has to be filled very time a slide is set.
 * Every time a slide is set, new HTML elements are generated.
 *
 * @see {@link module:baldr-master_INTERFACE.initStepsEveryVisit}
 */
exports.initStepsEveryVisit = function(document, slide, config) {
  let data = {};
  let elements = document.querySelectorAll('p');
  elements.forEach((element, index) => {
    data[index + 1] = element;
  });
  return data;
};
