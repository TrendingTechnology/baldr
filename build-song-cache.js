var fs = require('fs');

fs.readdir('songs', function(err, files) {
  files.forEach(function (file) {
    console.log(file);
  });
});
