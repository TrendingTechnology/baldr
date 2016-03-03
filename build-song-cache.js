var fs = require('fs');

var songs = {};

fs.readdir('./songs', function(err, folders) {
  folders.forEach(function (folder) {
    var path = './songs/' + folder + '/'
    var json = fs.readFileSync(path + 'info.json', 'utf8');
    var info = JSON.parse(json);
    var files = fs.readdirSync(path)
    info.folder = folder;
    info.files = files;
    songs[folder] = info;
  });

  fs.writeFile('songs.json', JSON.stringify(songs, null, 4), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log(songs);
    }
  });
});


