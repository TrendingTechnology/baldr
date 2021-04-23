/**
 * Load the configuration file /etc/baldr.json.
 *
 * @module @bldr/config
 */

import fs from 'fs'
import path from 'path'

import { Configuration } from '@bldr/type-definitions'

/**
 * By default this module reads the configuration file `/etc/baldr.json` to
 * generate its configuration object.
 */
function bootstrapConfig (): Configuration {
  let config
  const configFile = path.join(path.sep, 'etc', 'baldr.json')

  if (fs.existsSync(configFile)) {
    config = require(configFile)
  }
  if (config == null) throw new Error(`No configuration file found: ${configFile}`)

  return config
}

/**
 * Object to cache the configuration. To avoid reading the configuration
 * file multiple times.
 */
const config: Configuration = bootstrapConfig()
export = config
