var fs = require('fs');

var songs = {};

folders = fs.readdirSync('./songs');

folders.forEach(function (folder) {
  var path = './songs/' + folder + '/'
  var json = fs.readFileSync(path + 'info.json', 'utf8');
  var info = JSON.parse(json);
  var files = fs.readdirSync(path)
  info.folder = folder;
  info.files = files;
  songs[folder] = info;
});

var json = JSON.stringify(songs, null, 4)

fs.writeFileSync('songs.json', json);

console.log(json);


