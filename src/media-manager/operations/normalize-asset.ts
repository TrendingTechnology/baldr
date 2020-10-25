import assert from 'assert'

import { deepCopy, msleep } from '@bldr/core-browser'
import { AssetType, MetaSpec } from '@bldr/type-definitions'
import wikidata  from '@bldr/wikidata'

import metaTypes from '../meta-types'
import { readAssetYaml, writeYamlFile } from '../main'

async function queryWikidata (metaData: AssetType.Generic, typeNames: MetaSpec.TypeNames, typeSpecs: MetaSpec.TypeCollection): Promise<AssetType.Generic> {
  const dataWiki = await wikidata.query(metaData.wikidata, typeNames, typeSpecs)
  console.log(dataWiki)
  metaData = wikidata.mergeData(metaData, dataWiki, typeSpecs)
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
export async function normalizeMediaAsset (filePath: string, options: NormalizeMediaAssetOption) {
  try {
    // Always: general
    const typeNames = metaTypes.detectTypeByPath(filePath)
    const yamlFile = `${filePath}.yml`
    let metaData = readAssetYaml(filePath)
    metaData.filePath = filePath
    const origData = <AssetType.Generic> deepCopy(metaData)

    metaData.metaTypes = metaTypes.mergeTypeNames(metaData.metaTypes, typeNames)
    if (options.wikidata) {
      if (metaData.wikidata && metaData.metaTypes) {
        metaData = await queryWikidata(metaData, metaData.metaTypes, metaTypes.typeSpecs)
      }
    }
    metaData = metaTypes.process(metaData)

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
