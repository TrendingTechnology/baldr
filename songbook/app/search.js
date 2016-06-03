var fs = require('fs');
var pth = require('path');

var library = {};
var selector = {};

exports.set = function(values) {
  library = values.library;
  selector = values.selector;
}

exports.build = function() {
  var select = document.createElement('select');
  select.setAttribute('id', 'select');
  select.setAttribute('placeholder', 'Suche nach einem Lied');

  var option = document.createElement('option');
  option.setAttribute('value', '');
  select.appendChild(option);

  for (songID in library) {
    var option = document.createElement('option');
    option.setAttribute('value', songID);
    option.innerHTML = library[songID].title;
    select.appendChild(option);
  }

  document.querySelector(selector).appendChild(select);
}
