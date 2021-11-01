import { stripCategories, twoLetterAbbreviations } from '@bldr/media-categories'
import { readJsonFile, writeJsonFile } from '@bldr/file-reader-writer'
import * as log from '@bldr/log'
import config from '@bldr/config'

function action (): void {
  stripCategories()
  const configJson = readJsonFile(config.configurationFileLocations[1])
  configJson.mediaCategories = stripCategories()
  configJson.twoLetterAbbreviations = twoLetterAbbreviations

  for (const filePath of config.configurationFileLocations) {
    log.info('Patch configuration file %s\n', [filePath])
    log.info(writeJsonFile(filePath, configJson))
  }
}

module.exports = action
