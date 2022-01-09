import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'

import { Configuration as ConfigurationType } from './types/main'

const require = createRequire(import.meta.url)

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

export const joinPath = path.join

export function getMediaPath (...relPath: string[]): string {
  if (config == null) {
    getConfig()
  }
  return path.join(config.mediaServer.basePath, ...relPath)
}
