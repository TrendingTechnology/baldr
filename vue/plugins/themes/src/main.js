/**
 * Some SCSS/CSS themes for the baldr project.
 *
 * @module @bldr/themes
 */

const path = require('path')

const sassExport = require('sass-export')

function exportSassAsJson () {
  const struct = sassExport.exporter({
    inputFiles: [path.join(path.resolve(new URL('.', import.meta.url).pathname), 'default-vars.scss')]
  }).getStructured()

  const vars = {}
  for (const v of struct.variables) {
    if (v.name !== '$colors') {
      vars[v.name] = v.compiledValue
    }
  }
  return vars
}

module.exports = {
  exportSassAsJson
}
