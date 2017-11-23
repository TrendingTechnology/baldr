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
}

/**
 *
 */
exports.normalizeData = function(data) {
  if (typeof data === 'object' && Array.isArray(data)) {
    let out = [];
    for (let pair of data) {
      out.push(normalizeDataQAPair(pair));
    }
    return out;
  } else {
    return [normalizeDataQAPair(data)];
  }
}

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
}

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
}

exports.config = {
  centerVertically: true,
  stepSupport: true
};

/**
 *
 */
exports.setStepByNo = function(no, count, data) {
  for (let i = 1; i <= count; i++) {
    if (!data[i].style.visibility) {
      data[i].style.visibility = 'visible';
    }

    let visibility = data[i].style.visibility;
    if (visibility === 'visible' && no < i) {
      data[i].style.visibility = 'hidden';
    }
    else if (visibility === 'hidden' && no >= i) {
      data[i].style.visibility = 'visible';
    }
  }
}

/**
 *
 */
exports.mainHTML = function(data) {
  return '<div id="question-content">' +
    template(data) +
    '</div>';
}

/**
 * The stepData object has to be filled very time a slide is set.
 * Every time a slide is set, new HTML elements are generated.
 */
exports.initSteps = function(document) {
  let data = {};
  let elements = document.querySelectorAll('p');
  elements.forEach((element, index) => {
    data[index + 1] = element;
  });
  return data;
}
