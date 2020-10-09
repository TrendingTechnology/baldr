/**
 * Load the configuration file /etc/baldr.json.
 *
 * @module @bldr/config
 */

import fs from 'fs'
import path from 'path'

/**
 * Some configuration options to generate documentation using JsDoc.
 */
interface DocConfiguration {
  src: string
  dest: string
  configFile: string
}

interface SongbookConfiguration {
  path: string
  projectorPath: string
  pianoPath: string
  vueAppPath: string
}

/**
 * The main configuration file of the Baldr project.
 */
interface Configuration {
  doc: DocConfiguration
  songbook: SongbookConfiguration
  localRepo: string
}

/**
 * By default this module reads the configuration file `/etc/baldr.json` to
 * generate its configuration object.
 *
 * @param {object} configDefault - Default options which gets merged.
 *
 * @return {object}
 */
function bootstrapConfig (): Configuration {
  let config
  const configFile = path.join(path.sep, 'etc', 'baldr.json')

  if (fs.existsSync(configFile)) {
    config = require(configFile)
  }
  if (!config) throw new Error(`No configuration file found: ${configFile}`)

  return config
}

/**
 * Object to cache the configuration. To avoid reading the configuration
 * file multiple times.
 */
export const config: Configuration = bootstrapConfig()
