import path from 'path'

import { getConfig } from '@bldr/config'
import { readYamlFile } from '@bldr/file-reader-writer'

const config = getConfig()

export interface MediaData {
  path: string
  [property: string]: any
}

/**
 * Base class to be extended.
 */
export abstract class Builder {
  /**
   * Absolute path of the media file, not the metadata file.
   */
  protected absPath: string

  constructor (filePath: string) {
    this.absPath = path.resolve(filePath)
  }

  protected get relPath (): string {
    return this.absPath
      .replace(config.mediaServer.basePath, '')
      .replace(/^\//, '')
  }

  public importYamlFile (filePath: string, target: any): Builder {
    const data = readYamlFile(filePath)
    for (const property in data) {
      target[property] = data[property]
    }
    return this
  }
}
