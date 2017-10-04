'use strict';

const colors = require('colors');

const warning = 'Warning! '.yellow;
const error = 'Error! '.red;

const arrow = '✓'.green; 

/**
 * Print out or return text.
 * @param {string} text - Text to display.
 */
var info = function(text) {
  console.log(text);
};

exports.info = info;
