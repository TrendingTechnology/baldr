/**
 * Generate a json file containing all songs image files and all song
 * meta data json files.
 *
 * Execute this script with this command:
 * node build-song-change.js
 */

var fs = require('fs');
var path = require('path');

var songs = {};

function filterSlides(file) {
  if (path.extname(file) == ".svg") {
  	return true;
  }
}

folders = fs.readdirSync('./songs');

folders.forEach(function (folder) {
  var path = './songs/' + folder + '/'
  var json = fs.readFileSync(path + 'info.json', 'utf8');
  var info = JSON.parse(json);
  info.files = fs.readdirSync(path).filter(filterSlides);
  songs[folder] = info;
});

var json = JSON.stringify(songs, null, 4)

fs.writeFileSync('songs.json', json);

console.log(json);
