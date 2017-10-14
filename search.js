/**
 * @file Build the drop down menu for selectize 
 */

const fs = require('fs');
const path = require('path');

var library = {};
var selector = {};

exports.set = function(values) {
  library = values.library;
  selector = values.selector;
};

exports.build = function() {
  var select = document.createElement('select');
  select.setAttribute('id', 'select');
  select.setAttribute('placeholder', 'Suche nach einem Lied');

  var option = document.createElement('option');
  option.setAttribute('value', '');
  select.appendChild(option);

  for (var songID in library) {
    option = document.createElement('option');
    option.setAttribute('value', songID);
    option.innerHTML = library[songID].title;
    select.appendChild(option);
  }

  document.querySelector(selector).appendChild(select);
};
