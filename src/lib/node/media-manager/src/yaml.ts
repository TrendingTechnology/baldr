import fs from 'fs'

import { AssetType } from '@bldr/type-definitions'
import { readFile, writeFile } from '@bldr/core-node'
import { convertToYaml, convertFromYaml } from '@bldr/yaml'

import { asciify, deasciify } from './helper'
import { Asset } from './media-file-classes'
import metaTypes from './meta-types'

/**
 * Load a YAML file and convert into a Javascript object. The string
 * properties are converted in the `camleCase` format. The function
 * returns a object with string properties to save Visual Studio Code
 * type checks (Not AssetType, PresentationTypes etc).
 *
 * @param filePath - The path of a YAML file.
 *
 * @returns The parsed YAML file as an object. The string properties are
 * converted in the `camleCase` format.
 */
export function loadYaml (filePath: string): { [key: string]: any } {
  return convertFromYaml(readFile(filePath))
}

/**
 * Load the metadata file in the YAML format of a media asset. This
 * function appends `.yml` on the file path. It is a small wrapper
 * around `loadYaml`.
 *
 * @param filePath - The path of a media asset without the `yml`
 * extension. For example `Fuer-Elise.mp3` not `Fuer-Elise.mp3.yml`.
 *
 * @returns The parsed YAML file as an object. The string properties are
 * converted in the `camleCase` format.
 */
export function loadMetaDataYaml (filePath: string): { [key: string]: any } {
  return loadYaml(`${filePath}.yml`)
}

/**
 * Convert some data (usually Javascript objets) into the YAML format
 * and write the string into a text file. The property names are
 * converted to `snake_case`.
 *
 * @param filePath - The file path of the destination yaml file. The yml
 *   extension has to be included.
 * @param data - Some data to convert into yaml and write into a text
 *   file.
 *
 * @returns The data converted to YAML as a string.
 */
export function writeYamlFile (filePath: string, data: object): string {
  const yaml = convertToYaml(data)
  writeFile(filePath, yaml)
  return yaml
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
export function writeMetaDataYaml (filePath: string, metaData?: AssetType.Generic, force?: boolean): object | undefined {
  if (fs.lstatSync(filePath).isDirectory()) return
  const yamlFile = `${asciify(filePath)}.yml`
  if (
    (force != null && force) ??
    !fs.existsSync(yamlFile)
  ) {
    if (metaData == null) metaData = {}
    const asset = new Asset(filePath)
    if (metaData.id == null) {
      metaData.id = asset.basename
    }
    if (metaData.title == null) {
      metaData.title = deasciify(asset.basename)
    }

    metaData = metaTypes.process(metaData)
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
