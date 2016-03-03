var fs = require('fs');

var content = fs.readFileSync(__dirname + '/hello-world.js', 'utf8')

console.log(content)
