import assert from 'assert'

import { deepCopy, msleep } from '@bldr/core-browser'
import { AssetType, MediaCategory } from '@bldr/type-definitions'
import wikidata  from '@bldr/wikidata'

import { categoriesManagement } from '@bldr/media-categories'
import { readAssetYaml, writeYamlFile } from '../main'

async function queryWikidata (metaData: AssetType.FileFormat, categoryNames: MediaCategory.Names, categoryCollection: MediaCategory.Collection): Promise<AssetType.FileFormat> {
  const dataWiki = await wikidata.query(metaData.wikidata, categoryNames, categoryCollection)
  console.log(dataWiki)
  metaData = wikidata.mergeData(metaData, dataWiki, categoryCollection) as AssetType.FileFormat
  // To avoid blocking
  // url: 'https://www.wikidata.org/w/api.php?action=wbgetentities&ids=Q16276296&format=json&languages=en%7Cde&props=labels',
  // status: 429,
  // statusText: 'Scripted requests from your IP have been blocked, please
  // contact noc@wikimedia.org, and see also https://meta.wikimedia.org/wiki/User-Agent_policy',
  msleep(3000)
  return metaData
}

interface NormalizeMediaAssetOption {
  wikidata: boolean
}

/**
 * @param filePath - The media asset file path.
 */
export async function normalizeMediaAsset (filePath: string, options?: NormalizeMediaAssetOption) {
  try {
    const yamlFile = `${filePath}.yml`
    let metaData = readAssetYaml(filePath) as AssetType.FileFormat
    if (!metaData) {
      return
    }
    metaData.filePath = filePath
    const origData = <AssetType.FileFormat> deepCopy(metaData)

    // Always: general
    const categoryNames = categoriesManagement.detectCategoryByPath(filePath)
    if (categoryNames) {
      const categories = metaData.categories != null ? metaData.categories : ''
      metaData.categories = categoriesManagement.mergeNames(categories, categoryNames)
    }
    if (options && options.wikidata) {
      if (metaData.wikidata && metaData.categories) {
        metaData = await queryWikidata(metaData, metaData.categories, categoriesManagement.categories)
      }
    }
    metaData = categoriesManagement.process(metaData)

    try {
      delete origData.filePath
      assert.deepStrictEqual(origData, metaData)
    } catch (error) {
      writeYamlFile(yamlFile, metaData)
    }
  } catch (error) {
    console.log(filePath)
    console.log(error)
    process.exit()
  }
}
