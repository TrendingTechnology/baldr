const path = require('path');
const fs = require('fs');

class Plugins {

  constructor(document, presentation) {
    this.path = path.join(__dirname, '..', 'plugins');
    this.all = this.getAll();
    for (let plugin of this.all) {
      this[plugin] = require(
        path.join(this.path, plugin, 'index.js')
      )(document, this, presentation);
    }
  }

  getHooks(propertyName, type='function') {
    return this.all.filter(
      plugin => typeof this[plugin][propertyName] === type
    );
  }

  getAll() {
    return fs.readdirSync(this.path, 'utf8')
    .filter(
      dir => fs.statSync(
        path.join(this.path, dir)
      ).isDirectory()
    );
  }
}

exports.Plugins = Plugins;
