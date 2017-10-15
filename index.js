const yaml = require('js-yaml');
const fs = require('fs');

try {
  var doc = yaml.safeLoad(fs.readFileSync('lesson.yml', 'utf8'));
  console.log(doc);
} catch (e) {
  console.log(e);
}
