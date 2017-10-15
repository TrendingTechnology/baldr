const yaml = require('js-yaml');
const fs = require('fs');

var loadYaml = function(yamlFile) {
  try {
    return yaml.safeLoad(fs.readFileSync(yamlFile, 'utf8'));
  } catch (e) {
    throw e;
  }
}

exports.loadYaml = loadYaml;
