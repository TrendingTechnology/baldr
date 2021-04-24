import assert from 'assert'

import { deepCopy, msleep } from '@bldr/core-browser'
import { AssetType, MediaCategory, StringIndexedObject } from '@bldr/type-definitions'
import wikidata from '@bldr/wikidata'

import { categoriesManagement } from '@bldr/media-categories'
import { readAssetYaml, writeYamlFile } from '../main'

async function queryWikidata (metaData: AssetType.Intermediate, categoryNames: MediaCategory.Names, categoryCollection: MediaCategory.Collection): Promise<AssetType.Intermediate> {
  const dataWiki = await wikidata.query(metaData.wikidata, categoryNames, categoryCollection)
  console.log(dataWiki)
  metaData = wikidata.mergeData(metaData, dataWiki, categoryCollection) as AssetType.Intermediate
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

/**
 * @param filePath - The media asset file path.
 */
export async function normalizeMediaAsset (filePath: string, options?: NormalizeMediaAssetOption): Promise<void> {
  try {
    const yamlFile = `${filePath}.yml`
    const raw = readAssetYaml(filePath)
    if (raw != null) { raw.filePath = filePath }
    let metaData = raw as AssetType.Intermediate
    if (metaData == null) {
      return
    }
    const origData = deepCopy(metaData) as AssetType.Intermediate

    // Always: general
    const categoryNames = categoriesManagement.detectCategoryByPath(filePath)
    if (categoryNames != null) {
      const categories = metaData.categories != null ? metaData.categories : ''
      metaData.categories = categoriesManagement.mergeNames(categories, categoryNames)
    }
    if (options?.wikidata != null) {
      if (metaData.wikidata != null && metaData.categories != null) {
        metaData = await queryWikidata(metaData, metaData.categories, categoriesManagement.categories)
      }
    }
    const result = categoriesManagement.process(metaData)

    try {
      const comparable = origData as StringIndexedObject
      delete comparable.filePath
      assert.deepStrictEqual(comparable, result)
    } catch (error) {
      writeYamlFile(yamlFile, result)
    }
  } catch (error) {
    console.log(filePath)
    console.log(error)
    process.exit()
  }
}
