/**
 * Load the configuration file /etc/baldr.json.
 *
 * @module @bldr/config
 */

import fs from 'fs'
import path from 'path'

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

interface HttpConfiguration {
  username: string
  password: string
  domainLocal: string
  domainRemote: string
  webRoot: string
  webServerUser: string
  webServerGroup: string
}

interface AssetType {
  allowedExtensions: string[],
  targetExtension: string
  color: string
}

interface AssetTypes {
  [key: string]: AssetType
}

interface MediaServerConfiguration {
  basePath: string
  archivePaths: string[]
  sshAliasRemote: string
  editor: string
  fileManager: string
  assetTypes: AssetTypes
}

interface ApiConfiguration {
  port: number
}

interface MongoDbConfiguration {
  url: string
  dbName: string
  user: string
  password: string
}

interface DatabasesConfiguration {
  mongodb: MongoDbConfiguration
}

interface WireConfiguration {
  port: number
  localUri: string
}

interface YoutubeConfiguration {
  /**
   * The API key to access the JSON api (use by the youtube downloader)
   */
  apiKey: string
}

/**
 * The main configuration file of the Baldr project.
 */
interface Configuration {
  doc: DocConfiguration
  songbook: SongbookConfiguration
  localRepo: string
  http: HttpConfiguration
  mediaServer: MediaServerConfiguration
  api: ApiConfiguration
  databases: DatabasesConfiguration
  wire: WireConfiguration
  youtube: YoutubeConfiguration
}

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
  if (!config) throw new Error(`No configuration file found: ${configFile}`)

  return config
}

/**
 * Object to cache the configuration. To avoid reading the configuration
 * file multiple times.
 */
const config: Configuration = bootstrapConfig()
export = config
