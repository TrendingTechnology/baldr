import fs from 'fs'

import yaml from 'js-yaml'

import {
  convertPropertiesCamelToSnake,
  convertPropertiesSnakeToCamel,
  jsYamlConfig
} from '@bldr/core-browser'
import { AssetType } from '@bldr/type-definitions'

import { readFile, writeFile } from './file'
import { asciify, deasciify } from './helper'
import { Asset } from './media-file-classes'
import metaTypes from './meta-types'

/**
 * Convert a Javascript object into a text string, ready to be written
 * into a text file. The property names are converted to `snake_case`.
 *
 * @param data - Some data to convert to YAML.
 *
 * @returns A string in the YAML format ready to be written into a text
 *   file. The result string begins with `---`.
 */
export function yamlToTxt (data: any): string {
  data = convertPropertiesCamelToSnake(data)
  const yamlMarkup = [
    '---',
    yaml.safeDump(data, jsYamlConfig)
  ]
  return yamlMarkup.join('\n')
}

/**
 * Load a YAML file. Return only objects to save vscode type checks.
 *
 * @param filePath - The path of a YAML file.
 *
 * @returns The parsed YAML file as a object. The string properties are
 * in the camleCase format.
 */
export function loadYaml (filePath: string): object {
  const result = yaml.safeLoad(readFile(filePath))
  if (typeof result !== 'object') {
    return { result }
  }
  return convertPropertiesSnakeToCamel(result)
}

/**
 * Convert some data (usually Javascript objets) into the YAML format
 * and write the string into a text file.
 *
 * @param filePath - The file path of the destination yaml file. The yml
 *   extension has to be included.
 * @param data - Some data to convert into yaml and write into a text
 *   file.
 *
 * @returns The data converted to YAML as a string.
 */
export function writeYamlFile (filePath: string, data: object): string {
  const yaml = yamlToTxt(data)
  writeFile(filePath, yaml)
  return yaml
}

/**
 * Write the metadata YAML file for a corresponding media file specified by
 * `filePath`.
 *
 * @param filePath - The filePath gets asciified and a yml extension
 *   is appended.
 * @param metaData
 * @param force - Always create the yaml file. Overwrite the old one.
 */
export function writeMetaDataYaml (filePath: string, metaData?: AssetType.Generic, force?: boolean): object | undefined {
  if (fs.lstatSync(filePath).isDirectory()) return
  const yamlFile = `${asciify(filePath)}.yml`
  if (
    force ||
    !fs.existsSync(yamlFile)
  ) {
    if (!metaData) metaData = {}
    const asset = new Asset(filePath)
    if (!metaData.id) {
      metaData.id = asset.basename
    }
    if (!metaData.title) {
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
