var fs = require('fs');

fs.readdir(__dirname, function(err, files) {
  files.forEach(function (file) {
    console.log(file);
  });
});
