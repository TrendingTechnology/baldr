import assert from 'assert'

import { deepCopy, msleep } from '@bldr/core-browser'
import {
  MediaResolverTypes,
  MediaCategoriesTypes,
  StringIndexedObject
} from '@bldr/type-definitions'
import wikidata from '@bldr/wikidata'
import { categoriesManagement, categories } from '@bldr/media-categories'
import { writeYamlFile } from '@bldr/file-reader-writer'
import * as log from '@bldr/log'
import { convertToYaml } from '@bldr/yaml'

import { readAssetYaml } from '../main'

async function queryWikidata (
  metaData: MediaResolverTypes.YamlFormat,
  categoryNames: MediaCategoriesTypes.Names,
  categoryCollection: MediaCategoriesTypes.Collection
): Promise<MediaResolverTypes.YamlFormat> {
  const dataWiki = await wikidata.query(
    metaData.wikidata,
    categoryNames,
    categoryCollection
  )
  console.log(dataWiki)
  metaData = wikidata.mergeData(
    metaData,
    dataWiki,
    categoryCollection
  ) as MediaResolverTypes.YamlFormat
  // To avoid blocking
  // url: 'https://www.wikidata.org/w/api.php?action=wbgetentities&ids=Q16276296&format=json&languages=en%7Cde&props=labels',
  // status: 429,
  // statusText: 'Scripted requests from your IP have been blocked, please
  // contact noc@wikimedia.org, and see also https://meta.wikimedia.org/wiki/User-Agent_policy',
  msleep(3000)
  return metaData
}

interface NormalizeMediaAssetOption {
  wikidata?: boolean
}

function logDiff (oldMetaData: object, newMetaData: object) {
  log.verbose(
    log.colorizeDiff(convertToYaml(oldMetaData), convertToYaml(newMetaData))
  )
}

/**
 * @param filePath - The media asset file path.
 */
export async function normalizeMediaAsset (
  filePath: string,
  options?: NormalizeMediaAssetOption
): Promise<void> {
  try {
    const yamlFile = `${filePath}.yml`
    const raw = readAssetYaml(filePath)
    if (raw != null) {
      raw.filePath = filePath
    }
    let metaData = raw as MediaResolverTypes.YamlFormat
    if (metaData == null) {
      return
    }
    const origData = deepCopy(metaData) as MediaResolverTypes.YamlFormat

    // Always: general
    const categoryNames = categoriesManagement.detectCategoryByPath(filePath)
    if (categoryNames != null) {
      const categories = metaData.categories != null ? metaData.categories : ''
      metaData.categories = categoriesManagement.mergeNames(
        categories,
        categoryNames
      )
    }
    if (options?.wikidata != null) {
      if (metaData.wikidata != null && metaData.categories != null) {
        metaData = await queryWikidata(
          metaData,
          metaData.categories,
          categories
        )
      }
    }
    const newMetaData = categoriesManagement.process(metaData, filePath)
    const oldMetaData = origData as StringIndexedObject
    delete oldMetaData.filePath
    try {
      assert.deepStrictEqual(oldMetaData, newMetaData)
    } catch (error) {
      logDiff(oldMetaData, newMetaData)
      writeYamlFile(yamlFile, newMetaData)
    }
  } catch (error) {
    log.error(filePath)
    log.error(error)
    process.exit()
  }
}
