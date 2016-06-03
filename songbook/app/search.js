var fs = require('fs');
var pth = require('path');

var library = {};

exports.set = function(values) {
  library = values.library;

}

build = function() {
  document.getElementById('field').appendChild(makeList(songs.library));
}

makeList = function() {
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
  return select;
}

resetSelect = function() {
  var select = document.getElementById('select');
  var option = document.createElement('option');
  option.setAttribute('value', '');
  select.insertBefore(option, select.firstChild);
}

songs.setLibrary();
bindShortcuts();

$(function() {
    var selectized = $('select').selectize({
      onItemAdd: function(value, data) {
        song.setCurrent(value);
        song.setSlide();
        modal.hide();
      }
    });
    search.selectize = selectized[0].selectize;
    search.selectize.focus();
});
