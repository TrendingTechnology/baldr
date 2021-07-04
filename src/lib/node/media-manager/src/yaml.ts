import fs from 'fs'

import type { MediaResolverTypes, StringIndexedObject } from '@bldr/type-definitions'
import { readYamlFile, writeYamlFile } from '@bldr/file-reader-writer'

import { asciify, deasciify } from '@bldr/core-browser'
import { Asset } from './media-file-classes'
import { categoriesManagement } from '@bldr/media-categories'

/**
 * Load the metadata file in the YAML format of a media asset. This
 * function appends `.yml` on the file path. It is a small wrapper
 * around `readYamlFile`.
 *
 * @param filePath - The path of a media asset without the `yml`
 * extension. For example `Fuer-Elise.mp3` not `Fuer-Elise.mp3.yml`.
 *
 * @returns The parsed YAML file as an object. The string properties are
 * converted in the `camleCase` format.
 */
export function readYamlMetaData (filePath: string): StringIndexedObject {
  return readYamlFile(`${filePath}.yml`)
}

/**
 * Write the metadata YAML file for a corresponding media file specified
 * by `filePath`. The property names are converted to `snake_case`.
 *
 * @param filePath - The filePath gets asciified and a yml extension is
 *   appended.
 * @param metaData - The metadata to store in the YAML file.
 * @param force - Always create the yaml file. Overwrite the old one.
 */
export function writeYamlMetaData (filePath: string, metaData?: MediaResolverTypes.YamlFormat, force?: boolean): object | undefined {
  if (fs.lstatSync(filePath).isDirectory()) return
  const yamlFile = `${asciify(filePath)}.yml`
  if (
    (force != null && force) ||
    !fs.existsSync(yamlFile)
  ) {
    // eslint-disable-next-line
    if (metaData == null) metaData = {} as MediaResolverTypes.YamlFormat
    const asset = new Asset(filePath)
    if (metaData.ref == null) {
      metaData.ref = asset.basename
    }
    if (metaData.title == null) {
      metaData.title = deasciify(asset.basename)
    }

    metaData.filePath = filePath
    metaData = categoriesManagement.process(metaData)
    writeYamlFile(yamlFile, metaData)
    return {
      filePath,
      yamlFile,
      metaData
    }
  }
  return {
    filePath,
    msg: 'No action.'
  }
}
