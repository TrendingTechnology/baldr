/**
 * @module baldr-library/helper
 */
'use strict';

const fs = require('fs');
const path = require('path');

exports.reIndex = function(array) {
  let out = {};
  for (let index in array) {
    out[Number.parseInt(index) + 1] = array[index];
  }
  return out;
};

/**
 * Generate a link element and append this element to the head section
 * of the document object
 *
 * @param {object} document The HTML DOM Document Object.
 * @param {string} cssFile Path of the CSS file to include
 * @param {string} className A CSS class name to add to the link element.
 */
exports.addCSSFile = function(document, cssFile, className=false) {
  let link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  if (className) {
    link.classList.add(className);
  }
  link.href = cssFile;
  document.head.appendChild(link);
};

/**
 * @property {object} checkProperty
 * @property {function} checkProperty.isString
 * @property {function} checkProperty.empty
 */
exports.checkProperty = {

  /**
   * @name isString
   * @function
   * @property {object} object
   * @property {string} property
   */
  isString: function(object, property) {
    if (
      typeof object === 'object' &&
      object.hasOwnProperty(property) &&
      typeof object[property] === 'string'
    ) {
      return true;
    }
    else {
      return false;
    }
  },

  /**
   * @name empty
   * @function
   * @property {object} object
   * @property {string} property
   */
  empty: function(object, property) {
    if (
      typeof object === 'object' &&
      object.hasOwnProperty(property) &&
      object[property]
    ) {
      return false;
    }
    else {
      return true;
    }
  }
};
