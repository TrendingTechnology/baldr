'use strict'
/**
 * Load the configuration file /etc/baldr.json.
 *
 * @module @bldr/config
 */

const fs = require('fs')
const path = require('path')
/**
 * By default this module reads the configuration file `/etc/baldr.json` to
 * generate its configuration object.
 */
function bootstrapConfig () {
  let config
  const configFile = path.join(path.sep, 'etc', 'baldr.json')
  if (fs.existsSync(configFile)) {
    config = require(configFile)
  }
  if (config == null) { throw new Error(`No configuration file found: ${configFile}`) }
  return config
}
/**
 * Object to cache the configuration. To avoid reading the configuration
 * file multiple times.
 */
const config = bootstrapConfig()
module.exports = config
