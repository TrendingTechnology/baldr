const path = require('path');
const fs = require('fs');

class Plugins {

  constructor(document) {

    this.path = path.join(__dirname, '..', 'plugins');
    this.all = this.getPlugins();
    for (let plugin of this.all) {
      this[plugin] = require(path.join(this.path, plugin, 'index.js'))(document, this);
    }
  }

  getPlugins() {
    return fs.readdirSync(this.path, 'utf8')
    .filter(
      dir => fs.statSync(
        path.join(this.path, dir)
      ).isDirectory()
    );
  }
}

exports.Plugins = Plugins;
