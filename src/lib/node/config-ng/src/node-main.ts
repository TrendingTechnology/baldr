import fs from 'fs'
import path from 'path'
import { Configuration as ConfigurationType } from './types'

export type Configuration = ConfigurationType

let config: Configuration

/**
 * By default this module reads the configuration file `/etc/baldr.json` to
 * generate its configuration object.
 */
export function getConfig (): Configuration {
  if (config == null) {
    const configFile = path.join(path.sep, 'etc', 'baldr.json')
    if (fs.existsSync(configFile)) {
      config = require(configFile)
    }
    if (config == null) {
      throw new Error(`No configuration file found: ${configFile}`)
    }
    return config
  }

  return config
}
